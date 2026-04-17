"use client";

import { useEffect, useState, type ComponentType, type FormEvent } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import { signOut } from "next-auth/react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  ArrowDownToLine,
  Bell,
  CircleDollarSign,
  CreditCard,
  FileText,
  Home,
  Library,
  LogIn,
  LogOut,
  Menu,
  ReceiptText,
  Settings,
  Sparkles,
  Store,
  X,
} from "lucide-react";

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
import { AuthenticatedAccountDropdown } from "@/components/layout/account/AuthenticatedAccountDropdown";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
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
  icon: ComponentType<{ className?: string }>;
  href: string;
  activeKey?: NavKey;
};

type NavGroup = {
  label: string;
  items: NavItem[];
};

export interface DashboardV2Viewer {
  displayName: string;
  email: string | null;
  image: string | null;
  creatorPublicHref: string | null;
  creatorNavMode: DashboardV2CreatorNavMode;
  role: string | null;
  subscriptionStatus: string | null;
  isAuthenticated: boolean;
}

export type DashboardV2CreatorNavMode = "hidden" | "apply" | "full";

const navGroups: NavGroup[] = [
  {
    label: "Learn",
    items: [
      { label: "Home", icon: Home, href: routes.dashboardV2, activeKey: "home" },
      {
        label: "Library",
        icon: Library,
        href: routes.dashboardV2Library,
        activeKey: "library",
      },
      {
        label: "Downloads",
        icon: ArrowDownToLine,
        href: routes.dashboardV2Downloads,
        activeKey: "downloads",
      },
      {
        label: "Purchases",
        icon: ReceiptText,
        href: routes.dashboardV2Purchases,
        activeKey: "purchases",
      },
    ],
  },
  {
    label: "Account",
    items: [
      {
        label: "Membership",
        icon: CreditCard,
        href: routes.dashboardV2Membership,
        activeKey: "membership",
      },
      {
        label: "Settings",
        icon: Settings,
        href: routes.dashboardV2Settings,
        activeKey: "settings",
      },
    ],
  },
];

function getActiveKey(pathname: string | null): NavKey {
  if (pathname === routes.dashboardV2Library) return "library";
  if (pathname === routes.dashboardV2Downloads) return "downloads";
  if (pathname === routes.dashboardV2Purchases) return "purchases";
  if (pathname === routes.dashboardV2Membership) return "membership";
  if (pathname === routes.dashboardV2Settings) return "settings";
  if (pathname === routes.dashboardV2CreatorResources) return "creator-resources";
  if (pathname?.startsWith(`${routes.dashboardV2CreatorResources}/`)) {
    return "creator-resources";
  }
  if (pathname === routes.dashboardV2CreatorAnalytics) return "creator";
  if (pathname === routes.dashboardV2CreatorSales) return "creator-earnings";
  if (pathname === routes.dashboardV2CreatorPayouts) return "creator-earnings";
  if (pathname === routes.dashboardV2CreatorStorefront) return "creator";
  if (pathname === routes.dashboardV2CreatorProfile) return "creator";
  if (pathname === routes.dashboardV2CreatorSettings) return "creator";
  if (pathname?.startsWith(routes.dashboardV2Creator)) return "creator";
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
  if (pathname !== routes.dashboardV2Library) {
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

  if (input.pathname === routes.dashboardV2Library) {
    const params = new URLSearchParams(input.searchParams.toString());

    if (query) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    const nextQuery = params.toString();
    return nextQuery ? `${routes.dashboardV2Library}?${nextQuery}` : routes.dashboardV2Library;
  }

  if (!query) {
    return routes.dashboardV2Library;
  }

  return `${routes.dashboardV2Library}?q=${encodeURIComponent(query)}`;
}

function getDashboardNotificationCopy(viewer: DashboardV2Viewer) {
  if (viewer.creatorNavMode === "apply") {
    return {
      title: "Creator setup still needs action",
      description:
        "Finish the creator checklist to unlock workspace tools and publishing actions.",
      ctaHref: routes.dashboardV2CreatorApply,
      ctaLabel: "Open checklist",
    };
  }

  if (viewer.creatorNavMode === "full") {
    return {
      title: "No unread alerts",
      description:
        "Sales, payout, and storefront updates will surface here once new activity needs attention.",
      ctaHref: routes.dashboardV2CreatorSales,
      ctaLabel: "Review sales",
    };
  }

  return {
    title: "No unread alerts",
    description:
      "Purchase confirmations and membership changes will appear here when something needs review.",
    ctaHref: routes.dashboardV2Purchases,
    ctaLabel: "View purchases",
  };
}

function NavigationList({
  viewer,
  closeOnNavigate = false,
}: {
  viewer: DashboardV2Viewer;
  closeOnNavigate?: boolean;
}) {
  const activeKey = getActiveKey(usePathname());
  const prefetchMode = closeOnNavigate ? "intent" : "viewport";
  const prefetchScope = closeOnNavigate
    ? "dashboard-v2-sidebar-drawer"
    : "dashboard-v2-sidebar-rail";
  const creatorGroup =
    viewer.creatorNavMode === "hidden"
      ? null
      : viewer.creatorNavMode === "apply"
        ? {
            label: "Creator",
            items: [
              {
                label: "Become a creator",
                icon: Sparkles,
                href: routes.dashboardV2CreatorApply,
                activeKey: "creator",
              },
            ],
          }
        : {
            label: "Creator",
            items: [
              {
                label: "Workspace",
                icon: Sparkles,
                href: routes.dashboardV2Creator,
                activeKey: "creator",
              },
              {
                label: "Resources",
                icon: FileText,
                href: routes.dashboardV2CreatorResources,
                activeKey: "creator-resources",
              },
              {
                label: "Earnings",
                icon: CircleDollarSign,
                href: routes.dashboardV2CreatorSales,
                activeKey: "creator-earnings",
              },
              {
                label: "Storefront",
                icon: Store,
                href: viewer.creatorPublicHref ?? routes.dashboardV2CreatorProfile,
              },
            ],
          };
  const groups = creatorGroup
    ? [navGroups[0], creatorGroup, navGroups[1]]
    : navGroups;

  return (
    <nav className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto px-3 py-5">
      {groups.map((group) => (
        <div key={group.label} className="space-y-2">
          <SidebarSectionLabel className="px-3">
            {group.label}
          </SidebarSectionLabel>
          <div className="space-y-1">
            {group.items.map((item) => {
              const isActive = item.activeKey === activeKey;
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
  viewer: DashboardV2Viewer;
  closeOnNavigate?: boolean;
}) {
  if (viewer.creatorNavMode !== "apply") {
    return null;
  }

  const prefetchMode = closeOnNavigate ? "intent" : "viewport";
  const checklistButton = (
    <Button className="mt-3" size="sm" variant="secondary" fullWidth asChild>
      <IntentPrefetchLink
        href={routes.dashboardV2Creator}
        prefetchLimit={4}
        prefetchMode={prefetchMode}
        prefetchScope="dashboard-v2-sidebar-callout"
      >
        Open checklist
      </IntentPrefetchLink>
    </Button>
  );

  return (
    <div className="border-t border-border-subtle p-4">
      <div className="rounded-xl border border-border-subtle bg-card/95 p-4 shadow-card">
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
  viewer: DashboardV2Viewer;
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

export function DashboardV2Sidebar({ viewer }: { viewer: DashboardV2Viewer }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border-subtle bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col lg:overflow-hidden">
      <SidebarContent viewer={viewer} />
    </aside>
  );
}

function AccountDropdown({
  viewer,
}: {
  viewer: DashboardV2Viewer;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (viewer.isAuthenticated) {
    const warmTargets = () => {
      const targets: string[] = [
        routes.dashboardV2,
        routes.dashboardV2Membership,
        routes.dashboardV2Settings,
      ];
      if (viewer.creatorNavMode === "apply") {
        targets.push(routes.dashboardV2CreatorApply);
      }
      if (viewer.creatorNavMode === "full") {
        targets.push(
          routes.dashboardV2Creator,
          routes.dashboardV2CreatorResources,
          routes.dashboardV2CreatorSales,
          routes.dashboardV2CreatorProfile,
        );
      }

      for (const href of targets) {
        router.prefetch(href);
      }
    };

    return (
      <AuthenticatedAccountDropdown
        viewer={{
          name: viewer.displayName,
          email: viewer.email,
          image: viewer.image,
          creatorMenuMode: viewer.creatorNavMode,
        }}
        isSigningOut={false}
        onSignOut={() => {
          void signOut({ callbackUrl: routes.home });
        }}
        onWarmTargets={warmTargets}
        onNavigate={(href) => {
          router.prefetch(href);
        }}
        ariaLabel="Open dashboard account menu"
      />
    );
  }

  return (
    <Dropdown modal={false} open={open} onOpenChange={setOpen}>
      <DropdownTrigger asChild>
        <button
          type="button"
          aria-label="Open dashboard account menu"
          data-dashboard-account-trigger="true"
          data-dashboard-account-ready="true"
          className="group inline-flex size-11 items-center justify-center rounded-full outline-none"
        >
          <span
            className={cn(
              "inline-flex size-11 items-center justify-center rounded-full border transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background",
              open
                ? "border-border-strong bg-card shadow-card"
                : "border-border-subtle bg-card/90 hover:border-border hover:bg-muted/55",
            )}
          >
            <span className="inline-flex size-8 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {viewer.displayName.charAt(0) || "A"}
            </span>
          </span>
        </button>
      </DropdownTrigger>

      <DropdownMenu
        align="end"
        className="w-[min(17rem,calc(100vw-1rem))] rounded-xl border-border-subtle bg-card/95 p-0 shadow-card-lg"
        data-dashboard-account-menu="true"
        sideOffset={8}
      >
        <div className="p-2">
          <div className="mb-2 border-b border-border-subtle px-2.5 pb-2 pt-1">
            <p className="text-xs font-medium text-foreground">Preview access</p>
            <p className="mt-0.5 truncate text-xs leading-5 text-muted-foreground">
              Sign in to unlock dashboard actions.
            </p>
          </div>

          <div>
            <SidebarSectionLabel className="mb-1 mt-0 px-2.5">
              GET STARTED
            </SidebarSectionLabel>
            <DropdownItem
              asChild
              className="rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.loginWithNext(routes.dashboardV2)}
                data-dashboard-account-link={routes.loginWithNext(routes.dashboardV2)}
                prefetchLimit={4}
                prefetchScope="dashboard-v2-account-menu"
              >
                <LogIn
                  aria-hidden
                  className="h-[18px] w-[18px] shrink-0 opacity-80"
                />
                Sign in
              </IntentPrefetchLink>
            </DropdownItem>
            <DropdownItem
              asChild
              className="rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.register}
                data-dashboard-account-link={routes.register}
                prefetchLimit={4}
                prefetchScope="dashboard-v2-account-menu"
              >
                <Sparkles
                  aria-hidden
                  className="h-[18px] w-[18px] shrink-0 opacity-80"
                />
                Create account
              </IntentPrefetchLink>
            </DropdownItem>
            <DropdownItem
              asChild
              className="rounded-xl border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.dashboardV2Membership}
                data-dashboard-account-link={routes.dashboardV2Membership}
                prefetchLimit={4}
                prefetchScope="dashboard-v2-account-menu"
              >
                <CreditCard
                  aria-hidden
                  className="h-[18px] w-[18px] shrink-0 opacity-80"
                />
                Explore membership
              </IntentPrefetchLink>
            </DropdownItem>
          </div>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}

function DashboardV2TopbarSearch() {
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

    if (pathname === routes.dashboardV2Library && searchParams.get("q")) {
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
        className="h-11"
        containerClassName="max-w-2xl"
        id="dashboard-v2-search"
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

function DashboardV2Notifications({ viewer }: { viewer: DashboardV2Viewer }) {
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
        className="w-[min(20rem,calc(100vw-1rem))] rounded-xl border-border-subtle bg-card/95 p-0 shadow-card-lg"
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
            <div className="rounded-xl border border-border-subtle bg-muted/60 p-3">
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
            <DropdownItem asChild className="rounded-xl px-3 py-2 text-sm font-medium">
              <IntentPrefetchLink
                href={notificationCopy.ctaHref}
                prefetchLimit={4}
                prefetchScope="dashboard-v2-topbar-notifications"
              >
                {notificationCopy.ctaLabel}
              </IntentPrefetchLink>
            </DropdownItem>
            <DropdownItem asChild className="rounded-xl px-3 py-2 text-sm font-medium">
              <IntentPrefetchLink
                href={routes.dashboardV2Membership}
                prefetchLimit={4}
                prefetchScope="dashboard-v2-topbar-notifications"
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

export function DashboardV2Topbar({ viewer }: { viewer: DashboardV2Viewer }) {
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

          <DashboardV2TopbarSearch />
          <DashboardV2Notifications viewer={viewer} />

          <AccountDropdown viewer={viewer} />
        </div>
      </header>

      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-40 bg-[hsl(var(--card)/0.78)] backdrop-blur-[2px] data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 lg:hidden" />
        <DialogPrimitive.Content className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100vw-2rem))] flex-col border-r border-border-subtle bg-card/95 shadow-card-lg outline-none data-[state=closed]:animate-out data-[state=closed]:slide-out-to-left data-[state=open]:animate-in data-[state=open]:slide-in-from-left lg:hidden">
          <DialogPrimitive.Title className="sr-only">
            Dashboard V2 navigation
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Navigate between Dashboard V2 prototype sections.
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
