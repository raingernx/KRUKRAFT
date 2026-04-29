import { expect, test, type Locator } from "@playwright/test";
import { PrismaClient, ResourceStatus, ResourceType } from "@prisma/client";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

const HOLDOUT_PREFIX = "Dense action holdout probe";

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

async function cleanupDenseHoldoutFixtures() {
  const prisma = new PrismaClient();

  try {
    await prisma.resource.deleteMany({
      where: {
        title: {
          startsWith: HOLDOUT_PREFIX,
        },
      },
    });

    await prisma.tag.deleteMany({
      where: {
        slug: {
          startsWith: "dense-action-holdout-",
        },
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function seedDenseHoldoutFixtures() {
  const prisma = new PrismaClient();

  try {
    const admin = await prisma.user.findUnique({
      where: { email: "admin@krukraft.dev" },
      select: { id: true },
    });

    if (!admin) {
      throw new Error("Missing admin auth fixture for dense holdout lockdown tests.");
    }

    const suffix = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

    const resource = await prisma.resource.create({
      data: {
        title: `${HOLDOUT_PREFIX} Resource ${suffix}`,
        slug: `dense-action-holdout-resource-${suffix}`,
        description: "Seeded resource for dense action holdout geometry proof.",
        type: ResourceType.PDF,
        status: ResourceStatus.DRAFT,
        isFree: true,
        price: 0,
        authorId: admin.id,
      },
      select: { id: true, title: true },
    });

    const tag = await prisma.tag.create({
      data: {
        name: `${HOLDOUT_PREFIX} Tag ${suffix}`,
        slug: `dense-action-holdout-${suffix}`,
      },
      select: { id: true, name: true, slug: true },
    });

    return { resource, tag };
  } finally {
    await prisma.$disconnect();
  }
}

test.describe.configure({ timeout: 180_000 });

test("dense admin holdouts stay on compact row-action posture", async ({ page }) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupDenseHoldoutFixtures();
  const fixtures = await seedDenseHoldoutFixtures();
  const resourceQuery = encodeURIComponent(fixtures.resource.title);

  try {
    await loginAsAdmin(page, `/admin/resources?q=${resourceQuery}`);
    await expect(page.getByRole("heading", { name: /^Resources$/i })).toBeVisible();

    const resourceRow = page.locator("tbody tr").filter({
      hasText: fixtures.resource.title,
    });
    await expect(resourceRow).toBeVisible();

    const publishButton = resourceRow.getByRole("button", { name: /^Publish$/i });
    await expect(publishButton).toBeVisible();
    await expectButtonGeometry(publishButton, 32, "8px");

    const moreActionsButton = resourceRow.getByRole("button", {
      name: /^More actions$/i,
    });
    await expect(moreActionsButton).toBeVisible();
    await expectButtonGeometry(moreActionsButton, 32, "8px");

    await page.goto("/admin/tags", { waitUntil: "domcontentloaded" });
    await expect(page.getByRole("heading", { name: /^Tag Management$/i })).toBeVisible();
    await expect(
      page.locator('[data-admin-tags-create-form-ready="true"]'),
    ).toBeVisible();

    const tagRow = page.locator("tbody tr").filter({
      hasText: fixtures.tag.slug,
    });
    await expect(tagRow).toBeVisible();

    const editButton = tagRow.getByRole("button", { name: /^Edit$/i });
    await expect(editButton).toBeVisible();
    await expectButtonGeometry(editButton, 32, "8px");

    const deleteButton = tagRow.getByRole("button", { name: /^Delete$/i });
    await expect(deleteButton).toBeVisible();
    await expectButtonGeometry(deleteButton, 32, "8px");

    await editButton.click();

    const editingRow = page.locator("tbody tr").filter({
      has: page.locator(`input[value="${fixtures.tag.name}"]`),
    });

    const saveButton = editingRow.getByRole("button", { name: /^Save$/i });
    await expect(saveButton).toBeVisible();
    await expectButtonGeometry(saveButton, 32, "8px");

    const cancelEditButton = editingRow.getByRole("button", { name: /^Cancel$/i });
    await expect(cancelEditButton).toBeVisible();
    await expectButtonGeometry(cancelEditButton, 32, "8px");
    await cancelEditButton.click();

    await deleteButton.click();

    const deletingRow = page.locator("tbody tr").filter({
      hasText: fixtures.tag.slug,
    });

    const confirmDeleteButton = deletingRow.getByRole("button", {
      name: /^Confirm delete$/i,
    });
    await expect(confirmDeleteButton).toBeVisible();
    await expectButtonGeometry(confirmDeleteButton, 32, "8px");

    const cancelDeleteButton = deletingRow.getByRole("button", { name: /^Cancel$/i });
    await expect(cancelDeleteButton).toBeVisible();
    await expectButtonGeometry(cancelDeleteButton, 32, "8px");

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupDenseHoldoutFixtures();
  }
});
