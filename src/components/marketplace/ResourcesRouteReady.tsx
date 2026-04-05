"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  canonicalizeResourcesHref,
  clearResourcesNavigation,
  useResourcesNavigationState,
} from "@/components/marketplace/resourcesNavigationState";
import { waitForNavigationSurfaceReady } from "@/components/providers/navigationDomReady";

const MIN_PENDING_MS = 260;
const RESOURCE_DETAIL_SHELL_SELECTOR = '[data-route-shell-ready="resource-detail"]';
const RESOURCES_BROWSE_SHELL_SELECTOR = '[data-route-shell-ready="resources-browse"]';

export function ResourcesRouteReady() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const navigationState = useResourcesNavigationState();
  const currentSearch = searchParams.toString();
  const currentHref = canonicalizeResourcesHref(
    currentSearch ? `${pathname}?${currentSearch}` : pathname,
  );

  useEffect(() => {
    if (!navigationState.mode || !navigationState.href) {
      return;
    }

    if (currentHref !== navigationState.href) {
      return;
    }

    const routeShellSelector = navigationState.mode === "detail"
      ? RESOURCE_DETAIL_SHELL_SELECTOR
      : RESOURCES_BROWSE_SHELL_SELECTOR;

    return waitForNavigationSurfaceReady(
      routeShellSelector,
      () => {
        clearResourcesNavigation(navigationState.id);
      },
      MIN_PENDING_MS,
      navigationState.startedAt,
    );
  }, [currentHref, navigationState]);

  return null;
}
