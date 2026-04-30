import { DashboardCreatorResourceEditorContent } from "@/components/dashboard/routes/DashboardCreatorResourcesRoute";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorEditorData } from "@/services/dashboard/creator-editor.service";

export const metadata = {
  title: "Edit Resource",
};

export default async function DashboardCreatorResourcePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{
    focus?: string;
    __forceRouteError?: string;
    __delayMs?: string;
  }>;
}) {
  const { id } = await params;
  const { focus, __forceRouteError, __delayMs } = await searchParams;

  if (process.env.NODE_ENV !== "production") {
    if (__forceRouteError === "1") {
      throw new Error("Forced dashboard creator editor route error");
    }

    const delayMs = Number(__delayMs);
    if (Number.isFinite(delayMs) && delayMs > 0) {
      const boundedDelay = Math.min(delayMs, 5000);
      await new Promise((resolve) => setTimeout(resolve, boundedDelay));
    }
  }

  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorResource(id),
  );
  const data = await getDashboardCreatorEditorData({
    userId,
    mode: "edit",
    resourceId: id,
    focus,
  });

  return (
    <DashboardCreatorResourceEditorContent
      mode="edit"
      resourceId={id}
      data={data}
    />
  );
}
