import { unstable_cache } from "next/cache";
import { runBestEffortAsync } from "@/lib/async";
import { CACHE_KEYS, CACHE_TTLS, rememberJson } from "@/lib/cache";
import {
  findFallbackHero,
  findLegacyHomepageHero,
  listEligibleHomepageHeroes,
} from "@/repositories/heroes/hero.repository";

export const HERO_CACHE_KEY = "homepage-active-hero";
export const HERO_CACHE_TAG = "hero";
export const HERO_CACHE_TTL_SECONDS = CACHE_TTLS.homepageList;
export const HERO_FALLBACK_CACHE_KEY = "homepage-fallback-hero";
export const HERO_LEGACY_FALLBACK_CACHE_KEY = "homepage-legacy-fallback-hero";

export const getCachedEligibleHomepageHeroes = unstable_cache(
  async function loadEligibleHomepageHeroes() {
    // rememberJson adds a Redis cross-instance layer so new Vercel instances
    // read from Redis (<10 ms) instead of hitting the DB on cold start.
    // This prevents connection-pool pressure from causing fallback flashes.
    return rememberJson(
      CACHE_KEYS.activeHero,
      HERO_CACHE_TTL_SECONDS,
      () => listEligibleHomepageHeroes(new Date()),
    );
  },
  [HERO_CACHE_KEY],
  {
    revalidate: HERO_CACHE_TTL_SECONDS,
    tags: [HERO_CACHE_TAG],
  },
);

export const getCachedFallbackHero = unstable_cache(
  async function loadFallbackHero() {
    return rememberJson(
      HERO_FALLBACK_CACHE_KEY,
      HERO_CACHE_TTL_SECONDS,
      () =>
        runBestEffortAsync(() => findFallbackHero(), {
          fallback: null,
          warningLabel: "[HERO_FALLBACK_BEST_EFFORT]",
        }),
    );
  },
  [HERO_FALLBACK_CACHE_KEY],
  {
    revalidate: HERO_CACHE_TTL_SECONDS,
    tags: [HERO_CACHE_TAG],
  },
);

export const getCachedLegacyHomepageHero = unstable_cache(
  async function loadLegacyHomepageHero() {
    return findLegacyHomepageHero();
  },
  [HERO_LEGACY_FALLBACK_CACHE_KEY],
  {
    revalidate: HERO_CACHE_TTL_SECONDS,
    tags: [HERO_CACHE_TAG],
  },
);
