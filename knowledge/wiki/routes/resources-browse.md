# Resources Browse Route

## Summary

`/resources` is the canonical public marketplace route for discover, browse, and search results.

## Current Truth

- The browse index lives under `src/app/resources/(browse)/*`.
- Discover and listing modes share the route but switch based on search, filters, pagination, or sort state.
- Route-level loading and skeleton shells are now intentionally maintained to match discover and listing geometry.
- The resources transition overlay now mounts from `src/app/resources/layout.tsx` instead of the root layout, so unrelated routes do not hydrate resources-only navigation UI.
- Signed-in personalized discover content now mounts behind a dedicated lazy client boundary, so the main discover route can paint before recommendation-specific client logic hydrates.
- Signed-in hard refreshes now rehydrate the discover island from short-lived viewer-scoped session-storage payloads when available, so the route does not always repaint the generic public fallback rows before personalized recommendations return.
- Once the personalized discover island has already loaded in the current tab, later returns to `/resources` can remount that same client section synchronously instead of replaying the generic server fallback rows while the lazy import resolves again.
- That module-level personalized-island cache must stay wrapped in a lazy state initializer (`useState(() => cachedComponent)`); passing the cached component function directly to `useState` makes React treat it as an initializer call, which can invoke the personalized section with `undefined` props and briefly throw the `/resources` route into the error shell on detail → discover returns.
- Personalized discover no longer waits for the owned-id base-state fetch to finish before starting the `scope=discover` request, removing the old client-side `auth -> base -> discover` waterfall on refresh.
- The streamed discover `lead` and `collections` sections now share one cache-backed homepage bundle on the cold path instead of fetching separate resource pools for each section.
- The route no longer forces those discover sections through hard 600ms timeout fallbacks during normal slow-but-healthy requests; the quick-browse shell still streams first, but the section-level `Suspense` fallbacks now own the waiting state until real data arrives.
- The route entry now also has a last-resort transient-infrastructure fail-soft guard for `/resources`, so if a Prisma/Supabase pooler issue escapes the narrower listing/discover catches, the marketplace shell can still render a temporary-unavailable state instead of immediately dropping into `src/app/resources/error.tsx`.
- The route owner now applies that same resilience policy to the async navbar catalog-controls subtree too, because client return navigation into `/resources` can re-render that server branch independently of the main content path.
- The cached best-effort readers that support nearby public surfaces now also catch transient Prisma/Supabase errors inside their own cache callbacks, so stale-cache revalidation for resource reviews, related resources, and creator public metadata can degrade to empty/null data without spraying `revalidating cache with key ...` errors into Vercel runtime logs.
- Detail → discover returns now also avoid automatic sibling-route prefetch bursts: marketplace navbar links, detail breadcrumbs, discover quick-browse cards, and signed-in personalized discover cards prefer intent/click prefetch only, which keeps `/resources` from issuing a wave of speculative listing/detail RSC requests right as the route remounts.
- The signed-in viewer-state APIs that power discover/detail hydration now also fail soft for transient Prisma/Supabase pooler issues, returning safe empty/null payloads instead of 500s when recommendation, ownership, or review hydration loses a best-effort background read during return navigation.
- Immediate detail → discover returns now also have a client-side recovery layer: the shared logo forces a full document navigation when leaving `/resources/[slug]` for `/resources`, and the route error boundary now reopens the current `/resources` URL as a full document load once inside a short session-scoped window before it leaves the user on the manual “resource library could not load” shell.
- Browser-back returns from `/resources/[slug]` now share that same resources-family recovery path, and the same forced discover overlay now also applies when the client comes back to `/resources` from another href inside the app: the route group can force a discover overlay even without an explicit navigation signal, and that overlay waits briefly for the discover personalization ready marker before exposing the browse route again.
- While the route is still inside that one-shot autoretry window, `src/app/resources/error.tsx` now starts directly on the standard discover skeleton instead of flashing the manual error card first.
- If the route lands in a non-retrying error state, `src/app/resources/error.tsx` now still keeps the discover skeleton up for a short grace window before it reveals the manual card, so fast return-navigation recovery does not flash error copy during successful self-healing.
- The hidden discover-personalization ready marker is now hydration-safe on anonymous mounts: the lazy personalized island keeps the marker on `pending` until after the first client hydration pass before it can flip to `skip`, which removes the React hydration-mismatch warning class that was poisoning Browser Smoke `consoleErrors` on `/resources`.
- `getResourceTrustSummary(resourceId)` now treats transient Prisma/Supabase pooler failures as a best-effort trust enrichment miss, returning `averageRating: null`, `totalReviews: 0`, and `totalSales: 0` plus a targeted fallback warning instead of throwing the route back into the error boundary.
- Signed-in discover viewer-state now reuses a five-minute session-backed cache window instead of expiring after fifteen seconds, so returning to `/resources` from detail or nearby pages in the same tab can reopen `Recommended for you` / related personalized sections without immediately re-fetching the same viewer JSON.
- The `/resources/[slug]` detail route now also prewarms that same signed-in discover/base viewer-state cache window plus the lazy personalized discover island module while the user is on detail, so immediate returns to `/resources` have a warmer route/data path before the discover page remounts.
- The route family now also prefers document-level `browse/listing -> detail` navigation when the user is already inside `/resources*`, so browser back can restore the prior discover document instead of replaying an App Router return handoff. The shared logo on detail now tries that same history restoration first when the referrer was canonical discover.
- Browser smoke now treats that return-navigation path as a contract too: authenticated `/resources` return tests navigate into a real detail page, return by logo and browser back, and then verify any expected personalized discover sections can reappear instead of checking only that the route no longer shows the manual library-error shell.

## Why It Matters

This route carries the highest amount of public browsing traffic and is central to both UX and performance work.

## Key Files

- `src/app/resources/(browse)/page.tsx`
- `src/app/resources/(browse)/loading.tsx`
- `src/app/resources/layout.tsx`
- `src/components/skeletons/ResourcesRouteSkeleton.tsx`
- `src/components/marketplace/ResourcesLayoutShell.tsx`

## Flows

- discover landing
- filtered listing
- search results
- navigation into resource detail
- navigation into dashboard library for authenticated owners

## Invariants

- `/resources` remains the canonical search/browse route.
- Loading UI must match discover or listing mode rather than generic placeholders.
- Public route performance changes must avoid request-bound auth at the page level.
- Resources-specific transition helpers should stay scoped to the resources route group instead of being mounted globally.
- Personalized discover and other auth-aware client sections should stay outside the minimal first-paint client payload when their data is non-critical.

## Known Risks

- Search, viewer-state, and recommendation changes can all regress this route.
- Skeleton and overlay behavior can drift from final UI if updated separately.

## Related Pages

- [Search](../systems/search.md)
- [Resource Detail](resource-detail.md)
- [Skeleton Policy](../design-system/skeleton-policy.md)
- [Browser Verification](../testing/browser-verification.md)

## Sources

- [`krukraft-ai-contexts/04-architecture.md`](../../../krukraft-ai-contexts/04-architecture.md)
- [`krukraft-ai-contexts/05-features.md`](../../../krukraft-ai-contexts/05-features.md)
- [`src/app/resources/(browse)/page.tsx`](../../../src/app/resources/%28browse%29/page.tsx)
- [`src/app/resources/layout.tsx`](../../../src/app/resources/layout.tsx)
- [`src/app/resources/ResourcesPageContent.tsx`](../../../src/app/resources/ResourcesPageContent.tsx)

## Last Reviewed

- 2026-05-04
