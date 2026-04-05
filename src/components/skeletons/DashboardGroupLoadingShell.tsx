import type { ReactNode } from "react";
import { Logo } from "@/components/brand/Logo";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { Container } from "@/design-system";

function SidebarSection({
  labelWidth,
  itemWidths,
}: {
  labelWidth: string;
  itemWidths: string[];
}) {
  return (
    <div className="space-y-2.5">
      <LoadingSkeleton className={`h-3 ${labelWidth}`} />
      <div className="space-y-1.5">
        {itemWidths.map((width, index) => (
          <LoadingSkeleton key={index} className={`h-10 rounded-lg ${width}`} />
        ))}
      </div>
    </div>
  );
}

function DashboardGroupContentSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <LoadingSkeleton className="h-10 w-56 rounded-2xl" />
        <LoadingSkeleton className="h-4 w-[30rem] max-w-full" />
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-2xl border border-border bg-card p-5 shadow-card"
          >
            <LoadingSkeleton className="h-9 w-9 rounded-xl" />
            <LoadingSkeleton className="mt-4 h-8 w-20" />
            <LoadingSkeleton className="mt-2 h-4 w-24" />
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.25fr)_320px]">
        <div className="rounded-2xl border border-border bg-card shadow-card">
          <div className="border-b border-border px-5 py-4 sm:px-6">
            <LoadingSkeleton className="h-4 w-40" />
            <LoadingSkeleton className="mt-2 h-3 w-64" />
          </div>
          <div className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4 px-5 py-4 sm:px-6">
                <LoadingSkeleton className="h-11 w-11 rounded-xl" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <LoadingSkeleton className="h-4 w-4/5" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
                <LoadingSkeleton className="h-4 w-14" />
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
          <LoadingSkeleton className="h-4 w-20" />
          <LoadingSkeleton className="mt-4 h-5 w-40" />
          <LoadingSkeleton className="mt-2 h-4 w-full" />
          <LoadingSkeleton className="mt-2 h-4 w-4/5" />
          <LoadingSkeleton className="mt-5 h-10 w-36 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function DashboardGroupLoadingShell({
  children,
}: {
  children?: ReactNode;
}) {
  return (
    <div data-loading-scope="dashboard-group" className="flex min-h-screen bg-background">
      <aside className="hidden w-72 shrink-0 border-r border-border bg-card lg:flex lg:flex-col">
        <div className="flex h-14 items-center border-b border-border px-5 lg:px-6">
          <Logo variant="full" size="md" />
        </div>

        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center gap-3">
            <LoadingSkeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-1.5">
              <LoadingSkeleton className="h-4 w-28" />
              <LoadingSkeleton className="h-3 w-36" />
            </div>
          </div>
        </div>

        <div className="space-y-6 px-5 py-4">
          <SidebarSection
            labelWidth="w-16"
            itemWidths={["w-full", "w-full", "w-4/5"]}
          />
          <SidebarSection
            labelWidth="w-20"
            itemWidths={["w-full", "w-full", "w-full"]}
          />
        </div>
      </aside>

      <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-background/90 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 sm:px-6 lg:px-8">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <LoadingSkeleton className="h-9 w-9 rounded-xl lg:hidden" />
            <LoadingSkeleton className="h-8 w-40 rounded-xl" />
          </div>
          <div className="ml-3 flex shrink-0 items-center gap-2">
            <LoadingSkeleton className="h-9 w-24 rounded-full" />
            <LoadingSkeleton className="h-9 w-9 rounded-full" />
          </div>
        </header>

        <main className="min-w-0 flex-1 overflow-y-auto py-4 sm:py-5 lg:py-6">
          <Container>{children ?? <DashboardGroupContentSkeleton />}</Container>
        </main>
      </div>
    </div>
  );
}
