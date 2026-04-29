import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

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

async function attachSyntheticPdf(input: Locator) {
  await input.evaluate((element) => {
    if (!(element instanceof HTMLInputElement)) {
      throw new Error("Expected file input element.");
    }

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
(Krukraft creator upload flash probe) Tj
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
298
%%EOF`;
    const file = new File([pdf], "creator-upload-flash-probe.pdf", {
      type: "application/pdf",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    element.files = dataTransfer.files;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function selectUploadProbeFile(page: Page) {
  await page.waitForTimeout(1000);

  const widget = page.getByTestId("file-upload-widget");
  const uploadButton = widget.getByTestId("file-upload-submit");

  await expect(widget).toBeVisible();
  await widget.scrollIntoViewIfNeeded();
  await attachSyntheticPdf(widget.locator('input[type="file"][name="resourceFile"]'));
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(widget.getByTestId("file-upload-selected-file")).toContainText(
    "creator-upload-flash-probe.pdf",
  );
  await expect(uploadButton).toBeEnabled();
  await expectControlGeometry(uploadButton, 40, "8px");

  return { widget, uploadButton };
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

test("creator create route surfaces route-owned remove-file flash messaging outside the widget shell", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  let uploadRequests = 0;
  let removeRequests = 0;

  page.on("request", (request) => {
    if (
      request.url().includes("/api/creator/resources/upload") &&
      request.method() === "POST"
    ) {
      uploadRequests += 1;
    }
    if (
      request.url().includes("/api/creator/resources/") &&
      request.url().endsWith("/file") &&
      request.method() === "DELETE"
    ) {
      removeRequests += 1;
    }
  });

  await page.route("**/api/creator/resources/upload", async (route) => {
    await route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify({
        fileKey: "creator-upload-flash-probe.pdf",
        fileName: "creator-upload-flash-probe.pdf",
        fileSize: 1024,
      }),
    });
  });

  await page.route("**/api/creator/resources/*/file", async (route) => {
    await route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({
        error: "ลบไฟล์สำหรับผู้ซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง",
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
  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/resources/upload") &&
      response.request().method() === "POST"
    );
  });

  const { widget, uploadButton } = await selectUploadProbeFile(page);
  await uploadButton.click();

  const draftResponse = await draftResponsePromise;
  expect(draftResponse.ok()).toBeTruthy();

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.ok()).toBeTruthy();
  expect(uploadRequests).toBe(1);

  await expect(widget.getByTestId("file-upload-uploaded-file")).toBeVisible();
  await expect(widget.getByTestId("file-upload-success")).toBeVisible();

  await page.getByRole("button", { name: /Use link/i }).click();
  const removeButton = page.getByRole("button", { name: /Remove uploaded file/i });
  await expect(removeButton).toBeVisible();

  const removeResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/resources/") &&
      response.url().endsWith("/file") &&
      response.request().method() === "DELETE"
    );
  });

  await removeButton.click();

  const removeResponse = await removeResponsePromise;
  expect(removeResponse.status()).toBe(500);
  expect(removeRequests).toBe(1);

  const publishActions = page.getByRole("region", {
    name: /Resource publishing actions/i,
  });
  await expect(publishActions).toContainText(
    /ลบไฟล์สำหรับผู้ซื้อไม่สำเร็จ กรุณาลองใหม่อีกครั้ง/i,
  );
  await expect(widget.getByTestId("file-upload-error")).toHaveCount(0);
  expect(pageErrors).toEqual([]);
  expectNoUnexpectedConsoleErrors(consoleErrors, [
    /Failed to load resource: the server responded with a status of 500 \(Internal Server Error\)/i,
  ]);
});
