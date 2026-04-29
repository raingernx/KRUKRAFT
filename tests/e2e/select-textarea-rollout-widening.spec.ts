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

test("admin resources family keeps widened shared select and textarea geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(page.getByRole("heading", { name: /^Create Resource$/i })).toBeVisible();

  const categorySelect = page.locator("#categoryId");
  await expect(categorySelect).toBeVisible();
  await expectControlGeometry(categorySelect, 56, "8px");

  const descriptionTextarea = page.locator("#description");
  await expect(descriptionTextarea).toBeVisible();
  await expect(descriptionTextarea).toHaveCSS("border-radius", "8px");

  let box = await descriptionTextarea.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(120);

  await page.goto("/admin/resources/bulk", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /^Bulk Upload$/i })).toBeVisible();

  const bulkTextarea = page.locator('textarea[data-slot="textarea"]').first();
  await expect(bulkTextarea).toBeVisible();
  await expect(bulkTextarea).toHaveCSS("border-radius", "8px");

  box = await bulkTextarea.boundingBox();
  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(360);

  await page.goto("/admin/resources", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /^Resources$/i })).toBeVisible();

  const statusFilter = page.locator("#status");
  await expect(statusFilter).toBeVisible();
  await expectControlGeometry(statusFilter, 56, "8px");

  const categoryFilter = page.locator("#categoryId");
  await expect(categoryFilter).toBeVisible();
  await expectControlGeometry(categoryFilter, 56, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
