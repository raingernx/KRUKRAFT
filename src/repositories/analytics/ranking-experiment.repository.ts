import { prisma } from "@/lib/prisma";

// ── Date filter ───────────────────────────────────────────────────────────────

export interface RankingExperimentDateFilter {
  start?: Date;
  end?: Date;
}

/** Epoch lower-bound when no start is provided. */
const EPOCH = new Date(0);

/** Far-future upper-bound when no end is provided. */
function farFuture(): Date {
  return new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
}

// ── Row types ─────────────────────────────────────────────────────────────────

/**
 * Directly attributed counts from ActivityLog rows that carry
 * `metadata->>'rankingVariant'`.
 *
 *   CHECKOUT_STARTED    — logged in checkout.service.ts with rankingVariant
 *   FIRST_PAID_DOWNLOAD — logged in download.service.ts with rankingVariant
 *
 * NULL metadata values are normalised to 'UNASSIGNED' in the query so
 * `variant` is always a non-null string.
 */
export interface VariantDirectCountsRow {
  variant: string;
  checkoutStarts: number;
  fpdCount: number;
}

/**
 * Per-variant completed purchase count derived by joining
 * CHECKOUT_STARTED ActivityLog rows to Purchase rows where
 * status = COMPLETED, userId and resourceId match.
 *
 * This is the only reliable way to attribute completions to a variant
 * because PURCHASE_COMPLETED_WEBHOOK is fired by the payment provider's
 * server and has no access to the browser cookie.
 *
 * NULL metadata values are normalised to 'UNASSIGNED'.
 */
export interface VariantCompletionsRow {
  variant: string;
  completions: number;
}

/**
 * Per-variant checkout redirect count, attributed via join from
 * CHECKOUT_STARTED → CHECKOUT_REDIRECTED on userId + resourceId
 * within a 30-minute window.
 *
 * CHECKOUT_REDIRECTED is fired client-side (BuyButton) and does not carry
 * rankingVariant in its metadata because the cookie is HttpOnly. Attribution
 * is therefore indirect and best-effort. The 30-minute window covers any
 * realistic single checkout session while minimising cross-session leakage.
 *
 * NULL metadata values are normalised to 'UNASSIGNED'.
 */
export interface VariantRedirectsRow {
  variant: string;
  checkoutRedirects: number;
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Returns per-variant counts for events that carry `rankingVariant` directly
 * in their ActivityLog metadata:
 *
 *   - CHECKOUT_STARTED      (checkout.service.ts)
 *   - FIRST_PAID_DOWNLOAD   (download.service.ts)
 *
 * Grouped by COALESCE(metadata->>'rankingVariant', 'UNASSIGNED') so the
 * caller always receives 'A', 'B', or 'UNASSIGNED' — never NULL.
 *
 * 'UNASSIGNED' covers:
 *   - Users whose cookie had not yet been assigned (first page load)
 *   - Pre-experiment sessions before the cookie was introduced
 *   - Sessions where the cookie read failed silently
 */
export async function fetchVariantDirectCounts(
  filter: RankingExperimentDateFilter,
): Promise<VariantDirectCountsRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<VariantDirectCountsRow[]>`
    SELECT
      COALESCE(metadata->>'rankingVariant', 'UNASSIGNED')            AS variant,
      COUNT(*) FILTER (WHERE action = 'CHECKOUT_STARTED')::int       AS "checkoutStarts",
      COUNT(*) FILTER (WHERE action = 'FIRST_PAID_DOWNLOAD')::int    AS "fpdCount"
    FROM "ActivityLog"
    WHERE action IN ('CHECKOUT_STARTED', 'FIRST_PAID_DOWNLOAD')
      AND "createdAt" >= ${start}
      AND "createdAt" <= ${end}
    GROUP BY COALESCE(metadata->>'rankingVariant', 'UNASSIGNED')
    ORDER BY variant
  `;
}

/**
 * Returns per-variant completed purchase counts by joining CHECKOUT_STARTED
 * ActivityLog rows (which carry rankingVariant) to Purchase rows where
 * status = 'COMPLETED', userId matches, and entityId (resourceId) matches.
 *
 * COUNT(DISTINCT p.id) prevents double-counting when a user has multiple
 * CHECKOUT_STARTED events for the same resource (e.g. they opened the
 * resource page, left, and returned before completing payment).
 *
 * Date filter applies to the CHECKOUT_STARTED event timestamp.
 * Variant is normalised to 'UNASSIGNED' when the cookie was absent.
 */
export async function fetchVariantCompletions(
  filter: RankingExperimentDateFilter,
): Promise<VariantCompletionsRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<VariantCompletionsRow[]>`
    SELECT
      COALESCE(cs.metadata->>'rankingVariant', 'UNASSIGNED')  AS variant,
      -- DISTINCT prevents double counting when multiple CHECKOUT_STARTED
      -- events exist for the same user + resource combination.
      COUNT(DISTINCT p.id)::int                               AS completions
    FROM "ActivityLog" cs
    INNER JOIN "Purchase" p
      ON  p."userId"     = cs."userId"
      AND p."resourceId" = cs."entityId"
      AND p.status       = 'COMPLETED'
      AND (p."paymentProvider" IN ('STRIPE', 'XENDIT') OR p."paymentProvider" IS NULL)
    WHERE cs.action    = 'CHECKOUT_STARTED'
      AND cs."userId"  IS NOT NULL
      AND cs."createdAt" >= ${start}
      AND cs."createdAt" <= ${end}
    GROUP BY COALESCE(cs.metadata->>'rankingVariant', 'UNASSIGNED')
    ORDER BY variant
  `;
}

/**
 * Returns per-variant checkout redirect counts by attributing
 * CHECKOUT_REDIRECTED events to the CHECKOUT_STARTED event for the same
 * userId + resourceId that occurred within the preceding 30 minutes.
 *
 * The 30-minute window covers any realistic single checkout session
 * (including slow QR/bank transfers) while preventing cross-session
 * misattribution that a wider window would cause.
 *
 * CHECKOUT_REDIRECTED is logged from the browser (BuyButton) and has no
 * rankingVariant in its own metadata — attribution is therefore indirect.
 *
 * Date filter applies to the CHECKOUT_STARTED event timestamp.
 * Variant is normalised to 'UNASSIGNED' when the cookie was absent.
 */
export async function fetchVariantRedirects(
  filter: RankingExperimentDateFilter,
): Promise<VariantRedirectsRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<VariantRedirectsRow[]>`
    SELECT
      COALESCE(cs.metadata->>'rankingVariant', 'UNASSIGNED')  AS variant,
      COUNT(DISTINCT cr.id)::int                              AS "checkoutRedirects"
    FROM "ActivityLog" cs
    INNER JOIN "ActivityLog" cr
      ON  cr.action                   = 'CHECKOUT_REDIRECTED'
      AND cr."userId"                 = cs."userId"
      AND cr.metadata->>'resourceId'  = cs."entityId"
      AND cr."createdAt" BETWEEN cs."createdAt"
                             AND cs."createdAt" + INTERVAL '30 minutes'
    WHERE cs.action    = 'CHECKOUT_STARTED'
      AND cs."userId"  IS NOT NULL
      AND cs."createdAt" >= ${start}
      AND cs."createdAt" <= ${end}
    GROUP BY COALESCE(cs.metadata->>'rankingVariant', 'UNASSIGNED')
    ORDER BY variant
  `;
}
