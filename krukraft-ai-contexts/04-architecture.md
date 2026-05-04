# Krukraft — Architecture

## Layered Architecture (Strict Rule)

```
API Route → Service → Repository → Prisma
```

- Never call Prisma directly from route handlers or components
- Services own business logic and orchestration
- Repositories own data access
- This pattern is actively maintained in the repo
- Repository raw SQL must use the database table names produced by Prisma `@@map(...)` / `@map(...)`, not the Prisma model names; creator analytics verification on 2026-04-06 caught a real runtime failure where a raw join still referenced `"ResourceStat"` instead of the mapped `"resource_stats"` table
- admin table shells must keep non-table chrome such as toolbars and pagination outside the `<table>` subtree; 2026-04-06 browser-smoke verification caught a real hydration mismatch on `/admin/audit` where `TablePagination` rendered a `<div>` directly under the `DataTable` table markup

## Key Architecture Constraints

- Do not break auth, purchase, upload, or download flows
- Do not move business logic back into routes
- Prefer server components where possible
- Do not modify authentication logic casually
- Keep build-safe and runtime-dynamic paths separate
- `@/services/resources` is intentionally a public/viewer-state barrel only; admin, mutation, and other server-heavy callers must import from `@/services/resources/resource.service` or `@/services/resources/mutations` directly instead of widening the browser-facing surface again

## Repo Knowledge Layer

```
Canonical docs / code / contexts
  → knowledge/raw/   (evidence / source captures)
  → knowledge/wiki/  (synthesized topic pages)
  → agent query / maintenance workflows
```

- the repo now maintains a lightweight LLM wiki under `knowledge/`
- `knowledge/raw/` stores source captures and evidence pages that should remain close to the original material
- `knowledge/wiki/` stores synthesized repo knowledge for routes, systems, testing flows, design-system policy, and operational behavior
- `knowledge/schema/` stores the maintenance rules for ingest/query/lint
- repo-owned scripts now operationalize the layer: `wiki:ingest` adds raw notes and optional wiki stubs, suggests related pages/backlinks, appends `knowledge/log.md`, and regenerates `knowledge/index.md`; `wiki:ingest:dry-run` previews the write set first and can emit machine-readable JSON with `--format json`, now including per-item/per-target decision hints (`actions`, `reasons`, `severity`), a top-level `decisionSummary`, `confidence` / `policy` hints for apply-vs-review gating, top-level batch `policy` overrides that can block existing-page updates, backlink seeding, source-only merges, or excessive review-required plans, and `--enforce-policy` when CI should return non-zero on `blocked_by_policy`; write mode now honors the same gate through `wiki:ingest:enforce` / `wiki:ingest:batch:enforce` before any files are written, `--report-file` can persist the resolved plan as a JSON artifact in either preview or blocked write flows, and `--report-format bundle` upgrades that artifact into a single file with a text summary, path-level artifact hints, review annotations, GitHub-ready summary/annotation hints, and structured sections for CI diagnostics; `wiki:ingest:batch` / `wiki:ingest:batch:dry-run` apply the same workflow to multi-source JSON plans with one pre-validated merge summary, explicit shared wiki targets (`wikiTargets` + `wikiTargetId`) when several captures should merge into one page, and `skipRawCapture: true` when a source should enrich a wiki target without creating a new durable raw note; `wiki:stale` flags old pages for review, semantic/coverage checks catch duplicate topics plus raw/canonical source drift, and `wiki:drift` flags change sets where implementation-linked files or raw evidence changed but the related wiki pages were not reviewed
- default operator policy for that layer is now `Codex triages first`: the agent chooses skip/single/update/batch ingest shape before writing and then reports that decision back to the user instead of requiring the user to classify every knowledge change manually
- this layer is intentionally subordinate to code, `AGENTS.md`, `krukraft-ai-contexts/`, `design-system.md`, and `figma-component-map.md`
- repo-owned linting (`npm run wiki:lint`) enforces required wiki sections plus `knowledge/index.md` coverage so the wiki stays navigable instead of decaying into unlinked notes

## Route Structure

```
src/app/
  resources/                  ← Public marketplace
  resources/[slug]/           ← Resource detail page
  categories/[slug]/          ← Category landing page
  creators/[slug]/            ← Public creator page
  support/                    ← Public support page
  auth/*                      ← Login / register / reset-password
  (dashboard)/dashboard/* ← Canonical protected dashboard family
  admin/*                     ← Admin panel
  api/*                       ← Thin route handlers
```

Historical note:
- `(dashboard)` is now the live dashboard route group
- `(dashboard-lite)` stays retired, owns no live route files, and is not part of the live route structure

## Request Interception

```
src/proxy.ts   ← active Next 16 request interception entry
middleware.ts  ← compatibility shim / re-export surface
```

Current proxy concerns:
- dashboard/admin protection
- locale-prefix cleanup / redirect behavior
- ranking experiment cookie work

Current proxy behavior:
- protected-route gating is now handled directly inside `src/proxy.ts` with `getToken()` checks instead of `withAuth`
- `/dashboard/*` is the canonical protected dashboard route family
- `/dashboard*` and `/admin*` are covered directly by the proxy-level guard
- `/dashboard` home is no longer a public prototype surface: the page now calls `requireSession(routes.dashboard)`, redirects anonymous visits to `/auth/login?next=%2Fdashboard`, and resolves a data-backed learner home summary through `src/services/dashboard/home.service.ts`
- `/dashboard/library` is now the second integrated learner route in the canonical dashboard family: it also calls `requireSession(routes.dashboardLibrary)`, resolves owned-library data through `src/services/dashboard/library.service.ts`, and treats `q`, `filter`, and checkout-return recovery as route-owned state
- `/dashboard/downloads` is now the third integrated learner route in the canonical dashboard family: it calls `requireSession(routes.dashboardDownloads)`, resolves download history through `src/services/dashboard/downloads.service.ts`, and keeps re-download entry points pinned to `/api/download/:resourceId` instead of exposing raw file URLs in the route body
- `/dashboard/purchases` is now the fourth integrated learner route in the canonical dashboard family: it calls `requireSession(routes.dashboardPurchases)`, resolves order history through `src/services/dashboard/purchases.service.ts`, and keeps purchase status/reference rendering in the route body separate from protected file-delivery entry points
- `/dashboard/membership` is now the fifth integrated learner route in the canonical dashboard family: it calls `requireSession(routes.dashboardMembership)`, resolves subscription status/renewal/billing snapshot data through `src/services/dashboard/membership.service.ts`, and now renders the learner account shell/intro before streaming the membership results body through an in-page `Suspense` boundary. Plan CTA decisions stay route-owned without exposing billing internals outside the authenticated surface.
- `/dashboard/settings` is now the sixth integrated canonical learner route: it calls `requireSession(routes.dashboardSettings)`, resolves a read-first settings payload through `src/services/dashboard/settings.service.ts`, and renders real interactive `ProfileSettings`, `PreferenceSettings`, and `NotificationSettings` sections inside the dashboard shell instead of a read-only account summary. The settings surface no longer exposes a language selector; the route now treats Thai as the fixed product language and keeps only theme, currency, timezone, notifications, account-access controls, and a real profile-photo update path on-page. Profile photos now have a provider-backed fallback contract too: Google sign-in persists the original provider image into `User.providerImage`, custom uploads replace only `User.image`, and removing a custom photo from settings restores the stored Google avatar when one exists instead of dropping straight to initials.
- `/dashboard/creator` is now data-backed too: it resolves creator access through `requireSession(routes.dashboardCreator)` and `src/services/dashboard/creator-overview.service.ts`, and renders the creator workspace/profile hub inside the dashboard shell instead of falling back to static creator prototype panels.
- `/dashboard/creator/analytics` is now data-backed: it calls `requireSession(routes.dashboardCreatorAnalytics)`, resolves creator metrics/top resources/recent sales/recent downloads through `src/services/dashboard/creator-analytics.service.ts`, and keeps the locked/error handling route-owned instead of rendering static trend placeholders.
- `/dashboard/creator/sales` and `/dashboard/creator/payouts` now share the same protected earnings data contract: both routes call `requireSession(...)`, resolve creator sales + balance data through `src/services/dashboard/creator-earnings.service.ts`, and render route-owned sales/payout history tables instead of the earlier prototype panels.
- `/dashboard/creator/profile` is now data-backed: it calls `requireSession(routes.dashboardCreatorProfile)`, resolves creator access + profile data through `src/services/dashboard/creator-profile.service.ts`, and renders the existing `CreatorProfileForm` inside the dashboard shell instead of routing back through the creator workspace summary surface. The profile form now owns creator-specific storefront media too: it can upload and save a dedicated `creatorAvatar` plus `creatorBanner` through `/api/creator/upload/image` + `/api/creator/profile`, while public creator pages and dashboard storefront/profile summaries prefer `creatorAvatar` over the account-level `user.image` fallback.
- the dashboard shell viewer contract now also carries an optional
  `creatorPublicHref`, derived from `getCreatorProfile(user.id)`, so creator
  navigation can link straight to the live public storefront without making the
  shell itself request-bound per route
- dashboard creator-nav visibility is now resolved from one shared access
  contract across the shell and account surfaces: `DashboardAppShell` computes
  `creatorNavMode` with `resolveDashboardNavState(...)`, `/api/auth/viewer`
  returns the same `creatorMenuMode` for navbar/account UI, approved creators
  see the full creator nav, non-creators see only `Become a creator`, and the
  old mixed state where learner routes could still show full creator links in
  some menus should no longer occur after sign-in / reload
- `/dashboard/creator/storefront` is no longer a real dashboard destination:
  the route now acts only as a compatibility redirect to the live public
  storefront (`/creators/:slug`) when the creator has a slug, or to
  `/dashboard/creator/profile` as a fallback
- `/dashboard/creator/settings` is also compatibility-only now and redirects
  to shared account settings at `/dashboard/settings`; creator-specific
  settings summaries no longer render inline on the workspace route
- `/dashboard/creator/resources/new` and `/dashboard/creator/resources/[id]` now enforce `requireSession(...)` and resolve a route-owned creator-editor contract through `src/services/dashboard/creator-editor.service.ts`. Non-creator accounts land on a locked state inside the dashboard shell, invalid ids land on a not-found state, and the edit route now loads the real `CreatorResourceForm` with owner-checked resource data instead of rendering a prototype editor scaffold.
- the wider canonical dashboard route family now has concrete route files for the learner and creator surfaces: `/dashboard`, `/dashboard/library`, `/dashboard/downloads`, `/dashboard/purchases`, `/dashboard/membership`, `/dashboard/settings`, `/dashboard/creator`, creator resources list/create/edit, analytics, sales, payouts, profile, and settings.
- creator compatibility routing at the proxy layer was removed during the hard cut; canonical `/dashboard/creator/*` routes now own live creator dashboard behavior directly.
- unauthenticated `/dashboard*` and `/admin*` requests redirect to `/auth/login?next=...`
- authenticated non-admin `/admin*` requests redirect to `/dashboard`
- auth entrypoints now also treat `/dashboard/*` as the only protected return
  family: `/auth/login` sanitizes missing or invalid `next` values back to
  `/dashboard`, and the default Google completion path for both login and
  register resolves to `/dashboard/library`
- public branches still avoid auth work entirely apart from ranking-cookie assignment and locale cleanup
- `/brand-assets/*` runtime alias routes are now excluded from the proxy matcher, so logo/favicon asset redirects do not pay the ranking-cookie/proxy hop

## Caching Architecture

```
Upstash Redis (cross-instance cache)
  → unstable_cache (per-instance cache)
  → runSingleFlight (same-instance dedup)
```

- the marketplace now treats `/resources?category=all&sort=recommended` and `/resources?category=all&sort=newest` as dedicated first-page landing shapes: those routes keep their precomputed listing payloads in a stronger `listingLanding` cache tier and split exact result totals into a separate cached count key so a cold instance does not have to recompute both the heavy rows and the full `COUNT(*)` in the same hot path
- the recommended all-category first page now uses a rows-only activation-ranking query plus a separately cached listing-total read; the newest all-category first page does the same for `findMany + count(*)`, while filtered/category/search shapes keep their existing paths
- discover/marketplace cache invalidation now also clears the new listing-total Redis keys alongside the fixed recommended/newest landing keys so publish/unpublish changes do not leave the first-page totals stale longer than the route payload itself

Used heavily in:
- marketplace listing variants
- discover sections
- resource detail shell/body/footer/purchase meta
- reviews / related content
- platform settings
- the post-deploy route warm pass now burst-aligns the hot `/resources` home shell, resource-detail, creator-detail, category, and listing-control routes to the same 5-VU class that the production smoke suite later measures, and it reheats the hot resource-detail, category, creator-detail, listing-control routes, plus `/resources` home again at the tail of the warm sequence so those route classes are freshest when k6 starts, with `/resources` home now closing the final warm band
- the discover lead + collections readers behind `/resources` now share one cache-backed homepage cold path instead of loading separate resource pools on a cold request; the route still consumes split `lead` and `collections` interfaces, but the heavy shared work now converges behind one homepage bundle loader

Database search note:
- marketplace/admin text search still uses Postgres `ILIKE`/Prisma `contains`
- trigram indexes now cover `Resource.title`, `Resource.description`, `Category.name`, `Tag.name`, `User.name`, and `User.email`
- marketplace search now uses a weighted SQL relevance strategy across title, slug, description, category, tag, and creator fields
- search query understanding now tokenizes multi-word queries and expands a small synonym/alias set for common study terms such as worksheet/ใบงาน, flashcard/แฟลชการ์ด, and note/โน้ต
- live search (`/api/search`) and marketplace result pages share the same search ranking logic
- navbar/listing search surfaces now route to the canonical marketplace results page (`/resources`) instead of appending `?search=` to whatever public page the user is currently on
- typeahead suggestions now navigate directly to resource detail, while Enter and "see all results" route to marketplace results with the marketplace filter context preserved only on the `/resources` browse page
- `/api/search` can now return recovery metadata for no-result states, including suggested alternate queries plus matching categories and tags
- no separate search engine is in the stack today

## Public Marketplace Architecture

```
/resources
  public shell avoids page-level auth/cookie reads
    → the browse index now lives under a route group (`src/app/resources/(browse)/*`) so the discover/listing loading UI is scoped to `/resources` itself and does not flash during `/resources/[slug]` navigations
    → discover hero is now a fixed design-system-led surface in code instead of being resolved from the admin hero CMS
    → the public discover hero no longer has a dedicated admin CMS, analytics write path, or hero-specific cache-selection layer
    → the old `HomepageHero` database table is now explicitly on the removal path and no longer belongs to the active public-marketplace data model
    → listing/discover content streamed separately
    → listing caches keyed by sort/category/page
    → marketplace listing reads now only await category cache before the query when category slug resolution is actually needed; unfiltered listing/search paths can load sidebar categories in parallel with the primary listing read
    → client viewer-state hydration restores owned badges first
    → the `/resources` viewer-state provider is now scoped to viewer-aware card and personalization subtrees instead of wrapping the whole browse shell, so headings/filter chrome can stay outside the owned-state hydration boundary
    → the main listing grid now hydrates owned badges through `ResourceGrid`'s deferred owned-id hydrator instead of sitting under a route-level viewer-state provider, so the grid shell can render with server data first and patch ownership state in later without expanding the provider boundary across the whole listing subtree
    → zero-result search recovery now starts as a deferred nested server subtree behind its own `Suspense` boundary, so the listing shell and search-empty copy no longer wait on taxonomy recovery suggestions before streaming
    → the dedicated no-results search branch now renders the recovery panel without routing through the viewer-state grid/client ownership boundary, trimming hydration work from that empty-search path
    → signed-in discover personalization now hydrates in a second client fetch after owned-state is ready
    → the discover "Top picks" row now server-renders as the default section for everyone, while the heavier personalized discover client module is only loaded for authenticated viewers and can replace that fallback later
    → the discover `Trending now` row no longer shares the personalized viewer-state provider boundary; it patches owned badges through its own deferred base-state fetch so the provider scope is limited to the personalized module itself
    → the discover home no longer awaits a monolithic `getDiscoverData()` bundle for every curated section; `/resources` now starts separate cached `lead` (Top picks + Trending) and `collections` (New releases / Featured / Most downloaded / Top creator) readers in parallel, renders the quick-browse shell immediately, and streams those server subtrees behind structural `Suspense` boundaries
    → those split `lead` and `collections` readers now also share one underlying homepage bundle cache, so a cold `/resources` request no longer pays for two separate resource-pool fetches just because the UI streams them in separate sections
    → the compatibility `getDiscoverData()` reader now composes those split section caches for viewer-state and warm callers, so route entry no longer has to wait on the whole discover payload just to unlock the first curated rows
    → the `/resources` browse route no longer marks deferred hero/content, discover lead/collections, or no-results recovery promises as tracked request work; request tracing now records the route shell without waiting for those Suspense subtrees to settle, restoring real streaming behavior on the hottest public browse path
    → `/resources` no longer races discover lead/collections against hard 600ms timeout fallbacks when those sections already have structural `Suspense` fallbacks; the quick-browse shell still paints first, but the discover sections now stream to completion instead of degrading early to `null`
    → viewer-state can start before any heavier personalized discover work is resolved
    → `/api/resources/viewer-state` serves `scope=base|discover` so ownership and recommendation work stay decoupled
    → signed-in discover payloads use short-lived private caching to smooth repeat navigations
    → recommendation impressions are now recorded from client-side section exposure via `/api/recommendations/impression`, not from discover cache misses
    → post-deploy warm + smoke perf workflow (`deployment_status` + manual `workflow_dispatch` fallback for CLI deploys), and the canonical local operator path now wires that dispatch into `npm run vercel:prod` itself so CLI production deploys do not rely on someone remembering a second manual warm trigger
    → warm workflow install now retries and uploads npm install logs when it fails before warm artifacts exist
    → post-deploy warm/perf jobs now run `setup-node` on Node 24 to match the current lockfile/npm resolver behavior used locally
    → the same workflow now also uses `checkout@v6` / `setup-node@v6` / `upload-artifact@v6`, aligning the GitHub-maintained actions in that flow with upstream `node24` runtimes
    → selective usable fallbacks where they match final section intent
```

Public creator route note:
- `/creators/[slug]` stays public/request-cacheable at the page level and does not read `cookies()`, `headers()`, or server-session state in the route entry
- creator-owner affordances on that public route now hydrate through the same lightweight `/api/auth/viewer` path used by other public auth-aware chrome instead of relying on `useSession()` directly, and that owner-action island now reuses the persisted auth-viewer snapshot eagerly in the same tab so signed-in creators/admins can recover the `Edit profile` CTA faster after a hard refresh without turning the page entry into a request-bound session surface
- creator page metadata now uses a lighter cached metadata reader instead of reusing the full public-profile payload
- the full creator public-profile cache now reads the creator momentum/status-badge fields from the main profile query itself instead of issuing a second `creatorStat` repository call inside the cached loader
- the creator public route now splits its cached data path into a lighter shell reader plus a separate published-resource reader; the page starts both promises together, awaits only the shell at the route entry, and streams the published-resources section behind its own structural `Suspense` fallback
- the creator published-resources reader now queries `Resource` rows directly with the lightweight public-card projection instead of loading a nested `user → resources` relation; the public creator grid no longer carries the unused resource `description` field on that hot path
- the creator published-resource grid now renders those cards through a server-led public card shell instead of the generic client `ResourceCard`, so the route avoids hydrating marketplace overlay/prefetch logic for static creator-card lists
- creator warm coverage now seeds creator metadata, shell, and published-resource caches directly in addition to the compatibility full-profile cache, so the live route and warm path prime the same public cache surfaces
- this keeps creator detail page and metadata requests on separate lighter cache keys while preserving the shared creator-public revalidation tags
- resource-detail warm coverage now seeds the same cache surfaces the live `/resources/[slug]` route renders against: shell, metadata, purchase meta, body content, footer content, public review list, and related resources. The warm path no longer relies on the older compatibility `getPublicResourcePageData()` wrapper for hot detail slugs.
- `/resources/[slug]` now collapses the shell/body/footer/purchase-meta slug reads onto one shared cache-backed detail bundle query, so the cold detail path stops paying for repeated same-row Prisma reads just to feed separately streamed server sections
- the same resource-detail route no longer races body/footer/purchase/trust/review/related branches against hard sub-second timeout fallbacks when those branches already sit behind structural `Suspense` fallbacks; fail-soft behavior still applies for real errors, but normal slow secondary sections now stream to completion instead of degrading early

Public category route note:
- `/categories/[slug]` now starts the marketplace listing read once at the route entry and streams the hero count pill plus listing section through separate `Suspense` subtrees instead of awaiting the full category listing before any shell HTML can render
- the streamed category fallback surfaces are structural now; the in-page listing boundary no longer uses `fallback={null}` while the category resource grid is still resolving
- the category page now renders its resource cards through a static server-led grid instead of mounting the heavier `ResourceGrid` client pagination/filter machinery on a route that does not expose in-page progressive loading
- the category listing now uses the same server-led public card shell for those cards instead of the generic client `ResourceCard`, keeping the static category grid out of marketplace overlay/prefetch client logic entirely
- `/categories/[slug]` no longer routes through the generic marketplace listing reader on its hot path; it now uses a dedicated cached landing reader that resolves the category once and fetches only the first-page newest cards plus count, instead of also paying for sidebar-category/filter data that the page never renders
- the post-deploy public warm script now reheats `/resources?category=all&sort=recommended` and `/resources?category=all&sort=newest` again as the final warm step before k6, so the highest-risk listing control routes finish as the freshest warmed public pages instead of being cooled behind later creator/category warm passes
- the control-arm `/resources?category=all&sort=newest` landing route now also has a dedicated fixed-key Redis cache (`marketplaceNewestListing`) like the recommended arm, and targeted mutation/warm invalidation clears that key directly instead of relying only on the generic paginated listing cache path
- first-page `/resources?search=...` listing renders now also use a bounded per-instance cache wrapper keyed by normalized query/category/sort/page so repeated hot searches can reuse the ranked search render path without introducing a long-lived shared Redis cache for dynamic search results

Root rendering note:
- the root app layout uses build-safe public platform config only and does not read the authenticated server session
- the root layout now inlines the pre-hydration theme bootstrap directly in `<head>`, so `data-theme` / `color-scheme` can be set during document parse instead of waiting on an external body-level script; this removes the remaining light-first refresh flash for returning `dark` users while still keeping public routes off page-level cookie reads
- the theme baseline for users with no stored preference is now `system`; explicit `light` and `dark` remain opt-in user preferences rather than the default initial state
- `UserPreference.theme` now also defaults to `system` at the Prisma/database layer, so new preference rows created outside the client bootstrap path stay aligned with the same runtime baseline
- the app root `src/app/loading.tsx` is now intentionally neutral and centered rather than page-shaped; if the root fallback still appears before a route-family shell resolves, it should not read as discover/library/dashboard UI
- the root client provider tree now mounts `SessionProvider` again alongside the design-system toast provider. Public routes still avoid page-level session reads and rely on targeted auth-viewer fetches for auth-aware chrome, but client account surfaces such as `/dashboard/settings` can now call `useSession().update(...)` to refresh name/email/avatar state immediately after a successful profile save.
- auth recovery screens, creator workspace/account panels, dashboard settings
  panels, and shared resources fallback surfaces now resolve iconography
  through the repo-owned `@/lib/icons` adapter instead of importing
  `lucide-react` directly at the feature level
- the root layout keeps two cross-group overlay bridges: `ResourcesEntryNavigationOverlay` for dashboard/public → `/resources` transitions, and `DashboardEntryNavigationOverlay` for public → `/dashboard/*` transitions. The dashboard entry overlay is intentionally shell-only (`DashboardAppShellSkeleton`) so it reserves only navbar + sidebar while the destination dashboard route mounts its own route-owned content `loading.tsx`.
- those two root-layout overlay bridges now lazy-load their heavier route
  skeleton trees inside the client providers instead of importing the full
  dashboard/resources skeleton modules eagerly at root-provider evaluation time;
  the overlay providers still mount at the app root, but the heaviest skeleton

Browser verification workflow note:
- the main GitHub Actions browser smoke suite still exercises the app under the repo-default `npm run dev` path, but the follow-up dashboard/page/sentinel/management browser-probe restart steps now deliberately use `npm run dev:webpack` because the extra restart phase could trigger a Turbopack panic on GitHub-hosted Linux after the heavier smoke phase completed
- those follow-up browser-probe restart steps now route through the repo-owned `scripts/run-browser-probe-ci.sh` helper instead of duplicating inline shell bootstrap blocks inside the workflow file; readiness failure semantics stay the same, but startup polling/log handling is now centralized so dashboard/page/sentinel/management probe steps cannot drift independently
  branches now split behind on-demand chunks plus local lightweight fallbacks
- dashboard route readiness is now more target-specific than before: overview, library, downloads, purchases, settings, membership, the main creator surfaces, and the creator resource editor routes now expose route-ready markers so handoff overlays can wait for the destination route family instead of clearing on generic dashboard-shell readiness alone
- the dashboard avatar account menu now exposes an explicit probe contract (`data-dashboard-account-trigger`, `data-dashboard-account-ready`, `data-dashboard-account-menu`, `data-dashboard-account-link`) so browser verification can wait for client hydration before opening the menu instead of racing a server-rendered trigger that is visible but not interactive yet
- dashboard user pages and creator workspace pages now share a repo-owned page-shell contract in `src/components/layout/dashboard/DashboardPageShell.tsx`; the contract owns the route-ready marker, `min-w-0 space-y-8` rhythm, and narrow-vs-default width policy so route pages, loading shells, and probes stop drifting apart one file at a time
- dashboard route skeletons now import page-shell/header primitives directly
  from `src/components/layout/dashboard/*`; the older
  `src/components/dashboard/*` compatibility surface is no longer an active
  owner for dashboard page-shell or header behavior
- the dashboard skeleton layer now mirrors that same page-shell contract instead of hand-rolling per-file outer wrappers; settings, membership, learner pages, creator overview/analytics/resources/sales/profile, and creator resource editor fallbacks all render through the same shell primitive before their route-specific sections take over
- the dashboard loading contract now lives in `src/components/skeletons/dashboard-loading-contract.tsx`, and the learner dashboard skeleton family is split into route modules under `src/components/skeletons/dashboard-user/*` with `src/components/skeletons/DashboardUserRouteSkeletons.tsx` as the explicit barrel. This keeps shell-vs-results ownership auditable per route family instead of re-editing one oversized file for every dashboard regression
- the active dashboard loading contract is now canonical-dashboard-only: `src/app/(dashboard)/dashboard/layout.tsx` owns the real dashboard chrome, while each canonical route `loading.tsx` renders only content skeletons inside that shell. The learner-family parent fallback at `src/app/(dashboard)/dashboard/loading.tsx` is now intentionally invisible (`null`), and `/dashboard` overview keeps its home-shaped loading ownership in `src/app/(dashboard)/dashboard/(overview)/loading.tsx` so sibling learner routes can jump directly to their own route fallback without a visible family-level neutral skeleton. The creator-family parent fallback at `src/app/(dashboard)/dashboard/creator/loading.tsx` is now also intentionally invisible (`null`), and `/dashboard/creator` workspace keeps its workspace-shaped loading ownership in `src/app/(dashboard)/dashboard/creator/(workspace)/loading.tsx` so creator children such as resources/sales/payouts can jump directly to their own route fallback without a visible creator-family neutral skeleton. The older compatibility surfaces and `DashboardGroupLoadingShell` were retired during the Phase 5 hard cut.
- this split is still required because App Router segment `loading.tsx` renders inside the already-resolved route-family layout slot; full-shell skeletons must not be rendered from child-route loading files or the UI can show a dashboard inside a dashboard.
- route-level canonical dashboard `loading.tsx` files remain the preferred owners for visible route bodies whenever a learner or creator page needs a substantive loading state. Page-level `Suspense` should be reserved for secondary subsections instead of owning the main route body.
- the staged dashboard route family lives under `src/app/(dashboard)/dashboard/*` and keeps a shell-owned loading contract: `layout.tsx` owns the static dashboard shell, top-level learner and creator family fallbacks stay neutral, and route `loading.tsx` files render content-only skeletons inside that shell. `/dashboard` home now uses an isolated `(overview)` route group and `/dashboard/creator` workspace now uses an isolated `(workspace)` route group so those overview surfaces can keep their own page-shaped loading without reintroducing cross-route home-first or workspace-first flashes on sibling transitions, while the heavier `DashboardAppPrototypeSkeleton` remains a route-family scaffold for first-entry/full-surface preview work rather than a child-route fallback.
- the dashboard shell now also resolves a minimal optional viewer snapshot from `getCachedServerSession()` and passes only display-name/email/image/role/subscription-status plus optional `creatorPublicHref` into the shell chrome. That shell snapshot remains separate from route-level auth ownership: `/dashboard`, `/dashboard/library`, `/dashboard/downloads`, `/dashboard/purchases`, `/dashboard/membership`, `/dashboard/settings`, `/dashboard/creator`, `/dashboard/creator/resources`, `/dashboard/creator/resources/new`, `/dashboard/creator/resources/[id]`, `/dashboard/creator/analytics`, `/dashboard/creator/sales`, `/dashboard/creator/payouts`, and `/dashboard/creator/profile` enforce their own `requireSession(...)` gates while the creator compatibility routes `/dashboard/creator/storefront` and `/dashboard/creator/settings` only validate enough to redirect safely
- Phase 5 cutover hard-cut the learner-facing app route family to canonical `/dashboard/*`: active user dashboard nav, auth callbacks, purchase CTAs, and shared menus point directly at `/dashboard/*` destinations instead of old `/dashboard*`, `/settings`, or `/subscription` surfaces.
- Older non-canonical bookmark paths such as `/settings` and `/subscription` are no longer supported dashboard entrypoints.
- Shared learner navigation now treats `/dashboard/*` as canonical: the marketplace navbar account menu, dashboard topbar avatar menu, dashboard overlay loading/ready selectors, and auth login/register default callbacks resolve into canonical learner destinations directly.
- the last repo-owned `dashboard-v2` shell/component filenames were retired
  from the active dashboard implementation too: the old `DashboardV2Shell`,
  `DashboardV2Navigation`, `DashboardV2Sections`, and prototype skeleton file
  are no longer live code paths after the canonical `/dashboard/*` cutover
- the public navbar account menu now shares one repo-owned link/config contract with the authenticated dashboard dropdown, and protected dashboard destinations are committed explicitly from the menu surface instead of relying on anchor default behavior inside a transient dropdown mount
- Canonical `/dashboard/*` entry navigations still use a root-level dashboard entry bridge when they originate outside the dashboard group, but that bridge is shell-only. The visible content skeleton for the destination route should still come from the route-owned `loading.tsx` inside the mounted `DashboardAppShell`, not from the root overlay.
- The legacy `(dashboard)` and `(dashboard-lite)` route-group layouts/templates were removed after the hard cut. They are not live shell owners and should not be used for new route behavior.
- creator inventory compatibility for old dashboard URLs was retired during the hard cut once canonical `/dashboard/*` navigation and probes were in place; old query normalization is no longer a runtime responsibility
- the first cleanup/removal pass is also underway: dead compatibility-only shell helper files have been deleted, `src/lib/routes.ts` no longer exports legacy learner/creator dashboard aliases, and the dedicated `src/lib/dashboard-route-compatibility.ts` old-URL helper was removed after the project chose hard cutover behavior instead of bookmark redirect support
- `src/proxy.ts` now protects only the canonical `/dashboard/*` dashboard family plus `/admin`; it no longer redirects legacy learner/account/creator dashboard URLs into a separate live dashboard route tree
- the compatibility families also no longer carry their own top-level loading fallbacks; retired dashboard compatibility surfaces do not own visible shell loading before canonical `/dashboard/*` routes mount
- the same cleanup now covers compatibility-only dashboard error/not-found surfaces: old shell fallback UI no longer competes with the canonical dashboard route family or app-level fallbacks; the unused legacy `creatorResource(id)` alias and later the temporary compatibility helper were removed as part of the same cutover track
- Historical note: the retired protected creator segment also followed the same single-owner fallback rule before the hard cut, so first-entry creator routes could not keep an extra protected-shell fallback visible after the route-ready marker was already present
- Historical note: the retired creator resource editor routes under `src/app/(dashboard)/dashboard/creator/(protected)/*` were one of the earlier places where form-loading ownership was tightened so `next/dynamic` and `Suspense` did not both reuse `CreatorResourceFormLoadingShell`. The current canonical creator editor family lives under `/dashboard/creator/resources/*`, but the same single-owner loading principle still applies there.
- the creator workspace phase-3 reset now removes the remaining page-level main-body suspense owners from the protected subtree: `/dashboard/creator/analytics`, `/dashboard/creator/resources`, `/dashboard/creator/sales`, `/dashboard/creator/profile`, `/dashboard/creator/resources/new`, and `/dashboard/creator/resources/[id]` now resolve their main body data before rendering the final page body, so route-level `loading.tsx` is the only visible body-loading owner for those workspace routes
- Historical note: the retired dashboard-lite account routes were one of the places where the team proved the single-owner body-loading rule before the hard cut. The active canonical account routes are now `/dashboard/settings` and `/dashboard/membership`, and those routes keep route-level loading as the only visible body-loading owner.
- public account-menu navigation into `/dashboard/settings` and `/dashboard/membership` no longer opts into any legacy full-screen dashboard entry overlay stack; those canonical account routes rely on route-shell readiness and lightweight navigation state inside the dashboard shell
- repo-owned dashboard verification now has an explicit full-shell overlap contract: `scripts/browser-probe-local.ts` and `tests/e2e/creator-workspace.spec.ts` both track visible `data-loading-scope` markers and fail when more than one dashboard/creator full-shell scope is visible at once, so future regressions cannot silently reintroduce "dashboard inside dashboard" handoff bugs while route headings still look correct
- the same repo-owned browser-probe layer now also has cold-entry handoff scenarios for `/dashboard/settings`, `/dashboard/membership`, `/dashboard/creator`, `/dashboard/creator/profile`, `/dashboard/creator/settings`, and `/dashboard/creator/payouts`; those checks start from a non-dashboard page, navigate into the target route, and fail if the wrong family/neutral shell scopes are still visible after the target route-ready marker appears. The legacy `/dashboard/creator/settings` scenario now verifies the compatibility redirect handoff into the workspace-ready shell instead of a dedicated settings surface.
- dashboard same-route clicks now avoid re-arming dashboard navigation state: sidebar items skip `beginDashboardNavigation(...)` when the clicked item is already active, and avatar-menu links skip the same overlay/progress restart when the current canonical dashboard href already matches the link target
- dashboard ready detection now scopes its fallback stability check to the destination route's `main` surface instead of treating any visible `[data-loading-scope]` anywhere in the document as proof the target page is ready, which stops full-screen overlays from satisfying the ready detector by themselves
- creator protected layout auth now reuses the token-first `getCreatorProtectedUserContext()` helper before checking `getCreatorAccessState()`, so the protected creator gate no longer repeats the older `requireSession()` auth hop on top of the already-hardened dashboard shell path
- `/api/auth/viewer` now resolves directly from the signed JWT token via `next-auth/jwt` instead of `getServerSession`, so lightweight auth chrome does not spend Prisma connections just to confirm the signed-in snapshot
- `/api/resources/viewer-state` and `/api/resources/[id]/viewer-state` now resolve the same auth snapshot from the signed JWT token instead of calling `getServerSession`, so owned-state/detail-state hydration no longer burns Prisma connections on session reads before the feature-specific queries start
- the resources route family now also treats immediate detail → discover returns as a dedicated resilience case: the shared `Logo` forces a hard document navigation when leaving `/resources/[slug]` for `/resources`, and `src/app/resources/error.tsx` now retries by reopening the current `/resources` URL as a full document load once inside a short session-scoped window before it leaves the user on the manual error shell. This keeps transient client-route cache / pool-pressure fallout from trapping the user on the resources error boundary while leaving other route families on normal App Router navigation semantics
- lightweight client JSON fetches now use a small browser-side dedupe/TTL cache for repeat personalized requests, and sign-out clears that cache alongside auth viewer state
- the signed-in discover island on `/resources` now also keeps the already-loaded personalized section component itself in a tiny module-level browser cache, so returning to the route in the same tab can remount personalized discover immediately instead of repainting the generic server fallback rows first and only then swapping back to personalized content
- that discover-island component cache must stay wrapped in a lazy `useState(() => cachedComponent)` initializer instead of passing the cached component function directly to `useState`; React treats a bare function initial state as an initializer call, which can accidentally invoke the personalized section with `undefined` props and recreate the resources route error shell during detail → discover returns
- browser smoke now treats that return-navigation behavior as part of the contract too: the signed-in `/resources` return specs navigate into a real detail page, return by logo and browser back, and then assert that any expected personalized discover sections can reappear instead of stopping at "the route no longer shows the error shell"

## Verification Stack Policy

The repo now treats verification as a layered stack instead of a single-tool decision:

- request-level smoke is the first-choice proof for auth, redirect, ownership, and route-gating behavior that should remain machine-checkable without a browser runner
- `chrome-devtools-mcp` is the preferred local browser-runtime probe when an agent needs to inspect a real authenticated Chrome session, validate click-through behavior, or debug DOM/console/network/layout state in the live app
- Playwright remains the canonical regression and CI browser surface; use it for assertions, durable route coverage, retries, artifacts, and cross-browser intent rather than ad-hoc local debugging
- if local `playwright test` launcher behavior is unstable on the current macOS machine, agents should not stop verifying entirely; they should switch to `chrome-devtools-mcp` plus request-level smoke until the flow is proven, then encode durable assertions back into Playwright when practical
- browser-runtime evidence from `chrome-devtools-mcp` is valid proof for local flow debugging, but it does not replace Playwright when the task needs long-lived automated coverage or GitHub Actions confidence

## Resource Detail Architecture

```
/resources/[slug]
  shared resource loader → metadata + shell
    → page-level auth/cookie reads removed
    → purchase meta deferred
    → body content deferred
    → footer content deferred
    → public reviews deferred
    → lightweight auth viewer now defers to idle time on the detail route
    → client detail viewer-state hydrates ownership/success first after auth viewer readiness
    → detail params/searchParams now resolve in parallel and route metadata reads its own lighter cached metadata loader instead of the public detail shell payload
    → the detail viewer-state provider is now scoped to the success/purchase/owner-review subtree instead of wrapping the whole page shell, so gallery/header/public body sections stay outside the personalization boundary
    → detail base viewer-state now reuses a short-lived browser cache keyed by resource + viewer
    → signed-in hard refreshes can now rehydrate that detail base viewer-state from session storage in the same tab instead of rebuilding from an empty client state every time
    → owner review form hydrates in a second client fetch after ownership is known
    → the owner-review form bundle is now lazy-loaded only after the base viewer-state confirms the signed-in viewer owns the resource, so anonymous and non-owner detail visits do not pay that review-form client payload up front
    → refresh polling can bypass the short-lived private ownership cache after checkout
    → related section deferred separately
    → the route-entry shell cache no longer carries the long-form description field; description now lives in the deferred body-content cache and the metadata cache only
```

Key details:
- viewer-specific ownership/success state now hydrates from `/api/resources/[id]/viewer-state?scope=base`
- owner review state hydrates separately from `/api/resources/[id]/viewer-state?scope=review`
- anonymous detail views skip the detail viewer-state API entirely until auth-aware UI is actually needed
- remote preview images use Next Image when the source is optimizer-compatible; bypass is reserved for non-optimizable cases
- purchase rail is decomposed so CTA can appear before all trust/meta subparts
- client-side overlays and loading shells for the detail route must stay presentation-only; `ResourceDetailLoadingShell` now owns its own fallback markup instead of importing `ResourceDetailSections.tsx`, which prevents `ResourcesNavigationOverlay` from dragging `@/services/platform`, viewer-state services, or resource mutations into the browser bundle during dev compilation

## Dashboard / Admin

```
dashboard/* → force-dynamic, per-user
admin/*     → force-dynamic, role-gated
  analytics/report reads
    → `unstable_cache` for per-instance reuse
    → Redis `rememberJson` for cross-instance warm hits on heavy report paths
```

Historical note:
- legacy `/dashboard*`, `/settings`, and `/subscription` URLs are retired and
  are not part of the active protected route family

Admin settings note:
- build-safe platform config is only for branding-only build surfaces
- `/admin/settings` must read live DB-backed platform settings
- admin brand-asset editing must distinguish stored values from inherited preview fallbacks
- `/admin/settings` now also persists dedicated dark-surface logo fields (`logoFullDarkUrl`, `logoIconDarkUrl`) instead of overloading the light navigation logos
- admin routes and shared admin controls now resolve iconography through the
  repo-owned `@/lib/icons` adapter instead of importing `lucide-react`
  directly, keeping admin chrome aligned with the same icon ownership surface
  used elsewhere in the app
- the `src/app/admin/layout.tsx` subtree is now explicitly `force-dynamic`, so admin overview/resources/orders/users/activity pages cannot be statically prerendered during `next build` and accidentally spend Prisma pool connections on build-time admin reads
- `src/app/(dashboard)/dashboard/layout.tsx` and `src/app/admin/layout.tsx` own their active family shell boundaries; the retired `(dashboard)` / `(dashboard-lite)` groups no longer own live dashboard chrome or shell loading
- this route-family boundary rule exists to keep hard refreshes inside the correct dashboard/admin loading family rather than falling back to the global app-level loading UI while layout-level auth/viewer state resolves
- canonical dashboard family segment `loading.tsx` files must stay content-only because they are rendered inside `DashboardAppShell` once that layout has resolved; `scripts/check-app-skeletons.mjs` still guards against reintroducing the retired full `DashboardGroupLoadingShell` pattern
- `/settings`, `/subscription`, older learner entries, and old creator dashboard paths no longer exist as supported compatibility entrypoints after the hard cut; current app-facing navigation, probes, and shared menus must target the canonical `/dashboard/*` routes directly
- `src/proxy.ts` now protects the canonical `/dashboard/*` family directly in the same redirect gate as `/admin`; unauthenticated requests to legacy learner, account, and creator dashboard URLs are rejected before route code runs instead of relying on older compatibility entrypoints to catch auth first
- those same dashboard-lite learner routes no longer exist as compatibility handoff entrypoints after the hard cut; when debugging current learner dashboard behavior, treat the canonical `/dashboard/*` route family as active and do not inspect dashboard-lite pages for active behavior
- the first route-surface cleanup pass is complete: redirect-only learner/account/creator page files under `(dashboard-lite)` and the old creator subtree were deleted after canonical dashboard parity was established. The later hard-cut pass removed `src/lib/dashboard-route-compatibility.ts`, proxy legacy redirects, overlay/footer/navigation-state legacy normalization, and the `/dashboard/resources` role/access handoff exception.
- a follow-up runtime smoke pass on 2026-04-13 confirmed the old route shims were redundant before removal; after the hard cut, old learner/account/creator URLs are intentionally unsupported instead of redirect/bookmark compatibility inputs
- the old heavier `(dashboard)` route group shell is no longer active after the hard cut; token-first creator/user decisions now belong to canonical dashboard services and routes instead of legacy dashboard shell wrappers
- `/dashboard/settings` and `/dashboard/membership` are the canonical account routes for current UI and verification; the older `/settings` and `/subscription` surfaces are no longer supported redirect surfaces after the hard cut
- `PageContent`, `PageContentWide`, `PageContentNarrow`, and `PageContainer` now forward arbitrary DOM props to their root nodes instead of swallowing them; route families that rely on `data-route-shell-ready`, probe hooks, or other structural data attributes can safely attach those markers to design-system layout primitives without losing them in the render tree
- dashboard settings preference reads are now read-only on entry: `getUserPreferences()` no longer does `user.findUnique()` plus `userPreference.upsert()` on every visit, and the dashboard settings service imports that reader directly instead of adding a dynamic import hop in the hot path
- `/dashboard/library`, `/dashboard/downloads`, and `/dashboard/purchases` now own the canonical learner dashboard bodies; older non-canonical learner entries are no longer supported redirect surfaces after the hard cut
- `/admin` overview now treats admin auth as a layout concern only: the page no longer repeats `requireAdminSession()`, starts metrics and recent-activity reads in parallel, renders the metrics shell first, and streams the recent-activity table through an in-page `Suspense` fallback instead of blocking the whole overview on both data groups
- `/admin/analytics` now splits platform analytics into summary and reporting surfaces: the page renders all-time/30-day KPI sections from a lighter summary reader first, then streams chart/top-resource reporting cards through a dedicated `Suspense` fallback while preserving the same admin analytics shell and experiment links
- `/admin/resources` now treats admin auth as a layout concern only and splits category-filter data from listing results: the page renders its header and filter toolbar after the lighter category read, then streams the table/empty-state/pagination section through an in-page `Suspense` fallback instead of blocking the whole route on rows, counts, and purchase-summary joins
- `/admin/orders` now also treats admin auth as a layout concern only; the page renders its header and filter toolbar first, then streams the stats cards plus orders table behind an in-page `Suspense` fallback instead of blocking the full route on order queries and aggregate totals
- `/admin/users` now also treats admin auth as a layout concern only; the page renders its header and search toolbar first, then streams the users table through an in-page `Suspense` fallback instead of blocking the full route on the user lookup query
- `/admin/reviews` now renders its moderation shell immediately and streams the reviews table behind an in-page `Suspense` fallback; the page no longer re-runs a second admin-session gate just to reach the moderation list
- `/admin/reviews` now also splits moderation summary from the heavier table branch: the page can show aggregate counts/average rating before the full review table resolves, while transient Prisma/pool failures still degrade to an in-page unavailable state
- `/admin/creators` now renders its header shell first and splits creator-application summary counts from the heavier table branch, so moderation overview stats can appear before the application list; transient Prisma/pool failures still degrade to an in-page unavailable state instead of tearing down the route
- `/admin/tags` now also treats admin auth as a layout concern only; the page renders its shell immediately and streams the interactive tag-management client surface behind an in-page `Suspense` fallback instead of blocking the full route on tag usage rows
- `/admin/activity` now also treats admin auth as a layout concern only and relies on the admin layout gate instead of repeating `requireAdminSession()` inside the page
- `/admin/settings` now also renders the admin page shell first and streams the heavy platform-settings form behind an in-page `Suspense` fallback; the settings client can now suppress its own page wrapper/header when the route wants to own the shell, which keeps the loading geometry aligned without nesting an extra `PageContent`
- creator child routes in the canonical dashboard now split responsibility more explicitly: the shell/layout still owns the shared workspace chrome, while page-level creator services own locked/error states for creator-only bodies such as the resources list, analytics/earnings reports, profile/settings, and the prototype editor entry routes
- creator protected analytics/resources/sales/profile/editor routes now follow the same creator single-owner model: route-level `loading.tsx` owns the visible workspace body skeleton, and the protected page files resolve their main KPI/table/form/editor data before rendering the final body instead of streaming the main workspace surface through a second page-level fallback
- creator protected pages that still need a user id now resolve it from the signed auth token snapshot before falling back to `getServerSession()`, so the workspace layout remains the single full access gate and the inner creator pages do not repeat the hot NextAuth session callback path just to look up the same user id again
- creator dashboard destinations now rely on their route-owned loading surfaces inside `DashboardAppShell`; they no longer use the retired `DashboardGroupLoadingShell` or root dashboard entry overlay path
- the phase-2 shell-first loading contract is now active across the canonical route family, including `/dashboard` and `/dashboard/creator`: overview, learner, account, and the main creator routes now keep route-specific header chrome visible during `loading.tsx` and reserve skeletons for the body sections that still need data, instead of swapping the whole page body to a page-wide route skeleton first
- the creator workspace shell now exposes direct in-app CTA affordances for `Resources`, `Earnings`, and `Payouts` from `/dashboard/creator` itself, so creator revenue history no longer depends on cold-entry-only coverage to prove route handoff behavior
- dashboard primary navigation now uses the repo-owned `IntentPrefetchLink` path for the sidebar rail, mobile drawer, creator callout CTA, and avatar account-menu destinations instead of bare `next/link`, so canonical learner/account/creator routes can warm on viewport or interaction intent before the click path enters the route family
- `/dashboard/creator/sales` and `/dashboard/creator/payouts` now render their earnings route intro immediately, stream the KPI summary cards first, and then stream the heavier sales ledger / payout tables behind a second in-page suspense branch; the route-ready marker now lands with the summary-card surface instead of waiting for every table row, while the table branch still uses the route-owned earnings loading geometry until it resolves
- `/dashboard/library` and `/dashboard/downloads` currently keep the shell-first loading contract from the dashboard hardening pass, but their final route bodies still resolve in one pass after route data is ready; the later summary-first runtime perf experiments for those two routes were rolled back, so they are not part of the active perf baseline
- the creator editor routes now use the same shell-first loading contract as the rest of dashboard: `/dashboard/creator/resources/new` and `/dashboard/creator/resources/[id]` no longer render the old `creator-editor` prototype skeleton, and instead keep the real route intro/back-link chrome visible while reserving body space with editor-specific form, delivery, and checklist placeholders
- `/dashboard/creator/apply` now follows the same shell-first loading contract too: the route keeps its real creator-program hero visible during `loading.tsx` and only skeletonizes the approval/application panel beneath it, instead of swapping the full page to the old apply-page skeleton first
- dashboard overlay orchestration now has a narrower source of truth: resources overlays remain in the resources route family, while canonical dashboard route readiness is cleared by the dashboard shell and route markers instead of legacy dashboard overlay wrappers
- `DashboardAppShell` now mounts the shared navigation/overlay readiness helpers itself, so canonical learner/account/creator routes can clear family overlays from the shell root as soon as their page-level `data-route-shell-ready` marker appears, without depending on legacy dashboard-lite wrappers to relay readiness
- public marketplace routes now distinguish transient Prisma infrastructure failures from logic/data bugs: `/resources` listing/discover/search-recovery paths and the route entry itself, plus `/creators/[slug]` / `/resources/[slug]` public shells, fail soft for pool/connection issues instead of immediately throwing the whole route into its error boundary, while still rethrowing non-transient bugs
- `/resources/[slug]` now also starts slug-resolved secondary reads (`body`, `footer`, `purchase-meta`) in parallel with the critical resource shell read and applies per-section timeout fail-soft guards across purchase/trust/reviews/related branches; the route still treats the published resource shell as critical, but secondary detail sections now drop back to in-page fallbacks faster instead of stretching the whole detail experience on a slow branch
- the related-resources branch on `/resources/[slug]` now follows the same page-level promise-start pattern as the public review list instead of beginning only when the lower Suspense subtree executes, trimming real detail-path latency before the non-critical timeout fallback has to engage

## Authentication

```
NextAuth JWT strategy
  → credentials login
  → Google OAuth
  → role-aware protected routes
  → lightweight `/api/auth/viewer` reads JWT cookies directly and avoids Prisma-backed session resolution
  → password reset + soft email verification
```

## Build-Safe Platform Config

```
root layout / metadata / selected public pages
  → build-safe platform defaults

admin settings / live platform editing
  → DB-backed platform config

public logo / favicon / OG asset delivery
  → `/brand-assets/*` runtime routes
  → resolve latest DB-backed platform assets without forcing Prisma into build-time metadata generation
  → runtime asset delivery now guards against `/brand-assets/*` alias values stored in platform settings and falls back to concrete asset URLs instead of redirecting back to itself
  → runtime asset alias requests also bypass `src/proxy.ts`, so asset delivery no longer spends time in the ranking-cookie/proxy layer
  → the alias surface now includes `full-logo-dark` and `icon-logo-dark` for theme-aware navigation branding
  → the `Logo` stack requests fallback and active runtime logo images at high priority from SSR markup so branding assets are requested before most other route imagery without duplicating manual head preloads
  → the `Logo` client component keeps a local repo-owned fallback asset mounted underneath the runtime logo image, so refreshes do not show a blank brand slot while the current custom light/dark asset is still loading
  → dark runtime logo resolution now stays on the repo-owned dark fallback when no dedicated dark asset is stored, so dark refreshes do not settle onto an uploaded light logo after first paint
  → favicon resolution is now deterministic again: the shared platform config falls back only to the dedicated repo favicon asset (`/brand/favicon.svg`) instead of inheriting icon/full-logo branding assets when DB-backed platform settings are missing or degraded
```

This separation exists to avoid Prisma build-time warnings and DB dependency in static build paths.

## Current Architectural Notes

- Build no longer runs `prisma migrate deploy`
- Root layout no longer performs a server-session read for every route
- `/resources` no longer reads session/cookies at the page level; auth-aware discover/listing state hydrates from a client-side viewer-state API that can start before NextAuth client-session readiness settles
- `/resources` viewer-state is now split so owned badges hydrate ahead of recommendation/discover personalization
- `/resources` owned-state hydration now reuses a short-lived browser cache keyed by authenticated viewer id, reducing repeat base-state fetches across quick marketplace navigations without sharing owned badges across users
- the signed-in `/resources` discover island now rehydrates auth-viewer state from persisted browser session storage on first client render, so hard refreshes in the same tab do not have to repaint the generic public fallback while viewer identity is being re-established
- the same discover island now keeps short-lived browser viewer-state cache entries in session storage for both `scope=base` and `scope=discover`, using viewer-scoped cache keys so refreshes can reuse the last good ownership/recommendation payload without cross-user bleed
- the `/resources/[slug]` detail route now shares that same five-minute browser viewer-cache window with the discover page and mounts a client-only `ResourcesReturnWarmup` helper while the user is on detail; that helper prefetches `/resources`, warms the signed-in `scope=base` and `scope=discover` viewer-state payloads, and preloads the lazy personalized discover island so immediate detail → discover returns do not fall back to a colder route/data path
- personalized `scope=discover` reads on `/resources` can now start as soon as auth-viewer readiness is known instead of waiting for the owned-id `scope=base` fetch to finish first, removing the old client-side `auth -> base -> discover` waterfall on hard refresh
- the discover-home `Top picks` and `Trending now` rows now use a server-led public card row instead of the generic client `ResourceCard` / `ViewerAwareResourceCardRow`, so the default public `/resources` shell no longer hydrates marketplace overlay/prefetch card logic for those hot-path rows
- the discover-home default `Top picks` fallback is no longer wrapped by `ResourcesViewerStateProvider`; the viewer-state provider now mounts only inside the lazy signed-in personalized island, so anonymous `/resources` traffic keeps that entire fallback row outside the viewer-state client boundary
- the discover-home `lead` and below-the-fold `collections` subtrees on `/resources` now both run behind short best-effort timeout guards; if either section misses its budget the route still returns the quick-browse shell first instead of letting those discover sections hold the whole home response open
- the same `/resources` discover timeout guards and `/resources/[slug]` non-critical detail timeout fallbacks now keep GitHub Actions Browser Smoke quieter on green runs: CI suppresses the expected timeout warnings for those best-effort branches, while local/prod still preserve the fail-soft behavior and the underlying warning/error surfaces for real debugging
- `/resources` and `/resources/[slug]` now defer auth-viewer resolution to idle time instead of eagerly probing auth on first hydration; auth-aware CTA components warm that viewer fetch on hover/focus/click intent
- `/resources` signed-in discover personalization now uses a short-lived private cache layer to reduce repeat recommendation work across navigations
- `/resources` learning-profile reads inside signed-in viewer-state now also use Redis + single-flight, so repeat cross-instance discover hydration does not keep rebuilding the same purchase-derived profile
- personalized discover now also reuses Redis + single-flight for user interest profiles and Phase 2 candidate pools, reducing cross-instance cold-tail work when multiple signed-in users share the same recommendation slice
- when Prisma pool pressure hits a cold discover refresh, section loaders now stop and fall back through the outer best-effort discover shell instead of spending extra DB queries on fallback IDs; the curated `collections` source loaders themselves now fan out in parallel (`popular/newest/featured/topCreator`) so `/resources` cold paths do not pay a needless serial wait before the cached resource pool read starts
- the `/resources` catalog controls bar now treats category chips as a best-effort shell enhancement twice over: the control component itself still prefers the cached discover category list and falls back to a fixed taxonomy after a short timeout or transient DB/pool failure, and the route owner now also wraps that async navbar subtree in a page-level fail-soft catch so a later transient render failure there does not still escalate the whole route into `src/app/resources/error.tsx`
- marketplace return navigation into `/resources` now also avoids automatic route-family prefetch bursts from visible links on detail/discover surfaces: the navbar logo, marketplace category links, detail breadcrumbs, discover quick-browse cards, and signed-in personalized discover cards all prefer click/intent-driven navigation over viewport/default auto-prefetch so transient DB failures on sibling `/resources*` or `/resources/[slug]` requests do not poison the route cache before the user actually navigates
- the private marketplace viewer-state APIs now also fail soft for transient pooler errors: `/api/resources/viewer-state` returns safe empty or `null` payloads instead of 500s for best-effort discover hydration, and `/api/resources/[id]/viewer-state` mirrors that policy for ownership/review hydration so signed-in remounts degrade quietly instead of surfacing extra infra errors
- returns into `/resources` now keep the same resources-family transition treatment across more than just detail-only hops: when the client comes back to the discover root with a different previous href, the resources overlay can force a discover-shell mask even if no explicit `beginResourcesNavigation(...)` call fired, and both that forced overlay path and the normal route-ready clearer wait briefly for the discover-personalization ready marker before exposing `/resources` again
- the `/resources` route error boundary now starts in its auto-retry skeleton state synchronously when the short session window allows a retry, instead of first painting the manual error card for a frame before the one-shot hard reload begins
- even outside that one-shot retry window, the `/resources` route error boundary now keeps the discover skeleton up for a short grace period before it reveals the manual error card, so brief App Router return-navigation recovery does not flash the library-error copy during successful self-recovery
- the discover personalization ready marker now stays hydration-safe on the initial client paint: the lazy personalized island reports `pending` until after mount before it switches to `skip`, which avoids server/client attribute mismatch warnings on anonymous `/resources` entries while preserving the overlay-ready contract
- signed-in marketplace viewer-state caches for `/resources` home and `/resources/[slug]` now stay warm in the current tab for five minutes instead of fifteen seconds, so quick route hops to detail or adjacent pages can reopen the same personalized/ownership state without immediately re-fetching viewer JSON on return
- trust-summary revalidation now also fail-softs at the single-resource helper level: `getResourceTrustSummary(resourceId)` returns a zeroed trust payload on transient Prisma/Supabase pooler failures instead of rethrowing that best-effort branch into route-level error handling
- the resource-detail purchase rail now keeps its first hydrated paint conservative even when a viewer-state cache exists: detail viewer-state still reuses short-lived session storage after mount, but the initial client render stays on the loading placeholder so the signed-in purchase rail cannot mismatch the server-rendered shell during fast detail entry or immediate return-to-discover flows
- recommendation impression writes no longer happen inside the cached discover loader; impressions are emitted from the client recommendation section when that section actually enters the viewport
- personalized client fetches for discover/review sections now also use short-lived browser-side dedupe to avoid re-requesting the same JSON during quick remounts
- signed-in marketplace discover hydration now also treats recommendation-path transient DB failures as best-effort and returns `null`/empty secondary sections instead of failing the private viewer-state route
- the resources route family now prefers document-level navigation for same-subtree `browse/listing -> detail` handoffs: clicking a resource from `/resources` (or another `/resources/*` page) reopens the detail route as a full document instead of an App Router in-document handoff, so browser back can restore the already-rendered `/resources` document with its personalized discover state intact rather than re-requesting the whole route family
- the shared logo on `/resources/[slug]` now tries `history.back()` first when the referrer is the canonical `/resources` discover route, falling back to `window.location.assign("/resources")` only when there is no matching history entry; this keeps the common detail -> discover return path on the already-loaded document instead of forcing a fresh discover boot
- marketplace category sidebar/filter data now uses the longer homepage-class shared TTL instead of the shorter generic public-page TTL, so hot listing routes like `/resources?category=all&sort=newest` do not churn the shared categories cache faster than their fixed landing-listing caches
- `/resources` with a search query now defaults to `relevance` sorting, while still allowing the user to switch to other marketplace sort orders within the matched set
- search synonym groups, recovery fallback terms, relevance weights, and match-reason copy now live in a shared `src/config/search.ts` config surface instead of being hardcoded inline across helpers and repository SQL
- the search config surface is now driven by typed term rules (`SEARCH_TERM_RULES`) plus shared weight/copy maps, so synonym and recovery tuning can happen in one place instead of editing helper logic and SQL together
- shared marketplace search inputs now use debounced typeahead suggestions from `/api/search`, with direct-result navigation for selected resources and canonical `/resources` navigation for full-result queries
- shared marketplace search inputs now also open an empty-query quick-browse panel on focus/click, using client-side recent searches plus curated marketplace/category shortcuts; typed queries still switch into the debounced `/api/search?view=suggestions` flow once enough text is present
- personalized discover sections now only expose `View all` when there is a truthful listing destination: category-driven "Because you studied ..." links go to that category's newest listing, while purely personalized recommendation slices no longer route users to a misleading generic trending page
- shared marketplace typeahead inputs now call `/api/search?view=suggestions`, which uses a lighter ranked-search result shape than the full search API and avoids review-count work that the dropdowns do not render
- typeahead suggestion fetches now reuse a short-lived browser-side cache, and no-result dropdown recovery now comes from a dedicated `/api/search/recovery` endpoint so the ranked search query is not rerun just to render fallback suggestions
- public search results and search-recovery payloads now reuse `unstable_cache` plus Redis + single-flight on the backend, reducing duplicate ranked-search and taxonomy work both within a warm instance and across repeated queries
- the shared ranked-search SQL no longer uses `COUNT(*) OVER()` on the result window; live search now fetches rows without a total-count path, while marketplace search computes totals in a separate CTE/fallback path so the API and listing flow avoid paying the same window-count cost
- the shared ranked-search SQL now filters candidate resources before computing expensive `tag_metrics` lateral aggregates, so title/category/creator matches no longer pay tag-similarity aggregation across the whole public catalog
- the public `/api/search` and `/api/search/recovery` routes now declare short-lived shared cache headers in source, but production verification on 2026-04-01 only surfaced `Cache-Control: public`, so infra-level response caching should not yet be treated as a verified win
- `/api/internal/ready` now exists as a no-store readiness probe for local/remote smoke verification, and shared search/auth smoke flows use it before hitting `/resources`, `/api/search`, or `/api/auth/viewer`
- the readiness payload now reports `service: "krukraft"` so smoke diagnostics and local tooling no longer expose the legacy `studyplatform` identifier
- `/resources` no-result search states now render a server-first recovery panel with alternate query suggestions, category/tag browse links, and quick routes back into trending/free/discover inventory
- `/resources` switches from discover mode to listing mode whenever search, filters, pagination, or non-default sort are active; category is no longer the only trigger
- `/resources` listing headings now distinguish search results from general browsing so search-without-category flows render as "Search results" instead of inheriting browse copy
- public resource thumbnails and search-result thumbnails now use a simplified shared `RevealImage` primitive that favors stable, always-visible image rendering over JS-driven reveal state; container backgrounds now own the placeholder treatment so cached/fast image loads cannot get stuck hidden behind an overlay
- remote preview images on optimizer-compatible hosts (`*.r2.dev`, Google avatars) no longer bypass Next Image by default, so cards/search/detail previews can benefit from Next's optimization pipeline and modern output formats
- Next Image output now advertises both AVIF and WebP, which improves the chance of smaller payloads on supported browsers
- above-the-fold marketplace hero, spotlight, and leading grid-card images can now opt into eager loading without changing the default lazy behavior for the rest of the catalog; discover sections now carry eager state forward for duplicate preview URLs, and search-result listings widen the eager window when a query is active so Lighthouse/browser runs do not keep flagging lower first-page cards as lazy LCP candidates
- the detail preview gallery now marks both the main preview image and the currently active matching thumbnail as eager/high-priority so duplicate-src thumbnails do not re-trigger Next dev LCP warnings by overwriting the main priority image entry
- `/resources` discover hero is now a fixed repo-owned banner contract, so the route no longer carries the older hero resolver/cache/analytics path at all
- `/resources/[slug]` no longer reads session/cookies at the page level; ownership/success now hydrate ahead of owner-review state from the client-side detail viewer-state API, and post-checkout refresh can bypass the short-lived ownership cache
- `/resources/[slug]` detail viewer-state now waits for the lightweight auth viewer before calling the private detail viewer-state API, so anonymous detail visits skip that extra request; signed-in refreshes can still reuse the persisted auth-viewer snapshot and short-lived detail base-state cache in the same tab before background revalidation, and owner-review state now uses the same viewer-scoped session-storage pattern with explicit cache-key invalidation on successful review writes
- `/resources/[slug]` detail purchase rail now holds a structural "Checking your library…" placeholder instead of flashing a buy CTA before deferred ownership state resolves
- marketplace search and admin user lookup now have trigram index coverage on their joined text columns plus the `Resource.slug`, `Category.slug`, and `Tag.slug` fields that the ranked SQL also searches via `ILIKE`/similarity
- private ownership checks now use short-lived per-user/per-resource `unstable_cache` reads to reduce repeat signed-in viewer-state DB work
- navbar, pricing, and buy-button auth-aware client UI now share a lightweight `/api/auth/viewer` fetch instead of using global NextAuth client session state
- the auth viewer hook now always starts from a stable signed-out/loading snapshot on first render, and navbar auth actions reserve space with loading placeholders until that viewer fetch resolves
- the public `/membership` route now follows the same shell/client split as the
  rest of the public marketplace family: `src/app/membership/page.tsx` stays a
  thin server wrapper that mounts the marketplace navbar and page container,
  while `src/components/membership/MembershipPageClient.tsx` owns the billing
  toggle, pricing cards, and FAQ card. `Pro` CTAs always stay available, while
  the `Team` tier is now optional-config: if the paired `STRIPE_TEAM_*` price
  IDs are absent, the server wrapper suppresses the team pricing tier and its
  FAQ entry instead of failing the route at build time. Anonymous checkout
  attempts still redirect through `routes.loginWithNext(...)` before calling
  `/api/stripe/checkout`, and direct team-plan checkout still returns a config
  error when live team Stripe price IDs are missing.
- local dev/HMR-only transient auth-viewer network failures now resolve back to the signed-out snapshot without logging noisy `[AUTH_VIEWER_HOOK] Failed to fetch` errors, while non-transient and production failures still log normally
- public navbar auth fetches now defer to browser idle time by default and warm early on hover/focus/menu interaction, reducing eager post-hydration auth work on anonymous traffic without reintroducing root-layout session reads
- pricing and purchase CTA buttons still prime auth-viewer on interaction, but they now also reuse the persisted auth-viewer snapshot immediately when the same tab already knows the user instead of waiting for the older idle-only resolution path
- admin analytics/creator pages rely on the admin layout auth gate instead of repeating the same session check inside each page
- Post-deploy warm/perf workflow includes smoke coverage for resources home, listings, creator detail, resource detail, and category listing
- search/auth verification now has repo-owned smoke commands: `npm run smoke:local:search` for localhost and `npm run smoke:prod:search` for the production alias; other environments can reuse the same script with `BASE_URL=... npm run smoke:search`
- key browser verification now also has a repo-owned `npm run smoke:local:browser` path that exercises the main public search/detail/auth-guard flows plus authenticated admin/creator preview-image uploader flows before merge
- GitHub Actions now also owns a cloud browser verification path via `.github/workflows/browser-smoke.yml`; that workflow provisions Postgres 16, applies schema with `prisma db push`, seeds demo data, and runs `npm run smoke:browser:ci` so browser regressions can be checked without relying on a specific local machine's Playwright/browser runtime
- Playwright browser automation is now scaffolded for local/CI use via `playwright.config.ts` and `npm run test:e2e`; the local project still uses the `chromium` project name, but it now defaults to `channel: "chromium"` so local verification uses Playwright's bundled Chromium browser instead of the headless shell or installed Chrome stable. Use `PLAYWRIGHT_BROWSER_CHANNEL=chrome` only when you explicitly need installed-Chrome verification
- browser-level route coverage now includes `/resources`, top-bar search submit into canonical `/resources?search=...`, canonical search results, no-results recovery, resource detail image rendering, and authenticated preview-image uploader flows on both `/admin/resources/new` and `/dashboard/creator/resources/new`
- the repo-owned smoke Playwright bundle now also includes `tests/e2e/creator-workspace.spec.ts`, and that spec now covers canonical learner cold-entry handoffs (`/dashboard`, `/dashboard/library`, `/dashboard/downloads`, `/dashboard/purchases`, `/dashboard/membership`, `/dashboard/settings`) plus creator workspace/profile/settings/payouts shell-hand-off regressions in `npm run smoke:browser`, `npm run smoke:browser:ci`, and the `browser-smoke.yml` workflow instead of relying only on ad-hoc probes. The cold-entry assertions now also fail if the retired family-neutral scopes (`dashboard-neutral`, `dashboard-creator-neutral`) appear at all during those route transitions.
- the same `tests/e2e/creator-workspace.spec.ts` suite now also has durable click-through sampling for real in-app transitions instead of only `goto()` coverage: learner `home -> library` and `home -> membership`, creator sidebar transitions `workspace -> resources` and `workspace -> earnings`, plus a dedicated workspace CTA handoff check for `workspace -> payouts`; all of those flows fail if wrong-owner dashboard scopes remain visible after the target route becomes ready
- the cloud browser smoke scope intentionally excludes uploader specs for now, because uploader coverage needs storage configuration that the repo-owned CI workflow does not provision by default; uploader flows remain part of the local smoke path instead of the baseline GitHub Actions gate
- browser-level search coverage now also verifies the empty-query quick-browse dropdown and recent-search chip behavior before the canonical search submit path
- browser-level discover coverage now also verifies that the "Featured picks" `View all` CTA opens the featured listing filter instead of falling through a legacy sort alias, and that the seeded creator discover shell does not expose misleading personalized CTA affordances when no history-backed personalized slice exists
- browser-level verification tooling now also includes `@axe-core/playwright` for in-test accessibility checks, `@lhci/cli` via `.lighthouserc.json` for Lighthouse route audits, and `@next/bundle-analyzer` behind `ANALYZE=true` / `npm run analyze` for bundle inspection
- Storybook is now scaffolded only for `src/design-system/primitives/*` and `src/design-system/components/*`, with repo-owned config under `.storybook/` and a verified build-based smoke path via `npm run storybook:smoke`
- Chromatic CLI is also installed as an optional Storybook publish/review layer for visual regression work, but it is dormant until a `CHROMATIC_PROJECT_TOKEN` is configured
- Repomix is also installed as a local AI-context export utility, with repo-owned `.repomixignore` rules to keep secrets, generated artifacts, and local tool state out of packed outputs
- local browser automation against `http://127.0.0.1:3000` is now explicitly allowed through Next's `allowedDevOrigins`, so Playwright no longer depends on blocked dev-resource/HMR fallbacks when it uses that origin
- optional skeleton generation can now be layered in via `boneyard-js` (`boneyard.config.json`, `src/bones`, `npm run skeleton:boneyard:build`), but the repo still treats route-level loading/fallback design as a first-class contract rather than replacing everything with generated bones
- the global CSP header now explicitly allows `https://va.vercel-scripts.com`, matching the Vercel Analytics / Speed Insights scripts that the app mounts in runtime
- root metadata now also serves `robots.txt` from `src/app/robots.ts`; the file is generated from build-safe public platform config so local/public crawlers stop seeing a 404 without reintroducing DB-backed metadata reads
- `src/proxy.ts` no longer imports `next-auth/middleware`; request interception now uses direct JWT inspection via `next-auth/jwt`, which keeps the protected-route behavior explicit while trimming one middleware helper layer from the hot request path
- admin notification toasts now use CSS-only entry animation, and preview-image drag/drop uploaders use a native file-input + drag/drop implementation behind a lazy client boundary that mounts on visibility or user interaction so admin/creator forms do not pull notification motion runtime or uploader-specific package code into the first render path
- creator resource create/edit pages now also load the heavy client form through `next/dynamic` with structural loading shells, and admin create-form lazy loading now includes a matching form skeleton instead of a blank gap while the client chunk resolves
- discover-mode `/resources` now trims its curated section source pool from 8 to 6 candidates and renders 4 cards per server section/fallback row, which reduces the hot-path HTML/render workload without changing listing-mode result counts
- the `/resources` category chip rail no longer asks Prisma for per-category `_count` data on the hot path; discover category loading now uses a lean `id/name/slug` projection because the chip UI never rendered counts
- public marketplace routes now treat transient Prisma/pool failures as fail-soft for the main shell where practical: `/resources` listing/search-recovery/discover controls and route-owned catalog-controls subtree, `/resources/[slug]` critical shell, and `/creators/[slug]` public shell now fall back to in-page unavailable states or drop deferred sections instead of immediately exploding the whole route
- `/admin/audit` now renders its header/filter shell first and streams the audit table/pagination results through an in-page `Suspense` boundary, while `/dashboard/creator/apply` now keeps route-level loading as the only visible body owner and limits deferred loading to the rejected-feedback subsection instead of streaming the entire status/form panel separately
- repo-owned dashboard verification now covers regular-user creator onboarding too: `tests/e2e/helpers/auth.ts` exports `loginAsUser(...)`, `tests/e2e/creator-workspace.spec.ts` asserts that `/dashboard/creator/apply` clears overlays without shell stacking for non-creators, and `scripts/browser-probe-local.ts` includes a `creator-apply-cold-entry` scenario that fails if dashboard-family shells remain visible after the route-ready marker appears
- the separate `management_probes` job in `.github/workflows/browser-smoke.yml` still runs `npm run browser:probe:management`, and that probe bundle now includes creator cold-entry checks for overview/profile/settings/payouts as a second browser-level signal alongside the durable Playwright spec coverage
- several admin long-tail routes now rely on the admin layout auth gate instead of repeating page-level admin-session reads when the page itself does not need session data (`/admin/resources/trash`, `/admin/resources/[id]/versions`, `/admin/resources/bulk`), and `/admin/reviews` now fail-softs to an in-page unavailable state for transient Prisma/pool failures instead of tearing down the full moderation route
- `/admin/creators` now follows the same resilience policy as the other hardened moderation routes: the admin shell still renders first, and transient Prisma/pool failures fall back to an in-page unavailable state instead of dropping the entire creator-application route
- `/admin/resources/new` and `/admin/resources/[id]` now follow the same shell-first editor pattern as the other hardened admin routes: the page header renders immediately, while category/tag/resource form data streams in behind an editor-only fallback instead of blocking the whole route on admin form reference data
- `/admin/resources/trash` and `/admin/resources/[id]/versions` now also follow the same shell-first admin-resource pattern: route headers render immediately, while the trash table and version-history card stream behind resource-specific results fallbacks instead of blocking the whole route on trash/version reads
- creator resource create/edit routes now use the same editor-only streaming pattern too: `/dashboard/creator/resources/new` and `/dashboard/creator/resources/[id]` render their page shell first and load category/reference data behind the form fallback instead of blocking the entire editor route on form-data reads
- creator inventory/editor taxonomy reads now go through a cached category helper in `src/services/creator/creator.service.ts`, and the paginated `/dashboard/creator/resources` management path now overlaps category-taxonomy warming with status-summary work before counting/filtering rows; the route still resolves the final table server-side, but it no longer burns a separate uncached category read at each creator-resource surface
- the old `/dashboard/resources` role/access handoff exception was removed in the hard cut; creator apply/resources routing should now enter through canonical dashboard creator routes directly
- `/dashboard/creator/apply` now uses the same fast-path redirect principle for clearly admitted roles (`ADMIN`/`INSTRUCTOR`) before falling back to `getCreatorAccessState()`, which trims one avoidable creator-access read from the canonical onboarding path without changing the pending/rejected application semantics for regular users
- `/dashboard/creator/apply` now keeps the rejected-state feedback read behind its own nested suspense branch; the rejected shell and reapply form render first, while the optional rejection-reason panel loads separately instead of holding the entire rejected panel
- `/admin/resources/[id]` no longer blocks the route shell on a second title lookup before rendering; the edit route now lets the streamed editor section own the existence check instead of paying a duplicate title read in both the page shell and the editor data path
- admin analytics long-tail routes that do not need per-page session data now also rely on the admin layout auth gate instead of repeating their own page-level admin-session check (`/admin/analytics/purchases`, `/admin/analytics/ranking-experiment`), reducing one extra auth hop from those request paths without changing admin access semantics
- the remaining admin analytics report routes now follow the same shell-first pattern: `/admin/analytics/purchases`, `/admin/analytics/ranking-experiment`, `/admin/analytics/recommendations`, `/admin/analytics/ranking`, and `/admin/analytics/creator-activation` render headers and filter controls first, then stream heavy report bodies separately; ranking filter categories are now loaded through a dedicated cached filter reader and the ranking filter chrome itself sits behind a smaller suspense boundary so the page no longer waits on category-filter data before showing the rest of the route shell
- marketplace account dropdowns and dashboard avatar menus now expose canonical `/dashboard/*` targets directly; legacy dashboard URLs are no longer kept as redirect/bookmark compatibility destinations after the hard cut
- dashboard user and creator routes now share a common page-header contract through `src/components/dashboard/DashboardPageHeader.tsx`, so route shells and their loading placeholders keep the same title/description/action rhythm instead of each route hand-rolling its own spacing
- dashboard user skeletons are now intentionally neutral where user state changes the page shape most sharply: the library results fallback no longer reserves a checkout-recovery banner by default, and the membership route no longer assumes the active-plan hero layout before subscription data resolves
- the dashboard results layer still supports branch-aware fallback geometry on canonical learner routes; checkout-return and populated/empty library geometry should be verified against `/dashboard/library`
- dashboard geometry proof now runs branch-aware preview surfaces from `/dev/dashboard-geometry`, so proof targets can lock `libraryVariant` / `subscriptionVariant` instead of comparing every route against one generic dashboard skeleton
- Category landing pages intentionally use `newest` for their first-page curated feed
- protected download redirects now allow the branded bucket host `files.krukraft.com`, matching the repo's current R2/public URL guidance instead of the old `cdn.studyplatform.com` example
- `src/env.ts` is the central server env validation surface

---

*Refreshed against the repo state on 2026-04-05.*
