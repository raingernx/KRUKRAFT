"use client";

import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

interface ResourcesIntroSectionSkeletonProps {
  isDiscoverMode: boolean;
}

export function ResourcesIntroSectionSkeleton({
  isDiscoverMode,
}: ResourcesIntroSectionSkeletonProps) {
  const controlsBarClassName =
    "rounded-[28px] border border-surface-200/90 bg-white/90 p-3 sm:p-4 lg:p-5";

  return (
    <section className="border-b border-surface-200/80 pb-7 sm:pb-8">
      {isDiscoverMode ? (
        <div className={controlsBarClassName}>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <LoadingSkeleton className="h-4 w-24" />
            <LoadingSkeleton className="h-4 w-28" />
          </div>
          <div className="mt-3 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
            <div className="order-1 flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:order-2 lg:max-w-xl lg:items-center">
              <LoadingSkeleton className="h-11 w-full flex-1 rounded-2xl border border-surface-200 bg-white shadow-sm lg:min-w-[360px]" />
              <LoadingSkeleton className="h-11 w-40 shrink-0 rounded-2xl border border-surface-200 bg-surface-50" />
            </div>
            <div className="order-2 flex min-w-0 items-center gap-3 overflow-hidden lg:order-1">
              <div className="flex min-w-0 items-center gap-2 rounded-[20px] border border-surface-200 bg-surface-50/80 p-1">
                <LoadingSkeleton className="h-9 w-24 shrink-0 rounded-full bg-white" />
                <div className="flex gap-2 overflow-hidden pr-1">
                  {[56, 74, 82, 68, 92, 70].map((width, index) => (
                    <LoadingSkeleton
                      key={index}
                      className="h-9 shrink-0 rounded-full bg-white"
                      style={{ width }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-3">
              <LoadingSkeleton className="h-3 w-16" />
              <LoadingSkeleton className="h-8 w-72 rounded-xl sm:h-10" />
              <LoadingSkeleton className="h-4 w-72" />
            </div>
            <div className="flex flex-wrap gap-2">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="h-4 w-28" />
            </div>
          </div>

          <div className={controlsBarClassName}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <LoadingSkeleton className="h-4 w-24" />
              <LoadingSkeleton className="h-4 w-28" />
            </div>
            <div className="mt-3 flex flex-col gap-4 lg:mt-4 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
              <div className="order-1 flex w-full shrink-0 flex-col gap-3 sm:flex-row lg:order-2 lg:max-w-xl lg:items-center">
                <LoadingSkeleton className="h-11 w-full flex-1 rounded-2xl border border-surface-200 bg-white shadow-sm lg:min-w-[360px]" />
                <LoadingSkeleton className="h-11 w-40 shrink-0 rounded-2xl border border-surface-200 bg-surface-50" />
              </div>
              <div className="order-2 flex min-w-0 items-center gap-3 overflow-hidden lg:order-1">
                <div className="flex min-w-0 items-center gap-2 rounded-[20px] border border-surface-200 bg-surface-50/80 p-1">
                  <LoadingSkeleton className="h-9 w-24 shrink-0 rounded-full bg-white" />
                  <div className="flex gap-2 overflow-hidden pr-1">
                    {[56, 74, 82, 68, 92, 70].map((width, index) => (
                      <LoadingSkeleton
                        key={index}
                        className="h-9 shrink-0 rounded-full bg-white"
                        style={{ width }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
