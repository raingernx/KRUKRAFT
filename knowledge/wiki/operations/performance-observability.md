# Performance Observability

## Summary

Krukraft treats performance review as a layered workflow: block obvious regressions in CI first, then confirm warmed-route latency from the post-deploy perf suite, then read production telemetry and runtime logs for real-user drift.

## Current Truth

- Local lab checks use Lighthouse CI against `/resources` routes and now run twice per URL with blocking floor assertions for performance, total blocking time, and cumulative layout shift.
- Production deploy verification uses the post-deploy warm/perf workflow, which warms public routes, runs the smoke k6 suite, and writes `artifacts/perf-summary.json` plus a GitHub Actions summary rollup.
- Repo-owned browser probes now go beyond URL/heading checks: `resources-to-library` and `library-to-resources` record loading scopes and fail on blank-gap transitions, while `dark-theme-logo` delays dark-logo delivery and checks the dark fallback layer on first paint.
- Cross-group marketplace entry now has its own lightweight root overlay (`ResourcesEntryNavigationOverlay`) so `dashboard -> /resources` transitions can expose `resources-browse` coverage before the resources route layout mounts.
- Browser telemetry comes from production-only Vercel Analytics and Speed Insights in `src/app/layout.tsx`.
- Runtime investigation for slow or unstable server paths should use Vercel runtime logs after the warmed perf summary and browser smoke outputs have already narrowed the failing route.
- Workflow edits now have a repo-owned parser gate: `npm run workflow:check` parses all `.github/workflows/*.yml` files, and `npm run lint` includes that gate so broken YAML should fail before push.
- Browser Smoke CI now caches the Playwright browser bundle and installs Chromium only; WebKit fallback remains a local-debugging escape hatch instead of a cloud-runner dependency, which trims the slowest repeated setup step in GitHub Actions.

## Why It Matters

Performance problems in this repo can come from different layers: client JS, warmed-route latency, personalization after hydration, or unstable server/runtime paths. The workflow needs to separate those signals instead of treating every slowdown as the same class of bug.

## Key Files

- `.lighthouserc.json`
- `.github/workflows/post-deploy-warm-cache.yml`
- `scripts/check-workflow-syntax.mjs`
- `scripts/browser-probe-local.ts`
- `scripts/run-post-deploy-perf.ts`
- `src/app/layout.tsx`
- `artifacts/perf-summary.json`

## Flows

- run LHCI locally or in CI to catch obvious `/resources` regression floors before deploy
- run the repo-owned browser probe when navigation chrome or brand-theme logic changes; blank-gap shell coverage and dark-logo first paint should fail there before they become production regressions
- if a change touches `.github/workflows/`, let `workflow:check` parse those files before trusting the deploy/perf automation path
- after production deploy, read the post-deploy warm/perf summary first
- treat workflow result and workflow interpretation as separate steps: a green run is not "clean" until the relevant logs/artifacts have been checked for hidden flaky retries, threshold failures, or route-specific instability
- if the summary fails, use the worst-route and nearest-budget rollup fields to choose the next route to inspect
- if the warmed perf suite passes but users still report slowness, inspect Vercel Speed Insights for real-user regressions
- if real-user or browser flows still look unstable, inspect runtime logs for repeated slow requests, cold-path failures, or error spikes on the affected route

## Invariants

- The post-deploy warm/perf workflow is the first production perf truth source after deploy, not local Lighthouse alone.
- `Warm Public Cache` passing does not mean the workflow passed; close-out must use the perf-verification result, summary rollup, and relevant logs together.
- Repo-owned browser probes are expected to catch shell-coverage and theme-fallback regressions before deploy; they are not limited to happy-path page loads anymore.
- GitHub workflow YAML must parse locally before it is considered a valid performance/deploy change.
- Speed Insights is a real-user follow-up signal, not a replacement for route-level warmed verification.
- Runtime logs should be read after a route has already been narrowed down by browser smoke, perf summary, or Speed Insights; they are not the first debugging surface.
- Local LHCI thresholds should remain realistic blocking floors from the current repo baseline, not aspirational production budgets that fail on every run.

## Known Risks

- A passing LHCI run does not prove production latency is healthy on warmed routes.
- A passing warmed k6 suite does not prove every long-tail user cohort or browser/device class is healthy.
- A green warm/perf workflow can still be misread if the operator only looks at job status. Always verify whether the failing step was the warm phase itself, the perf-verification phase, or a workflow/harness issue.
- Manual operator traffic can perturb shared cache state during a post-deploy run, but if one extra hit can flip pass/fail then the real lesson is still route instability, not that the workflow was fundamentally wrong to fail.
- Speed Insights trends need enough production traffic to become meaningful; they are weaker right after a low-traffic deploy.

## Close-Out Guardrails

- Performance close-out should include:
  - `Verification:`
  - `Knowledge triage:`
  - `Residual risk:`
- If a warmed workflow fails, classify it before patching:
  - warm route failed
  - perf verification failed after warm
  - workflow/CI harness failed
- If the same perf failure class is likely to recur, update this page or `knowledge/log.md` before considering the issue learned.

## Related Pages

- [Browser Verification](../testing/browser-verification.md)
- [CI Browser Smoke](ci-browser-smoke.md)
- [Post-Deploy Warm Workflow](post-deploy-warm-workflow.md)
- [Resources Browse Route](../routes/resources-browse.md)
- [Search System](../systems/search.md)

## Sources

- [Canonical source: .lighthouserc.json](../../../.lighthouserc.json)
- [Canonical source: .github/workflows/post-deploy-warm-cache.yml](../../../.github/workflows/post-deploy-warm-cache.yml)
- [Canonical source: scripts/browser-probe-local.ts](../../../scripts/browser-probe-local.ts)
- [Canonical source: scripts/check-workflow-syntax.mjs](../../../scripts/check-workflow-syntax.mjs)
- [Canonical source: scripts/run-post-deploy-perf.ts](../../../scripts/run-post-deploy-perf.ts)
- [Canonical source: src/app/layout.tsx](../../../src/app/layout.tsx)
- [`krukraft-ai-contexts/03-tech-stack.md`](../../../krukraft-ai-contexts/03-tech-stack.md)
- [`krukraft-ai-contexts/08-performance-audit.md`](../../../krukraft-ai-contexts/08-performance-audit.md)

## Last Reviewed

- 2026-04-07
