/**
 * Discover Service
 *
 * Owns every query the Discover home page needs.
 * Using Prisma `select` (via RESOURCE_CARD_SELECT) instead of `include` so
 * Postgres never sends columns the card UI doesn't render.
 *
 * This is the canonical discover data layer.  The page component should
 * import from here and contain no database logic of its own.
 */

import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";
import { calculateTrendingScore } from "@/analytics/aggregation.service";
import { runBestEffortAsync, runWithConcurrencyLimit } from "@/lib/async";
import {
  CACHE_KEYS,
  CACHE_TTLS,
  rememberJson,
  runSingleFlight,
} from "@/lib/cache";
import {
  logPerformanceEvent,
  recordCacheCall,
  recordCacheMiss,
  traceServerStep,
} from "@/lib/performance/observability";
import {
  findDiscoverCategoriesWithCounts,
  findDiscoverFallbackResourceIds,
  findDiscoverResourcesByIds,
} from "@/repositories/resources/resource.repository";
import {
  findFeaturedResourceIds,
  findFreeResourceIds,
  findNewestResourceIds,
  findTopCreatorThisWeek,
  findTopDownloadedResourceIds,
  findTrendingResourceSignals,
  findTopTrendingResourceIds,
} from "@/repositories/analytics/analytics.repository";

const DAY_MS = 86_400_000;
const TRENDING_WINDOW_DAYS = 30;
const DISCOVER_LEAD_DATA_SINGLE_FLIGHT_KEY = "discover-lead-data:refresh";
const DISCOVER_COLLECTIONS_DATA_SINGLE_FLIGHT_KEY = "discover-collections-data:refresh";
const DISCOVER_FREE_RESOURCES_SINGLE_FLIGHT_KEY = "discover-free-resources:refresh";
const DISCOVER_SECTION_SOURCE_LIMIT = 6;
const DISCOVER_SECTION_DISPLAY_LIMIT = 4;
const DISCOVER_SECTION_SOURCE_CONCURRENCY = 1;

type DiscoverResourceRow = Awaited<ReturnType<typeof findDiscoverResourcesByIds>>[number];
type DiscoverResource = DiscoverResourceRow & { previewUrl: string | null };
type DiscoverTopCreator = Awaited<ReturnType<typeof findTopCreatorThisWeek>> | null;

export type DiscoverLeadData = {
  trending: DiscoverResource[];
  recommended: DiscoverResource[];
};

export type DiscoverCollectionsData = {
  newReleases: DiscoverResource[];
  featured: DiscoverResource[];
  mostDownloaded: DiscoverResource[];
  topCreator: DiscoverTopCreator;
};

export type DiscoverSupplementalData = {
  freeResources: DiscoverResource[];
};

export type DiscoverData = DiscoverLeadData &
  DiscoverCollectionsData &
  DiscoverSupplementalData;

function isDiscoverPoolPressureError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code === "P2024" || error.code === "P1017";
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Timed out fetching a new connection from the connection pool") ||
    message.includes("Server has closed the connection") ||
    message.includes("Can't reach database server") ||
    message.includes("connection closed") ||
    message.includes("Error in PostgreSQL connection") ||
    message.includes("kind: Closed")
  );
}

function getEmptyDiscoverLeadData(): DiscoverLeadData {
  return {
    trending: [],
    recommended: [],
  };
}

function getEmptyDiscoverCollectionsData(): DiscoverCollectionsData {
  return {
    newReleases: [],
    featured: [],
    mostDownloaded: [],
    topCreator: null,
  };
}

function getEmptyDiscoverSupplementalData(): DiscoverSupplementalData {
  return {
    freeResources: [],
  };
}

function getEmptyDiscoverData(): DiscoverData {
  return {
    ...getEmptyDiscoverLeadData(),
    ...getEmptyDiscoverCollectionsData(),
    ...getEmptyDiscoverSupplementalData(),
  };
}

async function resolveDiscoverFallbackIds(
  existingIds: string[],
  limit: number,
  orderBy: Prisma.ResourceFindManyArgs["orderBy"],
  where?: Prisma.ResourceFindManyArgs["where"],
) {
  if (existingIds.length > 0) {
    return existingIds;
  }

  return findDiscoverFallbackResourceIds(limit, orderBy, where);
}

async function getDiscoverSectionIds(options: {
  cacheKey: string;
  limit: number;
  metricName: string;
  primaryLoader: () => Promise<string[]>;
  fallbackOrderBy: Prisma.ResourceFindManyArgs["orderBy"];
  fallbackWhere?: Prisma.ResourceFindManyArgs["where"];
}) {
  const {
    cacheKey,
    limit,
    metricName,
    primaryLoader,
    fallbackOrderBy,
    fallbackWhere,
  } = options;

  return rememberJson<string[]>(
    `${cacheKey}:${limit}`,
    CACHE_TTLS.homepageList,
    async () => {
      try {
        const ids = await primaryLoader();
        return resolveDiscoverFallbackIds(
          ids,
          limit,
          fallbackOrderBy,
          fallbackWhere,
        );
      } catch (error) {
        if (!isDiscoverPoolPressureError(error)) {
          throw error;
        }

        // When the pool is already saturated, do not spend more connections on
        // "fallback" DB queries for best-effort discover sections. Let the
        // outer discover loader return an uncached empty payload for this
        // request and preserve the last-good cache entry instead.
        throw error;
      }
    },
    {
      metricName,
      details: { limit },
    },
  );
}

async function getTopCreatorForDiscover() {
  return rememberJson(
    CACHE_KEYS.topCreator,
    CACHE_TTLS.homepageList,
    () =>
      runBestEffortAsync(() => findTopCreatorThisWeek(), {
        fallback: null,
        warningLabel: "[DISCOVER_TOP_CREATOR_BEST_EFFORT]",
      }),
    { metricName: "discover.topCreator" },
  );
}

function mapDiscoverSection(
  ids: string[],
  pool: Map<string, DiscoverResource>,
  limit = DISCOVER_SECTION_DISPLAY_LIMIT,
) {
  return ids
    .map((id) => pool.get(id))
    .filter((resource): resource is DiscoverResource => Boolean(resource))
    .slice(0, limit);
}

// ── Preview normaliser ────────────────────────────────────────────────────────

/**
 * Promotes `previews[0].imageUrl` into a top-level `previewUrl` field so that
 * card components can read a single consistent property regardless of whether
 * the result came from the `previewUrl` DB column or the `previews` relation.
 *
 * When `RESOURCE_CARD_SELECT` is used (column not selected), `r.previewUrl` is
 * absent — the chain falls back to the relation value automatically.
 * When older `include`-based queries return the column, it takes priority.
 */
export function withPreview<
  T extends { previewUrl?: string | null; previews?: { imageUrl: string }[] }
>(r: T): T & { previewUrl: string | null } {
  return {
    ...r,
    previewUrl: r.previewUrl ?? r.previews?.[0]?.imageUrl ?? null,
  };
}

async function getTrendingResourceIds(limit = 8) {
  return rememberJson<string[]>(
    `${CACHE_KEYS.trendingResources}:${limit}`,
    CACHE_TTLS.homepageList,
    async () => {
      return traceServerStep(
        "discover.getTrendingResourceIds",
        async () => {
          const since = new Date(Date.now() - DAY_MS * TRENDING_WINDOW_DAYS);
          const candidates = await traceServerStep(
            "discover.findTrendingResourceSignals",
            () => findTrendingResourceSignals(since, Math.max(limit * 4, 24)),
            { candidateLimit: Math.max(limit * 4, 24) },
          );

          if (candidates.length === 0) {
            return traceServerStep(
              "discover.findTopTrendingResourceIdsFallback",
              () => findTopTrendingResourceIds(limit),
              { limit },
            );
          }

          return candidates
            .map((candidate) => ({
              resourceId: candidate.resourceId,
              trendScore: calculateTrendingScore({
                recentDownloads: candidate.recentDownloads,
                recentSales: candidate.recentSales,
                recentRevenue: candidate.recentRevenue,
                averageRating: candidate.averageRating,
                reviewCount: candidate.reviewCount,
                ageInDays: Math.max(
                  0,
                  (Date.now() - candidate.publishedAt.getTime()) / DAY_MS,
                ),
              }),
            }))
            .sort((left, right) => right.trendScore - left.trendScore)
            .slice(0, limit)
            .map((row) => row.resourceId);
        },
        { limit },
      );
    },
    {
      metricName: "discover.trendingResourceIds",
      details: { limit },
    },
  );
}

export async function getTrendingResources(limit = 8) {
  const rankedIds = await getTrendingResourceIds(limit);
  const pool = await loadDiscoverResourcesByIds(rankedIds);

  return rankedIds
    .map((id) => pool.get(id))
    .filter((resource): resource is NonNullable<typeof resource> => Boolean(resource))
    .map(withPreview);
}

// ── Discover sections ─────────────────────────────────────────────────────────

type DiscoverSectionSources = {
  trendingIds: string[];
  popularIds: string[];
  newestIds: string[];
  featuredIds: string[];
  freeIds: string[];
  topCreator: Awaited<ReturnType<typeof getTopCreatorForDiscover>>;
};

/**
 * Fetches and returns the six curated sections shown on the Discover home.
 *
 * Wrapped with `unstable_cache` so the discover source queries only hit
 * the database once every CACHE_TTLS.homepageList seconds across all
 * concurrent requests.
 * Immediately invalidated via `revalidateTag("discover")` whenever an admin
 * creates, updates, or archives a resource.
 *
 * The function has no request-scoped dependencies (no session, no params),
 * which is what makes the `unstable_cache` wrapper safe and effective.
 */
const readDiscoverLeadData = unstable_cache(
  async function _getDiscoverLeadData() {
    recordCacheMiss("getDiscoverLeadData");
    logPerformanceEvent("cache_execute:getDiscoverLeadData");
    return rememberJson(
      CACHE_KEYS.discoverLeadData,
      CACHE_TTLS.homepageList,
      () =>
        runSingleFlight(DISCOVER_LEAD_DATA_SINGLE_FLIGHT_KEY, async () => {
          const trendingIds = await traceServerStep(
            "discover.loadLeadSources",
            () => getTrendingResourceIds(DISCOVER_SECTION_SOURCE_LIMIT),
            { sectionLimit: DISCOVER_SECTION_SOURCE_LIMIT },
          );

          const pool = await traceServerStep(
            "discover.loadLeadResourcePool",
            () => loadDiscoverResourcesByIds(trendingIds),
            { resourceCount: trendingIds.length },
          );

          const trending = mapDiscoverSection(trendingIds, pool);

          return {
            trending,
            recommended: [...trending],
          };
        }),
      { metricName: "discover.leadData" },
    );
  },
  ["discover-lead-data"],
  { revalidate: CACHE_TTLS.homepageList, tags: ["discover"] }
);

export async function getDiscoverLeadData() {
  recordCacheCall("getDiscoverLeadData");
  try {
    return await readDiscoverLeadData();
  } catch (error) {
    if (!isDiscoverPoolPressureError(error)) throw error;
    console.warn("[DISCOVER_LEAD_DATA_BEST_EFFORT]", error);
    return getEmptyDiscoverLeadData();
  }
}

const readDiscoverCollectionsData = unstable_cache(
  async function _getDiscoverCollectionsData() {
    recordCacheMiss("getDiscoverCollectionsData");
    logPerformanceEvent("cache_execute:getDiscoverCollectionsData");
    return rememberJson(
      CACHE_KEYS.discoverCollectionsData,
      CACHE_TTLS.homepageList,
      () =>
        runSingleFlight(DISCOVER_COLLECTIONS_DATA_SINGLE_FLIGHT_KEY, async () => {
          const { popularIds, newestIds, featuredIds, topCreator } =
            await traceServerStep(
              "discover.loadCollectionsSources",
              async () => {
                const sectionSourceEntries = await runWithConcurrencyLimit(
                  [
                    {
                      key: "popularIds" as const,
                      load: () =>
                        getDiscoverSectionIds({
                          cacheKey: CACHE_KEYS.popularResources,
                          limit: DISCOVER_SECTION_SOURCE_LIMIT,
                          metricName: "discover.popularResources",
                          primaryLoader: () =>
                            findTopDownloadedResourceIds(DISCOVER_SECTION_SOURCE_LIMIT),
                          fallbackOrderBy: [
                            { downloadCount: "desc" },
                            { createdAt: "desc" },
                          ],
                        }),
                    },
                    {
                      key: "newestIds" as const,
                      load: () =>
                        getDiscoverSectionIds({
                          cacheKey: CACHE_KEYS.newestResources,
                          limit: DISCOVER_SECTION_SOURCE_LIMIT,
                          metricName: "discover.newestResources",
                          primaryLoader: () =>
                            findNewestResourceIds(DISCOVER_SECTION_SOURCE_LIMIT),
                          fallbackOrderBy: { createdAt: "desc" },
                        }),
                    },
                    {
                      key: "featuredIds" as const,
                      load: () =>
                        getDiscoverSectionIds({
                          cacheKey: CACHE_KEYS.featuredResources,
                          limit: DISCOVER_SECTION_SOURCE_LIMIT,
                          metricName: "discover.featuredResources",
                          primaryLoader: () =>
                            findFeaturedResourceIds(DISCOVER_SECTION_SOURCE_LIMIT),
                          fallbackOrderBy: [
                            { downloadCount: "desc" },
                            { createdAt: "desc" },
                          ],
                          fallbackWhere: { featured: true },
                        }),
                    },
                    {
                      key: "topCreator" as const,
                      load: () => getTopCreatorForDiscover(),
                    },
                  ],
                  DISCOVER_SECTION_SOURCE_CONCURRENCY,
                  async (entry) => ({
                    key: entry.key,
                    value: await entry.load(),
                  }),
                );

                return Object.fromEntries(
                  sectionSourceEntries.map(({ key, value }) => [key, value]),
                ) as Pick<
                  DiscoverSectionSources,
                  "popularIds" | "newestIds" | "featuredIds" | "topCreator"
                >;
              },
              {
                sectionLimit: DISCOVER_SECTION_SOURCE_LIMIT,
                sectionConcurrency: DISCOVER_SECTION_SOURCE_CONCURRENCY,
              },
            );

          const resourceIds = Array.from(
            new Set([...popularIds, ...newestIds, ...featuredIds]),
          );

          const pool = await traceServerStep(
            "discover.loadCollectionsResourcePool",
            () => loadDiscoverResourcesByIds(resourceIds),
            { resourceCount: resourceIds.length },
          );

          return {
            newReleases: mapDiscoverSection(newestIds, pool),
            featured: mapDiscoverSection(featuredIds, pool),
            mostDownloaded: mapDiscoverSection(popularIds, pool),
            topCreator,
          };
        }),
      { metricName: "discover.collectionsData" },
    );
  },
  ["discover-collections-data"],
  { revalidate: CACHE_TTLS.homepageList, tags: ["discover"] }
);

export async function getDiscoverCollectionsData() {
  recordCacheCall("getDiscoverCollectionsData");
  try {
    return await readDiscoverCollectionsData();
  } catch (error) {
    if (!isDiscoverPoolPressureError(error)) throw error;
    console.warn("[DISCOVER_COLLECTIONS_DATA_BEST_EFFORT]", error);
    return getEmptyDiscoverCollectionsData();
  }
}

const readDiscoverFreeResources = unstable_cache(
  async function _getDiscoverFreeResources() {
    recordCacheMiss("getDiscoverFreeResources");
    logPerformanceEvent("cache_execute:getDiscoverFreeResources");
    return rememberJson(
      CACHE_KEYS.discoverFreeResources,
      CACHE_TTLS.homepageList,
      () =>
        runSingleFlight(DISCOVER_FREE_RESOURCES_SINGLE_FLIGHT_KEY, async () => {
          const freeIds = await traceServerStep(
            "discover.loadFreeResourceSource",
            () =>
              getDiscoverSectionIds({
                cacheKey: CACHE_KEYS.freeResources,
                limit: DISCOVER_SECTION_SOURCE_LIMIT,
                metricName: "discover.freeResources",
                primaryLoader: () =>
                  findFreeResourceIds(DISCOVER_SECTION_SOURCE_LIMIT),
                fallbackOrderBy: [
                  { downloadCount: "desc" },
                  { createdAt: "desc" },
                ],
                fallbackWhere: { isFree: true },
              }),
            { sectionLimit: DISCOVER_SECTION_SOURCE_LIMIT },
          );

          const pool = await traceServerStep(
            "discover.loadFreeResourcePool",
            () => loadDiscoverResourcesByIds(freeIds),
            { resourceCount: freeIds.length },
          );

          return {
            freeResources: mapDiscoverSection(freeIds, pool),
          };
        }),
      { metricName: "discover.freeResourcesData" },
    );
  },
  ["discover-free-resources"],
  { revalidate: CACHE_TTLS.homepageList, tags: ["discover"] }
);

export async function getDiscoverFreeResources() {
  recordCacheCall("getDiscoverFreeResources");
  try {
    return await readDiscoverFreeResources();
  } catch (error) {
    if (!isDiscoverPoolPressureError(error)) throw error;
    console.warn("[DISCOVER_FREE_RESOURCES_BEST_EFFORT]", error);
    return getEmptyDiscoverSupplementalData();
  }
}

export async function getDiscoverData(): Promise<DiscoverData> {
  recordCacheCall("getDiscoverData");
  const [leadData, collectionsData, supplementalData] = await Promise.all([
    getDiscoverLeadData(),
    getDiscoverCollectionsData(),
    getDiscoverFreeResources(),
  ]);

  return {
    ...leadData,
    ...collectionsData,
    ...supplementalData,
  };
}

async function loadDiscoverResourcesByIds(resourceIds: string[]) {
  const rows = await traceServerStep(
    "discover.findDiscoverResourcesByIds",
    () => findDiscoverResourcesByIds(resourceIds),
    { resourceCount: resourceIds.length },
  );

  return new Map(rows.map((row) => {
    const resource = withPreview(row);
    return [resource.id, resource];
  }));
}

// ── Supporting queries ────────────────────────────────────────────────────────

/**
 * Returns categories with their published-resource counts for the
 * "Browse by category" grid.
 *
 * Wrapped in its own unstable_cache entry (same "discover" tag) so that
 * callers outside of getDiscoverData — e.g. the marketplace page — never
 * incur an extra DB round-trip when the discover cache is warm.
 */
const readDiscoverCategories = unstable_cache(
  async function _getDiscoverCategories() {
    recordCacheMiss("getDiscoverCategories");
    return rememberJson(
      CACHE_KEYS.discoverCategories,
      CACHE_TTLS.homepageList,
      () =>
        runSingleFlight(CACHE_KEYS.discoverCategories, () =>
          runBestEffortAsync(() => findDiscoverCategoriesWithCounts(), {
            fallback: [],
            warningLabel: "[DISCOVER_CATEGORIES_BEST_EFFORT]",
          }),
        ),
      { metricName: "discover.discoverCategories" },
    );
  },
  ["discover-categories"],
  { revalidate: CACHE_TTLS.homepageList, tags: ["discover"] }
);

export async function getDiscoverCategories() {
  recordCacheCall("getDiscoverCategories");
  return readDiscoverCategories();
}
