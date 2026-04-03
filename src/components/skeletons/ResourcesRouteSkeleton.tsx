import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/design-system";
import { HeroBannerFallback } from "@/components/marketplace/HeroBanner";
import {
  ResourcesCatalogControlsSkeleton,
  ResourcesCatalogSearchSkeleton,
} from "@/components/marketplace/ResourcesCatalogControlsSkeleton";
import { ResourcesDiscoverSectionsSkeleton } from "@/components/skeletons/ResourcesDiscoverSectionsSkeleton";

/**
 * Route-level skeleton for /resources.
 *
 * It mirrors the discover shell geometry because that is the primary public
 * entry to /resources and includes the hero/banner footprint that the live
 * page renders above the fold.
 */
export function ResourcesRouteSkeleton() {
  const discoverHeroClassName =
    "min-h-[440px] rounded-[26px] border-white/70 sm:min-h-[500px] lg:min-h-[540px]";

  return (
    <div
      data-loading-scope="resources-browse"
      className="flex min-h-screen flex-col bg-surface-50"
    >
      <Navbar
        headerSearch={<ResourcesCatalogSearchSkeleton />}
        secondaryRow={<ResourcesCatalogControlsSkeleton showDiscoverMeta />}
      />

      <main className="flex-1">
        <section className="relative overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(224,231,255,0.78),transparent_32%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
          <Container className="py-4 sm:py-6 lg:py-7">
            <HeroBannerFallback className={discoverHeroClassName} />
          </Container>
        </section>

        <Container className="space-y-16 pb-12 pt-5 sm:space-y-16 sm:pb-14 sm:pt-6 lg:space-y-20 lg:pb-16 lg:pt-8">
          <ResourcesDiscoverSectionsSkeleton />
        </Container>
      </main>
    </div>
  );
}
