"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  inferResourcesNavigationMode,
  isResourcesSubtreePath,
  useResourcesNavigationState,
} from "@/components/marketplace/resourcesNavigationState";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";
import { routes } from "@/lib/routes";
import { LoadingSkeleton } from "@/design-system";

const RESOURCE_DETAIL_SHELL_SELECTOR = '[data-route-shell-ready="resource-detail"]';
const RESOURCES_BROWSE_SHELL_SELECTOR = '[data-route-shell-ready="resources-browse"]';
const MIN_ENTRY_PENDING_MS = 260;

function ResourcesBrowseOverlayFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border-subtle bg-background px-4 py-4 sm:px-6">
        <LoadingSkeleton className="h-11 w-full max-w-5xl rounded-full" />
        <div className="mt-4 flex flex-wrap gap-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <LoadingSkeleton key={index} className="h-10 w-24 rounded-full" />
          ))}
        </div>
      </header>

      <main className="flex-1">
        <div className="h-[408px] bg-primary/60" />
        <div className="space-y-8 px-4 py-8 sm:px-6 lg:px-8">
          <LoadingSkeleton className="h-8 w-56" />
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="aspect-[5/6] rounded-[28px]" />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

function ResourceDetailOverlayFallback() {
  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8">
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-40" />
          <LoadingSkeleton className="h-10 w-3/4 max-w-2xl rounded-2xl" />
          <LoadingSkeleton className="h-4 w-64" />
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10">
          <LoadingSkeleton className="min-h-[420px] rounded-[28px]" />
          <LoadingSkeleton className="min-h-[480px] rounded-[28px]" />
        </div>
      </div>
    </div>
  );
}

const ResourceDetailLoadingShell = dynamic(
  () =>
    import("@/components/resources/detail/ResourceDetailLoadingShell").then(
      (mod) => mod.ResourceDetailLoadingShell,
    ),
  {
    loading: () => <ResourceDetailOverlayFallback />,
  },
);

const ResourcesRouteSkeleton = dynamic(
  () =>
    import("@/components/skeletons/ResourcesRouteSkeleton").then(
      (mod) => mod.ResourcesRouteSkeleton,
    ),
  {
    loading: () => <ResourcesBrowseOverlayFallback />,
  },
);

function resolveResourcesOverlayMode(
  pathname: string | null,
  href: string | null,
): "discover" | "listing" | "detail" {
  const targetMode = href ? inferResourcesNavigationMode(href) : null;

  if (targetMode === "detail") {
    return "detail";
  }

  if (targetMode === "listing") {
    return "listing";
  }

  if (targetMode === "discover") {
    return "discover";
  }

  if (pathname?.startsWith(`${routes.marketplace}/`)) {
    return "detail";
  }

  return "discover";
}

export function ResourcesEntryNavigationOverlay() {
  const pathname = usePathname();
  const navigationState = useResourcesNavigationState();
  const previousPathRef = useRef(pathname);
  const forcedOverlayStartedAtRef = useRef(0);
  const [forcedOverlay, setForcedOverlay] = useState(false);
  const targetHref = navigationState.href;
  const isCrossingIntoResources =
    Boolean(targetHref) &&
    Boolean(navigationState.overlay) &&
    inferResourcesNavigationMode(targetHref ?? "") !== null &&
    !isResourcesSubtreePath(pathname ?? "");
  const crossedIntoResources =
    isResourcesSubtreePath(pathname ?? "") &&
    !isResourcesSubtreePath(previousPathRef.current ?? "");

  useEffect(() => {
    if (crossedIntoResources) {
      forcedOverlayStartedAtRef.current = Date.now();
      setForcedOverlay(true);
    } else if (!isResourcesSubtreePath(pathname ?? "")) {
      forcedOverlayStartedAtRef.current = 0;
      setForcedOverlay(false);
    }

    previousPathRef.current = pathname;
  }, [crossedIntoResources, pathname]);

  useEffect(() => {
    if (!forcedOverlay) {
      return;
    }

    const routeShellSelector = pathname === routes.marketplace
      ? RESOURCES_BROWSE_SHELL_SELECTOR
      : RESOURCE_DETAIL_SHELL_SELECTOR;

    return waitForNavigationSurfaceReady(
      routeShellSelector,
      () => {
        setForcedOverlay(false);
      },
      MIN_ENTRY_PENDING_MS,
      forcedOverlayStartedAtRef.current || navigationState.startedAt || Date.now(),
    );
  }, [forcedOverlay, navigationState.startedAt, pathname]);

  const stateDrivenOverlay = isCrossingIntoResources;

  if (!stateDrivenOverlay && !forcedOverlay && !crossedIntoResources) {
    return null;
  }

  const overlayMode = resolveResourcesOverlayMode(pathname, navigationState.href);
  const overlayScope = overlayMode === "detail" ? "resource-detail" : "resources-browse";

  return (
    <div
      data-loading-scope={overlayScope}
      data-resources-overlay="entry"
      className="pointer-events-none fixed inset-0 z-[84] bg-background"
    >
      {overlayMode === "detail"
        ? <ResourceDetailLoadingShell />
        : <ResourcesRouteSkeleton mode={overlayMode} />}
    </div>
  );
}
