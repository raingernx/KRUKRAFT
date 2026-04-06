# Search System

## Summary

Marketplace search is centered on `/resources`, with canonical search routing, typeahead suggestions, recovery flows, and weighted ranking.

## Current Truth

- Search queries route to `/resources` rather than ad-hoc page-local query strings.
- Live search suggestions and full result pages share ranking logic.
- No-result flows offer recovery suggestions and alternate browse paths.
- The full `HeroSearch` client bundle is now reserved for the main marketplace route, while secondary public routes lazy-load navbar search behind the structural search shell.
- Dev-only bones/preview search fixtures now live outside the runtime `HeroSearch` module, so marketplace search does not carry those preview exports in the live client bundle.

## Why It Matters

Search is one of the most performance-sensitive and user-visible public features in the repo.

## Key Files

- `src/config/search.ts`
- `src/app/api/search/route.ts`
- `src/app/resources/(browse)/page.tsx`
- `src/services/search/*`

## Flows

- user types in shared marketplace search
- typeahead suggestions fetch lightweight suggestion data
- Enter or explicit result navigation routes to canonical `/resources`
- no-result pages render recovery suggestions on the same route

## Invariants

- Search routing stays canonical to `/resources`.
- Search config should live in shared config instead of inline hardcoding.
- Search changes should be verified with browser smoke and runtime checks.
- Secondary public routes should not eagerly hydrate the full marketplace search client bundle when a structural navbar search shell is enough for first paint.

## Known Risks

- Ranking SQL or cache changes can regress both typeahead and result pages.
- Search performance issues can hide behind successful but slow responses.

## Related Pages

- [Resources Browse](../routes/resources-browse.md)
- [Browser Verification](../testing/browser-verification.md)
- [CI Browser Smoke](../operations/ci-browser-smoke.md)

## Sources

- [`krukraft-ai-contexts/04-architecture.md`](../../../krukraft-ai-contexts/04-architecture.md)
- [`krukraft-ai-contexts/05-features.md`](../../../krukraft-ai-contexts/05-features.md)
- [`src/components/marketplace/MarketplaceNavbarSearch.tsx`](../../../src/components/marketplace/MarketplaceNavbarSearch.tsx)
- [`src/components/marketplace/HeroSearchPreviews.tsx`](../../../src/components/marketplace/HeroSearchPreviews.tsx)

## Last Reviewed

- 2026-04-07
