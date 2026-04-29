import { expect, test, type Locator, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsAdmin, loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Shared upload complete widget probe";
const SEEDED_FILE_NAME = "shared-upload-complete-probe.pdf";

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

async function seedUploadedResource() {
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
        fileKey: SEEDED_FILE_NAME,
        fileName: SEEDED_FILE_NAME,
        fileSize: 4096,
        mimeType: "application/pdf",
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
  const seeded = await seedUploadedResource();

  try {
    await loginAsCreator(page, `/dashboard/creator/resources/${seeded.id}`);
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await waitForCreatorEditorHydration(page);
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
  const seeded = await seedUploadedResource();

  try {
    await loginAsAdmin(page, `/admin/resources/${seeded.id}`);
    await expect(page.getByRole("heading", { name: /^Edit Resource$/i }).first()).toBeVisible();
    await expectUploadedBranch(page, /^Replace file$/i, "Remove file");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
