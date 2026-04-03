import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { buttonVariants, colorScales } from "@/design-system";
import { LoadingSkeleton } from "@/components/shared/LoadingSkeleton";
import { shouldBypassImageOptimizer } from "@/lib/imageDelivery";
import { routes } from "@/lib/routes";
import { cn } from "@/lib/utils";
import {
  normalizeHeroStyle,
  type HeroPrimaryCtaColor,
  type HeroPrimaryCtaVariant,
  type HeroSecondaryCtaColor,
  type HeroSecondaryCtaVariant,
  type HeroStyleFields,
} from "@/lib/heroes/hero-style";

export type HeroSurfaceConfig = HeroStyleFields & {
  heroId?: string | null;
  source?: "cms" | "fallback";
  experimentId?: string | null;
  variant?: string | null;
  title: string;
  subtitle: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string | null;
  secondaryCtaLink: string | null;
  badgeText: string | null;
  imageUrl: string | null;
  mediaUrl: string | null;
  mediaType: string | null;
};

export type HeroCtaRenderProps = {
  href: string;
  label: string;
  className: string;
  kind: "primary" | "secondary";
};

function hexToRgbString(hex: string) {
  const normalized = hex.replace("#", "");
  const expanded =
    normalized.length === 3
      ? normalized
          .split("")
          .map((part) => `${part}${part}`)
          .join("")
      : normalized;

  const int = Number.parseInt(expanded, 16);
  const r = (int >> 16) & 255;
  const g = (int >> 8) & 255;
  const b = int & 255;

  return `${r}, ${g}, ${b}`;
}

function withAlpha(hex: string, alpha: number) {
  return `rgba(${hexToRgbString(hex)}, ${alpha})`;
}

const DEFAULT_HERO: HeroSurfaceConfig = {
  title: "All your\nstudy resources,\nin one place",
  subtitle:
    "Browse worksheets, flashcards, and lesson packs from educators and creators without getting lost in the full library.",
  primaryCtaText: "Browse resources",
  primaryCtaLink: routes.marketplaceCategory("all"),
  secondaryCtaText: "Become a creator",
  secondaryCtaLink: routes.membership,
  badgeText: "KruCraft marketplace",
  imageUrl: null,
  mediaUrl: null,
  mediaType: null,
  textAlign: "left",
  contentWidth: "wide",
  heroHeight: "compact",
  spacingPreset: "normal",
  headingFont: "display",
  bodyFont: "body",
  titleSize: "display",
  subtitleSize: "md",
  titleWeight: "bold",
  subtitleWeight: "normal",
  mobileTitleSize: "md",
  mobileSubtitleSize: "inherit",
  titleColor: "primary",
  subtitleColor: "surface",
  badgeTextColor: "surface",
  badgeBgColor: "transparent",
  primaryCtaVariant: "primary",
  secondaryCtaVariant: "ghost",
  primaryCtaColor: "primary",
  secondaryCtaColor: "background",
  overlayColor: "surface-strong",
  overlayOpacity: 16,
};

const HERO_HEIGHT_CLASS = {
  compact: "min-h-[460px] lg:min-h-[430px]",
  default: "min-h-[520px] lg:min-h-[490px]",
  tall: "min-h-[620px] lg:min-h-[580px]",
} as const;

const HERO_CONTENT_WIDTH_CLASS = {
  narrow: "max-w-[28rem]",
  normal: "max-w-[34rem]",
  wide: "max-w-[38rem]",
} as const;

const HERO_STACK_GAP_CLASS = {
  tight: "gap-4",
  normal: "gap-6",
  relaxed: "gap-8",
} as const;

const HERO_ALIGNMENT_CLASS = {
  left: {
    copy: "items-start text-left",
    chips: "justify-start",
  },
  center: {
    copy: "items-center text-center",
    chips: "justify-center",
  },
} as const;

const HERO_HEADING_FONT_CLASS = {
  display: "font-display",
  sans: "font-sans",
} as const;

const HERO_BODY_FONT_CLASS = {
  body: "font-body",
  sans: "font-sans",
} as const;

const HERO_TITLE_RESPONSIVE_CLASS = {
  md: {
    mobile: "text-3xl",
    desktop: "sm:text-4xl lg:text-5xl",
  },
  lg: {
    mobile: "text-4xl",
    desktop: "sm:text-5xl lg:text-6xl",
  },
  xl: {
    mobile: "text-4xl",
    desktop: "sm:text-5xl lg:text-[4rem]",
  },
  display: {
    mobile: "text-5xl",
    desktop: "sm:text-6xl lg:text-[4.5rem]",
  },
} as const;

const HERO_MOBILE_TITLE_CLASS = {
  sm: "text-3xl",
  md: "text-4xl",
  lg: "text-5xl",
} as const;

const HERO_SUBTITLE_RESPONSIVE_CLASS = {
  sm: {
    mobile: "text-sm",
    desktop: "sm:text-[15px] lg:text-base",
  },
  md: {
    mobile: "text-base",
    desktop: "sm:text-lg lg:text-xl",
  },
  lg: {
    mobile: "text-lg",
    desktop: "sm:text-xl lg:text-2xl",
  },
} as const;

const HERO_MOBILE_SUBTITLE_CLASS = {
  sm: "text-sm",
  md: "text-base",
} as const;

const HERO_TITLE_WEIGHT_CLASS = {
  semibold: "font-semibold",
  bold: "font-bold",
} as const;

const HERO_SUBTITLE_WEIGHT_CLASS = {
  normal: "font-normal",
  medium: "font-medium",
} as const;

const HERO_TITLE_COLOR_CLASS = {
  background: "text-white",
  surface: "text-surface-100",
  primary: "text-primary-400",
  "text-secondary": "text-text-secondary",
  "text-primary": "text-text-primary",
} as const;

const HERO_SUBTITLE_COLOR_CLASS = {
  surface: "text-surface-100",
  border: "text-surface-200",
  "text-secondary": "text-text-secondary",
  "text-primary": "text-text-primary",
} as const;

const HERO_BADGE_TEXT_COLOR_CLASS = {
  background: "text-white",
  surface: "text-surface-100",
  "text-primary": "text-text-primary",
  primary: "text-primary-700",
  info: "text-info-600",
} as const;

const HERO_BADGE_BG_CLASS = {
  transparent: "bg-transparent px-0 py-0",
  background: "border border-surface-200 bg-white px-3 py-1.5",
  surface: "border border-surface-200 bg-surface-100 px-3 py-1.5",
  primary: "border border-primary-200 bg-primary-50 px-3 py-1.5",
  info: "border border-info-100 bg-info-50 px-3 py-1.5",
} as const;

const HERO_OVERLAY_HEX = {
  transparent: null,
  surface: colorScales.surface[900],
  "surface-strong": colorScales.surface[950],
  primary: colorScales.primary[900],
} as const;

const HERO_PRIMARY_CTA_COLOR_CLASS = {
  primary: {
    filled:
      "border-primary-600 bg-primary-600 text-white hover:border-primary-700 hover:bg-primary-700 active:bg-primary-800 focus-visible:ring-primary-500/50",
    soft:
      "border-primary-200 bg-primary-50 text-primary-700 hover:bg-primary-100 hover:text-primary-800 focus-visible:ring-primary-500/30",
    vivid:
      "border-primary-500 bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus-visible:ring-primary-500/40",
    dark:
      "border-primary-700 bg-primary-700 text-white hover:bg-primary-800 active:bg-primary-900 focus-visible:ring-primary-600/40",
  },
  info: {
    filled:
      "border-info-600 bg-info-600 text-white hover:border-info-700 hover:bg-info-700 active:bg-info-700 focus-visible:ring-info-500/50",
    soft:
      "border-info-100 bg-info-50 text-info-700 hover:bg-info-100 hover:text-info-700 focus-visible:ring-info-500/30",
    vivid:
      "border-info-500 bg-info-500 text-white hover:bg-info-600 active:bg-info-700 focus-visible:ring-info-500/40",
    dark:
      "border-info-700 bg-info-700 text-white hover:bg-info-700 active:bg-info-700 focus-visible:ring-info-600/40",
  },
  dark: {
    filled:
      "border-surface-950 bg-surface-950 text-white hover:border-surface-800 hover:bg-surface-900 active:bg-surface-950 focus-visible:ring-surface-700/50",
    soft:
      "border-surface-200 bg-surface-100 text-text-primary hover:bg-surface-200 hover:text-text-primary focus-visible:ring-surface-400/30",
    vivid:
      "border-surface-800 bg-surface-800 text-white hover:bg-surface-900 active:bg-surface-950 focus-visible:ring-surface-700/40",
    dark:
      "border-surface-950 bg-surface-950 text-white hover:bg-surface-900 active:bg-surface-950 focus-visible:ring-surface-700/40",
  },
} as const;

const HERO_SECONDARY_CTA_COLOR_CLASS = {
  background: {
    filled:
      "border-surface-200 bg-white text-text-primary hover:bg-surface-50 hover:text-text-primary focus-visible:ring-surface-400/40",
    outline:
      "border-surface-200/70 bg-transparent text-white hover:bg-surface-50/10 hover:text-white focus-visible:ring-surface-400/40",
    ghost:
      "border-transparent bg-transparent text-white hover:bg-surface-50/10 hover:text-white focus-visible:ring-surface-400/30",
  },
  neutral: {
    filled:
      "border-surface-200 bg-surface-100 text-text-primary hover:bg-surface-200 hover:text-text-primary focus-visible:ring-surface-400/30",
    outline:
      "border-surface-300 bg-white text-text-primary hover:bg-surface-50 hover:text-text-primary focus-visible:ring-surface-400/30",
    ghost:
      "border-transparent bg-transparent text-text-primary hover:bg-surface-100 hover:text-text-primary focus-visible:ring-surface-400/25",
  },
  dark: {
    filled:
      "border-surface-950 bg-surface-950 text-white hover:bg-surface-900 hover:text-white focus-visible:ring-surface-700/40",
    outline:
      "border-surface-900/20 bg-transparent text-text-primary hover:bg-surface-900/5 hover:text-text-primary focus-visible:ring-surface-700/30",
    ghost:
      "border-transparent bg-transparent text-text-primary hover:bg-surface-900/5 hover:text-text-primary focus-visible:ring-surface-700/20",
  },
} as const;

const HERO_SUPPORTING_CALLOUTS = [
  "Worksheets, flashcards, and lesson packs",
  "Free and paid resources",
  "Instant access after purchase",
] as const;

const HERO_TOPIC_PILLS = ["Worksheets", "Flashcards", "Lesson packs"] as const;

function normalizeOptionalString(value: string | null | undefined) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function getOverlayStyle(
  overlayColor: keyof typeof HERO_OVERLAY_HEX,
  overlayOpacity: number,
): CSSProperties {
  if (overlayColor === "transparent" || overlayOpacity <= 0) {
    return {
      background:
        `linear-gradient(110deg, ${withAlpha(colorScales.surface[900], 0.28)} 0%, ${withAlpha(colorScales.surface[900], 0)} 55%)`,
    };
  }

  const alpha = overlayOpacity / 100;
  const hex = HERO_OVERLAY_HEX[overlayColor];

  return {
    background: `linear-gradient(110deg, ${withAlpha(hex!, Math.max(alpha, 0.22))} 0%, ${withAlpha(hex!, Math.max(alpha * 0.58, 0.08))} 48%, ${withAlpha(hex!, 0)} 88%)`,
  };
}

function resolveActionCardSecondaryColor(color: HeroSecondaryCtaColor) {
  return color;
}

function getHeroCtaClassName(
  variant: HeroPrimaryCtaVariant | HeroSecondaryCtaVariant,
  color: HeroPrimaryCtaColor | HeroSecondaryCtaColor,
  kind: "primary" | "secondary",
) {
  const baseVariant = buttonVariants({
    variant:
      kind === "primary"
        ? variant === "secondary"
          ? "secondary"
          : "primary"
        : variant === "ghost"
          ? "ghost"
          : variant === "outline"
            ? "outline"
            : "secondary",
    size: "lg",
  });

  const resolvedSecondaryColor =
    kind === "secondary"
      ? resolveActionCardSecondaryColor(color as HeroSecondaryCtaColor)
      : null;

  const toneClassName =
    kind === "primary"
      ? variant === "secondary"
        ? HERO_PRIMARY_CTA_COLOR_CLASS[color as HeroPrimaryCtaColor].soft
        : variant === "accent"
          ? HERO_PRIMARY_CTA_COLOR_CLASS[color as HeroPrimaryCtaColor].vivid
          : variant === "dark"
            ? HERO_PRIMARY_CTA_COLOR_CLASS[color as HeroPrimaryCtaColor].dark
            : HERO_PRIMARY_CTA_COLOR_CLASS[color as HeroPrimaryCtaColor].filled
      : variant === "outline"
        ? HERO_SECONDARY_CTA_COLOR_CLASS[resolvedSecondaryColor!].outline
        : variant === "ghost"
          ? HERO_SECONDARY_CTA_COLOR_CLASS[resolvedSecondaryColor!].ghost
          : HERO_SECONDARY_CTA_COLOR_CLASS[resolvedSecondaryColor!].filled;

  return cn(
    baseVariant,
    "justify-center rounded-full px-5 text-sm sm:min-w-[11rem]",
    toneClassName,
  );
}

function HeroCta({
  render,
  href,
  label,
  className,
  kind,
}: {
  render?: (props: HeroCtaRenderProps) => ReactNode;
  href: string;
  label: string;
  className: string;
  kind: "primary" | "secondary";
}) {
  if (render) {
    return render({ href, label, className, kind });
  }

  return (
    <Link href={href} className={className}>
      {label}
    </Link>
  );
}

function HeroMedia({
  src,
  isGif,
  bypassOptimizer,
}: {
  src: string | null;
  isGif: boolean;
  bypassOptimizer: boolean;
}) {
  if (!src) {
    return (
      <div
        className="absolute inset-0"
        style={{
          background: [
            `radial-gradient(circle at top left, ${withAlpha(colorScales.surface[50], 0.14)}, transparent 32%)`,
            `radial-gradient(circle at 70% 20%, ${withAlpha(colorScales.primary[400], 0.22)}, transparent 24%)`,
            `linear-gradient(155deg, ${withAlpha(colorScales.surface[50], 0.08)}, ${withAlpha(colorScales.surface[50], 0.02)})`,
          ].join(", "),
        }}
      />
    );
  }

  if (!isGif && !bypassOptimizer) {
    return (
      <Image
        src={src}
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="(min-width: 1024px) 38vw, 100vw"
        className="object-cover object-center"
        aria-hidden
      />
    );
  }

  return (
    <img
      src={src}
      alt=""
      fetchPriority="high"
      loading="eager"
      decoding="async"
      className="absolute inset-0 h-full w-full object-cover object-center"
      aria-hidden
    />
  );
}

export function HeroSurface({
  config,
  renderPrimaryCta,
  renderSecondaryCta,
  className,
}: {
  config?: HeroSurfaceConfig | null;
  renderPrimaryCta?: (props: HeroCtaRenderProps) => ReactNode;
  renderSecondaryCta?: (props: HeroCtaRenderProps) => ReactNode;
  className?: string;
}) {
  const hero = config ?? DEFAULT_HERO;
  const mergedHero = { ...DEFAULT_HERO, ...hero };
  const style = normalizeHeroStyle(mergedHero);
  const title = mergedHero.title || DEFAULT_HERO.title;
  const subtitle = mergedHero.subtitle || DEFAULT_HERO.subtitle;
  const primaryCtaText = mergedHero.primaryCtaText || DEFAULT_HERO.primaryCtaText;
  const primaryCtaLink = mergedHero.primaryCtaLink || DEFAULT_HERO.primaryCtaLink;
  const secondaryCtaText =
    normalizeOptionalString(mergedHero.secondaryCtaText) ??
    DEFAULT_HERO.secondaryCtaText;
  const secondaryCtaLink =
    normalizeOptionalString(mergedHero.secondaryCtaLink) ??
    DEFAULT_HERO.secondaryCtaLink;
  const badgeText = normalizeOptionalString(mergedHero.badgeText) ?? DEFAULT_HERO.badgeText;
  const mediaUrl = normalizeOptionalString(mergedHero.mediaUrl);
  const imageUrl = normalizeOptionalString(mergedHero.imageUrl);
  const heroMediaSrc = mediaUrl || imageUrl;
  const isGif = mergedHero.mediaType === "gif";
  const bypassHeroOptimizer = heroMediaSrc
    ? shouldBypassImageOptimizer(heroMediaSrc)
    : false;
  const alignment = HERO_ALIGNMENT_CLASS[style.textAlign];
  const titleSize = HERO_TITLE_RESPONSIVE_CLASS[style.titleSize];
  const subtitleSize = HERO_SUBTITLE_RESPONSIVE_CLASS[style.subtitleSize];
  const titleMobileOverride =
    style.mobileTitleSize === "inherit"
      ? null
      : HERO_MOBILE_TITLE_CLASS[style.mobileTitleSize];
  const subtitleMobileOverride =
    style.mobileSubtitleSize === "inherit"
      ? null
      : HERO_MOBILE_SUBTITLE_CLASS[style.mobileSubtitleSize];
  const useLightCopySurface =
    style.titleColor === "text-secondary" ||
    style.titleColor === "text-primary" ||
    style.subtitleColor === "text-secondary" ||
    style.subtitleColor === "text-primary";

  return (
    <div
      data-hero-surface="discover"
      className={cn(
        "w-full overflow-hidden rounded-[32px] border border-surface-200/80 bg-surface-950",
        HERO_HEIGHT_CLASS[style.heroHeight],
        className,
      )}
    >
      <section className="relative isolate overflow-hidden px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-surface-950" />

        <div className="relative z-10 grid h-full gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_240px] lg:items-center">
          <div
            className={cn(
              "flex min-w-0 flex-col self-center",
              HERO_STACK_GAP_CLASS[style.spacingPreset],
              HERO_CONTENT_WIDTH_CLASS[style.contentWidth],
              alignment.copy,
              useLightCopySurface &&
                "rounded-[28px] border border-surface-200 bg-white/88 p-5 backdrop-blur-sm",
            )}
          >
            {badgeText ? (
              <span
                className={cn(
                  "inline-flex items-center rounded-full text-xs font-semibold",
                  HERO_BADGE_TEXT_COLOR_CLASS[style.badgeTextColor],
                  HERO_BADGE_BG_CLASS[style.badgeBgColor],
                )}
              >
                {badgeText}
              </span>
            ) : null}

            <div className="space-y-4">
              <h1
                className={cn(
                  "whitespace-pre-line leading-[0.96] text-balance",
                  HERO_HEADING_FONT_CLASS[style.headingFont],
                  HERO_TITLE_WEIGHT_CLASS[style.titleWeight],
                  HERO_TITLE_COLOR_CLASS[style.titleColor],
                  titleMobileOverride ?? titleSize.mobile,
                  titleSize.desktop,
                )}
              >
                {title}
              </h1>

              <p
                className={cn(
                  "max-w-[38rem] text-pretty leading-7",
                  HERO_BODY_FONT_CLASS[style.bodyFont],
                  HERO_SUBTITLE_WEIGHT_CLASS[style.subtitleWeight],
                  HERO_SUBTITLE_COLOR_CLASS[style.subtitleColor],
                  subtitleMobileOverride ?? subtitleSize.mobile,
                  subtitleSize.desktop,
                )}
              >
                {subtitle}
              </p>
            </div>

            <div className={cn("flex flex-wrap gap-2.5 pt-1", alignment.chips)}>
              {HERO_TOPIC_PILLS.map((pill) => (
                <span
                  key={pill}
                  className="rounded-full border border-surface-100/20 bg-surface-50/10 px-3 py-1 text-xs font-medium text-surface-100 backdrop-blur-sm"
                >
                  {pill}
                </span>
              ))}
            </div>

            <div className={cn("flex flex-wrap gap-3 pt-2", alignment.chips)}>
              <HeroCta
                render={renderPrimaryCta}
                href={primaryCtaLink}
                label={primaryCtaText}
                className={getHeroCtaClassName(
                  style.primaryCtaVariant,
                  style.primaryCtaColor,
                  "primary",
                )}
                kind="primary"
              />
              {secondaryCtaText && secondaryCtaLink ? (
                <HeroCta
                  render={renderSecondaryCta}
                  href={secondaryCtaLink}
                  label={secondaryCtaText}
                  className={getHeroCtaClassName(
                    style.secondaryCtaVariant,
                    style.secondaryCtaColor,
                    "secondary",
                  )}
                  kind="secondary"
                />
              ) : null}
            </div>

            <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
              {HERO_SUPPORTING_CALLOUTS.map((callout) => (
                <span
                  key={callout}
                  className="inline-flex items-center gap-2 text-sm text-surface-200/85"
                >
                  <span className="size-1.5 rounded-full bg-primary-400" aria-hidden />
                  {callout}
                </span>
              ))}
            </div>
          </div>

          <div className="relative lg:min-w-0">
            <div className="relative overflow-hidden rounded-[28px] border border-surface-100/12 bg-surface-900">
              <div className="absolute inset-y-0 left-6 hidden w-20 -skew-x-12 bg-primary-400 lg:block" />
              <div className="absolute left-24 top-8 hidden size-20 rounded-full border border-primary-400/30 bg-primary-500/10 lg:block" />
              <div className="relative aspect-[16/11] min-h-[260px]">
                  <HeroMedia
                    src={heroMediaSrc}
                    isGif={isGif}
                    bypassOptimizer={bypassHeroOptimizer}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={getOverlayStyle(style.overlayColor, style.overlayOpacity)}
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{
                      background: `linear-gradient(180deg, ${withAlpha(colorScales.surface[50], 0.06)}, ${withAlpha(colorScales.surface[50], 0)})`,
                    }}
                  />
                  <div className="pointer-events-none absolute left-4 top-4">
                    <span className="inline-flex rounded-full border border-surface-100/18 bg-surface-950/70 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-surface-200/85">
                      Browse faster
                    </span>
                  </div>
                  <div className="pointer-events-none absolute inset-x-4 bottom-4">
                    <div className="max-w-[18rem] rounded-[20px] border border-surface-100/14 bg-surface-950/72 px-4 py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-surface-200/70">
                        Creator-made and classroom-ready
                      </p>
                      <p className="mt-2 text-sm leading-6 text-surface-50/90">
                        Discover practical packs faster, then scan the rest of the catalog when you want more depth.
                      </p>
                    </div>
                  </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-surface-200 bg-white p-5 text-left">
            <p className="text-[11px] text-text-secondary">From</p>
            <div className="mt-1 flex items-end gap-1">
              <span className="text-3xl font-semibold tracking-tight text-text-primary">
                THB 0
              </span>
              <span className="pb-1 text-sm text-text-secondary">/resource</span>
            </div>
            <div className="mt-4 space-y-3 border-t border-surface-200 pt-4">
              {HERO_SUPPORTING_CALLOUTS.map((callout) => (
                <div key={callout} className="flex items-start gap-2.5">
                  <span
                    className="mt-1 size-1.5 shrink-0 rounded-full bg-primary-400"
                    aria-hidden
                  />
                  <p className="text-sm leading-6 text-text-primary">{callout}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3">
              <p className="text-xs font-medium text-text-secondary">
                Best for quick discovery
              </p>
              <p className="mt-1 text-sm leading-6 text-text-primary">
                Start with top picks and free resources, then narrow down by subject below.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export function HeroSurfaceSkeleton({
  config,
  className,
}: {
  config?: HeroSurfaceConfig | null;
  className?: string;
}) {
  const style = normalizeHeroStyle({ ...DEFAULT_HERO, ...(config ?? {}) });

  return (
    <div
      className={cn(
        "w-full overflow-hidden rounded-[32px] border border-surface-200/80 bg-surface-950",
        HERO_HEIGHT_CLASS[style.heroHeight],
        className,
      )}
    >
      <section className="relative overflow-hidden px-6 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
        <div className="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-800 to-surface-950" />
        <div className="relative z-10 grid h-full gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)_240px] lg:items-center">
          <div className="flex max-w-[38rem] flex-col gap-6">
            <LoadingSkeleton className="h-4 w-40 bg-surface-50/45" />
            <div className="space-y-3">
              <LoadingSkeleton className="h-16 w-full max-w-[32rem] rounded-[24px] bg-primary-300/80" />
              <LoadingSkeleton className="h-16 w-4/5 rounded-[24px] bg-primary-200/65" />
            </div>
            <div className="space-y-2">
              <LoadingSkeleton className="h-5 w-full max-w-[32rem] bg-surface-50/70" />
              <LoadingSkeleton className="h-5 w-4/5 max-w-[28rem] bg-surface-100/60" />
            </div>
            <div className="flex flex-wrap gap-2.5">
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingSkeleton
                  key={index}
                  className="h-8 w-28 rounded-full bg-surface-50/25"
                />
              ))}
            </div>
            <div className="flex flex-wrap gap-3">
              <LoadingSkeleton className="h-12 w-40 rounded-full bg-primary-300/85" />
              <LoadingSkeleton className="h-12 w-36 rounded-full bg-surface-50/18" />
            </div>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              {Array.from({ length: 3 }).map((_, index) => (
                <LoadingSkeleton
                  key={index}
                  className="h-4 w-52 bg-surface-100/28"
                />
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="overflow-hidden rounded-[28px] border border-surface-100/12 bg-surface-900">
              <div className="relative aspect-[16/11] min-h-[260px]">
                <LoadingSkeleton className="h-full w-full rounded-none bg-surface-50/14" />
                <div className="absolute left-4 top-4">
                  <LoadingSkeleton className="h-7 w-28 rounded-full bg-surface-50/24" />
                </div>
                <div className="absolute inset-x-4 bottom-4">
                  <div className="max-w-[18rem] rounded-[20px] border border-surface-100/14 bg-surface-950/72 px-4 py-3">
                    <LoadingSkeleton className="h-3 w-32 bg-surface-100/26" />
                    <LoadingSkeleton className="mt-3 h-4 w-full bg-surface-50/18" />
                    <LoadingSkeleton className="mt-2 h-4 w-4/5 bg-surface-50/14" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[24px] border border-surface-200 bg-white p-5">
            <LoadingSkeleton className="h-3 w-10 bg-surface-200" />
            <LoadingSkeleton className="mt-3 h-9 w-24 bg-surface-200" />
            <div className="mt-5 space-y-3 border-t border-surface-200 pt-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index} className="flex items-start gap-2.5">
                  <LoadingSkeleton className="mt-1 size-1.5 rounded-full bg-primary-300" />
                  <LoadingSkeleton className="h-4 w-full bg-surface-200" />
                </div>
              ))}
            </div>
            <div className="mt-5 rounded-2xl border border-surface-200 bg-surface-50 px-4 py-3">
              <LoadingSkeleton className="h-3 w-32 bg-surface-200" />
              <LoadingSkeleton className="mt-3 h-4 w-full bg-surface-200" />
              <LoadingSkeleton className="mt-2 h-4 w-4/5 bg-surface-200" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
