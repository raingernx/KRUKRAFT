import { DashboardCreatorResourceEditorContent } from "@/components/dashboard/routes/DashboardCreatorResourceEditorRoute";
import { requireCreatorDashboardAccess } from "@/lib/auth/require-creator-dashboard-access";
import { routes } from "@/lib/routes";
import { getDashboardCreatorEditorData } from "@/services/dashboard/creator-editor.service";

export const metadata = {
  title: "New Resource",
};

async function applyDashboardCreatorEditorProbe(
  searchParams:
    | Promise<{ __forceRouteError?: string; __delayMs?: string }>
    | undefined,
) {
  if (process.env.NODE_ENV === "production" || !searchParams) {
    return;
  }

  const { __forceRouteError, __delayMs } = await searchParams;

  if (__forceRouteError === "1") {
    throw new Error("Forced dashboard creator editor route error");
  }

  const delayMs = Number(__delayMs);
  if (Number.isFinite(delayMs) && delayMs > 0) {
    const boundedDelay = Math.min(delayMs, 5000);
    await new Promise((resolve) => setTimeout(resolve, boundedDelay));
  }
}

export default async function DashboardCreatorNewResourcePage({
  searchParams,
}: {
  searchParams?: Promise<{ __forceRouteError?: string; __delayMs?: string }>;
}) {
  await applyDashboardCreatorEditorProbe(searchParams);
  const { userId } = await requireCreatorDashboardAccess(
    routes.dashboardCreatorNewResource,
  );
  const data = await getDashboardCreatorEditorData({
    userId,
    mode: "new",
  });

  return <DashboardCreatorResourceEditorContent mode="new" data={data} />;
}
