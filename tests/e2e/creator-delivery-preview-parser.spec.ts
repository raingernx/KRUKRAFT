import { expect, test, type Locator } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator delivery preview parser";

async function waitForEditorHydration(page: Parameters<typeof loginAsCreator>[0]) {
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

async function seedOwnedResource() {
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
        slug: `creator-delivery-preview-parser-${suffix}`,
        description:
          "Seeded creator resource used to prove bulk preview parser behavior on the edit route.",
        type: ResourceType.PDF,
        status: "DRAFT",
        isFree: true,
        price: 0,
        authorId: owner.id,
        categoryId: category?.id ?? null,
      },
      select: { id: true },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function readPreviewState(resourceId: string) {
  const prisma = new PrismaClient();
  try {
    return await prisma.resource.findUnique({
      where: { id: resourceId },
      select: {
        previewUrl: true,
        previews: {
          orderBy: { order: "asc" },
          select: { imageUrl: true },
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function expectControlGeometry(
  locator: Locator,
  minimumHeight: number,
  expectedRadiusPx: string,
) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(minimumHeight);
  await expect(locator).toHaveCSS("border-radius", expectedRadiusPx);
}

function deliverySection(page: import("@playwright/test").Page) {
  return page.locator("section").filter({
    has: page.getByRole("heading", { name: /Delivery and previews/i }),
  });
}

test("creator bulk preview parser keeps shared textarea shell and route-owned parser behavior", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedOwnedResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await waitForEditorHydration(page);
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();

    const newDelivery = deliverySection(page);
    await newDelivery.getByRole("button", { name: /^Paste list$/i }).click();

    const newTextarea = newDelivery.locator('textarea[id*="-preview-url-bulk"]');
    await expect(newTextarea).toBeVisible();
    await expectControlGeometry(newTextarea, 120, "8px");

    const applyButton = newDelivery.getByRole("button", { name: /^Apply URLs$/i });
    await expect(applyButton).toBeDisabled();

    await newTextarea.fill("notaurl");
    await expect(applyButton).toBeEnabled();
    await applyButton.click();

    await expect(
      newDelivery.getByText(/One or more image URLs can't be used yet/i),
    ).toBeVisible();
    await expect(newTextarea).toHaveValue("notaurl");

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await waitForEditorHydration(page);
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();

    const editDelivery = deliverySection(page);
    await editDelivery.getByRole("button", { name: /^Paste list$/i }).click();

    const editTextarea = editDelivery.locator('textarea[id*="-preview-url-bulk"]');
    await expect(editTextarea).toBeVisible();
    await expectControlGeometry(editTextarea, 120, "8px");

    const patchResponsePromise = page.waitForResponse((response) => {
      return (
        response.url().includes(`/api/creator/resources/${seeded.id}`) &&
        response.request().method() === "PATCH"
      );
    });

    await editTextarea.fill(
      "https://example.com/preview-cover.webp\nhttps://example.com/preview-two.webp",
    );
    await editDelivery.getByRole("button", { name: /^Apply URLs$/i }).click();

    const patchResponse = await patchResponsePromise;
    expect(patchResponse.ok()).toBeTruthy();

    await expect(editTextarea).toHaveCount(0);
    await expect(
      editDelivery.locator('input[id*="-preview-url-"]').first(),
    ).toHaveValue("https://example.com/preview-cover.webp");
    await expect(
      editDelivery.locator("span").filter({ hasText: /^Cover$/i }).first(),
    ).toBeVisible();

    const persisted = await readPreviewState(seeded.id);
    expect(persisted?.previewUrl).toBe("https://example.com/preview-cover.webp");
    expect(persisted?.previews.map((item) => item.imageUrl)).toEqual([
      "https://example.com/preview-cover.webp",
      "https://example.com/preview-two.webp",
    ]);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
