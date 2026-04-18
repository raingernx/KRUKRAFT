import { expect, test, type Page } from "@playwright/test";
import bcrypt from "bcryptjs";
import {
  CreatorApplicationStatus,
  CreatorStatus,
  PrismaClient,
  UserRole,
} from "@prisma/client";

import { loginAsCreator, loginAsUser, loginWithCredentials } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const DASHBOARD_SETTINGS_HEADING = /Account settings/i;
const EMPTY_CREATOR_PASSWORD = "Krukraft2024!";
const DASHBOARD_GOTO_TIMEOUT_MS = 60_000;
const DASHBOARD_ROUTE_READY_TIMEOUT_MS = 60_000;

type RefreshSample = {
  href: string;
  ts: number;
  rootLoadingVisible: boolean;
  dashboardShellVisible: boolean;
  routeReady: string[];
  loadingScopes: string[];
};

function createEmptyCreatorAuditEmail() {
  const suffix = `${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  return `audit.creator.empty.${suffix}@krukraft.dev`;
}

async function seedEmptyCreatorWorkspaceUser(email: string) {
  const prisma = new PrismaClient();
  const hashedPassword = await bcrypt.hash(EMPTY_CREATOR_PASSWORD, 12);
  const creatorSlug = `empty-creator-${Date.now().toString(36)}`;

  try {
    await prisma.user.upsert({
      where: { email },
      update: {
        name: "Empty Creator",
        hashedPassword,
        role: UserRole.INSTRUCTOR,
        emailVerified: new Date(),
        creatorDisplayName: "Empty Creator",
        creatorSlug,
        creatorEnabled: true,
        creatorStatus: CreatorStatus.ACTIVE,
        creatorApplicationStatus: CreatorApplicationStatus.APPROVED,
      },
      create: {
        name: "Empty Creator",
        email,
        hashedPassword,
        role: UserRole.INSTRUCTOR,
        emailVerified: new Date(),
        creatorDisplayName: "Empty Creator",
        creatorSlug,
        creatorEnabled: true,
        creatorStatus: CreatorStatus.ACTIVE,
        creatorApplicationStatus: CreatorApplicationStatus.APPROVED,
      },
    });
  } finally {
    await prisma.$disconnect();
  }
}

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
        timeout: DASHBOARD_GOTO_TIMEOUT_MS,
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

const DASHBOARD_FULL_SHELL_SCOPES = [
  "dashboard-group",
  "dashboard-overview",
  "dashboard-library",
  "dashboard-downloads",
  "dashboard-purchases",
  "dashboard-settings",
  "dashboard-subscription",
  "dashboard-creator-overview",
  "dashboard-creator-analytics",
  "dashboard-creator-resources",
  "dashboard-creator-sales",
  "dashboard-creator-payouts",
  "dashboard-creator-profile",
  "dashboard-creator-resource-editor",
  "dashboard-creator-apply",
  "dashboard-neutral",
  "dashboard-home",
  "dashboard-library",
  "dashboard-downloads",
  "dashboard-purchases",
  "dashboard-membership",
  "dashboard-settings",
  "dashboard-creator-neutral",
  "dashboard-creator",
  "dashboard-creator-analytics",
  "dashboard-creator-resources",
  "dashboard-creator-sales",
  "dashboard-creator-payouts",
  "dashboard-creator-profile",
  "dashboard-creator-editor",
] as const;

async function expectNoDashboardGroupOverlay(page: Page) {
  await expect(page.locator('[data-loading-scope="dashboard-group"]:visible')).toHaveCount(0, {
    timeout: 20_000,
  });
}

async function expectNoDashboardFullShellOverlap(page: Page) {
  const visibleScopes = (await page.evaluate(`
    (() => {
      const knownScopes = ${JSON.stringify([...DASHBOARD_FULL_SHELL_SCOPES])};
      return Array.from(document.querySelectorAll("[data-loading-scope]"))
        .filter((node) => {
          if (!(node instanceof HTMLElement)) {
            return false;
          }

          const style = window.getComputedStyle(node);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number(style.opacity) === 0
          ) {
            return false;
          }

          const rect = node.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth
          );
        })
        .map((node) => node.getAttribute("data-loading-scope"))
        .filter((value) => typeof value === "string" && value.length > 0)
        .filter((scope) => knownScopes.includes(scope));
    })()
  `)) as string[];

  expect(Array.from(new Set(visibleScopes)).length).toBeLessThanOrEqual(1);
}

async function startRefreshProbe(page: Page) {
  const refreshProbeScript = `
    (() => {
      const storageKey = "__krukraftRefreshProbeSamples";
      const activeKey = "__krukraftRefreshProbeActive";
      const SAMPLE_INTERVAL_MS = 80;
      const MAX_SAMPLES = 400;

      const readSamples = () => {
        try {
          const raw = window.sessionStorage.getItem(storageKey);
          return raw ? JSON.parse(raw) : [];
        } catch {
          return [];
        }
      };

      const writeSamples = (samples) => {
        window.sessionStorage.setItem(storageKey, JSON.stringify(samples));
      };

      let stopped = false;
      let rafId = 0;
      let lastSampleTs = -Infinity;
      let lastSampleSignature = "";
      let lastPersistTs = -Infinity;
      let samples = [];

      const persistSamples = (force = false) => {
        const now = performance.now();
        if (!force && now - lastPersistTs < 250) {
          return;
        }

        writeSamples(samples);
        lastPersistTs = now;
      };

      const getVisibleLoadingScopes = () => {
        const isVisible = (node) => {
          if (!(node instanceof HTMLElement)) {
            return false;
          }

          const style = window.getComputedStyle(node);
          if (
            style.display === "none" ||
            style.visibility === "hidden" ||
            Number(style.opacity) === 0
          ) {
            return false;
          }

          const rect = node.getBoundingClientRect();
          return (
            rect.width > 0 &&
            rect.height > 0 &&
            rect.bottom > 0 &&
            rect.right > 0 &&
            rect.top < window.innerHeight &&
            rect.left < window.innerWidth
          );
        };

        return Array.from(document.querySelectorAll("[data-loading-scope]"))
          .filter(isVisible)
          .map((node) => node.getAttribute("data-loading-scope"))
          .filter(Boolean);
      };

      const collectSample = () => ({
        href: window.location.pathname + window.location.search,
        ts: performance.now(),
        rootLoadingVisible: Boolean(document.querySelector("[data-app-root-loading='true']")),
        dashboardShellVisible: Boolean(document.querySelector("[data-route-shell-ready='dashboard']")),
        routeReady: Array.from(document.querySelectorAll("[data-route-shell-ready]"))
          .map((node) => node.getAttribute("data-route-shell-ready"))
          .filter(Boolean),
        loadingScopes: getVisibleLoadingScopes(),
      });

      const sample = () => {
        const nextSample = collectSample();
        const nextSignature = JSON.stringify({
          href: nextSample.href,
          rootLoadingVisible: nextSample.rootLoadingVisible,
          dashboardShellVisible: nextSample.dashboardShellVisible,
          routeReady: nextSample.routeReady,
          loadingScopes: nextSample.loadingScopes,
        });
        const enoughTimeElapsed =
          nextSample.ts - lastSampleTs >= SAMPLE_INTERVAL_MS;

        if (enoughTimeElapsed || nextSignature !== lastSampleSignature) {
          if (Array.isArray(samples) && samples.length === 0) {
            samples = readSamples();
          }
          samples.push(nextSample);
          if (samples.length > MAX_SAMPLES) {
            samples.splice(0, samples.length - MAX_SAMPLES);
          }
          persistSamples();
          lastSampleTs = nextSample.ts;
          lastSampleSignature = nextSignature;
        }

        if (!stopped) {
          rafId = window.requestAnimationFrame(sample);
        }
      };

      if (window.sessionStorage.getItem(activeKey) !== "1") {
        window.sessionStorage.removeItem(storageKey);
        window.sessionStorage.setItem(activeKey, "1");
        samples = [];
      } else {
        samples = readSamples();
      }

      window.addEventListener("pagehide", () => {
        persistSamples(true);
      });
      window.__krukraftRefreshProbe = {
        stop: () => {
          stopped = true;
          window.cancelAnimationFrame(rafId);
          persistSamples(true);
          window.sessionStorage.removeItem(activeKey);
          return samples;
        },
      };

      sample();
      rafId = window.requestAnimationFrame(sample);
    })();
  `;

  await page.addInitScript(refreshProbeScript);
  await page.evaluate(refreshProbeScript);
}

async function stopRefreshProbe(page: Page) {
  for (let attempt = 0; attempt < 4; attempt += 1) {
    try {
      return (await page.evaluate(`
        (() => {
          const probe = window.__krukraftRefreshProbe;
          if (probe) {
            return probe.stop();
          }

          try {
            const raw = window.sessionStorage.getItem("__krukraftRefreshProbeSamples");
            return raw ? JSON.parse(raw) : [];
          } catch {
            return [];
          }
        })()
      `)) as RefreshSample[];
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      if (!message.includes("Execution context was destroyed") || attempt === 3) {
        throw error;
      }
      await page.waitForLoadState("domcontentloaded");
    }
  }

  return [];
}

async function clickDashboardNavigationLink(
  page: Page,
  {
    href,
    label,
  }: {
    href: string;
    label: RegExp;
  },
) {
  const targetUrlPattern = new RegExp(
    `${href.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`,
  );

  const clickUntilNavigationStarts = async (locator: ReturnType<Page["locator"]>) => {
    for (let attempt = 0; attempt < 2; attempt += 1) {
      await expect(locator).toBeVisible({ timeout: 10_000 });
      await locator.scrollIntoViewIfNeeded();

      const navigationStarted = page
        .waitForURL(targetUrlPattern, { timeout: 2_000 })
        .then(() => true)
        .catch(() => false);

      await locator.click();

      if (await navigationStarted) {
        return;
      }

      await page.waitForTimeout(150);
    }
  };

  const sidebarLink = page
    .locator(`aside nav a[href="${href}"]:visible`)
    .filter({ hasText: label })
    .first();

  if (await sidebarLink.isVisible().catch(() => false)) {
    await clickUntilNavigationStarts(sidebarLink);
    return;
  }

  const contentLink = page
    .locator(`main a[href="${href}"]:visible`)
    .filter({ hasText: label })
    .first();

  if (await contentLink.isVisible().catch(() => false)) {
    await clickUntilNavigationStarts(contentLink);
    return;
  }

  const accountButton = page
    .locator(
      'header button[data-dashboard-account-trigger="true"][data-dashboard-account-ready="true"]:visible',
    )
    .first();

  await openDashboardAccountMenu(page, accountButton);

  const accountMenuLink = page
    .locator(`[data-dashboard-account-menu="true"] [data-dashboard-account-link="${href}"]:visible`)
    .filter({ hasText: label })
    .first();

  await expect(accountMenuLink).toBeVisible({ timeout: 20_000 });
  await clickUntilNavigationStarts(accountMenuLink);
}

async function openDashboardAccountMenu(
  page: Page,
  accountButton = page
    .locator(
      'header button[data-dashboard-account-trigger="true"][data-dashboard-account-ready="true"]:visible',
    )
    .first(),
) {
  const menu = page.locator('[data-dashboard-account-menu="true"]:visible').first();

  await expect(accountButton).toBeVisible({ timeout: 20_000 });

  for (let attempt = 0; attempt < 3; attempt += 1) {
    await accountButton.scrollIntoViewIfNeeded().catch(() => undefined);
    await accountButton.hover().catch(() => undefined);
    await accountButton.click({ timeout: 5_000 });

    const expandedAfterClick = await expect
      .poll(
        async () => accountButton.getAttribute("aria-expanded"),
        { timeout: 2_000 },
      )
      .toBe("true")
      .then(() => true)
      .catch(() => false);

    if (expandedAfterClick && (await menu.isVisible().catch(() => false))) {
      break;
    }

    await accountButton.focus().catch(() => undefined);
    await page.keyboard.press("Space").catch(() => undefined);
    const expandedAfterSpace = await expect
      .poll(
        async () => accountButton.getAttribute("aria-expanded"),
        { timeout: 2_000 },
      )
      .toBe("true")
      .then(() => true)
      .catch(() => false);

    if (expandedAfterSpace && (await menu.isVisible().catch(() => false))) {
      break;
    }

    await page.keyboard.press("Enter").catch(() => undefined);
    const expandedAfterEnter = await expect
      .poll(
        async () => accountButton.getAttribute("aria-expanded"),
        { timeout: 2_000 },
      )
      .toBe("true")
      .then(() => true)
      .catch(() => false);

    if (expandedAfterEnter && (await menu.isVisible().catch(() => false))) {
      break;
    }

    await page.keyboard.press("Escape").catch(() => undefined);
    await accountButton.evaluate((element) => {
      (element as HTMLButtonElement).click();
    }).catch(() => undefined);
    const expandedAfterEval = await expect
      .poll(
        async () => accountButton.getAttribute("aria-expanded"),
        { timeout: 2_000 },
      )
      .toBe("true")
      .then(() => true)
      .catch(() => false);

    if (expandedAfterEval && (await menu.isVisible().catch(() => false))) {
      break;
    }

    await page.waitForTimeout(250);
  }

  await expect(menu).toBeVisible({ timeout: 20_000 });
}

function expectNoDisallowedScopesAfterRouteReady(
  samples: RefreshSample[],
  readyMarker: string,
  disallowedScopes: readonly string[],
  scenario: string,
) {
  const firstReadyIndex = samples.findIndex((sample) =>
    sample.routeReady.includes(readyMarker),
  );

  expect(
    firstReadyIndex,
    `${scenario} did not observe route-ready marker ${readyMarker}`,
  ).toBeGreaterThanOrEqual(0);

  const offendingSample = samples
    .slice(firstReadyIndex)
    .find((sample) =>
      sample.loadingScopes.some((scope) => disallowedScopes.includes(scope)),
    );

  expect(
    offendingSample,
    offendingSample
      ? `${scenario} kept disallowed scopes visible after ${readyMarker}: ${offendingSample.loadingScopes.join(", ")} at ${offendingSample.href}`
      : "",
  ).toBeUndefined();
}

function expectScopesNeverSeen(
  samples: RefreshSample[],
  disallowedScopes: readonly string[],
  scenario: string,
) {
  const offendingSample = samples.find((sample) =>
    sample.loadingScopes.some((scope) => disallowedScopes.includes(scope)),
  );

  expect(
    offendingSample,
    offendingSample
      ? `${scenario} unexpectedly showed disallowed scopes: ${offendingSample.loadingScopes.join(", ")} at ${offendingSample.href}`
      : "",
  ).toBeUndefined();
}

async function warmDashboardRoutes(
  page: Page,
  routes: Array<{
    path: string;
    routeReady: string;
    heading: RegExp;
  }>,
) {
  for (const route of routes) {
    await gotoWithRetry(page, route.path);
    await expect(
      page.locator(`[data-route-shell-ready="${route.routeReady}"]`).first(),
    ).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
  }
}

test("creator workspace empty recent resources state stays centered and actionable", async ({
  page,
}) => {
  const email = createEmptyCreatorAuditEmail();
  await seedEmptyCreatorWorkspaceUser(email);

  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginWithCredentials(
    page,
    { email, password: EMPTY_CREATOR_PASSWORD },
    "/dashboard/creator",
  );

  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-overview"]').first(),
  ).toBeVisible({
    timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
  });
  await expect(page.getByRole("heading", { name: /^Workspace$/i })).toBeVisible();
  await expect(
    page.locator("#creator-quick-links").getByText(/^Launch checklist$/i),
  ).toBeVisible();
  await expect(
    page.locator("#creator-quick-links").getByText(/^0\/3 complete$/i),
  ).toBeVisible();
  await expect(page.getByText(/^No creator resources yet$/i)).toBeVisible();
  await expect(
    page.locator("main").getByRole("link", { name: /^Create resource$/i }),
  ).toHaveCount(2);
  await expect(
    page.locator("main").getByRole("link", { name: /^Storefront$/i }),
  ).toHaveCount(1);
  await expect(page.locator("#creator-profile-hub")).toHaveCount(0);

  const emptyState = page.getByText(/^No creator resources yet$/i).locator("..");
  await expect(emptyState).toHaveClass(/text-center/);
  await expect(emptyState).toHaveClass(/max-w-none/);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator workspace routes render creator shells without dashboard-in-dashboard flash", async ({
  page,
}) => {
  test.setTimeout(300_000);
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const creatorRoutes: Array<{
    path: string;
    finalPath?: string;
    routeReady: string;
    heading: RegExp;
  }> = [
    {
      path: "/dashboard/creator/resources",
      routeReady: "dashboard-creator-resources",
      heading: /^Creator resources$/i,
    },
    {
      path: "/dashboard/creator/resources/new",
      routeReady: "dashboard-creator-resource-editor",
      heading: /^(Create your first resource|New resource)$/i,
    },
    {
      path: "/dashboard/creator/profile",
      routeReady: "dashboard-creator-profile",
      heading: /^Profile$/i,
    },
    {
      path: "/dashboard/creator/settings",
      finalPath: "/dashboard/creator/settings",
      routeReady: "dashboard-settings",
      heading: DASHBOARD_SETTINGS_HEADING,
    },
    {
      path: "/dashboard/creator/analytics",
      routeReady: "dashboard-creator-analytics",
      heading: /^Analytics$/i,
    },
    {
      path: "/dashboard/creator/sales",
      routeReady: "dashboard-creator-sales",
      heading: /^Earnings$/i,
    },
    {
      path: "/dashboard/creator/payouts",
      routeReady: "dashboard-creator-payouts",
      heading: /^Payouts$/i,
    },
  ];

  await loginAsCreator(page, creatorRoutes[0].path);
  await warmDashboardRoutes(page, creatorRoutes);

  for (const route of creatorRoutes) {
    const finalPath = route.finalPath ?? route.path;
    await gotoWithRetry(page, route.path);
    await expect(
      page,
    ).toHaveURL(new RegExp(`${finalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
    await expect(page.locator(`[data-route-shell-ready="${route.routeReady}"]`).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("dashboard account surfaces clear the dashboard overlay after shell readiness", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const dashboardAccountRoutes: Array<{
    path: string;
    routeReady: string;
    heading: RegExp;
  }> = [
    {
      path: "/dashboard/settings",
      routeReady: "dashboard-settings",
      heading: DASHBOARD_SETTINGS_HEADING,
    },
    {
      path: "/dashboard/membership",
      routeReady: "dashboard-subscription",
      heading: /^(Membership|Subscription)$/i,
    },
  ];

  await loginAsCreator(page, "/dashboard");

  for (const route of dashboardAccountRoutes) {
    await gotoWithRetry(page, route.path);
    await expect(page).toHaveURL(new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`));
    await expect(page.locator(`[data-route-shell-ready="${route.routeReady}"]`).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator apply clears dashboard overlays without shell stacking for regular users", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsUser(page, "/resources");
  await gotoWithRetry(page, "/dashboard/creator/apply");

  await expect(page).toHaveURL(/\/dashboard\/creator\/apply$/);
  await expect(page.locator('[data-route-shell-ready="dashboard-creator-apply"]').first()).toBeVisible({
    timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
  });
  await expect(page.getByRole("heading", { name: /^Become a Creator$/i }).first()).toBeVisible({
    timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
  });
  await expectNoDashboardGroupOverlay(page);
  await expectNoDashboardFullShellOverlap(page);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator nav stays hidden behind real creator access on learner dashboard routes", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  const accountButton = page
    .locator(
      'header button[data-dashboard-account-trigger="true"][data-dashboard-account-ready="true"]:visible',
    )
    .first();

  await loginAsUser(page, "/dashboard/library");
  await expect(page.locator('[data-route-shell-ready="dashboard-library"]').first()).toBeVisible({
    timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
  });

  await expect(page.locator('aside nav a[href="/dashboard/creator/apply"]').first()).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator('aside nav a[href="/dashboard/creator"]').first()).toHaveCount(0);
  await expect(
    page.locator('aside nav a[href="/dashboard/creator/resources"]').first(),
  ).toHaveCount(0);
  await expect(page.locator('aside nav a[href="/dashboard/creator/sales"]').first()).toHaveCount(0);

  await openDashboardAccountMenu(page, accountButton);

  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/apply"]:visible',
    ),
  ).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator"]:visible',
    ),
  ).toHaveCount(0);
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/resources"]:visible',
    ),
  ).toHaveCount(0);
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/sales"]:visible',
    ),
  ).toHaveCount(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator nav stays visible across sidebar and account menu for approved creators", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  const accountButton = page
    .locator(
      'header button[data-dashboard-account-trigger="true"][data-dashboard-account-ready="true"]:visible',
    )
    .first();

  await loginAsCreator(page, "/dashboard/library");
  await expect(page.locator('[data-route-shell-ready="dashboard-library"]').first()).toBeVisible({
    timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
  });

  await expect(page.locator('aside nav a[href="/dashboard/creator"]').first()).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator('aside nav a[href="/dashboard/creator/resources"]').first(),
  ).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator('aside nav a[href="/dashboard/creator/sales"]').first()).toBeVisible({
    timeout: 20_000,
  });
  await expect(page.locator('aside nav a[href="/dashboard/creator/apply"]').first()).toHaveCount(0);

  await openDashboardAccountMenu(page, accountButton);

  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator"]:visible',
    ),
  ).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/resources"]:visible',
    ),
  ).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/sales"]:visible',
    ),
  ).toBeVisible({
    timeout: 20_000,
  });
  await expect(
    page.locator(
      '[data-dashboard-account-menu="true"] [data-dashboard-account-link="/dashboard/creator/apply"]:visible',
    ),
  ).toHaveCount(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator cold-entry routes clear neutral creator fallback after route readiness", async ({
  page,
}) => {
  test.setTimeout(300_000);
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const coldEntryRoutes: Array<{
    path: string;
    finalPath?: string;
    routeReady: string;
    heading: RegExp;
    skipSampleReadyAssertion?: boolean;
  }> = [
    {
      path: "/dashboard/creator",
      routeReady: "dashboard-creator-overview",
      heading: /^Workspace$/i,
    },
    {
      path: "/dashboard/creator/analytics",
      routeReady: "dashboard-creator-analytics",
      heading: /^Analytics$/i,
    },
    {
      path: "/dashboard/creator/profile",
      routeReady: "dashboard-creator-profile",
      heading: /^Profile$/i,
    },
    {
      path: "/dashboard/creator/settings",
      finalPath: "/dashboard/creator/settings",
      routeReady: "dashboard-settings",
      heading: DASHBOARD_SETTINGS_HEADING,
      skipSampleReadyAssertion: true,
    },
    {
      path: "/dashboard/creator/payouts",
      routeReady: "dashboard-creator-payouts",
      heading: /^Payouts$/i,
    },
  ];

  await loginAsCreator(page, "/resources");
  await expect(page).toHaveURL(/\/resources(?:\?.*)?$/);
  await warmDashboardRoutes(page, coldEntryRoutes);
  await gotoWithRetry(page, "/resources");
  await expect(page).toHaveURL(/\/resources(?:\?.*)?$/);

  for (const route of coldEntryRoutes) {
    const finalPath = route.finalPath ?? route.path;
    const finalPathPattern = new RegExp(
      `${finalPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`,
    );
    await startRefreshProbe(page);
    await gotoWithRetry(page, route.path);
    await expect(page).toHaveURL(finalPathPattern);
    await expect(page.locator(`[data-route-shell-ready="${route.routeReady}"]`).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible({
      timeout: DASHBOARD_ROUTE_READY_TIMEOUT_MS,
    });
    await page.waitForTimeout(500);

    const samples = await stopRefreshProbe(page);
    const routeSamples = samples.filter((sample) => finalPathPattern.test(sample.href));

    if (!route.skipSampleReadyAssertion) {
      expect(
        routeSamples.length,
        `${route.path} did not capture route samples during cold entry`,
      ).toBeGreaterThan(0);
      expectNoDisallowedScopesAfterRouteReady(
        routeSamples,
        route.routeReady,
        ["dashboard-group", "dashboard-creator-neutral"],
        finalPath,
      );
      expectScopesNeverSeen(
        routeSamples,
        ["dashboard-creator-neutral"],
        finalPath,
      );
    }

    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("learner cold-entry routes clear neutral learner fallback after route readiness", async ({
  page,
}) => {
  test.setTimeout(300_000);
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const coldEntryRoutes: Array<{
    path: string;
    routeReady: string;
    heading: RegExp;
  }> = [
    {
      path: "/dashboard",
      routeReady: "dashboard-overview",
      heading: /Welcome back/i,
    },
    {
      path: "/dashboard/library",
      routeReady: "dashboard-library",
      heading: /^My Library$/i,
    },
    {
      path: "/dashboard/downloads",
      routeReady: "dashboard-downloads",
      heading: /Download history/i,
    },
    {
      path: "/dashboard/purchases",
      routeReady: "dashboard-purchases",
      heading: /^(Purchases|Order history)$/i,
    },
    {
      path: "/dashboard/membership",
      routeReady: "dashboard-subscription",
      heading: /^Membership$/i,
    },
    {
      path: "/dashboard/settings",
      routeReady: "dashboard-settings",
      heading: DASHBOARD_SETTINGS_HEADING,
    },
  ];

  await loginAsCreator(page, "/resources");
  await expect(page).toHaveURL(/\/resources(?:\?.*)?$/);
  await warmDashboardRoutes(page, coldEntryRoutes);
  await gotoWithRetry(page, "/resources");
  await expect(page).toHaveURL(/\/resources(?:\?.*)?$/);

  for (const route of coldEntryRoutes) {
    await startRefreshProbe(page);
    await gotoWithRetry(page, route.path);
    await expect(page).toHaveURL(
      new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`),
    );
    await expect(
      page.locator(`[data-route-shell-ready="${route.routeReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("heading", { name: route.heading }).first()).toBeVisible({
      timeout: 30_000,
    });
    await page.waitForTimeout(500);

    const samples = await stopRefreshProbe(page);
    const routeSamples = samples.filter((sample) =>
      new RegExp(`${route.path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`).test(
        sample.href,
      ),
    );

    expect(
      routeSamples.length,
      `${route.path} did not capture route samples during cold entry`,
    ).toBeGreaterThan(0);
    expectNoDisallowedScopesAfterRouteReady(
      routeSamples,
      route.routeReady,
      ["dashboard-group", "dashboard-neutral"],
      route.path,
    );
    expectScopesNeverSeen(routeSamples, ["dashboard-neutral"], route.path);

    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("learner sidebar transitions keep route-specific loading without neutral fallback flash", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const transitions: Array<{
    fromPath: string;
    fromReady: string;
    toPath: string;
    toReady: string;
    linkLabel: RegExp;
    heading: RegExp;
    disallowedAfterReady: readonly string[];
  }> = [
    {
      fromPath: "/dashboard",
      fromReady: "dashboard-overview",
      toPath: "/dashboard/library",
      toReady: "dashboard-library",
      linkLabel: /^Library$/i,
      heading: /^My Library$/i,
      disallowedAfterReady: ["dashboard-group", "dashboard-neutral", "dashboard-home"],
    },
    {
      fromPath: "/dashboard",
      fromReady: "dashboard-overview",
      toPath: "/dashboard/membership",
      toReady: "dashboard-subscription",
      linkLabel: /^Membership$/i,
      heading: /^Membership$/i,
      disallowedAfterReady: ["dashboard-group", "dashboard-neutral", "dashboard-home"],
    },
  ];

  await loginAsCreator(page, "/dashboard");

  for (const transition of transitions) {
    await gotoWithRetry(page, transition.fromPath);
    await expect(
      page.locator(`[data-route-shell-ready="${transition.fromReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });

    await startRefreshProbe(page);
    await clickDashboardNavigationLink(page, {
      href: transition.toPath,
      label: transition.linkLabel,
    });
    await expect(page).toHaveURL(
      new RegExp(`${transition.toPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`),
      {
        timeout: 30_000,
      },
    );
    await expect(
      page.locator(`[data-route-shell-ready="${transition.toReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("heading", { name: transition.heading }).first()).toBeVisible({
      timeout: 30_000,
    });
    await page.waitForTimeout(500);

    const samples = await stopRefreshProbe(page);
    const routeSamples = samples.filter((sample) =>
      new RegExp(
        `${transition.toPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`,
      ).test(sample.href),
    );

    expect(
      routeSamples.length,
      `${transition.fromPath} -> ${transition.toPath} did not capture route samples`,
    ).toBeGreaterThan(0);
    expectScopesNeverSeen(
      routeSamples,
      ["dashboard-group", "dashboard-neutral"],
      `${transition.fromPath} -> ${transition.toPath}`,
    );
    expectNoDisallowedScopesAfterRouteReady(
      routeSamples,
      transition.toReady,
      transition.disallowedAfterReady,
      `${transition.fromPath} -> ${transition.toPath}`,
    );

    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator sidebar transitions keep route-specific loading without creator neutral fallback flash", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  const transitions: Array<{
    fromPath: string;
    fromReady: string;
    toPath: string;
    toReady: string;
    linkLabel: RegExp;
    heading: RegExp;
  }> = [
    {
      fromPath: "/dashboard/creator",
      fromReady: "dashboard-creator-overview",
      toPath: "/dashboard/creator/resources",
      toReady: "dashboard-creator-resources",
      linkLabel: /^Resources$/i,
      heading: /^Creator resources$/i,
    },
    {
      fromPath: "/dashboard/creator",
      fromReady: "dashboard-creator-overview",
      toPath: "/dashboard/creator/sales",
      toReady: "dashboard-creator-sales",
      linkLabel: /^Earnings$/i,
      heading: /^Earnings$/i,
    },
  ];

  await loginAsCreator(page, "/dashboard/creator");

  // Warm creator child routes once so this test measures client-side handoff
  // behavior instead of first-compile latency in the dev server.
  for (const transition of transitions) {
    await gotoWithRetry(page, transition.toPath);
    await expect(
      page.locator(`[data-route-shell-ready="${transition.toReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });
  }

  for (const transition of transitions) {
    await gotoWithRetry(page, transition.fromPath);
    await expect(
      page.locator(`[data-route-shell-ready="${transition.fromReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });

    await startRefreshProbe(page);
    await clickDashboardNavigationLink(page, {
      href: transition.toPath,
      label: transition.linkLabel,
    });
    await expect(page).toHaveURL(
      new RegExp(`${transition.toPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`),
      {
        timeout: 30_000,
      },
    );
    await expect(
      page.locator(`[data-route-shell-ready="${transition.toReady}"]`).first(),
    ).toBeVisible({
      timeout: 30_000,
    });
    await expect(page.getByRole("heading", { name: transition.heading }).first()).toBeVisible({
      timeout: 30_000,
    });
    await page.waitForTimeout(500);

    const samples = await stopRefreshProbe(page);
    const routeSamples = samples.filter((sample) =>
      new RegExp(
        `${transition.toPath.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`,
      ).test(sample.href),
    );

    expect(
      routeSamples.length,
      `${transition.fromPath} -> ${transition.toPath} did not capture route samples`,
    ).toBeGreaterThan(0);
    expectScopesNeverSeen(
      routeSamples,
      ["dashboard-group", "dashboard-creator-neutral"],
      `${transition.fromPath} -> ${transition.toPath}`,
    );
    expectNoDisallowedScopesAfterRouteReady(
      routeSamples,
      transition.toReady,
      ["dashboard-group", "dashboard-creator-neutral", "dashboard-creator"],
      `${transition.fromPath} -> ${transition.toPath}`,
    );

    await expectNoDashboardGroupOverlay(page);
    await expectNoDashboardFullShellOverlap(page);
  }

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});

test("creator workspace storefront CTA reaches the public storefront", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);
  const storefrontLink = page.locator("main").getByRole("link", { name: /^Storefront$/i }).first();

  await loginAsCreator(page, "/dashboard/creator");

  await gotoWithRetry(page, "/dashboard/creator");
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-overview"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expect(storefrontLink).toBeVisible({ timeout: 20_000 });
  const storefrontHref = await storefrontLink.getAttribute("href");
  expect(storefrontHref).toMatch(/^\/creators\/[^/]+$/);
  const storefrontUrlPattern = new RegExp(
    `${storefrontHref!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?:\\?.*)?$`,
  );

  await startRefreshProbe(page);
  await storefrontLink.click();
  await expect(page).toHaveURL(storefrontUrlPattern, { timeout: 30_000 });
  await expect(page.getByRole("heading", { level: 1 }).first()).toBeVisible({
    timeout: 30_000,
  });
  await expect(page.getByRole("link", { name: /^Edit profile$/i }).first()).toBeVisible({
    timeout: 30_000,
  });
  await page.waitForTimeout(500);

  const samples = await stopRefreshProbe(page);
  const routeSamples = samples.filter((sample) => storefrontUrlPattern.test(sample.href));

  expect(
    routeSamples.length,
    "workspace -> storefront CTA did not capture route samples",
  ).toBeGreaterThan(0);

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
