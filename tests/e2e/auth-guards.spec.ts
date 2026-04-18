import { expect, test } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";

async function gotoExpectRedirect(
  page: Parameters<typeof test>[0]["page"],
  href: string,
  urlPattern: RegExp,
) {
  const redirectReached = page.waitForURL(urlPattern, {
    timeout: 60_000,
    waitUntil: "commit",
  });

  try {
    await page.goto(href, { waitUntil: "commit", timeout: 30_000 });
  } catch (error) {
    if (!(error instanceof Error) || !error.message.includes("net::ERR_ABORTED")) {
      throw error;
    }
  }

  await redirectReached;
}

test("dashboard redirects unauthenticated visitors to login with next param", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await gotoExpectRedirect(
    page,
    "/dashboard",
    /\/auth\/login\?next=%2Fdashboard(?:$|&)/,
  );
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("admin redirects unauthenticated visitors to login with next param", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await gotoExpectRedirect(page, "/admin", /\/auth\/login\?next=%2Fadmin(?:$|&)/);
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
