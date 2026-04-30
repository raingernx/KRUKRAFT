import { DashboardHomeContent } from "@/components/dashboard/routes/DashboardHomeRoute";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardHomeData } from "@/services/dashboard/home.service";

export const metadata = {
  title: {
    absolute: "Home | Dashboard | Krukraft",
  },
};

export const dynamic = "force-dynamic";

export default async function DashboardOverviewPage() {
  const { userId, session } = await requireSession(routes.dashboard);
  const data = await getDashboardHomeData({
    userId,
    displayName: session.user.name ?? null,
    fallbackSubscriptionStatus: session.user.subscriptionStatus ?? null,
  });

  return <DashboardHomeContent data={data} />;
}
