"use client";

import { useState, type MouseEvent as ReactMouseEvent } from "react";
import { usePathname } from "next/navigation";
import { CreditCard, LogOut } from "@/lib/icons";

import {
  Avatar,
  Badge,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  DropdownSeparator,
  DropdownTrigger,
  SidebarSectionLabel,
} from "@/design-system";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import {
  AUTHENTICATED_ACCOUNT_MENU_ACCOUNT_LINKS,
  AUTHENTICATED_ACCOUNT_MENU_CREATOR_APPLY_LINKS,
  AUTHENTICATED_ACCOUNT_MENU_CREATOR_LINKS,
  type DashboardAccountCreatorMenuMode,
  type DashboardAccountMenuItem,
} from "@/components/layout/account/accountMenuConfig";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export interface AuthenticatedAccountDropdownViewer {
  name: string;
  email: string | null;
  image: string | null;
  creatorMenuMode?: DashboardAccountCreatorMenuMode;
}

export type AccountDropdownNavigateHandler = (
  href: string,
  event?: ReactMouseEvent<HTMLAnchorElement>,
) => void;

function isMenuLinkActive(pathname: string | null, href: string) {
  if (href === routes.dashboard) {
    return pathname === routes.dashboard;
  }

  if (href === routes.dashboardMembership) {
    return pathname === routes.dashboardMembership;
  }

  if (href === routes.dashboardSettings) {
    return pathname === routes.dashboardSettings;
  }

  if (href === routes.dashboardCreator) {
    return (
      pathname === routes.dashboardCreator ||
      pathname === routes.dashboardCreatorAnalytics ||
      pathname === routes.dashboardCreatorApply
    );
  }

  if (href === routes.dashboardCreatorResources) {
    return (
      pathname === routes.dashboardCreatorResources ||
      pathname?.startsWith(`${routes.dashboardCreatorResources}/`) === true
    );
  }

  if (href === routes.dashboardCreatorSales) {
    return (
      pathname === routes.dashboardCreatorSales ||
      pathname === routes.dashboardCreatorPayouts
    );
  }
  return pathname === href;
}

function AccountMenuTrigger({
  viewer,
  open,
}: {
  viewer: AuthenticatedAccountDropdownViewer;
  open: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-11 items-center justify-center rounded-full border transition-all group-focus-visible:ring-2 group-focus-visible:ring-ring group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-background",
        open
          ? "border-border-strong bg-shell shadow-card"
          : "border-border-subtle bg-shell/90 hover:border-border hover:bg-muted/55",
      )}
    >
      <Avatar
        src={viewer.image}
        name={viewer.name}
        email={viewer.email}
        size={32}
        className="ring-1 ring-border-subtle"
      />
    </span>
  );
}

function AccountDropdownContext({
  viewer,
}: {
  viewer: AuthenticatedAccountDropdownViewer;
}) {
  return (
    <div className="mb-2 border-b border-border-subtle px-2.5 pb-2 pt-1">
      <p className="flex min-w-0 items-baseline gap-1 text-xs font-medium text-foreground">
        <span className="shrink-0">Signed in as</span>
        <span className="min-w-0 truncate">{viewer.name}</span>
      </p>
      {viewer.email ? (
        <p className="mt-0.5 truncate text-xs leading-5 text-muted-foreground">
          {viewer.email}
        </p>
      ) : null}
    </div>
  );
}

function MembershipItem({
  onWarmTargets,
  onNavigate,
  active,
}: {
  onWarmTargets?: () => void;
  onNavigate: AccountDropdownNavigateHandler;
  active: boolean;
}) {
  return (
    <DropdownItem
      asChild
      className={cn(
        "mb-3 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        active
          ? "border-border bg-muted/75"
          : "border-border-subtle bg-muted/45 hover:border-border hover:bg-muted/65",
      )}
    >
      <IntentPrefetchLink
        href={routes.dashboardMembership}
        data-dashboard-account-link={routes.dashboardMembership}
        onMouseEnter={onWarmTargets}
        onFocus={onWarmTargets}
        onClick={(event) => {
          onNavigate(routes.dashboardMembership, event);
        }}
      >
        <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <CreditCard aria-hidden className="h-4 w-4" />
        </span>
        <span className="flex min-w-0 flex-1 items-center gap-2">
          <span className="truncate text-sm font-semibold text-foreground">
            Membership
          </span>
          <Badge
            variant="featured"
            className="shrink-0"
          >
            Plans
          </Badge>
        </span>
      </IntentPrefetchLink>
    </DropdownItem>
  );
}

function MenuSection({
  label,
  items,
  onWarmTargets,
  onNavigate,
  pathname,
}: {
  label: string;
  items: readonly DashboardAccountMenuItem[];
  onWarmTargets?: () => void;
  onNavigate: AccountDropdownNavigateHandler;
  pathname: string | null;
}) {
  return (
    <div>
      <SidebarSectionLabel className="mb-1 mt-0 px-2.5">
        {label}
      </SidebarSectionLabel>
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = isMenuLinkActive(pathname, item.href);

        return (
          <DropdownItem
            asChild
            key={item.href}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg border px-2.5 py-2 text-sm font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
              isActive
                ? "border-transparent bg-muted text-foreground"
                : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            <IntentPrefetchLink
              href={item.href}
              data-dashboard-account-link={item.href}
              onMouseEnter={onWarmTargets}
              onFocus={onWarmTargets}
              onClick={(event) => {
                onNavigate(item.href, event);
              }}
            >
              <Icon
                aria-hidden
                className="h-[18px] w-[18px] shrink-0 opacity-80"
              />
              <span className="whitespace-nowrap text-[15px] leading-6">
                {item.label}
              </span>
            </IntentPrefetchLink>
          </DropdownItem>
        );
      })}
    </div>
  );
}

export function AuthenticatedAccountDropdown({
  viewer,
  isSigningOut,
  onSignOut,
  onNavigate,
  onWarmTargets,
  ariaLabel = "Open account menu",
}: {
  viewer: AuthenticatedAccountDropdownViewer;
  isSigningOut: boolean;
  onSignOut: () => void;
  onNavigate: AccountDropdownNavigateHandler;
  onWarmTargets?: () => void;
  ariaLabel?: string;
}) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const creatorMenuMode = viewer.creatorMenuMode ?? "hidden";

  return (
    <Dropdown
      modal={false}
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          onWarmTargets?.();
        }
        setOpen(nextOpen);
      }}
    >
      <DropdownTrigger asChild>
        <button
          type="button"
          onMouseEnter={onWarmTargets}
          onFocus={onWarmTargets}
          aria-label={ariaLabel}
          data-dashboard-account-trigger="true"
          data-dashboard-account-ready="true"
          className="group inline-flex size-11 items-center justify-center rounded-full outline-none"
          aria-haspopup="menu"
          aria-expanded={open}
        >
          <AccountMenuTrigger viewer={viewer} open={open} />
        </button>
      </DropdownTrigger>

      <DropdownMenu
        align="end"
        className="w-[min(18rem,calc(100vw-1rem))] rounded-lg border-border-subtle bg-shell/95 p-0 shadow-card-lg"
        data-dashboard-account-menu="true"
        sideOffset={8}
      >
        <div className="p-2">
          <AccountDropdownContext viewer={viewer} />

          <MembershipItem
            active={isMenuLinkActive(pathname, routes.dashboardMembership)}
            onWarmTargets={onWarmTargets}
            onNavigate={onNavigate}
          />

          <MenuSection
            label="ACCOUNT"
            items={AUTHENTICATED_ACCOUNT_MENU_ACCOUNT_LINKS}
            onWarmTargets={onWarmTargets}
            onNavigate={onNavigate}
            pathname={pathname}
          />

          <div className="mt-3">
            {creatorMenuMode === "apply" ? (
              <MenuSection
                label="CREATOR"
                items={AUTHENTICATED_ACCOUNT_MENU_CREATOR_APPLY_LINKS}
                onWarmTargets={onWarmTargets}
                onNavigate={onNavigate}
                pathname={pathname}
              />
            ) : creatorMenuMode === "hidden" ? null : (
              <MenuSection
                label="CREATOR"
                items={AUTHENTICATED_ACCOUNT_MENU_CREATOR_LINKS}
                onWarmTargets={onWarmTargets}
                onNavigate={onNavigate}
                pathname={pathname}
              />
            )}
          </div>

          <DropdownSeparator />

          <DropdownItem
            className="rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            onSelect={(event) => {
              event.preventDefault();
              setOpen(false);
              onSignOut();
            }}
          >
            <LogOut
              aria-hidden
              className="h-[18px] w-[18px] shrink-0 opacity-80"
            />
            {isSigningOut ? "Signing out…" : "Sign out"}
          </DropdownItem>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
}
