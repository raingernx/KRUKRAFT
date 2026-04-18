import { DashboardLibraryContent } from "@/components/dashboard/DashboardSections";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardLibraryData } from "@/services/dashboard/library.service";

export const metadata = {
  title: "Library",
};

export const dynamic = "force-dynamic";

export default async function DashboardLibraryPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
  }) {
  const params = searchParams ? await searchParams : {};
  const { userId } = await requireSession(routes.dashboardLibrary);
  const data = await getDashboardLibraryData({
    userId,
    rawQuery: params.q,
    rawFilter: params.filter,
    rawPayment: params.payment,
  });

  return <DashboardLibraryContent data={data} />;
}
