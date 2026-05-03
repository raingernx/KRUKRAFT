export const radiusPrimitives = {
  sm: "8px",
  "sm+": "12px",
  md: "16px",
  lg: "24px",
  xl: "32px",
  pill: "999px",
} as const;

export const radius = {
  ...radiusPrimitives,
  input: radiusPrimitives.lg,
  surface: radiusPrimitives.lg,
  "3xl": radiusPrimitives.lg,
  "4xl": radiusPrimitives.xl,
  full: "9999px",
} as const;

export type DesignSystemRadiusToken = keyof typeof radius;
