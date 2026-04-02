import { expect, test } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";

test("dashboard redirects unauthenticated visitors to login with next param", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/dashboard");

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fdashboard$/);
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("admin redirects unauthenticated visitors to login with next param", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await page.goto("/admin");

  await expect(page).toHaveURL(/\/auth\/login\?next=%2Fadmin$/);
  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
