"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  canonicalizeDashboardHref,
  clearDashboardNavigation,
  useDashboardNavigationState,
} from "./dashboardNavigationState";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";

const MIN_PENDING_MS = 220;
const DASHBOARD_ROUTE_SHELL_SELECTOR = '[data-route-shell-ready="dashboard"]';

export function DashboardOverlayReady() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationState = useDashboardNavigationState();
  const currentSearch = searchParams.toString();
  const currentHref = canonicalizeDashboardHref(
    currentSearch ? `${pathname}?${currentSearch}` : pathname,
  );

  useEffect(() => {
    if (!navigationState.href || !navigationState.overlay) {
      return;
    }

    if (currentHref !== navigationState.href) {
      return;
    }

    return waitForNavigationSurfaceReady(
      DASHBOARD_ROUTE_SHELL_SELECTOR,
      () => {
        clearDashboardNavigation(navigationState.id);
      },
      MIN_PENDING_MS,
      navigationState.startedAt,
    );
  }, [currentHref, navigationState]);

  return null;
}
