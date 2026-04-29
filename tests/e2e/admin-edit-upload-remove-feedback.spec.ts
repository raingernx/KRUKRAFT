import { expect, test, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Admin edit upload feedback probe";
const SEEDED_FILE_NAME = "admin-edit-upload-feedback-probe.pdf";
const TEST_BASE_URL =
  process.env.PLAYWRIGHT_TEST_BASE_URL ??
  process.env.BASE_URL ??
  "http://127.0.0.1:3000";

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
      throw new Error("Missing creator auth fixture for admin edit upload feedback probe.");
    }

    const category = await prisma.category.findFirst({
      select: { id: true },
      orderBy: { name: "asc" },
    });

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    return await prisma.resource.create({
      data: {
        title: `${SEED_PREFIX} ${suffix}`,
        slug: `admin-edit-upload-feedback-${suffix}`,
        description:
          "Seeded resource used to prove admin edit remove-file success and failure feedback outside the shared widget shell.",
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

function expectNoUnexpectedConsoleErrors(
  consoleErrors: string[],
  allowedErrors: RegExp[] = [],
) {
  const unexpectedErrors = consoleErrors.filter((message) => {
    return !allowedErrors.some((pattern) => pattern.test(message));
  });

  expect(unexpectedErrors).toEqual([]);
}

async function openAdminEditRoute(page: Page, resourceId: string) {
  await loginAsAdmin(page, `/admin/resources/${resourceId}`);
  await expect(page.getByRole("heading", { name: /^Edit Resource$/i }).first()).toBeVisible();
  const widget = page.getByTestId("file-upload-widget");

  await expect(widget).toBeVisible();

  return {
    widget,
    removeButton: widget.getByTestId("file-upload-remove-existing"),
  };
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
<< /Length 39 >>
stream
BT
/F1 12 Tf
72 120 Td
(Krukraft admin edit upload probe) Tj
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
302
%%EOF`;
  return {
    name: SEEDED_FILE_NAME,
    mimeType: "application/pdf",
    buffer: Buffer.from(pdf),
  };
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

async function expectUploadedBranchOnAdminEditRoute(page: Page, resourceId: string) {
  await page.goto(`${TEST_BASE_URL}/admin/resources/${resourceId}`);
  await expect(page.getByRole("heading", { name: /^Edit Resource$/i }).first()).toBeVisible();

  const widget = page.getByTestId("file-upload-widget");
  const uploadedCard = widget.getByTestId("file-upload-uploaded-file");

  await expect(uploadedCard).toContainText(SEEDED_FILE_NAME);

  return { widget, uploadedCard };
}

test("admin edit route surfaces route-owned remove-file success feedback outside the widget shell", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedEditableResource();

  try {
    await openAdminEditRoute(page, seeded.id);
    await primeAdminUploadedFile(page, seeded.id);
    const { widget, uploadedCard } = await expectUploadedBranchOnAdminEditRoute(
      page,
      seeded.id,
    );
    const removeButton = widget.getByTestId("file-upload-remove-existing");

    const removeResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/admin/resources/${seeded.id}/file`) &&
        response.request().method() === "DELETE"
      );
    });

    await removeButton.click();

    const removeResponse = await removeResponsePromise;
    expect(removeResponse.ok()).toBeTruthy();

    await expect(page.getByText(/^File removed$/i)).toBeVisible();
    await expect(page.getByText(/^Failed to remove file$/i)).toHaveCount(0);
    await expect(uploadedCard).toHaveCount(0);
    await expect(widget.getByTestId("file-upload-dropzone")).toBeVisible();
    await expect(widget.getByTestId("file-upload-error")).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expectNoUnexpectedConsoleErrors(consoleErrors);
  } finally {
    await cleanupSeededResources();
  }
});

test("admin edit route surfaces route-owned remove-file failure feedback outside the widget shell", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  let removeRequests = 0;

  await cleanupSeededResources();
  const seeded = await seedEditableResource();

  try {
    await page.route("**/api/admin/resources/*/file", async (route) => {
      removeRequests += 1;
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          error: "Failed to remove file",
        }),
      });
    });

    await openAdminEditRoute(page, seeded.id);
    await primeAdminUploadedFile(page, seeded.id);
    const { widget, uploadedCard } = await expectUploadedBranchOnAdminEditRoute(
      page,
      seeded.id,
    );
    const removeButton = widget.getByTestId("file-upload-remove-existing");

    const removeResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/admin/resources/${seeded.id}/file`) &&
        response.request().method() === "DELETE"
      );
    });

    await removeButton.click();

    const removeResponse = await removeResponsePromise;
    expect(removeResponse.status()).toBe(500);
    expect(removeRequests).toBe(1);

    await expect(page.getByText(/^Failed to remove file$/i)).toBeVisible();
    await expect(page.getByText(/^File removed$/i)).toHaveCount(0);
    await expect(uploadedCard).toBeVisible();
    await expect(widget.getByTestId("file-upload-error")).toHaveCount(0);

    expect(pageErrors).toEqual([]);
    expectNoUnexpectedConsoleErrors(consoleErrors, [
      /Failed to load resource: the server responded with a status of 500 \(Internal Server Error\)/i,
    ]);
  } finally {
    await cleanupSeededResources();
  }
});
