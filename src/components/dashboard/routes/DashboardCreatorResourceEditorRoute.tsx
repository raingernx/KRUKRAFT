import Link from "next/link";

import {
  FileText,
  ShieldCheck,
} from "@/lib/icons";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  EmptyState,
  LoadingSkeleton,
} from "@/design-system";
import { CreatorResourceForm } from "@/components/creator/CreatorResourceForm";
import { DashboardRouteIntro } from "@/components/dashboard/DashboardRouteIntro";
import { DashboardProtectedRouteEmptyState } from "@/components/dashboard/routes/DashboardCreatorProtectedShared";
import { DashboardPageShell } from "@/components/layout/dashboard/DashboardPageShell";
import { routes } from "@/lib/routes";
import type { DashboardCreatorEditorData } from "@/services/dashboard/creator-editor.service";

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
