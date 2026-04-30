"use client";

import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

import { AuthenticatedAccountDropdown } from "@/components/layout/account/AuthenticatedAccountDropdown";
import { getAuthenticatedAccountWarmTargets } from "@/components/layout/account/accountMenuConfig";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import { CreditCard, LogIn, Sparkles } from "@/lib/icons";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  SidebarSectionLabel,
} from "@/design-system";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";
import { useState } from "react";

export function DashboardAccountMenu({
  viewer,
}: {
  viewer: DashboardAppViewer;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  if (viewer.isAuthenticated) {
    const warmTargets = () => {
      for (const href of getAuthenticatedAccountWarmTargets(viewer.creatorNavMode)) {
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
        onNavigate={(href, event) => {
          event?.preventDefault();
          router.push(href);
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
        className="w-[min(17rem,calc(100vw-1rem))] rounded-lg border-border-subtle bg-card/95 p-0 shadow-card-lg"
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
              className="rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.loginWithNext(routes.dashboard)}
                data-dashboard-account-link={routes.loginWithNext(routes.dashboard)}
                prefetchLimit={4}
                prefetchScope="dashboard-account-menu"
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
              className="rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.register}
                data-dashboard-account-link={routes.register}
                prefetchLimit={4}
                prefetchScope="dashboard-account-menu"
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
              className="rounded-lg border border-transparent px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            >
              <IntentPrefetchLink
                href={routes.dashboardMembership}
                data-dashboard-account-link={routes.dashboardMembership}
                prefetchLimit={4}
                prefetchScope="dashboard-account-menu"
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
