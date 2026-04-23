# Krukraft — Active Phase Tracker

Use this file as the single source of truth for active implementation state.

 ## Plan Snapshot

Parent Plan: `Marketplace search shell audit`

> [!info] Current Phase
> `Plan complete`

> [!success] Completed
> The previous DS-first migration baseline is complete and now acts as the frozen implementation starting point
> The reference-driven DS alignment plan using Primer + Atlassian + Radix Themes is complete and now acts as the foundation-contract baseline
> The DS visual foundation pass is complete and now acts as the frozen visual baseline for route work
> The discover `/resources` visual pilot is complete and now acts as the latest public-route baseline
> Dashboard-v2 stabilization remains frozen
> Public marketplace perf baseline remains intact

> [!warning] Active
> Marketplace listing and reused public navbar search shells passed runtime proof against the approved baseline

> [!todo] Next Up
> The current optional plan is complete. Wait for an explicit new plan or reprioritization before broadening marketplace rollout work.

> [!abstract] Partial
> The previous theme refresh, first proof-route audit, and legacy DS cleanup are complete. This new optional plan checks whether admin/settings-heavy routes still fit the approved baseline in runtime.

## Status Board

| Track            | Status   | Note                                                                                     |
| ---------------- | -------- | ---------------------------------------------------------------------------------------- |
| Reference Audit  | Kept     | Primer, Atlassian, and Radix Themes stay as the locked reference stack for the new visual pass |
| DS Baseline      | Frozen   | the previous DS-first migration baseline is complete and should be reused, not repeated |
| Foundation Align | Kept     | the completed reference-driven plan already locked token/component/chrome boundaries |
| Visual Foundation | Frozen   | completed visual baseline stays in force; do not reopen primitive work implicitly |
| Discover         | Frozen   | `/resources` listing-mode shell + fail-soft states landed and passed close-out audit    |
| Theme Refresh    | Complete | brief, playbook, Figma review page, approved surface baseline, cleanup slice, and first runtime slices all passed close-out audit |
| Route Rollout Audit | Complete | the first proof route (`dashboard navigation + library`) passed runtime verification and the optional rollout audit closed cleanly |
| Legacy DS Cleanup | Complete | `secondary -> quiet`, outline inventory, and search-shell decision closed cleanly |
| Admin / Settings Rollout Audit | Complete | `/dashboard/settings`, `/admin/users`, `/admin/settings`, and `admin/resources` passed runtime proof |
| Marketplace Search Shell Audit | Complete | `/resources`, resource detail, category, and support shells passed; preview shells remain intentional dev-only exceptions |
| Dashboard-v2     | Frozen   | stable enough to pause; continue only after another explicit reprioritization change     |
| Public perf base | Kept     | existing `/resources` perf and streaming baseline stays in force during DS migration work |

## Progress

Marketplace search shell audit
`[██████████] 100%`

```mermaid
flowchart TB
  subgraph Frozen
    D1[DS baseline + reference alignment<br/>Frozen]
    D2[DS visual foundation baseline<br/>Frozen]
  end

  subgraph Baseline
    T0[Theme refresh plan<br/>Complete]
  end

  subgraph Previous
    R1[Route inventory and rollout order<br/>Done]
    R2[First route proof audit<br/>Done]
    R3[Dashboard avatar menu remediation<br/>Done]
    R4[Route rollout decision<br/>Done]
  end

  subgraph Previous2
    L1[Legacy DS inventory<br/>Done]
    L2[Secondary to quiet normalization<br/>Done]
    L3[Outline inventory<br/>Done]
    L4[Search shell review<br/>Done]
    L5[Cleanup decision<br/>Done]
  end

  subgraph Previous3
    A1[Admin/settings route inventory<br/>Done]
    A2[First proof-route audit<br/>Done]
    A3[Rollout decision<br/>Done]
  end

  subgraph Current
    M1[Marketplace route inventory<br/>Done]
    M2[First proof-route audit<br/>Done]
    M3[Rollout decision<br/>Done]
  end

  D1 --> D2 --> T0 --> R1 --> R2 --> R3 --> R4 --> L1 --> L2 --> L3 --> L4 --> L5 --> A1 --> A2 --> A3 --> M1 --> M2 --> M3
```

## Daily Workflow

Before starting:
- Read `Current Phase`
- If `Next Up` has a mandatory item, pick exactly one and move it to `In Progress`
- If `Next Up` says the current parent plan is complete, stop and wait for an explicit new plan or reprioritization

Before closing:
- Update `In Progress`
- Update `Next Up`
- Update the progress percentage to match the real phase / plan status
- Fill `Session Close-Out Template`

Rules:
- Keep exactly one `Current Phase`
- Keep `Next Up` to at most 3 items
- Move anything not being worked right now into `Deferred`
- If a phase status changes, update this file in the same session
- If the parent plan status changes, update `Plan Snapshot`, `Current Status Inside Parent Plan`, and `Phase Map` in the same session
- Do not mark work complete in chat until the relevant phase/plan state here is updated
- If this file has an active parent plan, do not recommend or start `Deferred` work as the next step unless the user explicitly changes priorities
- When suggesting follow-up work, state whether it is `in-plan` or `out-of-plan` before recommending it
- If the user says `Next Up`, answer from the active plan's `Next Up` block first and keep the recommendation inside the active plan unless the user explicitly asks to reprioritize
- If a phase or parent plan is actually complete, update the percentage, phase status, and `Next Up` state to show that it is complete instead of fabricating more required work
- After a parent plan is complete, move any extra ideas into `Deferred` or clearly optional follow-up notes; do not keep the same plan artificially active

---

## Current Phase

### Name
Plan complete

### Parent Plan
Marketplace search shell audit

### Current Status Inside Parent Plan
- The previous `Krukraft theme refresh plan`, `Theme route-level rollout audit`, `Legacy DS usage cleanup`, and `Admin / Settings rollout audit` are complete and act as frozen inputs
- This new plan must not reopen DS foundations, token naming, or Figma decisions; it only proves marketplace search shells against the approved baseline
- Approved baseline carried into this plan:
  - neutral posture: `Paper B`
  - primary accent: `#4338CA`
  - support accents: `Rust` and `Sand`
  - surface baseline: `inset-led shell + quiet border + radius 8`
- Runtime slices already landed before this route audit opened:
  - `Button family`
  - `Input / Search family`
- Known marketplace search pressure entering this plan:
  - `HeroSearch variant="listing"` still carries its own shell/adornment recipe on `/resources`
  - `MarketplaceNavbarSearch` lazy-loads the same listing variant across secondary public routes and resource detail shells
  - `HeroSearchPreviews` and dev bones still show older popover/posture patterns, but they are preview surfaces rather than user-facing runtime routes
- Route inventory result:
  - `primary marketplace listing shell`
    - `/resources` listing mode via `HeroSearch variant="listing"`
    - exercises the canonical public listing search shell, catalogue intent, and active query posture
  - `reused public navbar shell`
    - `/resources/[slug]`
    - `/categories/[slug]`
    - `/creators/[slug]`
    - `/membership`
    - `/support`
    - `/resources/not-found`
    - exercises the same listing variant when mounted inside secondary public shells
  - `preview / dev-only shell`
    - `src/components/marketplace/HeroSearchPreviews.tsx`
    - `/app/dev/bones`
    - preview-only evidence for quick browse / results / empty popovers; not a required runtime proof route
- Chosen proof-route order:
  1. `/resources` listing + `/resources/[slug]`
  2. one secondary public-shell cluster using `MarketplaceNavbarSearch`
  3. rollout decision on whether previews stay intentional compatibility or need a follow-up plan
- Why this order:
  - `/resources` listing is the highest-signal route because it mounts `HeroSearch variant="listing"` directly in the main marketplace shell
  - `/resources/[slug]` proves the same search shell survives reuse in a quieter public route without discover/listing noise
  - secondary public routes stay behind them because they reuse the same navbar search but add less search-specific signal
- First proof-route result:
  - `/resources?search=worksheet` passed direct browser proof for the listing shell, combobox search input, and overall marketplace listing posture
  - `/resources/middle-school-science-quiz-assessment-set` passed direct browser proof for the reused navbar search shell on resource detail
  - no console or page errors were reproduced during either proof
- Secondary public-shell result:
  - `/categories/science` passed warmed direct browser proof for the reused navbar search shell
  - `/support` passed warmed direct browser proof for the reused navbar search shell
  - first failures in this cluster came from timeout / strict-locator issues in the probe, not reproduced runtime shell drift
- Rollout decision:
  - runtime marketplace routes that reuse `MarketplaceNavbarSearch` stayed within the approved baseline
  - `HeroSearchPreviews` remains a dev-only preview surface and is treated as intentional compatibility, not required remediation for this plan
  - no narrow remediation slice is required to close this optional plan

### Goal
Confirm whether marketplace search shells fit the approved DS baseline without reopening foundations.

### Why this is the current phase
- The DS baseline was stable enough to audit the one intentional search-shell exception left after legacy cleanup
- Marketplace search was the last public shell family still carrying route-owned chrome beyond the shared `SearchInput` recipe
- Listing, detail, category, and support proofs passed, so the optional plan can close without remediation

### Definition of Done
- [x] A separate optional follow-up plan is opened after the completed admin/settings rollout audit
- [x] The approved theme baseline is carried forward as a frozen input instead of being reopened
- [x] Marketplace search routes are inventoried and grouped into a proof-route order
- [x] The first proof-route cluster (`/resources` listing + resource detail shell) is verified against the approved baseline
- [x] Remaining marketplace search reuse is categorized as required remediation vs. intentional compatibility
- [x] `09-todos.md` reflects the real phase and progress percentage for this route-audit plan

### Phase Map

| Phase | Name | Status | Notes |
| --- | --- | --- | --- |
| 0 | Route inventory and proof order | done | proof order is now `/resources` listing + detail, then one secondary public-shell cluster, then rollout decision |
| 1 | First proof-route audit | done | `/resources` listing, resource detail, category, and support shells passed direct browser proof |
| 2 | Rollout decision | done | preview shells stay as intentional dev-only compatibility; no remediation slice opened |

---

## Current Goal

The optional marketplace search-shell audit is complete; no required in-plan work remains.

Current recommendation order:
1. Keep `src/design-system/theme-playbook.md` and the Figma review page as the locked approval baseline
2. Treat `Paper B` + `#4338CA` + `Rust`/`Sand` and `inset-led shell + quiet border + radius 8` as fixed inputs
3. Treat `/resources`, resource detail, category, and support as passed marketplace search-shell proofs
4. Treat `HeroSearchPreviews` as an intentional preview/dev exception unless a future marketplace-specific plan reprioritizes it
5. Open a separate optional plan before broadening rollout or changing marketplace search behavior again

---

## In Progress

- [x] Open a separate optional follow-up plan for marketplace search shell audit
- [x] Carry forward the completed theme/route rollout baseline as a frozen input
- [x] Inventory marketplace search routes and reused navbar-shell surfaces
- [x] Pick the first proof-route cluster and define the rollout order
- [x] Audit `/resources` listing mode
- [x] Audit resource detail navbar search shell
- [x] Audit one secondary public-shell cluster that reuses `MarketplaceNavbarSearch`
- [x] Decide whether preview shells stay as intentional compatibility or need a follow-up plan

---

## Next Up

- [ ] Current parent plan is complete; wait for an explicit new plan or reprioritization before broadening marketplace rollout work

---

## Blocked / Waiting

- [ ] None right now

Use this section only for real blockers:
- missing env / credentials
- failing CI unrelated to the current task
- unclear product decision
- waiting on design / business confirmation

---

## Deferred

### Discover / Browse
- [ ] Audit discover/search/filter/creator-profile fallbacks for usable-but-consistent loading states after the DS migration direction is stable

### Dashboard / Perf
- [ ] Revisit route-level perf passes beyond the current rollback baseline only one route at a time
- [ ] Recheck whether `membership`, `settings`, `creator/profile`, or the public creator storefront need additional runtime perf work after visual/runtime feel review
- [ ] Re-open earnings perf only if runtime feel proves it is still a hotspot after rollback baseline

### Public Route / Loading Follow-ups
- [ ] Finish route-family fallback cleanup on public routes so hard refreshes on `/resources` and similar pages stay inside family-specific or neutral shells
- [ ] Verify dashboard/admin hard refreshes no longer show the global app-root fallback before their family loading shells under repeated refresh stress

### Brand / Platform
- [ ] Re-run perf measurements after major listing/detail/search changes and update thresholds intentionally
- [ ] Recheck preview/production LCP after major marketplace image or layout changes
- [ ] Verify favicon and OG logo propagation through `/brand-assets/*` in production browsers and crawlers
- [ ] Recheck that the trimmed first-party brand asset set still covers every metadata/favicon surface

### Ops / Config
- [ ] Replace `XENDIT_SECRET_KEY` test key in production environment
- [ ] Verify `DIRECT_URL` is present and correct for Prisma CLI / migration workflows in production
- [ ] Keep post-deploy warm targets aligned with perf smoke and browser verification coverage

---

## Verification Baseline

Run these before claiming the active reference-audit or DS alignment slice is complete:

- `npm run storybook:smoke` when the plan touches DS primitives, DS components, or their stories
- `npm run typecheck`
- `npm run lint`
- `npm run tokens:audit` when token docs, token files, or token contracts change
- `npm run context:check` when the tracker, DS ownership wording, or agent context changes materially

---

## Current Baseline Notes

### Dashboard
- `/dashboard/*` is now the canonical dashboard family.
- `(dashboard-lite)` stays retired.
- Active runtime perf baseline keeps the original frozen core at:
  - nav prefetch uplift
  - creator/resources timing cleanup
- plus one new deliberate learner-account follow-up:
- `/dashboard/settings` now streams its sections behind an in-page `Suspense` boundary again instead of awaiting the full combined payload before first in-page HTML
- `/dashboard/settings` now renders a real interactive settings surface inside that streamed shell, and the canonical settings route/API no longer accept a page-level language preference
- `/dashboard/membership` now renders its intro shell before the membership payload resolves and streams the summary cards plus plan-status panel behind a route-matched in-page fallback instead of awaiting the full account payload before any in-page content

### Verification
- Warm local `creator-workspace.spec.ts` passed `8/8` after rollback cleanup and short flake stabilization.
- Treat that suite as the main dashboard regression gate unless a task clearly needs a narrower surface.
- Runtime feel recheck on 2026-04-14 still confirms the dashboard family suite passes, and the public follow-up that remained after that pass is now green too:
  - `tests/e2e/navigation-shells.spec.ts` passes for `/resources` ↔ `/dashboard/library`
  - `tests/e2e/navigation-sentinels.spec.ts` passes for the public account dropdown contract
- Public account-menu parity pass now mirrors the dashboard IA/UI on the marketplace header, including the redesigned `Membership` entry and creator links, and the follow-up stabilization work closed the remaining public `/resources` auth-viewer and library cold-entry proof failures on the active baseline.
- The `/dashboard/settings` pass is now also green against:
  - `tests/e2e/settings-theme.spec.ts`
  - `tests/e2e/navigation-sentinels.spec.ts` (`dashboard avatar menu reaches home membership and settings`)
  - `tests/e2e/creator-workspace.spec.ts` (`dashboard account surfaces clear the dashboard overlay after shell readiness`)
- The `/dashboard/membership` pass is green against:
  - `tests/e2e/dashboard-membership.spec.ts`
  - `tests/e2e/creator-workspace.spec.ts` (`dashboard account surfaces clear the dashboard overlay after shell readiness`)
  - `tests/e2e/navigation-shells.spec.ts`
- One-pass local reruns still surfaced the older public sentinel and creator cold-entry flake classes during this work session, but those failures happened outside the membership route contract itself

### Git / Repo Hygiene
- Local design-tool repos under `.design-tools/*` are intentionally not tracked by the main repo.

---

## Decision Log

Add only short, high-signal entries here.

- 2026-04-17: Lock `Paper B` as the neutral direction, `#4338CA` as the primary accent, and `Rust` + `Sand` as the support accents for the Krukraft theme refresh plan; the next mandatory decision is the first narrow implementation slice.
- 2026-04-14: Keep dashboard perf baseline frozen after rollback; do not re-open broad streaming refactors.
- 2026-04-14: Remove `.design-tools/awesome-design-md` and `.design-tools/shadcn-examples` from repo tracking; keep them local-only.
- 2026-04-14: Runtime feel recheck shows the canonical dashboard route family is stable; next follow-up should target public↔dashboard library handoff/account-menu parity before reopening another perf pass.
- 2026-04-14: Public navbar account menu now follows the dashboard account-menu contract for IA/UI, but the next active follow-up remains public↔dashboard library handoff stabilization because `navigation-shells` still catches a blank-gap transition sample at that boundary.
- 2026-04-14: The authenticated account dropdown is now a shared public+dashboard component; keep sentinel coverage green when changing trigger shape, featured membership item, or account/creator menu sections.
- 2026-04-15: Marketplace navbar skeleton ownership and dashboard topbar skeleton geometry were both tightened after the shared dropdown refresh; the next public-nav follow-up is proof cleanliness, not another structural menu rewrite.
- 2026-04-15: The latest public navbar hydration warning sample points to a recoverable SSR/client mismatch around the auth-viewer boundary in dev, but it is not currently an active repro; treat the remaining public dropdown navigation timeout as the main open proof issue.
- 2026-04-15: `navigation-sentinels` is green again after tightening the public account-dropdown sentinel helper to use the real dropdown activation contract instead of an over-forced click path.
- 2026-04-16: Active plan changed from discover-first to DS-first; keep discover deferred and dashboard frozen until the first design-system migration pass is chosen deliberately.
- 2026-04-17: Active plan changed from the completed DS-first baseline to reference-driven DS alignment using Primer for token taxonomy, Atlassian for product-system rigor, and Radix Themes for implementation-level theming and primitive guidance.
- 2026-04-17: DS-first baseline is complete; the new active plan is reference-driven DS alignment using Primer for token taxonomy, Atlassian for product-system rigor, and Radix Themes for implementation-level theming/primitive guidance.
- 2026-04-17: The discover `/resources` listing-mode pilot passed close-out audit with request-level runtime proof and aligned fail-soft/loading shells; do not extend discover further inside the same parent plan.
- 2026-04-17: Active plan changed from the completed discover visual pilot to `Krukraft theme refresh plan`; start by locking theme direction and scope before any new implementation slice.
- 2026-04-17: The Krukraft theme direction brief is now locked from the completed DS/discover baseline; the next mandatory step is choosing one narrow implementation slice, not reopening direction work.
- 2026-04-17: The attempted `shared surface + neutral palette calibration` slice was rolled back because palette values were chosen too early; theme training and user-approved color posture now come before any new runtime theme slice.
- 2026-04-17: `src/design-system/theme-playbook.md` is now the canonical theme-training artifact; palette posture must be trained and approved there before any new runtime color slice is landed.
- 2026-04-17: the `Theme Lab` page inside the live Figma file `Krukraft Design System` is now the visual review surface for theme training; it may use temporary candidate colors for discussion, but it must not be treated as shipped DS theme output.
- 2026-04-17: the temporary `/dev/theme-playbook` route was removed after moving theme training into Figma so palette review is no longer tied to the Krukraft app shell.
- 2026-04-18: legacy `/dashboard-v2*` URLs were fully retired; canonical protected dashboard routes now live only under `/dashboard/*`, and old bookmarks/links should be updated because the legacy paths now return `404`.
- 2026-04-19: the remaining repo-owned `dashboard-v2` component filenames were retired too; canonical auth callbacks, admin fallback redirects, Stripe membership success returns, and dashboard skeleton/page-shell imports now point only at `/dashboard/*` plus `src/components/layout/dashboard/*`.
- 2026-04-18: public `/resources` shell stabilization is green again on the active baseline: `tests/e2e/resources.smoke.spec.ts` and `tests/e2e/navigation-shells.spec.ts` now pass together against canonical dashboard destinations after the shared account-menu/auth-helper cleanup; creator profile media upload proof remains a separate creator-surface follow-up, not part of the public-shell batch.
- 2026-04-19: admin routes and shared admin controls now normalize on the repo-owned `@/lib/icons` adapter too; direct `lucide-react` imports were retired from the active admin route/component surface.
- 2026-04-19: auth recovery routes, creator/settings account surfaces, and shared resources fallback shells now normalize on the same `@/lib/icons` adapter too; those account-facing feature files no longer import `lucide-react` directly.
- 2026-04-19: the repo-owned ops baseline now includes first-pass Sentry wiring
  (`instrumentation*.ts`, `sentry.*.config.ts`, `withSentryConfig(...)`,
  `.env.example` keys), plus canonical docs for plugin rollout and Supabase DB
  incident workflow under `docs/agent-plugin-workflows.md`,
  `docs/supabase-db-workflow.md`, and `docs/supabase-incident-playbook.md`.
- 2026-04-17: the `Theme Lab` page now includes a blank component sandbox so component studies can happen before palette, spacing, and radius decisions are committed into the DS.
- 2026-04-17: the neutral posture decision is now locked to `Paper B`; after approving `Rust` and `Sand` as support accents, the next mandatory decision is the first narrow implementation slice.
- 2026-04-23: the first cleanup slice landed in repo code; shared DS import surfaces were tightened, `ResourceCard` ownership/export boundaries were clarified, `Button` gained a canonical `primary | quiet | ghost` tone set for new work, `Input` and `SearchInput` now share a base field recipe direction, and `Dropdown` shell posture was normalized toward the approved surface baseline.

---

## Session Close-Out Template

Copy/update this at the end of a non-trivial task:

- Phase status:
  - `open` / `closed` / `deferred`
- Parent plan status changed?
  - `yes` / `no`
- What changed:
  - ...
- Verification run:
  - ...
- Next recommended task:
  - ...
- Knowledge triage:
  - `no ingest` / `log only` / `update existing wiki` / `new wiki entry`

Close-out rule:
- If `Phase status` changed, update `Plan Snapshot` and `Phase Map` before ending the session
- If the parent plan moved to a new stage or closed, update `Current Phase`, `Current Status Inside Parent Plan`, and `Next Up` before ending the session

### Phase Change Checklist

- [ ] Update `Phase status`
- [ ] Update `Plan Snapshot`
- [ ] Update `Phase Map`
- [ ] Update `Current Status Inside Parent Plan`
- [ ] Update `In Progress`
- [ ] Update `Next Up`
- [ ] Record verification actually run
- [ ] Record the next recommended task before closing the session

---

## Reference Pointers

Use these for deeper context instead of expanding this file again:
- Architecture / route-family behavior: [04-architecture.md](/Users/shanerinen/Projects/krukraft/krukraft-ai-contexts/04-architecture.md)
- Performance notes / rollback baseline: [08-performance-audit.md](/Users/shanerinen/Projects/krukraft/krukraft-ai-contexts/08-performance-audit.md)
- Design-system ownership: [06-design-system.md](/Users/shanerinen/Projects/krukraft/krukraft-ai-contexts/06-design-system.md)
- Layout / UX conventions: [07-layout-ux.md](/Users/shanerinen/Projects/krukraft/krukraft-ai-contexts/07-layout-ux.md)
