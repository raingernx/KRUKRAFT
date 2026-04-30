"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import {
  Menu,
  Search,
} from "@/lib/icons";

import {
  Button,
} from "@/design-system";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import {
  DashboardSidebarContent,
} from "@/components/dashboard/DashboardSidebarContent";
import { cn } from "@/lib/utils";

const DashboardTopbarActions = dynamic(
  () =>
    import("@/components/dashboard/DashboardTopbarActions").then((module) => ({
      default: module.DashboardTopbarActions,
    })),
  {
    loading: () => (
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
    ),
  },
);

const DashboardMobileNavigation = dynamic(
  () =>
    import("@/components/dashboard/DashboardMobileNavigation").then((module) => ({
      default: module.DashboardMobileNavigation,
    })),
  {
    ssr: false,
  },
);

const DashboardTopbarSearch = dynamic(
  () =>
    import("@/components/dashboard/DashboardTopbarSearch").then((module) => ({
      default: module.DashboardTopbarSearch,
    })),
  {
    ssr: false,
    loading: () => (
      <div className="min-w-0 flex-1">
        <div className="relative w-full max-w-2xl">
          <span
            className="pointer-events-none absolute inset-y-0 left-0 flex w-10 items-center justify-center text-muted-foreground"
            data-testid="dashboard-topbar-search-fallback-adornment"
            aria-hidden="true"
          >
            <Search className="size-4" aria-hidden />
          </span>
          <input
            aria-label="Search your dashboard library"
            className={cn(
              "h-10 w-full rounded-[var(--radius-sm)] border border-input bg-background px-3 py-2 pl-10 pr-10 text-sm text-foreground shadow-sm transition-[border-color,box-shadow,background-color] duration-150",
              "placeholder:text-muted-foreground",
            )}
            data-testid="dashboard-topbar-search-fallback"
            disabled
            placeholder="Search your library"
            type="search"
          />
        </div>
      </div>
    ),
  },
);

export function DashboardAppSidebar({ viewer }: { viewer: DashboardAppViewer }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border-subtle bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col lg:overflow-hidden">
      <DashboardSidebarContent viewer={viewer} />
    </aside>
  );
}

export function DashboardAppTopbar({ viewer }: { viewer: DashboardAppViewer }) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [hasOpenedMobileNav, setHasOpenedMobileNav] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-10 border-b border-border-subtle bg-background/95 px-4 pt-3 pb-3 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <Button
            aria-label="Open dashboard navigation"
            className="size-11 lg:hidden"
            onClick={() => {
              const activeElement = document.activeElement;
              if (activeElement instanceof HTMLElement) {
                activeElement.blur();
              }

              setHasOpenedMobileNav(true);
              setIsMobileNavOpen(true);
            }}
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" aria-hidden />
          </Button>

          <DashboardTopbarSearch />
          <DashboardTopbarActions viewer={viewer} />
        </div>
      </header>

      {hasOpenedMobileNav ? (
        <DashboardMobileNavigation
          open={isMobileNavOpen}
          onOpenChange={setIsMobileNavOpen}
          viewer={viewer}
        />
      ) : null}
    </>
  );
}
