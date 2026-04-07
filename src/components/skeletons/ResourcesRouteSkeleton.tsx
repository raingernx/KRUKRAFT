"use client";

import { Skeleton } from "boneyard-js/react";
import { NavbarShell } from "@/components/layout/NavbarShell";
import { Container, colorScales } from "@/design-system";
import { HeroBanner } from "@/components/marketplace/HeroBanner";
import { HeroBannerFallback } from "@/components/marketplace/HeroBanner";
import {
  ResourcesCatalogControlsBonesPreview,
  ResourcesCatalogControlsSkeleton,
  ResourcesCatalogSearchBonesPreview,
  ResourcesCatalogSearchSkeleton,
} from "@/components/marketplace/ResourcesCatalogControlsSkeleton";
import {
  ResourcesDiscoverSectionsBonesPreview,
  ResourcesDiscoverSectionsSkeleton,
} from "@/components/skeletons/ResourcesDiscoverSectionsSkeleton";
import { ResourcesContentFallback } from "@/components/skeletons/ResourcesContentFallback";
import { ResourcesIntroSectionSkeleton } from "@/components/skeletons/ResourcesIntroSectionSkeleton";

const RESOURCES_ROUTE_SKELETON_NAME = "resources-route-shell";

/**
 * Route-level skeleton for /resources.
 *
 * It mirrors the discover shell geometry because that is the primary public
 * entry to /resources and includes the hero/banner footprint that the live
 * page renders above the fold.
 */
function ManualResourcesDiscoverRouteSkeleton() {
  return (
    <div
      data-loading-scope="resources-browse"
      className="flex min-h-screen flex-col bg-background"
    >
      <NavbarShell
        hasMarketplaceShell
        headerSearch={<ResourcesCatalogSearchSkeleton />}
        secondaryRow={<ResourcesCatalogControlsSkeleton />}
      />

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: colorScales.brand[300] }}
        >
          <Container className="py-5 sm:py-6 lg:py-8">
            <HeroBannerFallback className="shadow-none" />
          </Container>
        </section>

        <Container className="space-y-16 pb-12 pt-5 sm:space-y-16 sm:pb-14 sm:pt-6 lg:space-y-20 lg:pb-16 lg:pt-8">
          <ResourcesDiscoverSectionsSkeleton />
        </Container>
      </main>
    </div>
  );
}

function ManualResourcesListingRouteSkeleton() {
  return (
    <div
      data-loading-scope="resources-browse"
      className="flex min-h-screen flex-col bg-background"
    >
      <NavbarShell
        hasMarketplaceShell
        headerSearch={<ResourcesCatalogSearchSkeleton />}
        secondaryRow={<ResourcesCatalogControlsSkeleton />}
      />

      <main className="flex-1">
        <Container className="space-y-6 pb-12 pt-5 sm:pb-14 sm:pt-6 lg:pb-16 lg:pt-8">
          <ResourcesIntroSectionSkeleton isDiscoverMode={false} />
          <ResourcesContentFallback isDiscoverMode={false} />
        </Container>
      </main>
    </div>
  );
}

function ResourcesRoutePreview() {
  return (
    <div
      data-loading-scope="resources-browse-preview"
      className="flex min-h-screen flex-col bg-background"
    >
      <NavbarShell
        hasMarketplaceShell
        headerSearch={<ResourcesCatalogSearchBonesPreview />}
        secondaryRow={<ResourcesCatalogControlsBonesPreview />}
      />

      <main className="flex-1">
        <section
          className="relative overflow-hidden"
          style={{ backgroundColor: colorScales.brand[300] }}
        >
          <Container className="py-5 sm:py-6 lg:py-8">
            <HeroBanner className="shadow-none" />
          </Container>
        </section>

        <Container className="space-y-16 pb-12 pt-5 sm:space-y-16 sm:pb-14 sm:pt-6 lg:space-y-20 lg:pb-16 lg:pt-8">
          <ResourcesDiscoverSectionsBonesPreview />
        </Container>
      </main>
    </div>
  );
}

export function ResourcesRouteSkeletonBonesPreview() {
  return (
    <Skeleton
      name={RESOURCES_ROUTE_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <ResourcesRoutePreview />
    </Skeleton>
  );
}

export function ResourcesRouteSkeleton({
  mode = "discover",
}: {
  mode?: "discover" | "listing";
}) {
  return mode === "listing"
    ? <ManualResourcesListingRouteSkeleton />
    : <ManualResourcesDiscoverRouteSkeleton />;
}
