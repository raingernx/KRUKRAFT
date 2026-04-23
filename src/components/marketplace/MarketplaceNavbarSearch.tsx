"use client";

import dynamic from "next/dynamic";
import { ResourcesCatalogSearchSkeleton } from "@/components/marketplace/ResourcesCatalogControlsSkeleton";

const HeroSearch = dynamic(
  () =>
    import("@/components/marketplace/HeroSearch").then(
      (module) => module.HeroSearch,
    ),
  {
    ssr: false,
    loading: () => <ResourcesCatalogSearchSkeleton />,
  },
);

/**
 * Lazy navbar search used on secondary public routes where a stable shell is
 * more important than hydrating the full marketplace search client bundle on
 * first paint.
 */
export function MarketplaceNavbarSearch() {
  return <HeroSearch />;
}
