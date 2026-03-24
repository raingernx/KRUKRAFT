import { Prisma, PurchaseStatus, ResourceStatus } from "@prisma/client";
import { findCategoriesOrderedByName, findAdminResourcesPage, countMarketplaceResources } from "@/repositories/resources/resource.repository";
import { findAdminUsers } from "@/repositories/users/user.repository";
import { findAdminOrders, findAdminResourcePurchaseSummaries, getAdminOrdersTodayCount, getAdminTotalRevenue } from "@/repositories/purchases/purchase.repository";

type AdminResourceRow = {
  id: string;
  title: string;
  slug: string;
  previewUrl: string | null;
  isFree: boolean;
  price: number;
  status: string;
  createdAt: Date;
  author: {
    name: string | null;
    email: string | null;
  } | null;
  category: {
    id: string;
    name: string;
  } | null;
  downloads: number;
  purchases: number;
  revenue: number;
};

export async function getAdminResourcesPageData(input: {
  q: string;
  statusFilter: string;
  categoryIdFilter: string;
  freeOnly: boolean;
  minRevenueCents: number;
  currentPage: number;
  pageSize: number;
}) {
  const where: Prisma.ResourceWhereInput = { deletedAt: null };

  if (input.q) {
    where.OR = [
      { title: { contains: input.q, mode: "insensitive" } },
      { author: { name: { contains: input.q, mode: "insensitive" } } },
      { author: { email: { contains: input.q, mode: "insensitive" } } },
    ];
  }

  if (["DRAFT", "PUBLISHED", "ARCHIVED"].includes(input.statusFilter)) {
    where.status = input.statusFilter as ResourceStatus;
  }

  if (input.categoryIdFilter) {
    where.categoryId = input.categoryIdFilter;
  }

  const skip = (input.currentPage - 1) * input.pageSize;

  const [resources, totalCount, categories] = await Promise.all([
    findAdminResourcesPage({
      where,
      skip,
      take: input.pageSize,
    }),
    countMarketplaceResources(where),
    findCategoriesOrderedByName(),
  ]);

  const purchaseSummaries = await findAdminResourcePurchaseSummaries(
    resources.map((resource) => resource.id),
  );

  const purchaseSummaryByResourceId = new Map(
    purchaseSummaries.map((row) => [
      row.resourceId,
      {
        purchases: row._count._all,
        revenue: row._sum.amount ?? 0,
      },
    ]),
  );

  let rows: AdminResourceRow[] = resources.map((resource) => {
    const purchaseSummary = purchaseSummaryByResourceId.get(resource.id);

    return {
      id: resource.id,
      title: resource.title,
      slug: resource.slug,
      previewUrl: resource.previewUrl ?? null,
      isFree: resource.isFree,
      price: resource.price,
      status: resource.status,
      createdAt: resource.createdAt,
      author: resource.author,
      category: resource.category,
      downloads: resource.downloadCount,
      purchases: purchaseSummary?.purchases ?? 0,
      revenue: purchaseSummary?.revenue ?? 0,
    };
  });

  if (input.freeOnly) {
    rows = rows.filter((row) => row.isFree || row.price === 0);
  }

  if (input.minRevenueCents > 0) {
    rows = rows.filter((row) => row.revenue >= input.minRevenueCents);
  }

  return {
    rows,
    categories: categories.map((category) => ({ id: category.id, name: category.name })),
    totalCount,
    totalPages: Math.max(1, Math.ceil(totalCount / input.pageSize)),
    hasFilters: Boolean(input.q || input.statusFilter || input.categoryIdFilter),
  };
}

export async function getAdminUsersPageData(input: {
  query: string;
  take?: number;
}) {
  return findAdminUsers({
    query: input.query,
    take: input.take ?? 50,
  });
}

export async function getAdminOrdersPageData(input: {
  statusFilter: string;
  from: Date | null;
  to: Date | null;
  take?: number;
}) {
  const where: Prisma.PurchaseWhereInput = {};

  if (input.statusFilter && ["COMPLETED", "REFUNDED", "FAILED"].includes(input.statusFilter)) {
    where.status = input.statusFilter as PurchaseStatus;
  }

  if (input.from || input.to) {
    where.createdAt = {};

    if (input.from && !Number.isNaN(input.from.getTime())) {
      where.createdAt.gte = input.from;
    }

    if (input.to && !Number.isNaN(input.to.getTime())) {
      where.createdAt.lte = input.to;
    }
  }

  const [orders, revenueAgg, ordersTodayAgg] = await Promise.all([
    findAdminOrders({
      where,
      take: input.take ?? 50,
    }),
    getAdminTotalRevenue(),
    getAdminOrdersTodayCount(),
  ]);

  const totalRevenue = revenueAgg._sum.amount ?? 0;
  const ordersToday = ordersTodayAgg._count ?? 0;
  const completedOrders = orders.filter((order) => order.status === "COMPLETED");
  const averageOrderValue =
    completedOrders.length > 0
      ? completedOrders.reduce((sum, order) => sum + order.amount, 0) /
        completedOrders.length
      : 0;

  return {
    orders,
    totalRevenue,
    ordersToday,
    averageOrderValue,
  };
}
