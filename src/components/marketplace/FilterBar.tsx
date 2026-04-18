"use client";

import { useTransition } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { ChevronDown, X } from "@/lib/icons";
import { cn } from "@/lib/utils";
import { formatNumber } from "@/lib/format";
import { DEFAULT_SORT, SORT_OPTIONS, normaliseSortParam } from "@/config/sortOptions";
import { beginResourcesNavigation } from "@/components/marketplace/resourcesNavigationState";

const PRICE_OPTIONS = [
  { value: "",     label: "Any price" },
  { value: "free", label: "Free"      },
  { value: "paid", label: "Paid"      },
] as const;

/* ── FilterBar ───────────────────────────────────────────────────────────── */

interface Props {
  /** Total result count rendered on the left side */
  total: number;
}

/**
 * Compact filter row below the category chips.
 * Reads/writes ?sort= and ?price= URL params; resets to page 1 on every change.
 * Uses useTransition so controls show a disabled/pending state immediately
 * while the route is loading — eliminates the frozen-click feeling.
 */
export function FilterBar({ total }: Props) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const sort  = normaliseSortParam(searchParams.get("sort"));
  const price = searchParams.get("price") ?? "";

  const hasActiveFilterControls = price !== "" || sort !== DEFAULT_SORT;

  function update(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    const isEmpty = value === "" || (key === "sort" && value === DEFAULT_SORT);
    if (isEmpty) {
      params.delete(key);
    } else {
      params.set(key, value);
    }
    params.delete("page");
    const href = `${pathname}?${params.toString()}`;
    beginResourcesNavigation("listing", href);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  function clearFilterControls() {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("price");
    params.delete("sort");
    params.delete("page");
    const href = `${pathname}?${params.toString()}`;
    beginResourcesNavigation("listing", href);
    startTransition(() => {
      router.push(href, { scroll: false });
    });
  }

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-[24px] border border-border-subtle bg-card/95 p-3.5 shadow-sm transition-opacity sm:flex-row sm:flex-wrap sm:items-center sm:justify-between sm:p-4",
        isPending && "opacity-60"
      )}
    >
      {/* Result count */}
      <p className="shrink-0 text-small font-medium text-foreground">
        {total === 1 ? "1 resource" : `${formatNumber(total)} resources`}
      </p>

      {/* Filter selects + clear */}
      <div className="grid w-full grid-cols-1 gap-2 sm:flex sm:w-auto sm:items-center">
        <FilterSelect
          value={price}
          options={PRICE_OPTIONS}
          onChange={(v) => update("price", v)}
          disabled={isPending}
          aria-label="Filter by price"
        />
        <FilterSelect
          value={sort}
          options={SORT_OPTIONS}
          onChange={(v) => update("sort", v)}
          disabled={isPending}
          aria-label="Sort resources"
        />
        {hasActiveFilterControls && (
          <button
            type="button"
            onClick={clearFilterControls}
            disabled={isPending}
            aria-label="Clear sort and price filters"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-transparent px-3.5 py-2.5 text-small text-muted-foreground transition hover:bg-muted/70 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-60"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

/* ── FilterSelect ────────────────────────────────────────────────────────── */

function FilterSelect({
  value,
  options,
  onChange,
  disabled,
  "aria-label": ariaLabel,
}: {
  value: string;
  options: readonly { value: string; label: string }[];
  onChange: (v: string) => void;
  disabled?: boolean;
  "aria-label"?: string;
}) {
  const isActive = value !== "" && value !== DEFAULT_SORT;
  const selectStateClass = isActive
    ? "border-primary/20 bg-primary/10 text-foreground shadow-sm hover:border-primary/28 hover:bg-primary/12"
    : "border-border-subtle bg-background text-muted-foreground hover:border-border hover:bg-muted/60 hover:text-foreground";

  return (
    <div className="relative min-w-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        aria-label={ariaLabel}
        className={cn(
          "min-h-11 w-full appearance-none cursor-pointer rounded-xl border py-2.5 pl-3.5 pr-9",
          "text-small outline-none transition-[border-color,background-color,box-shadow,color]",
          "focus:border-ring focus:ring-2 focus:ring-ring/20",
          "focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/20",
          "disabled:cursor-not-allowed disabled:opacity-60",
          selectStateClass,
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  );
}
