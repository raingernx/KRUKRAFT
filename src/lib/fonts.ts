import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";

export const fontVariables = [GeistSans.variable, GeistMono.variable].join(" ");

export const fontVariableFallbacks: Record<string, string> = {
  "--font-inter": "var(--font-geist-sans)",
  "--font-fraunces": "Georgia",
  "--font-noto-sans-thai": "system-ui",
  "--font-noto-serif-thai": "Georgia",
  "--font-plus-jakarta": "var(--font-geist-sans)",
};
