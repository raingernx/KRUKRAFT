import { radius } from "./radius";
import { spacing } from "./spacing";
import { fontSizeScale } from "./typography";

export const hero = {
  spacing: {
    pillY: spacing.sm,
    pillX: spacing.md,
    calloutGap: spacing.md,
    stackGap: spacing.xl,
    buttonY: "14px",
    buttonX: "20px",
    featureGap: "10px",
    railGap: spacing.md,
    insetGap: "8px",
    railPadding: "20px",
    cardPadding: spacing.lg,
    sectionPaddingY: "32px",
    sectionPaddingX: "40px",
    mobilePaddingY: spacing.xl,
    mobilePaddingX: "20px",
  },
  radius: {
    pill: radius.full,
    card: radius["4xl"],
    panel: "20px",
    media: "28px",
    hero: "32px",
  },
  typography: {
    titleDesktop: "72px",
    titleMobile: "44px",
    titleLineHeight: "0.96",
    subtitleDesktop: "22px",
    subtitleMobile: fontSizeScale.body[0],
    subtitleLineHeight: "1.45",
    body: fontSizeScale.small[0],
    bodyLineHeight: "1.45",
    caption: fontSizeScale.caption[0],
    micro: "11px",
    price: "32px",
    badgeTracking: "1.6",
    eyebrowTracking: "2.2",
    eyebrowWeight: 600,
    titleWeight: 700,
  },
} as const;

export const heroTokens = hero;

export type DesignSystemHeroSpacingToken = keyof typeof hero.spacing;
export type DesignSystemHeroRadiusToken = keyof typeof hero.radius;
export type DesignSystemHeroTypographyToken = keyof typeof hero.typography;
