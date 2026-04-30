import type { ReactNode } from "react";
import Link from "next/link";

import {
  FileText,
  PackagePlus,
  Plus,
  ShieldCheck,
} from "@/lib/icons";
import {
  Badge,
  Button,
  buildPaginationItems,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataPanelTable,
  EmptyState,
  LoadingSkeleton,
  PaginationButton,
  PaginationEllipsis,
  PaginationInfo,
  PaginationList,
  PaginationNav,
  RowActionButton,
} from "@/design-system";
import { CreatorResourceForm } from "@/components/creator/CreatorResourceForm";
import { DashboardCreatorInventoryFilters } from "@/components/dashboard/DashboardCreatorInventoryFilters";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import type {
  DashboardCreatorEditorData,
} from "@/services/dashboard/creator-editor.service";
import {
  getDashboardCreatorResourcesHref,
  type DashboardCreatorResourcePricingFilter,
  type DashboardCreatorResourcesData,
  type DashboardCreatorResourceStatusFilter,
} from "@/services/dashboard/creator-resources.service";

const DASHBOARD_CREATOR_RESOURCE_STATUS_FILTERS = [
  { key: "all", label: "All statuses" },
  { key: "DRAFT", label: "Drafts" },
  { key: "PUBLISHED", label: "Published" },
  { key: "ARCHIVED", label: "Archived" },
] as const satisfies readonly {
  key: DashboardCreatorResourceStatusFilter;
  label: string;
}[];

const DASHBOARD_CREATOR_RESOURCE_PRICING_FILTERS = [
  { key: "all", label: "All pricing" },
  { key: "free", label: "Free" },
  { key: "paid", label: "Paid" },
] as const satisfies readonly {
  key: DashboardCreatorResourcePricingFilter;
  label: string;
}[];

const DASHBOARD_CREATOR_RESOURCE_SORTS = [
  { key: "latest", label: "Latest update" },
  { key: "downloads", label: "Most downloads" },
  { key: "revenue", label: "Top revenue" },
] as const;

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
      className="border-border-subtle py-20"
    />
  );
}

export function DashboardCreatorResourcesContent({
  data,
}: {
  data: DashboardCreatorResourcesData;
}) {
  const inventoryDescription =
    data.filteredCount === 0
      ? data.totalCount === 0
        ? "No resources in inventory yet."
        : "No resources match the current filters."
      : data.filteredCount === data.totalCount
        ? `Showing ${data.pageStart}–${data.pageEnd} of ${data.totalCount} total.`
        : `Showing ${data.pageStart}–${data.pageEnd} of ${data.filteredCount} matching.`;

  const totalCardDetail =
    data.filteredCount === data.totalCount
      ? `${data.totalCount} in inventory`
      : `${data.filteredCount} matching`;

  const paginationItems = buildPaginationItems(data.page, data.totalPages);

  return (
    <DashboardPageShell routeReady="dashboard-creator-resources">
      <DashboardRouteIntro
        action={
          data.state === "locked" ? null : (
            <Button asChild>
              <Link href={routes.dashboardCreatorNewResource}>
                <Plus className="size-4" aria-hidden />
                New resource
              </Link>
            </Button>
          )
        }
        eyebrow="Creator resources"
        title="Creator resources"
        description="Manage draft, published, and archived resources from one route-owned inventory."
        tone="featured"
      />

      {data.state === "locked" || data.state === "error" ? (
        <EmptyState
          icon={<FileText className="size-5 text-muted-foreground" aria-hidden />}
          title={data.errorTitle ?? "Could not load creator resources"}
          description={data.errorDescription}
          action={
            data.state === "locked" ? (
              <Button asChild size="sm">
                <Link href={routes.dashboardCreatorApply}>Apply for creator access</Link>
              </Button>
            ) : (
              <Button asChild size="sm" variant="quiet">
                <Link href={getDashboardCreatorResourcesHref()}>Retry</Link>
              </Button>
            )
          }
          className="border-border-subtle py-16"
        />
      ) : (
        <section className="space-y-4">
          <div className="grid gap-3 md:grid-cols-3">
            <Card size="sm">
              <CardContent className="py-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Total
                </p>
                <p className="mt-2 font-ui text-2xl font-semibold text-foreground">
                  {data.totalCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {totalCardDetail}
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="py-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Published
                </p>
                <p className="mt-2 font-ui text-2xl font-semibold text-foreground">
                  {data.publishedCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Live in the catalog
                </p>
              </CardContent>
            </Card>
            <Card size="sm">
              <CardContent className="py-4">
                <p className="text-xs font-medium uppercase text-muted-foreground">
                  Drafts
                </p>
                <p className="mt-2 font-ui text-2xl font-semibold text-foreground">
                  {data.draftCount}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {data.archivedCount} archived
                </p>
              </CardContent>
            </Card>
          </div>

          <DataPanelTable
            title="Resource inventory"
            description={inventoryDescription}
            actions={
              data.status !== "all" || data.pricing !== "all" || data.categoryId ? (
                <Link
                  href={getDashboardCreatorResourcesHref({ sort: data.sort })}
                  className="rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Clear filters
                </Link>
              ) : null
            }
            toolbar={
              <DashboardCreatorInventoryFilters
                categoryId={data.categoryId}
                pricing={data.pricing}
                pricingOptions={DASHBOARD_CREATOR_RESOURCE_PRICING_FILTERS}
                sort={data.sort}
                sortOptions={DASHBOARD_CREATOR_RESOURCE_SORTS}
                status={data.status}
                statusOptions={DASHBOARD_CREATOR_RESOURCE_STATUS_FILTERS}
              />
            }
          >
            {data.state === "empty" ? (
              <div className="p-5">
                <EmptyState
                  icon={
                    <PackagePlus
                      className="size-5 text-muted-foreground"
                      aria-hidden
                    />
                  }
                  title="No creator resources yet"
                  description="Create your first resource to start building your catalog."
                  action={
                    <Button asChild size="sm">
                      <Link href={routes.dashboardCreatorNewResource}>
                        New resource
                      </Link>
                    </Button>
                  }
                  className="border-border-subtle py-16"
                />
              </div>
            ) : data.state === "filtered-empty" ? (
              <div className="p-5">
                <EmptyState
                  icon={
                    <FileText
                      className="size-5 text-muted-foreground"
                      aria-hidden
                    />
                  }
                  title="No matching resources"
                  description="Try another status, pricing, or sort option."
                  action={
                    <Button asChild size="sm" variant="quiet">
                      <Link href={getDashboardCreatorResourcesHref()}>
                        Clear filters
                      </Link>
                    </Button>
                  }
                  className="border-border-subtle py-16"
                />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] text-left">
                    <thead className="border-b border-border-subtle bg-muted/40 text-xs uppercase text-muted-foreground">
                      <tr>
                        <th scope="col" className="px-5 py-3 font-medium">
                          Resource
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Status
                        </th>
                        <th scope="col" className="w-36 px-5 py-3 font-medium">
                          Pricing
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Revenue
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Downloads
                        </th>
                        <th scope="col" className="w-32 px-5 py-3 font-medium">
                          Updated
                        </th>
                        <th scope="col" className="w-28 px-5 py-3 font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle">
                      {data.resources.map((resource) => (
                        <tr key={resource.id}>
                          <td className="max-w-0 px-5 py-4">
                            <Link
                              href={resource.href}
                              className="block truncate text-sm font-semibold text-foreground transition-colors hover:text-primary"
                            >
                              {resource.title}
                            </Link>
                            <p className="mt-1 truncate text-xs text-muted-foreground">
                              {resource.categoryLabel}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <Badge
                              className="w-fit"
                              variant={
                                resource.status === "Published"
                                  ? "success"
                                  : resource.status === "Archived"
                                    ? "warning"
                                    : "neutral"
                              }
                            >
                              {resource.status}
                            </Badge>
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {resource.pricingLabel}
                          </td>
                          <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                            {resource.revenueLabel}
                          </td>
                          <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                            {resource.downloadsLabel}
                          </td>
                          <td className="px-5 py-4 text-sm text-muted-foreground">
                            {resource.updatedLabel}
                          </td>
                          <td className="px-5 py-4">
                            <RowActionButton asChild size="md">
                              <Link href={resource.href}>Edit</Link>
                            </RowActionButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {data.totalPages > 1 ? (
                  <div className="flex flex-col gap-3 border-t border-border-subtle bg-muted/20 px-5 py-4 lg:flex-row lg:items-center lg:justify-between">
                    <PaginationInfo>
                      Showing {data.pageStart}–{data.pageEnd} of {data.filteredCount} resources
                    </PaginationInfo>
                    <PaginationNav className="justify-start lg:justify-end">
                      <PaginationList className="flex-wrap justify-start lg:justify-end">
                        <PaginationButton asChild size="md">
                          <Link
                            aria-disabled={data.page <= 1}
                            tabIndex={data.page <= 1 ? -1 : undefined}
                            href={getDashboardCreatorResourcesHref({
                              status: data.status,
                              pricing: data.pricing,
                              sort: data.sort,
                              categoryId: data.categoryId,
                              page: Math.max(1, data.page - 1),
                            })}
                            className={cn(data.page <= 1 && "pointer-events-none opacity-40")}
                          >
                            Previous
                          </Link>
                        </PaginationButton>
                        {paginationItems.map((item, index) =>
                          item === "…" ? (
                            <PaginationEllipsis key={`ellipsis-${index}`} />
                          ) : (
                            <PaginationButton
                              key={item}
                              asChild
                              size="md"
                              active={item === data.page}
                            >
                              <Link
                                aria-current={item === data.page ? "page" : undefined}
                                href={getDashboardCreatorResourcesHref({
                                  status: data.status,
                                  pricing: data.pricing,
                                  sort: data.sort,
                                  categoryId: data.categoryId,
                                  page: item,
                                })}
                              >
                                {item}
                              </Link>
                            </PaginationButton>
                          ),
                        )}
                        <PaginationButton asChild size="md">
                          <Link
                            aria-disabled={data.page >= data.totalPages}
                            tabIndex={data.page >= data.totalPages ? -1 : undefined}
                            href={getDashboardCreatorResourcesHref({
                              status: data.status,
                              pricing: data.pricing,
                              sort: data.sort,
                              categoryId: data.categoryId,
                              page: Math.min(data.totalPages, data.page + 1),
                            })}
                            className={cn(
                              data.page >= data.totalPages &&
                                "pointer-events-none opacity-40",
                            )}
                          >
                            Next
                          </Link>
                        </PaginationButton>
                      </PaginationList>
                    </PaginationNav>
                  </div>
                ) : null}
              </>
            )}
          </DataPanelTable>
        </section>
      )}
    </DashboardPageShell>
  );
}

export function DashboardCreatorResourcesLoadingContent() {
  return (
    <DashboardPageShell routeReady="dashboard-creator-resources">
      <DashboardRouteIntro
        action={
          <Button asChild>
            <Link href={routes.dashboardCreatorNewResource}>
              <Plus className="size-4" aria-hidden />
              New resource
            </Link>
          </Button>
        }
        eyebrow="Creator resources"
        title="Creator resources"
        description="Manage draft, published, and archived resources from one route-owned inventory."
        tone="featured"
      />

      <section className="space-y-4" data-loading-scope="dashboard-creator-resources">
        <div className="grid gap-3 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Card key={index} size="sm">
              <CardContent className="py-4">
                <LoadingSkeleton className="h-3 w-20" />
                <LoadingSkeleton className="mt-3 h-8 w-14" />
                <LoadingSkeleton className="mt-2 h-3 w-28" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="overflow-hidden rounded-xl border border-border-subtle bg-card">
          <div className="flex items-center justify-between gap-4 border-b border-border-subtle px-5 py-4">
            <div className="min-w-0 flex-1 space-y-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <LoadingSkeleton className="h-5 w-40" />
                  <LoadingSkeleton className="h-4 w-56 max-w-full" />
                </div>
                <div className="flex items-center gap-3">
                  <LoadingSkeleton className="h-8 w-24 rounded-full" />
                  <LoadingSkeleton className="h-9 w-28 rounded-xl" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 sm:gap-3">
                {Array.from({ length: 3 }).map((_, index) => (
                  <LoadingSkeleton
                    key={index}
                    className="h-9 rounded-xl sm:h-10"
                  />
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <div className="grid min-w-[760px] grid-cols-[minmax(0,1fr)_128px_144px_128px_128px_128px_112px] gap-4 border-b border-border-subtle bg-muted/40 px-5 py-3">
              {Array.from({ length: 7 }).map((_, index) => (
                <LoadingSkeleton key={index} className="h-3 w-16" />
              ))}
            </div>
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="grid min-w-[760px] grid-cols-[minmax(0,1fr)_128px_144px_128px_128px_128px_112px] gap-4 border-b border-border-subtle px-5 py-4"
              >
                <div className="space-y-2">
                  <LoadingSkeleton className="h-4 w-3/4" />
                  <LoadingSkeleton className="h-3 w-1/2" />
                </div>
                <LoadingSkeleton className="h-5 w-20 rounded-full" />
                <LoadingSkeleton className="h-4 w-16" />
                <LoadingSkeleton className="h-4 w-14" />
                <LoadingSkeleton className="h-4 w-14" />
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-8 w-16 rounded-lg" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </DashboardPageShell>
  );
}

export function DashboardCreatorResourceEditorContent({
  mode,
  resourceId,
  data,
}: {
  mode: "new" | "edit";
  resourceId?: string;
  data?: DashboardCreatorEditorData;
}) {
  const isEdit = mode === "edit";

  if (data?.state === "locked" || data?.state === "error") {
    return (
      <DashboardPageShell routeReady="dashboard-creator-resource-editor">
        <DashboardRouteIntro
          eyebrow="Creator editor"
          title={data.state === "locked" ? "Creator access" : "Editor"}
          description={
            data.state === "locked"
              ? "Creator access is required before opening resource editor routes."
              : "The resource editor could not load."
          }
          tone={data.state === "locked" ? "warning" : "featured"}
        />
        <DashboardProtectedRouteEmptyState
          state={data}
          retryHref={
            isEdit
              ? routes.dashboardCreatorResource(resourceId ?? "sample")
              : routes.dashboardCreatorNewResource
          }
          icon={<FileText className="size-5 text-muted-foreground" aria-hidden />}
        />
      </DashboardPageShell>
    );
  }

  if (data?.state === "not-found" || data?.state === "forbidden") {
    return (
      <DashboardPageShell routeReady="dashboard-creator-resource-editor">
        <DashboardRouteIntro
          eyebrow="Creator editor"
          title={data.title}
          description={data.description}
          tone={data.state === "forbidden" ? "warning" : "featured"}
          action={
            <Button asChild variant="quiet">
              <Link href={routes.dashboardCreatorResources}>
                Back to resources
              </Link>
            </Button>
          }
        />
        <EmptyState
          icon={
            data.state === "forbidden" ? (
              <ShieldCheck className="size-5 text-muted-foreground" aria-hidden />
            ) : (
              <FileText className="size-5 text-muted-foreground" aria-hidden />
            )
          }
          title={data.title}
          description={data.description}
          action={
            <Button asChild>
              <Link href={routes.dashboardCreatorResources}>
                Open resource inventory
              </Link>
            </Button>
          }
          className="border-border-subtle py-20"
        />
      </DashboardPageShell>
    );
  }

  if (data?.state === "ready") {
    return (
      <DashboardPageShell routeReady="dashboard-creator-resource-editor">
        <DashboardRouteIntro
          eyebrow="Creator editor"
          title={data.title}
          description={data.description}
          tone="featured"
          action={
            isEdit ? (
              <Button asChild variant="quiet">
                <Link href={routes.dashboardCreatorResources}>
                  Back to resources
                </Link>
              </Button>
            ) : undefined
          }
        />
        <CreatorResourceForm
          mode={data.mode === "edit" ? "edit" : "create"}
          categories={data.categories}
          initialValues={data.mode === "edit" ? data.initialValues : undefined}
          initialAIDraft={data.mode === "edit" ? data.initialAIDraft : null}
          focusField={data.mode === "edit" ? data.focusField : undefined}
        />
      </DashboardPageShell>
    );
  }

  return (
    <DashboardPageShell routeReady="dashboard-creator-resource-editor">
      <DashboardRouteIntro
        eyebrow="Creator editor"
        title={isEdit ? "Edit resource" : "New resource"}
        description={
          isEdit
            ? `Editing prototype resource ${resourceId ?? "sample"}.`
            : "Create route scaffold for the future resource upload flow."
        }
        tone="featured"
      />
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <Card>
          <CardHeader className="border-b border-border-subtle pb-4">
            <CardTitle>Resource details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 py-5">
            {[
              ["Title", isEdit ? "Biology Lab Safety Posters" : "Untitled resource"],
              ["Category", "Science"],
              ["Format", "PDF worksheet pack"],
              ["Status", isEdit ? "Published" : "Draft"],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-xl border border-border-subtle bg-background px-4 py-3"
              >
                <p className="text-xs font-medium text-muted-foreground">
                  {label}
                </p>
                <p className="mt-1 text-sm font-semibold text-foreground">
                  {value}
                </p>
              </div>
            ))}
            <Button disabled variant="quiet">
              Editor prototype only
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="border-b border-border-subtle pb-4">
            <CardTitle>Upload checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 py-5">
            {["Metadata", "Preview file", "Protected download", "Review"].map(
              (step, index) => (
                <div key={step} className="flex items-center gap-3">
                  <div className="flex size-7 items-center justify-center rounded-full border border-border-subtle bg-muted text-xs font-semibold text-muted-foreground">
                    {index + 1}
                  </div>
                  <p className="text-sm text-foreground">{step}</p>
                </div>
              ),
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardPageShell>
  );
}

export function DashboardCreatorResourceEditorLoadingContent({
  mode,
}: {
  mode: "new" | "edit";
}) {
  const isEdit = mode === "edit";

  return (
    <DashboardPageShell routeReady="dashboard-creator-resource-editor">
      <DashboardRouteIntro
        eyebrow="Creator editor"
        title={isEdit ? "Edit resource" : "New resource"}
        description={
          isEdit
            ? "Update pricing, files, metadata, and previews for an existing resource."
            : "Create a protected resource draft, then add files, previews, and marketplace details."
        }
        tone="featured"
        action={
          isEdit ? (
            <Button asChild variant="quiet">
              <Link href={routes.dashboardCreatorResources}>
                Back to resources
              </Link>
            </Button>
          ) : undefined
        }
      />
      <section
        className="space-y-4"
        data-loading-scope="dashboard-creator-editor"
      >
        <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
          <Card>
            <CardHeader className="border-b border-border-subtle pb-4">
              <CardTitle>Resource details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5 py-5">
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-28" />
                <LoadingSkeleton className="h-11 w-full rounded-xl" />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, index) => (
                  <div key={index} className="space-y-3">
                    <LoadingSkeleton className="h-4 w-24" />
                    <LoadingSkeleton className="h-11 w-full rounded-xl" />
                  </div>
                ))}
              </div>
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-32" />
                <LoadingSkeleton className="h-28 w-full rounded-2xl" />
              </div>
              <div className="space-y-3">
                <LoadingSkeleton className="h-4 w-36" />
                <LoadingSkeleton className="h-12 w-full rounded-2xl" />
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <LoadingSkeleton className="h-10 w-full rounded-xl" />
                <LoadingSkeleton className="h-10 w-full rounded-xl" />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader className="border-b border-border-subtle pb-4">
                <CardTitle>Delivery and previews</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 py-5">
                <div className="flex flex-wrap gap-2">
                  <LoadingSkeleton className="h-9 w-28 rounded-xl" />
                  <LoadingSkeleton className="h-9 w-28 rounded-xl" />
                </div>
                <LoadingSkeleton className="h-24 w-full rounded-2xl" />
                <div className="grid grid-cols-3 gap-3">
                  {Array.from({ length: 3 }).map((_, index) => (
                    <LoadingSkeleton
                      key={index}
                      className="aspect-square w-full rounded-2xl"
                    />
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="border-b border-border-subtle pb-4">
                <CardTitle>Upload checklist</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 py-5">
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <LoadingSkeleton className="size-7 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <LoadingSkeleton className="h-4 w-28" />
                      <LoadingSkeleton className="h-3 w-36" />
                    </div>
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
