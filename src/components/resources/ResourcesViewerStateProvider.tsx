"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { useAuthViewer } from "@/lib/auth/use-auth-viewer";
import { useFetchJson } from "@/lib/use-fetch-json";
import type { ResourcesViewerBaseState } from "@/lib/resources/viewer-state";

type ResourcesViewerContextValue = {
  userId: string | null;
  ownedResourceIds: string[];
  ownedIdSet: Set<string>;
  isAuthenticated: boolean;
  isAuthReady: boolean;
  isReady: boolean;
};

const EMPTY_VIEWER_STATE: ResourcesViewerContextValue = {
  userId: null,
  ownedResourceIds: [],
  ownedIdSet: new Set<string>(),
  isAuthenticated: false,
  isAuthReady: false,
  isReady: false,
};

const ResourcesViewerStateContext =
  createContext<ResourcesViewerContextValue>(EMPTY_VIEWER_STATE);

const RESOURCES_VIEWER_BASE_TTL_MS = 5 * 60_000;

export function ResourcesViewerStateProvider({
  children,
}: {
  children: ReactNode;
}) {
  const authViewer = useAuthViewer({ strategy: "eager" });
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
    persist: "session",
  });

  const value = useMemo<ResourcesViewerContextValue>(
    () => ({
      userId: authViewer.user?.id ?? null,
      ownedResourceIds: viewerState?.ownedResourceIds ?? [],
      ownedIdSet: new Set(viewerState?.ownedResourceIds ?? []),
      isAuthenticated: authViewer.authenticated,
      isAuthReady: authViewer.isReady,
      isReady: authViewer.isReady && (!shouldLoadOwnedState || isReady),
    }),
    [
      authViewer.user?.id,
      authViewer.authenticated,
      authViewer.isReady,
      isReady,
      shouldLoadOwnedState,
      viewerState,
    ],
  );

  return (
    <ResourcesViewerStateContext.Provider value={value}>
      {children}
    </ResourcesViewerStateContext.Provider>
  );
}

export function useResourcesViewerState() {
  return useContext(ResourcesViewerStateContext);
}
