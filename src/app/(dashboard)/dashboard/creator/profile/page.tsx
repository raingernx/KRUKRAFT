import { DashboardCreatorProfileContent } from "@/components/dashboard/routes/DashboardCreatorProfileRoute";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorProfileData } from "@/services/dashboard/creator-profile.service";

export const metadata = {
  title: "Creator Profile",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorProfilePage() {
  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorProfile,
  );
  const data = await getDashboardCreatorProfileData(userId);

  return <DashboardCreatorProfileContent data={data} />;
}
