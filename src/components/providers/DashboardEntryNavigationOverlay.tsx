"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardGroupLoadingShell } from "@/components/skeletons/DashboardGroupLoadingShell";
import { useDashboardNavigationState } from "@/components/layout/dashboard/dashboardNavigationState";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";
import {
  isDashboardGroupHref,
  isDashboardGroupPath,
  renderDashboardOverlayContent,
} from "@/components/providers/dashboardNavigationOverlayShared";

const DASHBOARD_ROUTE_SHELL_SELECTOR = '[data-route-shell-ready="dashboard"]';

export function DashboardEntryNavigationOverlay() {
  const pathname = usePathname();
  const navigationState = useDashboardNavigationState();
  const previousPathRef = useRef(pathname);
  const [armedOverlayId, setArmedOverlayId] = useState(0);
  const [forcedOverlay, setForcedOverlay] = useState(false);
  const targetHref = navigationState.href;
  const isCrossingIntoDashboard =
    Boolean(targetHref) &&
    Boolean(navigationState.overlay) &&
    isDashboardGroupHref(targetHref ?? "") &&
    !isDashboardGroupPath(pathname);
  const crossedIntoDashboard =
    isDashboardGroupPath(pathname) && !isDashboardGroupPath(previousPathRef.current);

  useEffect(() => {
    if (crossedIntoDashboard) {
      setForcedOverlay(true);
    } else if (!isDashboardGroupPath(pathname)) {
      setForcedOverlay(false);
    }

    previousPathRef.current = pathname;
  }, [crossedIntoDashboard, pathname]);

  useEffect(() => {
    if (!isCrossingIntoDashboard) {
      setArmedOverlayId(0);
      return;
    }

    const currentId = navigationState.id;
    const frameId = window.requestAnimationFrame(() => {
      setArmedOverlayId(currentId);
    });

    return () => {
      window.cancelAnimationFrame(frameId);
    };
  }, [isCrossingIntoDashboard, navigationState.id]);

  useEffect(() => {
    if (!forcedOverlay) {
      return;
    }

    return waitForNavigationSurfaceReady(
      DASHBOARD_ROUTE_SHELL_SELECTOR,
      () => {
        setForcedOverlay(false);
      },
      0,
      Date.now(),
    );
  }, [forcedOverlay]);

  const stateDrivenOverlay = isCrossingIntoDashboard && armedOverlayId === navigationState.id;

  if (!stateDrivenOverlay && !forcedOverlay && !crossedIntoDashboard) {
    return null;
  }

  const overlayContent = renderDashboardOverlayContent(pathname, navigationState.href);
  const shouldWrapInDashboardShell = overlayContent.type !== DashboardGroupLoadingShell;

  return (
    <div
      data-loading-scope="dashboard-group"
      className="fixed inset-0 z-[85] bg-background"
    >
      {shouldWrapInDashboardShell
        ? <DashboardGroupLoadingShell>{overlayContent}</DashboardGroupLoadingShell>
        : overlayContent}
    </div>
  );
}
