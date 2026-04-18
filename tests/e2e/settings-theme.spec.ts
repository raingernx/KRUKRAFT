import { expect, test, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";

const CREATOR_EMAIL = "demo.instructor@krukraft.dev";
const DASHBOARD_SETTINGS_HEADING = /Account settings/i;

function isRetryableGotoError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("ERR_ABORTED") ||
    message.includes("ERR_CONNECTION_RESET") ||
    message.includes("ERR_CONNECTION_REFUSED") ||
    message.includes("Timeout 30000ms exceeded") ||
    message.includes("Timeout 60000ms exceeded") ||
    message.includes("frame was detached") ||
    message.includes("Navigation failed because page was closed")
  );
}

async function gotoWithRetry(path: string, page: Page, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await page.goto(path, {
        waitUntil: "commit",
        timeout: 60_000,
      });
      return;
    } catch (error) {
      if (!isRetryableGotoError(error) || attempt === attempts - 1) {
        throw error;
      }

      await page.waitForTimeout(500);
    }
  }
}

async function setUserThemePreference(email: string, theme: "light" | "dark" | "system") {
  const prisma = new PrismaClient();

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      throw new Error(`User not found for theme preference seed: ${email}`);
    }

    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: { theme },
      create: {
        userId: user.id,
        language: "th",
        theme,
        currency: "USD",
        timezone: "UTC",
        emailNotifications: true,
        purchaseReceipts: true,
        productUpdates: true,
        marketingEmails: false,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

test("settings follows system runtime theme when DB preference differs from stored preference", async ({
  page,
}) => {
  test.setTimeout(60_000);

  await setUserThemePreference(CREATOR_EMAIL, "dark");
  await page.emulateMedia({ colorScheme: "light" });

  await page.addInitScript(() => {
    window.localStorage.removeItem("user_theme");
  });

  await loginAsCreator(page, "/resources");

  await expect(page).toHaveURL(/\/resources$/);
  await expect
    .poll(() => page.locator("html").getAttribute("data-theme"), {
      timeout: 20_000,
    })
    .toBe("light");

  await gotoWithRetry("/dashboard/settings", page);

  await expect(page).toHaveURL(/\/dashboard\/settings$/);
  await expect(page.locator('[data-route-shell-ready="dashboard-settings"]').first()).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("heading", { name: DASHBOARD_SETTINGS_HEADING })).toBeVisible({
    timeout: 30_000,
  });
  await expect
    .poll(() => page.locator("html").getAttribute("data-theme"), {
      timeout: 20_000,
    })
    .toBe("light");
  await expect(page.locator("#preference-theme")).toHaveValue("dark");
  await expect(page.locator("#settings-preferences")).not.toContainText(/Language/i);
});
