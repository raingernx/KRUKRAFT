"use client";

import { RECOMMENDATION_EXPERIMENT_ID, type RecommendationVariant } from "@/lib/recommendations/experiment";

interface RecommendationSectionProps {
  /**
   * Experiment variant assigned to this user.
   * Null means the user is a guest or has no history — click events are still
   * fired but will have no userId on the server side.
   */
  variant: RecommendationVariant | null;
  /** Section identifier recorded with every click event. */
  section: string;
  children: React.ReactNode;
}

/**
 * Thin client wrapper around a recommendation grid.
 *
 * - Intercepts click events via event delegation (no changes to ResourceCard).
 * - Reads `data-resource-id` from the closest ancestor element of the click target.
 * - POSTs to /api/recommendations/click with experiment context (fire-and-forget).
 * - In development only: renders a tiny variant badge below the grid.
 */
export function RecommendationSection({
  variant,
  section,
  children,
}: RecommendationSectionProps) {
  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!variant) return;

    const el = (e.target as HTMLElement).closest<HTMLElement>("[data-resource-id]");
    if (!el?.dataset.resourceId) return;

    void fetch("/api/recommendations/click", {
      method:    "POST",
      headers:   { "Content-Type": "application/json" },
      body:      JSON.stringify({
        resourceId: el.dataset.resourceId,
        experiment: RECOMMENDATION_EXPERIMENT_ID,
        variant,
        section,
      }),
      keepalive: true,
    }).catch(() => undefined);
  }

  return (
    <div onClick={handleClick}>
      {children}
      {process.env.NODE_ENV === "development" && variant && (
        <p className="mt-1 text-[10px] text-zinc-400">
          [dev] rec experiment: {RECOMMENDATION_EXPERIMENT_ID} · variant: {variant}
        </p>
      )}
    </div>
  );
}
