"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container } from "@/design-system";
import { MarketplaceNavbarSearch } from "@/components/marketplace/MarketplaceNavbarSearch";
import { routes } from "@/lib/routes";

export default function ResourcesRouteError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[RESOURCES_ROUTE_ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar headerSearch={<MarketplaceNavbarSearch />} />

      <main className="flex-1">
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
                Try again, or return to the main resource index and reopen the library.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Button type="button" onClick={reset} size="lg">
                Try again
              </Button>
              <Button asChild size="lg" variant="quiet">
                <Link href={routes.marketplace}>Open resources</Link>
              </Button>
            </div>
          </div>
        </Container>
      </main>
    </div>
  );
}
