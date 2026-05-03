"use client";

import { Skeleton } from "boneyard-js/react";
import { LoadingSkeleton } from "@/design-system";

const ADMIN_RESOURCE_FORM_NAME = "admin-resource-form";

function AdminResourceFormLoadingShellPreview() {
  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-28" />
        <LoadingSkeleton className="h-12 w-full rounded-full" />
      </div>
      <div className="space-y-3">
        <LoadingSkeleton className="h-4 w-40" />
        <LoadingSkeleton className="h-28 w-full rounded-3xl" />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <LoadingSkeleton className="h-12 w-full rounded-full" />
        <LoadingSkeleton className="h-12 w-full rounded-full" />
      </div>
      <LoadingSkeleton className="h-40 w-full rounded-3xl" />
      <div className="flex justify-end gap-3">
        <LoadingSkeleton className="h-10 w-28 rounded-full" />
        <LoadingSkeleton className="h-10 w-36 rounded-full" />
      </div>
    </div>
  );
}

function AdminResourceFormLoadingShellFallback() {
  return <AdminResourceFormLoadingShellPreview />;
}

export function AdminResourceFormLoadingShell() {
  return <AdminResourceFormLoadingShellFallback />;
}

export function AdminResourceFormLoadingShellBonesPreview() {
  return (
    <Skeleton
      name={ADMIN_RESOURCE_FORM_NAME}
      loading={false}
      className="w-full"
    >
      <AdminResourceFormLoadingShellPreview />
    </Skeleton>
  );
}
