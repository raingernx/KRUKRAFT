import { expect, test } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";
import { expectImageLoaded } from "./helpers/images";

test("resource detail renders the primary preview image without refresh", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/resources/english-vocabulary-flashcards-500-essential-words");

  await expect(page).toHaveURL(
    /\/resources\/english-vocabulary-flashcards-500-essential-words$/,
  );

  const heading = page.locator("main h1").first();
  await expect(heading).toBeVisible();
  await expect(heading).not.toHaveText("");

  const primaryPreview = page.locator("main img").first();
  await expectImageLoaded(primaryPreview);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
