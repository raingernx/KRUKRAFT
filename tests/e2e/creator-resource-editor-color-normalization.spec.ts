import { expect, test, type Locator, type Page } from "@playwright/test";
import { PrismaClient, ResourceType } from "@prisma/client";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const SEED_PREFIX = "Creator editor color normalization";
const INVALID_PREVIEW_URL_MESSAGE =
  "Use a full http:// or https:// image URL, or a local /path image reference.";

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
        slug: `creator-editor-color-normalization-${suffix}`,
        description:
          "Seeded creator resource used to prove helper and callout color normalization on the edit route.",
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

async function resolveUtilityColor(page: Page, className: string) {
  return page.evaluate((utilityClassName) => {
    const probe = document.createElement("div");
    probe.className = utilityClassName;
    document.body.appendChild(probe);
    const color = getComputedStyle(probe).color;
    probe.remove();
    return color;
  }, className);
}

async function expectColor(locator: Locator, expectedColor: string) {
  await expect(locator).toHaveCSS("color", expectedColor);
}

test("creator resource editor helper accents and preview-url validation use semantic color tokens", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await cleanupSeededResources();
  const seeded = await seedOwnedResource();

  try {
    await loginAsCreator(page, "/dashboard/creator/resources/new");
    await expect(page.getByRole("heading", { name: /^New resource$/i })).toBeVisible();
    await waitForEditorHydration(page);

    const primaryColor = await resolveUtilityColor(page, "text-primary");
    const destructiveColor = await resolveUtilityColor(page, "text-destructive");

    await expectColor(page.getByTestId("creator-editor-images-icon"), primaryColor);
    await expectColor(page.getByTestId("creator-editor-linked-images-empty-icon"), primaryColor);
    await expectColor(page.getByTestId("creator-editor-buyer-file-icon"), primaryColor);

    await page.getByRole("button", { name: /^Add one$/i }).click();
    const previewInput = page.getByPlaceholder(/^Paste the cover image URL$/i);
    await previewInput.fill("not-a-url");
    await previewInput.press("Enter");

    const previewUrlError = page.getByText(INVALID_PREVIEW_URL_MESSAGE).first();
    await expect(previewUrlError).toBeVisible();
    await expectColor(previewUrlError, destructiveColor);

    await page.goto(`/dashboard/creator/resources/${seeded.id}`, {
      waitUntil: "domcontentloaded",
    });
    await expect(page.getByRole("heading", { name: /^Edit resource$/i }).first()).toBeVisible();
    await waitForEditorHydration(page);

    await expectColor(page.getByTestId("creator-editor-images-icon"), primaryColor);
    await expectColor(page.getByTestId("creator-editor-linked-images-empty-icon"), primaryColor);
    await expectColor(page.getByTestId("creator-editor-buyer-file-icon"), primaryColor);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
  } finally {
    await cleanupSeededResources();
  }
});
