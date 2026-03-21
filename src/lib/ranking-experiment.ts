/**
 * Ranking A/B Experiment
 *
 * Measures whether "recommended" (activation-weighted) sort outperforms
 * "newest" on three funnel metrics:
 *   - CHECKOUT_STARTED rate       (top-of-funnel browsing intent)
 *   - paid conversion rate        (PURCHASE_COMPLETED / CHECKOUT_STARTED)
 *   - paid activation rate        (FIRST_PAID_DOWNLOAD / PURCHASE_COMPLETED)
 *
 * Variant A — control:   sort = "newest"
 * Variant B — treatment: sort = "recommended"
 *
 * Assignment is cookie-based (HttpOnly, 30-day lifetime), set by middleware
 * on every page navigation so assignment is stable across sessions and
 * applies to both authenticated and anonymous users.
 *
 * The cookie is never readable by client-side JavaScript (HttpOnly).
 *
 * Analytics note on PURCHASE_COMPLETED_WEBHOOK:
 *   Webhook events are fired by Stripe/Xendit servers — there is no browser
 *   session or cookie available in that context. The variant cannot be
 *   injected into PURCHASE_COMPLETED_WEBHOOK metadata without storing it
 *   on the purchase record at checkout creation time, which is outside the
 *   scope of this experiment.
 *
 *   paidConversionRate CAN be computed analytically by joining:
 *     SELECT cs.metadata->>'rankingVariant' AS variant,
 *            COUNT(DISTINCT p.id) AS completions,
 *            COUNT(DISTINCT cs.id) AS starts,
 *            COUNT(DISTINCT p.id)::float / COUNT(DISTINCT cs.id) AS rate
 *     FROM "ActivityLog" cs
 *     JOIN "Purchase" p
 *       ON p."userId"     = cs."userId"
 *      AND p."resourceId" = cs.metadata->>'resourceId'
 *      AND p.status       = 'COMPLETED'
 *     WHERE cs.action = 'CHECKOUT_STARTED'
 *     GROUP BY cs.metadata->>'rankingVariant'
 */

export const RANKING_EXPERIMENT_COOKIE   = "ranking_variant" as const;
export const RANKING_EXPERIMENT_DURATION_DAYS = 30;

export type RankingVariant = "A" | "B";

const VALID_VARIANTS = new Set<string>(["A", "B"]);

/**
 * Returns true when `v` is a valid, non-tampered RankingVariant.
 * Used as a type guard at every cookie-reading site.
 */
export function isValidRankingVariant(
  v: string | undefined | null,
): v is RankingVariant {
  return v != null && VALID_VARIANTS.has(v);
}

/**
 * Maps a raw cookie value to the effective sort key to pass to the
 * marketplace service.
 *
 * | Cookie value   | Effective sort  | Notes                     |
 * |----------------|-----------------|---------------------------|
 * | "A"            | "newest"        | Control arm               |
 * | "B"            | "recommended"   | Treatment arm             |
 * | absent/invalid | "newest"        | Safe fallback = control   |
 *
 * The fallback is intentionally the control arm so any cookie failure
 * silently lands users in the safer, known-good path.
 */
export function variantToSort(
  variant: string | undefined | null,
): "newest" | "recommended" {
  if (variant === "B") return "recommended";
  return "newest";
}
