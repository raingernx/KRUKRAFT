"use client";

import { useEffect, useState } from "react";

type UseFetchJsonOptions = {
  url: string;
  enabled?: boolean;
  ttlMs?: number;
  cacheKey?: string;
  persist?: "session";
};

type FetchJsonOptions = {
  url: string;
  ttlMs?: number;
  cacheKey?: string;
  fresh?: boolean;
  persist?: "session";
};

type UseFetchJsonState<T> = {
  data: T | null;
  isReady: boolean;
};

type FetchJsonCacheEntry = {
  data: unknown;
  expiresAt: number;
};

const fetchJsonCache = new Map<string, FetchJsonCacheEntry>();
const fetchJsonInFlight = new Map<string, Promise<unknown>>();
const FETCH_JSON_SESSION_PREFIX = "krukraft.fetchJson.";
const DEV_TRANSIENT_FETCH_ERROR_PATTERNS = [
  /failed to fetch/i,
  /networkerror/i,
  /load failed/i,
];

function canUseSessionStorage() {
  return typeof window !== "undefined" && typeof window.sessionStorage !== "undefined";
}

function getSessionStorageKey(cacheKey: string) {
  return `${FETCH_JSON_SESSION_PREFIX}${cacheKey}`;
}

function readPersistedCacheEntry(
  cacheKey: string,
): FetchJsonCacheEntry | null {
  if (!canUseSessionStorage()) {
    return null;
  }

  try {
    const raw = window.sessionStorage.getItem(getSessionStorageKey(cacheKey));
    if (!raw) {
      return null;
    }

    const parsed = JSON.parse(raw) as FetchJsonCacheEntry | null;
    if (
      !parsed ||
      typeof parsed !== "object" ||
      typeof parsed.expiresAt !== "number"
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

function writePersistedCacheEntry<T>(
  cacheKey: string,
  data: T | null,
  ttlMs: number,
) {
  if (!canUseSessionStorage()) {
    return;
  }

  if (ttlMs <= 0) {
    window.sessionStorage.removeItem(getSessionStorageKey(cacheKey));
    return;
  }

  try {
    window.sessionStorage.setItem(
      getSessionStorageKey(cacheKey),
      JSON.stringify({
        data,
        expiresAt: Date.now() + ttlMs,
      } satisfies FetchJsonCacheEntry),
    );
  } catch {
    // Best-effort cache only.
  }
}

function clearPersistedFetchJsonCache() {
  if (!canUseSessionStorage()) {
    return;
  }

  try {
    const keysToDelete: string[] = [];
    for (let index = 0; index < window.sessionStorage.length; index += 1) {
      const key = window.sessionStorage.key(index);
      if (key?.startsWith(FETCH_JSON_SESSION_PREFIX)) {
        keysToDelete.push(key);
      }
    }

    for (const key of keysToDelete) {
      window.sessionStorage.removeItem(key);
    }
  } catch {
    // Best-effort cache only.
  }
}

function getCacheEntry<T>(
  key: string,
  ttlMs: number,
  options?: { persist?: "session" },
): { hit: boolean; data: T | null } {
  if (ttlMs <= 0) {
    return { hit: false, data: null };
  }

  const entry = fetchJsonCache.get(key);
  if (entry) {
    if (entry.expiresAt <= Date.now()) {
      fetchJsonCache.delete(key);
    } else {
      return {
        hit: true,
        data: (entry.data as T | null) ?? null,
      };
    }
  }

  if (options?.persist === "session") {
    const persistedEntry = readPersistedCacheEntry(key);
    if (!persistedEntry) {
      return { hit: false, data: null };
    }

    if (persistedEntry.expiresAt <= Date.now()) {
      writePersistedCacheEntry(key, null, 0);
      return { hit: false, data: null };
    }

    fetchJsonCache.set(key, persistedEntry);
    return {
      hit: true,
      data: (persistedEntry.data as T | null) ?? null,
    };
  }

  return { hit: false, data: null };
}

function writeCacheEntry<T>(
  cacheKey: string,
  data: T | null,
  ttlMs: number,
  options?: { persist?: "session" },
) {
  if (ttlMs <= 0) {
    fetchJsonCache.delete(cacheKey);
    if (options?.persist === "session") {
      writePersistedCacheEntry(cacheKey, null, 0);
    }
    return;
  }

  const entry = {
    data,
    expiresAt: Date.now() + ttlMs,
  } satisfies FetchJsonCacheEntry;

  fetchJsonCache.set(cacheKey, entry);

  if (options?.persist === "session") {
    writePersistedCacheEntry(cacheKey, data, ttlMs);
  }
}

async function requestJson<T>(url: string): Promise<T | null> {
  const response = await fetch(url, {
    cache: "no-store",
    credentials: "same-origin",
  });

  if (!response.ok) {
    throw new Error(`Failed to load ${url}`);
  }

  const json = (await response.json()) as { data?: T | null };
  return json.data ?? null;
}

function isTransientFetchJsonError(error: unknown) {
  if (!(error instanceof Error)) {
    return false;
  }

  return (
    error.name === "AbortError" ||
    DEV_TRANSIENT_FETCH_ERROR_PATTERNS.some((pattern) =>
      pattern.test(error.message),
    )
  );
}

function reportFetchJsonError(error: unknown) {
  if (
    process.env.NODE_ENV !== "production" &&
    isTransientFetchJsonError(error)
  ) {
    return;
  }

  console.error("[USE_FETCH_JSON]", error);
}

async function loadFetchJson<T>(
  url: string,
  cacheKey: string,
  ttlMs: number,
  options?: { fresh?: boolean; persist?: "session" },
): Promise<T | null> {
  const fresh = options?.fresh ?? false;

  if (!fresh) {
    const cached = getCacheEntry<T>(cacheKey, ttlMs, {
      persist: options?.persist,
    });
    if (cached.hit) {
      return cached.data;
    }

    const existing = fetchJsonInFlight.get(cacheKey) as Promise<T | null> | undefined;
    if (existing) {
      return existing;
    }
  }

  const promise = requestJson<T>(url)
    .then((data) => {
      writeCacheEntry(cacheKey, data, ttlMs, {
        persist: options?.persist,
      });
      return data;
    })
    .finally(() => {
      if (!fresh) {
        fetchJsonInFlight.delete(cacheKey);
      }
    });

  if (!fresh) {
    fetchJsonInFlight.set(cacheKey, promise);
  }

  return promise;
}

export function clearFetchJsonCache() {
  fetchJsonCache.clear();
  fetchJsonInFlight.clear();
  clearPersistedFetchJsonCache();
}

export async function fetchJson<T>({
  url,
  ttlMs = 0,
  cacheKey,
  fresh = false,
  persist,
}: FetchJsonOptions): Promise<T | null> {
  const resolvedCacheKey = cacheKey ?? url;
  return loadFetchJson<T>(url, resolvedCacheKey, ttlMs, {
    fresh,
    persist,
  });
}

export function useFetchJson<T>({
  url,
  enabled = true,
  ttlMs = 0,
  cacheKey,
  persist,
}: UseFetchJsonOptions): UseFetchJsonState<T> {
  const resolvedCacheKey = cacheKey ?? url;
  const [state, setState] = useState<UseFetchJsonState<T>>(() => {
    if (!enabled) {
      return {
        data: null,
        isReady: true,
      };
    }

    const cached = getCacheEntry<T>(resolvedCacheKey, ttlMs, { persist });
    return {
      data: cached.data,
      isReady: cached.hit,
    };
  });

  useEffect(() => {
    let cancelled = false;

    if (!enabled) {
      setState({
        data: null,
        isReady: true,
      });
      return () => {
        cancelled = true;
      };
    }

    const cached = getCacheEntry<T>(resolvedCacheKey, ttlMs, { persist });
    if (cached.hit) {
      setState({
        data: cached.data,
        isReady: true,
      });
      return () => {
        cancelled = true;
      };
    }

    setState((current) => ({
      data: current.data,
      isReady: false,
    }));

    void loadFetchJson<T>(url, resolvedCacheKey, ttlMs, { persist })
      .then((data) => {
        if (cancelled) {
          return;
        }

        setState({
          data,
          isReady: true,
        });
      })
      .catch((error) => {
        if (cancelled) {
          return;
        }

        reportFetchJsonError(error);
        setState({
          data: null,
          isReady: true,
        });
      });

    return () => {
      cancelled = true;
    };
  }, [enabled, persist, resolvedCacheKey, ttlMs, url]);

  return state;
}
