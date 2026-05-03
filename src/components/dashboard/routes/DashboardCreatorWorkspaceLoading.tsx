import Link from "next/link";

import { ChevronRight } from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { routes } from "@/lib/routes";

function DashboardCreatorWorkspaceRouteIntroSkeleton() {
  return (
    <DashboardRouteIntro
      eyebrow="Creator route"
      title="Workspace"
      description="Set up your storefront, publish your first listing, and unlock creator reporting from one workspace."
      action={
        <>
          <Button asChild size="md">
            <Link className="whitespace-nowrap" href={routes.dashboardCreatorNewResource}>
              Create resource
            </Link>
          </Button>
          <Button asChild size="md" variant="quiet">
            <Link className="whitespace-nowrap" href={routes.dashboardCreatorProfile}>
              Storefront
            </Link>
          </Button>
        </>
      }
    />
  );
}

function DashboardCreatorWorkspaceResourcesLoadingPanel() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
      <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-5 w-36" />
          <LoadingSkeleton className="h-4 w-72 max-w-full" />
        </div>
        <LoadingSkeleton className="hidden h-9 w-32 rounded-xl md:block" />
      </div>
      <div className="overflow-x-auto">
        <div className="grid min-w-[680px] grid-cols-[minmax(0,1fr)_128px_128px_144px] gap-4 border-b border-border-subtle px-5 py-3">
          <LoadingSkeleton className="h-3 w-20" />
          <LoadingSkeleton className="h-3 w-14" />
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-3 w-20" />
        </div>
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="grid min-w-[680px] grid-cols-[minmax(0,1fr)_128px_128px_144px] gap-4 border-b border-border-subtle px-5 py-4"
          >
            <LoadingSkeleton className="h-4 w-3/4" />
            <LoadingSkeleton className="h-5 w-16 rounded-full" />
            <LoadingSkeleton className="h-4 w-16" />
            <LoadingSkeleton className="h-4 w-20" />
          </div>
        ))}
      </div>
      <div className="border-t border-border-subtle bg-muted/60 px-5 py-3">
        <LoadingSkeleton className="h-4 w-48" />
      </div>
    </div>
  );
}

function DashboardCreatorWorkspaceSummaryLoadingContent() {
  return (
    <section className="space-y-6" data-loading-scope="dashboard-creator">
      <DashboardCreatorWorkspaceRouteIntroSkeleton />
      <section id="creator-workspace" className="space-y-6">
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between xl:col-span-2">
            <div>
              <h2 className="font-ui text-2xl font-semibold text-foreground">
                Overview
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Finish your setup, create your first listing, and keep the launch steps in one place.
              </p>
            </div>
            <Button asChild size="sm" variant="tertiary">
              <Link href={routes.dashboardCreatorNewResource}>
                Create resource
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Button>
          </div>

          <div id="creator-analytics" className="flex flex-col gap-4">
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-3">
                        <LoadingSkeleton className="h-3 w-24" />
                        <LoadingSkeleton className="h-8 w-16" />
                      </div>
                      <LoadingSkeleton className="size-9 rounded-xl" />
                    </div>
                    <LoadingSkeleton className="mt-5 h-3 w-32" />
                  </CardContent>
                </Card>
              ))}
            </div>

            <DashboardCreatorWorkspaceResourcesLoadingPanel />
          </div>

          <Card id="creator-quick-links">
            <CardHeader className="border-b border-border-subtle pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Launch checklist</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Finish setup and ship your first listing.
                  </p>
                </div>
                <LoadingSkeleton className="h-6 w-24 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="divide-y divide-border-subtle">
                {Array.from({ length: 3 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 py-4">
                    <LoadingSkeleton className="size-9 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <LoadingSkeleton className="h-4 w-28" />
                      <LoadingSkeleton className="mt-2 h-3 w-32" />
                    </div>
                    <LoadingSkeleton className="h-6 w-16 rounded-full" />
                  </div>
                ))}
              </div>
              <div className="border-y border-border-subtle px-6 py-4">
                <LoadingSkeleton className="h-3 w-16" />
                <LoadingSkeleton className="mt-2 h-4 w-40 max-w-full" />
              </div>
              <div className="divide-y divide-border-subtle">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3 py-4">
                    <LoadingSkeleton className="size-9 rounded-xl" />
                    <div className="min-w-0 flex-1">
                      <LoadingSkeleton className="h-4 w-28" />
                      <LoadingSkeleton className="mt-2 h-3 w-36" />
                    </div>
                    <LoadingSkeleton className="h-4 w-4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card id="creator-settings-summary">
            <CardHeader className="border-b border-border-subtle pb-4">
              <div className="space-y-2">
                <LoadingSkeleton className="h-6 w-24" />
                <LoadingSkeleton className="h-4 w-64 max-w-full" />
              </div>
            </CardHeader>
            <CardContent className="py-0">
              <div className="divide-y divide-border-subtle">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="px-5 py-5 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <LoadingSkeleton className="h-4 w-36" />
                          <LoadingSkeleton className="h-6 w-20 rounded-full" />
                        </div>
                        <LoadingSkeleton className="h-4 w-full max-w-xl" />
                      </div>
                      <LoadingSkeleton className="h-9 w-full rounded-xl sm:w-28" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </section>
  );
}

export function DashboardCreatorWorkspaceLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-creator-overview">
      <DashboardCreatorWorkspaceSummaryLoadingContent />
    </DashboardPageShell>
  );
}
