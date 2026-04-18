import { DashboardPurchasesContent } from "@/components/dashboard/DashboardSections";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardPurchasesData } from "@/services/dashboard/purchases.service";

export const metadata = {
  title: "Purchases",
};

export const dynamic = "force-dynamic";

export default async function DashboardPurchasesPage() {
  const { userId } = await requireSession(routes.dashboardPurchases);
  const data = await getDashboardPurchasesData({ userId });

  return <DashboardPurchasesContent data={data} />;
}
