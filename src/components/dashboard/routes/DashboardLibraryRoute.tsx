import Link from "next/link";

import { BookOpen, Clock3, FileText } from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  chipVariants,
  emptyStatePillLinkVariants,
  EmptyState,
  LoadingSkeleton,
  SearchInput,
} from "@/design-system";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardLibraryResourceCard } from "@/components/dashboard/routes/DashboardLibraryResourceCard";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type {
  DashboardLibraryData,
  DashboardLibraryFilterKey,
} from "@/services/dashboard/library.service";
import { getDashboardLibraryHref } from "@/services/dashboard/library.service";
import { routes } from "@/lib/routes";

const DASHBOARD_LIBRARY_FILTERS: Array<{
  key: DashboardLibraryFilterKey;
  label: string;
}> = [
  { key: "all", label: "All" },
  { key: "pdf", label: "PDF" },
  { key: "worksheets", label: "Worksheets" },
  { key: "templates", label: "Templates" },
];

function DashboardLibraryRecovery({
  data,
}: {
  data: DashboardLibraryData;
}) {
  if (data.recovery.status === "hidden") {
    return null;
  }

  if (data.recovery.status === "pending") {
    return (
      <Card className="border-[hsl(var(--warning-500)/0.28)] bg-[hsl(var(--warning-500)/0.08)]">
        <CardContent className="flex items-start gap-3 py-4">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[hsl(var(--warning-500)/0.16)] text-[hsl(var(--warning-600))]">
            <Clock3 className="size-4" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-foreground">
              Confirming your purchase
            </p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Your payment was received. Refresh in a few seconds if the resource
              has not appeared yet.
            </p>
          </div>
          <Button asChild size="sm" variant="quiet">
            <Link href={getDashboardLibraryHref({ payment: "success" })}>
              Refresh
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-[hsl(var(--success-500)/0.28)] bg-[hsl(var(--success-500)/0.08)]">
      <CardContent className="flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="success">Purchase confirmed</Badge>
            <p className="text-xs text-muted-foreground">Ready to open now</p>
          </div>
          <p className="mt-3 truncate text-base font-semibold text-foreground">
            {data.recovery.item.title}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.recovery.item.authorName
              ? `by ${data.recovery.item.authorName}`
              : "Saved to your library"}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild size="sm">
            <a href={`/api/download/${data.recovery.item.id}`}>Download now</a>
          </Button>
          <Button asChild size="sm" variant="quiet">
            <Link href={routes.resource(data.recovery.item.slug)}>View resource</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardLibraryToolbar({ data }: { data: DashboardLibraryData }) {
  const payment = data.recovery.status !== "hidden" ? "success" : undefined;
  const hasActiveControls = Boolean(data.query) || data.filter !== "all";

  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <form action={routes.dashboardLibrary} className="min-w-0 flex-1">
            {payment ? <input type="hidden" name="payment" value={payment} /> : null}
            {data.filter !== "all" ? (
              <input type="hidden" name="filter" value={data.filter} />
            ) : null}
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-foreground">Library tools</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Search by title or creator, then narrow by format.
                </p>
              </div>
              <div className="flex w-full items-stretch gap-3">
                <SearchInput
                  type="search"
                  name="q"
                  defaultValue={data.query}
                  placeholder="Search your library"
                  containerClassName="min-w-0 flex-1"
                />
                <Button size="md" type="submit">
                  Search
                </Button>
              </div>
            </div>
          </form>
          <div className="space-y-3 xl:max-w-md xl:text-right">
            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{data.visibleCount}</span>{" "}
              {data.visibleCount === 1 ? "result" : "results"}
              {data.totalOwned > 0 ? (
                <>
                  <span aria-hidden> · </span>
                  <span>{data.totalOwned} owned</span>
                </>
              ) : null}
            </div>
            <div className="flex flex-wrap gap-2 xl:justify-end">
              {DASHBOARD_LIBRARY_FILTERS.map((entry) => {
                const href = getDashboardLibraryHref({
                  q: data.query || undefined,
                  filter: entry.key,
                  payment,
                });
                const isActive = data.filter === entry.key;

                return (
                  <Link
                    key={entry.key}
                    href={href}
                    className={chipVariants({
                      variant: "filter",
                      selected: isActive,
                    })}
                  >
                    {entry.label}
                  </Link>
                );
              })}
              {hasActiveControls ? (
                <Link
                  href={getDashboardLibraryHref({ payment })}
                  className="inline-flex min-h-10 items-center text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function DashboardLibraryResults({ data }: { data: DashboardLibraryData }) {
  const payment = data.recovery.status !== "hidden" ? "success" : undefined;

  if (data.state === "error") {
    return (
      <EmptyState
        title={data.errorTitle ?? "Could not load your library"}
        description={data.errorDescription}
        action={
          <Button asChild size="sm" variant="quiet">
            <Link
              href={getDashboardLibraryHref({
                q: data.query,
                filter: data.filter,
                payment,
              })}
            >
              Retry
            </Link>
          </Button>
        }
        className="border-border-subtle py-16"
      />
    );
  }

  if (data.state === "empty") {
    return (
      <EmptyState
        icon={<BookOpen className="size-5 text-muted-foreground" aria-hidden />}
        title="Your library is empty"
        description="Everything you purchase lands here. Start with a resource from the marketplace."
        action={
          <Button asChild size="sm">
            <Link href={routes.marketplace}>Browse resources</Link>
          </Button>
        }
        className="border-border-subtle py-16"
      />
    );
  }

  if (data.state === "filtered-empty") {
    return (
      <EmptyState
        icon={<FileText className="size-5 text-muted-foreground" aria-hidden />}
        title="No matching resources"
        description="Try another keyword or clear the current filter."
        action={
          <Link
            href={getDashboardLibraryHref({ payment })}
            className={emptyStatePillLinkVariants()}
          >
            Clear filters
          </Link>
        }
        className="border-border-subtle py-16"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.items.map((item) => (
        <DashboardLibraryResourceCard key={item.purchaseId} item={item} />
      ))}
    </div>
  );
}

function DashboardLibraryRouteIntro() {
  return (
    <DashboardRouteIntro
      eyebrow="Library"
      title="My library"
      description="Search what you own, recover recent purchases, and reopen the right resource quickly."
      action={
        <Button asChild size="md">
          <Link href={routes.marketplace}>Browse marketplace</Link>
        </Button>
      }
    />
  );
}

function DashboardLibrarySummaryCards({
  data,
}: {
  data: DashboardLibraryData;
}) {
  const continueHref = data.continueItem
    ? routes.resource(data.continueItem.slug)
    : routes.marketplace;
  const summaryLabel =
    data.state === "error"
      ? "Library summary unavailable"
      : `${data.totalOwned} owned resource${data.totalOwned === 1 ? "" : "s"}`;
  const summaryDetail =
    data.state === "error"
      ? data.errorDescription ?? "Open your purchases or refresh the route to try again."
      : data.lastAddedLabel
        ? `Last added ${data.lastAddedLabel}`
        : "Your owned resources will appear here as soon as a purchase completes.";

  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Card>
        <CardContent className="py-4">
          <p className="text-sm font-semibold text-foreground">{summaryLabel}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            <span>{summaryDetail}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <p className="text-sm font-semibold text-muted-foreground">Continue</p>
          <p className="mt-2 truncate text-base font-semibold text-foreground">
            {data.continueItem?.title ?? "Browse your next resource"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            {data.continueItem?.authorName ??
              "Open what you already own or find something new."}
          </p>
          <Button asChild className="mt-4" size="sm" variant="quiet">
            <Link href={continueHref}>
              {data.continueItem ? "Open resource" : "Browse resources"}
            </Link>
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}

function DashboardLibrarySummaryLoadingContent() {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Card>
        <CardContent className="py-4">
          <LoadingSkeleton className="h-5 w-36" />
          <div className="mt-3 flex flex-wrap gap-3">
            <LoadingSkeleton className="h-4 w-28" />
            <LoadingSkeleton className="h-4 w-32" />
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <LoadingSkeleton className="h-4 w-16" />
          <LoadingSkeleton className="mt-3 h-5 w-40" />
          <LoadingSkeleton className="mt-2 h-4 w-32" />
          <LoadingSkeleton className="mt-4 h-9 w-32 rounded-xl" />
        </CardContent>
      </Card>
    </section>
  );
}

function DashboardLibraryBodyLoadingContent() {
  return (
    <div className="space-y-6" data-loading-scope="dashboard-library">
      <div className="rounded-xl border border-border-subtle bg-card p-4">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="min-w-0 flex-1 space-y-3">
            <div className="space-y-2">
              <LoadingSkeleton className="h-5 w-28" />
              <LoadingSkeleton className="h-4 w-56 max-w-full" />
            </div>
            <div className="flex gap-3">
              <LoadingSkeleton className="h-10 flex-1 rounded-xl" />
              <LoadingSkeleton className="h-10 w-24 rounded-xl" />
            </div>
          </div>
          <div className="space-y-3 xl:w-72">
            <LoadingSkeleton className="h-4 w-24 xl:ml-auto" />
              <div className="flex flex-wrap gap-2 xl:justify-end">
                {Array.from({ length: 4 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-10 w-20 rounded-full" />
                ))}
              </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-xl border border-border-subtle bg-card"
          >
            <LoadingSkeleton className="aspect-[4/3] w-full rounded-none" />
            <div className="space-y-3 p-4">
              <LoadingSkeleton className="h-5 w-5/6" />
              <LoadingSkeleton className="h-4 w-1/2" />
              <LoadingSkeleton className="h-4 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardLibraryLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-library">
      <DashboardLibraryRouteIntro />
      <DashboardLibrarySummaryLoadingContent />
      <DashboardLibraryBodyLoadingContent />
    </DashboardPageShell>
  );
}

export function DashboardLibraryContent({
  data,
}: {
  data: DashboardLibraryData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-library">
      <DashboardLibraryRouteIntro />
      <div data-route-shell-ready="dashboard-library" className="space-y-6">
        <DashboardLibrarySummaryCards data={data} />
        <div className="space-y-6">
          <DashboardLibraryRecovery data={data} />
          <DashboardLibraryToolbar data={data} />
          <DashboardLibraryResults data={data} />
        </div>
      </div>
    </DashboardPageShell>
  );
}
