"use client";

import dynamic from "next/dynamic";
import type { ResourceCardData } from "@/components/resources/ResourceCard";
import { ResourcesDiscoverPersonalizedSkeleton } from "@/components/resources/ResourcesDiscoverPersonalizedSkeleton";

const ResourcesDiscoverPersonalizedSection = dynamic(
  () =>
    import("@/components/resources/ResourcesDiscoverPersonalizedSection").then(
      (module) => module.ResourcesDiscoverPersonalizedSection,
    ),
  {
    ssr: false,
    loading: () => <ResourcesDiscoverPersonalizedSkeleton cardCount={4} />,
  },
);

export function LazyResourcesDiscoverPersonalizedSection({
  fallbackCards,
  eagerCardCount = 0,
  eagerPreviewUrls = [],
}: {
  fallbackCards: ResourceCardData[];
  eagerCardCount?: number;
  eagerPreviewUrls?: string[];
}) {
  return (
    <ResourcesDiscoverPersonalizedSection
      fallbackCards={fallbackCards}
      eagerCardCount={eagerCardCount}
      eagerPreviewUrls={eagerPreviewUrls}
    />
  );
}
