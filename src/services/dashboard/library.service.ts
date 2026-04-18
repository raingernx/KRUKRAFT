import { formatDate } from "@/lib/format";
import { routes } from "@/lib/routes";
import { getUserLibraryItems } from "@/services/purchases/purchase.service";

const RECENT_PURCHASE_WINDOW_MS = 15 * 60 * 1000;

export type DashboardLibraryFilterKey =
  | "all"
  | "pdf"
  | "worksheets"
  | "templates";

export interface DashboardLibraryItem {
  purchaseId: string;
  purchasedAt: Date;
  id: string;
  slug: string;
  title: string;
  authorName: string | null;
  previewUrl: string | null;
  mimeType: string | null;
  type: "PDF" | "DOCUMENT";
  categorySlug: string | null;
}

export interface DashboardLibraryRecoveryItem {
  id: string;
  slug: string;
  title: string;
  authorName: string | null;
}

export type DashboardLibraryRecoveryState =
  | { status: "hidden" }
  | { status: "pending" }
  | { status: "confirmed"; item: DashboardLibraryRecoveryItem };

export interface DashboardLibraryData {
  state: "ready" | "empty" | "filtered-empty" | "error";
  query: string;
  filter: DashboardLibraryFilterKey;
  totalOwned: number;
  visibleCount: number;
  lastAddedLabel: string | null;
  continueItem: DashboardLibraryItem | null;
  items: DashboardLibraryItem[];
  recovery: DashboardLibraryRecoveryState;
  errorTitle?: string;
  errorDescription?: string;
}

function normalizeFilter(
  input: string | string[] | undefined,
): DashboardLibraryFilterKey {
  const raw = Array.isArray(input) ? input[0] : input;

  switch (raw) {
    case "pdf":
    case "worksheets":
    case "templates":
      return raw;
    default:
      return "all";
  }
}

function normalizeQuery(input: string | string[] | undefined) {
  const raw = Array.isArray(input) ? input[0] : input;
  return raw?.trim() ?? "";
}

function matchesFilter(
  item: DashboardLibraryItem,
  filter: DashboardLibraryFilterKey,
) {
  if (filter === "all") {
    return true;
  }

  if (filter === "pdf") {
    return item.type === "PDF";
  }

  const categorySlug = item.categorySlug?.toLowerCase() ?? "";

  if (filter === "worksheets") {
    return categorySlug.includes("worksheet");
  }

  if (filter === "templates") {
    return categorySlug.includes("template");
  }

  return true;
}

function matchesQuery(item: DashboardLibraryItem, query: string) {
  if (!query) {
    return true;
  }

  const normalized = query.toLowerCase();
  return (
    item.title.toLowerCase().includes(normalized) ||
    (item.authorName ?? "").toLowerCase().includes(normalized)
  );
}

function getRecoveryState(
  items: DashboardLibraryItem[],
  isReturningFromCheckout: boolean,
): DashboardLibraryRecoveryState {
  if (!isReturningFromCheckout) {
    return { status: "hidden" };
  }

  const mostRecent = items[0] ?? null;
  const isRecentlyCompleted =
    mostRecent !== null &&
    Date.now() - mostRecent.purchasedAt.getTime() < RECENT_PURCHASE_WINDOW_MS;

  if (!isRecentlyCompleted || !mostRecent) {
    return { status: "pending" };
  }

  return {
    status: "confirmed",
    item: {
      id: mostRecent.id,
      slug: mostRecent.slug,
      title: mostRecent.title,
      authorName: mostRecent.authorName,
    },
  };
}

export function getDashboardLibraryHref(params?: {
  q?: string;
  filter?: DashboardLibraryFilterKey;
  payment?: "success" | undefined;
}) {
  const searchParams = new URLSearchParams();

  if (params?.q?.trim()) {
    searchParams.set("q", params.q.trim());
  }

  if (params?.filter && params.filter !== "all") {
    searchParams.set("filter", params.filter);
  }

  if (params?.payment === "success") {
    searchParams.set("payment", "success");
  }

  const query = searchParams.toString();
  return query ? `${routes.dashboardLibrary}?${query}` : routes.dashboardLibrary;
}

export async function getDashboardLibraryData(input: {
  userId: string;
  rawQuery?: string | string[] | undefined;
  rawFilter?: string | string[] | undefined;
  rawPayment?: string | string[] | undefined;
}): Promise<DashboardLibraryData> {
  const query = normalizeQuery(input.rawQuery);
  const filter = normalizeFilter(input.rawFilter);
  const isReturningFromCheckout =
    (Array.isArray(input.rawPayment) ? input.rawPayment[0] : input.rawPayment) ===
    "success";

  try {
    const items = await getUserLibraryItems(input.userId);
    const filteredItems = items.filter(
      (item) => matchesQuery(item, query) && matchesFilter(item, filter),
    );

    if (items.length === 0) {
      return {
        state: "empty",
        query,
        filter,
        totalOwned: 0,
        visibleCount: 0,
        lastAddedLabel: null,
        continueItem: null,
        items: [],
        recovery: { status: "hidden" },
      };
    }

    if (filteredItems.length === 0) {
      return {
        state: "filtered-empty",
        query,
        filter,
        totalOwned: items.length,
        visibleCount: 0,
        lastAddedLabel: formatDate(items[0]?.purchasedAt ?? new Date()),
        continueItem: items[0] ?? null,
        items: [],
        recovery: getRecoveryState(items, isReturningFromCheckout),
      };
    }

    return {
      state: "ready",
      query,
      filter,
      totalOwned: items.length,
      visibleCount: filteredItems.length,
      lastAddedLabel: items[0] ? formatDate(items[0].purchasedAt) : null,
      continueItem: items[0] ?? null,
      items: filteredItems,
      recovery: getRecoveryState(items, isReturningFromCheckout),
    };
  } catch {
    return {
      state: "error",
      query,
      filter,
      totalOwned: 0,
      visibleCount: 0,
      lastAddedLabel: null,
      continueItem: null,
      items: [],
      recovery: { status: "hidden" },
      errorTitle: "Could not load your library",
      errorDescription:
        "Try refreshing this page. If the problem keeps happening, your purchases are still safe.",
    };
  }
}
