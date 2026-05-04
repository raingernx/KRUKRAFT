import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container, colorScales } from "@/design-system";
import { DEFAULT_SORT, getEffectiveMarketplaceSort } from "@/config/sortOptions";
import { HeroSearch } from "@/components/marketplace/HeroSearch";
import { ResourcesContentFallback } from "@/components/skeletons/ResourcesContentFallback";
import { ResourcesHeroStageSkeleton } from "@/components/skeletons/ResourcesHeroStageSkeleton";
import {
  ResourcesDiscoverHero,
  ResourcesPageContent,
} from "../ResourcesPageContent";
import { ResourcesCatalogControls } from "@/components/marketplace/ResourcesCatalogControls";
import { ResourcesRouteReady } from "@/components/marketplace/ResourcesRouteReady";
import {
  ResourcesCatalogSearchSkeleton,
  ResourcesCatalogControlsSkeleton,
} from "@/components/marketplace/ResourcesCatalogControlsSkeleton";
import {
  withRequestPerformanceTrace,
} from "@/lib/performance/observability";
import {
  isMissingTableError,
  isTransientPrismaInfrastructureError,
} from "@/lib/prismaErrors";
import { routes } from "@/lib/routes";

export const metadata = {
  title: "Discover Study Resources",
  description: "Browse and download study resources.",
};

type SearchParamValue = string | string[] | undefined;

interface ResourcesPageProps {
  searchParams?: Promise<Record<string, SearchParamValue>>;
}

function getSearchParamValue(value: SearchParamValue) {
  if (Array.isArray(value)) {
    return value[0];
  }

  return value;
}

async function AwaitResolvedNode({
  promise,
}: {
  promise: Promise<ReactNode>;
}) {
  return <>{await promise}</>;
}

function isResourcesRouteFailSoftError(error: unknown) {
  return (
    isMissingTableError(error) ||
    isTransientPrismaInfrastructureError(error)
  );
}

function ResourcesRouteUnavailableState() {
  return (
    <div className="rounded-[28px] border border-border-subtle bg-card px-6 py-10 text-center shadow-sm sm:px-8 sm:py-12">
      <div className="space-y-3">
        <p className="text-small font-medium text-muted-foreground">
          Temporary service issue
        </p>
        <h2 className="font-display text-3xl font-semibold text-foreground">
          This library view could not refresh right now.
        </h2>
        <p className="mx-auto max-w-2xl text-body leading-7 text-muted-foreground">
          The marketplace shell is still here, but part of the resource data hit a temporary service issue.
          Try again or jump back to the main resource index.
        </p>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button asChild size="lg">
          <Link href={routes.marketplace}>Try resources again</Link>
        </Button>
      </div>
    </div>
  );
}

function ResourcesCatalogControlsUnavailableState() {
  return <ResourcesCatalogControlsSkeleton />;
}

export default async function ResourcesPage({ searchParams }: ResourcesPageProps) {
  const resolvedParams = searchParams ? await searchParams : {};

  const {
    search: rawSearch,
    category: rawCategory,
    price: rawPrice,
    featured: rawFeatured,
    tag: rawTag,
    sort: rawSort,
    page: rawPage,
  } = resolvedParams;

  const search = getSearchParamValue(rawSearch)?.trim();
  const category = getSearchParamValue(rawCategory)?.trim();
  const rawPriceValue = getSearchParamValue(rawPrice)?.trim() ?? "";
  const price = rawPriceValue === "free" || rawPriceValue === "paid" ? rawPriceValue : "";
  const featured = getSearchParamValue(rawFeatured)?.trim();
  const tag = getSearchParamValue(rawTag)?.trim();
  const hasSearch = Boolean(search);
  const sort = getEffectiveMarketplaceSort(getSearchParamValue(rawSort), hasSearch);
  const pageParam = getSearchParamValue(rawPage)?.trim();
  const currentPage = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const hasListingIntent = Boolean(
    search ||
    category ||
    price ||
    tag ||
    featured === "true" ||
    currentPage > 1 ||
    sort !== DEFAULT_SORT,
  );
  const isDiscoverMode = !hasListingIntent;

  return withRequestPerformanceTrace(
    "route:/resources",
    {
      category: category ?? null,
      currentPage,
      mode: isDiscoverMode ? "discover" : "listing",
      sort,
    },
    async () => {
      const heroPromise = isDiscoverMode
        ? ResourcesDiscoverHero({
            className: "shadow-none",
          })
        : null;
      const catalogControlsPromise = ResourcesCatalogControls().catch((error) => {
        if (!isResourcesRouteFailSoftError(error)) {
          throw error;
        }

        console.error("[RESOURCES_ROUTE_CATALOG_CONTROLS_FALLBACK]", {
          category: category ?? "all",
          currentPage,
          mode: isDiscoverMode ? "discover" : "listing",
          sort,
          error:
            error instanceof Error
              ? { message: error.message, name: error.name }
              : String(error),
          fallbackApplied: true,
        });

        return <ResourcesCatalogControlsUnavailableState />;
      });
      const contentPromise = ResourcesPageContent({
        isDiscoverMode,
        search,
        category,
        price,
        featured,
        tag,
        sort,
        effectiveSort: sort,
        currentPage,
      }).catch((error) => {
        if (!isResourcesRouteFailSoftError(error)) {
          throw error;
        }

        console.error("[RESOURCES_ROUTE_CONTENT_FALLBACK]", {
          category: category ?? "all",
          currentPage,
          mode: isDiscoverMode ? "discover" : "listing",
          sort,
          error:
            error instanceof Error
              ? { message: error.message, name: error.name }
              : String(error),
          fallbackApplied: true,
        });

        return <ResourcesRouteUnavailableState />;
      });

      return (
        <div
          data-route-shell-ready="resources-browse"
          className="flex min-h-screen flex-col bg-background"
        >
          <ResourcesRouteReady />
          <Navbar
            headerSearch={
              <Suspense fallback={<ResourcesCatalogSearchSkeleton />}>
                <HeroSearch />
              </Suspense>
            }
            secondaryRow={
              <Suspense fallback={<ResourcesCatalogControlsSkeleton />}>
                <AwaitResolvedNode promise={catalogControlsPromise} />
              </Suspense>
            }
          />

          <main className="flex-1">
            {isDiscoverMode ? (
              <section
                className="relative overflow-hidden"
                style={{ backgroundColor: colorScales.brand[300] }}
              >
                <Container className="space-y-4 py-5 sm:space-y-5 sm:py-6 lg:space-y-6 lg:py-8">
                  {heroPromise ? (
                    <Suspense fallback={<ResourcesHeroStageSkeleton />}>
                      <AwaitResolvedNode promise={heroPromise} />
                    </Suspense>
                  ) : null}
                </Container>
              </section>
            ) : null}

            <Container
              className={
                isDiscoverMode
                  ? "space-y-10 pb-12 pt-5 sm:space-y-12 sm:pb-14 sm:pt-6 lg:space-y-14 lg:pb-16 lg:pt-8"
                  : "space-y-12 py-12 sm:space-y-14 sm:py-14 lg:space-y-16 lg:py-16"
              }
            >
              <Suspense fallback={<ResourcesContentFallback isDiscoverMode={isDiscoverMode} />}>
                <AwaitResolvedNode promise={contentPromise} />
              </Suspense>
            </Container>
          </main>
        </div>
      );
    },
  );
}
