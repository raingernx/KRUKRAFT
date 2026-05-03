"use client";

import { Button, Chip, ChipRemoveButton } from "@/design-system";

type FilterKey = "search" | "status" | "categoryId";

export interface AdminFilterChipsProps {
  filters: {
    search: string;
    status: string;
    categoryId: string;
  };
  categories: { id: string; name: string }[];
  onRemove: (key: FilterKey) => void;
  onClearAll?: () => void;
}

export function FilterChips({
  filters,
  categories,
  onRemove,
  onClearAll,
}: AdminFilterChipsProps) {
  const chips: { key: FilterKey; label: string; value: string }[] = [];

  if (filters.search.trim()) {
    chips.push({
      key: "search",
      label: "Search",
      value: filters.search.trim(),
    });
  }

  if (filters.status) {
    const label =
      filters.status === "PUBLISHED"
        ? "Published"
        : filters.status === "DRAFT"
          ? "Draft"
          : filters.status === "ARCHIVED"
            ? "Archived"
            : filters.status;
    chips.push({
      key: "status",
      label: "Status",
      value: label,
    });
  }

  if (filters.categoryId) {
    const category = categories.find((c) => c.id === filters.categoryId);
    chips.push({
      key: "categoryId",
      label: "Category",
      value: category?.name ?? "Unknown",
    });
  }

  if (!chips.length) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2">
      {chips.map((chip) => (
        <Chip
          key={chip.key}
          variant="removable"
          className="gap-1.5 pr-3"
        >
          <span className="font-medium text-muted-foreground">
            {chip.label}:{" "}
            <span className="font-normal text-foreground">{chip.value}</span>
          </span>
          <ChipRemoveButton
            onClick={() => onRemove(chip.key)}
            aria-label={`Clear ${chip.label.toLowerCase()} filter`}
          />
        </Chip>
      ))}

      {chips.length > 1 && onClearAll && (
        <Button
          type="button"
          variant="tertiary"
          size="sm"
          className="h-6 px-2 text-[11px] text-muted-foreground"
          onClick={onClearAll}
        >
          Clear all filters
        </Button>
      )}
    </div>
  );
}
