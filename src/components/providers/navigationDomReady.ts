"use client";

function hasStableMainSurface() {
  const main = document.querySelector("main");

  if (!main) {
    return false;
  }

  const loadingScopes = main.querySelectorAll("[data-loading-scope]").length > 0;
  const mainTextLength = main.textContent?.trim().length ?? 0;
  return loadingScopes || main.children.length > 0 || mainTextLength > 0;
}

export function waitForNavigationSurfaceReady(
  routeShellSelector: string,
  callback: () => void,
  minPendingMs: number,
  startedAt: number,
  options?: {
    extraReadySelector?: string;
    maxWaitMs?: number;
  },
) {
  const elapsed = Date.now() - startedAt;
  const remaining = Math.max(0, minPendingMs - elapsed);
  const extraReadySelector = options?.extraReadySelector ?? null;
  const maxWaitMs = options?.maxWaitMs ?? Infinity;

  let timeoutId = 0;
  let rafId = 0;

  const attempt = () => {
    const routeShell = document.querySelector(routeShellSelector);

    if (!routeShell || !hasStableMainSurface()) {
      rafId = window.requestAnimationFrame(attempt);
      return;
    }

    if (
      extraReadySelector &&
      !document.querySelector(extraReadySelector) &&
      Date.now() - startedAt < maxWaitMs
    ) {
      rafId = window.requestAnimationFrame(attempt);
      return;
    }

    rafId = window.requestAnimationFrame(() => {
      rafId = window.requestAnimationFrame(() => {
        callback();
      });
    });
  };

  timeoutId = window.setTimeout(attempt, remaining);

  return () => {
    window.clearTimeout(timeoutId);
    window.cancelAnimationFrame(rafId);
  };
}
