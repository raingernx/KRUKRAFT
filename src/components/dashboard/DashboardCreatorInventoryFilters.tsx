"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Check, ChevronDown } from "@/lib/icons";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@/design-system";
import type {
  DashboardCreatorResourcePricingFilter,
  DashboardCreatorResourceStatusFilter,
} from "@/services/dashboard/creator-resources.service";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type CreatorResourceSort = "latest" | "downloads" | "revenue";

type Option<T extends string> = {
  key: T;
  label: string;
};

function getCreatorResourcesHref(params: {
  status: DashboardCreatorResourceStatusFilter;
  pricing: DashboardCreatorResourcePricingFilter;
  sort: CreatorResourceSort;
  categoryId?: string | null;
}) {
  const searchParams = new URLSearchParams();

  if (params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.pricing !== "all") {
    searchParams.set("pricing", params.pricing);
  }

  if (params.sort !== "latest") {
    searchParams.set("sort", params.sort);
  }

  if (params.categoryId) {
    searchParams.set("category", params.categoryId);
  }

  const query = searchParams.toString();
  return query
    ? `${routes.dashboardCreatorResources}?${query}`
    : routes.dashboardCreatorResources;
}

function DropdownFilter<T extends string>({
  ariaLabel,
  current,
  label,
  onNavigate,
  options,
}: {
  ariaLabel: string;
  current: T;
  label: string;
  onNavigate: (value: T) => void;
  options: readonly Option<T>[];
}) {
  const currentOption = options.find((option) => option.key === current) ?? options[0];

  return (
    <Dropdown modal={false}>
      <DropdownTrigger asChild>
        <Button
          aria-label={ariaLabel}
          className="min-w-0 justify-between rounded-xl px-3 sm:px-4"
          fullWidth
          size="sm"
          variant="soft"
        >
          <span className="min-w-0 truncate text-left">
            <span className="text-foreground">{label}</span>
            <span className="hidden text-muted-foreground md:inline"> · </span>
            <span className="hidden text-muted-foreground md:inline">
              {currentOption.label}
            </span>
          </span>
          <ChevronDown className="size-4 text-muted-foreground" aria-hidden />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        align="start"
        className="w-56 rounded-xl border-border-subtle bg-card p-1 shadow-card-lg"
        sideOffset={8}
      >
        {options.map((option) => (
          <DropdownItem
            key={option.key}
            className="rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground focus:bg-muted focus:text-foreground"
            onClick={() => onNavigate(option.key)}
          >
            <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
              <span className="truncate">{option.label}</span>
              <Check
                className={cn(
                  "size-4 text-foreground transition-opacity",
                  current === option.key ? "opacity-100" : "opacity-0",
                )}
                aria-hidden
              />
            </span>
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}

export function DashboardCreatorInventoryFilters({
  categoryId,
  pricing,
  pricingOptions,
  sort,
  sortOptions,
  status,
  statusOptions,
}: {
  categoryId: string | null;
  pricing: DashboardCreatorResourcePricingFilter;
  pricingOptions: readonly Option<DashboardCreatorResourcePricingFilter>[];
  sort: CreatorResourceSort;
  sortOptions: readonly Option<CreatorResourceSort>[];
  status: DashboardCreatorResourceStatusFilter;
  statusOptions: readonly Option<DashboardCreatorResourceStatusFilter>[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function navigate(next: {
    status?: DashboardCreatorResourceStatusFilter;
    pricing?: DashboardCreatorResourcePricingFilter;
    sort?: CreatorResourceSort;
  }) {
    startTransition(() => {
      router.replace(
        getCreatorResourcesHref({
          status: next.status ?? status,
          pricing: next.pricing ?? pricing,
          sort: next.sort ?? sort,
          categoryId,
        }),
      );
    });
  }

  return (
    <div
      aria-busy={isPending}
      className="grid grid-cols-3 gap-2 sm:gap-3"
    >
      <DropdownFilter
        ariaLabel="Filter by status"
        current={status}
        label="Status"
        onNavigate={(value) => navigate({ status: value })}
        options={statusOptions}
      />
      <DropdownFilter
        ariaLabel="Filter by pricing"
        current={pricing}
        label="Pricing"
        onNavigate={(value) => navigate({ pricing: value })}
        options={pricingOptions}
      />
      <DropdownFilter
        ariaLabel="Sort inventory"
        current={sort}
        label="Sort"
        onNavigate={(value) => navigate({ sort: value })}
        options={sortOptions}
      />
    </div>
  );
}
