import { LoadingSkeleton, Surface } from "@/design-system";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { DashboardPageHeader } from "@/components/layout/dashboard/DashboardPageHeader";

export function DashboardSettingsIntroContent() {
  return (
    <section className="border-b border-border-subtle pb-6">
      <DashboardPageHeader
        eyebrow="Settings"
        title="Account settings"
        description="Update your profile, appearance, notifications, and account controls from one protected dashboard page."
      />
    </section>
  );
}

export function DashboardSettingsSectionsLoadingContent() {
  return (
    <div
      className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px] xl:items-start"
      data-loading-scope="dashboard-settings"
    >
      <div className="min-w-0">
        <Surface className="rounded-2xl border-border-subtle px-6 py-6 shadow-none">
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
                <LoadingSkeleton className="h-10 w-32 rounded-xl" />
                <LoadingSkeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 2 }).map((_, index) => (
                <div key={index} className="space-y-2">
                  <LoadingSkeleton className="h-3 w-20" />
                  <LoadingSkeleton className="h-10 w-full rounded-xl" />
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <LoadingSkeleton className="h-10 w-28 rounded-xl" />
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
              <LoadingSkeleton className="h-10 w-full max-w-xs rounded-xl md:justify-self-end" />
            </div>
            <div className="flex justify-end">
              <LoadingSkeleton className="h-10 w-28 rounded-xl" />
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
        </Surface>
      </div>

      <div className="space-y-5">
        <Surface className="space-y-3 rounded-2xl border-border-subtle p-5 shadow-none">
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
        </Surface>

        <Surface className="space-y-3 rounded-2xl border-border-subtle p-5 shadow-none">
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
        </Surface>

        <Surface className="space-y-3 rounded-2xl border-border-subtle p-5 shadow-none">
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
                <LoadingSkeleton className="h-10 w-32 rounded-xl" />
              </div>
            </div>
          </div>
          <div className="pt-1">
            <LoadingSkeleton className="h-10 w-28 rounded-xl" />
          </div>
        </Surface>
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
