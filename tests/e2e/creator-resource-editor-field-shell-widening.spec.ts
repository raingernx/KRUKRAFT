import { expect, test, type Locator } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator editor field shell";

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
        slug: `creator-editor-field-shell-${suffix}`,
        description:
          "Seeded creator resource used to prove metadata field shell parity on the edit route.",
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

test("creator resource editor metadata fields keep widened shared select and textarea geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedOwnedResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();

    const typeSelect = page.locator('select[id$="-type"]');
    await expect(typeSelect).toBeVisible();
    await expectControlGeometry(typeSelect, 56, "8px");

    const categorySelect = page.locator('select[id$="-category"]');
    await expect(categorySelect).toBeVisible();
    await expectControlGeometry(categorySelect, 56, "8px");

    const descriptionTextarea = page.locator('textarea[id$="-description"]');
    await expect(descriptionTextarea).toBeVisible();
    await expect(descriptionTextarea).toHaveCSS("border-radius", "8px");

    let box = await descriptionTextarea.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(144);

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();

    const statusSelect = page.locator('select[id$="-status"]');
    await expect(statusSelect).toBeVisible();
    await expectControlGeometry(statusSelect, 56, "8px");

    await expect(typeSelect).toBeVisible();
    await expectControlGeometry(typeSelect, 56, "8px");

    await expect(categorySelect).toBeVisible();
    await expectControlGeometry(categorySelect, 56, "8px");

    await expect(descriptionTextarea).toBeVisible();
    await expect(descriptionTextarea).toHaveCSS("border-radius", "8px");

    box = await descriptionTextarea.boundingBox();
    expect(box).not.toBeNull();
    expect(Math.round(box?.height ?? 0)).toBeGreaterThanOrEqual(120);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
