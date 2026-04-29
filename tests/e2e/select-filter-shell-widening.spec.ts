import { expect, test, type Locator } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

async function expectSelectGeometry(
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

test("admin filter-shell routes keep canonical shared select geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/activity");
  await expect(page.getByRole("heading", { name: /^Activity Log$/i })).toBeVisible();

  const activityActionFilter = page.locator("#actionFilter");
  await expect(activityActionFilter).toBeVisible();
  await expectSelectGeometry(activityActionFilter, 56, "8px");

  await page.goto("/admin/audit", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /^Audit Trail$/i })).toBeVisible();

  const auditActionFilter = page.locator("#actionFilter");
  await expect(auditActionFilter).toBeVisible();
  await expectSelectGeometry(auditActionFilter, 56, "8px");

  const auditAdminFilter = page.locator("#adminFilter");
  await expect(auditAdminFilter).toBeVisible();
  await expectSelectGeometry(auditAdminFilter, 56, "8px");

  await page.goto("/admin/analytics/ranking", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /ranking/i })).toBeVisible();

  const rankingCategoryFilter = page.locator("#category");
  await expect(rankingCategoryFilter).toBeVisible();
  await expectSelectGeometry(rankingCategoryFilter, 56, "8px");

  const rankingPriceFilter = page.locator("#price");
  await expect(rankingPriceFilter).toBeVisible();
  await expectSelectGeometry(rankingPriceFilter, 56, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
