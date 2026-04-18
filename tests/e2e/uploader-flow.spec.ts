import { expect, test, type Locator, type Page } from "@playwright/test";
import { collectRuntimeErrors } from "./helpers/browser";
import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { createTinyPngUpload } from "./helpers/images";

test.describe.configure({ timeout: 180_000 });

const TARGET_NAVIGATION_TIMEOUT_MS = 120_000;
const POST_UPLOAD_READY_TIMEOUT_MS = 60_000;
const LAZY_UPLOADER_BUTTON_NAME = /Load image uploader|Select preview images to upload/i;

type UploaderFlowConfig = {
  targetPath: string;
  headingName: RegExp;
  uploaderLabel?: string | RegExp;
  uploadRouteFragment: string;
  postUploadReadyName?: string | RegExp | false;
};

function isRetryableGotoError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("net::ERR_ABORTED") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes("Timeout 30000ms exceeded") ||
    message.includes("Timeout 60000ms exceeded") ||
    message.includes("Timeout 120000ms exceeded") ||
    message.includes("frame was detached") ||
    message.includes("Navigation failed because page was closed")
  );
}

async function gotoWithRetry(page: Page, path: string, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await page.goto(path, {
        timeout: TARGET_NAVIGATION_TIMEOUT_MS,
        waitUntil: "commit",
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

function pickUploadedAssetUrl(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const record = payload as Record<string, unknown>;
  const candidates = [record.url, record.imageUrl, record.fileUrl, record.location];

  return candidates.find((value): value is string => typeof value === "string" && value.length > 0) ?? null;
}

async function findFirstVisibleMatch(
  locator: Locator,
  timeout = 20_000,
) {
  let visibleIndex = -1;

  await expect
    .poll(
      async () => {
        const count = await locator.count();

        for (let index = 0; index < count; index += 1) {
          if (await locator.nth(index).isVisible().catch(() => false)) {
            visibleIndex = index;
            return index;
          }
        }

        return -1;
      },
      { timeout },
    )
    .toBeGreaterThan(-1);

  return locator.nth(visibleIndex);
}

async function verifyUploaderFlow(
  page: Page,
  config: UploaderFlowConfig,
) {
  await gotoWithRetry(page, config.targetPath);

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  const uploaderRoot = page.getByTestId("preview-image-uploader");

  await expect(page).toHaveURL(
    new RegExp(config.targetPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")),
    { timeout: TARGET_NAVIGATION_TIMEOUT_MS },
  );
  await expect(page.getByRole("heading", { name: config.headingName })).toBeVisible({
    timeout: TARGET_NAVIGATION_TIMEOUT_MS,
  });

  await uploaderRoot.scrollIntoViewIfNeeded();
  await expect(uploaderRoot).toBeVisible();

  if (config.uploaderLabel) {
    const uploaderHeading = await findFirstVisibleMatch(
      typeof config.uploaderLabel === "string"
        ? page.getByText(config.uploaderLabel)
        : page.getByText(config.uploaderLabel),
    );

    await uploaderHeading.scrollIntoViewIfNeeded();
    await expect(uploaderHeading).toBeVisible();
  }

  const imageFileInputs = uploaderRoot.locator('input[type="file"][accept="image/*"]');
  const beforeInputCount = await imageFileInputs.count();

  if (beforeInputCount === 0) {
    const lazyShell = uploaderRoot
      .getByRole("button", { name: LAZY_UPLOADER_BUTTON_NAME })
      .first();
    const shellVisible = await lazyShell.isVisible({ timeout: 1_500 }).catch(
      () => false,
    );

    if (shellVisible) {
      await lazyShell.scrollIntoViewIfNeeded().catch(() => {});
      await lazyShell.hover().catch(() => {});
      await lazyShell.focus().catch(() => {});

      try {
        await expect
          .poll(async () => imageFileInputs.count(), { timeout: 5_000 })
          .toBeGreaterThan(0);
      } catch {
        try {
          await lazyShell.click({ timeout: 2_000 });
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          if (
            !message.includes("detached from the DOM") &&
            !message.includes("waiting for locator") &&
            !message.includes("element is not attached") &&
            !message.includes("Target page, context or browser has been closed")
          ) {
            throw error;
          }
        }
      }
    }
  }

  await expect
    .poll(async () => imageFileInputs.count(), { timeout: 20_000 })
    .toBeGreaterThan(0);

  pageErrors.length = 0;
  consoleErrors.length = 0;

  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(config.uploadRouteFragment) &&
      response.request().method() === "POST"
    );
  });

  const mountedUploaderButton = uploaderRoot
    .getByRole("button", { name: /Select preview images to upload/i })
    .first();
  const mountedUploaderButtonVisible = await mountedUploaderButton
    .isVisible({ timeout: 1_500 })
    .catch(() => false);

  if (mountedUploaderButtonVisible) {
    const [fileChooser] = await Promise.all([
      page.waitForEvent("filechooser"),
      mountedUploaderButton.click(),
    ]);

    await fileChooser.setFiles(createTinyPngUpload());
  } else {
    const uploaderInputCount = await imageFileInputs.count();
    await imageFileInputs
      .nth(Math.max(uploaderInputCount - 1, 0))
      .setInputFiles(createTinyPngUpload());
  }

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.ok()).toBeTruthy();
  const uploadedAssetUrl = pickUploadedAssetUrl(await uploadResponse.json().catch(() => null));

  if (uploadedAssetUrl) {
    await expect(page.getByText(uploadedAssetUrl).first()).toBeVisible({
      timeout: POST_UPLOAD_READY_TIMEOUT_MS,
    });
  }

  if (config.postUploadReadyName) {
    await expect(
      typeof config.postUploadReadyName === "string"
        ? page.getByRole("button", { name: config.postUploadReadyName })
        : page.getByRole("button", { name: config.postUploadReadyName }),
    ).toHaveCount(1, { timeout: POST_UPLOAD_READY_TIMEOUT_MS });
  } else if (config.postUploadReadyName !== false) {
    await expect(page.getByRole("button", { name: "Remove image" })).toHaveCount(1, {
      timeout: POST_UPLOAD_READY_TIMEOUT_MS,
    });
  }
  await expect(page.getByText("Cover").first()).toBeVisible({
    timeout: POST_UPLOAD_READY_TIMEOUT_MS,
  });

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
}

test("admin preview uploader activates lazily and uploads an image after login", async ({
  page,
}) => {
  await loginAsAdmin(page, "/resources");

  await verifyUploaderFlow(page, {
    targetPath: "/admin/resources/new",
    headingName: /Create Resource/i,
    uploaderLabel: "Preview images",
    uploadRouteFragment: "/api/admin/upload/image",
    postUploadReadyName: "Remove image",
  });
});

test("creator preview uploader activates lazily and uploads an image after login", async ({
  page,
}) => {
  await loginAsCreator(page, "/resources");

  await verifyUploaderFlow(page, {
    targetPath: "/dashboard/creator/resources/new",
    headingName: /Create your first resource|New resource/i,
    uploaderLabel: /Delivery and previews|MARKETPLACE PREVIEW|Add a preview image/i,
    uploadRouteFragment: "/api/creator/upload/image",
    postUploadReadyName: false,
  });
});
