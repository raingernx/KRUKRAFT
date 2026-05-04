import type { Page } from "@playwright/test";

const IGNORABLE_DEV_CONSOLE_ERRORS = [
  /_next\/webpack-hmr/i,
  /ERR_INVALID_HTTP_RESPONSE/i,
  /^Failed to load resource: net::ERR_CONNECTION_(?:RESET|REFUSED)$/i,
  /Internal Next\.js error: Router action dispatched before initialization[\s\S]*next\/dist\/client\/dev\/hot-reloader/i,
  /\[RESOURCE_DETAIL_TIMEOUT\]/i,
  /\[RESOURCES_DISCOVER_LEAD_TIMEOUT\]/i,
  /\[RESOURCES_DISCOVER_COLLECTIONS_TIMEOUT\]/i,
  /\[next-auth\]\[error\]\[CLIENT_FETCH_ERROR\][\s\S]*\/api\/auth\/session[\s\S]*Failed to fetch/i,
  /ingest\.us\.sentry\.io[\s\S]*violates the following Content Security Policy directive/i,
  /Fetch API cannot load https:\/\/o\d+\.ingest\.us\.sentry\.io\/api\/[\s\S]*Refused to connect because it violates the document's Content Security Policy/i,
];

export function isIgnorableConsoleError(message: string) {
  return IGNORABLE_DEV_CONSOLE_ERRORS.some((pattern) => pattern.test(message));
}

export function collectRuntimeErrors(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on("pageerror", (error) => {
    const stack = typeof error.stack === "string" ? error.stack.trim() : "";
    pageErrors.push(stack.length > 0 ? stack : String(error));
  });

  page.on("console", (message) => {
    if (
      message.type() === "error" &&
      !isIgnorableConsoleError(message.text())
    ) {
      consoleErrors.push(message.text());
    }
  });

  return { pageErrors, consoleErrors };
}
