"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { ResourceCardData } from "@/components/resources/ResourceCard";
import { useResourcesViewerState } from "./ResourcesViewerStateProvider";

type ResourcesDiscoverPersonalizedSectionProps = {
  fallbackCards: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
};

let resourcesDiscoverPersonalizedSectionLoader:
  Promise<ComponentType<ResourcesDiscoverPersonalizedSectionProps>> | null = null;

async function loadResourcesDiscoverPersonalizedSection() {
  if (!resourcesDiscoverPersonalizedSectionLoader) {
    resourcesDiscoverPersonalizedSectionLoader = import(
      "@/components/resources/ResourcesDiscoverPersonalizedSection"
    ).then((module) => module.ResourcesDiscoverPersonalizedSection);
  }

  return resourcesDiscoverPersonalizedSectionLoader;
}

export function LazyResourcesDiscoverPersonalizedSection({
  fallbackCards,
  eagerCardCount = 0,
  eagerPreviewUrls = [],
  children,
}: {
  fallbackCards: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
  children: ReactNode;
}) {
  const { isAuthenticated, isReady } = useResourcesViewerState();
  const [
    ResourcesDiscoverPersonalizedSection,
    setResourcesDiscoverPersonalizedSection,
  ] = useState<ComponentType<ResourcesDiscoverPersonalizedSectionProps> | null>(
    null,
  );

  useEffect(() => {
    let cancelled = false;

    if (!isReady || !isAuthenticated) {
      return () => {
        cancelled = true;
      };
    }

    void loadResourcesDiscoverPersonalizedSection().then((component) => {
      if (!cancelled) {
        setResourcesDiscoverPersonalizedSection(() => component);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, isReady]);

  if (
    !isReady ||
    !isAuthenticated ||
    !ResourcesDiscoverPersonalizedSection
  ) {
    return <>{children}</>;
  }

  return (
    <ResourcesDiscoverPersonalizedSection
      fallbackCards={fallbackCards}
      eagerCardCount={eagerCardCount}
      eagerPreviewUrls={eagerPreviewUrls}
    />
  );
}
