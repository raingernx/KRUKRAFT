"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { Container } from "@/components/layout/container";
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
    <div className="flex min-h-screen flex-col bg-surface-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center">
        <Container className="py-16 text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-text-muted">
            Something went wrong
          </p>
          <h1 className="mt-3 text-3xl font-semibold text-text-primary">
            An unexpected error occurred
          </h1>
          <p className="mt-3 text-base text-text-secondary">
            We have been notified and are looking into it. Please try again.
          </p>
          {error.digest ? (
            <p className="mt-2 text-xs text-text-muted">
              Error ID: {error.digest}
            </p>
          ) : null}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={reset}
              className="inline-flex items-center justify-center rounded-xl bg-brand-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Try again
            </button>
            <Link
              href={routes.home}
              className="inline-flex items-center justify-center rounded-xl border border-surface-200 px-5 py-3 text-sm font-medium text-text-secondary transition hover:bg-surface-50"
            >
              Go home
            </Link>
          </div>
        </Container>
      </main>
    </div>
  );
}
