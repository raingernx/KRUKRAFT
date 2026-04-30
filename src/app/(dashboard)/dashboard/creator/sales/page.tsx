import { DashboardCreatorSalesContent } from "@/components/dashboard/routes/DashboardCreatorProtectedRoutes";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorEarningsData } from "@/services/dashboard/creator-earnings.service";

export const metadata = {
  title: "Creator Earnings",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorSalesPage() {
  const { userId, access } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorSales,
  );
  const data = await getDashboardCreatorEarningsData({ userId, access });

  return <DashboardCreatorSalesContent data={data} />;
}
