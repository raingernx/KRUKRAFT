"use client";

import { Skeleton } from "boneyard-js/react";
import { Badge, PageContent } from "@/design-system";
import { LoadingSkeleton } from "@/design-system";

const CREATOR_APPLY_PAGE_SKELETON_NAME = "creator-apply-page";

export type CreatorApplyPageSkeletonVariant =
  | "status-shell"
  | "not-applied"
  | "pending"
  | "approved"
  | "rejected";

function CreatorApplyHeaderSkeleton() {
  return (
    <div className="border-b border-border-subtle pb-5">
      <div className="flex flex-wrap items-center">
        <LoadingSkeleton className="h-5 w-16 rounded-full" />
      </div>

      <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div className="max-w-2xl">
          <LoadingSkeleton className="h-8 w-52 rounded-2xl sm:h-9 sm:w-56" />
          <div className="mt-3 space-y-2">
            <LoadingSkeleton className="h-4 w-full max-w-xl" />
            <LoadingSkeleton className="h-4 w-4/5 max-w-lg" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 xl:max-w-md xl:justify-end">
          {Array.from({ length: 3 }, (_, index) => (
            <LoadingSkeleton key={index} className="h-7 w-28 rounded-full" />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorApplyStatusPanelSkeleton({
  titleWidth,
  lineWidths,
  className,
}: {
  titleWidth: string;
  lineWidths: string[];
  className?: string;
}) {
  return (
    <div className={className ?? "rounded-2xl border border-border-subtle bg-card p-6"}>
      <div className="flex items-start gap-3">
        <LoadingSkeleton className="mt-0.5 h-10 w-10 rounded-xl" />
        <div className="min-w-0 flex-1 space-y-2">
          <LoadingSkeleton className="h-5 w-20 rounded-full" />
          <LoadingSkeleton className={`h-5 ${titleWidth}`} />
          {lineWidths.map((width) => (
            <LoadingSkeleton key={width} className={`h-4 ${width}`} />
          ))}
        </div>
      </div>
    </div>
  );
}

function CreatorApplyFormCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border-subtle bg-card">
      <div className="border-b border-border-subtle px-6 pb-4 pt-6">
        <LoadingSkeleton className="h-6 w-44" />
        <div className="mt-3 space-y-2">
          <LoadingSkeleton className="h-4 w-full max-w-2xl" />
          <LoadingSkeleton className="h-4 w-4/5 max-w-xl" />
        </div>
      </div>
      <div className="px-6 py-6">
        <div className="space-y-5">
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-36" />
            <LoadingSkeleton className="h-10 w-full rounded-xl" />
          </div>
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-32" />
            <div className="flex h-10 w-full overflow-hidden rounded-xl border border-border-subtle bg-background">
              <LoadingSkeleton className="h-full w-28 rounded-none border-r border-border-subtle" />
              <LoadingSkeleton className="h-full flex-1 rounded-none" />
            </div>
            <LoadingSkeleton className="h-3.5 w-72" />
          </div>
          <div className="space-y-2">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="h-24 w-full rounded-2xl" />
            <LoadingSkeleton className="ml-auto h-3.5 w-16" />
          </div>
          <LoadingSkeleton className="h-12 w-full rounded-xl" />
          <LoadingSkeleton className="mx-auto h-3.5 w-56" />
        </div>
      </div>
    </div>
  );
}

function CreatorApplyRejectedPanelSkeleton() {
  return (
    <div className="space-y-5 rounded-2xl border border-border-subtle bg-card p-6">
      <CreatorApplyStatusPanelSkeleton
        titleWidth="w-52"
        lineWidths={["w-full max-w-xl", "w-5/6 max-w-lg"]}
        className="rounded-none border-0 bg-transparent p-0 shadow-none"
      />
      <div className="rounded-xl border border-border bg-muted/30 px-4 py-4">
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-4 w-full max-w-lg" />
          <LoadingSkeleton className="h-4 w-5/6 max-w-md" />
        </div>
      </div>
      <div className="space-y-4">
        <LoadingSkeleton className="h-5 w-40" />
        <CreatorApplyFormCardSkeleton />
      </div>
    </div>
  );
}

function ManualCreatorApplyPageSkeleton({
  variant,
}: {
  variant: CreatorApplyPageSkeletonVariant;
}) {
  return (
    <PageContent className="space-y-6">
      <CreatorApplyHeaderSkeleton />

      {variant === "pending" ? (
        <CreatorApplyStatusPanelSkeleton
          titleWidth="w-48"
          lineWidths={["w-full max-w-2xl", "w-4/5 max-w-xl", "w-3/5 max-w-lg"]}
          className="rounded-2xl border border-border-subtle bg-card p-6"
        />
      ) : null}

      {variant === "approved" ? (
        <CreatorApplyStatusPanelSkeleton
          titleWidth="w-44"
          lineWidths={["w-full max-w-2xl", "w-5/6 max-w-xl", "w-2/3 max-w-lg"]}
          className="rounded-2xl border border-border-subtle bg-card p-6"
        />
      ) : null}

      {variant === "rejected" ? <CreatorApplyRejectedPanelSkeleton /> : null}

      {variant === "not-applied" ? <CreatorApplyFormCardSkeleton /> : null}

      {variant === "status-shell" ? (
        <CreatorApplyStatusPanelSkeleton
          titleWidth="w-52"
          lineWidths={["w-full max-w-2xl", "w-4/5 max-w-xl"]}
        />
      ) : null}
    </PageContent>
  );
}

function CreatorApplyPagePreview() {
  return (
    <PageContent className="space-y-6">
      <div className="border-b border-border-subtle pb-5">
        <div className="flex flex-wrap items-center">
          <Badge variant="info">Creator</Badge>
        </div>

        <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl">
            <h1 className="font-display text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              Become a Creator
            </h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              Apply once to publish resources, manage your profile, and track sales from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 xl:max-w-md xl:justify-end">
            {[
              "Publish resources",
              "Track earnings",
              "Build your profile",
            ].map((item) => (
              <span
                key={item}
                className="rounded-full border border-border-subtle bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground"
              >
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-border-subtle bg-card shadow-card">
        <div className="border-b border-border-subtle px-6 pb-4 pt-6">
          <h2 className="text-xl font-semibold text-foreground">Apply for creator access</h2>
          <div className="mt-3 space-y-2 text-sm text-muted-foreground">
            <p>Fill in the details below to submit your application.</p>
            <p>Our team reviews applications manually and will get back to you within 1–3 business days.</p>
          </div>
        </div>
        <div className="px-6 py-6">
          <div className="space-y-5">
            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Creator display name</p>
              <div className="flex h-10 items-center rounded-xl border border-input bg-background px-4 text-sm text-muted-foreground">
                e.g. Jane Smith
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Creator URL slug</p>
              <div className="flex h-10 overflow-hidden rounded-xl border border-input bg-background text-sm text-foreground">
                <span className="inline-flex items-center border-r border-input bg-muted px-3.5 text-muted-foreground">
                  /creators/
                </span>
                <span className="inline-flex min-w-0 flex-1 items-center px-3.5 text-muted-foreground">
                  jane-smith
                </span>
              </div>
              <p className="text-caption text-muted-foreground">
                Lowercase letters, numbers, and hyphens only. This will be your public profile URL.
              </p>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm font-medium text-foreground">Short bio</p>
              <div className="rounded-2xl border border-input bg-background p-4 text-sm text-muted-foreground">
                Tell us a bit about yourself and the content you plan to create.
              </div>
              <p className="text-right text-caption text-muted-foreground">0/500</p>
            </div>

            <div className="flex h-12 items-center justify-center rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground">
              Submit application
            </div>
            <p className="text-center text-caption text-muted-foreground">
              Review time: 1–3 business days after submission.
            </p>
          </div>
        </div>
      </div>
    </PageContent>
  );
}

export function CreatorApplyPageSkeletonBonesPreview() {
  return (
    <Skeleton
      name={CREATOR_APPLY_PAGE_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <CreatorApplyPagePreview />
    </Skeleton>
  );
}

export function CreatorApplyRejectedFeedbackSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-muted/30 px-4 py-4">
      <div className="space-y-2">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-4 w-full max-w-lg" />
        <LoadingSkeleton className="h-4 w-5/6 max-w-md" />
      </div>
    </div>
  );
}

export function CreatorApplyRouteLoadingContent() {
  return (
    <PageContent className="space-y-6">
      <section
        className="space-y-6"
        data-loading-scope="dashboard-creator-apply"
      >
        <CreatorApplyHeaderSkeleton />

        <CreatorApplyPanelSkeleton variant="status-shell" />
      </section>
    </PageContent>
  );
}

export function CreatorApplyPageSkeleton({
  variant = "status-shell",
}: {
  variant?: CreatorApplyPageSkeletonVariant;
}) {
  return <ManualCreatorApplyPageSkeleton variant={variant} />;
}

export function CreatorApplyPanelSkeleton({
  variant = "status-shell",
}: {
  variant?: CreatorApplyPageSkeletonVariant;
}) {
  if (variant === "rejected") {
    return <CreatorApplyRejectedPanelSkeleton />;
  }

  if (variant === "not-applied") {
    return <CreatorApplyFormCardSkeleton />;
  }

  if (variant === "pending") {
    return (
      <CreatorApplyStatusPanelSkeleton
        titleWidth="w-48"
        lineWidths={["w-full max-w-2xl", "w-4/5 max-w-xl", "w-3/5 max-w-lg"]}
        className="rounded-2xl border border-border-subtle bg-card p-6"
      />
    );
  }

  if (variant === "approved") {
    return (
      <CreatorApplyStatusPanelSkeleton
        titleWidth="w-44"
        lineWidths={["w-full max-w-2xl", "w-5/6 max-w-xl", "w-2/3 max-w-lg"]}
        className="rounded-2xl border border-border-subtle bg-card p-6"
      />
    );
  }

  return (
    <CreatorApplyStatusPanelSkeleton
      titleWidth="w-52"
      lineWidths={["w-full max-w-2xl", "w-4/5 max-w-xl"]}
    />
  );
}
