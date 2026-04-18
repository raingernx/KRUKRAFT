import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { routes } from "@/lib/routes";
import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
  getCreatorAnalytics,
} from "@/services/creator";

export interface DashboardCreatorAnalyticsTopResourceRow {
  id: string;
  title: string;
  href: string;
  revenueLabel: string;
  salesLabel: string;
  downloadsLabel: string;
}

export interface DashboardCreatorAnalyticsRecentSaleRow {
  id: string;
  title: string;
  href: string;
  buyerLabel: string;
  amountLabel: string;
  shareLabel: string;
  statusLabel: string;
  statusTone: "success" | "warning" | "neutral";
  dateLabel: string;
}

export interface DashboardCreatorAnalyticsRecentDownloadRow {
  id: string;
  title: string;
  href: string;
  actorLabel: string;
  dateLabel: string;
}

export type DashboardCreatorAnalyticsData =
  | {
      state: "ready";
      stats: Array<{
        key: "revenue" | "resources" | "downloads";
        label: string;
        value: string;
        detail: string;
      }>;
      topResources: DashboardCreatorAnalyticsTopResourceRow[];
      recentSales: DashboardCreatorAnalyticsRecentSaleRow[];
      recentDownloads: DashboardCreatorAnalyticsRecentDownloadRow[];
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
  if (status === "COMPLETED") return "success";
  if (status === "PENDING") return "warning";
  return "neutral";
}

function toStatusLabel(status: string) {
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export async function getDashboardCreatorAnalyticsData(input: {
  userId: string;
}): Promise<DashboardCreatorAnalyticsData> {
  try {
    const access = await getCreatorAccessState(input.userId);

    if (!canAccessCreatorWorkspace(access)) {
      return {
        state: "locked",
        title: "Creator access is not active",
        description:
          "Apply for creator access before reviewing downloads, revenue, and recent creator activity.",
        ctaHref: routes.dashboardCreatorApply,
        ctaLabel: "Apply for creator access",
      };
    }

    const analytics = await getCreatorAnalytics(input.userId, "30d");

    return {
      state: "ready",
      stats: [
        {
          key: "revenue",
          label: "Creator share",
          value: formatMoneyCents(analytics.summary.creatorShare),
          detail: `${formatMoneyCents(analytics.summary.grossRevenue)} gross`,
        },
        {
          key: "resources",
          label: "Published resources",
          value: formatNumber(analytics.summary.publishedResources),
          detail: `${formatNumber(analytics.summary.totalSales)} sales`,
        },
        {
          key: "downloads",
          label: "Downloads",
          value: formatNumber(analytics.summary.totalDownloads),
          detail: "Last 30 days activity",
        },
      ],
      topResources: analytics.topByRevenue.map((resource) => ({
        id: resource.id,
        title: resource.title,
        href: routes.dashboardCreatorResource(resource.id),
        revenueLabel: formatMoneyCents(resource.revenue),
        salesLabel: formatNumber(resource.salesCount),
        downloadsLabel: formatNumber(resource.downloadCount),
      })),
      recentSales: analytics.recentSales.map((sale) => ({
        id: sale.id,
        title: sale.resourceTitle,
        href: routes.resource(sale.resourceSlug),
        buyerLabel: sale.buyerName,
        amountLabel: formatMoneyCents(sale.amount),
        shareLabel: formatMoneyCents(sale.creatorShare),
        statusLabel: toStatusLabel(sale.status),
        statusTone: toStatusTone(sale.status),
        dateLabel: formatDate(sale.createdAt),
      })),
      recentDownloads: analytics.recentDownloads.map((download) => ({
        id: download.id,
        title: download.resourceTitle,
        href: routes.resource(download.resourceSlug),
        actorLabel: download.userId ? "Signed-in learner" : "Unknown learner",
        dateLabel: formatDate(download.createdAt),
      })),
    };
  } catch {
    return {
      state: "error",
      title: "Could not load analytics",
      description:
        "Try refreshing this route. Creator analytics remains protected behind the dashboard session gate.",
    };
  }
}
