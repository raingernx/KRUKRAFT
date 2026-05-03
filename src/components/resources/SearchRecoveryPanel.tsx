"use client";

import { Skeleton } from "boneyard-js/react";
import Link from "next/link";
import { Compass, Search, Sparkles } from "@/lib/icons";
import { chipVariants, LoadingSkeleton } from "@/design-system";
import { routes } from "@/lib/routes";
import type { SearchRecoveryData } from "@/services/search";

const SEARCH_RECOVERY_PANEL_NAME = "search-recovery-panel";
const EMPTY_SEARCH_RECOVERY: SearchRecoveryData = {
  suggestedQueries: [],
  categoryMatches: [],
  tagMatches: [],
};

export function SearchRecoveryPanel({
  query,
  recovery,
  mode = "results-empty",
}: {
  query: string;
  recovery: SearchRecoveryData;
  mode?: "results-empty" | "recovery-unavailable";
}) {
  const safeRecovery = recovery ?? EMPTY_SEARCH_RECOVERY;
  const hasSuggestedQueries = safeRecovery.suggestedQueries.length > 0;
  const hasCategoryMatches = safeRecovery.categoryMatches.length > 0;
  const hasTagMatches = safeRecovery.tagMatches.length > 0;
  const title =
    mode === "recovery-unavailable"
      ? `ยังไม่พบผลลัพธ์สำหรับ “${query}”`
      : `ยังไม่พบผลลัพธ์สำหรับ “${query}”`;
  const description =
    mode === "recovery-unavailable"
      ? "ระบบยังโหลดคำแนะนำเพิ่มเติมไม่ได้ในตอนนี้ แต่คุณยังเปิดดูหมวดหลักหรือกลับไปที่หน้าคลังเพื่อเริ่มใหม่ได้เลย"
      : "ลองค้นหาด้วยคำที่กว้างขึ้น หรือข้ามไปดูหมวดและแท็กที่เกี่ยวข้องเพื่อกลับเข้าสู่คลังได้เร็วขึ้น";

  return (
    <div className="space-y-5 rounded-[28px] border border-border-subtle bg-card p-6 shadow-sm sm:p-7">
      <div className="flex flex-col items-center justify-center py-1 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-muted">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="mt-4 text-base font-semibold text-foreground">
          {title}
        </p>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
          {description}
        </p>
      </div>

      {hasSuggestedQueries ? (
        <section className="space-y-2.5">
          <p className="text-sm font-medium text-foreground">
            ลองคำค้นเหล่านี้
          </p>
          <div className="flex flex-wrap gap-2">
            {safeRecovery.suggestedQueries.map((suggestion) => (
              <Link
                key={suggestion}
                href={routes.marketplaceSearch(suggestion)}
                className={chipVariants({ variant: "filter" })}
              >
                {suggestion}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {hasCategoryMatches ? (
        <section className="space-y-2.5">
          <p className="text-sm font-medium text-foreground">
            เปิดดูตามหมวดหมู่
          </p>
          <div className="flex flex-wrap gap-2">
            {safeRecovery.categoryMatches.map((match) => (
              <Link
                key={match.slug}
                href={routes.marketplaceCategory(match.slug)}
                className={chipVariants({ variant: "navigation" })}
              >
                {match.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      {hasTagMatches ? (
        <section className="space-y-2.5">
          <p className="text-sm font-medium text-foreground">
            แท็กที่เกี่ยวข้อง
          </p>
          <div className="flex flex-wrap gap-2">
            {safeRecovery.tagMatches.slice(0, 6).map((match) => (
              <Link
                key={match.slug}
                href={routes.marketplaceTag(match.slug)}
                className={chipVariants({ variant: "navigation" })}
              >
                #{match.name}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="grid gap-3 border-t border-border-subtle pt-4 sm:grid-cols-3">
        <Link
          href={routes.marketplaceQuery("sort=trending&category=all")}
          className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-muted/45 px-4 py-3 transition hover:border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">กำลังมาแรงตอนนี้</span>
        </Link>
        <Link
          href={routes.marketplaceQuery("price=free&category=all")}
          className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-muted/45 px-4 py-3 transition hover:border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Compass className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">ดูทรัพยากรฟรี</span>
        </Link>
        <Link
          href={routes.marketplace}
          className="flex items-center gap-3 rounded-2xl border border-border-subtle bg-muted/45 px-4 py-3 transition hover:border-border hover:bg-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/35 focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Search className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-foreground">กลับไปหน้าคลัง</span>
        </Link>
      </section>
    </div>
  );
}

export function SearchRecoveryPanelFallback() {
  return (
    <div className="space-y-5 rounded-[28px] border border-border-subtle bg-card p-6 shadow-sm sm:p-7">
      <div className="flex flex-col items-center justify-center py-1 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-border-subtle bg-muted">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <LoadingSkeleton className="mt-4 h-6 w-full max-w-sm rounded-lg" />
        <LoadingSkeleton className="mt-2 h-4 w-full max-w-2xl rounded" />
        <LoadingSkeleton className="mt-2 h-4 w-11/12 max-w-xl rounded" />
      </div>

      <section className="space-y-2.5">
        <LoadingSkeleton className="h-3 w-32 rounded" />
        <div className="flex flex-wrap gap-2">
          <LoadingSkeleton className="h-10 w-28 rounded-full" />
          <LoadingSkeleton className="h-10 w-32 rounded-full" />
          <LoadingSkeleton className="h-10 w-24 rounded-full" />
        </div>
      </section>

      <section className="space-y-2.5">
        <LoadingSkeleton className="h-3 w-36 rounded" />
        <div className="flex flex-wrap gap-2">
          <LoadingSkeleton className="h-10 w-32 rounded-full" />
          <LoadingSkeleton className="h-10 w-28 rounded-full" />
        </div>
      </section>

      <section className="space-y-2.5">
        <LoadingSkeleton className="h-3 w-24 rounded" />
        <div className="flex flex-wrap gap-2">
          <LoadingSkeleton className="h-10 w-20 rounded-full" />
          <LoadingSkeleton className="h-10 w-24 rounded-full" />
          <LoadingSkeleton className="h-10 w-28 rounded-full" />
        </div>
      </section>

      <section className="grid gap-3 border-t border-border-subtle pt-4 sm:grid-cols-3">
        <LoadingSkeleton className="h-14 rounded-2xl" />
        <LoadingSkeleton className="h-14 rounded-2xl" />
        <LoadingSkeleton className="h-14 rounded-2xl" />
      </section>
    </div>
  );
}

const previewRecovery: SearchRecoveryData = {
  suggestedQueries: ["worksheet", "science quiz", "flashcards"],
  categoryMatches: [
    { name: "Language", slug: "language", resourceCount: 42 },
    { name: "Science", slug: "science", resourceCount: 35 },
  ],
  tagMatches: [
    { name: "vocabulary", slug: "vocabulary", resourceCount: 18 },
    { name: "quiz", slug: "quiz", resourceCount: 12 },
    { name: "printable", slug: "printable", resourceCount: 22 },
  ],
};

export function SearchRecoveryPanelPreview() {
  return (
    <SearchRecoveryPanel
      query="zzzznotfound123"
      recovery={previewRecovery}
    />
  );
}

export function SearchRecoveryPanelBonesPreview() {
  return (
    <Skeleton
      name={SEARCH_RECOVERY_PANEL_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <SearchRecoveryPanelPreview />
    </Skeleton>
  );
}
