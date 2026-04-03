export const HERO_TEXT_ALIGN_VALUES = ["left", "center"] as const;
export type HeroTextAlign = (typeof HERO_TEXT_ALIGN_VALUES)[number];

export const HERO_CONTENT_WIDTH_VALUES = [
  "narrow",
  "normal",
  "wide",
] as const;
export type HeroContentWidth = (typeof HERO_CONTENT_WIDTH_VALUES)[number];

export const HERO_HEIGHT_VALUES = ["compact", "default", "tall"] as const;
export type HeroHeight = (typeof HERO_HEIGHT_VALUES)[number];

export const HERO_SPACING_VALUES = ["tight", "normal", "relaxed"] as const;
export type HeroSpacingPreset = (typeof HERO_SPACING_VALUES)[number];

export const HERO_HEADING_FONT_VALUES = ["display", "sans"] as const;
export type HeroHeadingFont = (typeof HERO_HEADING_FONT_VALUES)[number];

export const HERO_BODY_FONT_VALUES = ["body", "sans"] as const;
export type HeroBodyFont = (typeof HERO_BODY_FONT_VALUES)[number];

export const HERO_TITLE_SIZE_VALUES = [
  "md",
  "lg",
  "xl",
  "display",
] as const;
export type HeroTitleSize = (typeof HERO_TITLE_SIZE_VALUES)[number];

export const HERO_SUBTITLE_SIZE_VALUES = ["sm", "md", "lg"] as const;
export type HeroSubtitleSize = (typeof HERO_SUBTITLE_SIZE_VALUES)[number];

export const HERO_TITLE_WEIGHT_VALUES = ["semibold", "bold"] as const;
export type HeroTitleWeight = (typeof HERO_TITLE_WEIGHT_VALUES)[number];

export const HERO_SUBTITLE_WEIGHT_VALUES = ["normal", "medium"] as const;
export type HeroSubtitleWeight =
  (typeof HERO_SUBTITLE_WEIGHT_VALUES)[number];

export const HERO_MOBILE_TITLE_SIZE_VALUES = [
  "inherit",
  "sm",
  "md",
  "lg",
] as const;
export type HeroMobileTitleSize =
  (typeof HERO_MOBILE_TITLE_SIZE_VALUES)[number];

export const HERO_MOBILE_SUBTITLE_SIZE_VALUES = [
  "inherit",
  "sm",
  "md",
] as const;
export type HeroMobileSubtitleSize =
  (typeof HERO_MOBILE_SUBTITLE_SIZE_VALUES)[number];

export const HERO_TITLE_COLOR_VALUES = [
  "background",
  "surface",
  "primary",
  "text-secondary",
  "text-primary",
] as const;
export type HeroTitleColor = (typeof HERO_TITLE_COLOR_VALUES)[number];

export const HERO_SUBTITLE_COLOR_VALUES = [
  "surface",
  "border",
  "text-secondary",
  "text-primary",
] as const;
export type HeroSubtitleColor = (typeof HERO_SUBTITLE_COLOR_VALUES)[number];

export const HERO_BADGE_TEXT_COLOR_VALUES = [
  "background",
  "surface",
  "text-primary",
  "primary",
  "info",
] as const;
export type HeroBadgeTextColor =
  (typeof HERO_BADGE_TEXT_COLOR_VALUES)[number];

export const HERO_BADGE_BG_COLOR_VALUES = [
  "transparent",
  "background",
  "surface",
  "primary",
  "info",
] as const;
export type HeroBadgeBgColor = (typeof HERO_BADGE_BG_COLOR_VALUES)[number];

export const HERO_PRIMARY_CTA_VARIANT_VALUES = [
  "primary",
  "secondary",
  "dark",
  "accent",
] as const;
export type HeroPrimaryCtaVariant =
  (typeof HERO_PRIMARY_CTA_VARIANT_VALUES)[number];

export const HERO_SECONDARY_CTA_VARIANT_VALUES = [
  "secondary",
  "ghost",
  "outline",
] as const;
export type HeroSecondaryCtaVariant =
  (typeof HERO_SECONDARY_CTA_VARIANT_VALUES)[number];

export const HERO_PRIMARY_CTA_COLOR_VALUES = [
  "primary",
  "info",
  "dark",
] as const;
export type HeroPrimaryCtaColor =
  (typeof HERO_PRIMARY_CTA_COLOR_VALUES)[number];

export const HERO_SECONDARY_CTA_COLOR_VALUES = [
  "background",
  "neutral",
  "dark",
] as const;
export type HeroSecondaryCtaColor =
  (typeof HERO_SECONDARY_CTA_COLOR_VALUES)[number];

export const HERO_OVERLAY_COLOR_VALUES = [
  "transparent",
  "surface",
  "surface-strong",
  "primary",
] as const;
export type HeroOverlayColor = (typeof HERO_OVERLAY_COLOR_VALUES)[number];

export type HeroStyleFields = {
  textAlign?: HeroTextAlign | null;
  contentWidth?: HeroContentWidth | null;
  heroHeight?: HeroHeight | null;
  spacingPreset?: HeroSpacingPreset | null;
  headingFont?: HeroHeadingFont | null;
  bodyFont?: HeroBodyFont | null;
  titleSize?: HeroTitleSize | null;
  subtitleSize?: HeroSubtitleSize | null;
  titleWeight?: HeroTitleWeight | null;
  subtitleWeight?: HeroSubtitleWeight | null;
  mobileTitleSize?: HeroMobileTitleSize | null;
  mobileSubtitleSize?: HeroMobileSubtitleSize | null;
  titleColor?: HeroTitleColor | null;
  subtitleColor?: HeroSubtitleColor | null;
  badgeTextColor?: HeroBadgeTextColor | null;
  badgeBgColor?: HeroBadgeBgColor | null;
  primaryCtaVariant?: HeroPrimaryCtaVariant | null;
  secondaryCtaVariant?: HeroSecondaryCtaVariant | null;
  primaryCtaColor?: HeroPrimaryCtaColor | null;
  secondaryCtaColor?: HeroSecondaryCtaColor | null;
  overlayColor?: HeroOverlayColor | null;
  overlayOpacity?: number | null;
};

export type HeroStyleInput = {
  textAlign?: string | null;
  contentWidth?: string | null;
  heroHeight?: string | null;
  spacingPreset?: string | null;
  headingFont?: string | null;
  bodyFont?: string | null;
  titleSize?: string | null;
  subtitleSize?: string | null;
  titleWeight?: string | null;
  subtitleWeight?: string | null;
  mobileTitleSize?: string | null;
  mobileSubtitleSize?: string | null;
  titleColor?: string | null;
  subtitleColor?: string | null;
  badgeTextColor?: string | null;
  badgeBgColor?: string | null;
  primaryCtaVariant?: string | null;
  secondaryCtaVariant?: string | null;
  primaryCtaColor?: string | null;
  secondaryCtaColor?: string | null;
  overlayColor?: string | null;
  overlayOpacity?: number | null;
};

export type ResolvedHeroStyleConfig = {
  textAlign: HeroTextAlign;
  contentWidth: HeroContentWidth;
  heroHeight: HeroHeight;
  spacingPreset: HeroSpacingPreset;
  headingFont: HeroHeadingFont;
  bodyFont: HeroBodyFont;
  titleSize: HeroTitleSize;
  subtitleSize: HeroSubtitleSize;
  titleWeight: HeroTitleWeight;
  subtitleWeight: HeroSubtitleWeight;
  mobileTitleSize: HeroMobileTitleSize;
  mobileSubtitleSize: HeroMobileSubtitleSize;
  titleColor: HeroTitleColor;
  subtitleColor: HeroSubtitleColor;
  badgeTextColor: HeroBadgeTextColor;
  badgeBgColor: HeroBadgeBgColor;
  primaryCtaVariant: HeroPrimaryCtaVariant;
  secondaryCtaVariant: HeroSecondaryCtaVariant;
  primaryCtaColor: HeroPrimaryCtaColor;
  secondaryCtaColor: HeroSecondaryCtaColor;
  overlayColor: HeroOverlayColor;
  overlayOpacity: number;
};

export const HERO_STYLE_DEFAULTS: ResolvedHeroStyleConfig = {
  textAlign: "left",
  contentWidth: "wide",
  heroHeight: "default",
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
  secondaryCtaVariant: "outline",
  primaryCtaColor: "primary",
  secondaryCtaColor: "neutral",
  overlayColor: "surface",
  overlayOpacity: 20,
};

type Option<T extends string> = { value: T; label: string };

export const HERO_STYLE_OPTIONS = {
  textAlign: [
    { value: "left", label: "Left" },
    { value: "center", label: "Center" },
  ] satisfies Option<HeroTextAlign>[],
  contentWidth: [
    { value: "narrow", label: "Narrow" },
    { value: "normal", label: "Normal" },
    { value: "wide", label: "Wide" },
  ] satisfies Option<HeroContentWidth>[],
  heroHeight: [
    { value: "compact", label: "Compact" },
    { value: "default", label: "Default" },
    { value: "tall", label: "Tall" },
  ] satisfies Option<HeroHeight>[],
  spacingPreset: [
    { value: "tight", label: "Tight" },
    { value: "normal", label: "Normal" },
    { value: "relaxed", label: "Relaxed" },
  ] satisfies Option<HeroSpacingPreset>[],
  headingFont: [
    { value: "display", label: "Display" },
    { value: "sans", label: "Sans" },
  ] satisfies Option<HeroHeadingFont>[],
  bodyFont: [
    { value: "body", label: "Body" },
    { value: "sans", label: "Sans" },
  ] satisfies Option<HeroBodyFont>[],
  titleSize: [
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
    { value: "xl", label: "Extra large" },
    { value: "display", label: "Display" },
  ] satisfies Option<HeroTitleSize>[],
  subtitleSize: [
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ] satisfies Option<HeroSubtitleSize>[],
  titleWeight: [
    { value: "semibold", label: "Semibold" },
    { value: "bold", label: "Bold" },
  ] satisfies Option<HeroTitleWeight>[],
  subtitleWeight: [
    { value: "normal", label: "Normal" },
    { value: "medium", label: "Medium" },
  ] satisfies Option<HeroSubtitleWeight>[],
  mobileTitleSize: [
    { value: "inherit", label: "Inherit desktop preset" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
    { value: "lg", label: "Large" },
  ] satisfies Option<HeroMobileTitleSize>[],
  mobileSubtitleSize: [
    { value: "inherit", label: "Inherit desktop preset" },
    { value: "sm", label: "Small" },
    { value: "md", label: "Medium" },
  ] satisfies Option<HeroMobileSubtitleSize>[],
  titleColor: [
    { value: "background", label: "Background" },
    { value: "surface", label: "Surface" },
    { value: "primary", label: "Primary" },
    { value: "text-secondary", label: "Text Secondary" },
    { value: "text-primary", label: "Text Primary" },
  ] satisfies Option<HeroTitleColor>[],
  subtitleColor: [
    { value: "surface", label: "Surface" },
    { value: "border", label: "Border" },
    { value: "text-secondary", label: "Text Secondary" },
    { value: "text-primary", label: "Text Primary" },
  ] satisfies Option<HeroSubtitleColor>[],
  badgeTextColor: [
    { value: "background", label: "Background" },
    { value: "surface", label: "Surface" },
    { value: "text-primary", label: "Text Primary" },
    { value: "primary", label: "Primary" },
    { value: "info", label: "Info" },
  ] satisfies Option<HeroBadgeTextColor>[],
  badgeBgColor: [
    { value: "transparent", label: "Transparent" },
    { value: "background", label: "Background" },
    { value: "surface", label: "Surface" },
    { value: "primary", label: "Primary" },
    { value: "info", label: "Info" },
  ] satisfies Option<HeroBadgeBgColor>[],
  primaryCtaVariant: [
    { value: "primary", label: "Primary" },
    { value: "secondary", label: "Secondary" },
    { value: "dark", label: "Dark" },
    { value: "accent", label: "Accent" },
  ] satisfies Option<HeroPrimaryCtaVariant>[],
  secondaryCtaVariant: [
    { value: "secondary", label: "Secondary" },
    { value: "ghost", label: "Ghost" },
    { value: "outline", label: "Outline" },
  ] satisfies Option<HeroSecondaryCtaVariant>[],
  primaryCtaColor: [
    { value: "primary", label: "Primary" },
    { value: "info", label: "Info" },
    { value: "dark", label: "Dark" },
  ] satisfies Option<HeroPrimaryCtaColor>[],
  secondaryCtaColor: [
    { value: "background", label: "Background" },
    { value: "neutral", label: "Neutral" },
    { value: "dark", label: "Dark" },
  ] satisfies Option<HeroSecondaryCtaColor>[],
  overlayColor: [
    { value: "transparent", label: "Transparent" },
    { value: "surface", label: "Surface" },
    { value: "surface-strong", label: "Surface Strong" },
    { value: "primary", label: "Primary" },
  ] satisfies Option<HeroOverlayColor>[],
};

export type HeroColorTokenOption<T extends string> = Option<T> & {
  swatchClassName: string;
  helper?: string;
};

export const HERO_COLOR_TOKEN_OPTIONS = {
  titleColor: [
    {
      value: "background",
      label: "Background",
      swatchClassName: "bg-background border border-surface-300",
    },
    {
      value: "surface",
      label: "Surface",
      swatchClassName: "bg-surface-50 border border-surface-200",
    },
    {
      value: "primary",
      label: "Primary",
      swatchClassName: "bg-primary-500 border border-primary-600",
    },
    {
      value: "text-secondary",
      label: "Text Secondary",
      swatchClassName: "bg-surface-600 border border-surface-700",
    },
    {
      value: "text-primary",
      label: "Text Primary",
      swatchClassName: "bg-surface-900 border border-surface-950",
    },
  ] satisfies HeroColorTokenOption<HeroTitleColor>[],
  subtitleColor: [
    {
      value: "surface",
      label: "Surface",
      swatchClassName: "bg-surface-50 border border-surface-200",
    },
    {
      value: "border",
      label: "Border",
      swatchClassName: "bg-surface-200 border border-surface-300",
    },
    {
      value: "text-secondary",
      label: "Text Secondary",
      swatchClassName: "bg-surface-600 border border-surface-700",
    },
    {
      value: "text-primary",
      label: "Text Primary",
      swatchClassName: "bg-surface-900 border border-surface-950",
    },
  ] satisfies HeroColorTokenOption<HeroSubtitleColor>[],
  badgeTextColor: [
    {
      value: "background",
      label: "Background",
      swatchClassName: "bg-background border border-surface-300",
    },
    {
      value: "surface",
      label: "Surface",
      swatchClassName: "bg-surface-50 border border-surface-200",
    },
    {
      value: "text-primary",
      label: "Text Primary",
      swatchClassName: "bg-surface-900 border border-surface-950",
    },
    {
      value: "primary",
      label: "Primary",
      swatchClassName: "bg-primary-600 border border-primary-700",
    },
    {
      value: "info",
      label: "Info",
      swatchClassName: "bg-info-600 border border-info-700",
    },
  ] satisfies HeroColorTokenOption<HeroBadgeTextColor>[],
  badgeBgColor: [
    {
      value: "transparent",
      label: "Transparent",
      swatchClassName: "bg-surface-50 border border-dashed border-surface-300",
    },
    {
      value: "background",
      label: "Background",
      swatchClassName: "bg-background border border-surface-300",
    },
    {
      value: "surface",
      label: "Surface",
      swatchClassName: "bg-surface-100 border border-surface-300",
    },
    {
      value: "primary",
      label: "Primary",
      swatchClassName: "bg-primary-100 border border-primary-300",
    },
    {
      value: "info",
      label: "Info",
      swatchClassName: "bg-info-100 border border-info-300",
    },
  ] satisfies HeroColorTokenOption<HeroBadgeBgColor>[],
  overlayColor: [
    {
      value: "transparent",
      label: "Transparent",
      swatchClassName: "bg-surface-50 border border-dashed border-surface-300",
    },
    {
      value: "surface",
      label: "Surface",
      swatchClassName: "bg-surface-900 border border-surface-950",
    },
    {
      value: "surface-strong",
      label: "Surface Strong",
      swatchClassName: "bg-surface-950 border border-surface-950",
    },
    {
      value: "primary",
      label: "Primary",
      swatchClassName: "bg-primary-900 border border-primary-900",
    },
  ] satisfies HeroColorTokenOption<HeroOverlayColor>[],
  primaryCtaColor: [
    {
      value: "primary",
      label: "Primary",
      swatchClassName: "bg-primary-600 border border-primary-700",
      helper: "Strong DS primary CTA with white text.",
    },
    {
      value: "info",
      label: "Info",
      swatchClassName: "bg-info-600 border border-info-700",
      helper: "Alternate blue CTA using the DS info scale.",
    },
    {
      value: "dark",
      label: "Dark",
      swatchClassName: "bg-surface-950 border border-surface-950",
      helper: "High-contrast dark CTA with white text.",
    },
  ] satisfies HeroColorTokenOption<HeroPrimaryCtaColor>[],
  secondaryCtaColor: [
    {
      value: "background",
      label: "Background",
      swatchClassName: "bg-background border border-surface-300",
      helper: "Light secondary action with dark text.",
    },
    {
      value: "neutral",
      label: "Neutral",
      swatchClassName: "bg-surface-100 border border-surface-300",
      helper: "Soft neutral action with dark text.",
    },
    {
      value: "dark",
      label: "Dark",
      swatchClassName: "bg-surface-950 border border-surface-950",
      helper: "Dark secondary action with white text.",
    },
  ] satisfies HeroColorTokenOption<HeroSecondaryCtaColor>[],
} as const;

const HERO_TITLE_COLOR_ALIASES: Record<string, HeroTitleColor> = {
  white: "background",
  "pure-white": "background",
  "white-soft": "surface",
  "soft-white": "surface",
  lime: "primary",
  green: "primary",
  "muted-light": "surface",
  slate: "text-secondary",
  "zinc-700": "text-secondary",
  "text-secondary": "text-secondary",
  charcoal: "text-primary",
  black: "text-primary",
  "zinc-900": "text-primary",
  "text-primary": "text-primary",
};

const HERO_SUBTITLE_COLOR_ALIASES: Record<string, HeroSubtitleColor> = {
  "white-soft": "surface",
  "soft-white": "surface",
  "white-muted": "border",
  "muted-light": "border",
  slate: "text-secondary",
  "zinc-700": "text-secondary",
  "text-secondary": "text-secondary",
  charcoal: "text-primary",
  "zinc-900": "text-primary",
  "text-primary": "text-primary",
};

const HERO_BADGE_TEXT_COLOR_ALIASES: Record<string, HeroBadgeTextColor> = {
  white: "background",
  "pure-white": "background",
  "white-soft": "surface",
  "soft-white": "surface",
  charcoal: "text-primary",
  "zinc-900": "text-primary",
  "brand-700": "info",
  "brand-blue": "info",
  "brand-purple": "primary",
  "accent-700": "primary",
};

const HERO_BADGE_BG_COLOR_ALIASES: Record<string, HeroBadgeBgColor> = {
  "white-10": "background",
  "white-15": "background",
  "frosted-white": "background",
  "surface-100": "surface",
  "soft-surface": "surface",
  "brand-50": "info",
  "brand-blue": "info",
  "brand-purple": "primary",
};

const HERO_OVERLAY_COLOR_ALIASES: Record<string, HeroOverlayColor> = {
  black: "surface-strong",
  "dark-slate": "surface",
  "zinc-900": "surface",
  navy: "primary",
  purple: "primary",
  "brand-900": "primary",
};

const HERO_PRIMARY_CTA_COLOR_ALIASES: Record<string, HeroPrimaryCtaColor> = {
  primary: "primary",
  accent: "primary",
  "brand-blue": "info",
  "brand-purple": "primary",
  dark: "dark",
  lime: "primary",
};

const HERO_SECONDARY_CTA_COLOR_ALIASES: Record<string, HeroSecondaryCtaColor> = {
  secondary: "background",
  white: "background",
  outline: "background",
  ghost: "neutral",
  dark: "dark",
};

function includes<T extends string>(
  values: readonly T[],
  value: string | null | undefined,
): value is T {
  return typeof value === "string" && (values as readonly string[]).includes(value);
}

function normalizeMappedValue<T extends string>(
  values: readonly T[],
  aliases: Record<string, T>,
  value: string | null | undefined,
  fallback: T,
) {
  const resolved = typeof value === "string" ? aliases[value] ?? value : value;
  return includes(values, resolved) ? resolved : fallback;
}

export function normalizeHeroOverlayOpacity(value: number | null | undefined) {
  if (typeof value !== "number" || Number.isNaN(value)) {
    return HERO_STYLE_DEFAULTS.overlayOpacity;
  }

  const stepped = Math.round(value / 5) * 5;
  return Math.min(80, Math.max(0, stepped));
}

export function normalizeHeroStyle(
  input?: HeroStyleInput | null,
): ResolvedHeroStyleConfig {
  return {
    textAlign: includes(HERO_TEXT_ALIGN_VALUES, input?.textAlign)
      ? input.textAlign
      : HERO_STYLE_DEFAULTS.textAlign,
    contentWidth: includes(HERO_CONTENT_WIDTH_VALUES, input?.contentWidth)
      ? input.contentWidth
      : HERO_STYLE_DEFAULTS.contentWidth,
    heroHeight: includes(HERO_HEIGHT_VALUES, input?.heroHeight)
      ? input.heroHeight
      : HERO_STYLE_DEFAULTS.heroHeight,
    spacingPreset: includes(HERO_SPACING_VALUES, input?.spacingPreset)
      ? input.spacingPreset
      : HERO_STYLE_DEFAULTS.spacingPreset,
    headingFont: includes(HERO_HEADING_FONT_VALUES, input?.headingFont)
      ? input.headingFont
      : HERO_STYLE_DEFAULTS.headingFont,
    bodyFont: includes(HERO_BODY_FONT_VALUES, input?.bodyFont)
      ? input.bodyFont
      : HERO_STYLE_DEFAULTS.bodyFont,
    titleSize: includes(HERO_TITLE_SIZE_VALUES, input?.titleSize)
      ? input.titleSize
      : HERO_STYLE_DEFAULTS.titleSize,
    subtitleSize: includes(HERO_SUBTITLE_SIZE_VALUES, input?.subtitleSize)
      ? input.subtitleSize
      : HERO_STYLE_DEFAULTS.subtitleSize,
    titleWeight: includes(HERO_TITLE_WEIGHT_VALUES, input?.titleWeight)
      ? input.titleWeight
      : HERO_STYLE_DEFAULTS.titleWeight,
    subtitleWeight: includes(HERO_SUBTITLE_WEIGHT_VALUES, input?.subtitleWeight)
      ? input.subtitleWeight
      : HERO_STYLE_DEFAULTS.subtitleWeight,
    mobileTitleSize: includes(HERO_MOBILE_TITLE_SIZE_VALUES, input?.mobileTitleSize)
      ? input.mobileTitleSize
      : HERO_STYLE_DEFAULTS.mobileTitleSize,
    mobileSubtitleSize: includes(
      HERO_MOBILE_SUBTITLE_SIZE_VALUES,
      input?.mobileSubtitleSize,
    )
      ? input.mobileSubtitleSize
      : HERO_STYLE_DEFAULTS.mobileSubtitleSize,
    titleColor: normalizeMappedValue(
      HERO_TITLE_COLOR_VALUES,
      HERO_TITLE_COLOR_ALIASES,
      input?.titleColor,
      HERO_STYLE_DEFAULTS.titleColor,
    ),
    subtitleColor: normalizeMappedValue(
      HERO_SUBTITLE_COLOR_VALUES,
      HERO_SUBTITLE_COLOR_ALIASES,
      input?.subtitleColor,
      HERO_STYLE_DEFAULTS.subtitleColor,
    ),
    badgeTextColor: normalizeMappedValue(
      HERO_BADGE_TEXT_COLOR_VALUES,
      HERO_BADGE_TEXT_COLOR_ALIASES,
      input?.badgeTextColor,
      HERO_STYLE_DEFAULTS.badgeTextColor,
    ),
    badgeBgColor: normalizeMappedValue(
      HERO_BADGE_BG_COLOR_VALUES,
      HERO_BADGE_BG_COLOR_ALIASES,
      input?.badgeBgColor,
      HERO_STYLE_DEFAULTS.badgeBgColor,
    ),
    primaryCtaVariant: includes(
      HERO_PRIMARY_CTA_VARIANT_VALUES,
      input?.primaryCtaVariant,
    )
      ? input.primaryCtaVariant
      : HERO_STYLE_DEFAULTS.primaryCtaVariant,
    secondaryCtaVariant: includes(
      HERO_SECONDARY_CTA_VARIANT_VALUES,
      input?.secondaryCtaVariant,
    )
      ? input.secondaryCtaVariant
      : HERO_STYLE_DEFAULTS.secondaryCtaVariant,
    primaryCtaColor: normalizeMappedValue(
      HERO_PRIMARY_CTA_COLOR_VALUES,
      HERO_PRIMARY_CTA_COLOR_ALIASES,
      input?.primaryCtaColor,
      HERO_STYLE_DEFAULTS.primaryCtaColor,
    ),
    secondaryCtaColor: normalizeMappedValue(
      HERO_SECONDARY_CTA_COLOR_VALUES,
      HERO_SECONDARY_CTA_COLOR_ALIASES,
      input?.secondaryCtaColor,
      HERO_STYLE_DEFAULTS.secondaryCtaColor,
    ),
    overlayColor: normalizeMappedValue(
      HERO_OVERLAY_COLOR_VALUES,
      HERO_OVERLAY_COLOR_ALIASES,
      input?.overlayColor,
      HERO_STYLE_DEFAULTS.overlayColor,
    ),
    overlayOpacity: normalizeHeroOverlayOpacity(input?.overlayOpacity),
  };
}
