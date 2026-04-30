import type { ReactNode } from "react";
import Link from "next/link";

import {
  BarChart3,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Store,
} from "@/lib/icons";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  DataPanelTable,
  EmptyState,
} from "@/design-system";
import { DashboardCreatorStats } from "@/components/dashboard/DashboardCreatorStats";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import type { DashboardCreatorOverviewData } from "@/services/dashboard/creator-overview.service";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type DashboardCreatorReadyData = Extract<
  DashboardCreatorOverviewData,
  { state: "ready" }
>;

const creatorResources = [
  {
    title: "Biology Lab Safety Posters",
    status: "Published",
    sales: "$426",
    downloads: "812",
  },
  {
    title: "Fractions Intervention Pack",
    status: "Draft",
    sales: "$0",
    downloads: "0",
  },
  {
    title: "Reading Fluency Tracker",
    status: "Review",
    sales: "$118",
    downloads: "164",
  },
];

function DashboardCreatorWorkspaceRouteIntro({
  data,
}: {
  data?: DashboardCreatorReadyData;
} = {}) {
  const isFirstTimeCreator = data?.activationStage === "first-run";
  const storefrontHref =
    data?.profile.publicProfileHref ?? routes.dashboardCreatorProfile;
  const actions = isFirstTimeCreator ? (
    <>
      <Button asChild size="md">
        <Link className="whitespace-nowrap" href={routes.dashboardCreatorNewResource}>
          Create resource
        </Link>
      </Button>
      <Button asChild size="md" variant="quiet">
        <Link className="whitespace-nowrap" href={storefrontHref}>
          Storefront
        </Link>
      </Button>
    </>
  ) : (
    <>
      <Button asChild size="md">
        <Link className="whitespace-nowrap" href={routes.dashboardCreatorResources}>
          Resources
        </Link>
      </Button>
      <Button asChild size="md" variant="quiet">
        <Link className="whitespace-nowrap" href={storefrontHref}>
          Storefront
        </Link>
      </Button>
    </>
  );

  return (
    <DashboardRouteIntro
      eyebrow="Creator route"
      title="Workspace"
      description={
        isFirstTimeCreator
          ? "Set up your storefront, publish your first listing, and unlock creator reporting from one workspace."
          : "Resources, earnings, and storefront status in one place."
      }
      action={actions}
    />
  );
}

function DashboardCreatorWorkspaceResourcesPanel({
  resources,
  totalResources,
}: {
  resources?: DashboardCreatorReadyData["resources"];
  totalResources?: number;
}) {
  const resourceRows =
    resources?.map((resource: DashboardCreatorReadyData["resources"][number]) => ({
      key: resource.id,
      title: resource.title,
      status: resource.status,
      sales: resource.salesLabel,
      downloads: resource.downloadsLabel,
      href: resource.href,
    })) ??
    creatorResources.map((resource) => ({
      key: resource.title,
      title: resource.title,
      status: resource.status,
      sales: resource.sales,
      downloads: resource.downloads,
      href: null,
    }));
  const fillerRowCount =
    resources && resourceRows.length > 0
      ? Math.max(0, 5 - resourceRows.length)
      : 0;

  return (
    <DataPanelTable
      title="Recent resources"
      description="Latest updates across status, revenue, and downloads."
      actions={
        <Button asChild size="sm" variant="ghost">
          <Link href={routes.dashboardCreatorResources}>
            All resources
            <ChevronRight className="size-4" aria-hidden />
          </Link>
        </Button>
      }
      bodyClassName="p-0"
      footer={
        resources && resourceRows.length > 0 ? (
          <p className="text-sm text-muted-foreground">
            {totalResources && totalResources > resourceRows.length
              ? `Showing latest ${resourceRows.length} of ${totalResources} resources`
              : `Showing ${resourceRows.length} resource${resourceRows.length === 1 ? "" : "s"}`}
          </p>
        ) : undefined
      }
      id="creator-resources"
    >
      <>
        {resources && resourceRows.length === 0 ? (
          <div className="px-5 py-6">
            <EmptyState
              title="No creator resources yet"
              description="Create your first resource to start tracking sales and downloads here."
              action={
                <Button asChild size="sm">
                  <Link href={routes.dashboardCreatorNewResource}>
                    Create resource
                  </Link>
                </Button>
              }
              className="min-h-0 w-full max-w-none px-6 py-10"
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left">
              <thead className="border-b border-border-subtle text-xs uppercase text-muted-foreground">
                <tr>
                  <th scope="col" className="px-5 py-3 font-medium">
                    Resource
                  </th>
                  <th scope="col" className="w-32 px-5 py-3 font-medium">
                    Status
                  </th>
                  <th scope="col" className="w-32 px-5 py-3 font-medium">
                    Revenue
                  </th>
                  <th scope="col" className="w-36 px-5 py-3 font-medium">
                    Downloads
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {resourceRows.map((resource) => (
                  <tr key={resource.key}>
                    <td className="max-w-0 px-5 py-4">
                      {resource.href ? (
                        <Link
                          href={resource.href}
                          className="block truncate text-sm font-semibold text-foreground transition hover:text-primary"
                        >
                          {resource.title}
                        </Link>
                      ) : (
                        <p className="truncate text-sm font-semibold text-foreground">
                          {resource.title}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <Badge
                        className="w-fit"
                        variant={
                          resource.status === "Published"
                            ? "success"
                            : resource.status === "Draft"
                              ? "neutral"
                              : "warning"
                        }
                      >
                        {resource.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                      {resource.sales}
                    </td>
                    <td className="px-5 py-4 text-sm tabular-nums text-muted-foreground">
                      {resource.downloads}
                    </td>
                  </tr>
                ))}
                {Array.from({ length: fillerRowCount }).map((_, index) => (
                  <tr key={`filler-${index}`} aria-hidden="true" className="bg-card">
                    <td className="px-5 py-4">
                      <div className="h-4 w-3/5 rounded-md bg-muted/40" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-5 w-20 rounded-full bg-muted/40" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-16 rounded-md bg-muted/40" />
                    </td>
                    <td className="px-5 py-4">
                      <div className="h-4 w-24 rounded-md bg-muted/40" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </>
    </DataPanelTable>
  );
}

function DashboardCreatorWorkspace({
  data,
  resources,
  resourcePanel,
}: {
  data?: DashboardCreatorReadyData;
  resources?: DashboardCreatorReadyData["resources"];
  resourcePanel?: ReactNode;
} = {}) {
  const checklistItems = data?.checklist ?? [];
  const completedChecklistCount = checklistItems.filter((item) => item.done).length;
  const isFirstTimeCreator = data?.activationStage === "first-run";
  const workspaceCtaHref = routes.dashboardCreatorAnalytics;
  const workspaceCtaLabel = "Full analytics";
  const nextUnlocks = [
    {
      title: "Storefront live",
      detail: "Share your page after your first publish.",
      icon: Store,
    },
    {
      title: "Earnings visible",
      detail: "Sales and payouts appear after your first order.",
      icon: CircleDollarSign,
    },
    {
      title: "Analytics active",
      detail: "Insights unlock as your store gets traffic.",
      icon: BarChart3,
    },
  ] as const;

  return (
    <section id="creator-workspace" className="space-y-6">
      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between xl:col-span-2">
          <div>
            <h2 className="font-ui text-2xl font-semibold text-foreground">
              Overview
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {isFirstTimeCreator
                ? "Finish your setup, create your first listing, and keep the launch steps in one place."
                : "Revenue, resources, and downloads from your creator workspace."}
            </p>
          </div>
          {!isFirstTimeCreator ? (
            <Button asChild size="sm" variant="ghost">
              <Link href={workspaceCtaHref}>
                {workspaceCtaLabel}
                <ChevronRight className="size-4" aria-hidden />
              </Link>
            </Button>
          ) : null}
        </div>

        <div id="creator-analytics" className="flex flex-col gap-4">
          <DashboardCreatorStats stats={data?.stats} />
          {resourcePanel ?? (
            <DashboardCreatorWorkspaceResourcesPanel
              resources={resources}
              totalResources={data?.totalResourceCount}
            />
          )}
        </div>

        <Card id="creator-quick-links">
          <CardHeader className="border-b border-border-subtle pb-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle>
                  {isFirstTimeCreator ? "Launch checklist" : "Next steps"}
                </CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {isFirstTimeCreator
                    ? "Finish setup and ship your first listing."
                    : "Progress and shortcuts for your workspace."}
                </p>
              </div>
              {checklistItems.length > 0 ? (
                <Badge
                  className="shrink-0"
                  variant={
                    completedChecklistCount === checklistItems.length
                      ? "success"
                      : "warning"
                  }
                >
                  {completedChecklistCount}/{checklistItems.length} complete
                </Badge>
              ) : null}
            </div>
          </CardHeader>
          <CardContent className="py-0">
            <div className="divide-y divide-border-subtle">
              {checklistItems.map((item: DashboardCreatorReadyData["checklist"][number]) => (
                <div key={item.label} className="flex items-center gap-3 py-4">
                  <div
                    className={cn(
                      "flex size-9 shrink-0 items-center justify-center rounded-xl",
                      item.done
                        ? "bg-[hsl(var(--success-500)/0.12)] text-[hsl(var(--success-600))]"
                        : "bg-muted text-muted-foreground",
                    )}
                  >
                    {item.done ? (
                      <CheckCircle2 className="size-4" aria-hidden />
                    ) : (
                      <Clock3 className="size-4" aria-hidden />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <Badge variant={item.done ? "success" : "neutral"}>
                    {item.done ? "Done" : "Next"}
                  </Badge>
                </div>
              ))}
            </div>
            <div className="border-y border-border-subtle px-6 py-4">
              <p className="text-xs font-medium uppercase text-muted-foreground">
                What unlocks next
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                What unlocks after your first publish.
              </p>
            </div>
            <div className="divide-y divide-border-subtle">
              {nextUnlocks.map((item) => (
                <div key={item.title} className="flex items-center gap-3 py-4">
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                    <item.icon className="size-4" aria-hidden />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function DashboardCreatorContent({
  data,
}: {
  data?: DashboardCreatorOverviewData;
} = {}) {
  if (data?.state === "locked" || data?.state === "error") {
    return (
      <DashboardPageShell routeReady="dashboard-creator-overview">
        <DashboardRouteIntro
          eyebrow="Creator route"
          title={data.state === "locked" ? "Creator access" : "Workspace"}
          description={
            data.state === "locked"
              ? "Creator tools are available after access is enabled."
              : "Creator workspace data could not load."
          }
        />
        <section className="rounded-2xl border border-border-subtle bg-card p-6">
          <div className="max-w-xl">
            <h2 className="font-ui text-xl font-semibold text-foreground">
              {data.title}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {data.description}
            </p>
            {data.state === "locked" ? (
              <Button asChild className="mt-5">
                <Link href={data.ctaHref}>{data.ctaLabel}</Link>
              </Button>
            ) : null}
          </div>
        </section>
      </DashboardPageShell>
    );
  }

  const readyData = data?.state === "ready" ? data : undefined;

  return (
    <DashboardPageShell routeReady="dashboard-creator-overview">
      <DashboardCreatorWorkspaceRouteIntro data={readyData} />
      <DashboardCreatorWorkspace
        data={readyData}
        resources={readyData?.resources}
      />
    </DashboardPageShell>
  );
}
