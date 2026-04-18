import { DashboardMembershipStreamedContent } from "@/components/dashboard/DashboardSections";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getDashboardMembershipData } from "@/services/dashboard/membership.service";

export const metadata = {
  title: "Membership",
};

export const dynamic = "force-dynamic";

type DashboardMembershipPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardMembershipPage({
  searchParams,
}: DashboardMembershipPageProps) {
  const { userId, session } = await requireSession(routes.dashboardMembership);
  const params = searchParams ? await searchParams : {};
  const subscriptionState =
    typeof params.subscription === "string" ? params.subscription : null;
  const dataPromise = getDashboardMembershipData({
    userId,
    fallbackSubscriptionStatus: session.user.subscriptionStatus ?? null,
  });

  return (
    <DashboardMembershipStreamedContent
      dataPromise={dataPromise}
      subscriptionState={subscriptionState}
    />
  );
}
