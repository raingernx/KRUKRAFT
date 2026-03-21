import { prisma } from "@/lib/prisma";

// ── Activity-log funnel ───────────────────────────────────────────────────────

export interface ActivityFunnelCountsRow {
  checkoutStarted: number;
  checkoutRedirected: number;
  purchaseCompletedWebhook: number;
  checkoutSuccessPageViewed: number;
  downloadStarted: number;
  /** First successful download per user per paid resource. Clean paid-activation signal. */
  firstPaidDownload: number;
}

// ── Purchase / revenue types ──────────────────────────────────────────────────

export interface PurchaseDateFilter {
  start?: Date;
  end?: Date;
}

export interface PurchaseFunnelCountsRow {
  sessionsStarted: number;
  sessionsCompleted: number;
  sessionsFailed: number;
  freeClaims: number;
}

export interface RevenueSummaryRow {
  totalRevenue: number;
  platformFee: number;
  creatorShare: number;
}

export interface ProviderBreakdownRow {
  provider: string;
  purchaseCount: number;
  revenue: number;
}

export interface TopPurchasedResourceRow {
  resourceId: string;
  title: string;
  slug: string;
  purchaseCount: number;
  revenue: number;
}

export interface DailyPurchaseSeriesRow {
  date: Date;
  paidCount: number;
  freeCount: number;
  revenue: number;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

/** Epoch: used as the lower bound when no start date is provided. */
const EPOCH = new Date(0);

/** A far-future date: used as the upper bound when no end date is provided. */
function farFuture(): Date {
  return new Date(Date.now() + 100 * 365 * 24 * 60 * 60 * 1000);
}

// ── Queries ───────────────────────────────────────────────────────────────────

/**
 * Counts paid checkout sessions and free claims in the given date range.
 *
 * - sessionsStarted  — any Purchase row with a paid provider (regardless of status)
 * - sessionsCompleted — paid provider + COMPLETED
 * - sessionsFailed    — paid provider + FAILED
 * - freeClaims        — paymentProvider = 'FREE' + COMPLETED
 *
 * Null paymentProvider is treated as 'STRIPE' (legacy rows).
 */
export async function fetchPurchaseFunnelCounts(
  filter: PurchaseDateFilter,
): Promise<PurchaseFunnelCountsRow> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  const rows = await prisma.$queryRaw<PurchaseFunnelCountsRow[]>`
    SELECT
      COUNT(*) FILTER (
        WHERE "paymentProvider" IN ('STRIPE', 'XENDIT')
           OR "paymentProvider" IS NULL
      )::int AS "sessionsStarted",
      COUNT(*) FILTER (
        WHERE ("paymentProvider" IN ('STRIPE', 'XENDIT') OR "paymentProvider" IS NULL)
          AND status = 'COMPLETED'
      )::int AS "sessionsCompleted",
      COUNT(*) FILTER (
        WHERE ("paymentProvider" IN ('STRIPE', 'XENDIT') OR "paymentProvider" IS NULL)
          AND status = 'FAILED'
      )::int AS "sessionsFailed",
      COUNT(*) FILTER (
        WHERE "paymentProvider" = 'FREE'
          AND status = 'COMPLETED'
      )::int AS "freeClaims"
    FROM "Purchase"
    WHERE "createdAt" >= ${start}
      AND "createdAt" <= ${end}
  `;

  return rows[0] ?? {
    sessionsStarted: 0,
    sessionsCompleted: 0,
    sessionsFailed: 0,
    freeClaims: 0,
  };
}

/**
 * Sums revenue split figures from CreatorRevenue rows in the given date range.
 * Uses CreatorRevenue.createdAt (webhook confirmation time) as the event timestamp.
 */
export async function fetchRevenueSummary(
  filter: PurchaseDateFilter,
): Promise<RevenueSummaryRow> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  const rows = await prisma.$queryRaw<RevenueSummaryRow[]>`
    SELECT
      COALESCE(SUM(amount), 0)::int         AS "totalRevenue",
      COALESCE(SUM("platformFee"), 0)::int  AS "platformFee",
      COALESCE(SUM("creatorShare"), 0)::int AS "creatorShare"
    FROM "creator_revenue"
    WHERE "createdAt" >= ${start}
      AND "createdAt" <= ${end}
  `;

  return rows[0] ?? { totalRevenue: 0, platformFee: 0, creatorShare: 0 };
}

/**
 * Returns completed paid purchase counts and total revenue grouped by payment
 * provider. NULL paymentProvider is normalised to 'STRIPE'.
 */
export async function fetchProviderBreakdown(
  filter: PurchaseDateFilter,
): Promise<ProviderBreakdownRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<ProviderBreakdownRow[]>`
    SELECT
      COALESCE(p."paymentProvider", 'STRIPE') AS provider,
      COUNT(p.id)::int                        AS "purchaseCount",
      COALESCE(SUM(cr.amount), 0)::int        AS revenue
    FROM "Purchase" p
    LEFT JOIN "creator_revenue" cr ON cr."purchaseId" = p.id
    WHERE p.status = 'COMPLETED'
      AND (p."paymentProvider" IN ('STRIPE', 'XENDIT') OR p."paymentProvider" IS NULL)
      AND p."createdAt" >= ${start}
      AND p."createdAt" <= ${end}
    GROUP BY COALESCE(p."paymentProvider", 'STRIPE')
    ORDER BY revenue DESC
  `;
}

/**
 * Returns the top `limit` resources by completed paid purchase count in the
 * given date range, including each resource's title, slug, and total revenue.
 */
export async function fetchTopPurchasedResources(
  filter: PurchaseDateFilter,
  limit = 10,
): Promise<TopPurchasedResourceRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<TopPurchasedResourceRow[]>`
    SELECT
      p."resourceId",
      r.title,
      r.slug,
      COUNT(p.id)::int                 AS "purchaseCount",
      COALESCE(SUM(cr.amount), 0)::int AS revenue
    FROM "Purchase" p
    INNER JOIN "Resource" r ON r.id = p."resourceId"
    LEFT JOIN "creator_revenue" cr ON cr."purchaseId" = p.id
    WHERE p.status = 'COMPLETED'
      AND (p."paymentProvider" IN ('STRIPE', 'XENDIT') OR p."paymentProvider" IS NULL)
      AND p."createdAt" >= ${start}
      AND p."createdAt" <= ${end}
    GROUP BY p."resourceId", r.title, r.slug
    ORDER BY "purchaseCount" DESC, revenue DESC
    LIMIT ${limit}
  `;
}

/**
 * Returns a per-day series of completed purchases (paid and free) and revenue
 * within the given date range, ordered chronologically.
 */
export async function fetchDailyPurchaseSeries(
  filter: PurchaseDateFilter,
): Promise<DailyPurchaseSeriesRow[]> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  return prisma.$queryRaw<DailyPurchaseSeriesRow[]>`
    SELECT
      DATE_TRUNC('day', p."createdAt")::date AS date,
      COUNT(*) FILTER (
        WHERE (p."paymentProvider" IN ('STRIPE', 'XENDIT') OR p."paymentProvider" IS NULL)
      )::int AS "paidCount",
      COUNT(*) FILTER (
        WHERE p."paymentProvider" = 'FREE'
      )::int AS "freeCount",
      COALESCE(SUM(cr.amount), 0)::int AS revenue
    FROM "Purchase" p
    LEFT JOIN "creator_revenue" cr ON cr."purchaseId" = p.id
    WHERE p.status = 'COMPLETED'
      AND p."createdAt" >= ${start}
      AND p."createdAt" <= ${end}
    GROUP BY DATE_TRUNC('day', p."createdAt")::date
    ORDER BY date ASC
  `;
}

/**
 * Counts ActivityLog events for each of the five purchase funnel actions in
 * the given date range.  A single query with FILTER expressions avoids five
 * round-trips.
 *
 * Action strings must match exactly what is passed to logActivity() in:
 *   - checkout.service.ts          → CHECKOUT_STARTED, FREE_CLAIM_STARTED/SUCCESS
 *   - BuyButton.tsx (via API)      → CHECKOUT_REDIRECTED
 *   - stripe/xendit-webhook.service → PURCHASE_COMPLETED_WEBHOOK
 *   - CheckoutSuccessTracker (API) → CHECKOUT_SUCCESS_PAGE_VIEWED
 *   - download.service.ts          → DOWNLOAD_STARTED
 */
export async function fetchActivityFunnelCounts(
  filter: PurchaseDateFilter,
): Promise<ActivityFunnelCountsRow> {
  const start = filter.start ?? EPOCH;
  const end = filter.end ?? farFuture();

  const rows = await prisma.$queryRaw<ActivityFunnelCountsRow[]>`
    SELECT
      COUNT(*) FILTER (WHERE action = 'CHECKOUT_STARTED')::int           AS "checkoutStarted",
      COUNT(*) FILTER (WHERE action = 'CHECKOUT_REDIRECTED')::int        AS "checkoutRedirected",
      COUNT(*) FILTER (WHERE action = 'PURCHASE_COMPLETED_WEBHOOK')::int AS "purchaseCompletedWebhook",
      COUNT(*) FILTER (WHERE action = 'CHECKOUT_SUCCESS_PAGE_VIEWED')::int AS "checkoutSuccessPageViewed",
      COUNT(*) FILTER (WHERE action = 'DOWNLOAD_STARTED')::int           AS "downloadStarted",
      COUNT(*) FILTER (WHERE action = 'FIRST_PAID_DOWNLOAD')::int        AS "firstPaidDownload"
    FROM "ActivityLog"
    WHERE "createdAt" >= ${start}
      AND "createdAt" <= ${end}
  `;

  return rows[0] ?? {
    checkoutStarted: 0,
    checkoutRedirected: 0,
    purchaseCompletedWebhook: 0,
    checkoutSuccessPageViewed: 0,
    downloadStarted: 0,
    firstPaidDownload: 0,
  };
}
