import type { ComponentType } from "react";
import Link from "next/link";

import {
  ArrowDownToLine,
  BookOpen,
  ChevronRight,
  ReceiptText,
  ShieldCheck,
  Star,
} from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type {
  DashboardHomeActivityItem,
  DashboardHomeContinueLearningItem,
  DashboardHomeData,
  DashboardHomeMembershipSnapshot,
  DashboardHomeSurfaceState,
  DashboardHomeStatItem,
  DashboardHomeStatKey,
} from "@/services/dashboard/home.service";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type HomeStat = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  accentClassName?: string;
  iconClassName?: string;
};

const HOME_STAT_ICONS: Record<
  DashboardHomeStatKey,
  ComponentType<{ className?: string }>
> = {
  library: BookOpen,
  downloads: ArrowDownToLine,
  purchases: ReceiptText,
  membership: ShieldCheck,
};

function DashboardHomeHeader({ firstName }: { firstName: string }) {
  return (
    <section className="flex flex-col gap-4 border-b border-border-subtle pb-6 md:flex-row md:items-end md:justify-between">
      <div>
        <Badge variant="neutral">Overview</Badge>
        <h1 className="mt-3 text-balance font-ui text-3xl font-semibold text-foreground">
          Welcome back, {firstName}
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          Review your library, recent activity, and membership status in one place.
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href={routes.dashboardLibrary}>Open library</Link>
        </Button>
        <Button asChild size="sm" variant="quiet">
          <Link href={routes.dashboardDownloads}>View downloads</Link>
        </Button>
      </div>
    </section>
  );
}

function DashboardHomeSummaryStats({
  stats,
}: {
  stats: DashboardHomeStatItem[];
}) {
  const resolvedStats: HomeStat[] = stats.map((stat) => ({
    label: stat.label,
    value: stat.value,
    detail: stat.detail,
    icon: HOME_STAT_ICONS[stat.key],
    accentClassName: stat.isError
      ? "border-[hsl(var(--warning-500)/0.24)]"
      : undefined,
    iconClassName: stat.isError
      ? "bg-[hsl(var(--warning-500)/0.12)] text-[hsl(var(--warning-600))]"
      : undefined,
  }));

  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {resolvedStats.map((stat) => (
        <Card
          key={stat.label}
          size="sm"
          className={cn("min-h-32", stat.accentClassName)}
        >
          <CardContent className="flex flex-1 flex-col justify-between py-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate whitespace-nowrap text-xs font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <p className="mt-2 font-ui text-3xl font-semibold tabular-nums text-foreground">
                  {stat.value}
                </p>
              </div>
              <div
                className={cn(
                  "flex size-9 items-center justify-center rounded-xl bg-muted text-muted-foreground",
                  stat.iconClassName,
                )}
              >
                <stat.icon className="size-4" aria-hidden />
              </div>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">{stat.detail}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function DashboardHomeSurfaceStateCard({
  state,
}: {
  state: Exclude<DashboardHomeSurfaceState<unknown>, { status: "ready" }>;
}) {
  return (
    <div className="py-4">
      <EmptyState
        title={state.title}
        description={state.description}
        action={
          state.status === "empty" && state.ctaHref && state.ctaLabel ? (
            <Button asChild size="sm" variant="quiet">
              <Link href={state.ctaHref}>{state.ctaLabel}</Link>
            </Button>
          ) : undefined
        }
        className="min-h-[220px] border-border-subtle py-12"
      />
    </div>
  );
}

function DashboardHomeContinueLearning({
  state,
}: {
  state: DashboardHomeSurfaceState<DashboardHomeContinueLearningItem[]>;
}) {
  return (
    <Card id="learning-library">
      <CardHeader className="border-b border-border-subtle pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Continue learning</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Your most recent resources, ready to open again.
            </p>
          </div>
          <Button asChild variant="ghost" size="sm">
            <Link href={routes.dashboardLibrary}>
              Library
              <ChevronRight className="size-4" aria-hidden />
            </Link>
          </Button>
        </div>
      </CardHeader>
      {state.status === "ready" ? (
        <CardContent className="grid gap-3 py-4 md:grid-cols-3">
          {state.data.map((resource) => (
            <Link
              key={resource.id}
              href={resource.href}
              className="rounded-xl border border-border-subtle bg-background p-3 transition hover:bg-muted/40"
            >
              <div className="relative h-28 overflow-hidden rounded-lg border border-border-subtle bg-muted/50">
                {resource.previewUrl ? (
                  <img
                    src={resource.previewUrl}
                    alt={resource.title}
                    loading="lazy"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <BookOpen className="size-5 text-muted-foreground" aria-hidden />
                  </div>
                )}
              </div>
              <div className="mt-3">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="truncate text-sm font-semibold text-foreground">
                    {resource.title}
                  </h3>
                  <Badge variant={resource.statusVariant}>
                    {resource.statusLabel}
                  </Badge>
                </div>
                <p className="mt-1 truncate text-xs text-muted-foreground">
                  {resource.meta}
                </p>
                <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                  <span className="truncate">{resource.secondaryLabel}</span>
                  <ChevronRight className="size-4 shrink-0" aria-hidden />
                </div>
              </div>
            </Link>
          ))}
        </CardContent>
      ) : (
        <CardContent>
          <DashboardHomeSurfaceStateCard state={state} />
        </CardContent>
      )}
    </Card>
  );
}

function DashboardHomeRecentActivity({
  state,
}: {
  state: DashboardHomeSurfaceState<DashboardHomeActivityItem[]>;
}) {
  return (
    <Card id="recent-activity">
      <CardHeader className="border-b border-border-subtle pb-4">
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      {state.status === "ready" ? (
        <CardContent className="divide-y divide-border-subtle">
          {state.data.map((activity) => {
            const Icon =
              activity.kind === "download" ? ArrowDownToLine : ReceiptText;

            return (
              <div key={activity.id} className="flex gap-3 py-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                  <Icon className="size-4" aria-hidden />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {activity.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-muted-foreground">
                    {activity.detail}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted-foreground">
                  {activity.timeLabel}
                </p>
              </div>
            );
          })}
        </CardContent>
      ) : (
        <CardContent>
          <DashboardHomeSurfaceStateCard state={state} />
        </CardContent>
      )}
    </Card>
  );
}

function DashboardHomeMembershipCard({
  state,
}: {
  state: DashboardHomeSurfaceState<DashboardHomeMembershipSnapshot>;
}) {
  return (
    <Card id="membership-snapshot">
      <CardHeader className="border-b border-border-subtle pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Membership</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Current plan, renewal status, and billing handoff.
            </p>
          </div>
          {state.status === "ready" ? (
            <Badge variant={state.data.badgeVariant}>{state.data.badgeLabel}</Badge>
          ) : null}
        </div>
      </CardHeader>
      {state.status === "ready" ? (
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Star className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                {state.data.title}
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {state.data.detail}
              </p>
              <p className="mt-3 text-xs text-muted-foreground">
                {state.data.support}
              </p>
              <Button asChild className="mt-4" size="sm" variant="quiet">
                <Link href={state.data.ctaHref}>{state.data.ctaLabel}</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      ) : (
        <CardContent>
          <DashboardHomeSurfaceStateCard state={state} />
        </CardContent>
      )}
    </Card>
  );
}

export function DashboardHomeContent({ data }: { data: DashboardHomeData }) {
  return (
    <DashboardPageShell routeReady="dashboard-overview">
      <section id="user-dashboard" className="space-y-6">
        <DashboardHomeHeader firstName={data.firstName} />
        <div id="purchase-summary">
          <DashboardHomeSummaryStats stats={data.stats} />
        </div>
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <DashboardHomeContinueLearning state={data.continueLearning} />
          <div className="space-y-4">
            <DashboardHomeMembershipCard state={data.membership} />
            <DashboardHomeRecentActivity state={data.recentActivity} />
          </div>
        </div>
      </section>
    </DashboardPageShell>
  );
}

export function DashboardHomeLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-overview">
      <section
        id="user-dashboard"
        className="space-y-6"
        data-loading-scope="dashboard-home"
      >
        <section className="flex flex-col gap-4 border-b border-border-subtle pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <Badge variant="neutral">Overview</Badge>
            <h1 className="mt-3 text-balance font-ui text-3xl font-semibold text-foreground">
              Welcome back
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Review your library, recent activity, and membership status in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={routes.dashboardLibrary}>Open library</Link>
            </Button>
            <Button asChild size="sm" variant="quiet">
              <Link href={routes.dashboardDownloads}>View downloads</Link>
            </Button>
          </div>
        </section>

        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-3">
                    <LoadingSkeleton className="h-3 w-24" />
                    <LoadingSkeleton className="h-8 w-20" />
                  </div>
                  <LoadingSkeleton className="size-9 rounded-xl" />
                </div>
                <LoadingSkeleton className="mt-5 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_360px]">
          <Card>
            <CardHeader className="border-b border-border-subtle pb-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle>Continue learning</CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Your most recent resources, ready to open again.
                  </p>
                </div>
                <Button asChild variant="ghost" size="sm">
                  <Link href={routes.dashboardLibrary}>
                    Library
                    <ChevronRight className="size-4" aria-hidden />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 py-4 md:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="rounded-xl border border-border-subtle bg-background p-3"
                >
                  <LoadingSkeleton className="h-28 rounded-lg" />
                  <LoadingSkeleton className="mt-3 h-4 w-full" />
                  <LoadingSkeleton className="mt-2 h-3 w-2/3" />
                  <LoadingSkeleton className="mt-3 h-3 w-1/2" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="border-b border-border-subtle pb-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <CardTitle>Membership</CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Current plan, renewal status, and billing handoff.
                    </p>
                  </div>
                  <LoadingSkeleton className="h-6 w-20 rounded-full" />
                </div>
              </CardHeader>
              <CardContent className="py-4">
                <div className="flex items-start gap-3">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <Star className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <LoadingSkeleton className="h-4 w-32" />
                    <LoadingSkeleton className="mt-2 h-4 w-full max-w-[220px]" />
                    <LoadingSkeleton className="mt-2 h-4 w-5/6" />
                    <LoadingSkeleton className="mt-4 h-9 w-32 rounded-xl" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border-subtle pb-4">
                <CardTitle>Recent activity</CardTitle>
              </CardHeader>
              <CardContent className="divide-y divide-border-subtle">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex gap-3 py-4">
                    <LoadingSkeleton className="size-9 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <LoadingSkeleton className="h-4 w-3/4" />
                      <LoadingSkeleton className="h-3 w-1/2" />
                    </div>
                    <LoadingSkeleton className="h-3 w-12" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </DashboardPageShell>
  );
}
