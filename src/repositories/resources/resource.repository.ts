import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { LISTED_RESOURCE_WHERE } from "@/lib/query/resourceFilters";

export interface FindPublicResourcesParams {
  page: number;
  pageSize: number;
  categorySlug?: string;
  tagSlug?: string;
  search?: string;
  isFree?: boolean;
}

export interface CreateAdminResourceRecordInput {
  title: string;
  slug: string;
  description: string;
  type: "PDF" | "DOCUMENT";
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFree: boolean;
  price: number;
  fileUrl: string | null;
  stripePriceId?: string | null;
  stripeProductId?: string | null;
  categoryId: string | null;
  featured: boolean;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  license?: "PERSONAL_USE" | "COMMERCIAL_USE" | "EXTENDED_LICENSE" | null;
  visibility?: "PUBLIC" | "UNLISTED" | null;
  authorId: string;
  tagIds: string[];
  previewUrls: string[];
  previewUrl: string | null;
}

export interface BulkAdminResourceRecordInput extends CreateAdminResourceRecordInput {
  row: number;
}

export interface UpdateAdminResourceRecordInput {
  title?: string;
  description?: string;
  slug?: string;
  type?: "PDF" | "DOCUMENT";
  status?: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  isFree: boolean;
  price: number;
  fileUrl?: string | null;
  categoryId?: string | null;
  featured?: boolean;
  level?: "BEGINNER" | "INTERMEDIATE" | "ADVANCED" | null;
  license?: "PERSONAL_USE" | "COMMERCIAL_USE" | "EXTENDED_LICENSE" | null;
  visibility?: "PUBLIC" | "UNLISTED" | null;
  authorId?: string;
  previewUrl?: string | null;
  tagIds?: string[];
  previewUrls?: string[];
}

const RESOURCE_LIST_INCLUDE = {
  id: true,
  title: true,
  slug: true,
  price: true,
  isFree: true,
  featured: true,
  createdAt: true,
  downloadCount: true,
  previewUrl: true,
  author: { select: { id: true, name: true, image: true } },
  category: { select: { id: true, name: true, slug: true } },
  previews: { orderBy: { order: "asc" as const }, select: { imageUrl: true } },
} as const;

const ADMIN_RESOURCE_LIST_INCLUDE = {
  author: { select: { id: true, name: true } },
  category: { select: { id: true, name: true } },
  _count: { select: { purchases: true } },
} as const;

const OWNED_RESOURCE_CREATE_INCLUDE = {
  author: { select: { id: true, name: true } },
  category: true,
  tags: { include: { tag: true } },
} as const;

const CREATOR_DASHBOARD_RESOURCE_SELECT = {
  id: true,
  title: true,
  slug: true,
  status: true,
  isFree: true,
  price: true,
  previewUrl: true,
  createdAt: true,
  updatedAt: true,
  previews: {
    take: 1,
    orderBy: { order: "asc" as const },
    select: { imageUrl: true },
  },
} as const;

export async function findPublicResources(params: FindPublicResourcesParams) {
  const { page, pageSize, categorySlug, tagSlug, search, isFree } = params;

  const categoryId = categorySlug
    ? (await findCategoryBySlug(categorySlug))?.id
    : undefined;

  if (categorySlug && !categoryId) {
    return { items: [], total: 0 };
  }

  const where = {
    ...LISTED_RESOURCE_WHERE,
    ...(categoryId && { categoryId }),
    ...(tagSlug && { tags: { some: { tag: { slug: tagSlug } } } }),
    ...(isFree !== undefined && { isFree }),
    ...(search && {
      OR: [
        { title: { contains: search, mode: "insensitive" as const } },
        { description: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [items, total] = await Promise.all([
    prisma.resource.findMany({
      where,
      select: RESOURCE_LIST_INCLUDE,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.resource.count({ where }),
  ]);

  return { items, total };
}

export async function findAdminActor(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true },
  });
}

export async function findAdminResources(authorId?: string) {
  return prisma.resource.findMany({
    where: {
      deletedAt: null,
      ...(authorId ? { authorId } : {}),
    },
    include: ADMIN_RESOURCE_LIST_INCLUDE,
    orderBy: { createdAt: "desc" },
  });
}

export async function findCreatorOwnedResources(authorId: string) {
  return prisma.resource.findMany({
    where: {
      authorId,
      deletedAt: null,
    },
    select: CREATOR_DASHBOARD_RESOURCE_SELECT,
    orderBy: [{ updatedAt: "desc" }, { createdAt: "desc" }],
  });
}

export async function findRecommendedResourcesExcludingIds(
  resourceIds: string[],
  take: number,
) {
  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      ...(resourceIds.length > 0 ? { id: { notIn: resourceIds } } : {}),
    },
    select: RESOURCE_LIST_INCLUDE,
    orderBy: [
      { resourceStat: { trendingScore: "desc" } },
      { resourceStat: { purchases: "desc" } },
      { resourceStat: { downloads: "desc" } },
      { createdAt: "desc" },
    ],
    take,
  });
}

export async function findNewResourcesInCategoryExcludingIds(
  categoryId: string,
  resourceIds: string[],
  take: number,
) {
  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      categoryId,
      ...(resourceIds.length > 0 ? { id: { notIn: resourceIds } } : {}),
    },
    select: RESOURCE_LIST_INCLUDE,
    orderBy: [
      { createdAt: "desc" },
      { resourceStat: { trendingScore: "desc" } },
      { resourceStat: { purchases: "desc" } },
    ],
    take,
  });
}

export async function findNewResourcesInCategoriesExcludingIds(
  categoryIds: string[],
  resourceIds: string[],
  take: number,
) {
  if (categoryIds.length === 0) {
    return [];
  }

  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      categoryId: { in: categoryIds },
      ...(resourceIds.length > 0 ? { id: { notIn: resourceIds } } : {}),
    },
    select: RESOURCE_LIST_INCLUDE,
    orderBy: [
      { createdAt: "desc" },
      { resourceStat: { trendingScore: "desc" } },
      { resourceStat: { purchases: "desc" } },
    ],
    take,
  });
}

export async function findTopTrendingInCategoriesExcludingIds(
  categoryIds: string[],
  resourceIds: string[],
  take: number,
) {
  if (categoryIds.length === 0) return [];

  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      categoryId: { in: categoryIds },
      ...(resourceIds.length > 0 ? { id: { notIn: resourceIds } } : {}),
    },
    select: RESOURCE_LIST_INCLUDE,
    orderBy: [
      { resourceStat: { trendingScore: "desc" } },
      { resourceStat: { purchases: "desc" } },
      { createdAt: "desc" },
    ],
    take,
  });
}

export async function findRecommendedResourcesByLevelsExcludingIds(
  levels: Array<"BEGINNER" | "INTERMEDIATE" | "ADVANCED">,
  resourceIds: string[],
  take: number,
) {
  if (levels.length === 0) {
    return [];
  }

  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      level: { in: levels },
      ...(resourceIds.length > 0 ? { id: { notIn: resourceIds } } : {}),
    },
    select: RESOURCE_LIST_INCLUDE,
    orderBy: [
      { resourceStat: { trendingScore: "desc" } },
      { resourceStat: { purchases: "desc" } },
      { resourceStat: { downloads: "desc" } },
      { createdAt: "desc" },
    ],
    take,
  });
}

export async function findResourceById(id: string) {
  return prisma.resource.findUnique({
    where: { id },
  });
}

/**
 * Minimal resource projection for post-purchase transactional email.
 * Fetches only the three fields the email template needs — avoids pulling
 * the full resource record (file keys, pricing, previews, etc.).
 */
export interface ResourceEmailContext {
  slug: string;
  title: string;
  authorName: string | null;
}

export async function findResourceEmailContext(
  resourceId: string,
): Promise<ResourceEmailContext | null> {
  const resource = await prisma.resource.findUnique({
    where: { id: resourceId },
    select: {
      slug: true,
      title: true,
      author: { select: { name: true } },
    },
  });

  if (!resource) return null;

  return {
    slug: resource.slug,
    title: resource.title,
    authorName: resource.author?.name ?? null,
  };
}

/**
 * Fetches a resource for download authorisation.
 *
 * Returns null (→ 404) for any of:
 *   - unknown resourceId
 *   - status !== PUBLISHED (DRAFT and ARCHIVED are not downloadable)
 *   - soft-deleted resources (deletedAt IS NOT NULL)
 *
 * Uses findFirst (not findUnique) so that the extra non-unique filters
 * (status, deletedAt) can be composed into the WHERE clause.  The result
 * is still deterministic because `id` is the primary key.
 */
export async function findDownloadableResourceById(id: string) {
  return prisma.resource.findFirst({
    where: { id, status: "PUBLISHED", deletedAt: null },
    select: {
      id: true,
      authorId: true,
      isFree: true,
      fileKey: true,
      fileUrl: true,
      fileName: true,
      mimeType: true,
    },
  });
}

export async function findResourceBySlug(slug: string) {
  return prisma.resource.findUnique({
    where: { slug },
  });
}

export async function setResourceStripePriceId(resourceId: string, stripePriceId: string) {
  return prisma.resource.update({
    where: { id: resourceId },
    data: { stripePriceId },
  });
}

export async function findCategoryBySlug(slug: string) {
  return prisma.category.findUnique({
    where: { slug },
    select: { id: true },
  });
}

export async function findTagBySlug(slug: string) {
  return prisma.tag.findUnique({
    where: { slug },
    select: { id: true },
  });
}

export async function createAdminResourceRecord(input: CreateAdminResourceRecordInput) {
  return prisma.resource.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      type: input.type,
      status: input.status,
      isFree: input.isFree,
      price: input.price,
      fileUrl: input.fileUrl,
      stripePriceId: input.stripePriceId ?? null,
      stripeProductId: input.stripeProductId ?? null,
      categoryId: input.categoryId,
      featured: input.featured,
      level: input.level ?? null,
      license: input.license ?? null,
      visibility: input.visibility ?? null,
      previewUrl: input.previewUrl,
      authorId: input.authorId,
      tags: {
        create: input.tagIds.map((tagId) => ({
          tag: { connect: { id: tagId } },
        })),
      },
      previews: {
        create: input.previewUrls.map((imageUrl, order) => ({
          imageUrl,
          order,
        })),
      },
    },
  });
}

export async function createOwnedResourceRecord(input: CreateAdminResourceRecordInput) {
  return prisma.resource.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: input.description,
      type: input.type,
      status: input.status,
      isFree: input.isFree,
      price: input.price,
      fileUrl: input.fileUrl,
      stripePriceId: input.stripePriceId ?? null,
      stripeProductId: input.stripeProductId ?? null,
      categoryId: input.categoryId,
      featured: input.featured,
      level: input.level ?? null,
      license: input.license ?? null,
      visibility: input.visibility ?? null,
      previewUrl: input.previewUrl,
      authorId: input.authorId,
      tags: input.tagIds.length
        ? {
            create: input.tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          }
        : undefined,
      previews: input.previewUrls.length
        ? {
            create: input.previewUrls.map((imageUrl, order) => ({
              imageUrl,
              order,
            })),
          }
        : undefined,
    },
    include: OWNED_RESOURCE_CREATE_INCLUDE,
  });
}

export async function deleteStaleDraftResources(cutoff: Date) {
  return prisma.resource.deleteMany({
    where: {
      title: "",
      description: "",
      fileUrl: null,
      fileKey: null,
      status: "DRAFT",
      createdAt: {
        lt: cutoff,
      },
    },
  });
}

export async function createDraftResourceRecord(input: {
  title: string;
  slug: string;
  authorId: string;
}) {
  return prisma.resource.create({
    data: {
      title: input.title,
      slug: input.slug,
      description: "",
      type: "PDF",
      status: "DRAFT",
      isFree: true,
      price: 0,
      fileUrl: null,
      categoryId: null,
      featured: false,
      authorId: input.authorId,
    },
    select: {
      id: true,
    },
  });
}

export async function createAdminResourcesBulk(items: BulkAdminResourceRecordInput[]) {
  const created: { row: number; title: string; id: string }[] = [];

  await prisma.$transaction(async (tx) => {
    for (const item of items) {
      const resource = await tx.resource.create({
        data: {
          title: item.title,
          slug: item.slug,
          description: item.description,
          type: item.type,
          status: item.status,
          isFree: item.isFree,
          price: item.price,
          fileUrl: item.fileUrl,
          categoryId: item.categoryId,
          featured: item.featured,
          previewUrl: item.previewUrl,
          authorId: item.authorId,
          tags: {
            create: item.tagIds.map((tagId) => ({
              tag: { connect: { id: tagId } },
            })),
          },
          previews: {
            create: item.previewUrls.map((imageUrl, order) => ({
              imageUrl,
              order,
            })),
          },
        },
      });

      created.push({ row: item.row, title: item.title, id: resource.id });
    }
  });

  return created;
}

export async function updateAdminResourceRecord(
  resourceId: string,
  input: UpdateAdminResourceRecordInput,
) {
  return prisma.$transaction(async (tx) => {
    const updated = await tx.resource.update({
      where: { id: resourceId },
      data: {
        ...(input.title !== undefined && { title: input.title }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.type !== undefined && { type: input.type }),
        ...(input.status !== undefined && { status: input.status }),
        isFree: input.isFree,
        price: input.price,
        ...(input.fileUrl !== undefined && { fileUrl: input.fileUrl }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId }),
        ...(input.featured !== undefined && { featured: input.featured }),
        ...(input.level !== undefined && { level: input.level }),
        ...(input.license !== undefined && { license: input.license }),
        ...(input.visibility !== undefined && { visibility: input.visibility }),
        ...(input.authorId !== undefined && { authorId: input.authorId }),
        ...(input.previewUrl !== undefined && { previewUrl: input.previewUrl }),
      },
    });

    if (input.tagIds !== undefined) {
      await tx.resourceTag.deleteMany({ where: { resourceId } });

      const uniqueTagIds = Array.from(new Set(input.tagIds));
      if (uniqueTagIds.length > 0) {
        await tx.resourceTag.createMany({
          data: uniqueTagIds.map((tagId) => ({
            resourceId,
            tagId,
          })),
        });
      }
    }

    if (input.previewUrls !== undefined) {
      await tx.resourcePreview.deleteMany({ where: { resourceId } });

      if (input.previewUrls.length > 0) {
        await tx.resourcePreview.createMany({
          data: input.previewUrls.map((imageUrl, order) => ({
            resourceId,
            imageUrl,
            order,
          })),
        });
      }
    }

    return updated;
  });
}

export async function softDeleteAdminResource(resourceId: string) {
  return prisma.resource.update({
    where: { id: resourceId },
    data: { deletedAt: new Date() },
  });
}

export async function softDeleteAdminResources(resourceIds: string[]) {
  return prisma.resource.updateMany({
    where: { id: { in: resourceIds } },
    data: { deletedAt: new Date() },
  });
}

export async function moveAdminResourcesToCategory(
  resourceIds: string[],
  categoryId: string,
) {
  return prisma.resource.updateMany({
    where: { id: { in: resourceIds } },
    data: { categoryId },
  });
}

export async function updateAdminResourceStatuses(
  resourceIds: string[],
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED",
) {
  return prisma.resource.updateMany({
    where: { id: { in: resourceIds } },
    data: { status },
  });
}

// ── Phase 2 recommendation candidates ────────────────────────────────────────

const PHASE2_CANDIDATE_SELECT = {
  id: true,
  title: true,
  slug: true,
  price: true,
  isFree: true,
  featured: true,
  downloadCount: true,
  createdAt: true,
  previewUrl: true,
  author: { select: { id: true, name: true, image: true } },
  category: { select: { id: true, name: true, slug: true } },
  previews: {
    take: 1,
    orderBy: { order: "asc" as const },
    select: { imageUrl: true },
  },
  tags: { select: { tag: { select: { id: true, slug: true } } } },
  resourceStat: { select: { trendingScore: true } },
} as const;

/**
 * Fetches candidate resources for Phase 2 personalized recommendations.
 * Matches resources in any of the given categories OR with any of the given tags.
 * Excludes provided IDs (owned + high-view-count resources).
 * Returns up to `limit` results pre-sorted by trendingScore descending.
 */
// ── Activation-weighted marketplace ranking ───────────────────────────────────

/**
 * Flat row returned by the activation-ranked raw SQL query.
 * Must be transformed by `toActivationRankedCardShape` in the service layer
 * before being piped through `withPreview` and `attachResourceTrustSignals`.
 */
export interface FindActivationRankedResourcesRow {
  id: string;
  title: string;
  slug: string;
  price: number;
  isFree: boolean;
  featured: boolean;
  downloadCount: number;
  createdAt: Date;
  authorName: string | null;
  categoryId: string | null;
  categoryName: string | null;
  categorySlug: string | null;
  previewImageUrl: string | null;
}

export interface FindActivationRankedResourcesParams {
  categoryId?: string;
  tagSlug?: string;
  search?: string;
  isFree?: boolean;
  featured?: boolean;
  page: number;
  pageSize: number;
}

/**
 * Fetches marketplace resources ordered by an activation-weighted score:
 *
 *   score = ln(purchases + 1) × 0.6
 *         + ((firstPaidDownloads + 3) / (purchases + 6)) × 0.3   ← Laplace-smoothed activation rate
 *         + recencyBoost × 0.1                                    ← 1.0 if last FIRST_PAID_DOWNLOAD < 7 days ago, then 7/daysSince, floor 0.05; 0.05 if no activations
 *
 * Returns flat rows that must be transformed by `toActivationRankedCardShape`
 * in the service layer before being passed to `withPreview` and
 * `attachResourceTrustSignals`.
 */
export async function findActivationRankedResources(
  params: FindActivationRankedResourcesParams,
): Promise<{ rows: FindActivationRankedResourcesRow[]; total: number }> {
  const { page, pageSize, categoryId, tagSlug, search, isFree, featured } = params;
  const skip = (page - 1) * pageSize;

  const conditions: Prisma.Sql[] = [];

  if (categoryId) {
    conditions.push(Prisma.sql`AND r."categoryId" = ${categoryId}`);
  }

  if (tagSlug) {
    conditions.push(Prisma.sql`AND EXISTS (
        SELECT 1 FROM "ResourceTag" rt
        INNER JOIN "Tag" t ON t."id" = rt."tagId"
        WHERE rt."resourceId" = r."id"
          AND t."slug" = ${tagSlug}
      )`);
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      Prisma.sql`AND (r."title" ILIKE ${pattern} OR r."description" ILIKE ${pattern})`,
    );
  }

  if (isFree !== undefined) {
    conditions.push(Prisma.sql`AND r."isFree" = ${isFree}`);
  }

  if (featured) {
    conditions.push(Prisma.sql`AND r."featured" = TRUE`);
  }

  const extraWhere =
    conditions.length > 0 ? Prisma.join(conditions, "\n        ") : Prisma.empty;

  const [rows, countRows] = await Promise.all([
    prisma.$queryRaw<FindActivationRankedResourcesRow[]>(Prisma.sql`
      SELECT
        r."id",
        r."title",
        r."slug",
        r."price",
        r."isFree",
        r."featured",
        r."downloadCount",
        r."createdAt",
        u."name"     AS "authorName",
        c."id"       AS "categoryId",
        c."name"     AS "categoryName",
        c."slug"     AS "categorySlug",
        p."imageUrl" AS "previewImageUrl"
      FROM "Resource" r
      LEFT JOIN "User" u ON u."id" = r."authorId"
      LEFT JOIN "Category" c ON c."id" = r."categoryId"
      LEFT JOIN LATERAL (
        SELECT "imageUrl"
        FROM   "ResourcePreview"
        WHERE  "resourceId" = r."id"
        ORDER BY "order" ASC
        LIMIT  1
      ) p ON TRUE
      LEFT JOIN "resource_stats" rs ON rs."resourceId" = r."id"
      LEFT JOIN LATERAL (
        SELECT
          COUNT(*)::int    AS fpd_count,
          MAX("createdAt") AS last_activation_at
        FROM   "ActivityLog"
        WHERE  "action"   = 'FIRST_PAID_DOWNLOAD'
          AND  "entity"   = 'Resource'
          AND  "entityId" = r."id"
      ) fpd ON TRUE
      WHERE r."status"    = 'PUBLISHED'
        AND r."deletedAt" IS NULL
        AND (r."visibility" IS NULL OR r."visibility" = 'PUBLIC')
        ${extraWhere}
      ORDER BY (
        LN(COALESCE(rs."purchases", 0) + 1) * 0.6
        + ((COALESCE(fpd.fpd_count, 0)::float + 3.0) / (COALESCE(rs."purchases", 0)::float + 6.0)) * 0.3
        + GREATEST(0.05, CASE
            WHEN fpd.last_activation_at IS NOT NULL
              AND EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0 < 7.0
              THEN 1.0
            WHEN fpd.last_activation_at IS NOT NULL
              THEN 7.0 / (EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0)
            ELSE 0.05
          END) * 0.1
      ) DESC NULLS LAST
      LIMIT  ${pageSize}
      OFFSET ${skip}
    `),

    prisma.$queryRaw<[{ count: number }]>(Prisma.sql`
      SELECT COUNT(*)::int AS count
      FROM "Resource" r
      WHERE r."status"    = 'PUBLISHED'
        AND r."deletedAt" IS NULL
        AND (r."visibility" IS NULL OR r."visibility" = 'PUBLIC')
        ${extraWhere}
    `),
  ]);

  const total = countRows[0]?.count ?? 0;

  return { rows, total };
}

// ── Ranking debug / observability ─────────────────────────────────────────────

/**
 * Full score-breakdown row for the admin ranking debug view.
 * Contains every intermediate value used in the composite score so that
 * each resource's rank position is fully explainable from a single row.
 *
 * This type is intentionally separate from `FindActivationRankedResourcesRow`
 * — production queries never carry these extra columns.
 */
export interface RankingDebugRow {
  id: string;
  title: string;
  slug: string;
  categoryName: string | null;
  categorySlug: string | null;
  /** Pre-aggregated purchase count from `resource_stats`. */
  purchases: number;
  /** Count of FIRST_PAID_DOWNLOAD ActivityLog events for this resource. */
  fpdCount: number;
  /**
   * Laplace-smoothed activation rate: (fpdCount + 3) / (purchases + 6).
   * A resource with zero data gets 0.500 (neutral), not 0 or 1.
   */
  adjActivationRate: number;
  /**
   * Recency component (0.05–1).
   * 1.0 when the last FIRST_PAID_DOWNLOAD was < 7 days ago.
   * Decays as 7 / daysSince for older activations, floored at 0.05.
   * 0.05 when the resource has no activations at all.
   */
  recencyBoost: number;
  /**
   * Final composite score used to order the "recommended" sort:
   *   ln(purchases + 1) × 0.6
   *   + adjActivationRate × 0.3
   *   + recencyBoost × 0.1
   */
  score: number;
}

export interface FindRankingDebugRowsParams {
  categoryId?: string;
  search?: string;
  isFree?: boolean;
  /** Maximum rows to return. Defaults to 50 for the debug view. */
  limit?: number;
}

/**
 * Returns resources ranked by the activation-weighted score, with every
 * intermediate score component exposed as a named column.
 *
 * Used exclusively by the admin ranking debug page.
 * Never called from production marketplace paths.
 */
export async function findRankingDebugRows(
  params: FindRankingDebugRowsParams,
): Promise<RankingDebugRow[]> {
  const { categoryId, search, isFree, limit = 50 } = params;

  const conditions: Prisma.Sql[] = [];

  if (categoryId) {
    conditions.push(Prisma.sql`AND r."categoryId" = ${categoryId}`);
  }

  if (search) {
    const pattern = `%${search}%`;
    conditions.push(
      Prisma.sql`AND (r."title" ILIKE ${pattern} OR r."description" ILIKE ${pattern})`,
    );
  }

  if (isFree !== undefined) {
    conditions.push(Prisma.sql`AND r."isFree" = ${isFree}`);
  }

  const extraWhere =
    conditions.length > 0 ? Prisma.join(conditions, "\n        ") : Prisma.empty;

  return prisma.$queryRaw<RankingDebugRow[]>(Prisma.sql`
    SELECT
      r."id",
      r."title",
      r."slug",
      c."name"  AS "categoryName",
      c."slug"  AS "categorySlug",

      -- Raw signal counts
      COALESCE(rs."purchases", 0)::int          AS "purchases",
      COALESCE(fpd.fpd_count,  0)::int          AS "fpdCount",

      -- Laplace-smoothed activation rate: (fpd + 3) / (purchases + 6)
      ROUND(
        ((COALESCE(fpd.fpd_count, 0)::numeric + 3.0)
          / (COALESCE(rs."purchases", 0)::numeric + 6.0))::numeric,
        4
      )::float AS "adjActivationRate",

      -- Recency boost: 1.0 if last activation < 7 days ago, then 7/daysSince, floor 0.05
      ROUND(
        GREATEST(0.05, CASE
          WHEN fpd.last_activation_at IS NOT NULL
            AND EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0 < 7.0
            THEN 1.0
          WHEN fpd.last_activation_at IS NOT NULL
            THEN 7.0 / (EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0)
          ELSE 0.05
        END)::numeric,
        4
      )::float AS "recencyBoost",

      -- Final composite score
      ROUND(
        (
          LN(COALESCE(rs."purchases", 0)::numeric + 1) * 0.6
          + ((COALESCE(fpd.fpd_count, 0)::numeric + 3.0)
              / (COALESCE(rs."purchases", 0)::numeric + 6.0)) * 0.3
          + GREATEST(0.05, CASE
              WHEN fpd.last_activation_at IS NOT NULL
                AND EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0 < 7.0
                THEN 1.0
              WHEN fpd.last_activation_at IS NOT NULL
                THEN 7.0 / (EXTRACT(EPOCH FROM (NOW() - fpd.last_activation_at)) / 86400.0)
              ELSE 0.05
            END) * 0.1
        )::numeric,
        4
      )::float AS "score"

    FROM "Resource" r
    LEFT JOIN "Category" c ON c."id" = r."categoryId"
    LEFT JOIN "resource_stats" rs ON rs."resourceId" = r."id"
    LEFT JOIN LATERAL (
      SELECT
        COUNT(*)::int    AS fpd_count,
        MAX("createdAt") AS last_activation_at
      FROM   "ActivityLog"
      WHERE  "action"   = 'FIRST_PAID_DOWNLOAD'
        AND  "entity"   = 'Resource'
        AND  "entityId" = r."id"
    ) fpd ON TRUE

    WHERE r."status"    = 'PUBLISHED'
      AND r."deletedAt" IS NULL
      AND (r."visibility" IS NULL OR r."visibility" = 'PUBLIC')
      ${extraWhere}

    ORDER BY "score" DESC NULLS LAST
    LIMIT ${limit}
  `);
}

export async function findPhase2CandidateResources(
  categoryIds: string[],
  tagIds: string[],
  excludeIds: string[],
  limit: number,
) {
  if (categoryIds.length === 0 && tagIds.length === 0) return [];

  return prisma.resource.findMany({
    where: {
      ...LISTED_RESOURCE_WHERE,
      ...(excludeIds.length > 0 ? { id: { notIn: excludeIds } } : {}),
      OR: [
        ...(categoryIds.length > 0 ? [{ categoryId: { in: categoryIds } }] : []),
        ...(tagIds.length > 0
          ? [{ tags: { some: { tagId: { in: tagIds } } } }]
          : []),
      ],
    },
    select: PHASE2_CANDIDATE_SELECT,
    orderBy: [
      { resourceStat: { trendingScore: "desc" } },
      { createdAt: "desc" },
    ],
    take: limit,
  });
}
