/**
 * Creator activation funnel repository.
 *
 * Queries the `activityLog` table for the four creator activation events
 * tracked when approved creators progress through first-run onboarding.
 *
 * Events:
 *   creator_dashboard_first_run_view
 *   creator_create_first_resource_click
 *   creator_first_resource_draft_created
 *   creator_first_resource_published
 *
 * All four events are only emitted for authenticated users, so `userId`
 * is always present.  We count DISTINCT userId per step — the right metric
 * for a funnel (how many unique creators reached this step, not how many
 * times the event fired).
 */

import { prisma } from "@/lib/prisma";

// ── Types ─────────────────────────────────────────────────────────────────────

/** Optional date range applied to `createdAt`. Both bounds are inclusive. */
export interface DateFilter {
  start?: Date;
  end?: Date;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function createdAtFilter(f?: DateFilter) {
  if (!f?.start && !f?.end) return undefined;
  return {
    ...(f.start ? { gte: f.start } : {}),
    ...(f.end ? { lte: f.end } : {}),
  };
}

async function countDistinctCreators(action: string, filter?: DateFilter): Promise<number> {
  const createdAt = createdAtFilter(filter);

  const rows = await prisma.activityLog.findMany({
    where: {
      action,
      userId: { not: null },
      ...(createdAt ? { createdAt } : {}),
    },
    select: { userId: true },
  });

  return new Set(rows.map((r) => r.userId)).size;
}

// ── Queries ───────────────────────────────────────────────────────────────────

/** Distinct creators who saw the first-run dashboard. */
export function countFirstRunViews(filter?: DateFilter) {
  return countDistinctCreators("creator_dashboard_first_run_view", filter);
}

/** Distinct creators who clicked "Create first resource" from the first-run UI. */
export function countCreateFirstResourceClicks(filter?: DateFilter) {
  return countDistinctCreators("creator_create_first_resource_click", filter);
}

/** Distinct creators who saved their first resource draft. */
export function countFirstDraftCreated(filter?: DateFilter) {
  return countDistinctCreators("creator_first_resource_draft_created", filter);
}

/** Distinct creators who published their first resource. */
export function countFirstPublished(filter?: DateFilter) {
  return countDistinctCreators("creator_first_resource_published", filter);
}
