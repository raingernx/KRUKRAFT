"use client";

import { useEffect, useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  usePathname,
  useRouter,
  useSearchParams,
  type ReadonlyURLSearchParams,
} from "next/navigation";
import {
  Menu,
} from "@/lib/icons";

import {
  Button,
  SearchInput,
} from "@/design-system";
import type { DashboardAppViewer } from "@/components/dashboard/DashboardAppViewer";
import {
  DashboardSidebarContent,
  getDashboardTopbarSearchHref,
  getDashboardTopbarSearchPlaceholder,
  getDashboardTopbarSearchValue,
} from "@/components/dashboard/DashboardSidebarContent";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

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

export function DashboardAppSidebar({ viewer }: { viewer: DashboardAppViewer }) {
  return (
    <aside className="hidden w-72 shrink-0 border-r border-border-subtle bg-card lg:sticky lg:top-0 lg:flex lg:h-dvh lg:self-start lg:flex-col lg:overflow-hidden">
      <DashboardSidebarContent viewer={viewer} />
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

          <DashboardAppTopbarSearch />
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
