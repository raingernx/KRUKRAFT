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
- Personalized discover no longer waits for the owned-id base-state fetch to finish before starting the `scope=discover` request, removing the old client-side `auth -> base -> discover` waterfall on refresh.
- The streamed discover `lead` and `collections` sections now share one cache-backed homepage bundle on the cold path instead of fetching separate resource pools for each section.
- The route no longer forces those discover sections through hard 600ms timeout fallbacks during normal slow-but-healthy requests; the quick-browse shell still streams first, but the section-level `Suspense` fallbacks now own the waiting state until real data arrives.
- The route entry now also has a last-resort transient-infrastructure fail-soft guard for `/resources`, so if a Prisma/Supabase pooler issue escapes the narrower listing/discover catches, the marketplace shell can still render a temporary-unavailable state instead of immediately dropping into `src/app/resources/error.tsx`.
- The route owner now applies that same resilience policy to the async navbar catalog-controls subtree too, because client return navigation into `/resources` can re-render that server branch independently of the main content path.
- Detail → discover returns now also avoid automatic sibling-route prefetch bursts: marketplace navbar links, detail breadcrumbs, discover quick-browse cards, and signed-in personalized discover cards prefer intent/click prefetch only, which keeps `/resources` from issuing a wave of speculative listing/detail RSC requests right as the route remounts.

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
