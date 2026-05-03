"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Button, Container } from "@/design-system";
import { routes } from "@/lib/routes";

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <Container className="py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">
            An unexpected error occurred
          </h1>
          <p className="mt-3 text-base text-muted-foreground">
            We have been notified and are looking into it. Please try again.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-muted-foreground">
              Error ID: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={reset} size="lg">
              Try again
            </Button>
            <Button asChild size="lg" variant="quiet">
              <Link href={routes.home}>Go home</Link>
            </Button>
          </div>
        </Container>
      </main>
    </div>
  );
}
