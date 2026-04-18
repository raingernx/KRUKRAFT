import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import {
  canAccessCreatorWorkspace,
  type CreatorAccessState,
  getCreatorEarningsCardSummary,
  getCreatorAccessState,
  getCreatorPayoutLedger,
  getCreatorSalesLedger,
} from "@/services/creator";

export interface DashboardCreatorEarningsCard {
  label: string;
  value: string;
  detail: string;
}

export interface DashboardCreatorSaleRow {
  id: string;
  title: string;
  href: string;
  buyerLabel: string;
  grossLabel: string;
  shareLabel: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "neutral";
  dateLabel: string;
}

export interface DashboardCreatorPayoutRow {
  id: string;
  amountLabel: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "neutral";
  dateLabel: string;
}

type DashboardCreatorEarningsUnavailableData =
  | {
      state: "locked";
      title: string;
      description: string;
      ctaHref: string;
      ctaLabel: string;
    }
  | {
      state: "error";
      title: string;
      description: string;
    };

export type DashboardCreatorEarningsData =
  | {
      state: "ready";
      cards: DashboardCreatorEarningsCard[];
      sales: DashboardCreatorSaleRow[];
      payouts: DashboardCreatorPayoutRow[];
    }
  | {
      state: "locked";
      title: string;
      description: string;
      ctaHref: string;
      ctaLabel: string;
    }
  | {
      state: "error";
      title: string;
      description: string;
    };

function formatMoneyCents(value: number) {
  return formatPrice(value / 100);
}

function toStatusTone(status: string): "success" | "warning" | "neutral" {
  if (status === "COMPLETED" || status === "PAID") return "success";
  if (status === "PENDING" || status === "PROCESSING") return "warning";
  return "neutral";
}

function toStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getLockedEarningsData(): Extract<
  DashboardCreatorEarningsUnavailableData,
  { state: "locked" }
> {
  return {
    state: "locked",
    title: "Creator access is not active",
    description:
      "Apply for creator access before reviewing sales, payouts, and creator earnings.",
    ctaHref: routes.dashboardCreatorApply,
    ctaLabel: "Apply for creator access",
  };
}

function getErrorEarningsData(): Extract<
  DashboardCreatorEarningsUnavailableData,
  { state: "error" }
> {
  return {
    state: "error",
    title: "Could not load earnings",
    description:
      "Try refreshing this route. Creator revenue and payout state remain protected behind the dashboard session gate.",
  };
}

async function resolveCreatorEarningsAccess(
  input: { userId: string; access?: CreatorAccessState },
) {
  return input.access ?? getCreatorAccessState(input.userId);
}

export async function getDashboardCreatorEarningsData(input: {
  userId: string;
  access?: CreatorAccessState;
}): Promise<DashboardCreatorEarningsData> {
  try {
    const access = await resolveCreatorEarningsAccess(input);

    if (!canAccessCreatorWorkspace(access)) {
      return getLockedEarningsData();
    }

    const [summary, sales, payouts] = await Promise.all([
      getCreatorEarningsCardSummary(input.userId, {
        skipAccessCheck: true,
      }),
      getCreatorSalesLedger(input.userId, { skipAccessCheck: true }),
      getCreatorPayoutLedger(input.userId, { skipAccessCheck: true }),
    ]);

    return {
      state: "ready",
      cards: [
        {
          label: "Gross revenue",
          value: formatMoneyCents(summary.grossRevenue),
          detail: `${formatNumber(summary.totalSales)} sale${
            summary.totalSales === 1 ? "" : "s"
          } recorded`,
        },
        {
          label: "Creator share",
          value: formatMoneyCents(summary.creatorShare),
          detail: `${formatMoneyCents(summary.platformFees)} platform fees`,
        },
        {
          label: "Available balance",
          value: formatMoneyCents(summary.availableBalance),
          detail: `${formatMoneyCents(summary.totalPayouts)} already paid out`,
        },
        {
          label: "Payouts",
          value: String(summary.payoutCount),
          detail: summary.latestPayoutAt
            ? `${formatDate(summary.latestPayoutAt)} latest payout`
            : "No payouts sent yet",
        },
      ],
      sales: sales.map((sale) => ({
        id: sale.id,
        title: sale.resourceTitle,
        href: routes.resource(sale.resourceSlug),
        buyerLabel: sale.buyerName,
        grossLabel: formatMoneyCents(sale.amount),
        shareLabel: formatMoneyCents(sale.creatorShare),
        statusLabel: toStatusLabel(sale.status),
        statusTone: toStatusTone(sale.status),
        dateLabel: formatDate(sale.createdAt),
      })),
      payouts: payouts.map((payout) => ({
        id: payout.id,
        amountLabel: formatMoneyCents(payout.amount),
        statusLabel: toStatusLabel(payout.status),
        statusTone: toStatusTone(payout.status),
        dateLabel: formatDate(payout.createdAt),
      })),
    };
  } catch {
    return getErrorEarningsData();
  }
}
