/**
 * Ranking Experiment Report Service
 *
 * Produces a per-variant comparison of buyer-funnel metrics for the
 * `ranking_variant` A/B experiment:
 *
 *   Variant A — control:   sort = "newest"
 *   Variant B — treatment: sort = "recommended" (activation-weighted)
 *
 * Metric sources and attribution:
 *
 *   checkoutStarts          — ActivityLog[CHECKOUT_STARTED].metadata.rankingVariant (direct)
 *   checkoutRedirects       — attributed via 30-min time-window join from CHECKOUT_STARTED
 *                             → CHECKOUT_REDIRECTED on userId + resourceId (indirect)
 *   completions             — join CHECKOUT_STARTED → Purchase.COMPLETED on userId + resourceId
 *                             (PURCHASE_COMPLETED_WEBHOOK fires server-side with no cookie access)
 *   conversionRate          — completions / checkoutStarts × 100
 *   redirectToCompletionRate — completions / checkoutRedirects × 100
 *                              isolates payment provider friction from UI/pricing drop-off
 *   fpdCount                — ActivityLog[FIRST_PAID_DOWNLOAD].metadata.rankingVariant (direct)
 *   paidActivationRate      — fpdCount / completions × 100
 *
 * Cross-variant attribution design:
 *   All completions and redirects are attributed to the variant recorded in the
 *   CHECKOUT_STARTED event — not the FIRST_PAID_DOWNLOAD variant. A user who
 *   starts checkout under variant A and downloads under variant B is counted as
 *   a completion under A. This is intentional: the purchase decision was made
 *   under A's ranking.
 *
 * Variant values:
 *   'A'          — control arm (newest sort)
 *   'B'          — treatment arm (recommended sort)
 *   'UNASSIGNED' — cookie was absent at event time (pre-experiment sessions,
 *                  first-load users, or silent cookie read failures). Normalised
 *                  to this string in the repository — never NULL here.
 *
 * Date range handling:
 *   - Default: last 30 days
 *   - Invalid date strings are treated as absent
 *   - start > end: bounds are swapped
 *   - end date: advanced to 23:59:59.999 UTC
 *
 * Design invariants:
 *   - Read-only. No writes, no mutations.
 *   - Never modifies live ranking behaviour.
 *   - All three repository queries run in parallel.
 */

import {
  fetchVariantDirectCounts,
  fetchVariantCompletions,
  fetchVariantRedirects,
  type RankingExperimentDateFilter,
} from "@/repositories/analytics/ranking-experiment.repository";

// ── Constants ─────────────────────────────────────────────────────────────────

const DEFAULT_WINDOW_DAYS = 30;

// ── Types ─────────────────────────────────────────────────────────────────────

/** All metrics for a single experiment variant. */
export interface RankingVariantRow {
  /**
   * Normalised variant string: 'A' | 'B' | 'UNASSIGNED'.
   * Never null — the repository coalesces missing cookie values.
   */
  variant: string;
  /** Human-readable label for display in the admin UI. */
  label: string;
  /** CHECKOUT_STARTED events directly attributed to this variant. */
  checkoutStarts: number;
  /**
   * CHECKOUT_REDIRECTED events attributed via 30-minute time-window join
   * from CHECKOUT_STARTED on userId + resourceId. Best-effort attribution.
   */
  checkoutRedirects: number;
  /** Completed Purchase rows joined from CHECKOUT_STARTED attribution. */
  completions: number;
  /** completions / checkoutStarts × 100 (null when checkoutStarts = 0). */
  conversionRate: number | null;
  /**
   * completions / checkoutRedirects × 100 (null when checkoutRedirects = 0).
   * Isolates payment provider friction from UI / pricing drop-off.
   */
  redirectToCompletionRate: number | null;
  /** FIRST_PAID_DOWNLOAD events directly attributed to this variant. */
  fpdCount: number;
  /** fpdCount / completions × 100 (null when completions = 0). */
  paidActivationRate: number | null;
}

export interface RankingExperimentReport {
  /** Ordered A → B → UNASSIGNED. */
  variants: RankingVariantRow[];
  /** ISO timestamp for the "generated at" footer. */
  generatedAt: string;
  filterStart: string;
  filterEnd: string;
  isDefaultRange: boolean;
}

export interface RankingExperimentOptions {
  start?: string | null;
  end?: string | null;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function toDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return isNaN(d.getTime()) ? null : d;
}

function toDateString(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function endOfDay(d: Date): Date {
  return new Date(
    Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999),
  );
}

/**
 * Safe percentage rounded to 2 decimal places.
 * Returns null (not 0) when denominator is 0 — null renders as "—" in the UI,
 * clearly communicating "no data" rather than "zero conversion".
 */
function pct(numerator: number, denominator: number): number | null {
  if (denominator === 0) return null;
  return Math.round((numerator / denominator) * 10_000) / 100;
}

/** Human-readable label for each variant value. */
function variantLabel(v: string): string {
  if (v === "A") return "Control (Baseline)";
  if (v === "B") return "Variant (Recommended)";
  return "Unassigned / Legacy";
}

/**
 * Canonical display order: A first, B second, UNASSIGNED last.
 * Any unexpected value sorts after UNASSIGNED.
 */
function variantSortKey(v: string): number {
  if (v === "A") return 0;
  if (v === "B") return 1;
  if (v === "UNASSIGNED") return 2;
  return 3;
}

// ── Main ──────────────────────────────────────────────────────────────────────

export async function getRankingExperimentReport(
  options: RankingExperimentOptions = {},
): Promise<RankingExperimentReport> {
  let startDate = toDate(options.start);
  let endDate = toDate(options.end);

  const isDefaultRange = !startDate && !endDate;

  if (isDefaultRange) {
    endDate = new Date();
    startDate = new Date(endDate.getTime() - DEFAULT_WINDOW_DAYS * 86_400_000);
  }

  if (startDate && endDate && startDate > endDate) {
    [startDate, endDate] = [endDate, startDate];
  }

  const filter: RankingExperimentDateFilter = {
    ...(startDate ? { start: startDate } : {}),
    ...(endDate ? { end: endOfDay(endDate) } : {}),
  };

  // All three queries run in parallel — no inter-dependency.
  const [directCounts, completionRows, redirectRows] = await Promise.all([
    fetchVariantDirectCounts(filter),
    fetchVariantCompletions(filter),
    fetchVariantRedirects(filter),
  ]);

  // Merge all row sets into a single map keyed by variant string.
  // Since the repository normalises NULL → 'UNASSIGNED', the key is always
  // a plain string with no special-casing needed.
  const merged = new Map<string, RankingVariantRow>();

  const getOrCreate = (v: string): RankingVariantRow => {
    if (!merged.has(v)) {
      merged.set(v, {
        variant: v,
        label: variantLabel(v),
        checkoutStarts: 0,
        checkoutRedirects: 0,
        completions: 0,
        conversionRate: null,
        redirectToCompletionRate: null,
        fpdCount: 0,
        paidActivationRate: null,
      });
    }
    return merged.get(v)!;
  };

  for (const row of directCounts) {
    const entry = getOrCreate(row.variant);
    entry.checkoutStarts = row.checkoutStarts;
    entry.fpdCount = row.fpdCount;
  }

  for (const row of completionRows) {
    getOrCreate(row.variant).completions = row.completions;
  }

  for (const row of redirectRows) {
    getOrCreate(row.variant).checkoutRedirects = row.checkoutRedirects;
  }

  // Compute all derived rates once all raw counts are merged.
  for (const entry of merged.values()) {
    entry.conversionRate          = pct(entry.completions, entry.checkoutStarts);
    entry.redirectToCompletionRate = pct(entry.completions, entry.checkoutRedirects);
    entry.paidActivationRate      = pct(entry.fpdCount, entry.completions);
  }

  const variants = Array.from(merged.values()).sort(
    (a, b) => variantSortKey(a.variant) - variantSortKey(b.variant),
  );

  const effectiveStart = startDate ?? new Date(0);
  const effectiveEnd = endDate ?? new Date();

  return {
    variants,
    generatedAt:
      new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC",
    filterStart: toDateString(effectiveStart),
    filterEnd: toDateString(effectiveEnd),
    isDefaultRange,
  };
}
