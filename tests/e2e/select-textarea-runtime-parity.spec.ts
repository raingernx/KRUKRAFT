import { expect, test, type Locator } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";
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

test("admin settings keeps canonical shared select and textarea geometry", async ({ page }) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/settings");

  const select = page.locator("#defaultCurrency");
  await expect(select).toBeVisible();
  await expectControlGeometry(select, 56, "8px");

  const textarea = page.locator("#platformDescription");
  await expect(textarea).toBeVisible();
  await expect(textarea).toHaveCSS("border-radius", "8px");

  const box = await textarea.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(120);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
