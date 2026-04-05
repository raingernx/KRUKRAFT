"use client";

import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

function AuthCardShell({
  titleWidth,
  bodyWidth,
  includeTwoInputs = false,
}: {
  titleWidth: string;
  bodyWidth: string;
  includeTwoInputs?: boolean;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <LoadingSkeleton className="mx-auto h-8 w-32 rounded-lg" />
          <LoadingSkeleton className={`mx-auto mt-5 h-8 rounded-2xl ${titleWidth}`} />
          <LoadingSkeleton className={`mx-auto mt-2 h-4 ${bodyWidth}`} />
        </div>

        <div className="rounded-2xl border border-border bg-card p-8 shadow-card">
          <div className="space-y-4">
            <LoadingSkeleton className="h-12 w-full rounded-xl" />
            {includeTwoInputs ? (
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
            ) : null}
            <LoadingSkeleton className="h-12 w-full rounded-xl" />
          </div>
        </div>

        <LoadingSkeleton className="mx-auto mt-5 h-4 w-48" />
      </div>
    </div>
  );
}

export function RegisterPageLoadingShell() {
  return (
    <div className="flex min-h-screen bg-background">
      <div className="hidden flex-1 flex-col justify-between bg-zinc-950 px-10 py-12 lg:flex">
        <LoadingSkeleton className="h-8 w-32 bg-white/15" />
        <div className="space-y-4">
          <LoadingSkeleton className="h-4 w-24 bg-white/15" />
          <LoadingSkeleton className="h-10 w-56 rounded-2xl bg-white/20" />
          <LoadingSkeleton className="h-10 w-64 rounded-2xl bg-white/20" />
          <LoadingSkeleton className="h-4 w-[26rem] max-w-full bg-white/15" />
          <div className="space-y-3 pt-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center gap-3">
                <LoadingSkeleton className="h-5 w-5 rounded-full bg-white/20" />
                <LoadingSkeleton className="h-4 w-48 bg-white/15" />
              </div>
            ))}
          </div>
        </div>
        <LoadingSkeleton className="h-3 w-28 bg-white/10" />
      </div>

      <div className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 lg:hidden">
            <LoadingSkeleton className="h-7 w-28 rounded-lg" />
          </div>

          <LoadingSkeleton className="h-8 w-48 rounded-2xl" />
          <LoadingSkeleton className="mt-2 h-4 w-56" />

          <div className="mt-7 rounded-2xl border border-border bg-card p-8 shadow-card">
            <LoadingSkeleton className="h-11 w-full rounded-xl" />
            <div className="my-5">
              <LoadingSkeleton className="h-px w-full rounded-none" />
            </div>
            <div className="space-y-4">
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
              <LoadingSkeleton className="h-12 w-full rounded-xl" />
            </div>
            <LoadingSkeleton className="mt-4 h-4 w-full" />
          </div>

          <LoadingSkeleton className="mx-auto mt-5 h-4 w-40" />
        </div>
      </div>
    </div>
  );
}

export function ResetPasswordPageLoadingShell() {
  return <AuthCardShell titleWidth="w-48" bodyWidth="w-56" />;
}

export function ResetPasswordConfirmPageLoadingShell() {
  return (
    <AuthCardShell
      titleWidth="w-56"
      bodyWidth="w-64"
      includeTwoInputs
    />
  );
}
