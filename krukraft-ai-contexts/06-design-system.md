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
- Non-trivial Figma-to-code work should now start from structured node
  metadata/JSON plus a written numeric contract for the chosen canonical node
  or variant, not from screenshot interpretation alone.
- When spacing or visual rhythm depends on auto-layout hierarchy, that
  contract should also spell out the DOM sibling structure explicitly instead
  of assuming that correct numbers alone will produce the same layout.
- Token-sensitive utility names that look similar to DS tokens must still be
  checked against computed runtime values; names like `rounded-sm` are not
  authoritative proof of `radius/sm`.
- `docs/figma-numeric-contracts.md` is now the reusable repo-owned template for
  that workflow, seeded first with `NotificationItem`, `SectionHeader`, and
  `EmptyState`, and non-trivial Figma-to-code implementation should refresh
  the relevant contract block there before the task is treated as complete.
- tracked Figma-backed runtime owners now also have a repo-owned enforcement
  path:
  - `npm run figma-contracts:check`
  - `npm run figma-contracts:check:staged`
  - `npm run figma-contracts:check:staged:strict`
  The staged strict variant fails when one of those runtime-owner files changes
  without `docs/figma-numeric-contracts.md` being updated in the same change
  set.
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
- Shared admin table header cells should keep DOM attributes such as
  `data-testid` and `scope` intact so route-level proofs and accessibility
  semantics do not require raw route-owned `<th>` fallbacks.
- `/admin/reviews` now uses that same shared admin-table proof surface, its
  summary metrics no longer rely on `tracking-tight`, and its unavailable-state
  eyebrow/title no longer use tracked text.
- `/admin/orders` now uses that same shared admin-table proof surface, and its
  summary metrics no longer rely on `tracking-tight`.
- `/dashboard/creator/apply` is now the first live creator color-token proof
  route: pending, approved, and rejected panels now use semantic
  warning/success/danger emphasis surfaces, and the rejected feedback rail uses
  the same semantic danger family instead of a route-owned light alert shell.
- `/dashboard/creator/resources/*` is now the next live creator color-token
  proof route: the editor's helper/callout icons now use semantic `primary`
  instead of route-owned brand color, and preview-image validation copy now
  uses semantic destructive text instead of route-owned red utilities.
- `/dashboard/creator/resources/new` also now proves the first live
  publish/readiness feedback slice: `CreatorPublishReadiness` warning/ready
  states and the `CreatorPublishSuccessModal` success indicator both ride
  semantic warning/success families on the real publish flow.
- `/dashboard/creator/profile` now proves the next live creator color-token
  slice too: `CreatorProfileForm` asset-ready statuses ride semantic
  success/warning families, the profile-save success message now uses a
  semantic success surface, and the profile-save error rail now uses the same
  semantic danger surface family as the creator-apply slice.
- The live dashboard settings loading shell now reuses the shared dashboard
  page-header intro contract too; remaining badge-first dashboard intro demos
  are preview-only exceptions rather than live route drift.
- `LoadingSkeleton` is the canonical shared skeleton primitive; runtime loading
  shells should stay neutral and structurally close to the resolved UI.
- `Avatar` now has canonical Figma coverage on `DS Primitives` too:
  the live source set documents the shared `24 / 32 / 40 / 56` ladder plus
  image/name/email/explicit-initials/anonymous fallback states, while
  `28 / 36 / 72 / 104` still remain runtime-owned posture extensions, all
  source variants now share the same stroked circular shell posture, and the
  fallback shell keeps one explicit Figma token gap around gradient/type scale.
- `Switch` now has canonical Figma coverage on `DS Primitives` too:
  the live state set documents the current runtime `46×24` track, `20×20`
  thumb, and checked/unchecked + disabled visual states while keeping labels,
  helper copy, and row shells route-owned composition instead of promoting them
  into the primitive contract.
- `Modal` now has canonical Figma coverage on `DS Primitives` too:
  the live boards document the shared runtime `384 / 448 / 512 / 576` width
  ladder, centered surface shell, close affordance, and header/body/footer
  rail structure without promoting route-owned form geometry into the
  primitive contract. The current Figma-only gap is explicit instead of silent:
  divider rails still bind to `neutral/line` because the canonical file does
  not yet expose a semantic `border/subtle` variable, while overlay tint,
  portal motion, and button semantics stay runtime-owned. The 2026-05-01
  re-audit also confirms a user-led visual refresh on the light/dark boards did
  not widen the primitive contract: the live dark size set now sits under the
  refreshed ids, and the visible confirm/cancel pair remains illustrative shell
  proof rather than primitive-owned button semantics.
- `LoadingSkeleton` now has canonical Figma coverage on `DS Primitives` too:
  the live boards document only the shell-level primitive plus a bounded
  `line | bar | circle | pill` posture set. Content-block, table-row, hero,
  and detail loading layouts remain route-owned composition instead of shared
  primitive variants. The current Figma-only gap is explicit instead of silent:
  the canonical file still lacks a dedicated semantic `bg/muted` variable, so
  the light board binds shell fills to `bg/inset` while the dark board binds
  them to `border/default` to mirror the current runtime aliasing.
- `EmptyState` now has canonical Figma coverage on `DS Components` too:
  the live boards document the bounded composed shell only through a paired
  `default | minimal | compact-admin` source set. The shared contract is the
  centered stack rhythm, dashed rounded container posture, and the
  `icon -> title -> description -> action` slot order; business copy, final
  CTA semantics, and route-owned illustrations remain outside the composed
  contract. The new `compact-admin` variant promotes the tighter inline empty
  posture from the creator-side `Image links` branch without pulling the full
  editor workflow into `EmptyState`. Icon examples now reuse shared
  `Phosphor light` instances too, while the action lane reuses a shared
  `Button size="sm" variant="soft"` example with a generic `Soft action`
  label.
  The current
  Figma-only gap is explicit instead of silent here as well: runtime uses
  `border-border-subtle`, but canonical Figma still lacks a semantic
  `border/subtle` variable, so the dashed rail currently binds to
  `border/default`.
- `SectionHeader` now has canonical Figma coverage on `DS Components` too:
  the live boards document the bounded intro-shell contract through a paired
  `default | centered | with-actions | minimal` source set. The shared
  contract is eyebrow, title, description, alignment, and an optional trailing
  actions slot; route-owned backdrops, page-width choices, and live CTA
  semantics remain outside the composed contract. The eyebrow examples now use
  the shared `badge` size contract (`12/16`) and runtime `SectionHeader`
  mirrors that through `text-badge`, so the context label steps back from the
  title without inventing a new typography family. The `with-actions` proof now
  reuses shared `Button size="md"` examples with generic `Quiet action` /
  `Primary action` labels, so the board stays DS-backed without inventing
  route-specific CTA semantics.
- `Button` runtime now mirrors the canonical Figma tone family directly:
  `primary | quiet | soft | tertiary` are live in `Button.tsx`, while `ghost`
  remains only as a compatibility alias. The adopted `soft` variant follows
  the Figma state contract directly instead of inventing a new runtime
  interpretation: `bg/surface + border/default + fg/default` at rest,
  `bg/inset` on hover/pressed, and `fg/subtle` on disabled.
  `quiet` now keeps its own `border/quiet` semantic stroke derived from
  `primary/lift` instead of borrowing the neutral `border/default` rail, and
  runtime mirrors that through `border-quiet`. Shared button focus now uses a
  `2px` semantic `focus/ring` stroke in both Figma and runtime instead of
  leaving focus states on their quieter rest rails.
  The latest Figma-only follow-up also closes the old tertiary-icon drift:
  `Button / Icon` now keeps the `tertiary` glyph fill and stroke on the same
  neutral token as the label in both light and dark boards instead of leaving
  a stale local accent on the icon rail.
  The older size gap is closed too: runtime now uses the same `sm=36` ladder
  as the canonical Figma board.
- `RevealImage` is the shared image primitive for already-sized containers; the
  surrounding container should own placeholder/background treatment. The
  2026-04-30 heavier-primitive follow-up audit now locks one more boundary
  explicitly: `RevealImage` should stay deferred from canonical Figma coverage
  for now because runtime callers still own the visible shell, crop mode,
  overlay tone, badges, zoom affordances, and other editorial/product-specific
  decoration around the image itself.
- `ToastProvider` should stay deferred from canonical Figma coverage too. The
  shared contract is provider behavior more than a static visual shell:
  queueing, success-dedupe, auto-dismiss timing, persistent warning/error
  defaults, exit choreography, and mount ownership matter more than capturing a
  single toast card snapshot on `DS Primitives`.
- `Badge` and `Chip` are now separate DS contracts:
  - `Badge` stays non-interactive and semantic/status-oriented
  - `Chip` is reserved for interactive filter/removable/token behavior
- Shared interactive controls should default to one focus-visible contract
  across Figma and runtime:
  `focus/ring` at `2px`.
- Do not substitute nearby `action/*`, `state/*`, or product-local tones for
  focus treatment unless a canonical board explicitly documents that exception.
- Canonical Figma coverage now exists for both sides of that split:
  `Badge / Foundations / Light|Dark` remains the bounded semantic-label source,
  while `Chip / Foundations / Light|Dark` now proves the interactive token
  side and is mirrored by the shared runtime `src/design-system/primitives/Chip.tsx`
  primitive.
- The current `Chip / Foundations` slice stays intentionally narrow:
  it proves `Navigation chip`, `Filter chip`, and `Removable chip` rows only,
  with selected/active states sharing one selected token family across rows
  instead of inventing separate active tones per chip type.
- Runtime now aliases that selected family through
  `--state-selected-fill` and `--state-selected-stroke`, while active chip
  labels stay on `fg/default`, so chip-active UI does not drift back to raw
  `primary/*` utilities.
- Runtime adoption now routes marketplace category/search chips, dashboard
  library filters, admin removable filters and analytics presets, and
  resource-detail token links through that shared primitive.
- The current contract intentionally keeps one `40px` chip family only;
  compact admin pills should normalize into that shell instead of becoming a
  second canonical chip-size ladder.
- `PillLink` is now the next narrow DS slice after `Chip`, and canonical
  Figma coverage exists for it too: `DS Primitives` now carries paired
  `PillLink / Foundations / Light` (`1842:392`) and
  `PillLink / Foundations / Dark` (`1842:450`) boards.
- The current foundations slice stays intentionally narrow:
  it proves `section-header pill-link` only, with `default`, `hover`,
  `focus-visible`, and `disabled` states on the compact `32px` shell.
- The current canonical source sets now live at light `1842:408` and dark
  `1842:466`, with a `View all` label + shared `ArrowRight` icon instance on
  the same `32px` shell. The current board geometry also follows the standard
  foundations page rhythm now: usage card `24` padding / `8` gap, variants
  card `32` padding / `24` gap, and source-set shell `12` padding / `12` gap.
  Current token bindings are explicit:
  `default = action/primary`, `hover = bg/inset + fg/default`,
  `focus-visible = focus/ring 2px + action/primary`, and
  `disabled = fg/subtle`.
- The shell contract is explicitly browse-link specific rather than chip-like:
  `height=32`, `padding = 4 / 12 / 4 / 16`, `label-icon gap = 8`,
  `icon = 14`, and the arrow remains a DS source instance.
- Use `src/design-system/primitives/PillLink.tsx` only for section-header
  browse actions such as `View all` and `Browse everything`. The current
  runtime owners are `ResourcesPageContent` and
  `ResourcesDiscoverPersonalizedSection`, while empty-state pill links,
  card-footer text CTAs, and read-only tokens stay outside this primitive
  until a separate family decision is made.
- `EmptyStatePillLink` is now the next narrow DS slice after `PillLink`, and
  canonical Figma coverage exists for it too: `DS Primitives` now carries
  paired `EmptyStatePillLink / Foundations / Light` (`1854:416`) and
  `EmptyStatePillLink / Foundations / Dark` (`1854:458`) boards.
- The current foundations slice stays intentionally narrow:
  it proves one bordered `40px` empty-state shell only, with `default`,
  `hover`, `focus-visible`, and `disabled` states.
- The current canonical source sets now live at light `1854:432` and dark
  `1854:474`, with `Explore all resources` as the bounded label, no trailing
  icon, and shell geometry locked to `padding 8/16`, `height 40`, and
  `border/default` rest posture with `focus/ring 2px` on focus.
- Use `src/design-system/primitives/EmptyStatePillLink.tsx` only for
  empty-state secondary actions such as `Clear filters` and
  `Explore all resources`. The current runtime owners are `ResourceGrid` and
  `categories/[slug]`, while section-header browse links stay on `PillLink`
  and retry/error pairs stay on `Button`.
- `ReadOnlyToken` is now the next canonical slice after
  `EmptyStatePillLink`: it covers read-only content metadata tokens such as
  `Test Prep learners` and `Self-paced revision`.
- The current canonical foundations boards now live at light `1863:416` and
  dark `1863:442`, with `ReadOnlyToken / Content metadata / Source` proving
  the bounded `34px` shell (`space/12` currently bound on all four sides,
  `bg/inset`, `border/default`, `type/label` semibold text, no icon).
- Current runtime adoption still starts on the resource-detail identity-target
  lane. Keep this family intentionally separate from badges, chips,
  pill-links, and creator-form context labels until those postures are audited
  on their own terms.
- The 2026-05-03 board re-audit closes the Figma-side binding debt for this
  slice: light/dark source nodes now bind shell spacing together with the
  existing color and type variables. Any remaining gap is runtime parity, not
  missing Figma bindings.
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
  - the canonical Figma training surface is now the `DS Foundations` page
    inside `Krukraft Theme Lab Source-of-Truth`
  - the current approved neutral direction is a softened `Paper B`-derived
    cool-paper light set promoted into the canonical variables:
    `shell #FCFBFB`, `surface #F9F7F8`, `canvas #FEFDFC`, `inset #F1EFEE`,
    `line #E5E2E4`
  - the current approved dark companion now reads:
    `canvas #111019`, `shell #1B1820`, `surface #19171D`, `inset #282330`,
    `line #322D39`
  - the current approved primary accent is `#5144ED`
  - the current approved support accents are `Rust #DB3A1C` and
    `Sand #E59C46`; they stay support-only and do not replace the
    primary/action role
  - `src/app/globals.css` should keep mirroring the current `themeColors`
    values in `src/design-system/tokens/colors.ts`; theme CSS is not allowed to
    lag behind the canonical token file after a Figma-token recalibration
  - the Tokens Studio exporter now supports CSS alias values like `var(--inset)`
    and `var(--line)` when building theme tokens, so generated token artifacts
    should no longer be blocked by harmless semantic aliases in `globals.css`
  - `src/design-system/foundation-study-checklist.md` is now the dedicated
    checklist artifact for the `Figma foundation first` phase
  - the old `/dev/theme-playbook` route was removed so the review surface is no
    longer tied to the Krukraft app shell
  - that Figma page includes both palette studies and first-pass foundation
    studies for card, button states, input/search states, dropdown/popover
    shell, and section/surface hierarchy
  - `Dropdown / Foundations / Light` and `Dropdown / Foundations / Dark` are
    now landed as verified study boards in the canonical file; they are
    foundation evidence for popover shell posture, not a final reusable
    component mapping yet
  - the 2026-04-28 shell re-audit tightened the `Dropdown` truth too: both
    light/dark study boards stay fully bound for all `23/23` text nodes across
    font family, font size, line height, and text fill, and all painted
    fills/strokes are token-bound; the remaining Figma-only debt is just the
    intentional local radius on the `context scene` / `row calibration scene`
    containers (`20`) plus the default/unselected `menu row` shells (`12`)
  - the 2026-04-28 shell re-audit tightened the `Surface` truth too: both
    light/dark boards stay fully bound for all `26/26` text nodes across font
    family, font size, line height, and text fill, and the live
    `Surface / Variant / Source` plus hierarchy nodes keep all painted
    fills/strokes token-bound
  - the remaining live `Surface` debt is now narrow:
    - the dark source/hierarchy ids are `627:633` and `627:646`
    - the hierarchy demo now mirrors the source-set shell ladder directly:
      `panel = bg/surface`, `subtle = bg/canvas`, `muted = bg/inset`, and the
      inner surfaces now all sit on `16px` radius too, while the broader
      `shell zone` now binds `radius/lg (24px)` instead of keeping the older
      local `20` radius
    - the board copy itself is now partially stale because it still describes a
      broader token-gap story than the live subtle/muted/popover/support nodes
      actually exhibit
  - text across `DS Foundations` now binds to the `font/family/base` variable
    by default; four glyph-only nodes remain intentional exceptions on the page
    because they still rely on symbol-font characters such as carets and
    chevrons
  - `font/family/base` is now set to `IBM Plex Sans Thai` in the canonical
    Figma typography primitives; representative `DS Foundations` screenshots
    were rechecked after the family switch and the current typography/dropdown
    boards stayed stable without obvious line-wrap or layout regressions
  - runtime typography now follows that same family too: shared
    `heading/body/ui` tokens load `IBM Plex Sans Thai` with only two weights
    (`400` Regular for reading and `600` SemiBold for hierarchy) so browser
    text metrics stop drifting from the canonical Figma typography family
  - the control-size contract is now explicit too:
    - typography size/line-height stays in typography variables
    - `Button` size stays a component variant ladder (`xs`, `sm`, `md`, `lg`,
      `icon`) with `comfortable -> md` and `compact -> sm`
    - `Input` now defaults to `md` at runtime and keeps `field` as the taller
      explicit shell, and the shared `Input` / default `SearchInput` runtime
      API is now narrowed to that same `md + field` story directly
    - `SearchInput variant=\"default\"` now matches the shared pill-shell
      family and `md` default branch too, while the route-owned `hero` variant
      remains the only intentional larger exception
  - the canonical Figma foundations now match that control-size contract more
    closely too:
    - `Button / Size` light/dark were rebuilt to include explicit
      `xs|sm|md|lg` coverage
    - the latest `Button / Foundations` re-audit now closes both stale caveats
      from that older note: the light/dark header, usage, states, size, icon,
      and recipe cards all stay semantic-token-bound at the section-shell level,
      there is no remaining non-zero local radius debt in the live
      `Button / State` / `Button / Size` / `Button / Icon` component sets, and
      the old dark subtitle line that said `light recipe` is gone
    - that same button re-audit originally exposed a live adoption gap:
      canonical Figma replaced airy `ghost` with text-first neutral
      `tertiary` and changed `quiet` / `tertiary` / `soft` behavior by state
      more explicitly than the earlier runtime `Button.tsx` recipe did
    - the 2026-04-28 follow-up study has now been folded back into the
      canonical Figma `Button / Foundations` boards as a bounded neutral
      `soft` tone that now sits beside text-first `tertiary`, plus a
      Figma-first `sm=36` size step
    - that follow-up is now landed in runtime too:
      - runtime now exposes `primary | quiet | soft | tertiary`
      - `ghost` remains only as a compatibility alias
      - runtime now uses the same `xs=32 / sm=36 / md=40 / lg=48` ladder for
        the shared primitive family
      - the new button decision rule is now explicit too: table row actions,
        pagination items, and panel CTAs should stay recipes first, not new
        family members; evaluate them against `outline` and the Figma-first
        `soft` posture before inventing another top-level variant
      - the canonical Figma file now locks the `DataPanelTable` flavor of
        `row action` and `pagination item` to a rounded-rect
        `radius/sm (8px)` recipe shape instead of the pill geometry used by
        the core family
      - `Button States` now carries a dedicated `RowAction / State`
        companion sourced from the live `Edit / Open` posture, and the
        `Button recipes` row-action card now shows both the live
        `Edit / Open` example row and that same `default|hover|focus|pressed|disabled`
        row-action state strip so the recipe posture and behavior stay visible
        together, while `Pagination item` mirrors the same
        rounded-rect `radius/sm (8px)` shape and `Panel CTA` now follows that same rounded-
        rect table posture on the bounded-neutral `soft` tone instead of the
        older primary-pill candidate
      - the first runtime adoption slice is now in code too, but still kept
        narrow on purpose:
        - `RowActionButton size="md"` mirrors the 40px rounded-rect table
          action recipe while compact `sm` stays available for smaller admin
          surfaces, and the helper now follows the same
          `default|hover|focus|pressed|disabled` ladder as Figma instead of
          piggybacking on the older generic outline hover treatment
      - `PaginationButton size="md"` mirrors the matching page-item recipe,
        now supports `asChild`, and is live in the dashboard creator
        resources pagination flow
      - dashboard creator-resources `DataPanelTable` is the first live
        route-family consumer; broader admin rollout is still an active
        follow-up decision, not a silent global button rewrite
      - the first admin rollout proof now narrows that follow-up decision:
        - `/admin/users` adopts `RowActionButton size="md"` because its row
          actions behave like a spaced table-action column
        - `/admin/audit` adopts `TablePagination buttonSize="md"` because its
          pager behaves like a standalone table footer
        - `/admin/tags` intentionally stays on compact `sm` row actions
          because its save/cancel/delete clusters are denser inline controls
      - the next narrow follow-up rollout keeps the same opt-in rule and
        extends the simple table-action posture only where density still
        supports it:
        - `/admin/categories`
        - `/admin/reviews`
        - `/admin/resources/trash`
        - `/admin/resources/[id]/versions`
        - the versions route now also uses the row-action
          `default / muted` ladder directly instead of keeping older
          `quiet / tertiary` button overrides
        all now opt into `RowActionButton size="md"` after route proof
      - dense holdouts still remain out of scope on purpose:
        - `/admin/tags`
        - `/admin/resources` main table
        - creator-side status/action groups
      - the dense-holdout lockdown follow-up now turns those remaining
        exceptions into explicit contract instead of leaving them on shared
        defaults:
        - `/admin/resources` main table now passes `size="sm"` on every row
          action and overflow trigger
        - `/admin/tags` now passes `size="sm"` on every inline
          save/cancel/delete/edit action
        - `CreatorResourceStatusButton` now passes `size="sm"` too, even
          though no live route mount was found during the rollout audit
      - that same audit found the real runtime blast radius is concentrated in
        `dashboard` (~60 `size=\"sm\"` button usages) and `admin` (~34), while
        live `density=\"compact\"` usage is still narrow (`public-resources`
        3, `creator` 1)
    - the next narrow foundations follow-up is now landed too:
      - `DS Primitives` carries paired `Icon / Foundations / Light` and
        `Icon / Foundations / Dark` usage boards
      - the icon slice intentionally locks only the shared adapter contract
        rather than creating a new glyph catalog or standalone `Icon` primitive
      - runtime truth is already anchored in `src/lib/icons.tsx`, so the board
        documents that same contract explicitly:
        - source family: `Phosphor`
        - default weight: `light`
        - shared size ladder: `14 / 16 / 20 / 24`
        - semantic tones:
          `fg/default`, `fg/muted`, `fg/subtle`, `fg/on-fill-dark`,
          `fg/on-fill-light`
        - bounded contexts:
          `dense row action`, `default UI`, `support action`,
          `section support`
      - glyph choice stays product-owned; the canonical file proves usage rules
        only and should not be expanded into a copied icon catalog from the
        external Phosphor library file
      - the first runtime cleanup pass after that foundations slice is now
        narrowed too: shared upload/picker/dropzone surfaces use semantic
        `primary` emphasis instead of direct `brand-*` aliases when they need
        stronger icon or border emphasis
      - the next product-bound follow-up after that shared pass is narrow too:
        admin resource picker surfaces (`PreviewImageSortableList`,
        `UserSearchSelect`) now use semantic `primary`/`ring` emphasis instead
        of direct `brand-*` aliases
      - the next marketplace follow-up after that is narrow too:
        `HeroSearch` overlay affordances now use semantic `primary` emphasis
        for browse icons, fallback file glyphs, and bottom CTA text instead of
        direct `brand-*` aliases
      - the next admin status-tone follow-up after that is narrow too:
        `NotificationItem` now maps `success | info | warning | error`
        explicitly to semantic status tokens instead of mixing
        `emerald/red/primary` classes or silently collapsing `warning` into
        the `info` posture
      - that notification family now also has a non-production runtime proof
        surface: `/dev/notifications` mounts the shared notification stack and
        bell with bounded trigger buttons so browser verification does not need
        to mutate real admin records, and
        `?scenario=success|info|warning|error|all` can autofire a proof state
        on load when click automation is inconvenient
      - canonical Figma coverage now mirrors only the bounded item shell too:
        `DS Components` carries paired `NotificationItem / Foundations / Light`
        (`1403:74`) and `NotificationItem / Foundations / Dark` (`1403:99`)
        boards plus light/dark `NotificationItem / Variant / Source` sets
        (`1409:160`, `1435:2289`). The board proves wrapper posture,
        `success | info | warning | error`, optional inline action labels, and
        the dismiss affordance only. The refined compact shell is now the
        active contract on both sides: `325px` compact width, shared
        `text-title-sm` (`16/24`) title copy, `14/20` secondary copy plus
        inline action text, `8px` shell radius, `32px` status wrappers with
        `20px` Phosphor-light glyphs, and the compact inline `20px` dismiss
        affordance instead of the older absolute close button. Bell-dropdown
        behavior, unread counts, stack order, and queue timing remain
        runtime-owned. The canonical file now also carries dedicated
        `support/info/soft` and `support/info/base` variables, so the info
        wrapper and glyph posture no longer borrow the primary family, and the
        compact title rung should bind through dedicated `type/title-sm/size` +
        `type/title-sm/line` variables instead of local `16/24` overrides
      - the next bounded product-export follow-up is now live too:
        `DS Components` carries paired `NotificationButton / Foundations /
        Light` (`1489:194`) and `NotificationButton / Foundations / Dark`
        (`1489:284`) boards plus light/dark
        `NotificationButton / Variant / Source` sets (`1496:72`, `1496:143`).
        The board owns only the compact `40px` bell shell, the `20px`
        Phosphor-light bell glyph, and the sibling unread-badge posture for
        `count=0|3|9+`; bell dropdown behavior, unread transitions, and
        notification-row rendering remain runtime-owned. The current token gaps
        stay explicit instead of silent: runtime still uses
        `border-border-strong` and a hardcoded unread red, while canonical
        Figma currently binds the shell to `border/default` and the badge to
        `state/danger-fill`
      - the next bounded admin-picker follow-up is now live as well:
        `DS Components` carries paired `PickerControls / Foundations / Light`
        (`1498:194`) and `PickerControls / Foundations / Dark` (`1498:257`)
        boards. The board now proves the bounded admin `images branch` first,
        then the shared action-row posture, compact preview/media shells, and
        `default|active|reject` dropzone states that
        `src/design-system/components/PickerControls.tsx` actually exports;
        the nested `Image links` editor is shown there as context only, while
        upload progress, selected-file metadata, and async workflow messaging
        remain runtime-owned. The current token gaps stay explicit instead of
        silent: runtime still uses stronger border aliases plus local
        danger/red emphasis in some picker states, while canonical Figma
        currently stays on `border/default`, `primary/base`, and
        `state/danger-*` bindings
      - `FileUploadWidget` now has canonical Figma coverage too:
        `DS Components` carries paired `FileUploadWidget / Foundations /
        Light` (`1558:270`) and `FileUploadWidget / Foundations / Dark`
        (`1558:295`) boards. The current board proves one narrow bounded
        upload-branch shell only: shared dropzone posture, helper-copy rhythm,
        and disabled CTA treatment for the buyer-file branch. Upload progress,
        validation, upload-result states, and selected-file metadata stay
        runtime-owned and remain outside the canonical board for now
      - the creator delivery-source control now has canonical Figma coverage
        too: `DS Components` carries paired
        `Delivery method toggle / Foundations / Light` (`1562:2`) and
        `Delivery method toggle / Foundations / Dark` (`1562:25`) boards.
        The board stays intentionally narrow and proves only the segmented
        shell, helper-copy pairing, and active/inactive posture of the
        buyer-file source toggle. Upload/link branches plus validation/file
        workflow remain route-owned
    - `Input / State`, `SearchInput / State`, `Input / Size`, and
      `SearchInput / Size` were re-audited again on 2026-05-03 and the
      canonical Figma shell now moves onto the newer Select-style contract:
      `radius/pill`, `paddingLeft=space/24`, `paddingRight=space/24`,
      `bg/inset` for hover/focus, and `radius/xs + space/12` on the
      wrapper/state-set structure while reducing the canonical size story to
      `md + field`
    - the bounded runtime `Input` slice now matches that newer shell too:
      `Input.tsx` uses pill radius, `space/24` horizontal padding, `space-y-2`
      shell-to-caption rhythm, and `md` as the shared default shell
    - shared `Input` adoption is widened on the admin resource editor too:
      standard title, price, preview-URL, and external-file URL fields now
      route through the primitive instead of local `input-base` shells
    - shared `SearchInput` adoption is widened on `/dashboard/library` too: the
      toolbar search now routes through the primitive instead of `Input +` a
      local search-icon composition
    - the canonical search state cards now also carry one bounded `Loading
      lane` mockup in both modes: it proves the trailing spinner slot and
      `fg/subtle` tone on the shared shell, and that proof now uses the
      `20px` spinner posture chosen in the live Figma board while the actual
      motion remains runtime-owned
    - that Figma-side follow-up closes the earlier wrapper-radius debt too;
      the light/dark component-set wrappers no longer keep local
      `cornerRadius=5`
    - the old board-level `Clear` action typography debt is closed too; both
      light/dark labels now bind DS body size + line vars instead of staying
      local
    - runtime parity has not landed in the same slice; the current shared
      `Input` / `SearchInput` primitives still trail the newer pill shell until
      a dedicated runtime follow-up updates code to match
    - the first runtime-normalization follow-up after that parity slice is now
      live too: the shared `SearchInput` default start/loading adornments render
      through full-height wrappers, which fixes the visible top-left icon drift
      on `/dashboard/library` without reopening the route-owned `hero` branch
    - the dashboard topbar search no longer keeps a local `44px` height
      exception; dashboard/admin shared search now resolves to the `md`
      `40px / 8px` rung by default instead of the old `56px` field posture
    - admin global search plus the main users/resources/activity/ranking search
      mounts now use the same `SearchInput` primitive instead of route-local
      `Input + icon` compositions
    - dashboard user-route intros now normalize through the shared
      `DashboardRouteIntro` / `DashboardPageHeader` eyebrow-text pattern, with
      matching header CTAs promoted back to `Button size="md"` by default
    - creator workspace now uses that same intro authority too, so the live
      route and its loading companion no longer keep a separate badge-first
      header shell
    - creator resource-form preview labels now follow the same no-tracking
      rule, and the form's required/highlight emphasis now leans on semantic
      `danger` / `primary` tokens instead of route-local red/blue/indigo
      utilities
    - creator settings micro-labels now follow that no-tracking rule too on
      the visible `/dashboard/settings` route; the `Security` label no longer
      acts as a tracked uppercase holdout
    - `/admin/creators` now uses the shared admin table header contract
      instead of route-owned uppercase/tracking-heavy `<th>` copies, and its
      summary metrics no longer rely on `tracking-tight`
    - shared dashboard/admin product labels now stop treating tracking as the
      baseline too: `DashboardPageHeader`, `AdminPageHeader`, and
      `DashboardSidebar` labels all render with normal letter-spacing, so any
      remaining tracked labels in those route families should be treated as
      route-owned cleanup inventory instead of design-system defaults
    - the first adjacent control-mapping follow-up now exists too:
      - `Select / Foundations / Light` (`994:244`) and
        `Select / Foundations / Dark` (`994:421`) are now live in the canonical
        file
      - the verified reusable nodes are `Select / State`
        (`994:342`, `994:519`) and `Select / Size` (`994:366`, `994:543`)
      - the canonical `Select` contract intentionally reuses the shared field
        shell posture (pill radius, shared height ladder, helper/error copy
        below the shell) and only layers on the explicit caret affordance plus
        the deeper `paddingLeft=24` field start
      - the 2026-05-03 Figma binding pass closes the exact-match radius debt on
        those boards: usage cards and component-set cards now bind
        `radius/lg`, and field shells across the state + size ladders now bind
        `radius/pill`
      - the follow-up nearest-token binding pass closes the remaining
        wrapper/set drift too: light/dark `Select / State` and `Select / Size`
        now bind `radius/xs`, and the light/dark `Select / State` sets now
        bind `space/12` in place of the prior local `11px` gap
      - the latest padding pass now binds `paddingLeft=space/24` across both
        light/dark state + size ladders
      - the latest state-fill pass now binds both light/dark `hover` and
        `focus` shells to `bg/inset`
      - the latest caret pass now binds every `CaretDown` instance on the
        light/dark boards and source sets to `fg/subtle`
      - the latest size cleanup narrows the canonical `Select / Size` slice
        down to the two live sizes only: `md` as the shared default and
        `field` as the taller editor-grade shell
      - the shared runtime parity slice is now landed: `Select.tsx` matches
        the pill radius, `paddingLeft=24`, and inset hover/focus fill from the
        current foundations source
      - the shared runtime caret parity is now landed too:
        - `Select.tsx` renders a real sibling `ChevronDown` overlay instead of
          the older hardcoded CSS background arrow
        - the runtime caret now stays on `fg/subtle` to mirror the canonical
          Figma source
      - the runtime size-policy cleanup is now landed too:
        - shared `Select` defaults to `md`
        - explicit `field` is now reserved for editor-grade forms such as
          admin/creator resource authoring
        - admin filters, settings rows, profile controls, and low-risk toolbar
          filters now fall back to that shared default `md` shell
      - `Textarea / Foundations / Light` (`1019:312`) and
        `Textarea / Foundations / Dark` (`1019:433`) are now live too
      - the verified reusable nodes are `Textarea / State`
        (`1019:386`, `1019:507`)
      - the canonical `Textarea` contract keeps the same quiet field-shell
        target and helper/error posture, but leaves rows, counters, max
        length, and resize behavior route-owned instead of inventing a size
        ladder
    - the first runtime parity slice is now live too:
      - `Select.tsx` follows the canonical pill shell at runtime
      - `Textarea.tsx` keeps the same `8px` target without widening
          route-owned rows / counter / resize behavior
      - `/admin/settings` is the first proved route family because it mounts
          `Input`, `Select`, and `Textarea` together without product-owned
          search overrides
      - `/admin/resources` is now the first widened follow-up family: shared
        `Select` shells cover the resource form, listing filters, and
        move-category modal, while the bulk-upload textarea keeps the same
        `8px` shell target and limits its local overrides to the JSON-editor
        treatment
      - the next low-risk widened follow-up is now the admin filter bucket:
        `/admin/activity`, `/admin/audit`, and
        `/admin/analytics/ranking` all keep the same shared `Select`
        geometry on select-only filter surfaces without reopening creator forms
      - the first creator-owned widened follow-up is now
        `/dashboard/creator/profile`: the status `Select` now follows the
        shared default `md` shell there, while the creator bio keeps the
        shared `Textarea` shell and leaves only `min-height` plus the
        character count as route-owned behavior
      - the next creator-owned widened slice is now the metadata zone of
        `/dashboard/creator/resources/*`: the edit-only `status` select plus
        the shared `type` / `category` selects now keep the explicit `field`
        shell there, and the main `description` textarea stays on the shared
        multiline shell across both new and edit routes
      - the delivery/previews linked URL follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit keep the preview image URL
        rows plus the external file URL editor on the same shared
        `48px / pill` `Input` shell
      - the bulk preview parser follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit prove that the bulk
        preview textarea already sits on the shared `Textarea` shell, while
        parsing, validation, apply-state, and cover-order side effects stay
        route-owned composite behavior
      - the remaining delivery/upload zone stays deferred after that:
        `FileUploadWidget` plus the delivery-source toggle remain
        product-owned delivery controls outside the shared field-shell
        contract, even though both now have bounded canonical Figma boards for
        their narrow shell-level contracts
    - `Input / Size` and `SearchInput / Size` light/dark now exist as explicit
      component sets for the shared field ladder
    - runtime code still carries an older larger comfortable-radius branch for
      field shells, so the live canonical Figma file should be treated as the
      approved base until the repo adopts that change
  - runtime adoption has started too:
    - the default `SearchInput` branch now resolves `size` / `density` through
      the same field recipe as `Input`
    - the 2026-04-29 runtime parity slice now makes that default branch honor
      `radius/sm (8px)` directly in code
    - the first live proof family is `/dashboard/library`:
      - the library toolbar search now proves the shared `40px / 8px` field
        shell
      - the dashboard topbar search now rides that same `40px / 8px` shared
        contract instead of a route-local height override
      - the dashboard topbar clear action is now proved after hydration too:
        the clear button appears, keeps `8px` radius, and clears the local
        query value
    - public `/resources` search remains a route-owned product override
      (`40px` tall, pill geometry) and should not be misread as a failure of
      the shared field-shell adoption slice
    - the residual field-shell follow-up now closes the last shared runtime gap
      too: `Input.tsx` enforces the same `radius/sm (8px)` shell at runtime,
      with `/admin/users` as the first proof route
    - `SearchInput variant=\"hero\"` remains the one intentional exception
      branch, while `loading`, `clear`, and `submitButton` now sit on top of
      the shared default-field shell instead of a separate hardcoded search box
  - new canonical Figma work should now bind available tokens immediately by
    default; if a new node still needs a local override, that should be treated
    as an explicit token gap or trial condition, not as silent final-state
    styling
  - palette posture is now approved at the training level
  - the canonical Figma file now also carries a distinct `neutral/surface`
    primitive and a remapped `bg/surface` semantic alias; runtime token files
    still need a separate repo-side pass if code should adopt that new neutral
    value too
  - the canonical Figma radius collection now also includes `radius/xs = 4px`
    and the `Spacing + Radius / Primitives` board mirrors that addition; repo
    runtime token files still do not expose `radius/xs`, so this is currently a
    Figma-first token addition rather than a fully adopted code/runtime token
  - the shared radius scale now also includes `radius/sm+ = 12px` between
    `radius/sm` and `radius/md`; this rung is mirrored in repo runtime tokens
    without redefining the existing `sm/md/lg/xl` ladder
  - a 2026-04-28 foundations re-audit of `Typography`, `Color Primitives`, and
    `Spacing + Radius / Primitives` corrected an earlier false-positive radius
    reading too:
    - all five audited boards stay fully bound for text, fills, and strokes
    - their radius bindings are also intact, but many of those bindings are
      expressed as per-corner variables (`topLeftRadius/...`) instead of a
      single `cornerRadius` binding, so radius audits have to treat either form
      as valid token binding
    - the live `Color / Primitives` collection now counts `26` variables, not
      `20`, because the canonical file now includes `support/success/*` and
      `support/warning/*` `base / dust / soft` families in the primitive
      collection itself
  - the tested light palette from `Theme Lab` frame `464:545` is now promoted
    into the live Figma primitive variables for `primary`, `Rust`, `Sand`,
    `neutral/*`, and `neutral/ink*`; dark-mode values remain unchanged
  - the tested dark palette from `Theme Lab` frame `477:479` is now promoted
    into the live Figma primitive variables for `primary`, `Rust`, `Sand`,
    `neutral/*`, and `neutral/ink*`; the canonical dark primitives board now
    mirrors those promoted values in both fills and displayed hex labels
  - `Surface` is now landed in the canonical file through `Surface /
    Foundations / Light` (`573:143`) and `Surface / Foundations / Dark`
    (`573:182`), each with a `Surface / Variant / Source` block plus a paired
    hierarchy card for shell/subtle/muted posture
  - `Surface` is not full token parity yet; the current Figma-first token gaps
    are explicit and narrow: no semantic `border/subtle`, no semantic
    `bg-muted`, no `radius/12` token, and no `space/20` token
  - `Card` now has its first repo-side adoption slice too: runtime
    `src/design-system/primitives/Card.tsx` now renders the root shell through
    `surface` and the footer through `inset`, matching the current Figma base
    more directly
  - runtime `bg-card` semantics now follow that same base: `card` resolves to
    the `surface` layer, while shared chrome that should stay on the calmer
    shell layer now has to choose `bg-shell` explicitly instead of inheriting
    older `card = shell/inset` behavior
  - a 2026-04-28 runtime follow-up audit of `bg-card` consumers confirmed that
    the first material nested-surface holdouts after that semantic shift lived
    in the creator editor family, not in the public `/resources` shell itself:
    creator preview placeholders, delivery-source segmented controls, linked
    file/icon chips, and profile/banner preview wrappers now opt into
    `bg-shell` explicitly so they remain visually subordinate inside surrounding
    `bg-card`/`surface` sections
  - the same follow-up audit kept public `/resources`,
    `/resources/[slug]`, and `/creators/[slug]` on the `surface` posture and
    proved the creator editor route family at runtime through the local
    `creator-editor-refresh-shell` browser probe once the local DB was brought
    back up; no additional public-route shell remap was required in that slice
  - a second 2026-04-28 follow-up audit of `admin resources` confirmed the
    same split more narrowly:
    - table/listing shells (`DataTable`, `TableToolbar`, resource rows, modal
      shells) remain valid `surface` consumers under `bg-card`
    - editor-only subordinate shells now opt out explicitly: the file-upload
      subpanel, preview-image sortable rows, lazy/image dropzones, and the
      owner-picker trigger now use `bg-shell` or `bg-background` so they read
      as controls/subsections inside the larger admin editor card instead of as
      duplicate peer surfaces
  - that `admin resources` slice was proved at runtime through the repo-owned
    Playwright sentinels for `/admin/resources/new`, `/admin/resources/:id`,
    and the lazy preview uploader flow; no route-family remap was needed for
    the table/list surfaces after the semantic shift
  - a 2026-04-29 creator delivery upload-controls follow-up now confirms the
    same split on the creator editor side:
    - the delivery-source segmented toggle and the upload-branch wrapper shell
      are creator-owned route chrome and now prove cleanly on
      `/dashboard/creator/resources/new` and edit
    - the next creator-owned control-styling follow-up is now closed too:
      the external-file action cluster (`Clear link`, `Edit`, `Open link`,
      and the uploaded-file guard action) now uses the explicit compact
      `40px / 8px` route-owned posture on `/dashboard/creator/resources/new`
      and edit, while shared widget internals stay frozen
    - the first shared widget follow-up now closes the lowest-risk internal
      slice too:
      - `/dashboard/creator/resources/new` and `/admin/resources/new` now
        prove the shared pre-upload branch
      - that shared slice is intentionally limited to the empty dropzone,
        selected-file preview row, and upload CTA posture/copy surface
      - the next shared widget follow-up now closes the lowest-risk
        upload-complete slice too:
        - `/dashboard/creator/resources/[id]` and `/admin/resources/[id]` now
          prove the uploaded-file card plus replace/remove posture
        - the latest shared widget follow-ups now close both widget-owned
          feedback slices too:
          - `/dashboard/creator/resources/new` and `/admin/resources/new` now
            prove the widget-owned success banner shell after upload completes
          - those same creator/admin create routes now also prove the shared
            oversize-validation error banner after selecting a file larger than
            `50 MB`
        - a later route-owned follow-up now also proves the draft-create /
          `saveFirstError` slice on those creator/admin create routes:
          - the shared widget now catches `onEnsureResourceId()` failures
            before upload starts
          - the visible copy still remains route-owned
            (`/api/creator/resources/draft` Thai payload vs
            `/api/admin/resources/draft` English fallback copy)
        - the next route-owned follow-up now also proves the backend
          `500`/fallback upload-failure slice on those creator/admin create
          routes:
          - the shared widget still owns the error-banner shell after upload
            starts
          - the visible copy still remains route-owned
            (`/api/creator/resources/upload` Thai fallback vs
            `/api/admin/resources/upload` English fallback copy)
        - the next route-owned follow-up now also proves the creator/admin
          `404` upload-not-found slice on those create routes:
          - the shared widget still owns the error-banner shell after upload
            starts
          - the visible copy still remains route-owned
            (`/api/creator/resources/upload` Thai not-found vs
            `/api/admin/resources/upload` English not-found)
        - the remaining `400` validation strings still remain shared service
          copy, and the first shared proof slice is now closed too:
          - creator/admin create routes both prove the shared `unsupported
            format` `400` branch after draft creation succeeds
          - the lower-signal `resourceId required`, empty-file, and invalid
            generated-key branches remain optional follow-up territory
        - route-level flash messaging is narrower too:
          - creator create now proves the route-owned remove-file failure
            message outside the widget shell
          - admin create does not expose a matching upload/remove flash slice
            beyond the already-frozen widget banners
        - that separate admin edit-flow proof slice is now closed too:
          - `/admin/resources/[id]` proves the route-owned remove-file
            success/error rail outside the shared widget shell
          - `FileUploadWidget` now preserves the uploaded card and suppresses
            dev-overlay escalation when that route-owned delete callback fails
  - the canonical `Card / Foundations` boards no longer carry wrapper-radius
    debt on `Card / Size / Source`; the remaining card debt is explicit token
    gap / polish territory instead:
    - local type sizes still drive the title/body/footer copy in the light/dark
      source sets even though family, line height, and fills are bound
    - geometry still keeps intentional local values (`space/20`, `space/10`,
      and preview-stack symmetry)
  - the canonical Figma semantic layer now also carries
    `state/selected-fill` and `state/selected-stroke`, aliased to the primary
    emphasis ladder (`primary/mist`, `primary/lift`), while active chip labels
    stay on `fg/default`, so selected rows/chips can share a stable
    selected-surface contract without rebinding directly to raw primitives
  - a full-canvas audit of the canonical Figma file was rerun on `2026-04-27`
    and the repo context is now synced to that file as the base:
    - the file now separates page roles explicitly instead of mixing every
      board into one foundation page:
      `DS Foundations`, `DS Primitives`, `DS Components`,
      `DS Parking / Legacy`, and `Foundation Review`
    - `DS Foundations` now keeps only the 5 token-bound foundation boards
      (typography, colors, spacing/radius)
    - `DS Primitives` now holds the primitive component boards
    - `DS Components` now holds the composed shared-component boards
    - `DS Parking / Legacy` intentionally keeps recovered orphan nodes off the
      canonical library pages
    - `Foundation Review` is review-only and should not be treated as a
      reusable library source
    - the older page-wide counts from the pre-split all-in-one `DS Foundations`
      page are now obsolete; use section-level audits and page-role ownership
      instead of frozen aggregate totals going forward
    - the remaining local styling debt is now narrow and explicit:
      wrapper/study-scene radius values inside `Button`, `Input / Search`,
      `Card`, `Dropdown`, and `Surface`, plus the already-known token gaps for
      `Dropdown` and `Surface`, plus the then-open `Badge` xs label-type gap
    - `Badge` is now landed in the canonical file through dedicated
      `Badge / Foundations / Light` and `Badge / Foundations / Dark` boards
      plus `Badge / Variant / Source` light/dark component sets
    - the `Badge` pass also introduced the first canonical support-status
      primitives for `support/success/*` and `support/warning/*`, used to keep
      status labels token-bound without reopening the locked primary/rust/sand
      posture
    - the 2026-04-28 support-palette follow-up now surfaces those same support
      primitives directly on `Color Primitives / Light` and
      `Color Primitives / Dark` through dedicated `Success` and `Warning`
      cards, and the support family now extends to `base / dust / soft` in the
      canonical primitive collection instead of stopping at two status steps
    - the 2026-05-01 notification follow-up extends that same support-status
      family again with dedicated `support/info/*` primitives so `NotificationItem`
      info wrappers and glyphs can stay semantic instead of borrowing
      `primary/*`
    - the 2026-04-28 badge follow-up tuning now keeps `warning` and
      `featured` intentionally distinct in the canonical base:
      `warning` stays crisp on `bg/inset` through
      `support/warning/base|dust`, while `featured` now uses
      `accent/sand/wash` fill with `accent/sand/dust` stroke and
      `accent/sand/base` text as the softer editorial highlight posture across
      light/dark
    - runtime `Badge.tsx` now consumes that featured sand family directly too,
      via `accent-50` fill, `accent-300` stroke, and `accent-200` text instead
      of the older yellow alias classes
    - runtime `Badge.tsx` also now uses dedicated theme-aware vars for
      `support/info/*`, `support/success/*`, `support/warning/*`, and
      `state/danger/*`, so the shared badge primitive can follow the canonical
      light/dark Figma ladders instead of borrowing generic light-only status
      scales
    - the live dark badge source set also drifted from the initial landing ids
      and now lives at `1494:1803`; repo mapping must follow that node instead
      of the older `746:208` / `736:206` references
    - the 2026-04-29 badge residual cleanup closes the last live badge
      Figma gaps too:
      - the seven badge labels now bind to dedicated `type/badge/size` and
        `type/badge/line` variables instead of local `12/16` xs recipes
      - the light/dark `Badge / Variant / Source` wrapper frames now sit at
        `cornerRadius=0`
    - runtime `Badge.tsx` now mirrors the canonical badge set directly:
      `warning` / `featured` follow the tuned Figma split, and the earlier
      runtime-only badge aliases have been remapped off the live app surface
      and removed from the shared primitive contract instead of lingering as
      extra non-canonical variants
    - the next runtime cleanup also normalizes badge sizing back to that same
      canonical Figma recipe instead of inventing route-local mini/large chips:
      shared badge consumers now default to the live `24px` shell with the
      canonical `12/16` badge recipe, `space/8` horizontal padding, and the
      default icon ladder unless a future explicit badge-size family is
      introduced in the canonical file first; `Badge.tsx` now locks that
      `12/16` recipe at the root via shared font-size/line-height vars instead
      of relying on a `text-badge` utility that can be stripped when color
      variants merge onto the same class list, and the primitive now enforces
      the canonical `24px` shell height directly instead of leaving badges at a
      shorter content-derived runtime height
    - the canonical `Badge / Foundations` boards now also carry a
      `resource-card badge proofs` usage block so product-owned card labels are
      demonstrated without expanding the primitive family itself:
      top-left status proves `Owned`, `New`, and `Featured`, while top-right
      highlight proves `Trending` plus one generic highlight posture
      (`Recommended`)
    - the follow-up runtime adoption pass now pulls the matching
      resource/discover/detail pills back onto shared `Badge` too, so
      `Owned`, `New`, `Featured`, `Trending`, `Verified buyer`, and purchase
      status labels no longer depend on route-local rounded-pill recipes
    - `Foundation Review` still has text-fill binding but not font-family
      binding on its current text nodes, so it should be treated as a review
      artifact rather than a token-parity proof page
  - with `Badge` now landed as the next shared-library proof point after
    `Surface`, the next mandatory shared-library step was reopening
    `FormSection` / `DataPanelTable`
  - `FormSection` is now landed in the canonical file too through dedicated
    `FormSection / Foundations / Light` and `FormSection / Foundations / Dark`
    boards plus `FormSection / Variant / Source` light/dark sets
  - that `FormSection` source set intentionally stays narrow to the runtime
    contract: `flat` for divider-first settings/admin sections, `card` for
    bounded secondary shells
  - the foundations boards now also add usage-only optional-structure proofs
    for `flat / no-description` and `card / no-footer`; this closes the old
    proof gap around optional header/footer structure without inventing new
    variants
  - the 2026-05-02 follow-up then finishes the live Figma binding pass too:
    all paints, text props, radius, and spacing on the active boards now bind
    cleanly, and the former local `16/20`, `14/20`, `6px`, and `20px` values
    are normalized onto the nearest shared tokens (`type/label`, `space/8`,
    `space/24`) instead of staying unbound
  - the remaining explicit `FormSection` gap is parity plus semantics rather
    than binding debt: runtime still carries narrower literal geometry in
    places, and divider/footer separators still rely on `border/default` until
    a dedicated `border/subtle` semantic exists
    - the current dark source set now lives at `746:275` instead of the older
      `759:252` id
  - `DataPanelTable` is now landed in the canonical file too through dedicated
    `DataPanelTable / Foundations / Light` and
    `DataPanelTable / Foundations / Dark` boards plus `DataPanelTable / Variant / Source`
    light/dark sets
  - that `DataPanelTable` source set stays shell-scoped on purpose and proves
    the progressive `actions`, `toolbar`, and `footer` combinations without
    pretending to own column schemas, table-head semantics, row rendering, or
    business actions
  - the live light/dark `DataPanelTable` source sets now reuse the shared
    `RowAction / State` default instances directly for row-action lanes rather
    than keeping generic quiet button placeholders there
  - after the first landing pass, the source set was tightened again to match
    repo usage more literally: the fourth variant is now
    `actions=true, toolbar=false, footer=true`, and the footer proof point is a
    muted metadata note rather than an invented CTA footer
  - the 2026-04-28 shared-component re-audit narrows the remaining live
    `DataPanelTable` debt to explicit Figma-only gaps instead of broad shell
    drift:
    - the two `Showing latest 2 entries` footer-note copies still sit fully
      local for family/size/line-height/fill
    - the current dark source set now lives at `873:1766` instead of the older
      `800:1050` id
    - the light/dark source-set wrapper frames still keep local
      `cornerRadius=5`
    - the shell copy itself still relies on local type recipes:
      - `16/20` titles
      - `14/20` descriptions, column labels, row meta, and updated dates
      - inherited `12/16` badge sizing from the shared badge recipe
    - runtime still asks for `border-subtle`, and the table-head fill remains
      route-owned rather than a shared semantic token
  - the shared-library close-out audit is now complete too:
    - `Dropdown` stays a verified study-board reference for now rather than a
      promoted reusable component-set mapping
    - the latest `Button recipes` and `DataPanelTable` Figma adjustments are
      now mirrored in repo docs/context, so the plan no longer needs a
      follow-up drift pass inside the same scope

## Verification Pointers

- Run `npm run figma-map:check` when shared DS component files or reusable Figma
  library components change.
- Run `npm run tokens:audit` when token files, token exports, or token inventory
  wording changes.
- Run `npm run context:check` when DS ownership, handoff expectations, or agent
  context wording changes materially.
