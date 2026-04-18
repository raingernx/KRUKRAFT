import { expect, test, type Page } from "@playwright/test";
import {
  CreatorApplicationStatus,
  CreatorStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";
import bcrypt from "bcryptjs";

import { collectRuntimeErrors } from "./helpers/browser";
import {
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
  rejectionReason?: string | null;
};

function isRetryableGotoError(error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  return (
    message.includes("net::ERR_ABORTED") ||
    message.includes("net::ERR_CONNECTION_REFUSED") ||
    message.includes("Timeout 30000ms exceeded") ||
    message.includes("Timeout 60000ms exceeded") ||
    message.includes("frame was detached") ||
    message.includes("Navigation failed because page was closed")
  );
}

async function gotoWithRetry(page: Page, path: string, attempts = 3) {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      await page.goto(path, {
        waitUntil: "commit",
        timeout: 60_000,
      });
      return;
    } catch (error) {
      if (!isRetryableGotoError(error) || attempt === attempts - 1) {
        throw error;
      }

      await page.waitForTimeout(500);
    }
  }
}

function createCreatorApplyAuditEmail(label: string) {
  const suffix = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `audit.creator.apply.${label}.${suffix}@krukraft.dev`;
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
        rejectionReason: input.rejectionReason ?? null,
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
        rejectionReason: input.rejectionReason ?? null,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

async function loginAsCreatorApplyAuditUser(page: Page, email: string) {
  const credentials: LoginCredentials = {
    email,
    password: APPLY_PASSWORD,
  };

  await loginWithCredentials(page, credentials, "/dashboard/creator/apply");
}

test("creator apply shows pending state for users with a submitted application", async ({
  page,
}) => {
  const email = createCreatorApplyAuditEmail("pending");

  await seedCreatorApplyAuditUser({
    email,
    applicationStatus: CreatorApplicationStatus.PENDING,
    creatorEnabled: false,
    creatorStatus: CreatorStatus.INACTIVE,
  });

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreatorApplyAuditUser(page, email);

  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", { name: /^Become a Creator$/i }).first(),
  ).toBeVisible();
  await expect(page.getByText(/^Application under review$/i)).toBeVisible();
  await expect(
    page.getByText(/typically respond within 1–3 business days/i),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^Submit application$/i }),
  ).toHaveCount(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator apply shows rejected feedback and reapply form for rejected users", async ({
  page,
}) => {
  const email = createCreatorApplyAuditEmail("rejected");

  await seedCreatorApplyAuditUser({
    email,
    applicationStatus: CreatorApplicationStatus.REJECTED,
    creatorEnabled: false,
    creatorStatus: CreatorStatus.INACTIVE,
    rejectionReason: "Please add clearer evidence of original teaching materials.",
  });

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreatorApplyAuditUser(page, email);

  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.getByRole("heading", { name: /^Become a Creator$/i }).first(),
  ).toBeVisible();
  await expect(page.getByText(/^Application not approved$/i)).toBeVisible();
  await expect(page.getByText(/^Feedback:/i).first()).toBeVisible();
  await expect(page.getByText(
    "Please add clearer evidence of original teaching materials.",
  )).toBeVisible();
  await expect(
    page.getByRole("heading", { name: /^Submit a new application$/i }),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^Submit application$/i }),
  ).toBeVisible();

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator apply shows approved handoff state until workspace access is finalized", async ({
  page,
}) => {
  const email = createCreatorApplyAuditEmail("approved");

  await seedCreatorApplyAuditUser({
    email,
    applicationStatus: CreatorApplicationStatus.APPROVED,
    creatorEnabled: false,
    creatorStatus: CreatorStatus.INACTIVE,
  });

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginWithCredentials(
    page,
    { email, password: APPLY_PASSWORD },
    "/dashboard",
  );
  await gotoWithRetry(page, "/dashboard/creator/apply");

  await expect
    .poll(
      async () => {
        if (
          await page
            .locator('[data-route-shell-ready="dashboard-creator-overview"]')
            .first()
            .isVisible()
            .catch(() => false)
        ) {
          return "overview";
        }

        if (
          await page
            .locator('[data-route-shell-ready="dashboard-creator-apply"]')
            .first()
            .isVisible()
            .catch(() => false)
        ) {
          return "apply";
        }

        return "pending";
      },
      { timeout: 30_000 },
    )
    .not.toBe("pending");

  const overviewVisible = await page
    .locator('[data-route-shell-ready="dashboard-creator-overview"]')
    .first()
    .isVisible()
    .catch(() => false);

  if (overviewVisible) {
    await expect(page).toHaveURL(/\/dashboard\/creator$/);
    await expect(
      page.getByRole("heading", { name: /^Workspace$/i }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Become a Creator$/i }),
    ).toHaveCount(0);
  } else {
    await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
    await expect(
      page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /^Become a Creator$/i }).first(),
    ).toBeVisible();
    await expect(page.getByText(/^Application approved$/i)).toBeVisible();
    await expect(
      page.getByText(/Creator workspace access is still being finalized/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: /^Submit application$/i }),
    ).toHaveCount(0);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator apply lets rejected users submit a fresh application and transitions to pending", async ({
  page,
}) => {
  const email = createCreatorApplyAuditEmail("reapply");
  const slugSuffix = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 7)}`;
  const creatorDisplayName = `Audit Reapply Creator ${slugSuffix}`;
  const creatorSlug = `audit-reapply-creator-${slugSuffix}`;
  const applicationPayload = {
    creatorDisplayName,
    creatorSlug,
    creatorBio:
      "I create original classroom packs with answer keys and scaffolded revision sheets.",
  };

  await seedCreatorApplyAuditUser({
    email,
    applicationStatus: CreatorApplicationStatus.REJECTED,
    creatorEnabled: false,
    creatorStatus: CreatorStatus.INACTIVE,
    rejectionReason: "Please clarify how these resources differ from public worksheets.",
  });

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreatorApplyAuditUser(page, email);

  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText(/^Application not approved$/i)).toBeVisible();
  await expect(
    page.locator('[data-creator-application-form-ready="true"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });

  await page.locator("#displayName").fill(applicationPayload.creatorDisplayName);
  await expect(page.locator("#slug")).toHaveValue(applicationPayload.creatorSlug);
  await expect(page.locator("#slug-hint")).toHaveText(
    "This creator URL is available.",
    { timeout: 30_000 },
  );
  await page.locator("#bio").fill(applicationPayload.creatorBio);

  const [submitResponse] = await Promise.all([
    page.waitForResponse((response) => {
      return (
        response.url().includes("/api/creator/apply") &&
        response.request().method() === "POST"
      );
    }),
    page.getByRole("button", { name: /^Submit application$/i }).click(),
  ]);
  expect(submitResponse.status()).toBe(201);

  await gotoWithRetry(page, "/dashboard/creator/apply");

  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByText(/^Application under review$/i)).toBeVisible({
    timeout: 30_000,
  });
  await expect(
    page.getByText(/typically respond within 1–3 business days/i),
  ).toBeVisible();
  await expect(
    page.getByRole("button", { name: /^Submit application$/i }),
  ).toHaveCount(0);
  await expect(page.getByText(/^Application not approved$/i)).toHaveCount(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
