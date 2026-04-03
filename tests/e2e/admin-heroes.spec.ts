import { expect, test } from "@playwright/test";
import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test("admin hero editor uses the shared hero preview and keeps advanced controls collapsed", async ({
  page,
}) => {
  test.setTimeout(180_000);

  await loginAsAdmin(page, "/admin/heroes/new");
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await expect(page).toHaveURL(/\/admin\/heroes\/new$/);
  await expect(page.getByText("Live preview")).toBeVisible();
  await expect(
    page.locator('[data-hero-surface="discover"]').first(),
  ).toBeVisible();

  const advancedAppearance = page
    .locator("details")
    .filter({ has: page.getByText("Advanced appearance") })
    .first();
  await expect(advancedAppearance).toBeVisible();
  await expect(advancedAppearance).not.toHaveAttribute("open", "");

  await advancedAppearance.locator("summary").click();
  await expect(page.getByLabel("Text alignment")).toBeVisible();
  await expect(page.getByLabel(/Overlay opacity/)).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
