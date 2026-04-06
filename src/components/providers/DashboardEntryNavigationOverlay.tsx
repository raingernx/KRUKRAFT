"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { DashboardGroupLoadingShell } from "@/components/skeletons/DashboardGroupLoadingShell";
import { useDashboardNavigationState } from "@/components/layout/dashboard/dashboardNavigationState";

function isDashboardGroupHref(href: string) {
  return (
    href === "/dashboard" ||
    href === "/settings" ||
    href === "/subscription" ||
    href === "/purchases" ||
    href.startsWith("/dashboard/")
  );
}

function isDashboardGroupPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return isDashboardGroupHref(pathname);
}

export function DashboardEntryNavigationOverlay() {
  const pathname = usePathname();
  const navigationState = useDashboardNavigationState();
  const [armedOverlayId, setArmedOverlayId] = useState(0);
  const targetHref = navigationState.href;
  const isCrossingIntoDashboard =
    Boolean(targetHref) &&
    Boolean(navigationState.overlay) &&
    isDashboardGroupHref(targetHref ?? "") &&
    !isDashboardGroupPath(pathname);

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

  if (!isCrossingIntoDashboard || armedOverlayId !== navigationState.id) {
    return null;
  }

  return (
    <div
      data-loading-scope="dashboard-group"
      className="fixed inset-0 z-[85] bg-background"
    >
      <DashboardGroupLoadingShell />
    </div>
  );
}
