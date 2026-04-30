import Link from "next/link";

import {
  ArrowDownToLine,
  BarChart3,
  CircleDollarSign,
  FileText,
} from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  DataPanelTable,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardCreatorStats } from "@/components/dashboard/DashboardCreatorStats";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import {
  DashboardProtectedRouteEmptyState,
  getDashboardStatusBadgeVariant,
} from "@/components/dashboard/routes/DashboardCreatorProtectedShared";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type { DashboardCreatorAnalyticsData } from "@/services/dashboard/creator-analytics.service";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

export function DashboardCreatorAnalyticsContent({
  data,
}: {
  data: DashboardCreatorAnalyticsData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-creator-analytics">
      <DashboardRouteIntro
        eyebrow="Creator analytics"
        title="Analytics"
        description="Review top resources, recent sales, and download activity from one protected creator report."
        tone="featured"
      />

      {data.state === "locked" || data.state === "error" ? (
        <DashboardProtectedRouteEmptyState
          state={data}
          retryHref={routes.dashboardCreatorAnalytics}
          icon={<BarChart3 className="size-5 text-muted-foreground" aria-hidden />}
        />
      ) : (
        <section className="space-y-4">
          <DashboardCreatorStats stats={data.stats} />

          <DataPanelTable
            title="Top resources"
            description="Best performers by creator share in the current analytics window."
            actions={
              <Button asChild size="sm" variant="quiet">
                <Link href={routes.dashboardCreatorResources}>Open resources</Link>
              </Button>
            }
            bodyClassName="p-0"
          >
            {data.topResources.length === 0 ? (
              <div className="p-5">
                <EmptyState
                  icon={<FileText className="size-5 text-muted-foreground" aria-hidden />}
                  title="No resource performance yet"
                  description="Published resources with sales or downloads will appear here."
                  className="border-border-subtle py-16"
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] text-left">
                  <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                    <tr>
                      <th scope="col" className="px-5 py-3 font-medium">
                        Resource
                      </th>
                      <th scope="col" className="w-36 px-5 py-3 font-medium">
                        Revenue
                      </th>
                      <th scope="col" className="w-28 px-5 py-3 font-medium">
                        Sales
                      </th>
                      <th scope="col" className="w-32 px-5 py-3 font-medium">
                        Downloads
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border-subtle">
                    {data.topResources.map((resource) => (
                      <tr key={resource.id}>
                        <td className="max-w-0 px-5 py-4">
                          <Link
                            href={resource.href}
                            className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                          >
                            {resource.title}
                          </Link>
                        </td>
                        <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                          {resource.revenueLabel}
                        </td>
                        <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                          {resource.salesLabel}
                        </td>
                        <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                          {resource.downloadsLabel}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </DataPanelTable>

          <div className="grid gap-4 xl:grid-cols-2">
            <DataPanelTable
              title="Recent sales"
              description="Latest creator orders feeding this analytics window."
              bodyClassName="p-0"
            >
              {data.recentSales.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={
                      <CircleDollarSign
                        className="size-5 text-muted-foreground"
                        aria-hidden
                      />
                    }
                    title="No sales yet"
                    description="Completed creator orders will appear here."
                    className="border-border-subtle py-16"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-medium">
                          Resource
                        </th>
                        <th scope="col" className="w-40 px-5 py-3 font-medium">
                          Buyer
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 font-medium">
                          Gross
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 font-medium">
                          Share
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 font-medium">
                          Status
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {data.recentSales.map((sale) => (
                        <tr key={sale.id}>
                          <td className="max-w-0 px-5 py-4">
                            <Link
                              href={sale.href}
                              className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {sale.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {sale.buyerLabel}
                          </td>
                          <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                            {sale.amountLabel}
                          </td>
                          <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                            {sale.shareLabel}
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              className="w-fit"
                              variant={getDashboardStatusBadgeVariant(sale.statusTone)}
                            >
                              {sale.statusLabel}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {sale.dateLabel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DataPanelTable>

            <DataPanelTable
              title="Recent downloads"
              description="Latest learner download activity from creator resources."
              bodyClassName="p-0"
            >
              {data.recentDownloads.length === 0 ? (
                <div className="p-5">
                  <EmptyState
                    icon={
                      <ArrowDownToLine
                        className="size-5 text-muted-foreground"
                        aria-hidden
                      />
                    }
                    title="No downloads yet"
                    description="Learner download activity will appear here."
                    className="border-border-subtle py-16"
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[560px] text-left">
                    <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-medium">
                          Resource
                        </th>
                        <th scope="col" className="w-44 px-5 py-3 font-medium">
                          Learner
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {data.recentDownloads.map((download) => (
                        <tr key={download.id}>
                          <td className="max-w-0 px-5 py-4">
                            <Link
                              href={download.href}
                              className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {download.title}
                            </Link>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {download.actorLabel}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {download.dateLabel}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </DataPanelTable>
          </div>
        </section>
      )}
    </DashboardPageShell>
  );
}

export function DashboardCreatorAnalyticsLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-creator-analytics">
      <DashboardRouteIntro
        eyebrow="Creator analytics"
        title="Analytics"
        description="Review top resources, recent sales, and download activity from one protected creator report."
        tone="featured"
      />

      <section className="space-y-4" data-loading-scope="dashboard-creator-analytics">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <LoadingSkeleton className="h-3 w-24" />
                    <LoadingSkeleton className="h-8 w-16" />
                  </div>
                  <LoadingSkeleton className="size-9 rounded-xl" />
                </div>
                <LoadingSkeleton className="mt-5 h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-5">
            <div className="space-y-2">
              <LoadingSkeleton className="h-5 w-32" />
              <LoadingSkeleton className="h-4 w-60 max-w-full" />
            </div>
            <LoadingSkeleton className="hidden h-9 w-32 rounded-xl md:block" />
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-[720px] grid-cols-[minmax(0,1fr)_144px_112px_128px] gap-4 border-b border-border-subtle bg-muted/40 px-5 py-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-3 w-16" />
              ))}
            </div>
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="grid min-w-[720px] grid-cols-[minmax(0,1fr)_144px_112px_128px] gap-4 border-b border-border-subtle px-5 py-4"
              >
                <LoadingSkeleton className="h-4 w-3/4" />
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-4 w-14" />
                <LoadingSkeleton className="h-4 w-16" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 xl:grid-cols-2">
          {Array.from({ length: 2 }).map((_, panelIndex) => (
            <div
              key={panelIndex}
              className="overflow-hidden rounded-xl border border-border-subtle bg-card"
            >
              <div className="border-b border-border-subtle px-5 py-5">
                <LoadingSkeleton className="h-5 w-32" />
                <LoadingSkeleton className="mt-2 h-4 w-56 max-w-full" />
              </div>
              <div className="overflow-x-auto">
                <div
                  className={cn(
                    "grid gap-4 border-b border-border-subtle bg-muted/40 px-5 py-3",
                    panelIndex === 0
                      ? "min-w-[760px] grid-cols-[minmax(0,1fr)_160px_112px_112px_112px_128px]"
                      : "min-w-[560px] grid-cols-[minmax(0,1fr)_176px_128px]",
                  )}
                >
                  {Array.from({ length: panelIndex === 0 ? 6 : 3 }).map((__, index) => (
                    <LoadingSkeleton key={index} className="h-3 w-16" />
                  ))}
                </div>
                {Array.from({ length: 4 }).map((__, index) => (
                  <div
                    key={index}
                    className={cn(
                      "grid gap-4 border-b border-border-subtle px-5 py-4",
                      panelIndex === 0
                        ? "min-w-[760px] grid-cols-[minmax(0,1fr)_160px_112px_112px_112px_128px]"
                        : "min-w-[560px] grid-cols-[minmax(0,1fr)_176px_128px]",
                    )}
                  >
                    <LoadingSkeleton className="h-4 w-3/4" />
                    <LoadingSkeleton className="h-4 w-24" />
                    {panelIndex === 0 ? (
                      <>
                        <LoadingSkeleton className="h-4 w-16" />
                        <LoadingSkeleton className="h-4 w-16" />
                        <LoadingSkeleton className="h-5 w-20 rounded-full" />
                        <LoadingSkeleton className="h-4 w-20" />
                      </>
                    ) : (
                      <LoadingSkeleton className="h-4 w-20" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </DashboardPageShell>
  );
}
