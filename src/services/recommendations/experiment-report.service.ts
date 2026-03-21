/**
 * Recommendation experiment report service.
 *
 * Aggregates impression, click, unique-user, and purchase-after-click metrics
 * from `analytics_events` for the Phase 1 vs Phase 2 A/B experiment.
 *
 * Metrics are computed over a configurable rolling window (default 30 days).
 * Purchase-after-click uses a fixed 7-day attribution window: a purchase is
 * attributed to a click only if it occurs within 7 days of the click on the
 * same (userId, resourceId) pair.
 *
 * This service is read-only and has no side-effects on recommendation logic.
 */

import {
  findRecommendationExperimentMetrics,
  findRecommendationPurchasesAfterClick,
} from "@/repositories/analytics/analytics.repository";
import { RECOMMENDATION_EXPERIMENT_ID } from "@/lib/recommendations/experiment";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface RecommendationVariantReport {
  /** "phase1" or "phase2" */
  variant:             string;
  impressions:         number;
  clicks:              number;
  /** clicks / impressions × 100, rounded to 2 dp. */
  ctr:                 number;
  /** Distinct users who saw at least one impression in this variant. */
  uniqueUsers:         number;
  /** Clicks that led to a purchase of the same resource within 7 days. */
  purchasesAfterClick: number;
  /** purchasesAfterClick / clicks × 100, rounded to 2 dp. */
  conversionRate:      number;
}

export interface RecommendationExperimentReport {
  experimentId:  string;
  windowDays:    number;
  since:         Date;
  generatedAt:   Date;
  variants:      RecommendationVariantReport[];
}

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_WINDOW_DAYS = 30;
/** Both arms always appear in the report, even when one has zero data. */
const KNOWN_VARIANTS = ["phase1", "phase2"] as const;

// ── Helpers ───────────────────────────────────────────────────────────────────

function pct(numerator: number, denominator: number): number {
  if (denominator === 0) return 0;
  return Math.round((numerator / denominator) * 10_000) / 100; // 2 dp
}

// ── Public API ────────────────────────────────────────────────────────────────

/**
 * Returns a full experiment report for the given `experimentId` over the last
 * `windowDays` days.
 *
 * Both variant rows are always present — whichever arm has no events yet will
 * appear with all-zero counts so the caller never has to guard for absence.
 *
 * @param experimentId  Defaults to the live experiment constant.
 * @param windowDays    Rolling window in days (default 30).
 */
export async function getRecommendationExperimentReport(
  experimentId = RECOMMENDATION_EXPERIMENT_ID,
  windowDays = DEFAULT_WINDOW_DAYS,
): Promise<RecommendationExperimentReport> {
  const since = new Date(Date.now() - windowDays * 86_400_000);

  const [metricsRows, purchaseRows] = await Promise.all([
    findRecommendationExperimentMetrics(experimentId, since),
    findRecommendationPurchasesAfterClick(experimentId, since),
  ]);

  const purchaseByVariant = new Map(
    purchaseRows.map((r) => [r.variant, r.purchasesAfterClick]),
  );

  // Index fetched rows then fill in any missing variants with zeros.
  const byVariant = new Map(metricsRows.map((r) => [r.variant, r]));

  const variants: RecommendationVariantReport[] = KNOWN_VARIANTS.map((v) => {
    const row = byVariant.get(v);
    const impressions         = row?.impressions ?? 0;
    const clicks              = row?.clicks      ?? 0;
    const uniqueUsers         = row?.uniqueUsers  ?? 0;
    const purchasesAfterClick = purchaseByVariant.get(v) ?? 0;

    return {
      variant:             v,
      impressions,
      clicks,
      ctr:                 pct(clicks, impressions),
      uniqueUsers,
      purchasesAfterClick,
      conversionRate:      pct(purchasesAfterClick, clicks),
    };
  });

  return {
    experimentId,
    windowDays,
    since,
    generatedAt: new Date(),
    variants,
  };
}
