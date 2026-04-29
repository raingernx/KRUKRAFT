import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

async function waitForCreatorEditorHydration(page: Page) {
  await page.waitForTimeout(3000);
}

async function ensureAdminDraftResource(page: Page) {
  const draftTitle = "Shared upload error probe";
  const draftResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/admin/resources/draft") &&
      response.request().method() === "POST"
    );
  });

  const titleInput = page.locator("#title");
  const previewTitle = page.getByText(draftTitle, { exact: true }).last();

  for (let attempt = 0; attempt < 5; attempt += 1) {
    await titleInput.click();
    await titleInput.fill("");
    await titleInput.pressSequentially(draftTitle, { delay: 20 });
    await titleInput.blur();

    try {
      await expect(previewTitle).toBeVisible({ timeout: 1500 });
      break;
    } catch (error) {
      if (attempt === 4) {
        throw error;
      }
      await page.waitForTimeout(1000);
    }
  }

  const draftResponse = await draftResponsePromise;
  expect(draftResponse.ok()).toBeTruthy();
  await expect(titleInput).toHaveValue(draftTitle);
  await page.waitForTimeout(500);
}

async function expectControlGeometry(
  locator: Locator,
  expectedHeight: number,
  expectedRadiusPx: string,
) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBe(expectedHeight);
  await expect(locator).toHaveCSS("border-radius", expectedRadiusPx);
}

async function attachSyntheticOversizePdf(input: Locator) {
  await input.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new Error("Expected file input element.");
    }

    const oversizeBytes = 50 * 1024 * 1024 + 1024;
    const pdfHeader = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a,
    ]);
    const file = new File([pdfHeader], "file-upload-widget-oversize.pdf", {
      type: "application/pdf",
    });

    Object.defineProperty(file, "size", {
      value: oversizeBytes,
      configurable: true,
    });

    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    element.files = dataTransfer.files;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function expectOversizeErrorFlow(
  page: Page,
  expectedUploadButtonLabel: RegExp,
  expectedErrorText: RegExp,
  afterUploadClick?: Promise<{ ok(): boolean }>,
) {
  const widget = page.getByTestId("file-upload-widget");
  const uploadButton = widget.getByTestId("file-upload-submit");
  const fileInput = widget.locator('input[type="file"][name="resourceFile"]');

  await expect(widget).toBeVisible();
  await attachSyntheticOversizePdf(fileInput);
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(uploadButton).toHaveText(expectedUploadButtonLabel);
  await expect(uploadButton).toBeEnabled();
  await expectControlGeometry(uploadButton, 40, "8px");

  await uploadButton.click();
  if (afterUploadClick) {
    const response = await afterUploadClick;
    expect(response.ok()).toBeTruthy();
  }

  const errorBanner = widget.getByTestId("file-upload-error");
  await expect(errorBanner).toBeVisible();
  await expect(errorBanner).toContainText(expectedErrorText);
  await expect(errorBanner).toHaveCSS("border-radius", "16px");
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(widget.getByTestId("file-upload-success")).toHaveCount(0);
  await expect(widget.getByTestId("file-upload-uploaded-file")).toHaveCount(0);
}

test("shared file upload widget keeps oversize error banner posture on creator create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/creator/resources/new");
  await expect(
    page.getByRole("heading", { name: /^New resource$/i }),
  ).toBeVisible();
  await waitForCreatorEditorHydration(page);
  const draftResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/resources/draft") &&
      response.request().method() === "POST"
    );
  });
  await expectOversizeErrorFlow(
    page,
    /อัปโหลดไฟล์/i,
    /File is too large\. Maximum size is 50 MB\./i,
    draftResponsePromise,
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("shared file upload widget keeps oversize error banner posture on admin create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(
    page.getByRole("heading", { name: /Create Resource/i }),
  ).toBeVisible();
  await ensureAdminDraftResource(page);
  await expectOversizeErrorFlow(
    page,
    /^Upload file$/i,
    /File is too large\. Maximum size is 50 MB\./i,
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
