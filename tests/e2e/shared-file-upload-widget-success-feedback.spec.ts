import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

function createTinyPdfUpload() {
  const pdf = `%PDF-1.4
1 0 obj
<< /Type /Catalog /Pages 2 0 R >>
endobj
2 0 obj
<< /Type /Pages /Kids [3 0 R] /Count 1 >>
endobj
3 0 obj
<< /Type /Page /Parent 2 0 R /MediaBox [0 0 200 200] /Contents 4 0 R >>
endobj
4 0 obj
<< /Length 35 >>
stream
BT
/F1 12 Tf
72 120 Td
(Krukraft widget success probe) Tj
ET
endstream
endobj
xref
0 5
0000000000 65535 f 
0000000010 00000 n 
0000000063 00000 n 
0000000122 00000 n 
0000000208 00000 n 
trailer
<< /Root 1 0 R /Size 5 >>
startxref
300
%%EOF`;

  return {
    name: "file-upload-widget-success.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf, "utf8"),
  };
}

async function waitForCreatorEditorHydration(page: Page) {
  await page.waitForTimeout(3000);
}

async function ensureAdminDraftResource(page: Page) {
  const draftTitle = "Shared upload success probe";
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

async function expectSuccessFlow(
  page: Page,
  expectedUploadButtonLabel: RegExp,
  expectedSuccessText: RegExp,
  uploadRouteFragment: string,
) {
  await page.waitForTimeout(1000);

  const widget = page.getByTestId("file-upload-widget");
  const uploadButton = widget.getByTestId("file-upload-submit");

  await expect(widget).toBeVisible();
  await widget.locator('input[type="file"][name="resourceFile"]').setInputFiles(createTinyPdfUpload());
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(uploadButton).toHaveText(expectedUploadButtonLabel);
  await expect(uploadButton).toBeEnabled();
  await expectControlGeometry(uploadButton, 40, "8px");

  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(uploadRouteFragment) &&
      response.request().method() === "POST"
    );
  });

  await uploadButton.click();
  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.ok()).toBeTruthy();

  const successBanner = widget.getByTestId("file-upload-success");
  await expect(successBanner).toBeVisible();
  await expect(successBanner).toContainText(expectedSuccessText);
  await expect(successBanner).toHaveCSS("border-radius", "16px");
  await expect(widget.getByTestId("file-upload-uploaded-file")).toBeVisible();
}

test("shared file upload widget keeps success banner posture on creator create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/creator/resources/new");
  await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
  await waitForCreatorEditorHydration(page);
  await expectSuccessFlow(
    page,
    /อัปโหลดไฟล์/i,
    /อัปโหลดไฟล์เรียบร้อยแล้ว/i,
    "/api/creator/resources/upload",
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("shared file upload widget keeps success banner posture on admin create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(page.getByRole("heading", { name: /Create Resource/i })).toBeVisible();
  await ensureAdminDraftResource(page);
  await expectSuccessFlow(
    page,
    /^Upload file$/i,
    /File uploaded successfully\./i,
    "/api/admin/resources/upload",
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
