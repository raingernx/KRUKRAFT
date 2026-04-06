"use client";

import { Skeleton } from "boneyard-js/react";
import { ResourceCard, type ResourceCardResource } from "./ResourceCard";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";

const RESOURCE_CARD_SKELETON_NAME = "resource-card";
const BONES_PREVIEW_IMAGE = "/uploads/c8fef7c0a5fecefa.png";

const resourceCardFixture: ResourceCardResource = {
  id: "resource-card-bones-fixture",
  slug: "resource-card-bones-fixture",
  title: "Middle School Science Quiz & Assessment Set",
  price: 2000,
  isFree: false,
  thumbnailUrl: BONES_PREVIEW_IMAGE,
  author: { name: "Kru Craft" },
  category: { name: "Science", slug: "science" },
};

function ManualResourceCardSkeleton() {
  return (
    <div className="flex h-full w-full flex-col overflow-hidden rounded-xl border border-border-subtle bg-card shadow-sm">
      <LoadingSkeleton className="aspect-[4/3] w-full rounded-t-xl rounded-b-none" />
      <div className="flex flex-1 flex-col space-y-3 p-4">
        <LoadingSkeleton className="h-4 w-3/4" />
        <LoadingSkeleton className="h-3 w-1/3" />
        <LoadingSkeleton className="h-4 w-1/4" />
      </div>
    </div>
  );
}

function ResourceCardFixture() {
  return (
    <div className="w-full max-w-[320px]">
      <ResourceCard
        resource={resourceCardFixture}
        previewMode
        linkPrefetchMode="none"
        imageLoading="eager"
      />
    </div>
  );
}

export function ResourceCardBonesPreview() {
  return (
    <Skeleton
      name={RESOURCE_CARD_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <ResourceCardFixture />
    </Skeleton>
  );
}

export function ResourceCardSkeleton() {
  return <ManualResourceCardSkeleton />;
}
