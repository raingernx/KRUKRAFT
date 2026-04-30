"use client";

import { usePathname, type ReadonlyURLSearchParams } from "next/navigation";
import type { ReactNode } from "react";

import {
  Badge,
  Button,
  SidebarItem,
  SidebarSectionLabel,
} from "@/design-system";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import { Logo } from "@/components/brand/Logo";
import { CORE_DASHBOARD_NAV_SECTIONS } from "@/config/dashboard-nav/dashboard-core";
import {
  getDashboardCreatorNavSection,
  insertDashboardCreatorSection,
} from "@/config/dashboard-nav/creator-nav";
import type { DashboardNavItem } from "@/components/layout/dashboard/dashboard-nav.types";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import { routes } from "@/lib/routes";

type NavKey =
  | "home"
  | "library"
  | "downloads"
  | "purchases"
  | "membership"
  | "settings"
  | "creator"
  | "creator-resources"
  | "creator-earnings";

type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
  activeKey?: NavKey;
} & Pick<DashboardNavItem, "icon">;

type NavGroup = {
  label: string;
  items: NavItem[];
};

const navGroups: NavGroup[] = CORE_DASHBOARD_NAV_SECTIONS.map((section) => ({
  label: section.label,
  items: section.items,
}));

function isBaseNavItemActive(item: DashboardNavItem, pathname: string | null) {
  if (item.exact) {
    return pathname === item.href;
  }

  return pathname === item.href || pathname?.startsWith(`${item.href}/`) === true;
}

function getCreatorNavItemActiveKey(href: string): NavKey | undefined {
  if (href === routes.dashboardCreatorResources) {
    return "creator-resources";
  }

  if (href === routes.dashboardCreatorSales) {
    return "creator-earnings";
  }

  if (
    href === routes.dashboardCreator ||
    href === routes.dashboardCreatorApply
  ) {
    return "creator";
  }

  return undefined;
}

function getActiveKey(pathname: string | null): NavKey {
  if (pathname === routes.dashboardLibrary) return "library";
  if (pathname === routes.dashboardDownloads) return "downloads";
  if (pathname === routes.dashboardPurchases) return "purchases";
  if (pathname === routes.dashboardMembership) return "membership";
  if (pathname === routes.dashboardSettings) return "settings";
  if (pathname === routes.dashboardCreatorResources) return "creator-resources";
  if (pathname?.startsWith(`${routes.dashboardCreatorResources}/`)) {
    return "creator-resources";
  }
  if (pathname === routes.dashboardCreatorAnalytics) return "creator";
  if (pathname === routes.dashboardCreatorSales) return "creator-earnings";
  if (pathname === routes.dashboardCreatorPayouts) return "creator-earnings";
  if (pathname === routes.dashboardCreatorStorefront) return "creator";
  if (pathname === routes.dashboardCreatorProfile) return "creator";
  if (pathname === routes.dashboardCreatorSettings) return "creator";
  if (pathname?.startsWith(routes.dashboardCreator)) return "creator";
  return "home";
}

function SidebarIdentity() {
  return (
    <div className="border-b border-border-subtle px-5 py-4">
      <div className="flex items-center">
        <Logo variant="full" size="navbar" preferRepoAsset className="shrink-0" />
      </div>
    </div>
  );
}

function NavigationList({
  viewer,
  closeOnNavigate = false,
  wrapNavigatedChild,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
  wrapNavigatedChild?: (input: { key: string; child: ReactNode }) => ReactNode;
}) {
  const pathname = usePathname();
  const activeKey = getActiveKey(pathname);
  const prefetchMode = closeOnNavigate ? "intent" : "viewport";
  const prefetchScope = closeOnNavigate
    ? "dashboard-sidebar-drawer"
    : "dashboard-sidebar-rail";
  const creatorSection = getDashboardCreatorNavSection({
    creatorNavMode: viewer.creatorNavMode,
    creatorPublicHref: viewer.creatorPublicHref,
  });
  const creatorGroup = creatorSection
    ? {
        ...creatorSection,
        items: creatorSection.items.map((item) => ({
          ...item,
          activeKey: getCreatorNavItemActiveKey(item.href),
        })),
      }
    : null;
  const groups = insertDashboardCreatorSection(navGroups, creatorGroup);

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <SidebarSectionLabel className="px-3">
            {group.label}
          </SidebarSectionLabel>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = item.activeKey
                ? item.activeKey === activeKey
                : isBaseNavItemActive(item, pathname);
              const link = (
                <SidebarItem
                  key={item.label}
                  active={isActive}
                  asChild
                  aria-current={isActive ? "page" : undefined}
                  icon={item.icon}
                >
                  <IntentPrefetchLink
                    href={item.href}
                    prefetchLimit={12}
                    prefetchMode={prefetchMode}
                    prefetchScope={prefetchScope}
                  >
                    {item.label}
                  </IntentPrefetchLink>
                </SidebarItem>
              );

              if (!closeOnNavigate || !wrapNavigatedChild) {
                return link;
              }

              return wrapNavigatedChild({
                key: item.label,
                child: link,
              });
            })}
          </div>
        </div>
      ))}
    </nav>
  );
}

function SidebarCallout({
  viewer,
  closeOnNavigate = false,
  wrapNavigatedChild,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
  wrapNavigatedChild?: (input: { key: string; child: ReactNode }) => ReactNode;
}) {
  if (viewer.creatorNavMode !== "apply") {
    return null;
  }

  const prefetchMode = closeOnNavigate ? "intent" : "viewport";
  const checklistButton = (
    <Button className="mt-3" size="sm" variant="quiet" fullWidth asChild>
      <IntentPrefetchLink
        href={routes.dashboardCreator}
        prefetchLimit={4}
        prefetchMode={prefetchMode}
        prefetchScope="dashboard-sidebar-callout"
      >
        Open checklist
      </IntentPrefetchLink>
    </Button>
  );

  const wrappedChecklistButton =
    closeOnNavigate && wrapNavigatedChild
      ? wrapNavigatedChild({
          key: "creator-checklist-callout",
          child: checklistButton,
        })
      : checklistButton;

  return (
    <div className="border-t border-border-subtle p-4">
      <div className="rounded-lg border border-border-subtle bg-card/95 p-4 shadow-card">
        <Badge variant="featured">Creator-ready</Badge>
        <p className="mt-3 text-sm font-semibold text-foreground">
          Start selling resources
        </p>
        <p className="mt-1 text-xs leading-5 text-muted-foreground">
          Upload a worksheet pack and track sales from one workspace.
        </p>
        {wrappedChecklistButton}
      </div>
    </div>
  );
}

export function DashboardSidebarContent({
  viewer,
  closeOnNavigate = false,
  wrapNavigatedChild,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
  wrapNavigatedChild?: (input: { key: string; child: ReactNode }) => ReactNode;
}) {
  return (
    <>
      <SidebarIdentity />
      <NavigationList
        viewer={viewer}
        closeOnNavigate={closeOnNavigate}
        wrapNavigatedChild={wrapNavigatedChild}
      />
      <SidebarCallout
        viewer={viewer}
        closeOnNavigate={closeOnNavigate}
        wrapNavigatedChild={wrapNavigatedChild}
      />
    </>
  );
}

export {
  getDashboardTopbarSearchHref,
  getDashboardTopbarSearchPlaceholder,
  getDashboardTopbarSearchValue,
};

function getDashboardTopbarSearchPlaceholder(pathname: string | null) {
  switch (getActiveKey(pathname)) {
    case "downloads":
      return "Search your library from downloads";
    case "purchases":
      return "Search your library from purchases";
    case "membership":
      return "Search your library while reviewing plans";
    case "settings":
      return "Search your library from settings";
    case "creator":
    case "creator-resources":
    case "creator-earnings":
      return "Search your library";
    case "library":
    case "home":
    default:
      return "Search your library";
  }
}

function getDashboardTopbarSearchValue(
  pathname: string | null,
  searchParams: ReadonlyURLSearchParams,
) {
  if (pathname !== routes.dashboardLibrary) {
    return "";
  }

  return searchParams.get("q") ?? "";
}

function getDashboardTopbarSearchHref(input: {
  pathname: string | null;
  searchParams: ReadonlyURLSearchParams;
  query: string;
}) {
  const query = input.query.trim();

  if (input.pathname === routes.dashboardLibrary) {
    const params = new URLSearchParams(input.searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    const nextQuery = params.toString();
    return nextQuery ? `${routes.dashboardLibrary}?${nextQuery}` : routes.dashboardLibrary;
  }

  if (!query) {
    return routes.dashboardLibrary;
  }

  return `${routes.dashboardLibrary}?q=${encodeURIComponent(query)}`;
}
