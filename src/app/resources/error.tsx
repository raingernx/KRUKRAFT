"use client";

import { useEffect, useRef, useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container } from "@/design-system";
import { MarketplaceNavbarSearch } from "@/components/marketplace/MarketplaceNavbarSearch";
import { ResourcesRouteSkeleton } from "@/components/skeletons/ResourcesRouteSkeleton";
import { routes } from "@/lib/routes";

const RESOURCES_ROUTE_ERROR_AUTORETRY_KEY = "krukraft.resources.route-error-autoretry";
const RESOURCES_ROUTE_ERROR_AUTORETRY_TTL_MS = 5_000;
const RESOURCES_ROUTE_ERROR_AUTORETRY_DELAY_MS = 350;

function canAutoRetryResourcesRouteError() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const raw = window.sessionStorage.getItem(RESOURCES_ROUTE_ERROR_AUTORETRY_KEY);
    if (!raw) {
      return true;
    }

    const parsed = Number.parseInt(raw, 10);
    if (!Number.isFinite(parsed)) {
      return true;
    }

    return Date.now() - parsed > RESOURCES_ROUTE_ERROR_AUTORETRY_TTL_MS;
  } catch {
    return false;
  }
}

function markResourcesRouteErrorAutoRetry() {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.sessionStorage.setItem(
      RESOURCES_ROUTE_ERROR_AUTORETRY_KEY,
      String(Date.now()),
    );
  } catch {
    // Best-effort retry guard only.
  }
}

function reloadCurrentResourcesRoute() {
  if (typeof window === "undefined") {
    return;
  }

  window.location.replace(window.location.href);
}

export default function ResourcesRouteError({
  error,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const autoRetryTriggeredRef = useRef(false);
  const [isAutoRetrying, setIsAutoRetrying] = useState(false);

  useEffect(() => {
    console.error("[RESOURCES_ROUTE_ERROR]", error);
  }, [error]);

  useEffect(() => {
    if (autoRetryTriggeredRef.current || !canAutoRetryResourcesRouteError()) {
      return;
    }

    autoRetryTriggeredRef.current = true;
    markResourcesRouteErrorAutoRetry();
    setIsAutoRetrying(true);

    const timeoutId = window.setTimeout(() => {
      reloadCurrentResourcesRoute();
    }, RESOURCES_ROUTE_ERROR_AUTORETRY_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar headerSearch={<MarketplaceNavbarSearch />} />

      <main className="flex-1">
        {isAutoRetrying ? (
          <Container className="py-5 sm:py-6 lg:py-8">
            <ResourcesRouteSkeleton mode="discover" />
          </Container>
        ) : (
        <Container className="py-10 sm:py-12 lg:py-14">
          <div className="mx-auto max-w-2xl rounded-[28px] border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-8 sm:py-12">
            <div className="space-y-3">
              <p className="text-caption font-semibold uppercase tracking-[0.18em] text-primary-700">
                Library error
              </p>
              <h1 className="font-display text-3xl font-semibold text-foreground">
                The resource library could not load.
              </h1>
              <p className="text-body leading-7 text-muted-foreground">
                {isAutoRetrying
                  ? "Trying the library again now. If the refresh still fails, you can retry manually or reopen the main resource index."
                  : "Try again, or return to the main resource index and reopen the library."}
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button
                type="button"
                onClick={reloadCurrentResourcesRoute}
                size="lg"
                disabled={isAutoRetrying}
              >
                {isAutoRetrying ? "Retrying…" : "Try again"}
              </Button>
              <Button asChild size="lg" variant="quiet">
                <a href={routes.marketplace}>Open resources</a>
              </Button>
            </div>
          </div>
        </Container>
        )}
      </main>
    </div>
  );
}
