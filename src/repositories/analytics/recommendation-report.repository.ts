/**
 * Recommendation experiment repository.
 *
 * Uses Prisma's JSON `path` + `equals` filtering to query
 * `analytics_events` rows tagged with experiment metadata, then
 * groups results in-memory by variant.  This is appropriate for
 * an internal report where the event volume is bounded and no
 * extra JSON column index is required.
 *
 * All four exported functions share the same filter shape:
 *   metadata.experiment === experimentId
 *   metadata.source     === "<source value>"
 *   createdAt           >= dateFilter.start (optional)
 *   createdAt           <= dateFilter.end   (optional)
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Counts keyed by variant name ("phase1" | "phase2"). */
export type VariantCountMap = Record<string, number>;

/** Optional date range applied to `createdAt`. Both bounds are inclusive. */
export interface DateFilter {
  start?: Date;
  end?:   Date;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Reads `metadata.variant` from a raw Prisma JSON value.
 * Falls back to "unknown" so the report never silently drops events.
 */
function variantOf(metadata: unknown): string {
  if (metadata && typeof metadata === "object" && !Array.isArray(metadata)) {
    const v = (metadata as Record<string, unknown>).variant;
    if (typeof v === "string" && v.length > 0) return v;
  }
  return "unknown";
}

/**
 * Builds a Prisma `createdAt` filter object from a DateFilter.
 * Returns undefined when no bounds are set so the field is omitted entirely
 * from the where clause (matching all rows, which is the default).
 */
function createdAtFilter(f?: DateFilter) {
  if (!f?.start && !f?.end) return undefined;
  return {
    ...(f.start ? { gte: f.start } : {}),
    ...(f.end   ? { lte: f.end   } : {}),
  };
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Total recommendation impressions per variant.
 *
 * Filters:
 *   eventType = RESOURCE_VIEW
 *   metadata.source = "recommendation_impression"
 *   metadata.experiment = experimentId
 *   createdAt in dateFilter (optional)
 */
export async function getRecommendationImpressions(
  experimentId: string,
  filter?: DateFilter,
): Promise<VariantCountMap> {
  const createdAt = createdAtFilter(filter);

  const rows = await prisma.analyticsEvent.findMany({
    where: {
      eventType: "RESOURCE_VIEW",
      ...(createdAt ? { createdAt } : {}),
      AND: [
        { metadata: { path: ["source"],     equals: "recommendation_impression" } },
        { metadata: { path: ["experiment"], equals: experimentId              } },
      ],
    },
    select: { metadata: true },
  });

  const counts: VariantCountMap = {};
  for (const row of rows) {
    const v = variantOf(row.metadata);
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}

/**
 * Total recommendation clicks per variant.
 *
 * Filters:
 *   eventType = RESOURCE_VIEW
 *   metadata.source = "recommendation_click"
 *   metadata.experiment = experimentId
 *   createdAt in dateFilter (optional)
 */
export async function getRecommendationClicks(
  experimentId: string,
  filter?: DateFilter,
): Promise<VariantCountMap> {
  const createdAt = createdAtFilter(filter);

  const rows = await prisma.analyticsEvent.findMany({
    where: {
      eventType: "RESOURCE_VIEW",
      ...(createdAt ? { createdAt } : {}),
      AND: [
        { metadata: { path: ["source"],     equals: "recommendation_click" } },
        { metadata: { path: ["experiment"], equals: experimentId           } },
      ],
    },
    select: { metadata: true },
  });

  const counts: VariantCountMap = {};
  for (const row of rows) {
    const v = variantOf(row.metadata);
    counts[v] = (counts[v] ?? 0) + 1;
  }
  return counts;
}

/**
 * Distinct users reached per variant (from impression events).
 * Guest impressions (userId = null) are excluded.
 * createdAt filter applied to impression events.
 */
export async function getRecommendationUniqueUsers(
  experimentId: string,
  filter?: DateFilter,
): Promise<VariantCountMap> {
  const createdAt = createdAtFilter(filter);

  const rows = await prisma.analyticsEvent.findMany({
    where: {
      eventType: "RESOURCE_VIEW",
      userId: { not: null },
      ...(createdAt ? { createdAt } : {}),
      AND: [
        { metadata: { path: ["source"],     equals: "recommendation_impression" } },
        { metadata: { path: ["experiment"], equals: experimentId              } },
      ],
    },
    select: { userId: true, metadata: true },
  });

  // Build variant → Set<userId> to deduplicate within each arm.
  const sets: Record<string, Set<string>> = {};
  for (const row of rows) {
    if (!row.userId) continue;
    const v = variantOf(row.metadata);
    if (!sets[v]) sets[v] = new Set();
    sets[v].add(row.userId);
  }

  const counts: VariantCountMap = {};
  for (const [v, s] of Object.entries(sets)) {
    counts[v] = s.size;
  }
  return counts;
}

/**
 * Purchases attributable to recommendation clicks, grouped by variant.
 *
 * The date filter is applied to the click events — i.e. "clicks that occurred
 * in this window that eventually led to any purchase".  Purchase events
 * themselves are not date-filtered so conversions are not missed.
 *
 * Logic:
 *   1. Collect click events in the date window → (userId, resourceId) → variant.
 *   2. Find RESOURCE_PURCHASE events for those same (userId, resourceId) pairs.
 *   3. Attribute the purchase to the variant of the click.
 */
export async function getRecommendationPurchases(
  experimentId: string,
  filter?: DateFilter,
): Promise<VariantCountMap> {
  const createdAt = createdAtFilter(filter);

  // Step 1 — collect click (userId, resourceId) → variant mapping.
  const clicks = await prisma.analyticsEvent.findMany({
    where: {
      eventType: "RESOURCE_VIEW",
      userId:     { not: null },
      resourceId: { not: null },
      ...(createdAt ? { createdAt } : {}),
      AND: [
        { metadata: { path: ["source"],     equals: "recommendation_click" } },
        { metadata: { path: ["experiment"], equals: experimentId           } },
      ],
    },
    select: { userId: true, resourceId: true, metadata: true },
  });

  if (clicks.length === 0) return {};

  // Map "(userId)|(resourceId)" → variant (last click wins).
  const pairToVariant = new Map<string, string>();
  for (const c of clicks) {
    if (!c.userId || !c.resourceId) continue;
    const key = `${c.userId}|${c.resourceId}`;
    pairToVariant.set(key, variantOf(c.metadata));
  }

  // Collect unique userId and resourceId sets for the purchase query.
  const userIds     = [...new Set(clicks.map((c) => c.userId).filter(Boolean))] as string[];
  const resourceIds = [...new Set(clicks.map((c) => c.resourceId).filter(Boolean))] as string[];

  // Step 2 — find RESOURCE_PURCHASE events for those (userId, resourceId) pairs.
  const purchases = await prisma.analyticsEvent.findMany({
    where: {
      eventType:  "RESOURCE_PURCHASE",
      userId:     { in: userIds     },
      resourceId: { in: resourceIds },
    },
    select: { userId: true, resourceId: true },
  });

  // Step 3 — count purchases per variant.
  const counts: VariantCountMap = {};
  for (const p of purchases) {
    if (!p.userId || !p.resourceId) continue;
    const key     = `${p.userId}|${p.resourceId}`;
    const variant = pairToVariant.get(key);
    if (!variant) continue;
    counts[variant] = (counts[variant] ?? 0) + 1;
  }
  return counts;
}
