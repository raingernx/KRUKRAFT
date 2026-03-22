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

async function getTypographySettingsConfig() {
  return readPlatformTypographySettings();
}

export const getTypographySettings = cache(getTypographySettingsConfig);

export async function getTypographySettingsOrDefault() {
  try {
    return await getTypographySettings();
  } catch (error) {
    if (!isMissingTableError(error)) throw error;
    // PlatformTypographySettings table missing (local dev schema drift) — use defaults.
    console.warn("[TYPOGRAPHY_SETTINGS] Table missing (schema drift) — using defaults.");
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
