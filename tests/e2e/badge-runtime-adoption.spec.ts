import { expect, test } from "@playwright/test";
import {
  CreatorApplicationStatus,
  CreatorStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

import { collectRuntimeErrors } from "./helpers/browser";
import {
  loginAsCreator,
  loginWithCredentials,
  type LoginCredentials,
} from "./helpers/auth";

test.describe.configure({ timeout: 180_000 });

const APPLY_PASSWORD = "Krukraft2024!";

type CreatorApplyAuditUser = {
  email: string;
  applicationStatus: CreatorApplicationStatus;
  creatorEnabled: boolean;
  creatorStatus: CreatorStatus;
};

function createCreatorApplyAuditEmail(label: string) {
  const suffix = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `audit.badge.runtime.${label}.${suffix}@krukraft.dev`;
}

async function seedCreatorApplyAuditUser(input: CreatorApplyAuditUser) {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash(APPLY_PASSWORD, 12);

  try {
    await prisma.user.upsert({
      where: { email: input.email },
      update: {
        name: input.email,
        hashedPassword,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        creatorEnabled: input.creatorEnabled,
        creatorStatus: input.creatorStatus,
        creatorApplicationStatus: input.applicationStatus,
        rejectionReason: null,
        creatorDisplayName: null,
        creatorSlug: null,
        creatorBio: null,
      },
      create: {
        name: input.email,
        email: input.email,
        hashedPassword,
        role: UserRole.STUDENT,
        emailVerified: new Date(),
        creatorEnabled: input.creatorEnabled,
        creatorStatus: input.creatorStatus,
        creatorApplicationStatus: input.applicationStatus,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function loginAsCreatorApplyAuditUser(page: Parameters<typeof loginAsCreator>[0], email: string) {
  const credentials: LoginCredentials = {
    email,
    password: APPLY_PASSWORD,
  };

  await loginWithCredentials(page, credentials, "/dashboard/creator/apply");
}

test("badge runtime adoption keeps warning and featured on the canonical recipes", async ({
  page,
}) => {
  const pendingEmail = createCreatorApplyAuditEmail("pending");

  await seedCreatorApplyAuditUser({
    email: pendingEmail,
    applicationStatus: CreatorApplicationStatus.PENDING,
    creatorEnabled: false,
    creatorStatus: CreatorStatus.INACTIVE,
  });

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreatorApplyAuditUser(page, pendingEmail);
  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
  ).toBeVisible();

  const pendingBadge = page.locator('[data-slot="badge"]', {
    hasText: /^Pending$/i,
  });
  await expect(pendingBadge).toHaveAttribute("data-variant", "warning");
  await expect(pendingBadge).toHaveClass(/bg-inset/);
  await expect(pendingBadge).toHaveClass(/border-warning-500\/35/);
  await expect(pendingBadge).toHaveClass(/text-warning-700/);

  await loginAsCreator(page, "/dashboard/creator");
  await expect(page).toHaveURL(/\/dashboard\/creator$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-overview"]').first(),
  ).toBeVisible();

  const creatorRouteBadge = page.locator('[data-slot="badge"]', {
    hasText: /^Creator route$/i,
  });
  await expect(creatorRouteBadge).toHaveAttribute("data-variant", "featured");
  await expect(creatorRouteBadge).toHaveClass(/bg-accent-yellow-soft/);
  await expect(creatorRouteBadge).toHaveClass(/border-accent-yellow\/40/);
  await expect(creatorRouteBadge).toHaveClass(/text-accent-yellow/);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
