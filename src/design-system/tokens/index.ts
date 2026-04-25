import {
  chartColors,
  colorAliases,
  colorScales,
  colors,
  semanticColors,
  themeColors,
} from "./colors";
import { radius, radiusPrimitives } from "./radius";
import { spacing, spacingPrimitives } from "./spacing";
import {
  fontFamilies,
  fontFamilyScale,
  fontSizeScale,
  fontWeights,
  letterSpacingScale,
  lineHeights,
  typography,
} from "./typography";
import { hero, heroTokens } from "./hero";

export {
  chartColors,
  colorAliases,
  colorScales,
  colors,
  fontFamilies,
  fontFamilyScale,
  fontSizeScale,
  fontWeights,
  hero,
  heroTokens,
  letterSpacingScale,
  lineHeights,
  radius,
  radiusPrimitives,
  semanticColors,
  spacing,
  spacingPrimitives,
  themeColors,
  typography,
};

export const designSystemTokens = {
  colors,
  hero,
  spacing,
  radius,
  typography,
} as const;

export type {
  DesignSystemColorAliasToken,
  DesignSystemColorScaleToken,
  DesignSystemColorToken,
  DesignSystemSemanticColorToken,
  DesignSystemThemeColorToken,
} from "./colors";
export type { DesignSystemRadiusToken } from "./radius";
export type { DesignSystemSpacingToken } from "./spacing";
export type { DesignSystemTypographyScaleToken } from "./typography";
export type {
  DesignSystemHeroRadiusToken,
  DesignSystemHeroSpacingToken,
  DesignSystemHeroTypographyToken,
} from "./hero";
