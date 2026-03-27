"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import {
  FilterSidebar,
  type FilterCategory,
} from "@/components/marketplace/FilterSidebar";

interface MobileFilterDialogProps {
  categories: FilterCategory[];
  activeCount: number;
}

interface CategoryBrowseDialogProps {
  categories: Array<{
    id: string;
    name: string;
    slug: string;
    resourceCount?: number;
  }>;
}

export function MobileFilterDialog({
  categories,
  activeCount,
}: MobileFilterDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <Modal.Root open={open} onOpenChange={setOpen}>
        <Modal.Trigger
          className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-lg border border-surface-200 bg-white px-4 py-2.5 text-sm font-medium text-text-primary shadow-sm transition hover:border-surface-300 hover:bg-surface-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/25 focus-visible:ring-offset-2"
        >
          <SlidersHorizontal className="h-4 w-4 text-text-muted" />
          Filters
          {activeCount > 0 && (
            <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-brand-600 px-1.5 py-0.5 text-[11px] font-semibold text-white">
              {activeCount}
            </span>
          )}
        </Modal.Trigger>

        <Modal.Content size="lg" className="max-h-[min(88vh,760px)] p-0">
          <Modal.Header>
            <Modal.Title>Browse filters</Modal.Title>
            <Modal.Description>
              Refine categories, difficulty, and resource type. Sort and price stay
              available in the main toolbar.
            </Modal.Description>
          </Modal.Header>

          <Modal.Body className="px-4 py-4 sm:px-5">
            <FilterSidebar
              categories={categories}
              className="w-full space-y-5"
              showSort={false}
              showPrice={false}
              onNavigate={() => setOpen(false)}
            />
          </Modal.Body>
        </Modal.Content>
      </Modal.Root>
    </div>
  );
}

export function CategoryBrowseDialog({
  categories,
}: CategoryBrowseDialogProps) {
  const [open, setOpen] = useState(false);

  return (
    <Modal.Root open={open} onOpenChange={setOpen}>
      <Modal.Trigger
        aria-label="Browse categories"
        className="inline-flex min-h-11 shrink-0 items-center justify-center rounded-2xl border border-surface-200 bg-surface-50 px-4 py-2.5 text-sm font-medium text-text-primary transition hover:border-surface-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/25 focus-visible:ring-offset-2"
      >
        Browse categories
      </Modal.Trigger>

      <Modal.Content size="md" className="max-h-[min(88vh,760px)] p-0">
        <Modal.Header>
          <Modal.Title>Browse categories</Modal.Title>
          <Modal.Description>
            Jump straight into a category without scanning the full page.
          </Modal.Description>
        </Modal.Header>

        <Modal.Body className="px-4 py-4 sm:px-5">
          <nav aria-label="Browse categories">
            <ul className="space-y-2">
              <li>
                <IntentPrefetchLink
                  href="/resources"
                  prefetchMode="intent"
                  prefetchScope="discover-category-sheet"
                  prefetchLimit={2}
                  resourcesNavigationMode="discover"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm font-medium text-text-primary transition hover:border-surface-300 hover:bg-surface-50"
                >
                  <span>All categories</span>
                  <span className="text-xs text-text-muted">Discover</span>
                </IntentPrefetchLink>
              </li>

              {categories.map((category) => (
                <li key={category.id}>
                  <IntentPrefetchLink
                    href={`/resources?category=${encodeURIComponent(category.slug)}`}
                    prefetchMode="intent"
                    prefetchScope="discover-category-sheet"
                    prefetchLimit={2}
                    resourcesNavigationMode="listing"
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl border border-surface-200 bg-white px-4 py-3 text-sm font-medium text-text-primary transition hover:border-surface-300 hover:bg-surface-50"
                  >
                    <span>{category.name}</span>
                    {typeof category.resourceCount === "number" ? (
                      <span className="text-xs text-text-muted">
                        {category.resourceCount} resource{category.resourceCount === 1 ? "" : "s"}
                      </span>
                    ) : null}
                  </IntentPrefetchLink>
                </li>
              ))}
            </ul>
          </nav>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
