import { expect, type Page } from "@playwright/test";

type LoginCredentials = {
  email: string;
  password: string;
};

const AUTH_NAVIGATION_TIMEOUT_MS = 120_000;
const LOGIN_ERROR_TEXT = "Invalid email or password. Please try again.";

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

  const targetUrlPattern = new RegExp(
    `${nextPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:$|\\?)`,
  );
  const submitButton = page.getByRole("button", { name: "Sign in" });
  const loginError = page.getByText(LOGIN_ERROR_TEXT);

  await submitButton.click();

  try {
    await page.waitForURL(targetUrlPattern, {
      timeout: AUTH_NAVIGATION_TIMEOUT_MS,
      waitUntil: "commit",
    });
  } catch (error) {
    const visibleLoginError = (await loginError.isVisible().catch(() => false))
      ? await loginError.textContent()
      : null;
    const currentUrl = page.url();
    const buttonEnabled = await submitButton.isEnabled().catch(() => false);

    throw new Error(
      [
        `Credential login did not navigate to ${nextPath}.`,
        `Current URL: ${currentUrl}.`,
        `Visible login error: ${visibleLoginError?.trim() ?? "none"}.`,
        `Submit button enabled: ${buttonEnabled}.`,
        `Underlying error: ${error instanceof Error ? error.message : String(error)}`,
      ].join(" "),
    );
  }
}

export async function loginAsAdmin(page: Page, nextPath: string) {
  await loginWithCredentials(page, ADMIN_CREDENTIALS, nextPath);
}

export async function loginAsCreator(page: Page, nextPath: string) {
  await loginWithCredentials(page, CREATOR_CREDENTIALS, nextPath);
}
