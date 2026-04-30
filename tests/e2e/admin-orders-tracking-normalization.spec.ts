import { expect, test } from "@playwright/test";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 120_000 });

test("admin orders route drops route-owned tracking on summary metrics and table headers", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/orders");

  await expect(page.getByRole("heading", { name: /^Orders$/i })).toBeVisible();

  await expect(page.getByTestId("admin-orders-metric-revenue")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-orders-metric-today")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-orders-metric-average")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  await expect(page.getByTestId("admin-orders-col-id")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-orders-col-user")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-orders-col-status")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
