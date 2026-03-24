const semanticColors = {
  background: "#FFFFFF",
  surface: "#F8FAFC",
  border: "#E2E8F0",
  textPrimary: "#0F172A",
  textSecondary: "#475569",
  textMuted: "#94A3B8",
  primary: "#2D28BB",
  primaryForeground: "#FFFFFF",
  success: "#10B981",
  successStrong: "#059669",
  warning: "#F59E0B",
  warningStrong: "#D97706",
  info: "#3B82F6",
  infoStrong: "#2563EB",
} as const;

export const colors = {
  ...semanticColors,

  // Compatibility aliases for existing shadcn-style tokens.
  foreground: semanticColors.textPrimary,
  card: semanticColors.background,
  cardForeground: semanticColors.textPrimary,
  secondary: semanticColors.surface,
  secondaryForeground: semanticColors.textPrimary,
  muted: semanticColors.surface,
  mutedForeground: semanticColors.textMuted,
  accent: semanticColors.surface,
  accentForeground: semanticColors.textPrimary,
  input: semanticColors.border,
  ring: semanticColors.primary,
} as const;

export type DesignSystemColorToken = keyof typeof colors;
