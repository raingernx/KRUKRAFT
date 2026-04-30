import { DashboardCreatorAnalyticsContent } from "@/components/dashboard/routes/DashboardCreatorAnalyticsRoute";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorAnalyticsData } from "@/services/dashboard/creator-analytics.service";

export const metadata = {
  title: "Creator Analytics",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorAnalyticsPage() {
  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorAnalytics,
  );
  const data = await getDashboardCreatorAnalyticsData({ userId });

  return <DashboardCreatorAnalyticsContent data={data} />;
}
