import { DashboardCreatorContent } from "@/components/dashboard/DashboardSections";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorOverviewData } from "@/services/dashboard/creator-overview.service";

export const metadata = {
  title: "Creator Workspace",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorWorkspacePage() {
  const { userId, access } = await requireCreatorDashboardAccess(
    routes.dashboardCreator,
  );
  const data = await getDashboardCreatorOverviewData(userId, { access });

  return <DashboardCreatorContent data={data} />;
}
