import { DashboardCreatorPayoutsContent } from "@/components/dashboard/routes/DashboardCreatorProtectedRoutes";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorEarningsData } from "@/services/dashboard/creator-earnings.service";

export const metadata = {
  title: "Creator Payouts",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorPayoutsPage() {
  const { userId, access } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorPayouts,
  );
  const data = await getDashboardCreatorEarningsData({ userId, access });

  return <DashboardCreatorPayoutsContent data={data} />;
}
