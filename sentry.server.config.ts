import * as Sentry from "@sentry/nextjs";

const tracesSampleRate =
  Number(process.env.SENTRY_TRACES_SAMPLE_RATE) ||
  (process.env.NODE_ENV === "production" ? 0.1 : 1);

Sentry.init({
  dsn: process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN,
  enabled: Boolean(process.env.SENTRY_DSN ?? process.env.NEXT_PUBLIC_SENTRY_DSN),
  environment:
    process.env.SENTRY_ENVIRONMENT ??
    process.env.VERCEL_ENV ??
    process.env.NODE_ENV,
  release: process.env.SENTRY_RELEASE,
  tracesSampleRate,
  debug: process.env.SENTRY_DEBUG === "1",
  sendDefaultPii: false,
  ignoreTransactions: ["/api/internal/ready", "/api/internal/performance/warm"],
});
