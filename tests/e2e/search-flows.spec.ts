import { expect, test } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";

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

  await Promise.all([
    page.waitForURL(/\/resources\?search=worksheet/),
    searchInput.press("Enter"),
  ]);

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
  await Promise.all([
    page.waitForURL(/\/resources\?search=worksheet/),
    searchInput.press("Enter"),
  ]);

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
