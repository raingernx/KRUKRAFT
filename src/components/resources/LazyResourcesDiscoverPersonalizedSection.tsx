"use client";

import {
  useEffect,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import type { ResourceCardData } from "@/components/resources/ResourceCard";
import { useAuthViewer } from "@/lib/auth/use-auth-viewer";
import { ResourcesViewerStateProvider } from "./ResourcesViewerStateProvider";

type ResourcesDiscoverPersonalizedSectionProps = {
  fallbackCards: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
};

let resourcesDiscoverPersonalizedSectionLoader:
  Promise<ComponentType<ResourcesDiscoverPersonalizedSectionProps>> | null = null;
let resourcesDiscoverPersonalizedSectionComponent:
  ComponentType<ResourcesDiscoverPersonalizedSectionProps> | null = null;

async function loadResourcesDiscoverPersonalizedSection() {
  if (resourcesDiscoverPersonalizedSectionComponent) {
    return resourcesDiscoverPersonalizedSectionComponent;
  }

  if (!resourcesDiscoverPersonalizedSectionLoader) {
    resourcesDiscoverPersonalizedSectionLoader = import(
      "@/components/resources/ResourcesDiscoverPersonalizedSection"
    ).then((module) => {
      resourcesDiscoverPersonalizedSectionComponent =
        module.ResourcesDiscoverPersonalizedSection;
      return resourcesDiscoverPersonalizedSectionComponent;
    });
  }

  return resourcesDiscoverPersonalizedSectionLoader;
}

export function warmResourcesDiscoverPersonalizedSection() {
  return loadResourcesDiscoverPersonalizedSection();
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
  const authViewer = useAuthViewer({ strategy: "eager" });
  const [hasHydrated, setHasHydrated] = useState(false);
  const [
    ResourcesDiscoverPersonalizedSection,
    setResourcesDiscoverPersonalizedSection,
  ] = useState<ComponentType<ResourcesDiscoverPersonalizedSectionProps> | null>(
    () => resourcesDiscoverPersonalizedSectionComponent,
  );

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (!authViewer.isReady || !authViewer.authenticated) {
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
  }, [authViewer.authenticated, authViewer.isReady]);

  const personalizationReadyState =
    !hasHydrated
      ? "pending"
      : !authViewer.isReady
      ? "pending"
      : !authViewer.authenticated
        ? "skip"
        : ResourcesDiscoverPersonalizedSection
          ? null
          : "pending";

  if (
    !authViewer.isReady ||
    !authViewer.authenticated ||
    !ResourcesDiscoverPersonalizedSection
  ) {
    return (
      <>
        <span
          hidden
          data-resources-discover-personalization-ready={
            personalizationReadyState ?? "pending"
          }
        />
        {children}
      </>
    );
  }

  return (
    <ResourcesViewerStateProvider>
      <ResourcesDiscoverPersonalizedSection
        fallbackCards={fallbackCards}
        eagerCardCount={eagerCardCount}
        eagerPreviewUrls={eagerPreviewUrls}
      />
    </ResourcesViewerStateProvider>
  );
}
