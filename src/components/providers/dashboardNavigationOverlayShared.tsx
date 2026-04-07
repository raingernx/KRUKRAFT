import { DashboardGroupLoadingShell } from "@/components/skeletons/DashboardGroupLoadingShell";
import {
  DashboardDownloadsSkeleton,
  DashboardLibrarySkeleton,
  DashboardOverviewSkeleton,
  DashboardPurchasesSkeleton,
  DashboardResourcesRedirectSkeleton,
  DashboardSubscriptionSkeleton,
} from "@/components/skeletons/DashboardUserRouteSkeletons";
import {
  CreatorDashboardAnalyticsLoadingShell,
  CreatorDashboardOverviewLoadingShell,
  CreatorDashboardProfileLoadingShell,
  CreatorDashboardResourcesLoadingShell,
  CreatorDashboardSalesLoadingShell,
} from "@/components/skeletons/CreatorDashboardRouteSkeletons";
import { CreatorApplyPageSkeleton } from "@/components/skeletons/CreatorApplyPageSkeleton";
import { CreatorResourceNewRouteSkeleton } from "@/components/skeletons/CreatorResourceNewRouteSkeleton";
import { SettingsPageSkeleton } from "@/components/skeletons/SettingsPageSkeleton";
import { routes } from "@/lib/routes";

export function isDashboardGroupHref(href: string) {
  return (
    href === "/dashboard" ||
    href === "/settings" ||
    href === "/subscription" ||
    href === "/purchases" ||
    href.startsWith("/dashboard/")
  );
}

export function isDashboardGroupPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return isDashboardGroupHref(pathname);
}

export function renderDashboardOverlayContent(
  pathname: string | null,
  href: string | null,
) {
  const target = href ?? pathname ?? "";
  const targetPathname = target
    ? new URL(target, "http://dashboard.local").pathname
    : "";

  if (targetPathname === routes.library) {
    return <DashboardLibrarySkeleton />;
  }

  if (targetPathname === routes.downloads) {
    return <DashboardDownloadsSkeleton />;
  }

  if (targetPathname === routes.purchases) {
    return <DashboardPurchasesSkeleton />;
  }

  if (targetPathname === routes.subscription) {
    return <DashboardSubscriptionSkeleton />;
  }

  if (targetPathname === routes.settings) {
    return <SettingsPageSkeleton />;
  }

  if (targetPathname === routes.dashboardResources) {
    return <DashboardResourcesRedirectSkeleton />;
  }

  if (targetPathname === routes.creatorApply) {
    return <CreatorApplyPageSkeleton />;
  }

  if (targetPathname === routes.creatorDashboard) {
    return <CreatorDashboardOverviewLoadingShell />;
  }

  if (targetPathname === routes.creatorAnalytics) {
    return <CreatorDashboardAnalyticsLoadingShell />;
  }

  if (targetPathname === routes.creatorResources) {
    return <CreatorDashboardResourcesLoadingShell />;
  }

  if (
    targetPathname === routes.creatorNewResource ||
    targetPathname.startsWith(`${routes.creatorResources}/`)
  ) {
    return <CreatorResourceNewRouteSkeleton />;
  }

  if (targetPathname === routes.creatorSales) {
    return <CreatorDashboardSalesLoadingShell />;
  }

  if (
    targetPathname === routes.creatorProfile ||
    targetPathname === "/dashboard/creator/settings"
  ) {
    return <CreatorDashboardProfileLoadingShell />;
  }

  if (targetPathname === routes.dashboard || targetPathname.startsWith("/dashboard/")) {
    return <DashboardOverviewSkeleton />;
  }

  return <DashboardGroupLoadingShell />;
}
