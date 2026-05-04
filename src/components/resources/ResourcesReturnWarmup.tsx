"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthViewer } from "@/lib/auth/use-auth-viewer";
import { routes } from "@/lib/routes";
import { fetchJson } from "@/lib/use-fetch-json";
import { RESOURCES_VIEWER_SESSION_TTL_MS } from "@/lib/resources/viewerCacheConfig";
import type {
  ResourcesViewerBaseState,
  ResourcesViewerDiscoverState,
} from "@/lib/resources/viewer-state";
import { warmResourcesDiscoverPersonalizedSection } from "./LazyResourcesDiscoverPersonalizedSection";

export function ResourcesReturnWarmup() {
  const router = useRouter();
  const authViewer = useAuthViewer({ strategy: "eager" });

  useEffect(() => {
    router.prefetch(routes.marketplace);
  }, [router]);

  useEffect(() => {
    if (!authViewer.isReady || !authViewer.authenticated || !authViewer.user?.id) {
      return;
    }

    const userId = authViewer.user.id;

    void fetchJson<ResourcesViewerBaseState>({
      url: "/api/resources/viewer-state?scope=base",
      cacheKey: `resources-viewer-base:${userId}`,
      ttlMs: RESOURCES_VIEWER_SESSION_TTL_MS,
      persist: "session",
    });

    void fetchJson<ResourcesViewerDiscoverState>({
      url: "/api/resources/viewer-state?scope=discover",
      cacheKey: `resources-viewer-discover:${userId}`,
      ttlMs: RESOURCES_VIEWER_SESSION_TTL_MS,
      persist: "session",
    });

    void warmResourcesDiscoverPersonalizedSection();
  }, [authViewer.authenticated, authViewer.isReady, authViewer.user?.id]);

  return null;
}
