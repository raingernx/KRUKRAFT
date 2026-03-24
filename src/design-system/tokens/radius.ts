export const radius = {
  sm: "8px",
  md: "12px",
  lg: "16px",
  xl: "16px",
  full: "9999px",
} as const;

export type DesignSystemRadiusToken = keyof typeof radius;
