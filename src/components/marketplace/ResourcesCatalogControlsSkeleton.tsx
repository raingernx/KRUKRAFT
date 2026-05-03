"use client";

import { Search } from "@/lib/icons";
import { Skeleton } from "boneyard-js/react";
import { chipVariants, Container, LoadingSkeleton } from "@/design-system";
import { ScrollableCategoryNav } from "@/components/marketplace/ScrollableCategoryNav";

const RESOURCES_CATALOG_SEARCH_NAME = "resources-catalog-search";
const RESOURCES_CATALOG_CONTROLS_NAME = "resources-catalog-controls";
const CONTROLS_BAR_CLASS_NAME = "bg-background";
const CONTROLS_BAR_MAIN_CLASS_NAME = "flex min-w-0 items-center gap-2.5 overflow-hidden";
const CONTROLS_BAR_GROUP_CLASS_NAME =
  "flex min-w-0 items-center gap-2.5 overflow-hidden";

function SearchFallback() {
  return (
    <div className="relative h-10 w-full rounded-full border border-border bg-background text-muted-foreground shadow-none">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex w-[44px] items-center justify-center">
        <LoadingSkeleton className="h-[14px] w-[14px] rounded-full bg-muted-foreground/25" />
      </span>
      <div className="flex h-full items-center pl-[45px] pr-[45px]">
        <LoadingSkeleton className="h-4 w-44 rounded" />
      </div>
    </div>
  );
}

function CatalogSearchPreview() {
  return (
    <div className="relative h-10 w-full rounded-full border border-border bg-background text-[16px] font-normal leading-normal text-muted-foreground shadow-none">
      <span className="pointer-events-none absolute inset-y-0 left-0 flex w-[44px] items-center justify-center text-muted-foreground">
        <Search className="h-[14px] w-[14px] stroke-[1.75]" aria-hidden />
      </span>
      <div className="flex h-full items-center pl-[45px] pr-[45px]">
        <span>ค้นหาใบงาน แฟลชการ์ด โน้ต...</span>
      </div>
    </div>
  );
}

export function ResourcesCatalogSearchBonesPreview() {
  return (
    <Skeleton
      name={RESOURCES_CATALOG_SEARCH_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <CatalogSearchPreview />
    </Skeleton>
  );
}

export function ResourcesCatalogSearchSkeleton() {
  return <SearchFallback />;
}

export function DiscoverFallback() {
  return (
    <div className="inline-flex h-10 items-center rounded-full border border-border-strong bg-muted px-4 font-ui text-sm font-semibold text-muted-foreground shadow-sm">
      <LoadingSkeleton className="h-3.5 w-16 rounded" />
    </div>
  );
}

function DiscoverPreview() {
  return (
    <div className={chipVariants({ variant: "navigation" })}>
      <span>สำรวจ</span>
    </div>
  );
}

export function ChipsFallback() {
  return (
    <div className="flex gap-2.5 overflow-hidden">
      {["w-16", "w-24", "w-28", "w-16", "w-24", "w-20"].map((width, index) => (
        <div
          key={`${width}-${index}`}
          className={`inline-flex h-10 shrink-0 items-center rounded-full border border-border-strong bg-muted px-4 font-ui text-sm font-semibold text-muted-foreground ${
            index === 0 ? "gap-2 pr-4" : ""
          }`}
        >
          <LoadingSkeleton className={`h-3.5 ${width} rounded`} />
        </div>
      ))}
    </div>
  );
}

function ChipsPreview() {
  return (
    <div className="flex gap-2.5 overflow-hidden">
      {["ทั้งหมด", "ศิลปะและความคิดสร้างสรรค์", "ปฐมวัย", "มนุษยศาสตร์", "ภาษา", "คณิตศาสตร์"].map(
        (label, index) => (
          <div
            key={label}
            className={chipVariants({
              variant: "navigation",
              selected: index === 0,
            })}
          >
            <span>{label}</span>
          </div>
        ),
      )}
    </div>
  );
}

function ManualResourcesCatalogControlsSkeleton() {
  return (
    <div className={CONTROLS_BAR_CLASS_NAME}>
      <Container className="py-2 sm:py-2.5">
        <div className={CONTROLS_BAR_MAIN_CLASS_NAME}>
          <div className={CONTROLS_BAR_GROUP_CLASS_NAME}>
            <DiscoverFallback />
            <ScrollableCategoryNav>
              <ChipsFallback />
            </ScrollableCategoryNav>
          </div>
        </div>
      </Container>
    </div>
  );
}

function ResourcesCatalogControlsPreview() {
  return (
    <div className={CONTROLS_BAR_CLASS_NAME}>
      <Container className="py-2 sm:py-2.5">
        <div className={CONTROLS_BAR_MAIN_CLASS_NAME}>
          <div className={CONTROLS_BAR_GROUP_CLASS_NAME}>
            <DiscoverPreview />
            <ScrollableCategoryNav>
              <ChipsPreview />
            </ScrollableCategoryNav>
          </div>
        </div>
      </Container>
    </div>
  );
}

export function ResourcesCatalogControlsBonesPreview() {
  return (
    <Skeleton
      name={RESOURCES_CATALOG_CONTROLS_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <ResourcesCatalogControlsPreview />
    </Skeleton>
  );
}

export function ResourcesCatalogControlsSkeleton() {
  return <ManualResourcesCatalogControlsSkeleton />;
}
