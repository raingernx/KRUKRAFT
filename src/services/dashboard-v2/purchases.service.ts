import { formatPrice } from "@/lib/format";
import {
  getUserPurchaseHistoryRecentWindow,
  getUserPurchaseHistorySurfaceSummary,
} from "@/services/purchases/purchase.service";

const DASHBOARD_V2_PURCHASES_VISIBLE_LIMIT = 25;

export interface DashboardV2PurchaseItem {
  id: string;
  amount: number;
  status: string;
  createdAt: Date;
  resource: {
    title: string;
    slug: string;
    previewUrl: string | null;
    isFree: boolean;
    authorName: string | null;
  };
}

export interface DashboardV2PurchasesData {
  state: "ready" | "empty" | "error";
  orderCount: number;
  visibleCount: number;
  completedCount: number;
  totalSpentLabel: string;
  purchases: DashboardV2PurchaseItem[];
  errorTitle?: string;
  errorDescription?: string;
}

export function getDashboardV2PurchaseReference(id: string) {
  return `Order #${id.slice(0, 8).toUpperCase()}`;
}

export async function getDashboardV2PurchasesData(input: {
  userId: string;
}): Promise<DashboardV2PurchasesData> {
  try {
    const [summary, purchases] = await Promise.all([
      getUserPurchaseHistorySurfaceSummary(input.userId),
      getUserPurchaseHistoryRecentWindow(
        input.userId,
        DASHBOARD_V2_PURCHASES_VISIBLE_LIMIT,
      ),
    ]);

    if (summary.count === 0) {
      return {
        state: "empty",
        orderCount: 0,
        visibleCount: 0,
        completedCount: 0,
        totalSpentLabel: formatPrice(0),
        purchases: [],
      };
    }

    return {
      state: "ready",
      orderCount: summary.count,
      visibleCount: purchases.length,
      completedCount: summary.completedCount,
      totalSpentLabel: formatPrice(summary.totalSpentCents / 100),
      purchases: purchases.map((purchase) => ({
        id: purchase.id,
        amount: purchase.amount,
        status: purchase.status,
        createdAt: purchase.createdAt,
        resource: {
          title: purchase.resource.title,
          slug: purchase.resource.slug,
          previewUrl: purchase.resource.previewUrl ?? null,
          isFree: purchase.resource.isFree,
          authorName: purchase.resource.author?.name ?? null,
        },
      })),
    };
  } catch {
    return {
      state: "error",
      orderCount: 0,
      visibleCount: 0,
      completedCount: 0,
      totalSpentLabel: formatPrice(0),
      purchases: [],
      errorTitle: "Could not load purchases",
      errorDescription:
        "Try refreshing this page. Your payment history is still preserved even if this view failed to load.",
    };
  }
}
