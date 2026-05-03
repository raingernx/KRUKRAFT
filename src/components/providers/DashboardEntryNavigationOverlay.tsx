"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingSkeleton } from "@/design-system";
import { useDashboardNavigationState } from "@/components/layout/dashboard/dashboardNavigationState";
import {
  getDashboardReadySelector,
  isDashboardGroupHref,
  isDashboardGroupPath,
} from "@/components/providers/dashboardNavigationOverlayShared";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";

const MIN_ENTRY_PENDING_MS = 220;

function DashboardOverlayFallback() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <div className="flex min-h-dvh">
        <aside className="hidden w-72 shrink-0 border-r border-border-subtle bg-card lg:flex lg:flex-col">
          <div className="border-b border-border-subtle px-5 py-4">
            <LoadingSkeleton className="h-[36px] w-[148px] rounded-lg" />
          </div>
          <div className="flex-1 px-3 py-5">
            <LoadingSkeleton className="h-full w-full rounded-2xl" />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border-subtle bg-background/95 px-4 pt-3 pb-3 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <LoadingSkeleton className="size-11 rounded-xl lg:hidden" />
              <div className="min-w-0 flex-1">
                <LoadingSkeleton className="h-11 w-full max-w-2xl rounded-xl" />
              </div>
              <LoadingSkeleton className="size-11 rounded-xl" />
              <LoadingSkeleton className="size-11 rounded-full" />
            </div>
          </header>
        </div>
      </div>
    </div>
  );
}

const DashboardAppShellSkeleton = dynamic(
  () =>
    import("@/components/skeletons/DashboardAppPrototypeSkeleton").then(
      (mod) => mod.DashboardAppShellSkeleton,
    ),
  {
    loading: () => <DashboardOverlayFallback />,
  },
);

export function DashboardEntryNavigationOverlay() {
  const pathname = usePathname();
  const navigationState = useDashboardNavigationState();
  const previousPathRef = useRef(pathname);
  const forcedOverlayStartedAtRef = useRef(0);
  const [forcedOverlay, setForcedOverlay] = useState(false);
  const isCrossingIntoDashboard =
    Boolean(navigationState.href) &&
    Boolean(navigationState.overlay) &&
    isDashboardGroupHref(navigationState.href ?? "") &&
    !isDashboardGroupPath(pathname ?? "");
  const crossedIntoDashboard =
    isDashboardGroupPath(pathname ?? "") &&
    !isDashboardGroupPath(previousPathRef.current ?? "");

  useEffect(() => {
    if (crossedIntoDashboard) {
      forcedOverlayStartedAtRef.current = Date.now();
      setForcedOverlay(true);
    } else if (!isDashboardGroupPath(pathname ?? "")) {
      forcedOverlayStartedAtRef.current = 0;
      setForcedOverlay(false);
    }

    previousPathRef.current = pathname;
  }, [crossedIntoDashboard, pathname]);

  useEffect(() => {
    if (!forcedOverlay) {
      return;
    }

    return waitForNavigationSurfaceReady(
      getDashboardReadySelector(pathname, navigationState.href),
      () => {
        setForcedOverlay(false);
      },
      MIN_ENTRY_PENDING_MS,
      forcedOverlayStartedAtRef.current || navigationState.startedAt || Date.now(),
    );
  }, [forcedOverlay, navigationState.href, navigationState.startedAt, pathname]);

  if (!isCrossingIntoDashboard && !forcedOverlay && !crossedIntoDashboard) {
    return null;
  }

  return (
    <div
      data-loading-scope="dashboard-group"
      className="pointer-events-none fixed inset-0 z-[84] bg-background"
    >
      <DashboardAppShellSkeleton />
    </div>
  );
}
