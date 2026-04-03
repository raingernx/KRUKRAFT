"use client";

import { usePathname } from "next/navigation";
import { ResourcesRouteSkeleton } from "@/components/skeletons/ResourcesRouteSkeleton";
import { ResourceDetailLoadingShell } from "@/components/resources/detail/ResourceDetailLoadingShell";
import { useResourcesNavigationState } from "@/components/marketplace/resourcesNavigationState";
import { routes } from "@/lib/routes";

export function ResourcesTransitionFallback() {
  const pathname = usePathname();
  const navigationState = useResourcesNavigationState();
  const isDetailPath = pathname.startsWith(`${routes.marketplace}/`);

  if (navigationState.mode === "detail" || isDetailPath) {
    return <ResourceDetailLoadingShell />;
  }

  return <ResourcesRouteSkeleton />;
}
