import { Settings } from "@/lib/icons";
import { CreatorProfileForm } from "@/components/creator/CreatorProfileForm";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LoadingSkeleton,
} from "@/design-system";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardProtectedRouteEmptyState } from "@/components/dashboard/routes/DashboardCreatorProtectedShared";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type { DashboardCreatorProfileData } from "@/services/dashboard/creator-profile.service";
import { routes } from "@/lib/routes";
import Link from "next/link";

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
