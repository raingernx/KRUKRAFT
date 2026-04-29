import { expect, test, type Locator } from "@playwright/test";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

async function expectControlGeometry(
  locator: Locator,
  expectedHeight: number,
  expectedRadiusPx: string,
) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBe(expectedHeight);
  await expect(locator).toHaveCSS("border-radius", expectedRadiusPx);
}

test.describe.configure({ timeout: 120_000 });

test("dashboard library toolbar search keeps canonical shared search-input geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/library");

  const searchInput = page.locator('input[name="q"]');
  await expect(searchInput).toBeVisible();
  await expectControlGeometry(searchInput, 56, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("dashboard topbar search keeps rounded-rect override on canonical radius", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/library");

  const searchInput = page.locator("#dashboard-search");
  await expect(searchInput).toBeVisible();
  await expectControlGeometry(searchInput, 44, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("dashboard topbar search exposes clear action after typing and clears locally", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/library");
  await page.waitForTimeout(3000);

  const searchInput = page.locator("#dashboard-search");
  await expect(searchInput).toBeVisible();
  await searchInput.fill("algebra");

  const clearButton = page.getByRole("button", { name: "Clear search" });
  await expect(clearButton).toBeVisible();
  await expect(clearButton).toHaveCSS("border-radius", "8px");

  await clearButton.click();
  await expect(searchInput).toHaveValue("");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("admin users filter input keeps canonical shared field radius", async ({ page }) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/users");

  const searchInput = page.locator("#q");
  await expect(searchInput).toBeVisible();
  await expectControlGeometry(searchInput, 56, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
