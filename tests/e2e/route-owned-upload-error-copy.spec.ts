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
(Krukraft save-first probe) Tj
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
    name: "file-upload-save-first-probe.pdf",
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

async function selectDraftUploadProbeFile(page: Page) {
  await page.waitForTimeout(1000);

  const widget = page.getByTestId("file-upload-widget");
  const uploadButton = widget.getByTestId("file-upload-submit");

  await expect(widget).toBeVisible();
  await widget.scrollIntoViewIfNeeded();
  await widget
    .locator('input[type="file"][name="resourceFile"]')
    .setInputFiles(createTinyPdfUpload());
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(widget.getByTestId("file-upload-selected-file")).toContainText(
    "file-upload-save-first-probe.pdf",
  );
  await expect(uploadButton).toBeEnabled();
  await expectControlGeometry(uploadButton, 40, "8px");

  return { widget, uploadButton };
}

async function expectSaveFirstErrorState(
  widget: Locator,
  uploadButton: Locator,
  expectedErrorText: RegExp,
) {
  const errorBanner = widget.getByTestId("file-upload-error");

  await expect(errorBanner).toBeVisible();
  await expect(errorBanner).toContainText(expectedErrorText);
  await expect(errorBanner).toHaveCSS("border-radius", "16px");
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(uploadButton).toBeEnabled();
  await expect(widget.getByTestId("file-upload-success")).toHaveCount(0);
  await expect(widget.getByTestId("file-upload-uploaded-file")).toHaveCount(0);
}

function expectNoUnexpectedConsoleErrors(
  consoleErrors: string[],
  allowedErrors: RegExp[],
) {
  const unexpectedErrors = consoleErrors.filter((message) => {
    return !allowedErrors.some((pattern) => pattern.test(message));
  });

  expect(unexpectedErrors).toEqual([]);
}

test("creator create route surfaces route-owned draft-create failure copy before upload", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  let uploadRequests = 0;

  page.on("request", (request) => {
    if (
      request.url().includes("/api/creator/resources/upload") &&
      request.method() === "POST"
    ) {
      uploadRequests += 1;
    }
  });

  await page.route("**/api/creator/resources/draft", async (route) => {
    await route.fulfill({
      status: 503,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "ยังไม่สามารถสร้างฉบับร่างได้ชั่วคราว เพราะระบบฐานข้อมูลเชื่อมต่อไม่ได้",
      }),
    });
  });

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

  const { widget, uploadButton } = await selectDraftUploadProbeFile(page);
  await uploadButton.click();

  const draftResponse = await draftResponsePromise;
  expect(draftResponse.status()).toBe(503);
  await expectSaveFirstErrorState(
    widget,
    uploadButton,
    /ยังไม่สามารถสร้างฉบับร่างได้ชั่วคราว เพราะระบบฐานข้อมูลเชื่อมต่อไม่ได้/i,
  );
  expect(uploadRequests).toBe(0);
  expect(pageErrors).toEqual([]);
  expectNoUnexpectedConsoleErrors(consoleErrors, [
    /Failed to load resource: the server responded with a status of 503 \(Service Unavailable\)/i,
  ]);
});

test("admin create route surfaces route-owned draft-create failure copy before upload", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  let uploadRequests = 0;

  page.on("request", (request) => {
    if (
      request.url().includes("/api/admin/resources/upload") &&
      request.method() === "POST"
    ) {
      uploadRequests += 1;
    }
  });

  await page.route("**/api/admin/resources/draft", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        error:
          "Could not create a draft resource for upload right now. Please try again.",
      }),
    });
  });

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(
    page.getByRole("heading", { name: /Create Resource/i }),
  ).toBeVisible();

  const draftResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/admin/resources/draft") &&
      response.request().method() === "POST"
    );
  });

  const { widget, uploadButton } = await selectDraftUploadProbeFile(page);
  await uploadButton.click();

  const draftResponse = await draftResponsePromise;
  expect(draftResponse.status()).toBe(500);
  await expectSaveFirstErrorState(
    widget,
    uploadButton,
    /Could not create a draft resource for upload right now\. Please try again\./i,
  );
  expect(uploadRequests).toBe(0);
  expect(pageErrors).toEqual([]);
  expectNoUnexpectedConsoleErrors(consoleErrors, [
    /Failed to load resource: the server responded with a status of 500 \(Internal Server Error\)/i,
  ]);
});
