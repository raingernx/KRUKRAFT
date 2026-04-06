"use client";

import type { ReactNode } from "react";
import { Compass, Search, Sparkles } from "lucide-react";
import { Skeleton } from "boneyard-js/react";
import { RevealImage, SearchInput } from "@/design-system";
import { cn } from "@/lib/utils";
import { routes } from "@/lib/routes";

type SearchSuggestion = {
  id: string;
  title: string;
  slug: string;
  previewUrl: string | null;
  price: number;
  isFree: boolean;
  category: { name: string } | null;
  author: { name: string | null } | null;
  matchReason?: string | null;
};

type SearchRecoveryData = {
  suggestedQueries: string[];
  categoryMatches: { name: string; slug: string; resourceCount: number }[];
  tagMatches: { name: string; slug: string; resourceCount: number }[];
};

const HERO_SEARCH_QUICK_BROWSE_NAME = "hero-search-quick-browse";
const HERO_SEARCH_RESULTS_NAME = "hero-search-results";
const HERO_SEARCH_EMPTY_NAME = "hero-search-empty";
const BONES_PREVIEW_IMAGE = "/uploads/c8fef7c0a5fecefa.png";

const QUICK_BROWSE_LINKS = [
  { label: "ยอดนิยมตอนนี้", icon: Sparkles },
  { label: "มาใหม่", icon: Search },
  { label: "ฟรี", icon: Compass },
] as const;

const QUICK_BROWSE_CATEGORIES = [
  { label: "ทั้งหมด", href: routes.marketplaceCategory("all") },
  { label: "ภาษา", href: routes.marketplaceCategory("language") },
  { label: "คณิตศาสตร์", href: routes.marketplaceCategory("mathematics") },
  { label: "วิทยาศาสตร์", href: routes.marketplaceCategory("science") },
  { label: "Test Prep", href: routes.marketplaceCategory("test-prep") },
] as const;

const heroSearchPreviewResults: SearchSuggestion[] = [
  {
    id: "hero-search-preview-1",
    title: "English Vocabulary Flashcards — 500 Essential Words",
    slug: "english-vocabulary-flashcards-500-essential-words",
    previewUrl: BONES_PREVIEW_IMAGE,
    price: 100,
    isFree: false,
    category: { name: "Language" },
    author: { name: "Kru Craft" },
    matchReason: "Popular this week",
  },
  {
    id: "hero-search-preview-2",
    title: "Middle School Science Quiz & Assessment Set",
    slug: "middle-school-science-quiz-assessment-set",
    previewUrl: BONES_PREVIEW_IMAGE,
    price: 2000,
    isFree: false,
    category: { name: "Science" },
    author: { name: "Kru Craft" },
    matchReason: "Strong title match",
  },
  {
    id: "hero-search-preview-3",
    title: "Primary Science Experiment Activity Cards",
    slug: "primary-science-experiment-activity-cards",
    previewUrl: BONES_PREVIEW_IMAGE,
    price: 0,
    isFree: true,
    category: { name: "Science" },
    author: { name: "Kru Craft" },
    matchReason: "Free resource",
  },
];

const heroSearchPreviewRecovery: SearchRecoveryData = {
  suggestedQueries: ["worksheet", "science quiz", "flashcards"],
  categoryMatches: [
    { name: "Language", slug: "language", resourceCount: 42 },
    { name: "Science", slug: "science", resourceCount: 35 },
  ],
  tagMatches: [
    { name: "vocabulary", slug: "vocabulary", resourceCount: 18 },
    { name: "quiz", slug: "quiz", resourceCount: 12 },
  ],
};

function PreviewDropdownShell({ children }: { children: ReactNode }) {
  return (
    <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-popover shadow-2xl shadow-slate-900/8">
      {children}
    </div>
  );
}

function PreviewSuggestionChips({
  suggestions,
}: {
  suggestions: string[];
}) {
  return (
    <div className="space-y-2">
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
        Try these searches
      </p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

function PreviewTaxonomyBrowse({
  recovery,
}: {
  recovery: SearchRecoveryData;
}) {
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Browse categories
        </p>
        <div className="flex flex-wrap gap-2">
          {recovery.categoryMatches.map((match) => (
            <button
              key={`category-${match.slug}`}
              type="button"
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition"
            >
              {match.name}
            </button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Related tags
        </p>
        <div className="flex flex-wrap gap-2">
          {recovery.tagMatches.map((match) => (
            <button
              key={`tag-${match.slug}`}
              type="button"
              className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition"
            >
              #{match.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function HeroSearchPreviewShell({
  children,
  value,
}: {
  children: ReactNode;
  value?: string;
}) {
  return (
    <div className="relative w-full max-w-5xl">
      <SearchInput
        value={value ?? ""}
        readOnly
        aria-label="Search resources preview"
        placeholder="ค้นหาใบงาน แฟลชการ์ด โน้ต..."
      />
      {children}
    </div>
  );
}

function HeroSearchQuickBrowsePreview() {
  return (
    <HeroSearchPreviewShell>
      <PreviewDropdownShell>
        <div className="space-y-5 px-4 py-4">
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              ค้นหาล่าสุด
            </p>
            <div className="flex flex-wrap gap-2">
              {["worksheet", "flashcards", "science quiz"].map((query) => (
                <button
                  key={query}
                  type="button"
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              ลัดไปที่
            </p>
            <div className="grid gap-2 sm:grid-cols-3">
              {QUICK_BROWSE_LINKS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  className="flex items-center gap-2 rounded-2xl border border-border bg-muted px-3 py-3 text-left text-sm font-medium text-foreground transition"
                >
                  <Icon className="h-4 w-4 shrink-0 text-brand-600" />
                  <span>{label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              เลือกดูตามหมวด
            </p>
            <div className="flex flex-wrap gap-2">
              {QUICK_BROWSE_CATEGORIES.map(({ label }) => (
                <button
                  key={label}
                  type="button"
                  className="inline-flex items-center rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </PreviewDropdownShell>
    </HeroSearchPreviewShell>
  );
}

function HeroSearchResultsPreview() {
  return (
    <HeroSearchPreviewShell value="flashcards">
      <PreviewDropdownShell>
        <div className="border-b border-border/70 px-4 py-2.5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Top matches
          </p>
        </div>

        {heroSearchPreviewResults.map((result, index) => {
          const meta = [
            result.category?.name ?? null,
            result.author?.name ?? null,
            result.matchReason ?? null,
          ]
            .filter(Boolean)
            .slice(0, 2)
            .join(" • ");

          return (
            <button
              key={result.id}
              type="button"
              className={cn(
                "flex w-full items-center gap-3 px-4 py-3 text-left transition",
                index === 0 ? "bg-muted" : "hover:bg-muted",
              )}
            >
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50">
                <RevealImage
                  src={result.previewUrl ?? BONES_PREVIEW_IMAGE}
                  alt={result.title}
                  fill
                  sizes="44px"
                  unoptimized
                  overlayClassName="rounded-xl bg-muted"
                  className="rounded-xl object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">
                  {result.title}
                </p>
                <p className="mt-0.5 truncate text-xs text-muted-foreground">{meta}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-semibold text-foreground">
                  {result.isFree
                    ? "ฟรี"
                    : new Intl.NumberFormat("th-TH", {
                        style: "currency",
                        currency: "THB",
                        maximumFractionDigits: 0,
                      }).format(result.price / 100)}
                </p>
                <p className="mt-0.5 text-[11px] text-muted-foreground">
                  เปิดรายละเอียด
                </p>
              </div>
            </button>
          );
        })}

        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 border-t border-border/70 px-4 py-3 text-sm font-semibold text-brand-700 transition"
        >
          <Search className="h-4 w-4" />
          ดูผลลัพธ์ทั้งหมดสำหรับ “flashcards”
        </button>
      </PreviewDropdownShell>
    </HeroSearchPreviewShell>
  );
}

function HeroSearchEmptyPreview() {
  return (
    <HeroSearchPreviewShell value="zzzznotfound123">
      <PreviewDropdownShell>
        <div className="space-y-4 px-4 py-4">
          <div className="text-center">
            <p className="text-sm font-medium text-foreground">
              ยังไม่พบผลลัพธ์ที่ตรงกับ “zzzznotfound123”
            </p>
            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              ลองใช้คำที่กว้างขึ้น หรือข้ามไปดูหมวดที่ใกล้เคียงแทน
            </p>
          </div>

          <PreviewSuggestionChips
            suggestions={heroSearchPreviewRecovery.suggestedQueries}
          />
          <PreviewTaxonomyBrowse recovery={heroSearchPreviewRecovery} />
        </div>
        <button
          type="button"
          className="flex w-full items-center justify-center gap-2 border-t border-border/70 px-4 py-3 text-sm font-semibold text-brand-700 transition"
        >
          <Search className="h-4 w-4" />
          ดูผลลัพธ์ทั้งหมด
        </button>
      </PreviewDropdownShell>
    </HeroSearchPreviewShell>
  );
}

export function HeroSearchQuickBrowseBonesPreview() {
  return (
    <Skeleton
      name={HERO_SEARCH_QUICK_BROWSE_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <HeroSearchQuickBrowsePreview />
    </Skeleton>
  );
}

export function HeroSearchResultsBonesPreview() {
  return (
    <Skeleton
      name={HERO_SEARCH_RESULTS_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <HeroSearchResultsPreview />
    </Skeleton>
  );
}

export function HeroSearchEmptyBonesPreview() {
  return (
    <Skeleton
      name={HERO_SEARCH_EMPTY_NAME}
      loading={false}
      className="h-full w-full"
      darkColor="rgba(255,255,255,0.07)"
    >
      <HeroSearchEmptyPreview />
    </Skeleton>
  );
}
