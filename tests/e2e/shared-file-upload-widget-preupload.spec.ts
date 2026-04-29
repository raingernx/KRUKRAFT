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
(Krukraft widget probe) Tj
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
292
%%EOF`;

  return {
    name: "file-upload-widget-probe.pdf",
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf, "utf8"),
  };
}

async function waitForCreatorEditorHydration(page: Page) {
  await page.waitForTimeout(3000);
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

async function expectDropzoneGeometry(locator: Locator) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(132);
  await expect(locator).toHaveCSS("border-radius", "16px");
}

async function expectPreUploadWidgetState(
  page: Page,
  expectedUploadButtonLabel: RegExp,
) {
  await page.waitForTimeout(1000);

  const widget = page.getByTestId("file-upload-widget");
  const dropzone = widget.getByTestId("file-upload-dropzone");
  const uploadButton = widget.getByTestId("file-upload-submit");

  await expect(widget).toBeVisible();
  await expect(dropzone).toBeVisible();
  await expectDropzoneGeometry(dropzone);
  await expect(uploadButton).toBeDisabled();
  await expect(uploadButton).toHaveText(expectedUploadButtonLabel);
  await expectControlGeometry(uploadButton, 40, "8px");

  await widget.locator('input[type="file"][name="resourceFile"]').setInputFiles(createTinyPdfUpload());

  const selectedFile = widget.getByTestId("file-upload-selected-file");
  await expect(selectedFile).toBeVisible();
  await expect(selectedFile).toContainText("file-upload-widget-probe.pdf");
  await expect(selectedFile).toHaveCSS("border-radius", "16px");
  await expect(uploadButton).toBeEnabled();
  await expect(uploadButton).toHaveText(expectedUploadButtonLabel);
}

test("shared file upload widget keeps pre-upload posture on creator create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/creator/resources/new");
  await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
  await waitForCreatorEditorHydration(page);
  await expectPreUploadWidgetState(page, /อัปโหลดไฟล์/i);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("shared file upload widget keeps pre-upload posture on admin create route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(page.getByRole("heading", { name: /Create Resource/i })).toBeVisible();
  await expectPreUploadWidgetState(page, /^Upload file$/i);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
