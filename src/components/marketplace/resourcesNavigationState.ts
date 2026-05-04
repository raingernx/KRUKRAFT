"use client";

import { useSyncExternalStore } from "react";
import { routes } from "@/lib/routes";

export type ResourcesNavigationMode = "discover" | "listing" | "detail";

export interface ResourcesNavigationState {
  id: number;
  mode: ResourcesNavigationMode | null;
  href: string | null;
  startedAt: number;
  overlay: boolean;
}

let nextNavigationId = 1;
let state: ResourcesNavigationState = {
  id: 0,
  mode: null,
  href: null,
  startedAt: 0,
  overlay: false,
};

const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return state;
}

function canonicalizeSearch(input: string) {
  const params = new URLSearchParams(input);
  const entries = Array.from(params.entries()).sort(([keyA, valueA], [keyB, valueB]) => {
    if (keyA === keyB) {
      return valueA.localeCompare(valueB);
    }

    return keyA.localeCompare(keyB);
  });

  return new URLSearchParams(entries).toString();
}

export function canonicalizeResourcesHref(href: string) {
  const url = new URL(href, "http://resources.local");
  const search = canonicalizeSearch(url.search);
  return search ? `${url.pathname}?${search}` : url.pathname;
}

export function inferResourcesNavigationMode(href: string): ResourcesNavigationMode | null {
  const canonicalHref = canonicalizeResourcesHref(href);
  const marketplacePrefix = `${routes.marketplace}/`;

  if (canonicalHref === routes.marketplace) {
    return "discover";
  }

  if (canonicalHref.startsWith(`${routes.marketplace}?`)) {
    return "listing";
  }

  if (canonicalHref.startsWith(marketplacePrefix)) {
    return "detail";
  }

  return null;
}

export function isResourcesSubtreePath(pathname: string) {
  return pathname === routes.marketplace || pathname.startsWith(`${routes.marketplace}/`);
}

export function shouldUseResourcesDocumentNavigation(
  pathname: string,
  mode: ResourcesNavigationMode | null,
) {
  return mode === "detail" && isResourcesSubtreePath(pathname);
}

export function beginResourcesNavigation(
  mode: ResourcesNavigationMode,
  href: string,
  options?: { overlay?: boolean },
) {
  state = {
    id: nextNavigationId++,
    mode,
    href: canonicalizeResourcesHref(href),
    startedAt: Date.now(),
    overlay: options?.overlay ?? false,
  };
  emit();
}

export function clearResourcesNavigation(id: number) {
  if (state.id !== id) {
    return;
  }

  state = {
    id: 0,
    mode: null,
    href: null,
    startedAt: 0,
    overlay: false,
  };
  emit();
}

export function useResourcesNavigationState() {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
