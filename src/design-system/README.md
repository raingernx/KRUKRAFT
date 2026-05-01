# Krukraft Design System

This file is the canonical code-side reference for the shared design system.

What this file owns:
- import rules for app code
- directory roles
- current inventory
- ownership notes
- active implementation rules for code authors

What this file does not own:
- Figma reconstruction or handoff workflow details
- live Figma component status or node mapping
- agent-only recovery context

When this file conflicts with code, the code wins.

## Import Rules

- App and feature code should import shared UI from `@/design-system`.
- App and feature code should import product-bound DS exports from
  `@/design-system/product`.
- Do not add new primitives to `src/components/ui`.
- Treat `src/components/ui/*` as transitional implementation details or
  compatibility re-exports.
- Reach for `src/design-system/*` first when adding or changing shared UI.

## Directory Roles

- `tokens/`
  - semantic colors, spacing, radius, typography, hero support tokens
- `primitives/`
  - low-level reusable controls and feedback surfaces
- `components/`
  - reusable composed components built from primitives
- `product/`
  - product-bound or workflow-bound DS exports that stay reusable but are not
    foundation primitives
- `layout/`
  - shared page and navigation layout helpers

## Current Inventory

### Tokens

- `colors.ts`
- `hero.ts`
- `radius.ts`
- `spacing.ts`
- `typography.ts`

### Primitives

- `Avatar`
- `Badge`
- `Button`
- `Card`
- `Dropdown`
- `Input`
- `LoadingSkeleton`
- `Modal`
- `RevealImage`
- `SearchInput`
- `Select`
- `Switch`
- `Textarea`
- `ToastProvider`
- `useToast`

Current canonical Figma shared-coverage note:

- `Avatar` is no longer a code-only primitive
- `Switch` is no longer a code-only primitive
- `Modal` is no longer a code-only primitive
- `LoadingSkeleton` is no longer a code-only primitive
- the canonical file now has `Avatar / Foundations / Light` and
  `Avatar / Foundations / Dark` on `DS Primitives`
- the canonical file now has `Switch / Foundations / Light` and
  `Switch / Foundations / Dark` on `DS Primitives`
- the canonical file now has `Modal / Foundations / Light` and
  `Modal / Foundations / Dark` on `DS Primitives`
- the canonical file now has `LoadingSkeleton / Foundations / Light` and
  `LoadingSkeleton / Foundations / Dark` on `DS Primitives`
- that slice currently documents the shared `24 / 32 / 40 / 56` ladder plus
  image and fallback states, while `28 / 36 / 72 / 104` remain runtime-owned
  posture extensions
- image and fallback states now share one stroked circular shell posture across
  the canonical Figma board and runtime primitive
- the switch slice currently documents the runtime `46×24` track, `20×20`
  thumb, and checked/unchecked + disabled visual states while keeping labels,
  helper copy, and row shells route-owned
- the modal slice currently documents the runtime `384 / 448 / 512 / 576`
  width ladder, centered surface shell, close affordance, and the shared
  header/body/footer rail structure while keeping overlay tint, portal motion,
  and footer button semantics runtime-owned
- the modal board also makes the current divider-token gap explicit:
  the canonical file still lacks a semantic `border/subtle` variable, so the
  proof boards bind divider rails to `neutral/line` intentionally
- the loading-skeleton slice currently documents the shell-only primitive and a
  bounded `line | bar | circle | pill` posture set while keeping content-block,
  table-row, hero, and detail loading geometry route-owned
- the loading-skeleton board also keeps one explicit Figma token gap visible:
  there is still no dedicated semantic `bg/muted` variable in the canonical
  file, so the light board binds shell fills to `bg/inset` while the dark board
  binds them to `border/default` to mirror the current runtime aliasing

### Composed Components

- `ConfirmDialog`
- `DataPanelTable`
- `EmptyState`
- `FormSection`
- `Pagination`
- `RowActions`
- `SectionHeader`
- `Surface`

### Product-Bound Exports

- `FileUploadWidget`
- `NotificationButton`
- `PickerControls`
- `PriceBadge`
- `PriceLabel`
- `ResourceCard`

### Layout

- `Container`
- `PageContainer`
- `PageContent`
- `PageContentWide`
- `PageContentNarrow`
- `SidebarContainer`
- `SidebarNav`
- `SidebarSection`
- `SidebarSectionLabel`
- `IconWrapper`
- `SidebarBadge`
- `SidebarItem`
- `SidebarFooter`
- `Divider`
- `NavGroup`

## Ownership Notes

- `ResourceCard` now belongs to the product-bound export surface
  `@/design-system/product`, but its implementation owner is still
  `src/components/resources/ResourceCard.tsx`. Treat it as a marketplace
  product component, not as a generic foundation.
- `ResourceCardSkeleton` follows the same ownership rule and should be imported
  from `@/design-system/product` outside the resource implementation subtree.
- `LoadingSkeleton` should be imported from `@/design-system`; keep
  `src/components/shared/LoadingSkeleton.tsx` as compatibility history only.
- `FileUploadWidget`, `NotificationButton`, `PriceBadge`, `PriceLabel`, and
  `PickerControls` also belong to `@/design-system/product`; they stay reusable
  but remain more workflow-bound than true primitives.
- `DataPanelTable` is the reusable dashboard/admin shell for
  title/description/actions + optional toolbar + table/empty-state content.
  Keep data fetching, column schema, row rendering, and business actions
  route-owned.
- Shared admin table primitives should preserve DOM attributes on header cells
  so route-level proof hooks and accessibility metadata stay attached without
  forcing routes back to raw `<th>` markup.
- `/admin/reviews` now rides that same admin-table contract too, and its
  summary metrics no longer rely on `tracking-tight`.
- `/admin/orders` now rides that same admin-table contract too, and its summary
  metrics no longer rely on `tracking-tight`.
- `/dashboard/creator/apply` is now the first live creator color-token proof
  route: pending, approved, and rejected state panels use semantic
  warning/success/danger emphasis surfaces, and the rejected feedback rail uses
  the same semantic danger family instead of a lighter route-owned alert shell.
- `/dashboard/creator/resources/*` is now the next live creator color-token
  proof route: resource-editor helper/callout icons use semantic `primary`
  instead of route-owned brand color, and preview-image validation copy uses
  semantic destructive text instead of route-owned red utilities.
- `/dashboard/creator/resources/new` also now proves the first live
  publish/readiness feedback slice: `CreatorPublishReadiness` warning/ready
  states and the `CreatorPublishSuccessModal` success indicator both ride
  semantic warning/success families on the real publish flow.
- `/dashboard/creator/profile` now proves the next live creator color-token
  slice too: `CreatorProfileForm` asset-ready statuses ride semantic
  success/warning families, the profile-save success message now uses a
  semantic success surface, and the profile-save error rail now uses the same
  semantic danger surface family as the creator-apply slice.
- The live dashboard settings loading shell now routes its intro back through
  the shared dashboard page-header contract too; any remaining badge-first
  dashboard intro demos should be treated as preview-only exceptions until a
  separate demo cleanup pass is chosen.
- The canonical Figma `DataPanelTable` base now lives in dedicated light/dark
  `DataPanelTable / Foundations` boards, with source sets that stay shell-only
  and prove progressive `actions`, `toolbar`, and `footer` combinations that
  match the current repo usage rather than every possible permutation.
- Keep `DataPanelTable` responsible for shell, title, description, actions,
  optional toolbar, and optional footer only; do not turn it into a reusable
  table-schema or row-action registry.
- `FormSection` is the canonical settings/admin form layout helper. Prefer its
  default `flat` variant before introducing nested cards.
- The canonical Figma `FormSection` base now lives in dedicated light/dark
  `FormSection / Foundations` boards, with source sets that cover only
  `variant=flat` and `variant=card`.
- Keep `FormSection.flat` as the default stacked settings/admin section shell;
  use `FormSection.card` only when the section genuinely needs a bounded
  secondary shell with a footer action area.
- The current Figma `FormSection` source set records explicit token gaps rather
  than hiding them: runtime `16/20` section-title rhythm, `20px` card padding,
  the `6px` flat-header gap, and the missing `border/subtle` semantic still sit
  outside the current canonical token scales.
- `LoadingSkeleton` is the canonical skeleton primitive. Placeholders should
  stay neutral and use no more than three tones on a single surface.
- `EmptyState` is no longer a code-only composed component:
  the canonical file now has `EmptyState / Foundations / Light` and
  `EmptyState / Foundations / Dark` on `DS Components`, plus paired
  `EmptyState / Variant / Source` light/dark sets that lock the bounded shared
  shell only.
- That composed slice currently documents the centered stack rhythm, dashed
  rounded container posture, and the shared `icon | title | description |
  action` slot order through a `default` and `minimal` source pair while
  keeping business copy, live CTA semantics, and route-owned illustrations out
  of the contract.
- Icon examples on that board stay neutral placeholders, while the action lane
  now reuses a shared `Button size="sm" variant="soft"` example with a generic
  `Soft action` label so the CTA posture stays intentionally subordinate to
  the empty-state message without disappearing as much as the quieter fill.
- The current Figma-only gap is explicit:
  runtime `EmptyState` uses `border-border-subtle`, but canonical Figma still
  lacks a semantic `border/subtle` variable, so the dashed rail currently
  binds to `border/default`.
- `SectionHeader` is no longer a code-only composed component either:
  the canonical file now has `SectionHeader / Foundations / Light` and
  `SectionHeader / Foundations / Dark` on `DS Components`, plus paired
  `SectionHeader / Variant / Source` light/dark sets that lock the bounded
  intro-shell contract only.
- That composed slice currently documents eyebrow, title, description,
  alignment, and the optional trailing actions slot through a `default`,
  `centered`, `with-actions`, and `minimal` source set while keeping route
  backdrops, page-width choices, and live CTA semantics out of the contract.
- The `with-actions` proof now reuses shared `Button size="sm"` examples from
  the canonical button family instead of invented CTA chrome or placeholder
  pills; the labels stay generic so the composed contract still proves layout
  posture rather than route-owned semantics.

## Current Implementation Rules

- `Button` is now the first themed runtime slice. Treat `primary`, `quiet`,
  `soft`, and `ghost` as the canonical family for new work.
- `Button` should read as one pill-shaped family across sizes, icons, and
  disabled/loading states rather than separate button recipes per surface.
- The canonical Figma `Button / Foundations` boards still go further than the
  current runtime size contract: light/dark source sets and the runtime family
  now both cover `primary | quiet | soft | ghost`, and the state matrices
  explicitly separate airy `ghost` from bounded-neutral `soft`, but the Figma
  `Button / Size` boards still trial `sm=36` while runtime stays at `32`.
  Treat that size step as the remaining adoption gap, not the soft tone
  itself.
- `secondary` remains a compatibility alias for quiet-style usage, and
  `outline` remains available for legacy surfaces that still depend on
  explicit borders.
- `Input` and `SearchInput` are now the second themed runtime slice. Keep
  both on the same quiet field shell, placeholder/value hierarchy, and focus
  ring language for new work.
- `Select` is now the next Figma-first control sibling after `Input` /
  `SearchInput`. The canonical file now carries light/dark
  `Select / Foundations` boards plus `Select / State` and `Select / Size`
  sets that mirror the same quiet field shell, `radius/sm (8px)` geometry,
  helper/error posture, and field-size ladder while keeping option lists
  route-owned. The first runtime parity slice is now live on
  `/admin/settings`, where `Select.tsx` keeps the same `8px` radius target in
  shared admin forms. The first widened follow-up family is now
  `admin/resources`: the resource form, listing filters, and move-category
  modal all opt into the same shared select shell without local radius/padding
  overrides. The next widened admin-only follow-up is now the low-risk filter
  bucket on `/admin/activity`, `/admin/audit`, and
  `/admin/analytics/ranking`, which all prove the same `56px / 8px` select
  shell without reopening creator-owned forms. The first creator-owned widened
  follow-up is now `/dashboard/creator/profile`, where the status `Select`
  explicitly opts into `size="field"` while the rest of the profile form keeps
  its creator-specific long-form behavior route-owned. The next creator-owned
  widened slice is now the metadata zone of `/dashboard/creator/resources/*`:
  the editor's `status` (edit mode only), `type`, and `category` selects now
  opt into the same shared `field` shell while the delivery/upload zone stays
  route-owned for now.
- `Textarea` now has matching light/dark `Textarea / Foundations` boards plus
  dedicated `Textarea / State` sets in the canonical file. The multiline
  contract intentionally keeps the same quiet field shell target and
  `radius/sm (8px)` geometry, but it does not invent a reusable size ladder:
  rows, counters, resize behavior, and long-form affordances stay route-owned.
  `/admin/settings` is also the first proved runtime route family: shared
  `Textarea.tsx` now keeps the same `8px` radius target there while rows and
  route-specific long-form behavior remain route-owned. The first widened
  follow-up family is now `admin/resources`, where the main resource form and
  bulk-upload editor both keep the same shell/radius target while the JSON
  editor remains route-owned through color and monospace overrides only. The
  first creator-owned widened follow-up is now `/dashboard/creator/profile`,
  where the bio field keeps the shared `8px` shell while `min-height` and the
  character-count affordance stay route-owned. The next creator-owned widened
  slice is now the creator resource editor metadata zone, where the main
  description field keeps the shared shell on both new/edit routes. That
  creator follow-up is now closed too: the delivery/previews linked URL editor
  inputs on `/dashboard/creator/resources/new` and edit now keep the same
  shared `56px / 8px` field shell, while the bulk preview URL textarea remains
  a route-owned composite editor. The follow-up parser-only proof is now
  closed too: the bulk preview editor still uses the shared `Textarea` shell
  on create/edit routes, but parsing, validation, apply-state, and cover-order
  side effects remain route-owned behavior. The next creator upload follow-up
  is now closed too: the route-owned delivery-source toggle plus the upload
  branch wrapper shell on `/dashboard/creator/resources/new` and edit are now
  proved at runtime. The next creator-owned control-styling follow-up is now
  closed too: the external-file action cluster (`Clear link`, `Edit`,
  `Open link`, and the uploaded-file guard action) now uses the explicit
  compact `40px / 8px` route-owned posture on `/dashboard/creator/resources/new`
  and edit, while shared widget internals stay frozen. The first shared widget
  follow-up is now closed too:
  creator/admin create routes now prove the shared pre-upload branch
  (`dropzone`, selected-file preview, and upload CTA). The next shared widget
  follow-up is now closed too: creator/admin edit routes now prove the
  uploaded-file card plus replace/remove posture. The latest shared widget
  follow-ups now close both widget-owned feedback slices on creator/admin
  create routes too: the shared success banner after upload completes and the
  shared oversize-validation error banner after selecting a file larger than
  `50 MB`. A later route-owned follow-up now also proves the draft-create /
  `saveFirstError` slice on creator/admin create routes: the shared widget
  catches `onEnsureResourceId()` failures, but the visible copy still remains
  route-owned (`/api/creator/resources/draft` Thai payload vs
  `/api/admin/resources/draft` English fallback copy). The next route-owned
  follow-up now also proves the backend `500`/fallback upload-failure slice on
  creator/admin create routes: the shared widget still owns the error banner
  shell, but the visible copy remains route-owned
  (`/api/creator/resources/upload` Thai fallback vs
  `/api/admin/resources/upload` English fallback copy). Service-specific
  validation copy is now narrower too: creator/admin create routes also prove
  the route-owned `404` upload-not-found slice
  (`/api/creator/resources/upload` Thai not-found vs
  `/api/admin/resources/upload` English not-found), while the remaining `400`
  validation strings stay shared service copy. The first shared proof slice is
  now closed too: creator/admin create routes both prove the shared
  `unsupported format` `400` branch after draft creation succeeds, while the
  lower-signal `resourceId required`, empty-file, and invalid-generated-key
  branches remain optional future follow-ups. Route-level flash messaging
  is narrower too: creator create now proves the route-owned remove-file
  failure message outside the widget shell, while admin create does not expose
  a matching upload/remove flash slice beyond the already-frozen widget
  banners. That admin-side follow-up is now closed too: `/admin/resources/[id]`
  proves the route-owned remove-file success/error rail outside the shared
  widget shell, and the narrow remediation was to keep `FileUploadWidget`
  from clearing the uploaded card or surfacing a dev overlay when the
  route-owned delete callback fails.
- `SearchInput` is the canonical DS search primitive. Reuse it before creating
  route-owned search shells.
- `Input` and `SearchInput` should stay on the same field recipe. Search may
  add search-specific affordances, but it should not drift into a separate
  shell language for default, hover, focus, or filled states.
- Control sizing should be expressed as component contract, not as one-off size
  variables:
  - typography sizes and line heights belong in typography variables
  - `Button`, `Input`, and `SearchInput` sizes belong in component variants
    that bind back to spacing, radius, and typography tokens
- `Button` runtime size contract should stay:
  - `xs`: `h-8`, `px-3`, caption text
  - `sm`: `h-8`, `px-4`, body/sm text
  - `md`: `h-10`, `px-6`, body/sm text
  - `lg`: `h-12`, `px-8`, body/sm text
  - `icon`: square icon affordance only, not a text-button recipe
  - default resolution: `comfortable -> md`, `compact -> sm`
- The bounded neutral `soft` tone is now part of the approved runtime
  `Button` ladder too. It follows the canonical Figma state contract directly:
  `bg/inset + border/default + fg/default` at rest, `bg/surface` on hover, and
  `fg/subtle` on disabled while keeping the same pill geometry as the rest of
  the family. The remaining adoption candidate is the Figma-side `sm=36` size
  step, not the `soft` tone itself.
- Use this decision rule when evaluating new button-looking surfaces:
  - `variant`: promote only when the posture is meant to work across multiple
    contexts as part of the core family
  - `recipe`: keep context-specific action patterns documented on top of an
    existing variant before creating a new family member
- Current Krukraft button decision table:
  - `primary`: canonical high-emphasis CTA variant
  - `quiet`: canonical low-contrast filled secondary variant
  - `soft`: canonical bounded-neutral action variant that keeps more presence
    than `quiet` without competing with `primary`
  - `ghost`: canonical airy low-emphasis action variant
  - `outline`: legacy bordered variant; keep available for existing surfaces
    and evaluate new bordered patterns against it first
  - `row action`: recipe, not a new family; derive from `outline` or a future
    outline-adjacent variant for dense table/action columns. In the canonical
    Figma file this now means the `DataPanelTable`-style rounded-rect posture:
    40px height with `radius/sm (8px)`, not the global pill shape; the live
    recipe card now shows both an `Edit / Open` example row and a compact
    `Default / Hover / Focus / Pressed / Disabled` state strip. The first
    runtime adoption slice now mirrors that posture through
    `RowActionButton size="md"` while still leaving the existing compact `sm`
    helper posture available for narrower table/admin surfaces
  - `pagination item`: recipe, not a new family; page navigation should stay a
    `Pagination` pattern with `default`, `current`, and `disabled` states
    instead of creating a separate button tone. The current Figma recipe keeps
    the same rounded-rect `radius/sm (8px)` geometry as table row actions; the
    first runtime slice now exposes that through `PaginationButton size="md"`
    and uses it in the dashboard creator-resources `DataPanelTable` flow while
    leaving compact `sm` pagination available until wider proof lands. The
    first admin rollout proof now keeps that posture opt-in through
    `TablePagination buttonSize="md"` on `/admin/audit` instead of widening
    every table footer by default
  - current admin rollout decision:
    - `/admin/users`: adopt `RowActionButton size="md"` because the row-action
      cluster behaves like a spaced table-action column rather than a dense
      inline editor
    - `/admin/audit`: adopt `TablePagination buttonSize="md"` because the
      footer behaves like a standalone table paginator
    - `/admin/tags`: keep compact `RowActionButton` `sm` because edit,
      confirm-delete, and save/cancel clusters are denser inline controls
  - current simple-admin follow-up decision:
    - `/admin/categories`: adopt `RowActionButton size="md"` because its
      `Edit / Delete` pair behaves like a simple table-action column
    - `/admin/reviews`: adopt `RowActionButton size="md"` for the single
      visibility toggle because it behaves like a standalone moderation action
    - `/admin/resources/trash`: adopt `RowActionButton size="md"` for the
      `Restore / Delete` pair because the row stays action-light and table-like
    - `/admin/resources/[id]/versions`: adopt `RowActionButton size="md"` for
      `Download / Rollback` because the action cell stays a simple two-action
      version-history surface
    - `/admin/resources` main table stays out of scope because its publish /
      restore / edit / menu cluster is denser and not yet justified for the
      larger posture
  - current dense-holdout lockdown decision:
    - `/admin/resources` main table is now an explicit compact holdout; every
      row action and the overflow trigger pass `size="sm"` instead of relying
      on shared defaults
    - `/admin/tags` is now an explicit compact holdout; inline
      save/cancel/delete/edit row actions all pass `size="sm"` because the
      cluster behaves like an inline editor, not a table-action column
    - `CreatorResourceStatusButton` is now an explicit compact holdout too;
      it passes `size="sm"` in code even though no live route mount was found
      during the rollout audit
  - `panel CTA`: recipe first, usually outline-derived; if the bounded neutral
    posture spreads across multiple non-table contexts, reopen it as a real
    `soft` adoption decision instead of sneaking it into `ghost`
- If the button ladder is deliberately reopened later, the current recommended
  promotion path is:
  - keep `xs = 32`
  - test `sm = 36`
  - keep `md = 40`
  - keep `lg = 48`
  - keep `density=\"compact\" -> xs` during the first rollout proof instead of
    silently moving compact buttons to `36px`
  - do not drag `Input` / `SearchInput` into that rollout by default
- `Input` / default-field size contract for Figma and code should stay:
  - `sm`: `h-8`, `px-3`
  - `md`: `h-10`, `px-4`
  - `lg`: `h-12`, `px-4`
  - `field`: `h-14`, `px-4`
  - the canonical Figma base now uses `radius/sm (8px)` across `Input` and
    `SearchInput` state + size sets instead of a split comfortable/compact
    radius posture
  - runtime adoption has now started on the shared search branch:
    - `SearchInput variant="default"` now forces the canonical
      `radius/sm (8px)` shell at runtime
    - the first proof routes are `/dashboard/library` toolbar search
      (`40px / 8px`) and the dashboard topbar search on the same
      `40px / 8px` ladder
    - the shared start/loading adornments on that default branch now render
      through full-height wrappers too, so toolbar and topbar search icons stay
      vertically centered instead of collapsing to a `16px` corner box
    - the topbar clear action is now route-proved too once the client shell is
      hydrated; the proof path verifies that the clear button appears and resets
      the field locally
    - the shared default search contract now resolves to `size="md"` (`40px`)
      before local exceptions; admin global search, admin users, admin
      resources, admin activity, and admin ranking now route through the same
      `SearchInput` primitive instead of `Input + local icon wrapper` copies
    - public `/resources` search stays a route-owned product override
      (`h-[40px]`, pill radius) and is intentionally outside this shared-shell
      parity slice
  - `Input.tsx` now matches the canonical `8px` radius shell at runtime too;
    `/admin/users` is the first proof route for the shared field primitive
  - default resolution: `comfortable -> field`, `compact -> sm`
- `SearchInput variant=\"default\"` should stay on the same field-size ladder as
  `Input`, but the shared default runtime mount now resolves to `size="md"`
  (`40px`) unless a route opts into another rung explicitly; only the hero
  variant is allowed to diverge into its own larger search-shell geometry.
- Dashboard route intros should reuse `DashboardRouteIntro` /
  `DashboardPageHeader` eyebrow text instead of reintroducing `Badge` pills for
  page labels; header CTAs in that family should default to `Button size="md"`
  unless a route proves a narrower control is intentional. The creator
  workspace intro now follows that same contract, and loading companions should
  reuse the same authority instead of carrying separate badge-first intro
  shells.
- Dashboard/admin product headers and sidebar section labels should not use
  tracking by default. Shared `DashboardPageHeader`, `AdminPageHeader`, and
  `DashboardSidebar` labels now treat `letter-spacing` as `normal`; any
  remaining tracked labels in those route families should be treated as
  route-owned exceptions to inventory explicitly, not as the baseline.
- In `CreatorResourceForm`, the `Marketplace preview` labels now follow that
  same no-tracking rule. Required asterisks, step chips, and highlighted-field
  emphasis in that form should use semantic tokens (`danger`, `primary`)
  instead of route-local `red`, `blue`, or `indigo` utilities.
- Creator settings micro-labels should follow that same rule too. The
  `Security` label on `/dashboard/settings` now renders without uppercase
  tracking and acts as the visible creator-settings baseline.
- Admin route-owned table/report labels should prefer the shared admin table
  contract instead of raw uppercase/tracking-heavy `<th>` copies. The
  `/admin/creators` table is now back on `DataTableHeadCell`, and its summary
  metrics no longer rely on `tracking-tight`.
- `RevealImage` is the shared image primitive for already-sized containers. Let
  the surrounding container own placeholder and background treatment.
- The 2026-04-30 heavier-primitive follow-up audit keeps `RevealImage`
  intentionally out of canonical Figma coverage for now: the runtime helper
  does not expose a bounded shell/size/state ladder of its own, and real
  mounts still let the caller own crop mode, placeholder tone, overlay, and
  surrounding image chrome.
- The same audit keeps `ToastProvider` intentionally out of canonical Figma
  coverage too: the runtime contract is provider behavior, queueing, timing,
  and mount ownership more than a bounded static card shell.
- `Card` is the calm generic shell card, not a product/marketplace card. The
  current canonical Figma base treats the root shell as `surface` and the
  footer band as `inset`, and runtime `Card.tsx` now follows that surface
  hierarchy directly.
- `bg-card` now mirrors the canonical `surface` layer in runtime tokens. When a
  shared shell, navbar/menu chrome, or sidebar frame should stay on the calmer
  outer shell layer, use `bg-shell` explicitly instead of assuming `bg-card`
  still means shell.
- The canonical `Card / Foundations` boards no longer carry wrapper-radius debt
  on `Card / Size / Source`; the remaining card board debt is explicit token-gap
  territory (`space/20`, `space/10`, and preview-stack symmetry), not silent
  wrapper styling drift.
- Runtime route-level and Suspense-critical skeletons should stay visually
  neutral even when the resolved UI uses richer emphasis or recovery states.
- Dark-shell selected rows and feedback chips should prefer theme-aware
  emphasis surfaces such as `bg-accent + semantic border/text color` instead of
  fixed light-only `*-50` fills.
- The canonical Figma semantic layer now includes
  `state/selected-fill`, `state/selected-stroke`, and `state/selected-text`,
  mapped to the primary emphasis ladder (`mist`, `lift`, `base`) for
  selected rows, chips, and other selected surfaces. Use that family instead of
  rebinding selected UI directly to raw `primary/*` primitives or action-state
  tokens.
- `Badge.warning` and `Badge.featured` now intentionally diverge in the
  canonical Figma base: `warning` stays crisp and alert on `bg/inset` through
  the `support/warning/*` ladder, while `featured` reads as a softer editorial
  highlight through `accent/sand/wash` fill plus `accent/sand/base` border/text
  in both light and dark.
- `Badge` is the non-interactive semantic label primitive. Use it for status,
  metadata, or read-only emphasis.
- The canonical Figma `Badge` base now covers `neutral`, `info`, `success`,
  `warning`, `featured`, `destructive`, and `outline` through dedicated light
  and dark `Badge / Foundations` boards.
- The runtime `Badge` primitive now stays on the same canonical set as Figma:
  `neutral`, `info`, `success`, `warning`, `featured`, `destructive`, and
  `outline`.
- Older runtime-only badge aliases (`owned`, `new`, `free`, `default`,
  `secondary`, `ghost`, and `link`) have been cleaned out of the primitive
  contract; if a future route needs one of those ideas again, it should be
  remapped deliberately onto the canonical badge set or moved into a separate
  product-bound component instead of reopening ad-hoc badge variants.
- The 2026-04-29 badge residual cleanup closed the last Figma-side badge gaps:
  the light/dark source-set wrappers now sit at `cornerRadius=0`, and the
  source-set labels now bind to dedicated `type/badge/size` + `type/badge/line`
  variables instead of staying on local `12/16` overrides.
- Runtime `Badge.tsx` now consumes the matching `text-badge` size token so the
  primitive and the canonical Figma set share the same `12/16` badge recipe.
- `Chip` is now reserved for interactive token-like controls only, such as
  filter chips, pressed/selected chips, removable chips, or navigation chips.
  Do not expand `Badge` to cover those interactive contracts once `Chip` lands.
- Hero surfaces are not generic `card` surfaces. Use the hero semantic layer
  (`heroBackground`, `heroPanel`, `heroChip`, and related roles) instead of
  rebinding hero UI to default card tokens.
- `boneyard-js` is an optional capture workflow for generated skeletons under
  `src/bones`. It supplements the repo's loading/fallback parity rules; it does
  not replace route-owned loading, empty, or error-state design.
- The canonical Figma file now separates page roles explicitly:
  `DS Foundations` for tokens only, `DS Primitives` for primitive component
  boards, `DS Components` for composed shared surfaces, `DS Parking / Legacy`
  for recovered non-canonical scraps, and `Foundation Review` as a review-only
  comparison page. Do not treat `Foundation Review` or `DS Parking / Legacy`
  as reusable library sources.

## External Reference Alignment

Krukraft now uses this external reference stack for DS decisions:

- `Primer`
  - primary reference for token taxonomy, naming layers, and the distinction
    between raw values, semantic roles, and component-specific exceptions
- `Atlassian Design System`
  - primary reference for product-app rigor, shared chrome semantics, spacing
    discipline, and intent-first color usage
- `Radix Themes`
  - primary reference for implementation-level theming, runtime theme knobs,
    contextual radius behavior, and primitive ergonomics

Use these systems to shape Krukraft-specific decisions. Do not copy any one of
them wholesale.

### Adopt / Adapt / Avoid Matrix

| Area | Primer | Atlassian | Radix Themes | Krukraft decision |
| --- | --- | --- | --- | --- |
| Token taxonomy | adopt | adapt | adapt | Keep a three-layer mental model: primitive values, semantic/runtime roles, and component-specific exceptions |
| Token naming | adopt | adapt | avoid direct copy | Prefer property-first semantic naming and keep current public token/API names stable until a dedicated rename pass exists |
| Color role usage | adapt | adopt | adapt | Treat roles as intent-first (`neutral`, `success`, `warning`, `danger`, `input`) and stop using colorful accents where meaning is semantic |
| Accent handling | avoid direct copy | adopt | adapt | Keep `accent` swappable and non-semantic; do not let colorful accent ramps replace semantic success/warning/info/danger roles |
| Shared chrome | avoid direct copy | adopt | adapt | Use Atlassian-style hierarchy for nav, shells, and focus/emphasis, but apply it through Krukraft tokens and primitives |
| Layout primitives | adapt | adopt | adapt | Keep Krukraft layout helpers, but clarify them as box/stack/sidebar primitives instead of letting wrapper drift grow |
| Runtime theming | adapt | adapt | adopt | Keep Krukraft theme tokens, but use Radix-style runtime controls as the model for scaling, radius, panel treatment, and theme consistency |
| Radius and scaling | avoid direct copy | adapt | adopt | Move toward contextual radius/scaling behavior rather than hard-coded per-component values where practical |
| Component variants | adapt | adapt | adopt | Prefer a small, consistent variant set (`solid`, `soft`, `outline`, `ghost`) instead of route-owned one-off variants |
| Product-bound DS exports | avoid | adapt | avoid | Keep workflow/product components exported if useful, but do not treat them as foundation primitives |

### What This Means In Practice

- Use `Primer` to decide how a token should be classified, not what brand
  styling it should have.
- Use `Atlassian` to decide whether a color or emphasis carries semantic
  meaning, and to keep shared chrome and layout hierarchy disciplined.
- Use `Radix Themes` to decide how theme controls should affect spacing,
  radius, surfaces, and primitive ergonomics across the app.
- Keep Krukraft's existing DS barrel, token files, and semantic runtime roles
  as the implementation source of truth; the external systems are references,
  not replacements.

## Visual Direction Brief

This is the locked visual foundation brief for the current DS plan. It turns
the external reference stack into concrete Krukraft direction before the first
implementation slice is landed.

During the current `Figma foundation first` phase, use
[theme-playbook.md](./theme-playbook.md) for posture/vocabulary and
[foundation-study-checklist.md](./foundation-study-checklist.md) for the
minimum Figma study coverage required before any code theme slice is chosen.

### Feature Summary

Krukraft should feel like a focused learning marketplace and creator tool, not
like a generic SaaS admin kit. The design system should support public browse,
resource merchandising, and creator/admin workflows with one visual language
that feels calm, precise, and premium without becoming ornamental.

### Primary User Action

The system should make the next meaningful action obvious:

- browse and evaluate learning resources confidently
- act on key dashboard or admin tasks quickly
- understand state and priority without relying on decorative color or extra
  wrappers

### Design Direction

- `Primer` influence:
  - keep the system structurally disciplined
  - separate primitive values, semantic roles, and component exceptions cleanly
- `Atlassian` influence:
  - privilege intent-first color and hierarchy over decorative styling
  - make shared chrome feel stable, legible, and product-grade
- `Radix Themes` influence:
  - keep primitives ergonomic, theme-aware, and consistent under one runtime
    surface model

Krukraft should express those references as:

- calm and product-focused, not playful or flashy
- premium through restraint, spacing, and type hierarchy rather than heavy
  gradients or saturated surfaces
- editorial enough for marketplace browsing, but still operational enough for
  dashboard and admin use

### Typography Direction

- headings should feel firm and composed, not oversized for effect
- body copy should stay highly readable and neutral
- hierarchy should come from size, weight, and spacing rather than tracking or
  forced uppercase
- marketplace/public surfaces may carry slightly more editorial contrast than
  dashboard/admin surfaces, but both should still share one type system

### Radius And Density Direction

- radius should feel intentional and consistent, not component-by-component
  arbitrary
- default surfaces should lean toward moderate rounding:
  - soft enough to feel contemporary
  - restrained enough to avoid toy-like UI
- density should default to comfortable but not airy:
  - public browse can breathe more
  - dashboard/admin can tighten slightly without collapsing into cramped forms

### Surface And Elevation Direction

- rely on layered surfaces, border hierarchy, and spacing before adding stronger
  shadows or colored panels
- most surfaces should read as:
  - background
  - card / popover shell
  - muted or subordinate inset
- elevation should be sparse and purposeful; shadows are for separation, not
  decoration
- chrome, menus, and panels should feel cohesive across public, dashboard, and
  admin shells

### Primitive Interaction Direction

- `Button`, `Input`, `Dropdown`, `SearchInput`, and related primitives should
  look like parts of the same family
- interaction emphasis should come from semantic roles:
  - `primary` for main action
  - `ring` for focus
  - `destructive` for risk
- hover, pressed, selected, and focus states should be crisp and visible, but
  not louder than the layout itself
- avoid accumulating one-off route-specific button or input treatments

### Anti-Goals

- do not drift into glossy marketing gradients, glassmorphism, or colorful
  accent-overload
- do not make dashboard/admin surfaces look like a different product from the
  marketplace
- do not use editorial styling as an excuse to weaken operational clarity
- do not reopen token naming or export-boundary work that is already locked

### Implementation Guardrails For The Next Slice

- first visual implementation work should stay in foundation primitives, not
  route pilots
- prefer one narrow slice that can be reviewed in Storybook before touching app
  routes
- good candidates are:
  - `Button + Input/SearchInput`
  - `Card + Dropdown`
  - typography/radius calibration if it can stay narrow and system-wide
- do not start discover or other route pilots until that first foundation slice
  is landed and reviewed

## Krukraft Theme Direction Brief

Detailed training guidance now lives in
[theme-playbook.md](./theme-playbook.md). Keep this section as the short
canonical summary and use the playbook for palette posture, review language,
and approval rules.

This is the locked theme-direction brief for the current `Krukraft theme
refresh plan`. It builds on the completed DS baseline, the reference-driven
alignment plan, the visual-foundation pass, and the landed `/resources` pilot.

### Theme Summary

Krukraft should feel like a modern learning brand with product discipline, not
like a generic SaaS dashboard and not like a loud consumer template. The theme
should preserve the calm, precise foundation already landed in the DS while
shifting it toward an editorial-minimal brand mood that can scale across
public browse, creator work, and admin operations.

### Emotional Direction

The refreshed theme should read as:

- trustworthy and composed before it reads trendy
- warm and human without becoming playful or childish
- premium through clarity, crop, contrast, and restraint rather than heavy
  visual effects
- editorial and minimal rather than colorful or campaign-driven
- simple and clean enough for high-density product tasks, not just public
  marketing surfaces

### Color Direction

- keep semantic roles authoritative:
  - `primary` stays the main action role
  - `destructive` stays the risk role
  - `ring` stays the focus role
  - status/intent must not be encoded through decorative accent ramps
- move the brand mood through:
  - background tone
  - surface warmth/coolness
  - hero/support surfaces
  - subtle contrast shifts in chrome and cards
- let stronger brand accents stay supportive and sparse rather than becoming
  the default product surface language
- default surfaces should stay quiet:
  - background
  - card/popover shell
  - muted inset
  should still read as one disciplined hierarchy
- avoid turning core product surfaces into saturated brand canvases

### Typography Direction

- keep one system across marketplace, dashboard, creator, and admin surfaces
- express brand character through a firmer hierarchy and better rhythm, not
  through novelty display typography spread across the app
- public-facing surfaces may carry slightly more editorial contrast than
  dashboard/admin surfaces, but typography should still feel related
- preserve the repo rule that hierarchy comes from size, weight, spacing, and
  contrast rather than tracking-heavy or all-caps UI labels
- lean toward confident, clean typography rather than ornamental type moments

### Surface And Material Direction

- surfaces should feel slightly richer than the current neutral baseline, but
  still restrained
- emphasize material shifts through:
  - background tint
  - border hierarchy
  - shell separation
  - selective shadow
  rather than gradients or glass treatments
- default surface posture should feel more like warm paper and ink than bright
  product chrome
- public browse surfaces can carry a little more atmosphere than internal app
  shells, but both must still live inside the same family
- hero and promotional support tokens must remain isolated from the default
  card/surface layer

### Radius And Density Direction

- preserve the moderate radius posture established in the visual-foundation
  pass
- any theme refresh should tune radius and density as a family, not per
  component
- public browse may breathe a little more than dashboard/admin, but the delta
  should feel intentional rather than like two unrelated design systems

### Interaction Direction

- keep interactive emphasis crisp, semantic, and product-grade
- buttons, inputs, dropdowns, and search controls should continue to read as a
  shared family
- theme refresh should not introduce route-owned hover/focus styles or
  decorative interaction flourishes as substitutes for semantic roles
- focus visibility must stay reliable under the refreshed theme, especially on
  warm or tinted surfaces

### Theme Non-Goals

- do not reopen token taxonomy, DS barrel boundaries, or layout-helper
  boundary work that is already complete
- do not use this theme plan to silently redesign discover, dashboard, or
  admin routes in bulk
- do not let brand mood erase operational clarity
- do not treat a theme refresh as permission to copy Primer, Atlassian, or
  Radix aesthetics directly
- do not turn the app into a colorful poster system; keep accents supporting,
  not dominant

### Decision Guardrails

- first choose one narrow implementation slice that can express the theme brief
  without forcing a broad rollout
- good candidate slices should stay in shared primitives or shared shells
  before route families
- a theme slice should prove one of these clearly:
  - brand mood through surfaces
  - control-family cohesion under the refreshed theme
  - shared chrome character under the refreshed theme
- route-level rollout stays out of scope until a narrow slice is landed and
  reviewed

### Theme Training Rule

Do not commit new theme colors, HSL ramps, or default runtime surface values
until the user has explicitly trained and approved the target palette posture.

The detailed approval flow, review vocabulary, and posture rules now live in
[theme-playbook.md](./theme-playbook.md).

### Locked First Foundation Slice

The first visual-foundation implementation slice is now locked to:

- `Button + Input/SearchInput visual foundation calibration`

Why this slice is first:

- it is the narrowest shared foundation surface that can express the locked
  brief through typography, radius, density, and interaction at the same time
- it already has direct Storybook coverage, which keeps review inside the
  primitive layer before any route pilot work
- it affects public browse, dashboard/admin, and auth flows through one shared
  primitive family instead of route-specific overrides
- it sharpens the product feel of the DS without reopening token naming,
  export-boundary, or layout-helper work that is already locked

In scope for this slice:

- `Button`
- `Input`
- `SearchInput`
- visual calibration only:
  - type sizing, weight, and rhythm inside those primitives
  - radius, padding, and control-height consistency
  - border, surface, hover, pressed, and focus treatment consistency
  - keeping `SearchInput` visibly part of the same family as `Input`

Out of scope for this slice:

- `Card` or `Dropdown` redesign
- route-level or page-level visual restyling
- token renames or new token slices
- brand/accent experimentation
- layout helper or export-boundary changes

This slice is now landed in the DS primitive layer:

- `Button`, `Input`, and `SearchInput` now read as one calmer control family
- default controls now share a tighter geometry contract around:
  - moderate radius
  - comfortable but not airy height/padding
  - semantic `ring` focus treatment
  - restrained hover/pressed emphasis instead of louder route-specific styling
- Storybook review for this slice should happen in the primitive stories before
  any route pilot or second primitive slice is chosen

### Post-Slice Review Decision

The post-slice review decision is now locked to:

- stop foundation expansion here for this pass
- do not open a second primitive slice yet
- move the plan forward to a route-pilot decision from this landed baseline

Why this is the correct stopping point:

- the first slice already expresses the locked brief through the highest-traffic
  control family without reopening token or route work
- taking `Card + Dropdown` immediately would broaden the pass before the team
  has decided whether a route pilot is more valuable than another primitive pass
- this keeps the visual-foundation plan honest: one narrow slice landed, then
  reassess before widening scope

### Current Overlap To Avoid Replanning

- `colorScales.primary`, `colorScales.brand`, and parts of `colorScales.accent`
  still overlap conceptually. The current contract already treats `brand` as
  the primitive hue family and `primary` as the semantic action role; do not
  re-open that distinction casually.
- `themeColors.accent` and the colorful named accent hues are not the same
  concept. Keep the runtime semantic accent neutral and treat colorful accents
  as optional/product-level hues only.
- Layout responsibilities are now tighter, but still need discipline:
  - `Container` = max-width plus horizontal page inset
  - `PageContainer` = horizontal page inset only
  - `PageContent*` = width clamps only, to be composed inside `PageContainer`
  - `Sidebar*` = dashboard/app-chrome primitives, not general page-width helpers
  Keep future layout passes inside those boundaries instead of adding more wrappers.
- Product-bound DS exports (`ResourceCard`, `FileUploadWidget`,
  `NotificationButton`, `PriceBadge`, `PriceLabel`, `PickerControls`) are
  intentionally reused but should not be mistaken for generic primitives. They
  now live on the explicit `@/design-system/product` surface instead of the
  foundation/composed barrels.

## Token Migration Contract

### Current Token Inventory

- `colors.ts`
  - `colorScales`: primitive ramps and named accent hues
  - `semanticColors`: JS-readable semantic roles used directly in a few
    surfaces such as `HeroSurface`
  - `themeColors`: light/dark HSL runtime roles mirrored into `globals.css`
  - `colorAliases`: compatibility aliases layered on top of semantic roles
- `spacing.ts`
  - compact spacing scale used by DS docs and future layout mapping
- `radius.ts`
  - shared radius scale for component shells and pills
- `typography.ts`
  - font families, sizes, line-heights, letter-spacing, font weights, and the
    `typography.scale` contract used by DS docs
- `hero.ts`
  - hero-only spacing, radius, and typography support tokens

### Semantic Roles In Live Use

- `themeColors.light` and `themeColors.dark` are the runtime theme contract.
  `src/app/globals.css` mirrors these values into `--background`, `--primary`,
  `--border`, `--sidebar-*`, and related CSS custom properties.
- `tailwind.config.ts` consumes the token layer to expose the current utility
  namespaces: `border`, `input`, `background`, `foreground`, `primary`,
  `secondary`, `muted`, `accent`, `destructive`, `card`, `popover`, `neutral`,
  `surface`, `brand`, `highlight`, `success`, `warning`, `info`, `danger`,
  `bg`, and `text`.
- `semanticColors` is imported directly on marketplace hero surfaces for roles
  such as `heroBackgroundSubtle`, `heroPanel`, `heroChip`, and `textPrimary`.
- `colorScales` is still imported directly in a small number of product shells
  and skeletons for explicit brand fills, most notably the `/resources` route
  hero/skeleton treatment.

### Duplicate Or Ambiguous Areas

- `colorScales.primary` and `colorScales.brand` are currently the same hue
  family. The migration contract treats `brand` as the primitive hue scale and
  `primary` as the semantic action role, not as two independent color systems.
- `colorScales.accent` is overloaded:
  - numeric values duplicate the primary/brand family
  - named hues (`blue`, `orange`, `yellow`) behave more like exploratory
    product accents than a single semantic role
  - `themeColors.accent` meanwhile represents a neutral surface role, not the
    colorful accent scale
- `semanticColors.primary` and `themeColors.light.primary` do not currently
  point to the same underlying value. The runtime HSL theme contract is the
  user-facing truth for utilities like `bg-primary` and `text-primary`.
- `colorAliases` duplicates several semantic roles for compatibility:
  `foreground`, `cardForeground`, `secondaryForeground`, and
  `accentForeground` all collapse to `textPrimary`; `secondary`, `muted`, and
  `accent` all collapse to the same surface role; `input` collapses to
  `border`; `ring` collapses to `primary`.
- `radius.lg` and `radius.xl` currently resolve to the same pixel value. This
  is allowed for now, but should be treated as a sizing contract that may be
  tightened later rather than as two intentionally distinct visual sizes.
- `globals.css` mirrors theme, typography, and radius values manually. The
  token files remain canonical; `globals.css` is a runtime mirror, not an
  independent authoring source.

### What The Next Token Pass May Change

- rebalance underlying values for semantic roles while preserving the current
  exported token file structure
- reduce direct product usage of `colorScales.*` in favor of semantic roles
  where the surface is no longer intentionally brand-art-directed
- document or collapse duplicate alias behavior where the public API can stay
  stable
- tighten the distinction between:
  - primitive hue scales (`brand`, `surface`, `neutral`, status ramps)
  - semantic runtime roles (`primary`, `border`, `background`, `muted`,
    `sidebar`, `hero`)

### What The Next Token Pass Must Not Change

- do not rename token files or top-level barrel exports in the first migration
  pass
- do not rename runtime CSS custom properties such as `--primary`,
  `--border-subtle`, `--sidebar-primary`, or the current Tailwind utility
  namespaces in the first migration pass
- do not merge hero support tokens into the generic surface token layer; hero
  remains a separate support family
- do not treat product-bound component visuals as proof that a primitive token
  should be renamed; first move product surfaces toward semantic roles, then
  decide whether a token rename is warranted

## Verification And Adjacent References

- Run `npm run storybook:smoke` when DS primitives or DS components gain new
  stories, lose stories, or change shared visual contracts that should stay
  reviewable in isolation.
- Run `npm run tokens:audit` when token files, token exports, or token inventory
  wording change.
- Run `npm run figma-map:check` when shared DS component files or reusable Figma
  library components are added or renamed.
- Use `/design-system.md` for Figma handoff and reconstruction guidance.
- Use `/figma-component-map.md` for the live Figma node-to-code registry.
- Use `krukraft-ai-contexts/06-design-system.md` only as an agent digest, not
  as the primary DS reference.
