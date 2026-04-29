import { expect, test, type Locator } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator delivery linked urls";

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
        slug: `creator-delivery-linked-urls-${suffix}`,
        description:
          "Seeded creator resource used to prove delivery/previews linked URL shell parity on the edit route.",
        type: ResourceType.PDF,
        status: "DRAFT",
        isFree: true,
        price: 0,
        authorId: owner.id,
        categoryId: category?.id ?? null,
        fileUrl: "https://example.com/files/worksheet.pdf",
        previewUrl: "https://example.com/images/cover.webp",
        previews: {
          create: [
            {
              imageUrl: "https://example.com/images/cover.webp",
              order: 0,
            },
          ],
        },
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

async function expectExternalFileUrlEditor(page: import("@playwright/test").Page) {
  const useLinkButton = page.getByRole("button", { name: /^Use link$/i });
  await useLinkButton.scrollIntoViewIfNeeded();
  await useLinkButton.dispatchEvent("click");

  const externalFileUrlInput = page.locator('input[name="externalFileUrl"]');
  await expect(externalFileUrlInput).toBeVisible();
  await expectControlGeometry(externalFileUrlInput, 56, "8px");
}

async function expectEditRouteLinkedUrlEditors(page: import("@playwright/test").Page) {
  const previewUrlInput = page.locator('input[id*="-preview-url-"]').first();
  await expect(previewUrlInput).toBeVisible();
  await expectControlGeometry(previewUrlInput, 56, "8px");

  const editExternalLinkButton = page.getByRole("button", { name: /^Edit$/i });
  await editExternalLinkButton.scrollIntoViewIfNeeded();
  await editExternalLinkButton.dispatchEvent("click");

  const externalFileUrlInput = page.locator('input[name="externalFileUrl"]');
  await expect(externalFileUrlInput).toBeVisible();
  await expectControlGeometry(externalFileUrlInput, 56, "8px");
}

test("creator delivery linked URL editors keep widened shared input geometry", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedOwnedResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
    await expectExternalFileUrlEditor(page);

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await expectEditRouteLinkedUrlEditors(page);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
