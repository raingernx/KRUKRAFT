import { redirect } from "next/navigation";

import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getCreatorProfile } from "@/services/creator";

export const metadata = {
  title: "Creator Storefront",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorStorefrontPage() {
  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorStorefront,
  );
  const profile = await getCreatorProfile(userId);

  redirect(
    profile?.creatorSlug
      ? routes.creatorPublicProfile(profile.creatorSlug)
      : routes.dashboardCreatorProfile,
  );
}
