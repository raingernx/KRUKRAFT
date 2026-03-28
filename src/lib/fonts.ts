import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import {
  Fraunces,
  Inter,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Plus_Jakarta_Sans,
} from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
  weight: ["400", "500", "600", "700"],
});

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-plus-jakarta",
  weight: ["400", "500", "600", "700"],
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-noto-sans-thai",
  weight: ["400", "500", "600", "700"],
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-noto-serif-thai",
  weight: ["400", "500", "600", "700"],
});

export const fontVariables = [
  GeistSans.variable,
  GeistMono.variable,
  inter.variable,
  fraunces.variable,
  plusJakartaSans.variable,
  notoSansThai.variable,
  notoSerifThai.variable,
].join(" ");

export const fontVariableFallbacks: Record<string, string> = {};
