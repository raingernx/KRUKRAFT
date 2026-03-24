"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Input } from "@/design-system";
import { cn } from "@/lib/utils";

/** Simple admin list filters: search + optional status. For resources, users, orders. */
interface AdminFiltersProps {
  searchPlaceholder?: string;
  searchParam?: string;
  className?: string;
}

export function AdminFilters({
  searchPlaceholder = "Search…",
  searchParam = "search",
  className,
}: AdminFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const value = searchParams.get(searchParam) ?? "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const params = new URLSearchParams(searchParams.toString());
    const v = e.target.value.trim();
    if (v) params.set(searchParam, v);
    else params.delete(searchParam);
    params.delete("page");
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className={cn("min-w-[220px] max-w-sm flex-1", className)}>
      <label
        htmlFor={`admin-filter-${searchParam}`}
        className="mb-1 block font-ui text-caption text-text-muted"
      >
        Search
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-text-muted">
          <Search className="h-4 w-4" />
        </span>
        <Input
          id={`admin-filter-${searchParam}`}
          type="search"
          placeholder={searchPlaceholder}
          value={value}
          onChange={handleChange}
          className="w-full pl-9"
        />
      </div>
    </div>
  );
}
