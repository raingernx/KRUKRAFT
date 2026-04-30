"use client";

import { useEffect, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  Bell,
  CreditCard,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
  X,
  type AppIcon,
} from "@/lib/icons";

import {
  Badge,
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
  SearchInput,
  SidebarItem,
  SidebarSectionLabel,
} from "@/design-system";
import { Logo } from "@/components/brand/Logo";
import { CORE_DASHBOARD_NAV_SECTIONS } from "@/config/dashboard-nav/dashboard-core";
import {
  getDashboardCreatorNavSection,
  insertDashboardCreatorSection,
} from "@/config/dashboard-nav/creator-nav";
import type { DashboardNavItem } from "@/components/layout/dashboard/dashboard-nav.types";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import type { DashboardCreatorNavMode } from "@/lib/dashboard/dashboard-permissions";
import { cn } from "@/lib/utils";
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
  icon?: AppIcon;
  href: string;
  exact?: boolean;
  activeKey?: NavKey;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export interface DashboardAppViewer {
  displayName: string;
  email: string | null;
  image: string | null;
  creatorPublicHref: string | null;
  creatorNavMode: DashboardCreatorNavMode;
  role: string | null;
  subscriptionStatus: string | null;
  isAuthenticated: boolean;
}

const DashboardAccountMenu = dynamic(
  () =>
    import("@/components/dashboard/DashboardAccountMenu").then((module) => ({
      default: module.DashboardAccountMenu,
    })),
  {
    loading: () => (
      <button
        type="button"
        aria-label="Loading dashboard account menu"
        data-dashboard-account-trigger="true"
        data-dashboard-account-ready="false"
        className="group inline-flex size-11 items-center justify-center rounded-full outline-none"
        disabled
      >
        <span className="inline-flex size-11 items-center justify-center rounded-full border border-border-subtle bg-card/90">
          <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground/70">
            …
          </span>
        </span>
      </button>
    ),
  },
);

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

function getDashboardNotificationCopy(viewer: DashboardAppViewer) {
  if (viewer.creatorNavMode === "apply") {
    return {
      title: "Creator setup still needs action",
      description:
        "Finish the creator checklist to unlock workspace tools and publishing actions.",
      ctaHref: routes.dashboardCreatorApply,
      ctaLabel: "Open checklist",
    };
  }

  if (viewer.creatorNavMode === "full") {
    return {
      title: "No unread alerts",
      description:
        "Sales, payout, and storefront updates will surface here once new activity needs attention.",
      ctaHref: routes.dashboardCreatorSales,
      ctaLabel: "Review sales",
    };
  }

  return {
    title: "No unread alerts",
    description:
      "Purchase confirmations and membership changes will appear here when something needs review.",
    ctaHref: routes.dashboardPurchases,
    ctaLabel: "View purchases",
  };
}

function NavigationList({
  viewer,
  closeOnNavigate = false,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
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

              return closeOnNavigate ? (
                <DialogPrimitive.Close key={item.label} asChild>
                  {link}
                </DialogPrimitive.Close>
              ) : (
                link
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );
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

function SidebarCallout({
  viewer,
  closeOnNavigate = false,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
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
        {closeOnNavigate ? (
          <DialogPrimitive.Close asChild>{checklistButton}</DialogPrimitive.Close>
        ) : (
          checklistButton
        )}
      </div>
    </div>
  );
}

function SidebarContent({
  viewer,
  closeOnNavigate = false,
}: {
  viewer: DashboardAppViewer;
  closeOnNavigate?: boolean;
}) {
  return (
    <>
      <SidebarIdentity />
      <NavigationList viewer={viewer} closeOnNavigate={closeOnNavigate} />
      <SidebarCallout viewer={viewer} closeOnNavigate={closeOnNavigate} />
    </>
  );
}

export function DashboardAppSidebar({ viewer }: { viewer: DashboardAppViewer }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border-subtle bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col lg:overflow-hidden">
      <SidebarContent viewer={viewer} />
    </aside>
  );
}

function DashboardAppTopbarSearch() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() =>
    getDashboardTopbarSearchValue(pathname, searchParams),
  );

  useEffect(() => {
    setQuery(getDashboardTopbarSearchValue(pathname, searchParams));
  }, [pathname, searchParams]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    router.push(
      getDashboardTopbarSearchHref({
        pathname,
        searchParams,
        query,
      }),
    );
  };

  const handleClear = () => {
    setQuery("");

    if (pathname === routes.dashboardLibrary && searchParams.get("q")) {
      router.push(
        getDashboardTopbarSearchHref({
          pathname,
          searchParams,
          query: "",
        }),
      );
    }
  };

  return (
    <form className="min-w-0 flex-1" onSubmit={handleSubmit}>
      <SearchInput
        aria-label="Search your dashboard library"
        containerClassName="max-w-2xl"
        id="dashboard-search"
        name="dashboardSearch"
        onChange={(event) => setQuery(event.target.value)}
        onClear={handleClear}
        placeholder={getDashboardTopbarSearchPlaceholder(pathname)}
        title="Press Enter to open library search results"
        value={query}
      />
    </form>
  );
}

function DashboardAppNotifications({ viewer }: { viewer: DashboardAppViewer }) {
  const notificationCopy = getDashboardNotificationCopy(viewer);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          aria-label="Open dashboard notifications"
          className="size-11"
          size="icon"
          variant="ghost"
        >
          <Bell className="size-5" aria-hidden />
        </Button>
      </DropdownTrigger>

      <DropdownMenu
        align="end"
        className="w-[min(20rem,calc(100vw-1rem))] rounded-lg border-border-subtle bg-card/95 p-0 shadow-card-lg"
        sideOffset={8}
      >
        <div className="p-2">
          <div className="border-b border-border-subtle px-3 py-3">
            <p className="text-sm font-semibold text-foreground">Notifications</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Stay on top of account and workspace updates.
            </p>
          </div>

          <div className="px-3 py-3">
            <div className="rounded-lg border border-border-subtle bg-muted/60 p-3">
              <p className="text-sm font-semibold text-foreground">
                {notificationCopy.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {notificationCopy.description}
              </p>
            </div>
          </div>

          <DropdownSeparator />

          <div className="p-2">
            <DropdownItem asChild className="rounded-lg px-3 py-2 text-sm font-medium">
              <IntentPrefetchLink
                href={notificationCopy.ctaHref}
                prefetchLimit={4}
                prefetchScope="dashboard-topbar-notifications"
              >
                {notificationCopy.ctaLabel}
              </IntentPrefetchLink>
            </DropdownItem>
            <DropdownItem asChild className="rounded-lg px-3 py-2 text-sm font-medium">
              <IntentPrefetchLink
                href={routes.dashboardMembership}
                prefetchLimit={4}
                prefetchScope="dashboard-topbar-notifications"
              >
                Review membership
              </IntentPrefetchLink>
            </DropdownItem>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}

export function DashboardAppTopbar({ viewer }: { viewer: DashboardAppViewer }) {
  return (
    <DialogPrimitive.Root>
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-background/95 px-4 pt-3 pb-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <DialogPrimitive.Trigger asChild>
            <Button
              aria-label="Open dashboard navigation"
              className="size-11 lg:hidden"
              onClick={() => {
                const activeElement = document.activeElement;
                if (activeElement instanceof HTMLElement) {
                  activeElement.blur();
                }
              }}
              size="icon"
              variant="ghost"
            >
              <Menu className="size-5" aria-hidden />
            </Button>
          </DialogPrimitive.Trigger>

          <DashboardAppTopbarSearch />
          <DashboardAppNotifications viewer={viewer} />

          <DashboardAccountMenu viewer={viewer} />
        </div>
      </header>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[hsl(var(--card)/0.78)] backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border-subtle bg-card/95 shadow-card-lg outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden">
          <DialogPrimitive.Title className="sr-only">
            Dashboard navigation
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigate between dashboard sections.
          </DialogPrimitive.Description>
          <DialogPrimitive.Close asChild>
            <Button
              aria-label="Close dashboard navigation"
              className="absolute right-3 top-3 size-11"
              size="icon"
              variant="ghost"
            >
              <X className="size-4" aria-hidden />
            </Button>
          </DialogPrimitive.Close>
          <SidebarContent closeOnNavigate viewer={viewer} />
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
