"use client";

import * as Sentry from "@sentry/nextjs";
import { useEffect } from "react";
import { defaultLocale } from "@/i18n/config";

// global-error.tsx wraps the root layout itself — no providers or Navbar
// available here. Must include its own <html> and <body>.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const htmlLang =
    typeof document !== "undefined" && document.documentElement.lang
      ? document.documentElement.lang
      : defaultLocale;

  useEffect(() => {
    Sentry.captureException(error);
    console.error("[GLOBAL_ERROR]", error);
  }, [error]);

  return (
    <html lang={htmlLang}>
      <body style={{ margin: 0, fontFamily: "sans-serif", background: "#f8fafc" }}>
        <div
          style={{
            display: "flex",
            minHeight: "100vh",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div>
            <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "#94a3b8" }}>
              Something went wrong
            </p>
            <h1 style={{ marginTop: "0.75rem", fontSize: "1.875rem", fontWeight: 600, color: "#0f172a" }}>
              An unexpected error occurred
            </h1>
            <p style={{ marginTop: "0.75rem", color: "#64748b" }}>
              Please try again or return to the home page.
            </p>
            {error.digest ? (
              <p style={{ marginTop: "0.5rem", fontSize: "0.75rem", color: "#94a3b8" }}>
                Error ID: {error.digest}
              </p>
            ) : null}
            <div style={{ marginTop: "2rem", display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={reset}
                style={{ padding: "0.75rem 1.25rem", borderRadius: "0.75rem", background: "#5b21b6", color: "#fff", fontWeight: 600, border: "none", cursor: "pointer" }}
              >
                Try again
              </button>
              <a
                href="/"
                style={{ padding: "0.75rem 1.25rem", borderRadius: "0.75rem", border: "1px solid #e2e8f0", color: "#475569", textDecoration: "none" }}
              >
                Go home
              </a>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
