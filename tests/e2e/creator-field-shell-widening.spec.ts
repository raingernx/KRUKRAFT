import { expect, test, type Locator } from "@playwright/test";

import { loginAsCreator } from "./helpers/auth";
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

test("creator profile/settings keeps widened shared select and textarea geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/creator/profile");
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-profile"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("heading", { name: /^Profile$/i }).first()).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.locator('[data-creator-profile-form-ready="true"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });

  const creatorStatus = page.locator("#creator-status");
  await expect(creatorStatus).toBeVisible();
  await expectControlGeometry(creatorStatus, 56, "8px");

  const creatorBio = page.locator("#creator-bio");
  await expect(creatorBio).toBeVisible();
  await expect(creatorBio).toHaveCSS("border-radius", "8px");

  const bioBox = await creatorBio.boundingBox();
  expect(bioBox).not.toBeNull();
  expect(Math.round(bioBox?.height ?? 0)).toBeGreaterThanOrEqual(144);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
