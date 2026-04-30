import { Suspense, type ReactNode } from "react";
import Link from "next/link";

import {
  ChevronRight,
  CircleDollarSign,
  ReceiptText,
} from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardMembershipActions } from "@/components/dashboard/DashboardMembershipActions";
import {
  DashboardSettingsIntroContent,
  DashboardSettingsLoadingContent,
  DashboardSettingsSectionsLoadingContent,
} from "@/components/dashboard/DashboardSettingsLoadingContent";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { PreferenceSettings } from "@/components/settings/PreferenceSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { routes } from "@/lib/routes";
import type { DashboardMembershipData } from "@/services/dashboard/membership.service";
import type { DashboardSettingsData } from "@/services/dashboard/settings.service";

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

export { DashboardSettingsLoadingContent };
