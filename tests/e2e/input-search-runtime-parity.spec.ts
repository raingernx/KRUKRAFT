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
  const startAdornment = searchInput
    .locator("xpath=..")
    .getByTestId("search-input-start-adornment");
  await expect(searchInput).toBeVisible();
  await expectControlGeometry(searchInput, 56, "8px");
  await expect(startAdornment).toBeVisible();
  await expectControlGeometry(startAdornment, 56, "0px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("dashboard topbar search keeps rounded-rect override on canonical radius", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/library");

  const searchInput = page.locator("#dashboard-search");
  const startAdornment = searchInput
    .locator("xpath=..")
    .getByTestId("search-input-start-adornment");
  await expect(searchInput).toBeVisible();
  await expectControlGeometry(searchInput, 44, "8px");
  await expect(startAdornment).toBeVisible();
  await expectControlGeometry(startAdornment, 44, "0px");

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
  const clearButton = searchInput.locator("xpath=..").getByTestId("search-input-clear");
  await expect(searchInput).toBeVisible();
  await searchInput.fill("algebra");

  await expect(clearButton).toBeVisible();
  await expect(clearButton).toHaveCSS("border-radius", "8px");

  await clearButton.click();
  await expect(searchInput).toHaveValue("");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("dashboard library intro uses eyebrow text and medium CTA sizing", async ({ page }) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/library");

  const intro = page.locator("section").filter({
    has: page.getByRole("heading", { name: "My library" }),
  });
  const eyebrow = intro.getByTestId("dashboard-page-eyebrow");
  const cta = intro.getByRole("link", { name: "Browse marketplace" });

  await expect(eyebrow).toHaveText("Library");
  await expect(cta).toBeVisible();
  await expect(cta).toHaveAttribute("data-size", "md");
  await expectControlGeometry(cta, 40, "999px");

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
