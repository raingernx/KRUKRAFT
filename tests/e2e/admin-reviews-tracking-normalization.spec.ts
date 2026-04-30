import { expect, test } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 120_000 });

test("admin reviews route drops route-owned tracking on summary metrics and table headers", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/reviews");

  await expect(page.getByRole("heading", { name: /^Reviews$/i })).toBeVisible();

  await expect(page.getByTestId("admin-reviews-metric-total")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-reviews-metric-visible")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-reviews-metric-average")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  await expect(page.getByTestId("admin-reviews-col-resource")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-reviews-col-user")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-reviews-col-actions")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
