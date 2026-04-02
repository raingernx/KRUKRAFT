import { expect, test } from "@playwright/test";
import { expectNoAxeViolations } from "./helpers/a11y";
import { collectRuntimeErrors } from "./helpers/browser";
import { expectImageLoaded } from "./helpers/images";

test("resources homepage renders and reveals at least one card image", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/resources");

  await expect(page).toHaveURL(/\/resources$/);
  await expect(
    page.getByRole("link", { name: /Home/i }).first(),
  ).toBeVisible();
  await expect(page.getByText("Trending now").first()).toBeVisible();

  const firstCardImage = page.locator("main article img").first();
  await expectImageLoaded(firstCardImage);

  await expectNoAxeViolations(page, { include: ["main"] });

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
