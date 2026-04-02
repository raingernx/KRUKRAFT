# KruCraft — Layout System and UX

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
- streamed discover sections such as trending, creator spotlight, personalized recommendations, new releases, featured picks, and free resources
- viewer-aware personalization hydrates after the public shell instead of blocking the initial route render

**Listing mode**
- no discover hero
- listing intro with result count and sort summary
- desktop filter sidebar plus in-content filter bar
- optional spotlight card when the listing context supports it
- canonical results grid
- no-result recovery panel when a search miss occurs

**Marketplace search UX**
- search suggestions are debounced and open below the navbar search input
- selecting a suggestion opens the resource detail directly
- pressing Enter or using the dropdown footer navigates to canonical `/resources?search=...`
- no-result dropdown and full-page recovery both offer alternate queries plus taxonomy browse links

**Loading behavior**
- discover hero loading uses a plain banner shell, not synthetic alternate content
- discover sections use section/card skeletons that match the live geometry
- listing mode uses structural content fallbacks instead of a generic card wall

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

### /admin

- Shared container-based shell
- Metrics, resource management, moderation, and settings surfaces
- Admin subtree is role-gated upstream; pages should not duplicate layout-level auth checks unless a route has an extra requirement

---

*Refreshed against the repo state on 2026-04-02.*
