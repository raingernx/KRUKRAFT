import { expect, test } from "@playwright/test";
import {
  CreatorApplicationStatus,
  CreatorStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";

import { loginAsAdmin } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 120_000 });

const SEEDED_EMAIL = "admin-creators-tracking@krukraft.dev";

async function seedCreatorApplication() {
  const prisma = new PrismaClient();

  try {
    await prisma.user.upsert({
      where: { email: SEEDED_EMAIL },
      update: {
        name: "Tracking Holdout Creator",
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        creatorDisplayName: "Tracking Holdout Creator",
        creatorSlug: `tracking-holdout-${Date.now().toString(36)}`,
        creatorBio: "Seeded creator application used to prove admin creator tracking normalization.",
        creatorEnabled: false,
        creatorStatus: CreatorStatus.INACTIVE,
        creatorApplicationStatus: CreatorApplicationStatus.PENDING,
        appliedAt: new Date(),
        rejectionReason: null,
      },
      create: {
        name: "Tracking Holdout Creator",
        email: SEEDED_EMAIL,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        creatorDisplayName: "Tracking Holdout Creator",
        creatorSlug: `tracking-holdout-${Date.now().toString(36)}`,
        creatorBio: "Seeded creator application used to prove admin creator tracking normalization.",
        creatorEnabled: false,
        creatorStatus: CreatorStatus.INACTIVE,
        creatorApplicationStatus: CreatorApplicationStatus.PENDING,
        appliedAt: new Date(),
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

test("admin creators route drops route-owned tracking on summary metrics and table headers", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await seedCreatorApplication();
  await loginAsAdmin(page, "/admin/creators");

  await expect(page.getByRole("heading", { name: /^Creator Applications$/i })).toBeVisible();
  await expect(page.getByTestId("admin-creators-metric-pending")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-creators-metric-approved")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-creators-metric-rejected")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  await expect(page.getByTestId("admin-creators-col-applicant")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-creators-col-creator")).toHaveCSS(
    "letter-spacing",
    "normal",
  );
  await expect(page.getByTestId("admin-creators-col-status")).toHaveCSS(
    "letter-spacing",
    "normal",
  );

  await expect(page.getByText("Tracking Holdout Creator").first()).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
