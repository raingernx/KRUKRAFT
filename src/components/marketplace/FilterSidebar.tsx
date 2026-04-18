"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { Minus, Plus, X } from "@/lib/icons";
import {
  DEFAULT_SORT,
  SORT_OPTIONS,
  normaliseSortParam,
} from "@/config/sortOptions";
import { beginResourcesNavigation } from "@/components/marketplace/resourcesNavigationState";

export interface FilterCategory {
  id: string;
  name: string;
  slug: string;
}

interface FilterSidebarProps {
  categories: FilterCategory[];
  className?: string;
  showHeader?: boolean;
  showSort?: boolean;
  showPrice?: boolean;
  onNavigate?: () => void;
}

const ACTIVE_ROW_CLASS =
  "border border-border-strong bg-muted/70 font-medium text-foreground shadow-sm";

// ── Static filter options ─────────────────────────────────────────────────────

const PRICE_OPTIONS = [
  { label: "All prices", value: "" },
  { label: "Free only", value: "free" },
  { label: "Paid only", value: "paid" },
];

// ── Component ─────────────────────────────────────────────────────────────────

export function FilterSidebar({
  categories,
  className,
  showHeader = true,
  showSort = true,
  showPrice = true,
  onNavigate,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  // Track the param key+value being navigated to for optimistic active state.
  const [pendingParam, setPendingParam] = useState<{ key: string; value: string } | null>(null);

  const category = searchParams.get("category");
  const current = {
    category: category ?? "",
    price: searchParams.get("price") ?? "",
    sort: normaliseSortParam(searchParams.get("sort")),
    tag: searchParams.get("tag") ?? "",
    featured: searchParams.get("featured") === "true",
  };

  const isAllCategories = current.category === "all";
  const hasActiveSidebarFilters = Boolean(
    (current.category && current.category !== "all") ||
    current.price !== "" ||
    current.sort !== DEFAULT_SORT ||
    current.tag ||
    current.featured,
  );

  const buildHref = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      const query = params.toString();
      return query ? `${pathname}?${query}` : pathname;
    },
    [pathname, searchParams],
  );

  const prefetchHref = useCallback(
    (href: string) => {
      router.prefetch(href);
    },
    [router],
  );

  /** Returns true when this specific key+value is the optimistic target. */
  function isOptimistic(key: string, value: string) {
    return isPending && pendingParam?.key === key && pendingParam?.value === value;
  }

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      params.delete("page");
      const href = `${pathname}?${params.toString()}`;
      setPendingParam({ key, value });
      beginResourcesNavigation("listing", href);
      startTransition(() => {
        router.push(href, { scroll: false });
      });
      // Keep outside startTransition — closes mobile dialog synchronously.
      onNavigate?.();
    },
    [router, pathname, searchParams, onNavigate]
  );

  const showClearAll = hasActiveSidebarFilters;

  const clearAll = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    params.delete("price");
    params.delete("sort");
    params.delete("tag");
    params.delete("featured");
    params.delete("page");
    const query = params.toString();
    const href = query ? `${pathname}?${query}` : pathname;
    setPendingParam({ key: "clear", value: "all" });
    beginResourcesNavigation("listing", href);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
    onNavigate?.();
  }, [onNavigate, pathname, router, searchParams]);

  return (
    <aside
      className={cn(
        "w-[260px] flex-shrink-0 space-y-5 rounded-[26px] border border-border-subtle bg-card/95 p-5 shadow-sm",
        // Subtle opacity while any navigation is in-flight
        isPending && "pointer-events-none opacity-70",
        className
      )}
      aria-busy={isPending}
    >
      {/* Header + clear */}
      {showHeader && (
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <p className="text-sm font-semibold text-foreground">
            Filters
          </p>
          {showClearAll && (
            <button
              type="button"
              onClick={clearAll}
              className="flex items-center gap-1 rounded-lg px-1 text-caption text-muted-foreground transition hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <X className="h-3 w-3" />
              Clear all
            </button>
          )}
        </div>
      )}

      {/* ── Sort ──────────────────────────────────────────────────── */}
      {showSort && (
        <FilterGroup title="Sort by">
          <ul className="space-y-0.5">
            {SORT_OPTIONS.map((opt) => {
              const optimistic = isOptimistic("sort", opt.value);
              const active = current.sort === opt.value || optimistic;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => updateParam("sort", opt.value)}
                    onMouseEnter={() => prefetchHref(buildHref("sort", opt.value))}
                    onFocus={() => prefetchHref(buildHref("sort", opt.value))}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-small transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? ACTIVE_ROW_CLASS
                        : "text-muted-foreground hover:border-border-subtle hover:bg-muted/60 hover:text-foreground",
                      optimistic && "cursor-wait"
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      {/* ── Category ──────────────────────────────────────────────── */}
      {categories.length > 0 && (
        <FilterGroup title="Category">
          <ul className="space-y-0.5">
            <li>
              <button
                type="button"
                onClick={() => updateParam("category", "all")}
                onMouseEnter={() => prefetchHref(buildHref("category", "all"))}
                onFocus={() => prefetchHref(buildHref("category", "all"))}
                aria-pressed={isAllCategories || isOptimistic("category", "all")}
                className={cn(
                  "w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-small transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                  isAllCategories || isOptimistic("category", "all")
                    ? ACTIVE_ROW_CLASS
                    : "text-muted-foreground hover:border-border-subtle hover:bg-muted/60 hover:text-foreground",
                  isOptimistic("category", "all") && "cursor-wait"
                )}
              >
                All categories
              </button>
            </li>
            {categories.map((cat) => {
              const optimistic = isOptimistic("category", cat.slug);
              const active = current.category === cat.slug || optimistic;
              return (
                <li key={cat.id}>
                  <button
                    type="button"
                    onClick={() => updateParam("category", cat.slug)}
                    onMouseEnter={() => prefetchHref(buildHref("category", cat.slug))}
                    onFocus={() => prefetchHref(buildHref("category", cat.slug))}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-small transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? ACTIVE_ROW_CLASS
                        : "text-muted-foreground hover:border-border-subtle hover:bg-muted/60 hover:text-foreground",
                      optimistic && "cursor-wait"
                    )}
                  >
                    {cat.name}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

      {/* ── Price ─────────────────────────────────────────────────── */}
      {showPrice && (
        <FilterGroup title="Price">
          <ul className="space-y-0.5">
            {PRICE_OPTIONS.map((opt) => {
              const optimistic = isOptimistic("price", opt.value);
              const active = current.price === opt.value || optimistic;
              return (
                <li key={opt.value}>
                  <button
                    type="button"
                    onClick={() => updateParam("price", opt.value)}
                    onMouseEnter={() => prefetchHref(buildHref("price", opt.value))}
                    onFocus={() => prefetchHref(buildHref("price", opt.value))}
                    aria-pressed={active}
                    className={cn(
                      "w-full rounded-xl border border-transparent px-3 py-2.5 text-left text-small transition-[border-color,background-color,color,box-shadow] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                      active
                        ? ACTIVE_ROW_CLASS
                        : "text-muted-foreground hover:border-border-subtle hover:bg-muted/60 hover:text-foreground",
                      optimistic && "cursor-wait"
                    )}
                  >
                    {opt.label}
                  </button>
                </li>
              );
            })}
          </ul>
        </FilterGroup>
      )}

    </aside>
  );
}

// ── FilterGroup ───────────────────────────────────────────────────────────────

function FilterGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-border-subtle pb-4">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="mb-3 flex w-full items-center justify-between rounded-lg px-1 text-small font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <span>{title}</span>
        <span className="inline-flex h-5 w-5 items-center justify-center text-muted-foreground">
          {open ? (
            <Minus className="h-4 w-4 stroke-[1.9]" aria-hidden />
          ) : (
            <Plus className="h-4 w-4 stroke-[1.9]" aria-hidden />
          )}
        </span>
      </button>
      {open && children}
    </div>
  );
}
