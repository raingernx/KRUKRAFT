import { expect, type Page } from "@playwright/test";

type LoginCredentials = {
  email: string;
  password: string;
};

const AUTH_NAVIGATION_TIMEOUT_MS = 120_000;

const ADMIN_CREDENTIALS: LoginCredentials = {
  email: "admin@studyplatform.dev",
  password: "admin123!",
};

const CREATOR_CREDENTIALS: LoginCredentials = {
  email: "demo.instructor@krucraft.dev",
  password: "KruCraft2024!",
};

async function loginWithCredentials(
  page: Page,
  credentials: LoginCredentials,
  nextPath: string,
) {
  await page.goto(`/auth/login?next=${encodeURIComponent(nextPath)}`);

  await expect(page.getByRole("heading", { name: /Welcome back/i })).toBeVisible();
  await page.getByLabel("Email address").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);

  await Promise.all([
    page.waitForURL(
      new RegExp(`${nextPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|\\?)`),
      {
        timeout: AUTH_NAVIGATION_TIMEOUT_MS,
        waitUntil: "commit",
      },
    ),
    page.getByRole("button", { name: "Sign in" }).click(),
  ]);
}

export async function loginAsAdmin(page: Page, nextPath: string) {
  await loginWithCredentials(page, ADMIN_CREDENTIALS, nextPath);
}

export async function loginAsCreator(page: Page, nextPath: string) {
  await loginWithCredentials(page, CREATOR_CREDENTIALS, nextPath);
}
