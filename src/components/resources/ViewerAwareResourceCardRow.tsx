"use client";

import { useAuthViewer } from "@/lib/auth/use-auth-viewer";
import { useFetchJson } from "@/lib/use-fetch-json";
import type { ResourcesViewerBaseState } from "@/lib/resources/viewer-state";
import {
  ResourceCard,
  type ResourceCardData,
} from "./ResourceCard";

const RESOURCES_VIEWER_BASE_TTL_MS = 15_000;

function getResourcePreviewUrl(resource: ResourceCardData) {
  return resource.thumbnailUrl ?? resource.previewImages?.[0] ?? resource.previewUrl ?? null;
}

export function ViewerAwareResourceCardRow({
  resources,
  eagerCardCount = 0,
  eagerPreviewUrls = [],
  className = "grid gap-6 lg:gap-8 [grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]",
}: {
  resources: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
  className?: string;
}) {
  const authViewer = useAuthViewer({ strategy: "idle", idleTimeoutMs: 800 });
  const shouldLoadOwnedState = authViewer.isReady && authViewer.authenticated;
  const viewerCacheKey =
    authViewer.user?.id
      ? `resources-viewer-base:${authViewer.user.id}`
      : "resources-viewer-base:anonymous";
  const { data: viewerState } = useFetchJson<ResourcesViewerBaseState>({
    url: "/api/resources/viewer-state?scope=base",
    cacheKey: viewerCacheKey,
    ttlMs: shouldLoadOwnedState ? RESOURCES_VIEWER_BASE_TTL_MS : 0,
    enabled: shouldLoadOwnedState,
  });
  const ownedIdSet = new Set(viewerState?.ownedResourceIds ?? []);
  const eagerPreviewUrlSet = new Set(eagerPreviewUrls);

  return (
    <div className={className}>
      {resources.map((resource, index) => {
        const previewUrl = getResourcePreviewUrl(resource);
        const imageLoading =
          index < eagerCardCount ||
          (previewUrl !== null && eagerPreviewUrlSet.has(previewUrl))
            ? "eager"
            : undefined;

        return (
          <ResourceCard
            key={resource.id}
            resource={resource}
            variant="marketplace"
            owned={ownedIdSet.has(resource.id)}
            linkPrefetchMode="viewport"
            imageLoading={imageLoading}
          />
        );
      })}
    </div>
  );
}
