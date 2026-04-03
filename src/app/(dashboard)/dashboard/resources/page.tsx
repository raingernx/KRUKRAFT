import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { canAccessCreatorWorkspace, getCreatorAccessState } from "@/services/creator";

export const metadata = {
  title: "My Resources",
};

export const dynamic = "force-dynamic";

export default async function DashboardResourcesCompatibilityPage() {
  const { userId } = await requireSession(routes.dashboardResources);

  const access = await getCreatorAccessState(userId);
  redirect(canAccessCreatorWorkspace(access) ? routes.creatorResources : routes.creatorApply);
}
