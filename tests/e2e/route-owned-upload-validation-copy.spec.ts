import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

async function waitForCreatorEditorHydration(page: Page) {
  await page.waitForTimeout(3000);
}

async function ensureAdminDraftResource(page: Page) {
  const draftTitle = "Route-owned upload validation probe";
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
(Krukraft validation upload probe) Tj
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
    const file = new File([pdf], "file-upload-validation-probe.pdf", {
      type: "application/pdf",
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    element.files = dataTransfer.files;
    element.dispatchEvent(new Event("change", { bubbles: true }));
  });
}

async function selectValidationProbeFile(page: Page) {
  await page.waitForTimeout(1000);

  const widget = page.getByTestId("file-upload-widget");
  const uploadButton = widget.getByTestId("file-upload-submit");

  await expect(widget).toBeVisible();
  await widget.scrollIntoViewIfNeeded();
  await attachSyntheticPdf(widget.locator('input[type="file"][name="resourceFile"]'));
  await expect(widget.getByTestId("file-upload-selected-file")).toBeVisible();
  await expect(widget.getByTestId("file-upload-selected-file")).toContainText(
    "file-upload-validation-probe.pdf",
  );
  await expect(uploadButton).toBeEnabled();
  await expectControlGeometry(uploadButton, 40, "8px");

  return { widget, uploadButton };
}

async function expectValidationErrorState(
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

test("creator create route surfaces route-owned 404 upload validation copy after draft creation succeeds", async ({
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

  await page.route("**/api/creator/resources/upload", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        error: "ไม่พบ resource ที่ต้องการอัปโหลดไฟล์",
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

  const { widget, uploadButton } = await selectValidationProbeFile(page);
  await uploadButton.click();

  const draftResponse = await draftResponsePromise;
  expect(draftResponse.ok()).toBeTruthy();

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.status()).toBe(404);
  await expectValidationErrorState(
    widget,
    uploadButton,
    /ไม่พบ resource ที่ต้องการอัปโหลดไฟล์/i,
  );
  expect(uploadRequests).toBe(1);
  expect(pageErrors).toEqual([]);
  expectNoUnexpectedConsoleErrors(consoleErrors, [
    /Failed to load resource: the server responded with a status of 404 \(Not Found\)/i,
  ]);
});

test("admin create route surfaces route-owned 404 upload validation copy after draft creation succeeds", async ({
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

  await page.route("**/api/admin/resources/upload", async (route) => {
    await route.fulfill({
      status: 404,
      contentType: "application/json",
      body: JSON.stringify({
        error: "Resource not found.",
      }),
    });
  });

  await loginAsAdmin(page, "/admin/resources/new");
  await expect(
    page.getByRole("heading", { name: /Create Resource/i }),
  ).toBeVisible();
  await ensureAdminDraftResource(page);

  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/admin/resources/upload") &&
      response.request().method() === "POST"
    );
  });

  const { widget, uploadButton } = await selectValidationProbeFile(page);
  await uploadButton.click();

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.status()).toBe(404);
  await expectValidationErrorState(
    widget,
    uploadButton,
    /Resource not found\./i,
  );
  expect(uploadRequests).toBe(1);
  expect(pageErrors).toEqual([]);
  expectNoUnexpectedConsoleErrors(consoleErrors, [
    /Failed to load resource: the server responded with a status of 404 \(Not Found\)/i,
  ]);
});
