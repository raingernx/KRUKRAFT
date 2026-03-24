export const typography = {
  heading: "var(--font-heading)",
  body: "var(--font-body)",
  ui: "var(--font-ui)",
  mono: "var(--font-mono)",
  scale: {
    display: {
      className: "text-display",
      weight: "font-semibold",
    },
    h1: {
      className: "text-h1",
      weight: "font-semibold",
    },
    h2: {
      className: "text-h2",
      weight: "font-semibold",
    },
    h3: {
      className: "text-h3",
      weight: "font-semibold",
    },
    body: {
      className: "text-body",
      weight: "font-normal",
    },
    small: {
      className: "text-small",
      weight: "font-normal",
    },
    caption: {
      className: "text-caption",
      weight: "font-medium",
    },
  },
  utility: {
    heading: "font-heading",
    body: "font-sans",
    ui: "font-ui",
    mono: "font-mono",
  },
} as const;

export type DesignSystemTypographyScaleToken = keyof typeof typography.scale;
