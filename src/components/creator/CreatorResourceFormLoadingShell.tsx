"use client";

import { Skeleton } from "boneyard-js/react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const CREATOR_RESOURCE_FORM_NAME = "creator-resource-form";

export function CreatorResourceFormLoadingShellPreview() {
  return (
    <section className="space-y-6 rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-32" />
        <LoadingSkeleton className="h-11 w-full rounded-2xl" />
      </div>

      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-40" />
        <LoadingSkeleton className="h-32 w-full rounded-3xl" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-11 w-full rounded-2xl" />
        </div>
        <div className="space-y-3">
          <LoadingSkeleton className="h-4 w-28" />
          <LoadingSkeleton className="h-11 w-full rounded-2xl" />
        </div>
      </div>

      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-36" />
        <LoadingSkeleton className="h-40 w-full rounded-3xl" />
      </div>

      <div className="flex justify-end gap-3">
        <LoadingSkeleton className="h-11 w-28 rounded-full" />
        <LoadingSkeleton className="h-11 w-36 rounded-full" />
      </div>
    </section>
  );
}

function CreatorResourceFormLoadingShellFallback() {
  return <CreatorResourceFormLoadingShellPreview />;
}

export function CreatorResourceFormLoadingShell() {
  return <CreatorResourceFormLoadingShellFallback />;
}

export function CreatorResourceFormLoadingShellBonesPreview() {
  return (
    <Skeleton
      loading={false}
      name={CREATOR_RESOURCE_FORM_NAME}
      className="w-full"
    >
      <CreatorResourceFormLoadingShellPreview />
    </Skeleton>
  );
}
