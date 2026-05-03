import { GeistMono } from "geist/font/mono";
import { IBM_Plex_Sans_Thai } from "next/font/google";

const ibmPlexSansThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  display: "swap",
  variable: "--font-ibm-plex-sans-thai",
  weight: ["400", "600"],
});

export const fontVariables = [
  GeistMono.variable,
  ibmPlexSansThai.variable,
].join(" ");

export const fontVariableFallbacks: Record<string, string> = {};
