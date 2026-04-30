import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

import { ArrowDownToLine, ChevronRight, FileText } from "@/lib/icons";
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
import { ResourceIntentLink } from "@/components/navigation/ResourceIntentLink";
import type { DashboardDownloadsData } from "@/services/dashboard/downloads.service";
import { formatDashboardDownloadFileSize } from "@/services/dashboard/downloads.service";
import { formatDate } from "@/lib/format";
import { shouldBypassImageOptimizer } from "@/lib/imageDelivery";
import { routes } from "@/lib/routes";

export function DashboardDownloadsRouteFrame({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <DashboardPageShell routeReady="dashboard-downloads">
      <DashboardDownloadsRouteIntro />
      {children}
    </DashboardPageShell>
  );
}

function DashboardDownloadsRouteIntro() {
  return (
    <DashboardRouteIntro
      eyebrow="Downloads"
      title="Download history"
      description="Re-download owned files through the protected download route. File access stays gated behind your purchase record."
      action={
        <Button asChild size="md" variant="quiet">
          <Link href={routes.dashboardLibrary}>Open library</Link>
        </Button>
      }
    />
  );
}

function DashboardDownloadsSummaryCards({
  data,
}: {
  data: DashboardDownloadsData;
}) {
  return (
    <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
      <Card>
        <CardContent className="py-4">
          <p className="text-sm font-semibold text-foreground">
            {data.count} download{data.count === 1 ? "" : "s"}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
            {data.count > data.visibleCount ? (
              <span>Showing latest {data.visibleCount}</span>
            ) : null}
            <span>Only files you already opened appear here.</span>
            {data.latestDownloadLabel ? (
              <span>Last download {data.latestDownloadLabel}</span>
            ) : null}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="py-4">
          <p className="text-sm font-semibold text-muted-foreground">Protected entry</p>
          <p className="mt-2 text-base font-semibold text-foreground">
            Use the secure download route
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Every CTA here goes through `/api/download/:resourceId`, not a direct
            file URL.
          </p>
        </CardContent>
      </Card>
    </section>
  );
}

export function DashboardDownloadsSummaryLoadingContent() {
  return (
    <div className="space-y-4" data-loading-scope="dashboard-downloads">
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-start">
        {Array.from({ length: 2 }).map((_, index) => (
          <Card key={index}>
            <CardContent className="py-4">
              <LoadingSkeleton className="h-5 w-28" />
              <div className="mt-3 flex flex-wrap gap-3">
                <LoadingSkeleton className="h-4 w-44" />
                <LoadingSkeleton className="h-4 w-28" />
              </div>
              {index === 1 ? (
                <LoadingSkeleton className="mt-4 h-9 w-32 rounded-xl" />
              ) : null}
            </CardContent>
          </Card>
        ))}
      </section>
      <DashboardDownloadsBodyLoadingContent />
    </div>
  );
}

export function DashboardDownloadsBodyLoadingContent() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
      <div className="grid grid-cols-[minmax(0,1.8fr)_110px] gap-4 border-b border-border-subtle bg-muted/40 px-4 py-3 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_90px_110px]">
        <LoadingSkeleton className="h-3 w-16" />
        <LoadingSkeleton className="h-3 w-16 justify-self-end md:hidden" />
        <LoadingSkeleton className="hidden h-3 w-16 md:block" />
        <LoadingSkeleton className="hidden h-3 w-20 md:block" />
        <LoadingSkeleton className="hidden h-3 w-12 md:block" />
        <LoadingSkeleton className="h-3 w-16 justify-self-end" />
      </div>
      <div className="divide-y divide-border-subtle">
        {Array.from({ length: 5 }).map((_, index) => (
          <div
            key={index}
            className="grid grid-cols-[minmax(0,1.8fr)_110px] gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_90px_110px] md:items-center"
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
            <LoadingSkeleton className="hidden h-4 w-14 md:block" />
            <LoadingSkeleton className="h-8 w-24 justify-self-end rounded-xl" />
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardDownloadsRouteBody({
  data,
}: {
  data: DashboardDownloadsData;
}) {
  const tableDescription =
    data.count > data.visibleCount
      ? `Showing the latest ${data.visibleCount} downloads. Open library to re-download older purchases.`
      : "Recent protected-download activity across your owned resources.";

  return (
    <>
      {data.state === "error" ? (
        <EmptyState
          title={data.errorTitle ?? "Could not load downloads"}
          description={data.errorDescription}
          action={
            <Button asChild size="sm" variant="quiet">
              <Link href={routes.dashboardDownloads}>Retry</Link>
            </Button>
          }
          className="border-border-subtle py-16"
        />
      ) : data.state === "empty" ? (
        <EmptyState
          icon={<ArrowDownToLine className="size-5 text-muted-foreground" aria-hidden />}
          title="No downloads yet"
          description="Downloaded files will appear here after you open them from your library."
          action={
            <Button asChild size="sm">
              <Link href={routes.dashboardLibrary}>Open library</Link>
            </Button>
          }
          className="border-border-subtle py-16"
        />
      ) : (
        <DataPanelTable
          title="Recent downloads"
          description={tableDescription}
          bodyClassName="p-0"
        >
          <>
            <div className="grid grid-cols-[minmax(0,1.8fr)_110px] gap-4 border-b border-border-subtle bg-muted/40 px-4 py-3 text-xs font-semibold uppercase text-muted-foreground md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_90px_110px]">
              <span>Resource</span>
              <span className="hidden md:block">Creator</span>
              <span className="hidden md:block">Downloaded</span>
              <span className="hidden md:block">Size</span>
              <span className="text-right">Action</span>
            </div>
            <div className="divide-y divide-border-subtle">
              {data.downloads.map((download) => (
                <div
                  key={download.id}
                  className="grid grid-cols-[minmax(0,1.8fr)_110px] gap-4 px-4 py-4 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_120px_90px_110px] md:items-center"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div className="relative flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border-subtle bg-muted">
                      {download.resource.previewUrl ? (
                        <Image
                          src={download.resource.previewUrl}
                          alt={download.resource.title}
                          fill
                          sizes="40px"
                          unoptimized={shouldBypassImageOptimizer(
                            download.resource.previewUrl,
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
                        href={routes.resource(download.resource.slug)}
                        className="block truncate text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {download.resource.title}
                      </ResourceIntentLink>
                      <div className="mt-1 flex items-center gap-2">
                        <Badge variant="neutral">{download.resource.type}</Badge>
                        <span className="truncate text-xs text-muted-foreground md:hidden">
                          {download.resource.authorName ?? "—"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="hidden truncate text-sm text-muted-foreground md:block">
                    {download.resource.authorName ?? "—"}
                  </span>
                  <span className="hidden text-sm text-muted-foreground md:block">
                    {formatDate(download.downloadedAt)}
                  </span>
                  <span className="hidden text-sm text-muted-foreground md:block">
                    {formatDashboardDownloadFileSize(download.resource.fileSize)}
                  </span>
                  <div className="flex justify-end">
                    <Button asChild size="sm" variant="quiet">
                      <a href={`/api/download/${download.resource.id}`}>Download</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </>
        </DataPanelTable>
      )}
    </>
  );
}

export function DashboardDownloadsLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-downloads">
      <DashboardDownloadsRouteIntro />
      <DashboardDownloadsSummaryLoadingContent />
    </DashboardPageShell>
  );
}

export function DashboardDownloadsContent({
  data,
}: {
  data: DashboardDownloadsData;
}) {
  return (
    <DashboardDownloadsRouteFrame>
      <div data-route-shell-ready="dashboard-downloads" className="space-y-4">
        <DashboardDownloadsSummaryCards data={data} />
        <DashboardDownloadsRouteBody data={data} />
      </div>
    </DashboardDownloadsRouteFrame>
  );
}
