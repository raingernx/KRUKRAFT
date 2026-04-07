import { expect, test, type Locator, type Page } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";

const SEARCH_NAV_TIMEOUT_MS = 15_000;

async function submitSearchAndWait(
  page: Page,
  searchInput: Locator,
  targetUrl: RegExp,
) {
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const urlWait = page.waitForURL(targetUrl, {
      timeout: 5_000,
      waitUntil: "commit",
    });

    try {
      await searchInput.press("Enter");
      await urlWait;
      return;
    } catch {
      // Retry once when the first Enter lands before the client router fully
      // commits the query-string navigation on CI.
    }
  }

  await page.waitForURL(targetUrl, {
    timeout: SEARCH_NAV_TIMEOUT_MS,
    waitUntil: "commit",
  });
}

test("resources search focus opens quick browse and stores recent searches", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.addInitScript(() => {
    window.localStorage.removeItem("marketplace_recent_searches");
  });

  await page.goto("/resources");

  const searchInput = page.getByRole("combobox", { name: "Search resources" });

  await searchInput.click();

  await expect(page.getByText("ลัดไปที่")).toBeVisible();
  await expect(page.getByRole("button", { name: "ยอดนิยมตอนนี้" })).toBeVisible();
  await expect(page.getByText("เลือกดูตามหมวด")).toBeVisible();

  await searchInput.fill("worksheet");
  await submitSearchAndWait(page, searchInput, /\/resources\?search=worksheet/);

  await searchInput.fill("");
  await searchInput.click();

  await expect(page.getByText("ค้นหาล่าสุด")).toBeVisible();
  await expect(
    page.getByRole("button", { name: "worksheet", exact: true }),
  ).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("resources top-bar search submit navigates to canonical results route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/resources");

  const searchInput = page.getByRole("combobox", { name: "Search resources" });

  await searchInput.fill("worksheet");
  await submitSearchAndWait(page, searchInput, /\/resources\?search=worksheet/);

  await expect(page.getByText("Search results").first()).toBeVisible();
  await expect(page.getByText("Showing results for").first()).toBeVisible();
  await expect(searchInput).toHaveValue("worksheet");
  await expect(page.locator("main article").first()).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("resources search results route renders canonical results flow", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/resources?search=worksheet");

  await expect(page).toHaveURL(/search=worksheet/);
  await expect(page.getByText("Search results").first()).toBeVisible();
  await expect(page.getByText("Showing results for").first()).toBeVisible();
  await expect(page.locator("main article").first()).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("resources no-results flow shows recovery actions", async ({ page }) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/resources?search=zzzznotfound123");

  await expect(page).toHaveURL(/search=zzzznotfound123/);
  await expect(page.getByText("Search results").first()).toBeVisible();
  await expect(page.getByText(/ยังไม่พบผลลัพธ์สำหรับ/).first()).toBeVisible();
  await expect(page.getByText("Try these searches").first()).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Return to discover" }).first(),
  ).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
