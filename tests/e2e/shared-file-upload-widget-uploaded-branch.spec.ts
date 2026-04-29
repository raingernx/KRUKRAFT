import { expect, test, type Locator, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Shared upload complete widget probe";
const SEEDED_FILE_NAME = "shared-upload-complete-probe.pdf";
const TEST_BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL ??
  process.env.BASE_URL ??
  "http://127.0.0.1:3000";

async function waitForCreatorEditorHydration(page: Page) {
  await page.waitForTimeout(3000);
}

async function cleanupSeededResources() {
  const prisma = new PrismaClient();
  try {
    await prisma.resource.deleteMany({
      where: {
        title: {
          startsWith: SEED_PREFIX,
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function seedEditableResource() {
  const prisma = new PrismaClient();
  try {
    const creator = await prisma.user.findUnique({
      where: { email: "demo.instructor@krukraft.dev" },
      select: { id: true },
    });

    if (!creator) {
      throw new Error("Missing creator auth fixture for upload-complete widget probe.");
    }

    const category = await prisma.category.findFirst({
      select: { id: true },
      orderBy: { name: "asc" },
    });

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    return await prisma.resource.create({
      data: {
        title: `${SEED_PREFIX} ${suffix}`,
        slug: `shared-upload-complete-widget-${suffix}`,
        description:
          "Seeded resource used to prove the shared uploaded-file widget branch on creator and admin edit routes.",
        type: ResourceType.PDF,
        status: "DRAFT",
        isFree: true,
        price: 0,
        authorId: creator.id,
        categoryId: category?.id ?? null,
        fileKey: null,
        fileName: null,
        fileSize: null,
        mimeType: null,
      },
      select: { id: true },
    });
  } finally {
    await prisma.$disconnect();
  }
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
<< /Length 42 >>
stream
BT
/F1 12 Tf
72 120 Td
(Krukraft uploaded branch route probe) Tj
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
305
%%EOF`;
  return {
    name: SEEDED_FILE_NAME,
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf),
  };
}

async function uploadProbeFile(page: Page, uploadPathFragment: string) {
  const widget = page.getByTestId("file-upload-widget");

  await expect(widget).toBeVisible();
  await expect(widget.getByTestId("file-upload-dropzone")).toBeVisible();
  await page.waitForTimeout(1000);
  await widget.locator('input[type="file"][name="resourceFile"]').setInputFiles(
    createTinyPdfUpload(),
  );
  await expect(widget.getByTestId("file-upload-selected-file")).toContainText(
    SEEDED_FILE_NAME,
  );

  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes(uploadPathFragment) &&
      response.request().method() === "POST"
    );
  });

  await widget.getByTestId("file-upload-submit").click();

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.ok()).toBeTruthy();
}

async function uploadCreatorProbeFile(page: Page) {
  const widget = page.getByTestId("file-upload-widget");

  await expect(widget).toBeVisible();
  await expect(widget.getByTestId("file-upload-dropzone")).toBeVisible();
  await page.waitForTimeout(1000);
  await widget.locator('input[type="file"][name="resourceFile"]').setInputFiles(
    createTinyPdfUpload(),
  );
  await expect(widget.getByTestId("file-upload-selected-file")).toContainText(
    SEEDED_FILE_NAME,
  );

  const uploadResponsePromise = page.waitForResponse((response) => {
    return (
      response.url().includes("/api/creator/resources/upload") &&
      response.request().method() === "POST"
    );
  });

  await widget.getByTestId("file-upload-submit").click();

  const uploadResponse = await uploadResponsePromise;
  expect(uploadResponse.ok()).toBeTruthy();
}

async function primeAdminUploadedFile(page: Page, resourceId: string) {
  const response = await page.context().request.post(
    `${TEST_BASE_URL}/api/admin/resources/upload`,
    {
      multipart: {
        resourceId,
        file: createTinyPdfUpload(),
      },
    },
  );

  expect(response.ok()).toBeTruthy();
}

async function expectUploadedBranch(
  page: Page,
  expectedReplaceLabel: RegExp,
  expectedRemoveLabel: string,
) {
  const widget = page.getByTestId("file-upload-widget");
  const uploadedCard = widget.getByTestId("file-upload-uploaded-file");
  const removeButton = widget.getByTestId("file-upload-remove-existing");
  const replaceButton = widget.getByTestId("file-upload-replace");

  await expect(widget).toBeVisible();
  await expect(uploadedCard).toBeVisible();
  await expect(uploadedCard).toContainText(SEEDED_FILE_NAME);
  await expect(uploadedCard).toHaveCSS("border-radius", "16px");

  await expect(removeButton).toBeVisible();
  await expect(removeButton).toHaveAttribute("aria-label", expectedRemoveLabel);
  await expectControlGeometry(removeButton, 32, "8px");

  await expect(replaceButton).toBeVisible();
  await expect(replaceButton).toHaveText(expectedReplaceLabel);
  await expectControlGeometry(replaceButton, 40, "8px");
}

test("shared file upload widget keeps uploaded-file branch posture on creator edit route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedEditableResource();

  try {
    await page.route("**/api/creator/resources/upload", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          fileKey: SEEDED_FILE_NAME,
          fileName: SEEDED_FILE_NAME,
          fileSize: 4096,
        }),
      });
    });

    await loginAsCreator(page, `/dashboard/creator/resources/${seeded.id}`);
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await waitForCreatorEditorHydration(page);
    await uploadCreatorProbeFile(page);
    await expectUploadedBranch(page, /เปลี่ยนไฟล์/i, "ลบไฟล์");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});

test("shared file upload widget keeps uploaded-file branch posture on admin edit route", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedEditableResource();

  try {
    await loginAsAdmin(page, `/admin/resources/${seeded.id}`);
    await expect(page.getByRole("heading", { name: /^Edit Resource$/i }).first()).toBeVisible();
    await primeAdminUploadedFile(page, seeded.id);
    await page.goto(`${TEST_BASE_URL}/admin/resources/${seeded.id}`);
    await expect(page.getByRole("heading", { name: /^Edit Resource$/i }).first()).toBeVisible();
    await expectUploadedBranch(page, /^Replace file$/i, "Remove file");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
