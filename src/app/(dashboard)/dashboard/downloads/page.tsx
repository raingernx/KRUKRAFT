import { DashboardDownloadsContent } from "@/components/dashboard/DashboardSections";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardDownloadsData } from "@/services/dashboard/downloads.service";

export const metadata = {
  title: "Downloads",
};

export const dynamic = "force-dynamic";

export default async function DashboardDownloadsPage() {
  const { userId } = await requireSession(routes.dashboardDownloads);
  const data = await getDashboardDownloadsData({ userId });

  return <DashboardDownloadsContent data={data} />;
}
