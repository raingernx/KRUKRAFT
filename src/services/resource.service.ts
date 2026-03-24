/**
 * Resource Service
 *
 * Centralises Prisma queries that read Resource rows so that page components
 * and API routes stay free of raw DB logic.
 *
 * All public-facing functions apply LISTED_RESOURCE_WHERE automatically so
 * draft / archived / soft-deleted resources are never accidentally exposed.
 *
 * Discover-section queries live in `discover.service.ts` which uses the lean
 * RESOURCE_CARD_SELECT projection for maximum query efficiency.
 */

import type { Prisma } from "@prisma/client";
import { unstable_cache } from "next/cache";
import { CACHE_TAGS, CACHE_TTLS, getResourceCacheTag } from "@/lib/cache";
import { logPerformanceEvent } from "@/lib/performance/observability";
import {
  countMarketplaceResources,
  findActivationRankedResources,
  findCategoriesOrderedByName,
  findCategoryBySlug,
  findMarketplaceResourceCards,
  findPublicResourceDetailBySlug,
  findRelatedListedResources,
  type FindActivationRankedResourcesRow,
} from "@/repositories/resources/resource.repository";
import { withPreview } from "@/services/discover.service";
import { attachResourceTrustSignals } from "@/services/review.service";

// ── Re-export withPreview for callers that used the old import path ────────────
export { withPreview };

// ── Standard include fragment (for detail pages that need all relations) ───────

/**
 * Full include used when ALL resource relations are needed (detail pages,
 * admin views, API routes).  For lightweight card lists, use
 * `RESOURCE_CARD_SELECT` / `RESOURCE_CARD_WITH_TAGS_SELECT` instead.
 */
export const RESOURCE_CARD_INCLUDE = {
  author:   { select: { id: true, name: true, image: true } },
  category: { select: { id: true, name: true, slug: true } },
  tags:     { include: { tag: { select: { name: true, slug: true } } } },
  previews: { orderBy: { order: "asc" as const }, select: { imageUrl: true } },
  _count:   { select: { purchases: true, reviews: true } },
} as const;

// ── Activation ranking transform ──────────────────────────────────────────────

/**
 * Transforms a flat raw-SQL activation-ranked row into the nested shape that
 * `withPreview` and `attachResourceTrustSignals` expect — identical to what
 * Prisma returns when using `RESOURCE_CARD_SELECT`.
 */
function toActivationRankedCardShape(row: FindActivationRankedResourcesRow) {
  return {
    id:            row.id,
    title:         row.title,
    slug:          row.slug,
    price:         row.price,
    isFree:        row.isFree,
    featured:      row.featured,
    downloadCount: row.downloadCount,
    createdAt:     row.createdAt,
    author:   { name: row.authorName ?? null },
    category: row.categoryId !== null
      ? { id: row.categoryId, name: row.categoryName ?? "", slug: row.categorySlug ?? "" }
      : null,
    previews: row.previewImageUrl ? [{ imageUrl: row.previewImageUrl }] : [],
  };
}

// ── Filtered marketplace listing ──────────────────────────────────────────────

export interface MarketplaceFilters {
  search?:   string;
  category?: string;
  price?:    string;
  featured?: boolean;
  tag?:      string;
  sort?:     string;
  page?:     number;
  pageSize?: number;
}

/** Builds a Prisma `orderBy` clause from a sort key string.
 *
 * Canonical values (from SORT_OPTIONS in src/config/sortOptions.ts):
 *   trending | newest | downloads | price_asc | price_desc
 *
 * Legacy values kept as silent fallbacks so that old bookmarked URLs
 * continue to resolve sensibly:
 *   popular → same as downloads
 *   oldest / featured → internal admin use only, not shown in the UI
 */
export function buildOrderBy(sort: string) {
  switch (sort) {
    case "downloads":
    case "popular":
      return [
        { resourceStat: { downloads: "desc" } },
        { resourceStat: { purchases: "desc" } },
        { resourceStat: { trendingScore: "desc" } },
        { createdAt: "desc" },
      ] as const;
    case "price_asc":  return { price: "asc" }          as const;
    case "price_desc": return { price: "desc" }         as const;
    case "trending":
      return [
        { resourceStat: { trendingScore: "desc" } },
        { resourceStat: { purchases: "desc" } },
        { resourceStat: { downloads: "desc" } },
        { createdAt: "desc" },
      ] as const;
    // Internal / legacy — not exposed in the public sort UI
    case "oldest":     return { createdAt: "asc" }      as const;
    case "featured":
      return [
        { featured: "desc" },
        { resourceStat: { trendingScore: "desc" } },
        { createdAt: "desc" },
      ] as const;
    case "newest":
    default:           return { createdAt: "desc" }     as const;
  }
}

/**
 * Returns a paginated list of published resources matching the supplied
 * filters, together with the full category list for the filter sidebar.
 */
async function loadMarketplaceResources(filters: MarketplaceFilters) {
  const {
    search,
    category,
    price,
    featured,
    tag,
    sort     = "recommended",
    page     = 1,
    pageSize = 20,
  } = filters;

  const trimmedSearch   = search?.trim();
  const trimmedCategory = category?.trim();
  const trimmedTag      = tag?.trim();

  const searchWhere = trimmedSearch
    ? {
        OR: [
          { title:       { contains: trimmedSearch, mode: "insensitive" as const } },
          { description: { contains: trimmedSearch, mode: "insensitive" as const } },
        ],
      }
    : {};

  const categoryId =
    trimmedCategory && trimmedCategory !== "all"
      ? (await findCategoryBySlug(trimmedCategory))?.id
      : undefined;

  if (trimmedCategory && trimmedCategory !== "all" && !categoryId) {
    const categories = await findCategoriesOrderedByName();

    return {
      resources: [],
      total: 0,
      totalPages: 1,
      categories,
    };
  }

  // ── Activation-weighted "recommended" sort ─────────────────────────────────
  if (sort === "recommended") {
    const isFreeFilter =
      price === "free" ? true : price === "paid" ? false : undefined;

    const [{ rows, total }, categories] = await Promise.all([
      findActivationRankedResources({
        categoryId,
        tagSlug:  trimmedTag,
        search:   trimmedSearch,
        isFree:   isFreeFilter,
        featured: featured || undefined,
        page,
        pageSize,
      }),
      findCategoriesOrderedByName(),
    ]);

    const resources = await attachResourceTrustSignals(
      rows.map((row) => withPreview(toActivationRankedCardShape(row))),
    );

    return {
      resources,
      total,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
      categories,
    };
  }
  // ── All other sort values use the standard Prisma path ─────────────────────

  const categoryWhere = categoryId ? { categoryId } : {};

  const priceWhere =
    price === "free" ? { isFree: true } : price === "paid" ? { isFree: false } : {};

  const featuredWhere = featured ? { featured: true } : {};

  const tagWhere = trimmedTag
    ? { tags: { some: { tag: { slug: trimmedTag } } } }
    : {};

  const where = {
    status: "PUBLISHED" as const,
    deletedAt: null,
    ...searchWhere,
    ...categoryWhere,
    ...priceWhere,
    ...featuredWhere,
    ...tagWhere,
  };

  const skip = (page - 1) * pageSize;
  const orderBy = buildOrderBy(sort) as Prisma.ResourceFindManyArgs["orderBy"];

  const [rawItems, total, categories] = await Promise.all([
    findMarketplaceResourceCards({
      where,
      orderBy,
      skip,
      take: pageSize,
    }),
    countMarketplaceResources(where),
    findCategoriesOrderedByName(),
  ]);

  const resources = await attachResourceTrustSignals(rawItems.map(withPreview));

  return {
    resources,
    total,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    categories,
  };
}

export const getMarketplaceResources = unstable_cache(
  async function _getMarketplaceResources(filters: MarketplaceFilters) {
    logPerformanceEvent("cache_execute:getMarketplaceResources", {
      category: filters.category ?? "all",
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 12,
      sort: filters.sort ?? "default",
    });
    return loadMarketplaceResources(filters);
  },
  ["marketplace-resources"],
  {
    revalidate: CACHE_TTLS.publicPage,
    tags: [CACHE_TAGS.discover],
  },
);

// ── Single resource detail ────────────────────────────────────────────────────

/** Returns a fully-hydrated Resource row by slug, or null if not found. */
export async function getResourceBySlug(slug: string) {
  return findPublicResourceDetailBySlug(slug);
}

/** Returns related resources in the same category (excludes the current resource). */
export async function getRelatedResources(categoryId: string, excludeId: string, take = 4) {
  const raw = await findRelatedListedResources(categoryId, excludeId, take);

  return attachResourceTrustSignals(raw.map(withPreview));
}

export async function getPublicResourcePageData(slug: string) {
  return unstable_cache(
    async function _getPublicResourcePageData() {
      logPerformanceEvent("cache_execute:getPublicResourcePageData", {
        slug,
      });
      const resource = await getResourceBySlug(slug);

      if (!resource || resource.status !== "PUBLISHED") {
        return {
          resource: null,
          relatedResources: [],
        };
      }

      const relatedResources = resource.categoryId
        ? await getRelatedResources(resource.categoryId, resource.id, 4)
        : [];

      return {
        resource,
        relatedResources,
      };
    },
    ["public-resource-page", slug],
    {
      revalidate: CACHE_TTLS.publicPage,
      tags: [CACHE_TAGS.discover, getResourceCacheTag(slug)],
    },
  )();
}
