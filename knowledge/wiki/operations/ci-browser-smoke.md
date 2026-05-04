# CI Browser Smoke

## Summary

GitHub Actions `Browser Smoke` is the cloud verification workflow for marketplace, dashboard, admin, and management browser flows.

## Current Truth

- The workflow provisions Postgres, enables `pg_trgm`, seeds the app, runs lint and typecheck, then executes browser smoke.
- Additional probe jobs cover dashboard, public/admin pages, and management pages.
- The management/browser-probe lane now also covers hard-refresh shell checks across the main dashboard, creator, and admin entry routes, so repeated-refresh fallback regressions are part of CI instead of relying only on manual reproduction.
- Recent stabilization work removed flaky auth navigation, invalid admin audit table markup, and detail-shell readiness issues from the main smoke path.
- Recent route-transition flakes also showed that Browser Smoke can be `success` but still not clean if the log contains `flaky` or `retry #` markers; close-out now requires log review, not workflow status alone.
- The workflow now intentionally keeps expected CI-only fallback noise quieter: missing R2 env warnings, dev-only missing user-preference warnings, and non-critical `/resources` timeout fallback logs should not flood a green Browser Smoke run anymore.
- Shared job setup is now repo-owned too: `.github/actions/setup-browser-ci/action.yml` covers Node setup, dependency install, Playwright Chromium provisioning, and CI DB prep for both Browser Smoke and Management Browser Probes so setup drift is not fixed in one job and forgotten in the other.
- Workflow concurrency is now branch-aware: PRs and non-`main` refs still cancel superseded runs, but `main` no longer auto-cancels prior Browser Smoke runs, which keeps release-history auditing cleaner during CI-fix sequences.

## Why It Matters

This workflow is the main browser truth source when local browser environments are noisy or unreliable.

## Key Files

- `.github/workflows/browser-smoke.yml`
- `.github/actions/setup-browser-ci/action.yml`
- `scripts/run-playwright-stable.mjs`
- `scripts/browser-probe-local.ts`
- `tests/e2e/*`

## Flows

- install dependencies and Playwright browsers
- prepare DB and seed fixtures
- run `smoke:browser:ci`
- run dashboard/page/management probes
- upload artifacts and logs

## Invariants

- CI browser smoke should remain independent of local machine browser quirks.
- `curl: (7)` inside probe startup loops is not itself a failure if the readiness loop later succeeds and the page probes pass.
- CI failures should be interpreted from the final failing assertion or probe, not from startup-noise lines.
- A green Browser Smoke run is only clean after log review confirms there were no hidden flaky retries.
- When a browser-smoke failure turns out to be a probe/test assertion problem rather than a product regression, record that failure class explicitly instead of silently treating the suite as flaky by nature.
- If a green run starts printing repeated storage-fallback, missing-preference, or non-critical discover/detail timeout warnings again, treat that as CI hygiene drift and fix the log owner instead of normalizing the noise.

## Known Risks

- A single green run is useful but not the same as long-horizon flake elimination.
- Storage fidelity is lower in CI when using local fallback instead of real R2.
- Route-transition coverage is especially vulnerable to brittle assertions that over-trust sampled loading scopes or transient probe frames; prefer path/contract assertions plus no-gap checks over implementation-detail timing when possible.

## Related Pages

- [Browser Verification](../testing/browser-verification.md)
- [Post-Deploy Warm Workflow](post-deploy-warm-workflow.md)
- [Search](../systems/search.md)
- [Storage And Downloads](../systems/storage-downloads.md)

## Sources

- [Browser Smoke Workflow Baseline](../../raw/operations/browser-smoke-workflow-baseline.md)
- [`krukraft-ai-contexts/03-tech-stack.md`](../../../krukraft-ai-contexts/03-tech-stack.md)
- [`.github/workflows/browser-smoke.yml`](../../../.github/workflows/browser-smoke.yml)

## Last Reviewed

- 2026-05-04
