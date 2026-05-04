"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { ResourceDetailLoadingShell } from "@/components/resources/detail/ResourceDetailLoadingShell";
import { ResourcesRouteSkeleton } from "@/components/skeletons/ResourcesRouteSkeleton";
import {
  canonicalizeResourcesHref,
  inferResourcesNavigationMode,
  isResourcesSubtreePath,
  useResourcesNavigationState,
} from "@/components/marketplace/resourcesNavigationState";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";
import { routes } from "@/lib/routes";

const RESOURCE_DETAIL_SHELL_SELECTOR = '[data-route-shell-ready="resource-detail"]';
const RESOURCES_BROWSE_SHELL_SELECTOR = '[data-route-shell-ready="resources-browse"]';
const RESOURCES_DISCOVER_PERSONALIZATION_READY_SELECTOR =
  '[data-resources-discover-personalization-ready="true"], [data-resources-discover-personalization-ready="skip"]';
const RESOURCES_DISCOVER_PERSONALIZATION_WAIT_MS = 1_500;

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

export function ResourcesNavigationOverlay() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationState = useResourcesNavigationState();
  const currentSearch = searchParams.toString();
  const currentHref = canonicalizeResourcesHref(
    currentSearch ? `${pathname}?${currentSearch}` : pathname,
  );
  const previousHrefRef = useRef(currentHref);
  const [forcedOverlay, setForcedOverlay] = useState(false);
  const returnedFromResourcesDetail =
    previousHrefRef.current?.startsWith(`${routes.marketplace}/`) &&
    currentHref === routes.marketplace;

  useEffect(() => {
    if (returnedFromResourcesDetail) {
      setForcedOverlay(true);
    } else if (!isResourcesSubtreePath(pathname ?? "")) {
      setForcedOverlay(false);
    }

    previousHrefRef.current = currentHref;
  }, [currentHref, pathname, returnedFromResourcesDetail]);

  useEffect(() => {
    if (!forcedOverlay) {
      return;
    }

    const routeShellSelector = pathname === "/resources"
      ? RESOURCES_BROWSE_SHELL_SELECTOR
      : RESOURCE_DETAIL_SHELL_SELECTOR;
    const shouldWaitForDiscoverPersonalization = currentHref === routes.marketplace;

    return waitForNavigationSurfaceReady(
      routeShellSelector,
      () => {
        setForcedOverlay(false);
      },
      0,
      Date.now(),
      shouldWaitForDiscoverPersonalization
        ? {
            extraReadySelector: RESOURCES_DISCOVER_PERSONALIZATION_READY_SELECTOR,
            maxWaitMs: RESOURCES_DISCOVER_PERSONALIZATION_WAIT_MS,
          }
        : undefined,
    );
  }, [currentHref, forcedOverlay, pathname]);

  const stateDrivenOverlay = Boolean(
    navigationState.mode && navigationState.href && navigationState.overlay,
  );
  const overlayMode = resolveResourcesOverlayMode(pathname, navigationState.href);
  const overlayScope = overlayMode === "detail" ? "resource-detail" : "resources-browse";

  if (!stateDrivenOverlay && !forcedOverlay) {
    return null;
  }

  return (
    <div
      data-loading-scope={overlayScope}
      data-resources-overlay="navigation"
      className="pointer-events-none fixed inset-0 z-[85] bg-background"
    >
      {overlayMode === "detail"
        ? <ResourceDetailLoadingShell />
        : <ResourcesRouteSkeleton mode={overlayMode} />}
    </div>
  );
}
