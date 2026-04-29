import { expect, test, type Locator } from "@playwright/test";
import { PrismaClient, ResourceStatus, ResourceType } from "@prisma/client";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

const SIMPLE_ROW_ACTION_PREFIX = "Admin simple row action probe";

async function expectButtonGeometry(
  locator: Locator,
  expectedHeight: number,
  expectedRadiusPx: string,
) {
  const box = await locator.boundingBox();

  expect(box).not.toBeNull();
  expect(Math.round(box?.height ?? 0)).toBe(expectedHeight);
  await expect(locator).toHaveCSS("border-radius", expectedRadiusPx);
}

async function cleanupSimpleRowActionFixtures() {
  const prisma = new PrismaClient();

  try {
    await prisma.review.deleteMany({
      where: {
        resource: {
          title: {
            startsWith: SIMPLE_ROW_ACTION_PREFIX,
          },
        },
      },
    });

    await prisma.resource.deleteMany({
      where: {
        title: {
          startsWith: SIMPLE_ROW_ACTION_PREFIX,
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function seedSimpleRowActionFixtures() {
  const prisma = new PrismaClient();

  try {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@krukraft.dev" },
      select: { id: true },
    });
    const user = await prisma.user.findUnique({
      where: { email: "demo.user@krukraft.dev" },
      select: { id: true },
    });

    if (!admin || !user) {
      throw new Error("Missing auth fixtures for admin simple row-action rollout tests.");
    }

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const reviewResource = await prisma.resource.create({
      data: {
        title: `${SIMPLE_ROW_ACTION_PREFIX} Review ${suffix}`,
        slug: `admin-simple-review-${suffix}`,
        description: "Seeded resource for admin reviews route geometry proof.",
        type: ResourceType.PDF,
        status: ResourceStatus.PUBLISHED,
        isFree: true,
        price: 0,
        authorId: admin.id,
      },
      select: { id: true, slug: true },
    });

    await prisma.review.create({
      data: {
        userId: user.id,
        resourceId: reviewResource.id,
        rating: 4,
        body: "Seeded review for admin row-action geometry proof.",
        isVisible: true,
      },
    });

    await prisma.resource.create({
      data: {
        title: `${SIMPLE_ROW_ACTION_PREFIX} Trash ${suffix}`,
        slug: `admin-simple-trash-${suffix}`,
        description: "Seeded trashed resource for admin trash geometry proof.",
        type: ResourceType.PDF,
        status: ResourceStatus.DRAFT,
        isFree: true,
        price: 0,
        authorId: admin.id,
        deletedAt: new Date(),
      },
    });

    const versionedResource = await prisma.resource.create({
      data: {
        title: `${SIMPLE_ROW_ACTION_PREFIX} Version ${suffix}`,
        slug: `admin-simple-version-${suffix}`,
        description: "Seeded resource version history for admin geometry proof.",
        type: ResourceType.PDF,
        status: ResourceStatus.DRAFT,
        isFree: true,
        price: 0,
        authorId: admin.id,
      },
      select: { id: true },
    });

    await prisma.resourceVersion.createMany({
      data: [
        {
          resourceId: versionedResource.id,
          version: 1,
          fileName: "worksheet-v1.pdf",
          fileSize: 1024,
          mimeType: "application/pdf",
          createdById: admin.id,
        },
        {
          resourceId: versionedResource.id,
          version: 2,
          fileName: "worksheet-v2.pdf",
          fileSize: 2048,
          mimeType: "application/pdf",
          createdById: admin.id,
          changelog: "Added answer key.",
        },
      ],
    });

    return {
      versionedResourceId: versionedResource.id,
    };
  } finally {
    await prisma.$disconnect();
  }
}

test.describe.configure({ timeout: 180_000 });

test("admin simple row-action rollout keeps simple admin tables on md recipe", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSimpleRowActionFixtures();
  const fixtures = await seedSimpleRowActionFixtures();

  try {
    await loginAsAdmin(page, "/admin/categories");
    await expect(page.getByRole("heading", { name: /^Categories$/i })).toBeVisible();

    const categoriesEditButton = page.locator("tbody tr").first().getByRole("button", {
      name: /^Edit$/i,
    });
    await expect(categoriesEditButton).toBeVisible();
    await expectButtonGeometry(categoriesEditButton, 40, "8px");

    await page.goto("/admin/reviews", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^Reviews$/i })).toBeVisible();

    const reviewActionButton = page.getByRole("button", { name: /^Hide$/i }).first();
    await expect(reviewActionButton).toBeVisible();
    await expectButtonGeometry(reviewActionButton, 40, "8px");

    await page.goto("/admin/resources/trash", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^Trash$/i })).toBeVisible();

    const restoreButton = page.locator("tbody tr", {
      hasText: "Admin simple row action probe Trash",
    }).first().getByRole("button", { name: /^Restore$/i });
    await expect(restoreButton).toBeVisible();
    await expectButtonGeometry(restoreButton, 40, "8px");

    await page.goto(`/admin/resources/${fixtures.versionedResourceId}/versions`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Versions$/i })).toBeVisible();

    const downloadButton = page.getByRole("button", { name: /^Download$/i }).first();
    await expect(downloadButton).toBeVisible();
    await expectButtonGeometry(downloadButton, 40, "8px");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSimpleRowActionFixtures();
  }
});
