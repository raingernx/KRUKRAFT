"use client";

import { Skeleton } from "boneyard-js/react";
import { LoadingSkeleton } from "@/design-system";

interface ResourcesIntroSectionSkeletonProps {
  isDiscoverMode: boolean;
}

const RESOURCES_INTRO_DISCOVER_NAME = "resources-intro-discover";
const RESOURCES_INTRO_LISTING_NAME = "resources-intro-listing";

function ManualDiscoverIntroSkeleton() {
  return (
    <section className="border-b border-border pb-7 sm:pb-8">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-4 w-28" />
      </div>
    </section>
  );
}

function ManualListingIntroSkeleton() {
  return (
    <section className="border-b border-border pb-7 sm:pb-8">
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
      </div>
    </section>
  );
}

export function ResourcesIntroDiscoverPreview() {
  return (
    <section className="border-b border-border pb-7 sm:pb-8">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
        <span className="font-medium text-foreground">Recommended for you</span>
        <span aria-hidden>•</span>
        <span>Curated for momentum</span>
      </div>
    </section>
  );
}

export function ResourcesIntroListingPreview() {
  return (
    <section className="border-b border-border pb-7 sm:pb-8">
      <div className="space-y-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="font-ui text-caption tracking-[0.12em] text-muted-foreground">
              Browse
            </p>
            <h1 className="max-w-3xl font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              All resources
            </h1>
            <p className="max-w-2xl text-small leading-6 text-muted-foreground">
              Explore printable worksheets, flashcards, and teaching materials across every category.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-caption text-muted-foreground">
            <span className="font-medium text-foreground">20 results</span>
            <span aria-hidden>•</span>
            <span>Sorted by Trending</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResourcesIntroSectionDiscoverBonesPreview() {
  return (
    <Skeleton
      name={RESOURCES_INTRO_DISCOVER_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <ResourcesIntroDiscoverPreview />
    </Skeleton>
  );
}

export function ResourcesIntroSectionListingBonesPreview() {
  return (
    <Skeleton
      name={RESOURCES_INTRO_LISTING_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <ResourcesIntroListingPreview />
    </Skeleton>
  );
}

export function ResourcesIntroSectionSkeleton({
  isDiscoverMode,
}: ResourcesIntroSectionSkeletonProps) {
  return <ResourcesIntroSectionManualSkeleton isDiscoverMode={isDiscoverMode} />;
}
export function ResourcesIntroSectionManualSkeleton({
  isDiscoverMode,
}: ResourcesIntroSectionSkeletonProps) {
  return isDiscoverMode ? <ManualDiscoverIntroSkeleton /> : <ManualListingIntroSkeleton />;
}
