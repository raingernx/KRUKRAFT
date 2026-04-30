import type { ReactNode } from "react";
import Link from "next/link";

import {
  ArrowDownToLine,
  BarChart3,
  CircleDollarSign,
  FileText,
  ReceiptText,
  Settings,
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
import { CreatorProfileForm } from "@/components/creator/CreatorProfileForm";
import { DashboardCreatorStats } from "@/components/dashboard/DashboardCreatorStats";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type { DashboardCreatorAnalyticsData } from "@/services/dashboard/creator-analytics.service";
import type { DashboardCreatorEarningsData } from "@/services/dashboard/creator-earnings.service";
import type { DashboardCreatorProfileData } from "@/services/dashboard/creator-profile.service";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";

type DashboardProtectedRouteState =
  | {
      state: "locked";
      title: string;
      description: string;
      ctaHref: string;
      ctaLabel: string;
    }
  | {
      state: "error";
      title: string;
      description: string;
    };

function getDashboardStatusBadgeVariant(
  tone: "success" | "warning" | "neutral",
) {
  if (tone === "success") return "success";
  if (tone === "warning") return "warning";
  return "neutral";
}

function DashboardProtectedRouteEmptyState({
  state,
  retryHref,
  icon,
}: {
  state: DashboardProtectedRouteState;
  retryHref: string;
  icon: ReactNode;
}) {
  return (
    <EmptyState
      icon={icon}
      title={state.title}
      description={state.description}
      action={
        state.state === "locked" ? (
          <Button asChild size="sm">
            <Link href={state.ctaHref}>{state.ctaLabel}</Link>
          </Button>
        ) : (
          <Button asChild size="sm" variant="quiet">
            <Link href={retryHref}>Retry</Link>
          </Button>
        )
      }
      className="border-border-subtle py-16"
    />
  );
}

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

function DashboardCreatorEarningsPanels({
  data,
  focus = "sales",
}: {
  data: Extract<DashboardCreatorEarningsData, { state: "ready" }>;
  focus?: "sales" | "payouts";
}) {
  const sections =
    focus === "payouts"
      ? [
          {
            id: "creator-earnings-payouts",
            title: "Payout history",
            description: "Latest payout transfers and their current settlement state.",
            panel: (
              <DataPanelTable title="Payout history" bodyClassName="p-0">
                {data.payouts.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      icon={
                        <CircleDollarSign
                          className="size-5 text-muted-foreground"
                          aria-hidden
                        />
                      }
                      title="No payouts yet"
                      description="Payout history will appear after the first transfer is issued."
                      className="border-border-subtle py-16"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left">
                      <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-medium">
                            Amount
                          </th>
                          <th scope="col" className="w-32 px-5 py-3 font-medium">
                            Status
                          </th>
                          <th scope="col" className="w-32 px-5 py-3 font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {data.payouts.map((payout) => (
                          <tr key={payout.id}>
                            <td className="px-5 py-4 text-sm font-semibold tabular-nums text-foreground">
                              {payout.amountLabel}
                            </td>
                            <td className="px-5 py-4">
                              <Badge
                                className="w-fit"
                                variant={getDashboardStatusBadgeVariant(payout.statusTone)}
                              >
                                {payout.statusLabel}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">
                              {payout.dateLabel}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DataPanelTable>
            ),
          },
          {
            id: "creator-earnings-sales",
            title: "Sales ledger",
            description: "Order-level gross revenue and creator share for the current ledger.",
            panel: (
              <DataPanelTable title="Sales ledger" bodyClassName="p-0">
                {data.sales.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      icon={
                        <ReceiptText
                          className="size-5 text-muted-foreground"
                          aria-hidden
                        />
                      }
                      title="No sales yet"
                      description="Order-level creator sales will appear here once purchases complete."
                      className="border-border-subtle py-16"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left">
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
                        {data.sales.map((sale) => (
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
                              {sale.grossLabel}
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
            ),
          },
        ]
      : [
          {
            id: "creator-earnings-sales",
            title: "Sales ledger",
            description: "Order-level gross revenue and creator share for the current ledger.",
            panel: (
              <DataPanelTable title="Sales ledger" bodyClassName="p-0">
                {data.sales.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      icon={
                        <ReceiptText
                          className="size-5 text-muted-foreground"
                          aria-hidden
                        />
                      }
                      title="No sales yet"
                      description="Order-level creator sales will appear here once purchases complete."
                      className="border-border-subtle py-16"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[860px] text-left">
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
                        {data.sales.map((sale) => (
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
                              {sale.grossLabel}
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
            ),
          },
          {
            id: "creator-earnings-payouts",
            title: "Payout history",
            description: "Latest payout transfers and their current settlement state.",
            panel: (
              <DataPanelTable title="Payout history" bodyClassName="p-0">
                {data.payouts.length === 0 ? (
                  <div className="p-5">
                    <EmptyState
                      icon={
                        <CircleDollarSign
                          className="size-5 text-muted-foreground"
                          aria-hidden
                        />
                      }
                      title="No payouts yet"
                      description="Payout history will appear after the first transfer is issued."
                      className="border-border-subtle py-16"
                    />
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left">
                      <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                        <tr>
                          <th scope="col" className="px-5 py-3 font-medium">
                            Amount
                          </th>
                          <th scope="col" className="w-32 px-5 py-3 font-medium">
                            Status
                          </th>
                          <th scope="col" className="w-32 px-5 py-3 font-medium">
                            Date
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border-subtle">
                        {data.payouts.map((payout) => (
                          <tr key={payout.id}>
                            <td className="px-5 py-4 text-sm font-semibold tabular-nums text-foreground">
                              {payout.amountLabel}
                            </td>
                            <td className="px-5 py-4">
                              <Badge
                                className="w-fit"
                                variant={getDashboardStatusBadgeVariant(payout.statusTone)}
                              >
                                {payout.statusLabel}
                              </Badge>
                            </td>
                            <td className="px-5 py-4 text-sm text-muted-foreground">
                              {payout.dateLabel}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </DataPanelTable>
            ),
          },
        ];

  return (
    <div className="space-y-6">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="space-y-4">
          <div className="space-y-2">
            <h2 className="font-ui text-2xl font-semibold text-foreground">
              {section.title}
            </h2>
            <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
              {section.description}
            </p>
          </div>
          {section.panel}
        </section>
      ))}
    </div>
  );
}

function DashboardCreatorEarningsRouteIntro({
  focus = "sales",
}: {
  focus?: "sales" | "payouts";
}) {
  return (
    <DashboardRouteIntro
      eyebrow={focus === "payouts" ? "Creator payouts" : "Creator earnings"}
      title={focus === "payouts" ? "Payouts" : "Earnings"}
      description="Sales performance, creator share, and payout state live in one protected revenue surface."
      tone="featured"
    />
  );
}

function DashboardCreatorEarningsCards({
  cards,
}: {
  cards: ReadonlyArray<{ label: string; value: string; detail: string }>;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.label} size="sm">
          <CardContent className="py-4">
            <p className="text-xs font-medium uppercase text-muted-foreground">
              {card.label}
            </p>
            <p className="mt-2 font-ui text-2xl font-semibold text-foreground">
              {card.value}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{card.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DashboardCreatorEarningsUnavailableState({
  data,
  focus = "sales",
}: {
  data: Extract<DashboardCreatorEarningsData, { state: "locked" | "error" }>;
  focus?: "sales" | "payouts";
}) {
  return (
    <DashboardProtectedRouteEmptyState
      state={data}
      retryHref={
        focus === "payouts"
          ? routes.dashboardCreatorPayouts
          : routes.dashboardCreatorSales
      }
      icon={<CircleDollarSign className="size-5 text-muted-foreground" aria-hidden />}
    />
  );
}

function DashboardCreatorEarningsCombinedContent({
  data,
  focus = "sales",
}: {
  data: DashboardCreatorEarningsData;
  focus?: "sales" | "payouts";
}) {
  const routeReady =
    focus === "payouts" ? "dashboard-creator-payouts" : "dashboard-creator-sales";

  return (
    <div data-route-shell-ready={routeReady} className="space-y-4">
      <DashboardCreatorEarningsRouteIntro focus={focus} />

      {data.state !== "ready" ? (
        <DashboardCreatorEarningsUnavailableState data={data} focus={focus} />
      ) : (
        <section className="space-y-4">
          <DashboardCreatorEarningsCards cards={data.cards} />
          <DashboardCreatorEarningsPanels data={data} focus={focus} />
        </section>
      )}
    </div>
  );
}

export function DashboardCreatorSalesContent({
  data,
}: {
  data: DashboardCreatorEarningsData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-creator-sales">
      <DashboardCreatorEarningsCombinedContent data={data} focus="sales" />
    </DashboardPageShell>
  );
}

export function DashboardCreatorPayoutsContent({
  data,
}: {
  data: DashboardCreatorEarningsData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-creator-payouts">
      <DashboardCreatorEarningsCombinedContent data={data} focus="payouts" />
    </DashboardPageShell>
  );
}

function DashboardCreatorEarningsSummaryLoadingContent({
  focus = "sales",
}: {
  focus?: "sales" | "payouts";
}) {
  const loadingScope =
    focus === "payouts" ? "dashboard-creator-payouts" : "dashboard-creator-sales";

  return (
    <section className="space-y-4" data-loading-scope={loadingScope}>
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} size="sm">
            <CardContent className="py-4">
              <LoadingSkeleton className="h-3 w-20" />
              <LoadingSkeleton className="mt-3 h-8 w-20" />
              <LoadingSkeleton className="mt-2 h-3 w-28" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

function DashboardCreatorEarningsPanelsLoadingContent({
  focus = "sales",
}: {
  focus?: "sales" | "payouts";
}) {
  const loadingScope =
    focus === "payouts" ? "dashboard-creator-payouts" : "dashboard-creator-sales";
  const sections =
    focus === "payouts"
      ? [
          {
            id: "creator-earnings-payouts",
            titleWidth: "w-40",
            descriptionWidth: "w-80 max-w-full",
            minWidthClass: "min-w-[520px]",
            columnsClass: "grid-cols-[minmax(0,1fr)_128px_128px]",
            headerWidths: ["w-16", "w-16", "w-16"],
            rowSkeletons: ["h-4 w-24", "h-5 w-20 rounded-full", "h-4 w-20"],
            rowCount: 4,
          },
          {
            id: "creator-earnings-sales",
            titleWidth: "w-36",
            descriptionWidth: "w-96 max-w-full",
            minWidthClass: "min-w-[860px]",
            columnsClass:
              "grid-cols-[minmax(0,1fr)_160px_112px_112px_112px_128px]",
            headerWidths: ["w-16", "w-16", "w-16", "w-16", "w-16", "w-16"],
            rowSkeletons: [
              "h-4 w-3/4",
              "h-4 w-24",
              "h-4 w-16",
              "h-4 w-16",
              "h-5 w-20 rounded-full",
              "h-4 w-20",
            ],
            rowCount: 5,
          },
        ]
      : [
          {
            id: "creator-earnings-sales",
            titleWidth: "w-36",
            descriptionWidth: "w-96 max-w-full",
            minWidthClass: "min-w-[860px]",
            columnsClass:
              "grid-cols-[minmax(0,1fr)_160px_112px_112px_112px_128px]",
            headerWidths: ["w-16", "w-16", "w-16", "w-16", "w-16", "w-16"],
            rowSkeletons: [
              "h-4 w-3/4",
              "h-4 w-24",
              "h-4 w-16",
              "h-4 w-16",
              "h-5 w-20 rounded-full",
              "h-4 w-20",
            ],
            rowCount: 5,
          },
          {
            id: "creator-earnings-payouts",
            titleWidth: "w-40",
            descriptionWidth: "w-80 max-w-full",
            minWidthClass: "min-w-[520px]",
            columnsClass: "grid-cols-[minmax(0,1fr)_128px_128px]",
            headerWidths: ["w-16", "w-16", "w-16"],
            rowSkeletons: ["h-4 w-24", "h-5 w-20 rounded-full", "h-4 w-20"],
            rowCount: 4,
          },
        ];

  return (
    <section className="space-y-4" data-loading-scope={loadingScope}>
      <div className="space-y-6">
        {sections.map((section) => (
          <section key={section.id} className="space-y-4">
            <div className="space-y-2">
              <LoadingSkeleton className={`h-8 ${section.titleWidth}`} />
              <LoadingSkeleton className={`h-4 ${section.descriptionWidth}`} />
            </div>

            <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
              <div className="border-b border-border-subtle px-5 py-5">
                <LoadingSkeleton className="h-5 w-32" />
              </div>
              <div className="overflow-x-auto">
                <div
                  className={`grid ${section.minWidthClass} ${section.columnsClass} gap-4 border-b border-border-subtle bg-muted/40 px-5 py-3`}
                >
                  {section.headerWidths.map((width, index) => (
                    <LoadingSkeleton key={index} className={`h-3 ${width}`} />
                  ))}
                </div>
                {Array.from({ length: section.rowCount }).map((_, rowIndex) => (
                  <div
                    key={rowIndex}
                    className={`grid ${section.minWidthClass} ${section.columnsClass} gap-4 border-b border-border-subtle px-5 py-4`}
                  >
                    {section.rowSkeletons.map((rowClass, cellIndex) => (
                      <LoadingSkeleton key={cellIndex} className={rowClass} />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

export function DashboardCreatorEarningsLoadingContent({
  focus = "sales",
}: {
  focus?: "sales" | "payouts";
}) {
  const routeReady =
    focus === "payouts" ? "dashboard-creator-payouts" : "dashboard-creator-sales";

  return (
    <DashboardPageShell routeReady={routeReady}>
      <DashboardCreatorEarningsRouteIntro focus={focus} />
      <section className="space-y-4">
        <DashboardCreatorEarningsSummaryLoadingContent focus={focus} />
        <DashboardCreatorEarningsPanelsLoadingContent focus={focus} />
      </section>
    </DashboardPageShell>
  );
}

function DashboardCreatorProfileRouteContent({
  data,
}: {
  data: Extract<DashboardCreatorProfileData, { state: "ready" }>;
}) {
  return (
    <section className="space-y-4">
      <CreatorProfileForm profile={data.profile} />
    </section>
  );
}

export function DashboardCreatorProfileContent({
  data,
}: {
  data: DashboardCreatorProfileData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-creator-profile">
      <DashboardRouteIntro
        eyebrow="Creator profile"
        title="Profile"
        description="Edit the public identity learners see across your storefront and creator listings."
        tone="featured"
      />

      {data.state === "locked" || data.state === "error" ? (
        <DashboardProtectedRouteEmptyState
          state={data}
          retryHref={routes.dashboardCreatorProfile}
          icon={<Settings className="size-5 text-muted-foreground" aria-hidden />}
        />
      ) : (
        <DashboardCreatorProfileRouteContent data={data} />
      )}
    </DashboardPageShell>
  );
}

export function DashboardCreatorProfileLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-creator-profile">
      <DashboardRouteIntro
        eyebrow="Creator profile"
        title="Profile"
        description="Edit the public identity learners see across your storefront and creator listings."
        tone="featured"
      />

      <div className="space-y-4" data-loading-scope="dashboard-creator-profile">
        <div className="rounded-2xl border border-border-subtle bg-secondary px-5 py-4 shadow-card">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="min-w-0 flex-1 space-y-3">
              <div className="space-y-2">
                <LoadingSkeleton className="h-5 w-32" />
                <LoadingSkeleton className="h-4 w-72" />
              </div>
              <div className="space-y-2">
                <LoadingSkeleton className="h-2 w-full rounded-full" />
                <LoadingSkeleton className="h-4 w-28" />
              </div>
            </div>
            <LoadingSkeleton className="h-8 w-20 rounded-full" />
          </div>
        </div>

        <div className="min-w-0 rounded-2xl border border-border-subtle bg-card p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <LoadingSkeleton className="h-5 w-32" />
              <div className="space-y-5">
                <div className="space-y-3">
                  <LoadingSkeleton className="h-4 w-64" />
                  <LoadingSkeleton className="h-14 rounded-xl" />
                  <LoadingSkeleton className="h-14 rounded-xl" />
                  <LoadingSkeleton className="h-16 max-w-md rounded-xl" />
                  <LoadingSkeleton className="h-36 rounded-xl" />
                  <div className="grid gap-3 md:grid-cols-[minmax(0,180px)_minmax(0,280px)]">
                    <div className="space-y-2">
                      <LoadingSkeleton className="h-4 w-20" />
                      <LoadingSkeleton className="h-4 w-40" />
                    </div>
                    <LoadingSkeleton className="h-14 rounded-xl" />
                  </div>
                </div>

                <div className="space-y-3 border-t border-border-subtle pt-6">
                  <LoadingSkeleton className="h-4 w-24" />
                  <LoadingSkeleton className="h-4 w-80" />
                  <div className="rounded-xl border border-border-subtle bg-muted p-4">
                    <div className="divide-y divide-border-subtle lg:grid lg:grid-cols-2 lg:divide-x lg:divide-y-0">
                      {Array.from({ length: 2 }).map((_, index) => (
                        <div
                          key={index}
                          className={
                            index === 0
                              ? "space-y-4 pb-5 lg:pb-0 lg:pr-6"
                              : "space-y-4 pt-5 lg:pt-0 lg:pl-6"
                          }
                        >
                          <LoadingSkeleton className="h-4 w-28" />
                          <LoadingSkeleton className="h-14 rounded-xl" />
                          <div className="flex gap-2">
                            <LoadingSkeleton className="h-9 w-28 rounded-xl" />
                            <LoadingSkeleton className="h-9 w-20 rounded-xl" />
                          </div>
                          <LoadingSkeleton className="h-3 w-36" />
                        </div>
                      ))}
                    </div>
                    <div className="mt-6 space-y-4 border-t border-border-subtle pt-6">
                      <div className="rounded-xl border border-border-subtle bg-card p-4">
                        <div className="grid gap-4 sm:grid-cols-[80px_minmax(0,1fr)]">
                          <LoadingSkeleton className="h-20 w-20 rounded-xl" />
                          <div className="space-y-3">
                            <LoadingSkeleton className="h-5 w-36" />
                            <LoadingSkeleton className="h-4 w-full max-w-[220px]" />
                            <LoadingSkeleton className="h-5 w-24" />
                          </div>
                        </div>
                      </div>
                      <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
                        <LoadingSkeleton className="h-48 rounded-none" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <LoadingSkeleton className="h-5 w-28" />
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 5 }).map((_, index, items) => (
                  <LoadingSkeleton
                    key={index}
                    className={`h-16 rounded-xl ${index === items.length - 1 ? "md:col-span-2" : ""}`}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-3 border-t border-border-subtle pt-6">
              <LoadingSkeleton className="h-4 w-48" />
              <LoadingSkeleton className="h-9 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    </DashboardPageShell>
  );
}
