"use client";

import { useEffect, useState, type FormEvent } from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { SearchInput } from "@/design-system";
import {
  getDashboardTopbarSearchHref,
  getDashboardTopbarSearchPlaceholder,
  getDashboardTopbarSearchValue,
} from "@/components/dashboard/DashboardSidebarContent";
import { routes } from "@/lib/routes";

export function DashboardTopbarSearch() {
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
    <form className="min-w-0 w-full max-w-[40rem]" onSubmit={handleSubmit}>
      <SearchInput
        aria-label="Search your dashboard library"
        containerClassName="w-full"
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
