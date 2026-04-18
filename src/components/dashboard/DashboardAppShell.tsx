import type { ReactNode } from "react";

import { getServerAuthTokenSnapshot } from "@/lib/auth/token-snapshot";
import {
  DashboardAppSidebar,
  DashboardAppTopbar,
  type DashboardAppViewer,
} from "@/components/dashboard/DashboardAppNavigation";
import { DashboardNavigationReady } from "@/components/layout/dashboard/DashboardNavigationReady";
import { DashboardOverlayReady } from "@/components/layout/dashboard/DashboardOverlayReady";
import {
  resolveDashboardNavState,
} from "@/lib/dashboard/dashboard-permissions";
import {
  canAccessCreatorWorkspace,
  getCreatorAccessState,
} from "@/services/creator";

async function getDashboardAppViewer(): Promise<DashboardAppViewer> {
  const auth = await getServerAuthTokenSnapshot();
  const displayName =
    auth.name?.trim() ||
    auth.email?.trim().split("@")[0] ||
    "Guest preview";

  let creatorEnabled = auth.role === "INSTRUCTOR";
  if (!creatorEnabled && auth.userId && auth.role !== "ADMIN") {
    const creatorAccess = await getCreatorAccessState(auth.userId).catch(() => null);
    creatorEnabled = canAccessCreatorWorkspace(creatorAccess);
  }

  const { creatorNavMode } = resolveDashboardNavState({
    area: "dashboard",
    role: auth.role,
    isCreator: creatorEnabled,
  });

  return {
    displayName,
    email: auth.email?.trim() ?? null,
    image: auth.image ?? null,
    creatorPublicHref: null,
    creatorNavMode,
    role: auth.role,
    subscriptionStatus: auth.subscriptionStatus,
    isAuthenticated: auth.authenticated,
  };
}

export async function DashboardAppShell({ children }: { children: ReactNode }) {
  const viewer = await getDashboardAppViewer();

  return (
    <div className="min-h-dvh bg-background text-foreground">
      <DashboardNavigationReady />
      <DashboardOverlayReady />
      <div className="flex min-h-dvh">
        <DashboardAppSidebar viewer={viewer} />
        <div className="flex min-w-0 flex-1 flex-col">
          <DashboardAppTopbar viewer={viewer} />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
