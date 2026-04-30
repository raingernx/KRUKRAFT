import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { FileText, ReceiptText } from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  DataPanelTable,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import { ResourceIntentLink } from "@/components/navigation/ResourceIntentLink";
import type { DashboardPurchasesData } from "@/services/dashboard/purchases.service";
import { getDashboardPurchaseReference } from "@/services/dashboard/purchases.service";
import { formatDate, formatPrice } from "@/lib/format";
import { shouldBypassImageOptimizer } from "@/lib/imageDelivery";
import { routes } from "@/lib/routes";

const DASHBOARD_PURCHASE_STATUS_BADGES: Record<
  string,
  { label: string; variant: "success" | "warning" | "neutral" }
> = {
  COMPLETED: { label: "Completed", variant: "success" },
  PENDING: { label: "Pending", variant: "warning" },
  FAILED: { label: "Failed", variant: "neutral" },
  REFUNDED: { label: "Refunded", variant: "neutral" },
};

export function DashboardPurchasesRouteFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-purchases">
      <DashboardRouteIntro
        eyebrow="Purchases"
        title="Order history"
        description="Review completed, pending, and failed purchases in one ledger."
        action={
          <Button asChild size="md" variant="quiet">
            <Link href={routes.marketplace}>Browse marketplace</Link>
          </Button>
        }
      />
      {children}
    </DashboardPageShell>
  );
}

export function DashboardPurchasesSectionsSkeleton() {
  return (
    <div className="space-y-4" data-loading-scope="dashboard-purchases">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="py-4">
              <LoadingSkeleton className="h-5 w-24" />
              <div className="mt-3 flex flex-wrap gap-3">
                <LoadingSkeleton className="h-4 w-24" />
                <LoadingSkeleton className="h-4 w-28" />
              </div>
              {index === 1 ? (
                <>
                  <LoadingSkeleton className="mt-3 h-5 w-48" />
                  <LoadingSkeleton className="mt-2 h-4 w-full max-w-[220px]" />
                </>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
        <div className="grid grid-cols-[minmax(0,1.9fr)_110px] gap-4 border-b border-border-subtle bg-muted/40 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_110px_110px_120px]">
          <LoadingSkeleton className="h-3 w-16" />
          <LoadingSkeleton className="h-3 w-16 justify-self-end md:hidden" />
          <LoadingSkeleton className="hidden h-3 w-16 md:block" />
          <LoadingSkeleton className="hidden h-3 w-14 md:block" />
          <LoadingSkeleton className="hidden h-3 w-16 md:block" />
          <LoadingSkeleton className="h-3 w-16 justify-self-end" />
        </div>
        <div className="divide-y divide-border-subtle">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="grid grid-cols-[minmax(0,1.9fr)_110px] gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_110px_110px_120px] md:items-center"
            >
              <div className="flex min-w-0 items-center gap-3">
                <LoadingSkeleton className="size-10 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-5/6" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
              </div>
              <LoadingSkeleton className="hidden h-4 w-20 md:block" />
              <LoadingSkeleton className="hidden h-4 w-20 md:block" />
              <LoadingSkeleton className="hidden h-4 w-16 md:block" />
              <LoadingSkeleton className="h-6 w-20 justify-self-end rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function DashboardPurchasesRouteBody({
  data,
}: {
  data: DashboardPurchasesData;
}) {
  const ledgerDescription =
    data.orderCount > data.visibleCount
      ? `Showing the latest ${data.visibleCount} orders. Older receipts stay available in your account history.`
      : "Completed, pending, and failed purchases in one protected ledger.";

  return (
    <>
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm font-semibold text-foreground">
              {data.orderCount} order{data.orderCount === 1 ? "" : "s"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
              {data.orderCount > data.visibleCount ? (
                <span>Showing latest {data.visibleCount}</span>
              ) : null}
              <span>{data.completedCount} completed</span>
              <span>Total spent {data.totalSpentLabel}</span>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm font-semibold text-muted-foreground">Status matrix</p>
            <p className="mt-2 text-base font-semibold text-foreground">
              Completed, pending, failed, refunded
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              This route keeps the commerce ledger separate from download history.
            </p>
          </CardContent>
        </Card>
      </section>

      {data.state === "error" ? (
        <EmptyState
          title={data.errorTitle ?? "Could not load purchases"}
          description={data.errorDescription}
          action={
            <Button asChild size="sm" variant="quiet">
              <Link href={routes.dashboardPurchases}>Retry</Link>
            </Button>
          }
          className="border-border-subtle py-16"
        />
      ) : data.state === "empty" ? (
        <EmptyState
          icon={<ReceiptText className="size-5 text-muted-foreground" aria-hidden />}
          title="No purchases yet"
          description="Your completed and in-flight orders will appear here once you buy a resource."
          action={
            <Button asChild size="sm">
              <IntentPrefetchLink
                href={routes.marketplace}
                prefetchLimit={6}
                prefetchScope="dashboard-purchases-empty"
                resourcesNavigationMode="discover"
              >
                Browse resources
              </IntentPrefetchLink>
            </Button>
          }
          className="border-border-subtle py-16"
        />
      ) : (
        <DataPanelTable
          title="Purchase ledger"
          description={ledgerDescription}
          bodyClassName="p-0"
        >
          <>
            <div className="grid grid-cols-[minmax(0,1.9fr)_110px] gap-4 border-b border-border-subtle bg-muted/40 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_110px_110px_120px]">
              <span>Resource</span>
              <span className="hidden md:block">Creator</span>
              <span className="hidden md:block">Date</span>
              <span className="hidden md:block">Amount</span>
              <span className="text-right">Status</span>
            </div>
            <div className="divide-y divide-border-subtle">
              {data.purchases.map((purchase) => {
                const status =
                  DASHBOARD_PURCHASE_STATUS_BADGES[purchase.status] ??
                  DASHBOARD_PURCHASE_STATUS_BADGES.PENDING;

                return (
                  <div
                    key={purchase.id}
                    className="grid grid-cols-[minmax(0,1.9fr)_110px] gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_110px_110px_120px] md:items-center"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-muted">
                        {purchase.resource.previewUrl ? (
                          <Image
                            src={purchase.resource.previewUrl}
                            alt={purchase.resource.title}
                            fill
                            sizes="40px"
                            unoptimized={shouldBypassImageOptimizer(
                              purchase.resource.previewUrl,
                            )}
                            className="object-cover"
                          />
                        ) : (
                          <FileText
                            className="size-4 text-muted-foreground/60"
                            aria-hidden
                          />
                        )}
                      </div>
                      <div className="min-w-0">
                        <ResourceIntentLink
                          href={routes.resource(purchase.resource.slug)}
                          className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                        >
                          {purchase.resource.title}
                        </ResourceIntentLink>
                        <p className="mt-1 truncate text-xs text-muted-foreground">
                          {getDashboardPurchaseReference(purchase.id)}
                        </p>
                      </div>
                    </div>
                    <span className="hidden truncate text-sm text-muted-foreground md:block">
                      {purchase.resource.authorName ?? "—"}
                    </span>
                    <span className="hidden text-sm text-muted-foreground md:block">
                      {formatDate(purchase.createdAt)}
                    </span>
                    <span className="hidden text-sm text-muted-foreground md:block">
                      {purchase.resource.isFree
                        ? "Free"
                        : formatPrice(purchase.amount / 100)}
                    </span>
                    <div className="flex justify-end">
                      <Badge variant={status.variant}>{status.label}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        </DataPanelTable>
      )}
    </>
  );
}

export function DashboardPurchasesContent({
  data,
}: {
  data: DashboardPurchasesData;
}) {
  return (
    <DashboardPurchasesRouteFrame>
      <DashboardPurchasesRouteBody data={data} />
    </DashboardPurchasesRouteFrame>
  );
}
