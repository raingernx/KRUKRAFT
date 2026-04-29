import { expect, test, type Locator, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator delivery upload controls";

async function waitForEditorHydration(page: Page) {
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

async function seedExternalOnlyResource() {
  const prisma = new PrismaClient();
  try {
    const owner = await prisma.user.findUnique({
      where: { email: "demo.instructor@krukraft.dev" },
      select: { id: true },
    });

    if (!owner) {
      throw new Error("Missing creator auth fixture.");
    }

    const category = await prisma.category.findFirst({
      select: { id: true },
      orderBy: { name: "asc" },
    });

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    return await prisma.resource.create({
      data: {
        title: `${SEED_PREFIX} ${suffix}`,
        slug: `creator-delivery-upload-controls-${suffix}`,
        description:
          "Seeded creator resource used to prove delivery upload wrapper shell posture on the edit route.",
        type: ResourceType.PDF,
        status: "DRAFT",
        isFree: true,
        price: 0,
        authorId: owner.id,
        categoryId: category?.id ?? null,
        fileUrl: "https://example.com/files/external-worksheet.pdf",
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

async function expectUploadBranchShell(page: Page) {
  const uploadShell = page.getByTestId("creator-delivery-upload-branch");
  await expect(uploadShell).toBeVisible();
  await expect(uploadShell).toHaveCSS("border-radius", "16px");
  await expect(uploadShell.getByText(/Upload the file buyers will receive after checkout\./i)).toBeVisible();
  await expect(uploadShell.locator('input[type="file"]').last()).toBeAttached();
}

test("creator delivery upload controls keep route-owned toggle and upload shell posture", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

    await cleanupSeededResources();
    const seeded = await seedExternalOnlyResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
    await waitForEditorHydration(page);

    const toggle = page.getByTestId("creator-delivery-source-toggle");
    const uploadToggle = toggle.getByRole("button", { name: /^Upload file$/i });
    const externalToggle = toggle.getByRole("button", { name: /^Use link$/i });

    await expect(uploadToggle).toHaveAttribute("aria-pressed", "true");
    await expect(externalToggle).toHaveAttribute("aria-pressed", "false");
    await expectControlGeometry(uploadToggle, 40, "8px");
    await expectControlGeometry(externalToggle, 40, "8px");
    await expectUploadBranchShell(page);

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await waitForEditorHydration(page);

    const editToggle = page.getByTestId("creator-delivery-source-toggle");
    const editUploadToggle = editToggle.getByRole("button", { name: /^Upload file$/i });
    const editExternalToggle = editToggle.getByRole("button", { name: /^Use link$/i });

    await expect(editUploadToggle).toHaveAttribute("aria-pressed", "false");
    await expect(editExternalToggle).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByTestId("creator-delivery-upload-branch")).toHaveCount(0);

    await editUploadToggle.scrollIntoViewIfNeeded();
    await editUploadToggle.dispatchEvent("click");
    await expect(editUploadToggle).toHaveAttribute("aria-pressed", "true");
    await expect(editExternalToggle).toHaveAttribute("aria-pressed", "false");
    await expectUploadBranchShell(page);
    await expect(
      page.getByText(/Uploading a file here will replace the current external URL as the active delivery source\./i),
    ).toBeVisible();

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
