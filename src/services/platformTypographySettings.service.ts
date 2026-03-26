import { Prisma } from "@prisma/client";
import { cache } from "react";
import { unstable_cache } from "next/cache";
import { CACHE_KEYS, CACHE_TAGS, CACHE_TTLS } from "@/lib/cache";
import { isMissingTableError } from "@/lib/prismaErrors";
import {
  DEFAULT_PLATFORM_TYPOGRAPHY_SETTINGS,
  buildTypographyThemeSettings,
  normalizePlatformTypographySettingsInput,
  type PlatformTypographySettingsInput,
} from "@/lib/typography/typography-settings";
import {
  getPlatformTypographySettings as getStoredTypographySettings,
  updatePlatformTypographySettings as saveTypographySettings,
} from "@/repositories/platformTypographySettings.repository";

const readPlatformTypographySettings = unstable_cache(
  async () => getStoredTypographySettings(),
  [CACHE_KEYS.platformTypographySettings],
  {
    revalidate: CACHE_TTLS.platform,
    tags: [CACHE_TAGS.platform],
  },
);

function isTypographySettingsTransientDbError(error: unknown) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2024"
  ) {
    return true;
  }

  if (
    error instanceof Prisma.PrismaClientInitializationError ||
    error instanceof Prisma.PrismaClientUnknownRequestError
  ) {
    return true;
  }

  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("Timed out fetching a new connection from the connection pool") ||
    message.includes("Can't reach database server") ||
    message.includes("Error in PostgreSQL connection") ||
    message.includes("kind: Closed")
  );
}

async function getTypographySettingsConfig() {
  return readPlatformTypographySettings();
}

export const getTypographySettings = cache(getTypographySettingsConfig);

export async function getTypographySettingsOrDefault() {
  try {
    return await getTypographySettings();
  } catch (error) {
    if (!isMissingTableError(error) && !isTypographySettingsTransientDbError(error)) {
      throw error;
    }
    // PlatformTypographySettings table missing or transient DB/connectivity failure — use defaults.
    console.warn("[TYPOGRAPHY_SETTINGS] Falling back to defaults.");
    return normalizePlatformTypographySettingsInput(
      DEFAULT_PLATFORM_TYPOGRAPHY_SETTINGS,
    );
  }
}

export async function updateTypographySettings(
  input: PlatformTypographySettingsInput,
) {
  return saveTypographySettings(normalizePlatformTypographySettingsInput(input));
}

export { buildTypographyThemeSettings };
