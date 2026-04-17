# Krukraft — Design System Digest

This file is the short AI-context digest for the design system.

What this file owns:
- quick source-of-truth order for agents
- current DS orientation notes
- active caveats and implementation facts worth remembering between sessions

What this file does not own:
- the full DS inventory
- the Figma handoff specification
- the live Figma node registry

For canonical references:
- code-side DS inventory and ownership: `src/design-system/README.md`
- Figma reconstruction and handoff rules: `design-system.md`
- Figma node-to-code registry: `figma-component-map.md`

## Source of Truth

Use this order when DS docs disagree:

1. `src/design-system/*`
2. `src/components/resources/ResourceCard.tsx` for the marketplace card
3. `src/design-system/README.md`
4. `design-system.md`
5. `figma-component-map.md`
6. this digest

## Current Shape

- App and feature code should import DS-covered surfaces from `@/design-system`.
- Product-bound DS exports should come from `@/design-system/product`.
- `src/components/ui/*` is a transitional primitive layer for maintenance only.
- The DS is organized under:
  - `src/design-system/tokens/*`
  - `src/design-system/primitives/*`
  - `src/design-system/components/*`
  - `src/design-system/product/*`
  - `src/design-system/layout/*`
- Storybook is scoped to DS primitives and DS components; `npm run storybook:smoke`
  is the stable local verification path for that surface.

## Active Facts And Caveats

- `ResourceCard` is DS-exposed but product-bound; its implementation owner is
  `src/components/resources/ResourceCard.tsx`, not a generic primitive layer.
- `FormSection` is the canonical settings/admin section helper and should
  default to the flat, divider-first treatment rather than nested-card layouts.
- `DataPanelTable` is the canonical dashboard/admin table shell, but filtering,
  row rendering, and business actions stay route-owned.
- `LoadingSkeleton` is the canonical shared skeleton primitive; runtime loading
  shells should stay neutral and structurally close to the resolved UI.
- `RevealImage` is the shared image primitive for already-sized containers; the
  surrounding container should own placeholder/background treatment.
- Dark-shell selected rows, chips, and feedback states should use theme-aware
  emphasis surfaces rather than fixed light-only `*-50` fills.
- Hero surfaces are not generic `card` surfaces; they should use the hero
  semantic layer instead of default card tokens.
- `boneyard-js` is optional capture tooling for generated skeletons under
  `src/bones`; it supplements the repo's loading/fallback parity rules and does
  not replace route-owned loading, empty, or error states.
- `ThemeProvider` now boots with a stable `initialTheme` first and only syncs
  `localStorage` after mount so client-only stored theme choices do not cause
  hydration mismatches in shared chrome such as `ThemeSwitcher`.
- Token migration contract is now locked before any real token re-skin pass:
  - `brand` is the primitive hue family
  - `primary` is the semantic action role
  - semantic/runtime roles stay authoritative for Tailwind utilities and CSS
    variables
  - `accent` remains overloaded today and should be treated carefully: the
    runtime semantic accent is a neutral surface role, while the colorful named
    accent hues are still primitive/exploratory
- The first token-value slice is now landed on border/input semantics only:
  `borderSubtle`, `border`, `borderStrong`, `input`, and `sidebarBorder` were
  recalibrated in the runtime theme layer without changing `primary`, `brand`,
  `accent`, aliases, or hero tokens.
- The second token-value slice is now landed on surface semantics only:
  `card`, `popover`, `muted`, and `mutedForeground` were recalibrated in the
  runtime theme layer without changing `secondary`, `accent`, `primary`,
  `destructive`, aliases, or hero tokens.
- Public chrome now consumes that hierarchy more directly: navbar shells,
  overflow menus, and account dropdown triggers/menu shells prefer
  `border-border-subtle` for resting chrome and `border-border-strong` only for
  stronger active/open emphasis.
- Dashboard chrome now consumes that hierarchy more directly too: sidebar
  callouts, guest account menus, notification popovers, drawer shells, and the
  matching prototype skeletons now prefer `bg-card/95` for chrome shells and
  use calibrated muted surfaces only for subordinate emphasis blocks.
- The third token-value slice is now landed on action/status semantics only:
  `primary`, `ring`, `destructive`, and the sidebar action mirrors were
  recalibrated in the runtime theme layer without changing `brand`, `accent`,
  `secondary`, aliases, or hero tokens.
- The first semantic-token consumer adoption slice is now landed in
  `Button` and `SearchInput`: primary and destructive button treatments plus
  search focus/clear affordances now consume semantic action/status tokens
  directly instead of `primary-500` or raw red scales.
- The second semantic-token consumer adoption slice is now landed in
  `Dropdown` and `Switch`: destructive menu rows, selected indicators, checked
  switch state, and focus rings now consume semantic action/status tokens
  directly instead of `brand-600`, `red-600`, or `primary-500`.
- The first feature-owned action/status adoption slice is now landed in account
  chrome: account-menu membership and nav rows now consume semantic `ring`
  focus treatment, while `ThemeSwitcher` already rides the DS primitive layer
  and did not need a separate patch in this pass.
- The first route-owned action/status adoption slice is now landed in auth
  flows: auth error banners, info banners, input focus states, and auth CTA
  links now consume semantic `destructive`, `primary`, and `ring` treatments
  instead of red/blue scale-specific classes.
- The next migration risk now sits in other route-owned action/status consumers
  and any remaining named-scale feedback shells outside auth and account chrome.
- `globals.css` mirrors the runtime theme layer manually; token files are still
  canonical and must be updated first when the real token migration begins.
- External DS reference stack is now explicit:
  - `Primer` for token taxonomy and naming-layer discipline
  - `Atlassian Design System` for intent-first color roles, shared chrome
    rigor, and layout primitive thinking
  - `Radix Themes` for runtime theming, contextual radius/scaling, and
    primitive ergonomics
- The current visual direction brief is now locked on top of that stack:
  - calm, premium, product-first rather than flashy
  - hierarchy through type, spacing, border, and surface layering rather than
    decorative color
  - one system that can serve both marketplace/editorial browsing and
    dashboard/admin operational work
  - first visual implementation slice should stay in foundation primitives, not
    route pilots
- The first visual-foundation implementation slice is now locked to
  `Button + Input/SearchInput visual foundation calibration`:
  - it is the narrowest shared primitive family that can express the brief
    through type, radius, density, and interaction together
  - it already has Storybook coverage, so review can stay inside primitives
    before any route pilot work starts
  - `Card + Dropdown` remains a later candidate, not the first slice
- That first visual-foundation slice is now landed:
  - `Button`, `Input`, and `SearchInput` now share a calmer control-family
    geometry and interaction treatment
  - semantic `ring` focus, moderate radius, and comfortable density are now the
    first concrete expression of the locked visual brief in code
  - the post-slice review decision is now locked too: stop foundation expansion
    here for this pass, do not open a second primitive slice yet, and move to a
    route-pilot decision from this landed baseline
- Adopt / adapt / avoid summary:
  - adopt Primer's base / semantic / component token split
  - adopt Atlassian's role / emphasis / interaction-state mental model for
    semantic color usage and shared chrome
  - adopt Radix Themes as the model for theme-wide controls such as radius,
    scaling, panel/background treatment, and primitive variant consistency
  - avoid copying any of those systems wholesale or replacing Krukraft's DS
    barrel/API with their names directly
- Current duplication to resolve later, not re-open from scratch:
  - `primary`, `brand`, and parts of `accent` still overlap conceptually in the
    primitive token layer
  - runtime semantic `accent` and colorful named accents are different
    concepts and must stay separate
  - layout helper responsibilities are now tighter after removing the unused
    `PageSection` helper and centralizing page-width selection in
    `Container.tsx`; keep `Container`, `PageContainer`, `PageContent*`, and
    `Sidebar*` inside those explicit boundaries instead of adding new wrappers
  - product-bound DS exports are reused but should not be promoted to
    foundation primitives
- The next locked implementation slice in the Primer/Atlassian/Radix plan is
  `product-bound DS export boundary cleanup`:
  - keep `ResourceCard`, `FileUploadWidget`, `NotificationButton`,
    `PriceBadge`, `PriceLabel`, and `PickerControls` reusable where needed
  - stop treating them as if they were equivalent to foundation primitives or
  generic composed layout helpers
  - keep the slice narrow: docs, barrel expectations, and ownership boundaries
    first; no token rename or broad route refactor is implied
- That slice is now landed:
  - foundation/composed exports remain on `@/design-system`
  - product/workflow-bound exports now have their own surface at
    `@/design-system/product`
  - internal consumers that were using the root DS barrel for those product
    surfaces should now prefer the product barrel directly
- The active visual-foundation plan is now past reference gathering, visual
  direction lock, and the first primitive implementation slice. The next
  mandatory step is no longer another primitive pass; it is deciding whether
  this landed baseline should open a route pilot or end the parent plan.
- That decision is now resolved as a new explicit plan:
  - the active route pilot starts from `/resources`, not from another
    primitive slice
  - the locked discover slice is `listing-mode shell + fail-soft states`
  - the pilot must reuse the landed `Button` / `Input` / `SearchInput`
    baseline and must not reopen DS foundation work implicitly
- That discover pilot slice is now landed on `/resources`:
  - the route-owned listing intro, filter shells, search-context line, and
    fail-soft states now reuse the calmer DS baseline instead of the earlier
    tracking-heavy / brand-heavy route treatments
  - `FilterBar` and `FilterSidebar` now use semantic `ring` focus treatment
    and a shared card-shell hierarchy instead of route-local `primary-500`
    focus classes
  - `SearchRecoveryPanel`, `ResourcesListingUnavailableState`, and the
    matching listing fallbacks were updated in the same slice so loading /
    empty / fail-soft geometry stayed aligned
- Hero support tokens stay isolated from the generic surface/card layer during
  the migration; do not flatten hero roles into default card semantics.
- The active parent plan is now `Krukraft theme refresh plan`.
- The locked theme brief on top of the completed DS/discover baseline is:
  - editorial-minimal: calm, clean, trustworthy, and human before trendy
  - warm/premium through background tone, surface hierarchy, and restrained
    atmosphere rather than saturated brand canvases or poster-like product
    shells
  - one shared type system across marketplace and operational surfaces
  - moderate radius and comfortable density kept as a family, not retuned
    component by component
  - semantic `primary`, `destructive`, and `ring` stay authoritative; brand
    mood should not replace semantic intent
  - stronger brand accents can exist, but should stay supportive and sparse
    rather than becoming the default product surface language
- Theme-plan non-goals:
  - do not reopen token taxonomy or DS boundary work
  - do not silently redesign route families in bulk
  - do not flatten hero/support surfaces into default card semantics
- Theme training rule:
  - do not hardcode new runtime theme values from references alone
  - direction and vocabulary should be trained with the user before a color
    slice is landed
  - `src/design-system/theme-playbook.md` is now the canonical training artifact
    for that posture
  - the `Theme Lab` page inside the live Figma file `Krukraft Design System`
    is now the visual review surface for that training loop
  - the current approved neutral direction is `Paper B`: cleaner and more
    restrained than `Paper A`, quieter and safer than `Paper C`
  - the current approved primary accent is `#4338CA`
  - the current approved support accents are `Rust` and `Sand`; they stay
    support-only and do not replace the primary/action role
  - `src/design-system/foundation-study-checklist.md` is now the dedicated
    checklist artifact for the `Figma foundation first` phase
  - the old `/dev/theme-playbook` route was removed so the review surface is no
    longer tied to the Krukraft app shell
  - that Figma page includes both palette studies and first-pass foundation
    studies for card, button states, input/search states, dropdown/popover
    shell, and section/surface hierarchy
  - palette posture is now approved at the training level
  - the next mandatory step in the theme plan is reviewing those studies as one
    system and deciding whether the evidence is strong enough for a code slice

## Verification Pointers

- Run `npm run figma-map:check` when shared DS component files or reusable Figma
  library components change.
- Run `npm run tokens:audit` when token files, token exports, or token inventory
  wording changes.
- Run `npm run context:check` when DS ownership, handoff expectations, or agent
  context wording changes materially.
