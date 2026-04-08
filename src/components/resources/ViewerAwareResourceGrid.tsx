"use client";

import type { ReactNode } from "react";
import { useAuthViewer } from "@/lib/auth/use-auth-viewer";
import { useFetchJson } from "@/lib/use-fetch-json";
import type { ResourcesViewerBaseState } from "@/lib/resources/viewer-state";
import {
  ResourceGrid,
  ResourceGridOwnedIdsHydrator,
} from "./ResourceGrid";
import type { ResourceCardData } from "./ResourceCard";

const RESOURCES_VIEWER_BASE_TTL_MS = 15_000;

function ViewerAwareResourceGridOwnedIdsHydrator() {
  const authViewer = useAuthViewer({ strategy: "idle", idleTimeoutMs: 800 });
  const shouldLoadOwnedState = authViewer.isReady && authViewer.authenticated;
  const viewerCacheKey =
    authViewer.user?.id
      ? `resources-viewer-base:${authViewer.user.id}`
      : "resources-viewer-base:anonymous";
  const { data: viewerState, isReady } = useFetchJson<ResourcesViewerBaseState>({
    url: "/api/resources/viewer-state?scope=base",
    cacheKey: viewerCacheKey,
    ttlMs: shouldLoadOwnedState ? RESOURCES_VIEWER_BASE_TTL_MS : 0,
    enabled: shouldLoadOwnedState,
  });

  if (!authViewer.isReady || !authViewer.authenticated || !isReady) {
    return null;
  }

  return (
    <ResourceGridOwnedIdsHydrator
      ownedIds={viewerState?.ownedResourceIds ?? []}
    />
  );
}

export function ViewerAwareResourceGrid({
  resources,
  total,
  page,
  totalPages,
  loading,
  hasActiveFilters,
  progressiveLoad,
  cardPrefetchMode,
  routeContext,
  emptyState,
}: {
  resources: ResourceCardData[];
  total: number;
  page: number;
  totalPages: number;
  loading?: boolean;
  hasActiveFilters?: boolean;
  progressiveLoad?: boolean;
  cardPrefetchMode?: "intent" | "viewport" | "none";
  routeContext?: {
    queryKey: string;
    clearFiltersHref: string;
    exploreAllHref: string;
    cardPrefetchScope: string;
  };
  emptyState?: ReactNode;
}) {
  return (
    <ResourceGrid
      resources={resources}
      ownedIds={[]}
      total={total}
      page={page}
      totalPages={totalPages}
      loading={loading}
      hasActiveFilters={hasActiveFilters}
      progressiveLoad={progressiveLoad}
      cardPrefetchMode={cardPrefetchMode}
      routeContext={routeContext}
      emptyState={emptyState}
      deferredOwnedIdsHydrator={<ViewerAwareResourceGridOwnedIdsHydrator />}
    />
  );
}
