# Krukraft — Current TODOs and Audit Scope

## Current Priority TODOs

- [ ] Replace `XENDIT_SECRET_KEY` test key in production environment
- [ ] Verify `DIRECT_URL` is present and correct for Prisma CLI / migration workflows in production
- [ ] Keep tuning ranked-search query plans and decide whether Postgres-backed relevance is still sufficient before introducing a separate search engine
- [ ] Keep post-deploy warm targets aligned with perf smoke and browser verification coverage
- [ ] Re-run perf measurements after major listing/detail/search changes and update thresholds intentionally
- [ ] Continue refining detail-page CTA/trust/review timing if new regressions appear
- [ ] Recheck preview/production LCP after major marketplace image or layout changes; local dev reruns on 2026-04-02 stopped reproducing the old Next `loading="eager"` advice, but dev-mode LHCI is still not production truth
- [ ] Verify uploaded favicon and OG logo changes propagate correctly through `/brand-assets/*` in production browsers and social crawlers
- [ ] Recheck that the trimmed repo-owned fallback asset set (`public/brand/*` without legacy `public/logo/*`) still covers every favicon / metadata surface that should remain first-party
- [ ] Recheck production refresh behavior after the latest navbar fallback-height and logo-flicker fixes to confirm the remaining brand chrome feels visually stable on cold loads
- [ ] Finish route-family fallback cleanup on public routes so hard refreshes on `/resources` and other public pages stay inside family-specific or neutral shells without route-agnostic navbar/page chrome reading as another page
- [ ] Keep the local verification stack aligned: request smoke for auth/redirect checks, `chrome-devtools-mcp` for authenticated browser probing, and Playwright for canonical CI/regression coverage
- [ ] Keep the dashboard-v2 runtime perf baseline frozen at `Phase 3A nav prefetch uplift + Phase 3B creator/resources timing cleanup` until the next route-level perf pass is chosen deliberately and reintroduced one route at a time with matching proof

## Product / UX Follow-Ups

- [ ] Keep discover fallbacks aligned with final section intent; avoid misleading placeholder destinations
- [ ] Audit live search, filter/sidebar fallbacks, and creator-profile fallbacks for usable-but-consistent loading states
- [ ] Verify dashboard/admin hard refreshes no longer show the global app-root fallback before their family loading shells under repeated refresh stress
- [ ] Pilot `boneyard-js` on one high-value flow before considering wider skeleton replacement; keep route-level loading/error/empty-state contracts explicit even if DOM-captured bones are adopted
- [ ] Keep Playwright search smoke aligned with real canonical submit flows as marketplace search UX evolves
- [ ] Re-audit brand asset previews if legacy stored values from earlier fallback behavior still exist in the database

## Dashboard V2 Cutover Readiness (2026-04-12)

### Route parity audit

| Legacy route | Canonical route | Status | Notes |
| --- | --- | --- | --- |
| `/dashboard` | `/dashboard-v2` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/library` | `/dashboard-v2/library` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/downloads` | `/dashboard-v2/downloads` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/purchases` | `/dashboard-v2/purchases` | removed | hard cut: no proxy compatibility redirect |
| `/settings` | `/dashboard-v2/settings` | removed | hard cut: no proxy compatibility redirect |
| `/subscription` | `/dashboard-v2/membership` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator` | `/dashboard-v2/creator` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/resources` | `/dashboard-v2/creator/resources` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/resources/new` | `/dashboard-v2/creator/resources/new` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/resources/[id]` | `/dashboard-v2/creator/resources/[id]` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/analytics` | `/dashboard-v2/creator/analytics` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/sales` | `/dashboard-v2/creator/sales` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/profile` | `/dashboard-v2/creator/profile` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/settings` | `/dashboard-v2/creator/settings` | removed | hard cut: no proxy compatibility redirect |
| `/dashboard/creator/apply` | `/dashboard-v2/creator/apply` | removed | hard cut: dashboard-v2 parity route owns the live creator onboarding flow |

### Remaining cutover blockers

- [x] Retired compatibility-only not-found/error route files in `(dashboard)` and `(dashboard-lite)` after those old families stopped owning live route UI
- [x] Rechecked post-checkout and purchase-recovery links on 2026-04-13; `PendingPurchasePoller`, `LastPurchaseRecovery`, checkout success CTAs, and dashboard-v2 membership CTAs target `routes.dashboardV2Library`, `routes.dashboardV2LibraryPaymentSuccess()`, or `routes.dashboardV2Purchases`, not `/dashboard/library`
- [x] Hard cut chosen on 2026-04-13 because the site has no real users yet: old dashboard URL/bookmark support was removed instead of kept through a longer compatibility window.

### Legacy path disposition

#### Remove now

- redirect-only compatibility page files that duplicated proxy-owned canonical redirects:
  - `(dashboard-lite)/dashboard/page.tsx`
  - `(dashboard-lite)/dashboard/library/page.tsx`
  - `(dashboard-lite)/dashboard/downloads/page.tsx`
  - `(dashboard-lite)/dashboard/purchases/page.tsx`
  - `(dashboard-lite)/settings/page.tsx`
  - `(dashboard-lite)/subscription/page.tsx`
  - `(dashboard-lite)/purchases/page.tsx`
  - `(dashboard)/dashboard/creator/apply/page.tsx`
  - `(dashboard)/dashboard/creator/settings/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/profile/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/sales/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/analytics/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/resources/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/resources/new/page.tsx`
  - `(dashboard)/dashboard/creator/(protected)/resources/[id]/page.tsx`

#### Removed in hard cut

- old URL/bookmark compatibility paths that no longer redirect through proxy:
  - `/dashboard`
  - `/dashboard/library`
  - `/dashboard/downloads`
  - `/dashboard/purchases`
  - `/settings`
  - `/subscription`
  - `/dashboard/creator`
  - `/dashboard/creator/apply`
  - `/dashboard/creator/resources`
  - `/dashboard/creator/resources/new`
  - `/dashboard/creator/resources/[id]`
  - `/dashboard/creator/analytics`
  - `/dashboard/creator/sales`
  - `/dashboard/creator/profile`
  - `/dashboard/creator/settings`
  - `/dashboard/resources`

Runtime note (2026-04-13):
- previous local proxy smoke passed before the hard cut, proving canonical dashboard-v2 parity existed before removing old URL handoff
- app/tests/scripts no longer target these paths directly; after the hard cut, they are intentionally unsupported legacy URLs instead of active navigation or bookmark-redirect destinations
- `/dashboard/resources` was removed with the rest of the compatibility set; creator apply/resources handoff must use canonical dashboard-v2 routes directly

### Navigation handoff plan before freezing the old shell

1. Keep `dashboard-v2` as the only canonical destination in shared nav, auth callbacks, post-purchase CTAs, and dashboard overlays.
2. Keep learner/creator shells removed from active navigation; they no longer act as redirect-only public compatibility entrypoints after the hard cut.
3. Keep cleanup/removal as a separate pass for dead shell helpers that are not tied to external URL support.
4. After the old shell no longer owns unique UI, remove leftover internal references to legacy dashboard routes instead of preserving bookmark redirects.

### Cleanup / removal plan (separate from compatibility freeze)

1. Retire old route-family loading shells and skeleton helpers that no longer represent live UI.
2. Remove compatibility-only not-found/error surfaces after confirming they no longer represent a supported entry path.
3. Delete old `(dashboard)` / `(dashboard-lite)` shell chrome when no live route still imports those wrappers.

### Cleanup progress

- [x] Deleted dead compatibility-only shell helpers:
  - `src/app/(dashboard-lite)/DashboardSessionLayoutContent.tsx`
  - `src/app/(dashboard)/DashboardGroupLayoutContent.tsx`
  - `src/app/(dashboard)/dashboard/creator/(protected)/CreatorProtectedLayoutContent.tsx`
- [x] Moved legacy learner/creator route aliases out of `src/lib/routes.ts` during the compatibility freeze, then removed the temporary compatibility helper during the hard cut so canonical `dashboard-v2` routes are the only first-class dashboard destinations in the route map
- [x] Updated overlay/state/footer normalization to stop importing a legacy alias map from the canonical route registry; after the hard cut, those surfaces only recognize canonical dashboard-v2/admin routing
- [x] Deleted compatibility-only top-level `loading.tsx` files under `src/app/(dashboard-lite)` and `src/app/(dashboard)` because those old route families no longer own visible loading UI before redirecting into `dashboard-v2`
- [x] Deleted compatibility-only dashboard `error.tsx` / `not-found.tsx` files under `src/app/(dashboard-lite)/dashboard` and `src/app/(dashboard)/dashboard`; canonical dashboard-v2 and app-level fallbacks now own those surfaces
- [x] Removed the unused legacy `creatorResource(id)` alias during freeze, then removed the remaining temporary legacy alias helper during the hard cut
- [x] Centralized proxy canonicalization through the temporary compatibility helper during freeze and moved app-facing dashboard probes/tests to canonical `/dashboard-v2/*` paths; that proxy canonicalization has now been removed with old URL support
- [x] Centralized legacy creator query normalization in the temporary compatibility helper during freeze, then removed that overlay/proxy normalization when the hard cut made old URLs unsupported
- [x] Deleted redirect-only learner/account/creator compatibility page files whose behavior was duplicated by proxy-owned canonical redirects during freeze; the later hard cut removed the proxy/helper layer too
- [x] Re-ran runtime smoke against the old learner/account/creator URLs after deleting redirect-only route shims; that evidence was used to choose the later hard cut rather than keeping bookmark redirects
- [x] Rechecked post-checkout and purchase-recovery source links; current app-facing paths use dashboard-v2 destinations and do not point users back to `/dashboard/library`
- [x] Classified `/dashboard/resources` as an intentional compatibility-only exception because it performs session-role and creator-access branching before redirecting to canonical dashboard-v2 creator routes
- [x] Hard cut old URL/bookmark support after confirming the project has no real users yet: deleted `src/lib/dashboard-route-compatibility.ts`, removed proxy canonicalization, removed overlay/footer/navigation-state legacy normalization, and deleted the `/dashboard/resources` compatibility route.

### Final parity / cutover checklist

- [x] Canonical app-facing navigation and purchase CTAs use `/dashboard-v2/*` route constants
- [x] Old learner/account/creator URLs are no longer represented as compatibility inputs; dashboard-v2 is the only supported dashboard route family after the hard cut
- [x] `/dashboard/resources` no longer remains as a role/access handoff exception; use canonical dashboard-v2 creator apply/resources routes directly
- [x] Dropped old URL/bookmark support by deleting `src/lib/dashboard-route-compatibility.ts` and related proxy/overlay/footer/navigation-state normalization after intentionally choosing hard cutover behavior

### Phase 5 close-out evidence

- [x] Browser-level runtime proof from the public marketplace navbar shows `คลังของฉัน` linking directly to `http://127.0.0.1:3000/dashboard-v2/library`
- [x] Browser-level runtime proof from the public account menu shows canonical dashboard-v2 destinations only:
  - `Dashboard` -> `/dashboard-v2`
  - `My Library` -> `/dashboard-v2/library`
  - `Purchases` -> `/dashboard-v2/purchases`
  - `Settings` -> `/dashboard-v2/settings`
  - `KC Premium` -> `/dashboard-v2/membership`
- [x] Click-through verification on 2026-04-13 confirmed public-entry handoff lands on canonical dashboard-v2 routes with the dashboard-v2 shell:
  - `/resources` -> account menu -> `Settings` -> `http://127.0.0.1:3000/dashboard-v2/settings`
  - `/resources` -> account menu -> `Purchases` -> `http://127.0.0.1:3000/dashboard-v2/purchases`
- [x] No surviving public-entry path verified in this pass routed through old `/dashboard*` URLs, old dashboard shells, or old dashboard-family compatibility redirects

### Phase 5 status

- [x] Phase 5 cutover readiness is closed for the dashboard route family
- [ ] Phase 6 post-cutover stabilization remains the next phase

## Audit Scope (Useful Ongoing Areas)

- `src/app/resources`
- `src/app/categories`
- `src/app/creators`
- `src/app/dashboard`
- `src/app/admin`
- `src/app/api`
- `src/components`
- `src/services`
- `src/repositories`
- `prisma/schema.prisma`

## Audit Scope (Topics)

- Payment config and webhook correctness
- Upload and storage flows
- Search / filter / category / recommendation behavior
- RSC streaming performance and cache consistency
- Admin settings / platform branding / build-safe config boundaries
- Security boundaries: auth guards, admin routes, internal warm routes
- Deployment workflow: build vs migrate separation, warm-cache coverage, perf thresholds

---

*Refreshed against the repo state on 2026-04-13.*
