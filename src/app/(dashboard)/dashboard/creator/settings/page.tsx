import { redirect } from "next/navigation";

import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Creator Settings",
};

export const dynamic = "force-dynamic";

export default async function DashboardCreatorSettingsPage() {
  await requireCreatorDashboardAccess(routes.dashboardCreatorSettings);
  redirect(routes.dashboardSettings);
}
