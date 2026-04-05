"use client";

import { Skeleton } from "boneyard-js/react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const LOGIN_FORM_SKELETON_NAME = "login-form";

function LoginFormSkeletonPreview() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-sm space-y-4">
        <LoadingSkeleton className="mx-auto h-8 w-32 rounded-lg" />
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
      </div>
    </div>
  );
}

function ManualLoginFormSkeleton() {
  return <LoginFormSkeletonPreview />;
}

export function LoginFormSkeletonBonesPreview() {
  return (
    <Skeleton
      name={LOGIN_FORM_SKELETON_NAME}
      loading={false}
      className="w-full"
    >
      <LoginFormSkeletonPreview />
    </Skeleton>
  );
}

export function LoginFormSkeleton() {
  return <ManualLoginFormSkeleton />;
}
