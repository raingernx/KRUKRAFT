"use client";

import { Skeleton } from "boneyard-js/react";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { ResourceDetailPurchaseCardClient } from "./ResourceDetailPurchaseCardClient";

const PURCHASE_CARD_SKELETON_NAME = "purchase-card";

const CARD_SHELL_CLASS =
  "flex h-full min-h-0 flex-col rounded-xl border border-border bg-card p-5 sm:p-6";
const SECTION_STACK_CLASS = "space-y-5";
const DIVIDED_SECTION_CLASS = "space-y-5 border-t border-border-subtle pt-5";

const purchaseCardFixtureProps = {
  resource: {
    id: "purchase-card-bones-fixture",
    title: "Middle School Science Quiz & Assessment Set",
    slug: "middle-school-science-quiz-and-assessment-set",
    price: 2000,
    isFree: false,
    type: "PDF",
    downloadCount: 156,
    author: { id: "author-fixture", name: "Kru Craft" },
    category: { id: "science", name: "Science", slug: "science" },
    levelLabel: "Intermediate learners",
  },
  purchaseMeta: {
    mimeType: "application/pdf",
    fileSize: 319130,
    updatedAt: "2026-03-01T00:00:00.000Z",
    resourceStat: {
      last30dDownloads: 48,
      last30dPurchases: 12,
    },
  },
  trustSummary: {
    averageRating: 4.8,
    totalReviews: 17,
    totalSales: 156,
  },
  hasFile: true,
  isReturningFromCheckout: false,
  platformShortName: "Krukraft",
  viewerStateOverride: {
    authenticated: false,
    userId: null,
    subscriptionStatus: null,
    isOwned: false,
    isReady: true,
  },
} as const;

function ManualPurchaseCardSkeleton() {
  return (
    <div className={CARD_SHELL_CLASS}>
      <div className="flex h-full min-h-0 flex-col">
        <div className={SECTION_STACK_CLASS}>
          <LoadingSkeleton className="h-4 w-40" />
          <LoadingSkeleton className="h-12 w-28" />
          <PurchaseCardMiddleSkeleton />
        </div>

        <div className={DIVIDED_SECTION_CLASS}>
          <div className="space-y-3.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-start justify-between gap-4">
                <LoadingSkeleton className="h-4 w-20" />
                <LoadingSkeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
          <PurchaseCardMembershipSkeleton />
        </div>
      </div>
    </div>
  );
}

function PurchaseCardFixture() {
  return (
    <div className="w-full max-w-[380px]">
      <ResourceDetailPurchaseCardClient {...purchaseCardFixtureProps} />
    </div>
  );
}

export function PurchaseCardBonesPreview() {
  return (
    <Skeleton
      name={PURCHASE_CARD_SKELETON_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <PurchaseCardFixture />
    </Skeleton>
  );
}

/** Full-card skeleton for the outer Suspense in page.tsx. */
export function PurchaseCardSkeleton() {
  return <ManualPurchaseCardSkeleton />;
}

export function PurchaseCardMiddleSkeleton() {
  return (
    <div className={SECTION_STACK_CLASS}>
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-32 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-4/5" />
        </div>
        <LoadingSkeleton className="h-3.5 w-36" />
      </div>

      <div className="grid grid-cols-1 gap-4 border-t border-border-subtle py-5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="space-y-1.5">
            <LoadingSkeleton className="h-3.5 w-16" />
            <LoadingSkeleton className="h-7 w-14" />
            <LoadingSkeleton className="h-3.5 w-20" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2.5">
        {[112, 132, 140].map((w) => (
          <LoadingSkeleton key={w} className="h-7 rounded-full" style={{ width: w }} />
        ))}
      </div>

      <div className="rounded-xl border border-border bg-muted/40 px-4 py-3.5">
        <div className="space-y-2">
          <LoadingSkeleton className="h-3.5 w-28" />
          <LoadingSkeleton className="h-4 w-40" />
        </div>
      </div>

      <div className="space-y-3 border-t border-border-subtle py-5">
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
        <LoadingSkeleton className="mx-auto h-4 w-36" />
      </div>
    </div>
  );
}

export function PurchaseCardContentSkeleton() {
  return (
    <div className={SECTION_STACK_CLASS}>
      <div className="space-y-3">
        <LoadingSkeleton className="h-8 w-32 rounded-full" />
        <div className="space-y-2">
          <LoadingSkeleton className="h-4 w-full" />
          <LoadingSkeleton className="h-4 w-4/5" />
        </div>
        <LoadingSkeleton className="h-3.5 w-36" />
      </div>

      <div className="flex flex-wrap gap-2.5">
        {[112, 132, 140].map((w) => (
          <LoadingSkeleton key={w} className="h-7 rounded-full" style={{ width: w }} />
        ))}
      </div>

      <div className="space-y-3 border-t border-border-subtle py-5">
        <LoadingSkeleton className="h-12 w-full rounded-xl" />
        <LoadingSkeleton className="mx-auto h-4 w-36" />
      </div>
    </div>
  );
}

export function PurchaseCardMembershipSkeleton() {
  return (
    <div className="space-y-2.5">
      <LoadingSkeleton className="h-4 w-44" />
      <LoadingSkeleton className="h-3.5 w-full" />
      <LoadingSkeleton className="h-3.5 w-3/4" />
      <LoadingSkeleton className="h-11 w-full rounded-xl" />
    </div>
  );
}
