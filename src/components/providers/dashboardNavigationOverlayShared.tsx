import { routes } from "@/lib/routes";

const DASHBOARD_ROUTE_SHELL_SELECTOR = '[data-route-shell-ready="dashboard"]';
const DASHBOARD_CREATOR_ROUTE_SHELL_SELECTOR =
  '[data-route-shell-ready^="dashboard-creator"]';

function getDashboardTargetPathname(pathname: string | null, href: string | null) {
  const target = href ?? pathname ?? "";

  if (!target) {
    return "";
  }

  return new URL(target, "http://dashboard.local").pathname;
}

export function isDashboardGroupHref(href: string) {
  const pathname = new URL(href, "http://dashboard.local").pathname;

  return (
    pathname === routes.dashboard ||
    pathname === routes.dashboardLibrary ||
    pathname === routes.dashboardDownloads ||
    pathname === routes.dashboardPurchases ||
    pathname === routes.dashboardSettings ||
    pathname === routes.dashboardMembership ||
    pathname.startsWith(`${routes.dashboard}/`)
  );
}

export function isDashboardGroupPath(pathname: string | null) {
  if (!pathname) {
    return false;
  }

  return isDashboardGroupHref(pathname);
}

export function getDashboardReadySelector(pathname: string | null, href: string | null) {
  const targetPathname = getDashboardTargetPathname(pathname, href);

  if (targetPathname === routes.dashboard) {
    return '[data-route-shell-ready="dashboard-overview"]';
  }

  if (targetPathname === routes.dashboardLibrary) {
    return '[data-route-shell-ready="dashboard-library"]';
  }

  if (targetPathname === routes.dashboardDownloads) {
    return '[data-route-shell-ready="dashboard-downloads"]';
  }

  if (targetPathname === routes.dashboardPurchases) {
    return '[data-route-shell-ready="dashboard-purchases"]';
  }

  if (targetPathname === routes.dashboardSettings) {
    return '[data-route-shell-ready="dashboard-settings"]';
  }

  if (targetPathname === routes.dashboardMembership) {
    return '[data-route-shell-ready="dashboard-subscription"]';
  }

  if (targetPathname === routes.dashboardCreatorApply) {
    return '[data-route-shell-ready="dashboard-creator-apply"]';
  }

  if (targetPathname === routes.dashboardCreator) {
    return '[data-route-shell-ready="dashboard-creator-overview"]';
  }

  if (targetPathname === routes.dashboardCreatorAnalytics) {
    return '[data-route-shell-ready="dashboard-creator-analytics"]';
  }

  if (targetPathname === routes.dashboardCreatorResources) {
    return '[data-route-shell-ready="dashboard-creator-resources"]';
  }

  if (
    targetPathname === routes.dashboardCreatorNewResource ||
    targetPathname.startsWith(`${routes.dashboardCreatorResources}/`)
  ) {
    return '[data-route-shell-ready="dashboard-creator-resource-editor"]';
  }

  if (targetPathname === routes.dashboardCreatorSales) {
    return '[data-route-shell-ready="dashboard-creator-sales"]';
  }

  if (targetPathname === routes.dashboardCreatorPayouts) {
    return '[data-route-shell-ready="dashboard-creator-payouts"]';
  }

  if (targetPathname === routes.dashboardCreatorStorefront) {
    return '[data-route-shell-ready="dashboard-creator-profile"]';
  }

  if (targetPathname === routes.dashboardCreatorProfile) {
    return '[data-route-shell-ready="dashboard-creator-profile"]';
  }

  if (targetPathname === routes.dashboardCreatorSettings) {
    return '[data-route-shell-ready="dashboard-settings"]';
  }

  if (targetPathname.startsWith(`${routes.dashboardCreator}/`)) {
    return DASHBOARD_CREATOR_ROUTE_SHELL_SELECTOR;
  }

  return DASHBOARD_ROUTE_SHELL_SELECTOR;
}
