import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { requireSession } from "@/lib/auth/require-session";
import { routes } from "@/lib/routes";
import { getCreatorAccessState } from "@/services/creator.service";

export const metadata = {
  title: "My Resources",
};

export const dynamic = "force-dynamic";

export default async function DashboardResourcesCompatibilityPage() {
  const { userId } = await requireSession("/dashboard/resources");

  const access = await getCreatorAccessState(userId);
  redirect(access.eligible ? routes.creatorResources : routes.creatorApply);
}
