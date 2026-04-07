import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { getCreatorAccessState } from "@/services/creator";
import { getCachedServerSession } from "@/lib/auth";
import { traceServerStep } from "@/lib/performance/observability";

interface DashboardGroupLayoutContentProps {
  children: ReactNode;
}

const CREATOR_ACCESS_FALLBACK = {
  eligible: false,
  canCreate: false,
  role: null as null,
  resourceCount: 0,
  creatorEnabled: false,
  creatorStatus: "INACTIVE" as const,
  applicationStatus: "NOT_APPLIED" as const,
};

/**
 * Resolve dashboard shell viewer state behind a family-scoped Suspense boundary
 * so hard refreshes land on the dashboard loading shell rather than the app root
 * fallback while the session/creator state is loading.
 */
export default async function DashboardGroupLayoutContent({
  children,
}: DashboardGroupLayoutContentProps) {
  const session = await traceServerStep(
    "dashboard_layout.getServerSession",
    () => getCachedServerSession(),
  );

  const creatorAccess = session?.user?.id
    ? await traceServerStep(
        "dashboard_layout.getCreatorAccessState",
        () =>
          getCreatorAccessState(session.user.id).catch(
            () => CREATOR_ACCESS_FALLBACK,
          ),
        { userId: session.user.id },
      )
    : CREATOR_ACCESS_FALLBACK;

  const user = {
    name: session?.user?.name ?? null,
    email: session?.user?.email ?? null,
    image: session?.user?.image ?? null,
    subscriptionStatus: session?.user?.subscriptionStatus ?? "INACTIVE",
    role: session?.user?.role ?? null,
    isCreator: creatorAccess.eligible,
    canCreateResources: creatorAccess.canCreate,
    creatorEnabled: creatorAccess.creatorEnabled,
  };

  return <DashboardLayout user={user}>{children}</DashboardLayout>;
}
