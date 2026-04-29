import { expect, test, type Locator, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator delivery action styling";

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

async function seedUploadedResource() {
  const prisma = new PrismaClient();
  try {
    const creator = await prisma.user.findUnique({
      where: { email: "demo.instructor@krukraft.dev" },
      select: { id: true },
    });

    if (!creator) {
      throw new Error("Missing creator auth fixture for delivery action styling probe.");
    }

    const category = await prisma.category.findFirst({
      select: { id: true },
      orderBy: { name: "asc" },
    });

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    return await prisma.resource.create({
      data: {
        title: `${SEED_PREFIX} ${suffix}`,
        slug: `creator-delivery-action-styling-${suffix}`,
        description:
          "Seeded creator resource used to prove linked-file delivery action styling on the edit route.",
        type: ResourceType.PDF,
        status: "DRAFT",
        isFree: true,
        price: 0,
        authorId: creator.id,
        categoryId: category?.id ?? null,
        fileKey: "creator-delivery-action-styling.pdf",
        fileName: "creator-delivery-action-styling.pdf",
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

test("creator delivery linked-file actions keep compact rounded-rect posture on create and edit routes", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedUploadedResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
    await waitForEditorHydration(page);

    const deliverySection = page.locator("section").filter({
      has: page.getByRole("heading", { name: /Delivery and previews/i }),
    });

    const createToggle = page.getByTestId("creator-delivery-source-toggle");
    const createUploadToggle = createToggle.getByRole("button", { name: /^Upload file$/i });
    const createExternalToggle = createToggle.getByRole("button", { name: /^Use link$/i });

    await createExternalToggle.dispatchEvent("click");
    await expect(createUploadToggle).toHaveAttribute("aria-pressed", "false");
    await expect(createExternalToggle).toHaveAttribute("aria-pressed", "true");

    const input = deliverySection.getByPlaceholder(/Paste an external file URL, e\.g\./i);
    await input.fill("https://example.com/worksheet.pdf");
    await input.press("Enter");

    const clearLinkButton = page.getByTestId("creator-linked-file-clear-link");
    const editButton = page.getByTestId("creator-linked-file-edit");
    const openLinkButton = page.getByTestId("creator-linked-file-open");
    const summaryShell = page.getByTestId("creator-linked-file-summary-shell");

    await expect(summaryShell).toBeVisible();
    await expect(summaryShell).toHaveCSS("border-radius", "16px");
    await expect(clearLinkButton).toBeVisible();
    await expect(editButton).toBeVisible();
    await expect(openLinkButton).toBeVisible();
    await expectControlGeometry(clearLinkButton, 40, "8px");
    await expectControlGeometry(editButton, 40, "8px");
    await expectControlGeometry(openLinkButton, 40, "8px");

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await waitForEditorHydration(page);

    const editDeliverySection = page.locator("section").filter({
      has: page.getByRole("heading", { name: /Delivery and previews/i }),
    });

    const editToggle = page.getByTestId("creator-delivery-source-toggle");
    const editUploadToggle = editToggle.getByRole("button", { name: /^Upload file$/i });
    const editExternalToggle = editToggle.getByRole("button", { name: /^Use link$/i });

    await editExternalToggle.dispatchEvent("click");
    await expect(editUploadToggle).toHaveAttribute("aria-pressed", "false");
    await expect(editExternalToggle).toHaveAttribute("aria-pressed", "true");

    const guardShell = page.getByTestId("creator-linked-file-upload-guard");
    const removeUploadedButton = page.getByTestId("creator-linked-file-remove-uploaded");

    await expect(guardShell).toBeVisible();
    await expect(guardShell).toHaveCSS("border-radius", "16px");
    await expect(removeUploadedButton).toBeVisible();
    await expectControlGeometry(removeUploadedButton, 40, "8px");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
