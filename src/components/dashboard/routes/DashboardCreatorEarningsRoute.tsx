import Link from "next/link";

import {
  CircleDollarSign,
  ReceiptText,
} from "@/lib/icons";
import {
  Badge,
  Card,
  CardContent,
  DataPanelTable,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import {
  DashboardProtectedRouteEmptyState,
  getDashboardStatusBadgeVariant,
} from "@/components/dashboard/routes/DashboardCreatorProtectedShared";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type { DashboardCreatorEarningsData } from "@/services/dashboard/creator-earnings.service";
import { routes } from "@/lib/routes";

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
