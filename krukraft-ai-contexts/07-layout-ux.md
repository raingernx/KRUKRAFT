# Krukraft — Layout System and UX

> Layout/UX reference. Validate marketplace/detail/admin behavior against the
> current app tree before assuming every section here still matches production.

## Global Container

```tsx
// src/components/layout/container.tsx
<div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
  {children}
</div>
```

## Layout Rules

- Marketplace pages use full-width section backgrounds with the main content constrained inside the shared `Container`.
- Dashboard and admin pages reuse the same container baseline.
- Hero and discover sections keep broad backgrounds, but text blocks stay constrained with `max-w-*` wrappers instead of stretching across the full catalog width.

## Responsive Breakpoints

| Breakpoint | Width |
|-----------|-------|
| Mobile | base |
| Tablet | sm (640px), md (768px) |
| Desktop | lg (1024px), xl (1280px), 2xl (1536px) |

## Grid Scaling

```css
[grid-template-columns:repeat(auto-fill,minmax(240px,1fr))]
[grid-template-columns:repeat(auto-fill,minmax(280px,1fr))]
```

- Catalog and discover sections use adaptive auto-fill grids rather than a fixed card count per breakpoint.
- Large-screen gaps usually sit in the `gap-6` to `gap-8` range.

## Page Layouts

### /resources (Main Marketplace)

- Primary public marketplace route with two explicit modes:
  - **Discover mode:** active when no search, filter, pagination, or non-default sort intent is present
  - **Listing mode:** active when search, filters, pagination, or a non-default sort are present
- Shared shell:
  - navbar with canonical marketplace search in the header row
  - secondary controls row with discover button plus scrollable category chips

**Discover mode**
- full-width hero section above the main content container
- the hero now uses a compact dark merchandising stage: editorial copy on the left, a media panel in the center, and a clean utility rail on the right for key browse value points
- the discover hero intentionally stays shadow-free; emphasis comes from contrast, crop, and panel hierarchy rather than floating card chrome
- discover now favors fewer, clearer blocks instead of stacking many near-identical rails
- the main sequence is:
  - quick browse tiles for entry intents like top picks, worksheets, flashcards, and free resources
  - personalized recommendations (or a public "Top picks" fallback for anonymous viewers)
  - one high-signal trending rail
  - a curated collections grid that links deeper into listing modes such as newest, featured, and most-downloaded
- viewer-aware personalization hydrates after the public shell instead of blocking the initial route render
- discover-section CTAs should only appear when the target listing matches the section's promise; purely personalized rows can omit `View all` rather than sending users to a generic fallback list

**Listing mode**
- no discover hero
- listing intro with result count and sort summary
- desktop filter sidebar plus in-content filter bar
- optional spotlight card when the listing context supports it
- canonical results grid
- no-result recovery panel when a search miss occurs
- public activation-weighted `sort=recommended` remains the canonical query value for backward compatibility, but UI copy now labels it as `Top picks` so it is not mistaken for personalized recommendations

**Marketplace search UX**
- focusing/clicking the empty navbar search input now opens a quick-browse dropdown with recent searches plus curated browse shortcuts
- search suggestions are still debounced and replace the quick-browse panel once the user types enough text
- selecting a suggestion opens the resource detail directly
- pressing Enter or using the dropdown footer navigates to canonical `/resources?search=...`
- no-result dropdown and full-page recovery both offer alternate queries plus taxonomy browse links

**Loading behavior**
- discover hero loading uses the same stage geometry as the live hero rather than a generic promo banner
- discover hero loading should keep the same geometry but use neutral placeholder tones only; no promotional accent blue/purple fills inside the skeleton stage
- discover sections use section/card skeletons that match the live geometry
- the browse index loading UI now lives under `src/app/resources/(browse)/loading.tsx`, which keeps the discover/listing skeleton scoped to `/resources` and prevents it from flashing before `/resources/[slug]` loading states on cold detail navigations
- route-level browse loading and the in-page discover Suspense fallback now share the same discover skeleton source so layout changes do not require maintaining two divergent skeleton implementations
- listing mode uses structural content fallbacks instead of a generic card wall
- route files under `src/app/**` should not declare local `*Skeleton` or `*Fallback` components inline; shared loading/fallback UI now lives under `src/components/skeletons/*`, and `npm run lint` enforces that contract with `npm run skeleton:check`
- forward navigation from a scrolled `/resources` view into `/resources/[slug]` now scrolls the viewport to the top before the detail loading shell renders, while browser back-navigation should still restore the previous discover scroll position

### /resources/[slug] (Resource Detail)

High-level shell:

```text
max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8
  → breadcrumb
  → title / metadata
  → main grid
      left/center: gallery + preview body
      right: purchase rail
  → deferred footer / review / related sections
```

- Breadcrumb navigation
- Gallery / preview media at the top of the content stack
- Purchase rail resolves ownership state separately and can show a structural "Checking your library…" placeholder
- Reviews and related resources are deferred separately from the initial shell
- Detail pages no longer rely on page-level auth/session reads for anonymous rendering

### /library

- Purchased and owned resources
- Consistent action alignment for preview/download/open buttons
- Filter and sort controls where relevant

### /dashboard

- Per-user dynamic rendering
- Purchases and learning profile surfaces
- Download history and creator-access state
- `/settings` now favors flat, divider-based account sections instead of stacking card-inside-card form panels; section hierarchy should come from headers, spacing, and row separation first
- `/settings` route-level loading now mirrors that same flat section rhythm instead of returning a null loading state

### /admin

- Shared container-based shell
- Metrics, resource management, moderation, and settings surfaces
- Admin subtree is role-gated upstream; pages should not duplicate layout-level auth checks unless a route has an extra requirement
- the hero editor preview now reuses the exact same shared hero surface as the public `/resources` discover hero, so editor changes are made against the real browse-first layout instead of an admin-only approximation
- admin settings and inspector-like screens should follow the same anti-nesting rule as dashboard settings: prefer flat sections and divided rows over repeated white bordered cards unless a section truly needs its own elevated surface
- `/admin/settings` now uses one dominant settings surface with flat divided sections inside it, and its loading state mirrors that structure instead of returning `null`

---

*Refreshed against the repo state on 2026-04-02.*
