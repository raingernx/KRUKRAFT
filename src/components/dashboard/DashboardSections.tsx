import { Suspense, type ComponentType, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowDownToLine,
  BarChart3,
  Bell,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  FileText,
  Grid2X2,
  PackagePlus,
  ReceiptText,
  Settings,
  ShieldCheck,
  Star,
  Store,
  UploadCloud,
} from "@/lib/icons";

import {
  Avatar,
  Badge,
  Button,
  Card,
  CardContent,
  DataPanelTable,
  EmptyState,
  CardHeader,
  CardTitle,
  LoadingSkeleton,
} from "@/design-system";
import { CreatorProfileForm } from "@/components/creator/CreatorProfileForm";
import { DashboardCreatorStats } from "@/components/dashboard/DashboardCreatorStats";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import {
  DashboardPageShell,
} from "@/components/layout/dashboard/DashboardPageShell";
import { IntentPrefetchLink } from "@/components/navigation/IntentPrefetchLink";
import { ResourceIntentLink } from "@/components/navigation/ResourceIntentLink";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PreferenceSettings } from "@/components/settings/PreferenceSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { DashboardMembershipActions } from "@/components/dashboard/DashboardMembershipActions";
import type { DashboardMembershipData } from "@/services/dashboard/membership.service";
import type { DashboardSettingsData } from "@/services/dashboard/settings.service";
import type { DashboardCreatorAnalyticsData } from "@/services/dashboard/creator-analytics.service";
import type {
  DashboardCreatorEarningsData,
} from "@/services/dashboard/creator-earnings.service";
import type { DashboardCreatorProfileData } from "@/services/dashboard/creator-profile.service";
import { formatDate, formatNumber, formatPrice } from "@/lib/format";
import { shouldBypassImageOptimizer } from "@/lib/imageDelivery";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type Stat = {
  label: string;
  value: string;
  detail: string;
  icon: ComponentType<{ className?: string }>;
  accentClassName?: string;
  iconClassName?: string;
};

type Resource = {
  title: string;
  meta: string;
  status: "Ready" | "Updated" | "Draft";
  pages: string;
};

type Activity = {
  title: string;
  detail: string;
  time: string;
  icon: ComponentType<{ className?: string }>;
};

const userStats: Stat[] = [
  {
    label: "Owned resources",
    value: "24",
    detail: "6 opened this week",
    icon: BookOpen,
  },
  {
    label: "Downloads",
    value: "118",
    detail: "Protected delivery healthy",
    icon: ArrowDownToLine,
  },
  {
    label: "Purchases",
    value: "$284",
    detail: "Lifetime learning spend",
    icon: ReceiptText,
  },
  {
    label: "Membership",
    value: "Free",
    detail: "Upgrade path ready",
    icon: ShieldCheck,
  },
];

const resources: Resource[] = [
  {
    title: "Middle School Science Quiz Set",
    meta: "Assessment pack · Grades 6-8",
    status: "Ready",
    pages: "42 pages",
  },
  {
    title: "Essential Vocabulary Flashcards",
    meta: "Flashcards · English",
    status: "Updated",
    pages: "500 cards",
  },
  {
    title: "Geometry Practice Workbook",
    meta: "Worksheet · Math",
    status: "Ready",
    pages: "28 pages",
  },
];

const activities: Activity[] = [
  {
    title: "Science Quiz Set downloaded",
    detail: "Protected link issued successfully",
    time: "8 min ago",
    icon: ArrowDownToLine,
  },
  {
    title: "Vocabulary Flashcards updated",
    detail: "New version available in Library",
    time: "2 hr ago",
    icon: CheckCircle2,
  },
  {
    title: "Creator resource moved to review",
    detail: "Geometry Practice Workbook",
    time: "Yesterday",
    icon: Clock3,
  },
];

export function DashboardPageIntro({
  showContractLink = false,
}: {
  showContractLink?: boolean;
}) {
  return (
    <section className="grid gap-6 border-b border-border-subtle pb-6 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-end">
      <div className="max-w-3xl">
        <Badge variant="info">Isolated route family</Badge>
        <h1 className="mt-3 text-balance font-ui text-3xl font-semibold text-foreground sm:text-4xl">
          Dashboard rebuild, designed around one shell and predictable
          loading.
        </h1>
        <p className="mt-3 max-w-2xl text-pretty text-sm leading-6 text-muted-foreground sm:text-base">
          This isolated dashboard family proves the product structure before any
          production dashboard migration. The shell is stable; pages only own
          their content.
        </p>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-card p-4">
        <div className="grid gap-3 text-sm">
          {[
            ["Shell", "Sidebar, topbar, viewport"],
            ["Pages", "Content, states, local fallbacks"],
            ["Loading", "First-entry shell, then content-only"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="flex items-center justify-between gap-4 border-b border-border-subtle pb-3 last:border-0 last:pb-0"
            >
              <span className="font-medium text-foreground">{label}</span>
              <span className="text-right text-muted-foreground">{value}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-2">
          {showContractLink ? (
            <Button asChild variant="quiet">
              <Link href="#dashboard-contract">
                <Grid2X2 className="size-4" aria-hidden />
                Review contract
              </Link>
            </Button>
          ) : null}
          <Button asChild>
            <Link href={routes.dashboardCreator}>
              <PackagePlus className="size-4" aria-hidden />
              Prototype next
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

function StatGrid({
  columns = "four",
  stats,
}: {
  columns?: "three" | "four";
  stats: Stat[];
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:grid-cols-2",
        columns === "three" ? "xl:grid-cols-3" : "xl:grid-cols-4",
      )}
    >
      {stats.map((stat) => (
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

export function DashboardUserStats() {
  return <StatGrid stats={userStats} />;
}

export function DashboardResourceRail() {
  return (
    <Card id="learning-library">
      <CardHeader className="border-b border-border-subtle pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle>Continue learning</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Owned resources with stable actions and clear status.
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
        {resources.map((resource) => (
          <article
            key={resource.title}
            className="rounded-xl border border-border-subtle bg-background p-3"
          >
            <div className="h-28 rounded-lg border border-border-subtle bg-muted/50 p-3">
              <div className="flex h-full flex-col justify-between rounded-md border border-border-subtle bg-card p-3">
                <div className="space-y-2">
                  <div className="h-2 w-16 rounded-full bg-primary opacity-70" />
                  <div className="h-2 w-4/5 rounded-full bg-muted" />
                  <div className="h-2 w-3/5 rounded-full bg-muted" />
                </div>
                <div className="flex items-end justify-between gap-3">
                  <BookOpen
                    className="size-5 text-muted-foreground"
                    aria-hidden
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {resource.pages}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground">
                  {resource.title}
                </h3>
                <Badge
                  variant={resource.status === "Updated" ? "success" : "neutral"}
                >
                  {resource.status}
                </Badge>
              </div>
              <p className="mt-1 truncate text-xs text-muted-foreground">
                {resource.meta}
              </p>
            </div>
          </article>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardActivityPanel() {
  return (
    <Card>
      <CardHeader className="border-b border-border-subtle pb-4">
        <CardTitle>Recent activity</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border-subtle">
        {activities.map((activity) => (
          <div key={activity.title} className="flex gap-3 py-4">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <activity.icon className="size-4" aria-hidden />
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
              {activity.time}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function DashboardDownloadsPreview() {
  return (
    <DataPanelTable
      title="Downloads"
      description="Table-first layout for protected file delivery."
      actions={<Badge variant="success">No delivery errors</Badge>}
      bodyClassName="p-0"
      id="downloads"
    >
      <>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-left text-sm">
            <thead className="border-b border-border-subtle bg-muted/50 text-xs text-muted-foreground">
              <tr>
                <th className="px-5 py-3 font-medium">Resource</th>
                <th className="px-5 py-3 font-medium">File</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Date</th>
                <th className="px-5 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-subtle">
              {resources.map((resource, index) => (
                <tr key={resource.title}>
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">
                      {resource.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resource.meta}
                    </p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">PDF pack</td>
                  <td className="px-5 py-4">
                    <Badge variant="success">Ready</Badge>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">
                    Apr {8 - index}, 2026
                  </td>
                  <td className="px-5 py-4 text-right">
                    <Button
                      aria-label={`${resource.title} download is unavailable in the prototype`}
                      disabled
                      size="sm"
                      variant="quiet"
                    >
                      Prototype
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </>
    </DataPanelTable>
  );
}

export function DashboardAccountPreview() {
  return (
    <section className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
      <Card id="membership-preview">
        <CardHeader className="border-b border-border-subtle pb-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <CardTitle>Membership</CardTitle>
              <p className="mt-1 text-sm text-muted-foreground">
                Plan state stays compact and action-oriented.
              </p>
            </div>
            <Badge variant="neutral">Free</Badge>
          </div>
        </CardHeader>
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
              <Star className="size-4" aria-hidden />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-foreground">
                Unlock unlimited resources
              </p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                Keep plan decisions separate from route shell loading and
                billing handoff.
              </p>
              <Button
                aria-label="Plan comparison is unavailable in the prototype"
                className="mt-4"
                disabled
                size="sm"
                variant="quiet"
              >
                Prototype only
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card id="settings-preview">
        <CardHeader className="border-b border-border-subtle pb-4">
          <CardTitle>Settings</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Flat sections with dividers instead of nested cards.
          </p>
        </CardHeader>
        <CardContent className="divide-y divide-border-subtle">
          {[
            ["Profile", "Name, email, and public identity"],
            ["Appearance", "Theme mode for your device"],
            ["Security", "Account controls and session state"],
          ].map(([label, detail]) => (
            <div key={label} className="flex items-center gap-3 py-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <Settings className="size-4" aria-hidden />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground">
                  {label}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {detail}
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </section>
  );
}

export function DashboardContentOnlySkeletonPreview() {
  return (
    <Card id="dashboard-contract">
      <CardHeader className="border-b border-border-subtle pb-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <Badge variant="warning">Contract demo only</Badge>
            <CardTitle>Content-only loading contract</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              This is allowed inside the shell. Sidebar and topbar do not repeat.
            </p>
          </div>
          <Badge variant="neutral">Route loading</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 py-5">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-xl border border-border-subtle bg-background p-4"
            >
              <LoadingSkeleton className="size-9 rounded-xl" />
              <LoadingSkeleton className="mt-4 h-7 w-16" />
              <LoadingSkeleton className="mt-2 h-3 w-28" />
            </div>
          ))}
        </div>
        <div className="overflow-hidden rounded-xl border border-border-subtle">
          <div className="grid grid-cols-[minmax(0,1fr)_90px] gap-4 border-b border-border-subtle bg-muted/50 px-4 py-3 sm:grid-cols-[minmax(0,1fr)_120px_120px]">
            <LoadingSkeleton className="h-3 w-24" />
            <LoadingSkeleton className="h-3 w-16" />
            <LoadingSkeleton className="hidden h-3 w-16 sm:block" />
          </div>
          <div className="divide-y divide-border-subtle">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="grid grid-cols-[minmax(0,1fr)_90px] gap-4 px-4 py-4 sm:grid-cols-[minmax(0,1fr)_120px_120px]"
              >
                <div className="min-w-0 space-y-2">
                  <LoadingSkeleton className="h-4 w-3/4" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
                <LoadingSkeleton className="h-5 w-16 rounded-full" />
                <LoadingSkeleton className="hidden h-8 w-20 rounded-lg sm:block" />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function DashboardMembershipContent({
  data,
  subscriptionState,
}: {
  data: DashboardMembershipData;
  subscriptionState?: string | null;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-subscription">
      <DashboardMembershipIntroContent
        actions={
          <DashboardMembershipActions
            primaryHref={data.primaryCtaHref}
            primaryLabel={data.primaryCtaLabel}
            secondaryHref={data.secondaryCtaHref}
            secondaryLabel={data.secondaryCtaLabel}
            canCancelSubscription={data.canCancelSubscription}
            cancellationScheduled={data.cancellationScheduled}
            subscriptionState={subscriptionState}
          />
        }
      />
      <DashboardMembershipResolvedContent data={data} />
    </DashboardPageShell>
  );
}

function DashboardMembershipIntroContent({
  actions,
}: {
  actions?: ReactNode;
}) {
  return (
    <DashboardRouteIntro
      eyebrow="Membership"
      title="Membership"
      description="Review plan status, renewal timing, and billing coverage without leaving the dashboard shell."
      action={actions}
    />
  );
}

async function DashboardMembershipIntroActions({
  dataPromise,
  subscriptionState,
}: {
  dataPromise: Promise<DashboardMembershipData>;
  subscriptionState?: string | null;
}) {
  const data = await dataPromise;

  return (
    <DashboardMembershipActions
      primaryHref={data.primaryCtaHref}
      primaryLabel={data.primaryCtaLabel}
      secondaryHref={data.secondaryCtaHref}
      secondaryLabel={data.secondaryCtaLabel}
      canCancelSubscription={data.canCancelSubscription}
      cancellationScheduled={data.cancellationScheduled}
      subscriptionState={subscriptionState}
    />
  );
}

function DashboardMembershipResolvedContent({
  data,
}: {
  data: DashboardMembershipData;
}) {
  return data.state === "error" ? (
    <EmptyState
      title={data.errorTitle ?? "Could not load membership"}
      description={data.errorDescription}
      action={
        <Button asChild size="sm" variant="quiet">
          <Link href={routes.dashboardMembership}>Retry</Link>
        </Button>
      }
      className="border-border-subtle py-16"
    />
  ) : (
    <>
      <section className="grid gap-4 xl:grid-cols-3">
        {data.summaryCards.map((card) => (
          <Card key={card.label}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-muted-foreground">
                    {card.label}
                  </p>
                  <p className="mt-2 text-base font-semibold text-foreground">
                    {card.value}
                  </p>
                </div>
                {card.badgeLabel ? (
                  <Badge variant={card.badgeVariant ?? "neutral"}>
                    {card.badgeLabel}
                  </Badge>
                ) : null}
              </div>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                {card.detail}
              </p>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="py-5">
          <div className="min-w-0 max-w-2xl">
            <div className="flex items-center gap-2">
              <Badge variant={data.badgeVariant}>{data.badgeLabel}</Badge>
              <span className="text-xs text-muted-foreground">
                Route-owned membership state
              </span>
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-foreground">
              {data.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {data.detail}
            </p>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {data.support}
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

async function DashboardMembershipStreamedBody({
  dataPromise,
}: {
  dataPromise: Promise<DashboardMembershipData>;
}) {
  const data = await dataPromise;
  return <DashboardMembershipResolvedContent data={data} />;
}

function DashboardMembershipSectionsLoadingContent() {
  return (
    <div className="space-y-4" data-loading-scope="dashboard-membership">
      <section className="grid gap-4 xl:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="py-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-3">
                  <LoadingSkeleton className="h-3 w-20" />
                  <LoadingSkeleton className="h-5 w-28" />
                </div>
                {index === 0 ? (
                  <LoadingSkeleton className="h-6 w-16 rounded-full" />
                ) : null}
              </div>
              <LoadingSkeleton className="mt-4 h-4 w-full max-w-[220px]" />
              <LoadingSkeleton className="mt-2 h-4 w-5/6" />
            </CardContent>
          </Card>
        ))}
      </section>

      <div className="rounded-xl border border-border-subtle bg-card p-5">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <LoadingSkeleton className="h-6 w-20 rounded-full" />
            <LoadingSkeleton className="h-3 w-36" />
          </div>
          <LoadingSkeleton className="mt-4 h-8 w-full max-w-md" />
          <LoadingSkeleton className="mt-3 h-4 w-full max-w-xl" />
          <LoadingSkeleton className="mt-2 h-4 w-5/6" />
          <LoadingSkeleton className="mt-4 h-4 w-full max-w-lg" />
        </div>
      </div>
    </div>
  );
}

export function DashboardMembershipStreamedContent({
  dataPromise,
  subscriptionState,
}: {
  dataPromise: Promise<DashboardMembershipData>;
  subscriptionState?: string | null;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-subscription">
      <DashboardMembershipIntroContent
        actions={
          <Suspense
            fallback={
              <div className="flex flex-wrap gap-2">
                <LoadingSkeleton className="h-9 w-32 rounded-xl" />
                <LoadingSkeleton className="h-9 w-32 rounded-xl" />
              </div>
            }
          >
            <DashboardMembershipIntroActions
              dataPromise={dataPromise}
              subscriptionState={subscriptionState}
            />
          </Suspense>
        }
      />
      <Suspense fallback={<DashboardMembershipSectionsLoadingContent />}>
        <DashboardMembershipStreamedBody dataPromise={dataPromise} />
      </Suspense>
    </DashboardPageShell>
  );
}

export function DashboardMembershipLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-subscription">
      <DashboardMembershipIntroContent
        actions={
          <div className="flex flex-wrap gap-2">
            <LoadingSkeleton className="h-9 w-32 rounded-xl" />
            <LoadingSkeleton className="h-9 w-32 rounded-xl" />
          </div>
        }
      />
      <DashboardMembershipSectionsLoadingContent />
    </DashboardPageShell>
  );
}

export function DashboardSettingsContent({
  data,
}: {
  data: DashboardSettingsData;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-settings">
      <DashboardSettingsIntroContent />
      <DashboardSettingsResolvedContent data={data} />
    </DashboardPageShell>
  );
}

async function DashboardSettingsStreamedSections({
  dataPromise,
}: {
  dataPromise: Promise<DashboardSettingsData>;
}) {
  const data = await dataPromise;
  return <DashboardSettingsResolvedContent data={data} />;
}

function DashboardSettingsIntroContent() {
  return (
    <DashboardRouteIntro
      eyebrow="Settings"
      title="Account settings"
      description="Update your profile, appearance, notifications, and account controls from one protected dashboard page."
    />
  );
}

function DashboardSettingsResolvedContent({
  data,
}: {
  data: DashboardSettingsData;
}) {
  return (
    <>
      {data.state === "error" ? (
        <EmptyState
          title={data.errorTitle ?? "Could not load settings"}
          description={data.errorDescription}
          action={
            <Button asChild size="sm" variant="quiet">
              <Link href={routes.dashboardSettings}>Retry</Link>
            </Button>
          }
          className="border-border-subtle py-16"
        />
      ) : (
        <div className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start">
          <div className="min-w-0">
            <div className="rounded-2xl border border-border-subtle bg-card px-6 py-6">
              <div id="settings-profile" className="scroll-mt-24">
                <ProfileSettings
                  name={data.profile.displayName}
                  email={data.profile.email}
                  image={data.profile.avatarUrl}
                  providerImage={data.profile.providerAvatarUrl}
                  providerLabel={data.profile.providerLabel}
                />
              </div>
              <div
                id="settings-preferences"
                className="mt-8 scroll-mt-24 border-t border-border-subtle pt-8"
              >
                <PreferenceSettings theme={data.preferences.theme} />
              </div>
              <div
                id="settings-notifications"
                className="mt-8 scroll-mt-24 border-t border-border-subtle pt-8"
              >
                <NotificationSettings
                  emailNotifications={data.notifications.emailNotifications}
                  purchaseReceipts={data.notifications.purchaseReceipts}
                  productUpdates={data.notifications.productUpdates}
                  marketingEmails={data.notifications.marketingEmails}
                />
              </div>
            </div>
          </div>

          <div className="space-y-5 xl:sticky xl:top-24">
            <section className="space-y-3 rounded-2xl border border-border-subtle bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Account notes
              </p>
              <div className="space-y-3 text-small text-muted-foreground">
                <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Current plan
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {data.accountAccess.currentPlanLabel}
                  </p>
                </div>
                <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
                  <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    Member since
                  </p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    {data.accountAccess.memberSinceLabel}
                  </p>
                </div>
              </div>
            </section>

            <section className="space-y-3 rounded-2xl border border-border-subtle bg-card p-5">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Billing
              </p>
              <div className="space-y-3">
                <Link
                  href={routes.dashboardMembership}
                  className="flex items-center gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 transition-colors hover:border-border hover:bg-card"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <CircleDollarSign className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">Membership billing</p>
                    <p className="mt-1 text-small text-muted-foreground">
                      Manage your plan and billing.
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
                <Link
                  href={routes.dashboardPurchases}
                  className="flex items-center gap-3 rounded-xl border border-border-subtle bg-background px-4 py-3 transition-colors hover:border-border hover:bg-card"
                >
                  <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <ReceiptText className="size-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      Receipts and order history
                    </p>
                    <p className="mt-1 text-small text-muted-foreground">
                      Review past purchases.
                    </p>
                  </div>
                  <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </div>
            </section>

            <div
              id="settings-account-access"
              className="scroll-mt-24 rounded-2xl border border-border-subtle bg-card p-5"
            >
              <SecuritySettings
                email={data.accountAccess.email}
                signInMethodLabel={data.accountAccess.signInMethodLabel}
                canResetPassword={data.accountAccess.canResetPassword}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function DashboardSettingsStreamedContent({
  dataPromise,
}: {
  dataPromise: Promise<DashboardSettingsData>;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-settings">
      <DashboardSettingsIntroContent />
      <Suspense fallback={<DashboardSettingsSectionsLoadingContent />}>
        <DashboardSettingsStreamedSections dataPromise={dataPromise} />
      </Suspense>
    </DashboardPageShell>
  );
}

function DashboardSettingsSectionsLoadingContent() {
  return (
    <div
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
      data-loading-scope="dashboard-settings"
    >
      <div className="min-w-0">
        <section className="rounded-2xl border border-border-subtle bg-card px-6 py-6">
          <div className="space-y-5 border-b border-border-subtle pb-8">
            <LoadingSkeleton className="h-6 w-24" />
            <LoadingSkeleton className="h-4 w-56" />
            <div className="flex flex-col gap-5 border-b border-border-subtle pb-5 md:flex-row md:items-start md:justify-between">
              <div className="flex min-w-0 items-start gap-4">
                <LoadingSkeleton className="size-[72px] rounded-full" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <LoadingSkeleton className="h-5 w-24" />
                    <LoadingSkeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="mt-2 space-y-2">
                    <LoadingSkeleton className="h-4 w-56" />
                    <LoadingSkeleton className="h-4 w-20" />
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 md:justify-end">
                <LoadingSkeleton className="h-9 w-32 rounded-xl" />
                <LoadingSkeleton className="h-9 w-32 rounded-xl" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <LoadingSkeleton className="h-3 w-20" />
                  <LoadingSkeleton className="h-11 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <LoadingSkeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>

          <div className="space-y-5 border-b border-border-subtle py-8">
            <LoadingSkeleton className="h-6 w-28" />
            <LoadingSkeleton className="h-4 w-72" />
            <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_240px] md:items-start md:gap-6">
              <div className="space-y-2">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-4 w-full max-w-sm" />
              </div>
              <LoadingSkeleton className="h-11 w-full rounded-xl md:justify-self-end" />
            </div>
            <div className="flex justify-end">
              <LoadingSkeleton className="h-9 w-28 rounded-xl" />
            </div>
          </div>

          <div className="space-y-5 pt-8">
            <LoadingSkeleton className="h-6 w-32" />
            <LoadingSkeleton className="h-4 w-80" />
            <div className="divide-y divide-border">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex items-center justify-between gap-4 py-3">
                  <div className="space-y-2">
                    <LoadingSkeleton className="h-4 w-36" />
                    <LoadingSkeleton className="h-4 w-full max-w-sm" />
                  </div>
                  <LoadingSkeleton className="h-6 w-11 rounded-full" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="space-y-5">
        <section className="space-y-3 rounded-2xl border border-border-subtle bg-card p-5">
          <LoadingSkeleton className="h-3 w-20" />
          <div className="space-y-3">
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <LoadingSkeleton className="h-3 w-24" />
              <LoadingSkeleton className="mt-3 h-4 w-40" />
            </div>
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <LoadingSkeleton className="h-3 w-24" />
              <LoadingSkeleton className="mt-3 h-4 w-28" />
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-card p-5">
          <LoadingSkeleton className="h-3 w-16" />
          <div className="space-y-3">
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <LoadingSkeleton className="size-11 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-36" />
                  <LoadingSkeleton className="h-4 w-44" />
                </div>
                <LoadingSkeleton className="size-4 rounded-full" />
              </div>
            </div>
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <div className="flex items-center gap-3">
                <LoadingSkeleton className="size-11 rounded-lg" />
                <div className="min-w-0 flex-1 space-y-2">
                  <LoadingSkeleton className="h-4 w-40" />
                  <LoadingSkeleton className="h-4 w-40" />
                </div>
                <LoadingSkeleton className="size-4 rounded-full" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3 rounded-2xl border border-border-subtle bg-card p-5">
          <LoadingSkeleton className="h-3 w-14" />
          <div className="space-y-3">
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <LoadingSkeleton className="h-4 w-28" />
              <LoadingSkeleton className="mt-3 h-4 w-48" />
            </div>
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <LoadingSkeleton className="h-4 w-28" />
              <LoadingSkeleton className="mt-3 h-4 w-40" />
            </div>
            <div className="rounded-xl border border-border-subtle bg-background px-4 py-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <LoadingSkeleton className="h-4 w-24" />
                  <LoadingSkeleton className="h-4 w-52" />
                </div>
                <LoadingSkeleton className="h-9 w-32 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="pt-1">
            <LoadingSkeleton className="h-9 w-28 rounded-xl" />
          </div>
        </section>
      </div>
    </div>
  );
}

export function DashboardSettingsLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-settings">
      <DashboardSettingsIntroContent />
      <DashboardSettingsSectionsLoadingContent />
    </DashboardPageShell>
  );
}

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
