"use client";

import { Bell } from "@/lib/icons";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSeparator,
  DropdownTrigger,
} from "@/design-system";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import { DashboardAccountMenu } from "@/components/dashboard/DashboardAccountMenu";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import { routes } from "@/lib/routes";

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

function DashboardAppNotifications({ viewer }: { viewer: DashboardAppViewer }) {
  const notificationCopy = getDashboardNotificationCopy(viewer);

  return (
    <Dropdown>
      <DropdownTrigger asChild>
        <Button
          aria-label="Open dashboard notifications"
          className="size-11"
          size="icon"
          variant="tertiary"
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

export function DashboardTopbarActions({
  viewer,
}: {
  viewer: DashboardAppViewer;
}) {
  return (
    <>
      <DashboardAppNotifications viewer={viewer} />
      <DashboardAccountMenu viewer={viewer} />
    </>
  );
}

export function DashboardTopbarActionsFallback() {
  return (
    <>
      <button
        type="button"
        aria-label="Loading dashboard notifications"
        className="inline-flex size-11 items-center justify-center rounded-full border border-border-subtle bg-card/90 text-xs font-semibold text-foreground/70"
        disabled
      >
        …
      </button>
      <button
        type="button"
        aria-label="Loading dashboard account menu"
        data-dashboard-account-trigger="true"
        data-dashboard-account-ready="false"
        className="inline-flex size-11 items-center justify-center rounded-full border border-border-subtle bg-card/90 text-xs font-semibold text-foreground/70"
        disabled
      >
        …
      </button>
    </>
  );
}
