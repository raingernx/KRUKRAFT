export const spacingPrimitives = {
  "2": "2px",
  "4": "4px",
  "8": "8px",
  "12": "12px",
  "16": "16px",
  "24": "24px",
  "32": "32px",
  "40": "40px",
  "48": "48px",
} as const;

export const spacing = {
  ...spacingPrimitives,
  xs: spacingPrimitives["4"],
  sm: spacingPrimitives["8"],
  md: spacingPrimitives["12"],
  lg: spacingPrimitives["16"],
  xl: spacingPrimitives["24"],
  "2xl": spacingPrimitives["32"],
  "3xl": spacingPrimitives["40"],
  "4xl": spacingPrimitives["48"],
} as const;

export type DesignSystemSpacingToken = keyof typeof spacing;
