import { DashboardCreatorResourcesContent } from "@/components/dashboard/routes/DashboardCreatorResourceInventoryRoute";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorResourcesData } from "@/services/dashboard/creator-resources.service";

export const metadata = {
  title: "Creator Resources",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorResourcesPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = searchParams ? await searchParams : {};
  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorResources,
  );
  const data = await getDashboardCreatorResourcesData({
    userId,
    rawStatus: params.status,
    rawPricing: params.pricing,
    rawSort: params.sort,
    rawCategory: params.category,
    rawPage: params.page,
  });

  return <DashboardCreatorResourcesContent data={data} />;
}
