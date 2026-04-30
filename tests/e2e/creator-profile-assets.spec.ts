import { expect, test, type Page } from "@playwright/test";

import { loginAsCreator } from "./helpers/auth";

const TINY_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAusB9Wn8nS8AAAAASUVORK5CYII=";

function assetKey(value: string) {
  try {
    const parsed = new URL(value, "http://127.0.0.1:3000");
    const parts = parsed.pathname.split("/").filter(Boolean);
    return parts.at(-1) ?? value;
  } catch {
    return value.split("/").filter(Boolean).at(-1) ?? value;
  }
}

function pickUploadedAssetUrl(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidates = [record.url, record.imageUrl, record.fileUrl, record.location];

  return candidates.find((value): value is string => typeof value === "string" && value.length > 0) ?? null;
}

async function resolveUtilityColor(page: Page, className: string) {
  return page.evaluate((utilityClassName) => {
    const probe = document.createElement("div");
    probe.className = utilityClassName;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, className);
}

test("creator profile uploads store avatar and banner assets that reach the public page", async ({
  page,
}) => {
  test.setTimeout(300_000);

  await loginAsCreator(page, "/dashboard/creator/profile");

  await expect(page.locator('[data-route-shell-ready="dashboard-creator-profile"]').first()).toBeVisible({
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
  await expect(page.getByRole("button", { name: /save creator profile/i })).toBeVisible();

  const successColor = await resolveUtilityColor(page, "text-success-700");
  const dangerColor = await resolveUtilityColor(page, "text-danger-700");

  const avatarUrlInput = page.getByRole("textbox", { name: /store avatar url/i });
  const bannerUrlInput = page.getByRole("textbox", { name: /banner url/i });

  const avatarBuffer = Buffer.from(TINY_PNG_BASE64, "base64");
  const bannerBuffer = Buffer.from(TINY_PNG_BASE64, "base64");

  const avatarUploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/upload/image") &&
      response.request().method() === "POST"
    );
  });
  await page.getByTestId("creator-avatar-upload-input").setInputFiles({
    name: "creator-avatar-test.png",
    mimeType: "image/png",
    buffer: avatarBuffer,
  });
  const avatarUploadResponse = await avatarUploadResponsePromise;
  expect(avatarUploadResponse.ok()).toBeTruthy();
  const uploadedAvatarUrl = pickUploadedAssetUrl(
    await avatarUploadResponse.json().catch(() => null),
  );
  if (uploadedAvatarUrl) {
    await expect(avatarUrlInput).toHaveValue(uploadedAvatarUrl, {
      timeout: 30_000,
    });
  } else {
    await expect(avatarUrlInput).not.toHaveValue("", { timeout: 30_000 });
  }
  await expect(avatarUrlInput).not.toBeDisabled({ timeout: 30_000 });
  await expect(page.getByText(/Store avatar ready to save\./i)).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByTestId("creator-profile-avatar-status")).toHaveCSS("color", successColor);

  const bannerUploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/upload/image") &&
      response.request().method() === "POST"
    );
  });
  await page.getByTestId("creator-banner-upload-input").setInputFiles({
    name: "creator-banner-test.png",
    mimeType: "image/png",
    buffer: bannerBuffer,
  });
  const bannerUploadResponse = await bannerUploadResponsePromise;
  expect(bannerUploadResponse.ok()).toBeTruthy();
  const uploadedBannerUrl = pickUploadedAssetUrl(
    await bannerUploadResponse.json().catch(() => null),
  );
  if (uploadedBannerUrl) {
    await expect(bannerUrlInput).toHaveValue(uploadedBannerUrl, {
      timeout: 30_000,
    });
  } else {
    await expect(bannerUrlInput).not.toHaveValue("", { timeout: 30_000 });
  }
  await expect(bannerUrlInput).not.toBeDisabled({ timeout: 30_000 });
  await expect(page.getByText(/Banner ready to save\./i)).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByTestId("creator-profile-banner-status")).toHaveCSS("color", successColor);

  await page.getByRole("button", { name: /save creator profile/i }).click();
  const successFeedback = page.getByTestId("creator-profile-feedback-success");
  await expect(successFeedback).toBeVisible({
    timeout: 30_000,
  });
  await expect(successFeedback).toHaveCSS("color", successColor);

  const profileResponse = await page.request.get("http://127.0.0.1:3000/api/creator/profile");
  expect(profileResponse.ok()).toBeTruthy();
  const profilePayload = (await profileResponse.json()) as {
    data?: {
      creatorAvatar?: string | null;
      creatorBanner?: string | null;
      creatorSlug?: string | null;
      creatorDisplayName?: string | null;
    };
  };

  const creatorAvatar = profilePayload.data?.creatorAvatar ?? null;
  const creatorBanner = profilePayload.data?.creatorBanner ?? null;
  const creatorSlug = profilePayload.data?.creatorSlug ?? null;

  expect(creatorAvatar).toBeTruthy();
  expect(creatorBanner).toBeTruthy();
  expect(creatorSlug).toBeTruthy();

  const avatarKey = assetKey(creatorAvatar!);
  const bannerKey = assetKey(creatorBanner!);

  await page.goto(`/creators/${creatorSlug}`);
  await expect(page).toHaveURL(new RegExp(`/creators/${creatorSlug}$`));
  await expect(
    page.getByRole("heading", {
      name: new RegExp(profilePayload.data?.creatorDisplayName ?? "Kru Mint", "i"),
    }),
  ).toBeVisible({
    timeout: 30_000,
  });

  const imgSources = await page.locator("img").evaluateAll((images) =>
    images
      .map((image) => image.getAttribute("src"))
      .filter((value): value is string => Boolean(value)),
  );

  expect(imgSources.some((src) => src.includes(avatarKey))).toBeTruthy();
  expect(imgSources.some((src) => src.includes(bannerKey))).toBeTruthy();
});

test("creator profile keeps semantic danger feedback when profile save fails", async ({
  page,
}) => {
  test.setTimeout(180_000);

  await loginAsCreator(page, "/dashboard/creator/profile");

  await expect(
    page.locator('[data-creator-profile-form-ready="true"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });

  const dangerColor = await resolveUtilityColor(page, "text-danger-700");

  await page.route("**/api/creator/profile", async (route) => {
    if (route.request().method() !== "PATCH") {
      await route.continue();
      return;
    }

    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Failed to update creator profile." }),
    });
  });

  const displayNameInput = page.getByRole("textbox", { name: /display name/i });
  await displayNameInput.fill(`Kru Mint ${Date.now()}`);
  await page.getByRole("button", { name: /save creator profile/i }).click();

  const errorFeedback = page.getByTestId("creator-profile-feedback-error");
  await expect(errorFeedback).toBeVisible({ timeout: 30_000 });
  await expect(errorFeedback).toHaveText(/failed to update creator profile\./i);
  await expect(errorFeedback).toHaveCSS("color", dangerColor);
});
