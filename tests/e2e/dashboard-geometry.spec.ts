import { expect, test, type Locator, type Page } from "@playwright/test";

import { loginAsCreator } from "./helpers/auth";
import { collectRuntimeErrors } from "./helpers/browser";

test.describe.configure({ timeout: 180_000 });

const VISUAL_NORMALIZE_STYLE = `
  *, *::before, *::after {
    animation: none !important;
    transition: none !important;
    caret-color: transparent !important;
  }

  img,
  svg[aria-hidden="true"] {
    opacity: 0 !important;
  }

  p,
  span,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  button,
  label,
  li,
  dt,
  dd,
  th,
  td {
    color: transparent !important;
    text-shadow: none !important;
  }

  nextjs-portal {
    display: none !important;
  }
`;

async function normalizeVisualNoise(page: Page) {
  await page.locator("body").waitFor({ state: "attached", timeout: 30_000 });
  await page.evaluate((content) => {
    const existing = document.querySelector(
      'style[data-test-visual-normalize="true"]',
    );
    const style = existing ?? document.createElement("style");
    style.setAttribute("data-test-visual-normalize", "true");
    style.textContent = content;
    (document.head ?? document.documentElement).appendChild(style);
  }, VISUAL_NORMALIZE_STYLE);
}

async function expectNoDashboardOverlay(page: Page) {
  await expect(
    page.locator('[data-loading-scope="dashboard-group"]:visible'),
  ).toHaveCount(0, {
    timeout: 20_000,
  });
}

async function expectVisualSnapshot(locator: Locator, name: string) {
  const page = locator.page();
  await page.evaluate(() => {
    const active = document.activeElement;
    if (active instanceof HTMLElement) {
      active.blur();
    }
  });

  await expect(locator).toHaveScreenshot(name, {
    animations: "disabled",
    scale: "css",
  });
}

test("dashboard skeleton previews keep stable result geometry", async ({ page }) => {
  await page.goto("/dev/bones", { waitUntil: "domcontentloaded" });
  await expect(
    page.getByRole("heading", { name: /Shared skeleton fixtures/i }),
  ).toBeVisible({
    timeout: 30_000,
  });

  await normalizeVisualNoise(page);

  await expectVisualSnapshot(
    page.locator('[data-bones-preview="dashboard-subscription"]').first(),
    "dashboard-subscription-bones.png",
  );
  await expectVisualSnapshot(
    page.locator('[data-bones-preview="dashboard-library"]').first(),
    "dashboard-library-bones.png",
  );
  await expectVisualSnapshot(
    page.locator('[data-bones-preview="creator-dashboard-overview"]').first(),
    "creator-dashboard-overview-bones.png",
  );
});

test("dashboard routes keep stable result geometry after shell handoff", async ({
  page,
}) => {
  const { pageErrors, consoleErrors } = collectRuntimeErrors(page);

  await loginAsCreator(page, "/dashboard/membership");
  await normalizeVisualNoise(page);

  await expect(
    page.locator('[data-route-shell-ready="dashboard-subscription"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expectNoDashboardOverlay(page);
  await expectVisualSnapshot(
    page.locator('[data-route-shell-ready="dashboard-subscription"]').first(),
    "dashboard-subscription-final.png",
  );

  await page.goto("/dashboard/library", { waitUntil: "domcontentloaded" });
  await expect(
    page.locator('[data-route-shell-ready="dashboard-library"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expectNoDashboardOverlay(page);
  await expectVisualSnapshot(
    page.locator('[data-route-shell-ready="dashboard-library"]').first(),
    "dashboard-library-final.png",
  );

  await page.goto("/dashboard/creator", { waitUntil: "domcontentloaded" });
  await expect(
    page.locator('[data-route-shell-ready="dashboard-creator-overview"]').first(),
  ).toBeVisible({
    timeout: 30_000,
  });
  await expectNoDashboardOverlay(page);
  await expectVisualSnapshot(
    page.locator('[data-route-shell-ready="dashboard-creator-overview"]').first(),
    "creator-dashboard-overview-final.png",
  );

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
});
