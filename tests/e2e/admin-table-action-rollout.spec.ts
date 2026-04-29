import { expect, test, type Locator } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

async function expectButtonGeometry(
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

test("admin table action rollout keeps users/audit on md and tags compact", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/users");
  await expect(page.getByRole("heading", { name: /^Users$/i })).toBeVisible();

  const usersViewAction = page.locator("tbody tr").first().getByRole("button", {
    name: /^View$/i,
  });
  await expect(usersViewAction).toBeVisible();
  await expectButtonGeometry(usersViewAction, 40, "8px");

  await page.goto("/admin/tags", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /^Tag Management$/i })).toBeVisible();

  const tagsEditAction = page.locator("tbody tr").first().getByRole("button", {
    name: /^Edit$/i,
  });
  await expect(tagsEditAction).toBeVisible();
  await expectButtonGeometry(tagsEditAction, 32, "8px");

  await page.goto("/admin/audit", { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: /^Audit Trail$/i })).toBeVisible();

  const previousPageButton = page.getByRole("button", { name: /^Previous$/i }).first();
  await expect(previousPageButton).toBeVisible();
  await expectButtonGeometry(previousPageButton, 40, "8px");

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
