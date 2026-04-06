# Post-Deploy Warm Workflow

## Summary

The post-deploy warm workflow warms critical public routes, then runs a k6-backed smoke perf suite against production and publishes artifacts plus a workflow-summary rollup.

## Current Truth

- The workflow auto-runs on production deployment success and can also be triggered manually with `workflow_dispatch`.
- `Warm Public Cache` waits for `/resources` to return success, then warms public routes and optional internal cache layers before perf verification starts.
- `Run Post-Deploy Performance Verification` executes `npm run perf:post-deploy`, which runs the smoke k6 suite and fails the job when any route exceeds its p95 budget or crosses a 1% failure rate.
- The generated `artifacts/perf-summary.json` now includes a rollup with overall status, pass/fail counts, the worst p95 route, and the route nearest its budget.
- The workflow summary now includes that rollup directly, so reviewers do not need to download artifacts first to see which route regressed.

## Why It Matters

This workflow is the repo-owned production perf truth source after deploy. It verifies that warm-cache assumptions still match real routes and that high-traffic public paths stay inside practical latency budgets.

## Key Files

- `.github/workflows/post-deploy-warm-cache.yml`
- `scripts/run-post-deploy-perf.ts`
- `artifacts/perf-summary.json`

## Flows

- resolve production deployment context
- wait for the production `/resources` route to go live
- warm public and optional internal cache layers
- run the smoke k6 suite against key public routes
- upload perf artifacts and append the perf rollup to the GitHub Actions step summary

## Invariants

- Warm targets and perf targets must stay aligned; otherwise the workflow can report cold-path regressions as if they were warmed-route failures.
- The smoke perf suite is a blocking gate: route budgets are not advisory.
- Artifact JSON and GitHub step summary should tell the same story about which route was worst and which routes failed.

## Known Risks

- LHCI and local lab runs are still useful only for regression detection, not as a substitute for the warmed production perf suite.
- Preview or protected deployment URLs can block perf verification unless the workflow resolves a public production host.
- k6 budgets that drift away from real route shape can cause either noisy failures or a false sense of safety.

## Related Pages

- [CI Browser Smoke](ci-browser-smoke.md)
- [Browser Verification](../testing/browser-verification.md)
- [Performance Observability](performance-observability.md)
- [Knowledge Layer Operations](knowledge-layer.md)

## Sources

- [Post-Deploy Warm Workflow Baseline](../../raw/operations/post-deploy-warm-workflow-baseline.md)
- [Canonical source: .github/workflows/post-deploy-warm-cache.yml](../../../.github/workflows/post-deploy-warm-cache.yml)
- [Canonical source: scripts/run-post-deploy-perf.ts](../../../scripts/run-post-deploy-perf.ts)

## Last Reviewed

- 2026-04-07
