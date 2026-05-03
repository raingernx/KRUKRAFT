## Krukraft Design System

This file is the canonical Figma reconstruction and handoff reference for the
shared design system.

What this file owns:
- Figma source-of-truth order
- Figma ownership rules
- token and variable mirroring guidance
- component/property naming guidance
- Figma implementation fidelity workflow
- handoff checklist

What this file does not own:
- the code-side DS inventory or ownership notes
- the live Figma node registry
- agent-only implementation history

When this file conflicts with code, the code wins.

## Source Of Truth

Priority order:

1. `src/design-system/*`
2. `src/components/resources/ResourceCard.tsx` for the marketplace card
3. `src/design-system/README.md`
4. `design-system.md`
5. `figma-component-map.md`
6. `krukraft-ai-contexts/06-design-system.md`
7. this file

Live Figma source-of-truth file:

- `Krukraft Theme Lab Source-of-Truth`
- [https://www.figma.com/design/koZEgVUfQhNEQmXISNQx56](https://www.figma.com/design/koZEgVUfQhNEQmXISNQx56)
- The live library now sits in the shared Team project, not in personal Drafts.

Validation:

- `npm run figma-map:check`
- `npm run tokens:audit`

Numeric contract template:

- `docs/figma-numeric-contracts.md`
- use this file when a Figma-backed component needs a metadata-first
  implementation pass with explicit width/type/gap/dismiss numbers before code
  changes
- for non-trivial Figma-to-code implementation, refresh the relevant contract
  block in this file before or alongside the runtime patch; do not treat the
  contract doc as optional after-the-fact notes
- repo checks now enforce this for tracked runtime owners:
  - `npm run figma-contracts:check`
  - `npm run figma-contracts:check:staged`
  - `npm run figma-contracts:check:staged:strict`

Do not use `src/components/ui/*` as the default design-system source. Those
files are compatibility shims or implementation details unless the primitive
layer itself is being maintained.

## Current Design-System Structure

### Tokens

- `src/design-system/tokens/colors.ts`
- `src/design-system/tokens/spacing.ts`
- `src/design-system/tokens/radius.ts`
- `src/design-system/tokens/typography.ts`
- `src/design-system/tokens/hero.ts`

### Figma Mirroring Targets

- primitive and semantic color collections
- spacing, radius, and typography collections
- hero support token collection
- reusable component-set properties that map cleanly to code props
- runtime radius tokens now mirror `radius/sm+ = 12px` between `sm` and `md`,
  while `radius/xs = 4px` remains Figma-first only

## Figma Ownership Rules

### Canonical Slot Proofs

In canonical DS/component boards, slot proofs must use one of these two paths
only:

- a DS-backed component or recipe that already exists in the file
- a neutral placeholder that is clearly labeled as a slot

Do not invent fake CTA buttons, fake icons, or product-looking example chrome
just to make a board feel complete. If the canonical file does not already have
the right DS-backed example, leave the slot as a neutral placeholder instead of
drawing a fake final UI.

### Treat as generic design-system library components

- `Button`
- `Badge`
- `Card`
- `Input`
- `Textarea`
- `Select`
- `Switch`
- `Dropdown`
- `Avatar`
- `Modal`
- `EmptyState`
- `DataPanelTable`
- `SectionHeader`
- `FormSection`
- `Pagination`
- `RowActions`
- `LoadingSkeleton`
- layout helpers under `src/design-system/layout/*`

The canonical Figma file now covers `Avatar`, `Switch`, `Modal`, and
`LoadingSkeleton` directly on
`DS Primitives`:

- `Avatar / Foundations / Light`
- `Avatar / Foundations / Dark`
- nested `Avatar / Size` and `Avatar / Source` component sets
- the current slice locks the shared `24 / 32 / 40 / 56` ladder plus
  image/name/email/explicit-initials/anonymous fallback states
- image and fallback states now share the same stroked circular shell posture
  in both Figma and runtime code
- runtime-only `28 / 36 / 72 / 104` mounts remain product-owned posture
  extensions until avatar sizing graduates into a shared token ladder
- `Switch / Foundations / Light`
- `Switch / Foundations / Dark`
- nested `Switch / State` component sets
- the switch slice locks the current runtime `46×24` track, `20×20` thumb, and
  checked/unchecked + disabled visual states without inventing a broader
  control-size ladder around the primitive
- `Modal / Foundations / Light`
- `Modal / Foundations / Dark`
- nested `Modal / Size` component sets
- the modal slice locks the shared runtime `384 / 448 / 512 / 576` width
  ladder, centered surface shell, close affordance, and header/body/footer rail
  structure without promoting route-owned form geometry into the primitive
- the 2026-05-01 re-audit confirms a user-led visual refresh on the light/dark
  boards preserved that same bounded contract; the live dark size set now sits
  under refreshed ids while the board-level confirm/cancel pair remains an
  illustrative shell example rather than primitive-owned button semantics
- the current Figma-only gap is explicit: divider rails still bind to
  `neutral/line` because the canonical file does not yet expose a separate
  semantic `border/subtle` variable, while overlay tint, portal motion, and
  button semantics stay runtime-owned
- the avatar fallback shell still carries one explicit Figma token gap:
  a narrow local brand gradient plus proportional initials sizing because the
  canonical file does not yet expose avatar-specific gradient/type tokens
- `LoadingSkeleton / Foundations / Light`
- `LoadingSkeleton / Foundations / Dark`
- nested `LoadingSkeleton / Shape` component sets
- the loading-skeleton slice locks only the shell-level primitive contract and
  a bounded `line | bar | circle | pill` posture set while keeping content
  block, table row, hero, and detail loading layouts route-owned
- the current Figma-only gap is explicit here too: the canonical file still
  lacks a dedicated semantic `bg/muted` variable, so the light board binds the
  shell fill to `bg/inset` and the dark board binds it to `border/default` to
  mirror the current runtime aliasing
- `Icon / Foundations / Light`
- `Icon / Foundations / Dark`
- the icon slice is intentionally a usage/foundations board, not a new glyph
  catalog or a standalone `Icon` primitive family
- it locks the shared runtime adapter contract instead:
  - source family: `Phosphor`
  - default weight: `light`
  - shared size ladder: `14 / 16 / 20 / 24`
  - semantic tone ladder:
    `fg/default`, `fg/muted`, `fg/subtle`, `fg/on-fill-dark`,
    `fg/on-fill-light`
  - bounded context ladder:
    `dense row action`, `default UI`, `support action`, `section support`
- the first runtime cleanup pass after that foundations slice should stay
  narrow too:
  shared upload/picker/dropzone surfaces may use semantic `primary` emphasis
  when they need stronger icon or border emphasis, but they should not keep
  reaching for `brand-*` aliases directly
- the next product-bound follow-up after that shared pass should stay narrow
  too:
  admin resource picker surfaces may use semantic `primary` and `ring`
  emphasis, but they should not keep reaching for `brand-*` aliases directly
- the next marketplace follow-up after that should stay narrow too:
  `HeroSearch` overlay affordances may use semantic `primary` emphasis for
  browse icons, fallback file glyphs, and bottom CTA text, but they should not
  keep reaching for `brand-*` aliases directly
- the next admin status-tone follow-up after that should stay narrow too:
  `NotificationItem` should map `success | info | warning | error` explicitly
  to semantic status tokens rather than mixing `emerald/red/primary` classes or
  silently collapsing `warning` into the `info` posture
- once that mapping is landed, non-production runtime proof should reuse a
  bounded harness rather than mutate live admin data ad hoc:
  `/dev/notifications` is now the repo-owned route for browser proof of the
  shared notification stack and bell surfaces across
  `success | info | warning | error`; append
  `?scenario=success|info|warning|error|all` when the proof should fire on
  load instead of relying on manual clicking
- canonical Figma coverage should stay equally narrow:
  `DS Components` now carries paired `NotificationItem / Foundations / Light`
  and `NotificationItem / Foundations / Dark` boards plus light/dark
  `NotificationItem / Variant / Source` sets. The board owns only the compact
  status shell, icon wrapper, title/body rhythm, optional inline action lane,
  and dismiss affordance. The current runtime now mirrors that bounded shell
  directly too: a compact `325px` item width, shared `text-title-sm`
  (`16/24`) title copy, `14/20` secondary copy plus inline action text, `8px`
  shell radius, `20px` status glyphs inside `32px` wrappers, and the compact
  inline `20px` dismiss affordance instead of the older absolute close button.
  The canonical Figma source set should bind that title copy through dedicated
  `type/title-sm/size` + `type/title-sm/line` variables instead of local
  `16/24` overrides. Bell dropdown behavior, unread counts, stack order, and
  queue timing remain runtime-owned and should not be promoted into this board
- the same narrow rule now applies to the product-bound bell trigger too:
  `DS Components` carries paired `NotificationButton / Foundations / Light`
  (`1489:194`) and `NotificationButton / Foundations / Dark` (`1489:284`)
  boards plus light/dark `NotificationButton / Variant / Source` sets
  (`1496:72`, `1496:143`). That board owns only the compact `40px` bell shell,
  the `20px` Phosphor-light bell glyph, and the sibling unread-badge posture
  for `count=0|3|9+`. Bell dropdown behavior, unread transitions, and
  notification-row rendering remain runtime-owned and should not be promoted
  into this board either
- the same bounded rule now applies to the admin picker family:
  `DS Components` carries paired `PickerControls / Foundations / Light`
  (`1498:194`) and `PickerControls / Foundations / Dark` (`1498:257`) boards.
  That board now proves the bounded admin `images branch` first, then the
  shared action-row posture, compact preview/media shells, and
  `default|active|reject` dropzone states that
  `src/design-system/components/PickerControls.tsx` actually exports. The
  nested `Image links` editor is shown there as context only, not as a promoted
  DS primitive. Upload progress, selected-file metadata, and async workflow
  messaging remain runtime-owned and should not be promoted into this board.
  The current token gaps stay explicit instead of silent: runtime still uses
  stronger border aliases plus local danger/red emphasis in some picker states,
  while canonical Figma currently stays on `border/default`, `primary/base`,
  and `state/danger-*` bindings
- the same bounded rule now applies to `FileUploadWidget` too:
  `DS Components` now carries paired `FileUploadWidget / Foundations / Light`
  (`1558:270`) and `FileUploadWidget / Foundations / Dark` (`1558:295`)
  boards. That board currently proves one narrow upload-branch shell only:
  shared dropzone posture, helper-copy rhythm, and disabled CTA treatment for
  the buyer-file branch. Upload progress, validation, upload-result states, and
  selected-file metadata remain runtime-owned and should not be promoted into
  this board yet
- the same bounded rule now applies to the creator delivery-source control too:
  `DS Components` now carries paired `Delivery method toggle / Foundations /
  Light` (`1562:2`) and `Delivery method toggle / Foundations / Dark`
  (`1562:25`) boards. That board proves only the segmented toggle shell,
  compact helper-copy pairing, and active/inactive posture for the buyer-file
  source switch. Upload/link branches, validation copy, and downstream file
  workflow stay route-owned and should not be smuggled into this board
- glyph choice remains product-owned and should keep flowing through the
  repo-owned `@/lib/icons` adapter instead of turning the canonical file into a
  copied Phosphor library dump
- `RevealImage` remains intentionally outside canonical Figma coverage for now:
  the runtime helper only wraps `next/image` for already-sized containers, and
  real callers still own shell geometry, crop, placeholder tone, overlay, and
  surrounding image chrome. Treat it as a code-owned helper until a bounded
  shared image contract exists beyond product/container examples.
- `ToastProvider` remains intentionally outside canonical Figma coverage too:
  the runtime primitive is a global provider + queue manager whose shared
  contract is dominated by timing, dismiss behavior, persistent-state defaults,
  and mount ownership rather than one bounded static visual shell.

The canonical Figma file now also covers `EmptyState` directly on
`DS Components`:

- `EmptyState / Foundations / Light`
- `EmptyState / Foundations / Dark`
- nested `EmptyState / Variant / Source` light/dark component sets
- the composed slice locks the bounded shared shell only:
  centered stack rhythm, dashed rounded container posture, and the shared
  `icon -> title -> description -> action` slot order
- the current source set now proves `variant=default`, `variant=minimal`, and
  `variant=compact-admin`
- `compact-admin` promotes the tighter inline empty posture from the creator
  `Image links` branch into the canonical shell contract without dragging the
  rest of the route-owned editor workflow into `EmptyState`
- icon examples on the board now reuse shared `Phosphor light` instances too,
  while the action lane reuses a shared `Button size="sm" variant="soft"`
  example with a generic `Soft action` label so the CTA stays softer than the
  message shell without dropping all the way to the quieter fill posture
- the current Figma-only gap is explicit here too:
  runtime asks for `border-border-subtle`, but the canonical file still lacks
  a semantic `border/subtle` variable, so the dashed rail currently binds to
  `border/default`

The canonical Figma file now also covers `SectionHeader` directly on
`DS Components`:

- `SectionHeader / Foundations / Light`
- `SectionHeader / Foundations / Dark`
- nested `SectionHeader / Variant / Source` light/dark component sets
- the composed slice locks the bounded shared shell only:
  eyebrow, title, description, alignment, and the optional trailing actions
  slot
- the current source pair grows into a bounded four-state proof:
  `default`, `centered`, `with-actions`, and `minimal`
- eyebrow examples now bind the shared `badge` size contract (`12/16`) rather
  than the larger label-sized posture so the context label steps back from the
  title without opening a new typography family
- hero backdrops, route-specific page-width choices, and live CTA semantics
  stay route-owned instead of becoming part of the composed contract
- the `with-actions` lane now reuses shared `Button size="md"` examples from
  the canonical button family with generic labels, so the board proves a real
  DS-backed action cluster without inventing route-specific CTA semantics

### Control Size Contract

When mapping control sizes into Figma:

- keep typography size and line-height in typography variables
- keep control sizing in component variants, not standalone `button/*` or
  `input/*` size variables
- bind those variants back to spacing, radius, and typography tokens

Current runtime contract to mirror:

- `Button`
  - `xs`: `h-8`, `px-3`, caption text
  - `sm`: `h-8`, `px-4`, body/sm text
  - `md`: `h-10`, `px-6`, body/sm text
  - `lg`: `h-12`, `px-8`, body/sm text
  - `icon`: square icon-only affordance
  - default density resolution: `comfortable -> md`, `compact -> sm`
- The canonical Figma `Button / Foundations` boards now keep a text-first
  neutral `tertiary` tone beside the bounded neutral `soft` tone, while
  runtime `Button` now mirrors that family directly through
  `primary | quiet | soft | tertiary`, with `ghost` kept only as a thin
  compatibility alias.
  `quiet` now keeps a dedicated `border/quiet` stroke derived from
  `primary/lift` instead of borrowing the generic `border/default` rail, but
  the shared button focus posture intentionally promotes the stroke to
  semantic `focus/ring` at `2px` instead of staying on the quieter rest rail.
  The older `sm=36` adoption gap is now closed too: runtime now uses the same
  `sm` height as the canonical `Button / Size` boards.
- The latest button-icon follow-up closes the old tertiary glyph drift too:
  the canonical `Button / Icon` boards now keep `tertiary` glyph fill and
  stroke on the same neutral token as the label in both light and dark modes,
  instead of leaving the icon stroke on a stale local accent.
- Use the current button decision table when mapping Figma posture into DS:
  - canonical Figma now uses `primary`, `quiet`, `soft`, and `tertiary`
  - runtime now exposes `primary`, `quiet`, `soft`, and `tertiary`
  - `ghost` survives only as a compatibility alias, not as the canonical tone
  - `outline` remains the bordered fallback and should absorb most existing
    table / inline management actions before a new family member is invented
  - table row actions, pagination items, and panel CTAs should start life as
    recipes on top of `outline` / `tertiary` / `soft` posture rather than
    immediately becoming new top-level variants
  - the current Figma recipe direction now locks `DataPanelTable` row actions,
    pagination items, and panel CTAs to a rounded-rect `radius/sm (8px)`
    shape instead of the pill geometry used by the core family; row actions
    and pagination stay outline-adjacent while panel CTAs use the calmer
    bounded-neutral `soft` tone. Row-action proof now lives in both places
    that matter too: `Button States` carries a dedicated `RowAction / State`
    set beside the core matrix, sourced from the live `Edit / Open` posture,
    while the row-action recipe card keeps both an `Edit / Open` example row
    and that same `Default / Hover / Focus / Pressed / Disabled` state strip
    so the posture and its states stay visible together
  - the first runtime adoption slice now mirrors that recipe without
    widening the whole button family:
    - `RowActionButton size="md"` carries the 40px rounded-rect posture
      and now follows the same row-action state ladder as Figma:
      transparent rest shell on `border/default`, `bg/inset` on
      hover/pressed, `border primary` on focus, and `fg/subtle` on disabled
    - `PaginationButton size="md"` carries the matching page-item posture and
      now supports `asChild` for route-owned link pagination
    - dashboard creator-resources `DataPanelTable` is the first live consumer;
      compact `sm` helper postures stay available until a wider rollout is
      explicitly proven
  - the first admin rollout proof keeps that same posture opt-in instead of
    silently widening every admin control cluster:
    - `/admin/users` now opts into `RowActionButton size="md"`
    - `/admin/audit` now opts into `TablePagination buttonSize="md"`
    - `/admin/tags` intentionally stays on compact `sm` row actions because
      its inline edit/save/delete clusters are denser than the table-action
      recipe proved in `DataPanelTable`
  - the follow-up simple-admin rollout keeps the same rule:
    - `/admin/categories`, `/admin/reviews`, `/admin/resources/trash`, and
      `/admin/resources/[id]/versions` now opt into `RowActionButton size="md"`
      because each surface behaves like a light table-action column rather than
      a dense multi-action editor cluster
    - `/admin/resources/[id]/versions` now also drops the older
      `quiet / tertiary` button overrides and rides the row-action
      `default / muted` ladder directly
    - `/admin/resources` main table still stays out of scope because its
      publish/restore/edit/menu cluster is denser and would need a separate
      rollout decision
  - the dense-holdout lockdown follow-up now turns those remaining exceptions
    into explicit code-level contract instead of leaving them on implicit
    defaults:
    - `/admin/resources` main table now passes `size="sm"` on every
      `RowActionButton` and `RowActionMenuTrigger`
    - `/admin/tags` now passes `size="sm"` on every inline row action
    - `CreatorResourceStatusButton` now passes `size="sm"` too, even though
      no live route mount was found during that rollout audit
- If that button-size pass is reopened, the current recommended path is to
  trial `xs=32 / sm=36 / md=40 / lg=48`, keep `density=\"compact\" -> xs`
  during the first rollout proof, and leave `Input` / `SearchInput` on the
  existing field ladder until button impact is proven separately.
- `Input` / field family
  - `sm`: `h-8`, `px-3`
  - `md`: `h-10`, `px-4`
  - `lg`: `h-12`, `px-4`
  - `field`: `h-14`, `px-4`
  - default density resolution: `comfortable -> field`, `compact -> sm`
- `SearchInput`
  - `variant=\"default\"` should ride the same field-size contract as `Input`
  - `variant=\"hero\"` is the only allowed search-shell exception
- `Avatar`
  - canonical Figma ladder: `24`, `32`, `40`, `56`
  - preserve the current shared fallback order in docs and Figma source:
    image → name-derived initials → email-derived initials → explicit initials
    override → anonymous default
  - treat `28`, `36`, `72`, and `104` as runtime/product-owned posture
    extensions for now, not proof that the shared primitive already has a
    settled size-family contract
- Shared admin table header cells should preserve DOM attributes such as
  `data-testid` and `scope` so runtime proofs and accessibility semantics stay
  attached to the shared contract rather than pushing routes back to bespoke
  `<th>` markup.
- `/admin/reviews` now follows that same contract: its table headers stay on
  shared `DataTableHeadCell`, its summary metrics no longer rely on
  `tracking-tight`, and its fallback-shell eyebrow/title no longer use tracked
  text either.
- `/admin/orders` now follows that same contract too: its summary metrics no
  longer rely on `tracking-tight`, and its table headers now prove the shared
  `DataTableHeadCell` contract through route-level hooks.
- `/dashboard/creator/apply` is now the first live creator color-token proof
  route: pending, approved, and rejected state panels use semantic
  warning/success/danger emphasis surfaces, and the rejected feedback rail uses
  the same semantic danger family rather than a lighter route-owned alert fill.
- `/dashboard/creator/resources/*` is now the next live creator color-token
  proof route: the editor helper/callout icons now use semantic `primary`
  instead of route-owned brand color, and preview-image validation copy now
  uses semantic destructive text instead of route-owned red utility classes.
- `/dashboard/creator/resources/new` also now proves the first live
  publish/readiness feedback slice: `CreatorPublishReadiness` warning/ready
  states and the `CreatorPublishSuccessModal` success indicator both ride
  semantic warning/success families on the real publish flow.
- `/dashboard/creator/profile` now proves the next live creator color-token
  slice too: `CreatorProfileForm` asset-ready statuses ride semantic
  success/warning families, the profile-save success message now uses a
  semantic success surface, and the profile-save error rail now uses the same
  semantic danger surface family as the creator-apply slice.
- The live dashboard settings loading shell now mirrors the same shared
  dashboard page-header contract as the resolved settings route instead of
  keeping a badge-first intro copy; any remaining badge-led dashboard intro
  demos should be treated as preview-only exceptions until a separate cleanup
  pass is explicitly chosen.

### Treat as product-bound components, not generic library foundations

- `ResourceCard`
- `FileUploadWidget`
- `NotificationButton`
- `PriceBadge`
- `PriceLabel`
- `PickerControls`

These may still be re-exported from the DS barrel, but their canonical design
ownership should stay on product or workflow pages rather than in Figma
foundations/primitives.

### Do not model as library source of truth

- `src/components/ui/*`
- page-level feature layouts under `src/app/*`
- one-off feature wrappers or compatibility re-exports

## Foundations To Mirror In Figma

### Color Collections

Mirror the repo token families into the live file using the current split:

- `Krukraft / Colors / Primitives`
- `Krukraft / Colors / Semantic`
- `Krukraft / Colors / Theme`
- `Krukraft / Spacing`
- `Krukraft / Radius`
- `Krukraft / Typography`
- `Krukraft / Hero`

Prefer semantic bindings in layouts and components:

- `background`
- `card`
- `surface`
- `border`
- `textPrimary`
- `textSecondary`
- `textMuted`
- `primary`
- `heroBackground`
- `heroBackgroundSubtle`
- `heroPanel`
- `heroPanelForeground`
- `heroPanelBorder`
- `heroChip`
- `heroChipForeground`
- `success`
- `warning`
- `info`
- `danger`

For dark-shell parity, preserve semantic hierarchy instead of flattening all
borders and selected states to one bright treatment:

- `border-border-subtle` for passive shells and soft dividers
- `border-border` for chrome and structural boundaries
- `border-border-strong` / `border-input` for controls
- theme-aware emphasis surfaces for selected rows, chips, and feedback states
- the canonical Figma semantic layer now carries
  `state/selected-fill` and `state/selected-stroke` as the default
  selected-surface family, while active chip labels stay on `fg/default`; use
  that combination instead of rebinding selected UI directly to raw
  `primary/*` primitives or overloading `action/*` / `focus/*` semantics

Hero surfaces should use the hero semantic layer instead of pretending they are
generic cards.

### Token Migration Contract

Use this contract while the code-side token migration is still being locked:

- treat `brand` as the primitive hue family and `primary` as the semantic
  action role
- do not represent `brand` and `primary` as two separate semantic concepts in
  Figma
- keep `accent` split conceptually:
  - semantic `accent` in the theme/runtime layer remains a neutral support
    surface
  - colorful named accent hues belong to primitive/exploratory palettes, not to
    the default semantic layout layer
- keep mirroring both primitive ramps and semantic roles, but bind layouts and
  components to semantic roles first
- keep hero support tokens (`heroBackground*`, `heroPanel*`, `heroChip*`,
  `src/design-system/tokens/hero.ts`) separate from generic card/surface tokens
- do not rename collection groups, semantic role names, or CSS-variable-backed
  theme roles in Figma until the code-side token contract explicitly changes
- if a product screen currently depends on a raw primitive scale such as
  `colorScales.brand[300]`, treat that as migration debt to be documented, not
  as proof that the primitive scale itself should become the semantic default

### Typography And Property Naming

For reusable Figma component sets:

- mirror real code prop names where practical, such as `variant`, `size`,
  `align`, and `submitButton`
- keep code-backed option values lower-case when the code prop values are
  lower-case, such as `primary`, `outline`, `sm`, `md`, `flat`, and `card`
- if a Figma-only state is needed, name it as a UI state instead of overloading
  a real code prop

## Component Mapping Guidance

- `figma-component-map.md` is the canonical registry for Figma page, node ID,
  code owner path, and mapping status.
- Prefer repo-canonical paths instead of compatibility wrappers.
- Prefer the implementation owner path even when a component is re-exported
  from `@/design-system`.
- Product flow exemplars can live in the DS Figma file, but they are not the
  registry itself.
- Keep `Badge` and `Chip` as separate DS contracts:
  - `Badge` = non-interactive semantic/status label
  - `Chip` = interactive/removable/filter/navigation token surface
- Keep one shared interactive focus contract across DS surfaces unless a board
  explicitly documents an exception:
  `focus-visible = focus/ring at 2px`.
- Do not remap focus strokes to `action/*`, `state/*`, or product-local tones
  just because those colors feel visually close. Focus is its own semantic
  contract and should be mirrored the same way in Figma and runtime.
- Canonical Figma coverage now exists for both sides of that split:
  `Badge / Foundations / Light|Dark` remains the non-interactive label source,
  while `Chip / Foundations / Light|Dark` now documents the interactive token
  side and is mirrored by the shared runtime `src/design-system/primitives/Chip.tsx`
  primitive.
- The current `Chip / Foundations` slice is intentionally narrow:
  it proves `Navigation chip`, `Filter chip`, and `Removable chip` rows only,
  each through bounded state strips rather than through a larger product scene.
- Selected chip states should keep sharing the same selected token family
  across those rows instead of inventing separate active tones per chip type.
- Runtime now aliases that selected family through
  `--state-selected-fill` and `--state-selected-stroke`, while active chip
  labels stay on `fg/default`, so chip-active UI does not rebind itself to raw
  `primary/*` utilities.
- Runtime now has a shared `Chip.tsx` primitive, and live adoption routes
  marketplace category/search chips, dashboard library filters, admin removable
  filters and analytics presets, and resource-detail token links through that
  same `40px` family. Compact admin pills should stay normalized into that
  canonical shell instead of reopening a second chip-size ladder prematurely.
- The canonical Figma `Badge` base now lives in `Badge / Foundations / Light`
  and `Badge / Foundations / Dark`, with source sets that cover `neutral`,
  `info`, `success`, `warning`, `featured`, `destructive`, and `outline`.
- Those `Badge / Foundations` boards now also include a usage-only
  `resource-card badge proofs` block: top-left status proves `Owned`, `New`,
  and `Featured`, while top-right highlight proves `Trending` plus a generic
  highlight posture (`Recommended`) without turning those product labels into
  new primitive variants.
- The latest canonical badge tuning now separates the two warm semantics on
  purpose: `warning` stays alert through `bg/inset` plus
  `support/warning/base|dust`, while `featured` stays softer and more editorial
  through `accent/sand/wash` fill with `accent/sand/dust` stroke and
  `accent/sand/base` text. Keep that split intact instead of collapsing both
  variants back onto the same warm recipe.
- Runtime `Badge.tsx` now stays on that same canonical set and follows the
  `warning` / `featured` split directly; `featured` should consume the sand
  family in runtime through `accent-50` fill, `accent-300` stroke, and
  `accent-200` text instead of older yellow alias classes. The badge status
  variants now also use dedicated runtime theme vars for `support/info/*`,
  `support/success/*`, `support/warning/*`, and `state/danger/*` so dark-mode
  badge tones can match canonical Figma instead of falling back to light-only
  generic scales.
- Runtime typography now follows the same base family as canonical Figma too:
  shared `heading`, `body`, and `ui` tokens load `IBM Plex Sans Thai` with the
  same two-weight contract (`400` Regular, `600` SemiBold) instead of the older
  `Noto Sans Thai` runtime stack.
- The earlier runtime-only badge aliases (`owned`, `new`, `free`, `default`,
  `secondary`, `ghost`, `link`) have now been removed from the shared primitive
  contract; future product-specific label needs should be solved by deliberate
  remaps or separate product-bound components, not by reopening ad-hoc badge
  variants.
- `PillLink` is now a separate narrow runtime primitive for section-header
  browse actions such as `View all` and `Browse everything`.
- Canonical Figma coverage now exists for that slice too:
  `DS Primitives` carries `PillLink / Foundations / Light` and
  `PillLink / Foundations / Dark`, while runtime mirrors the same bounded
  family through `src/design-system/primitives/PillLink.tsx`.
- The current `PillLink / Foundations` slice stays intentionally narrow:
  it proves `section-header pill-link` only, with `default`, `hover`,
  `focus-visible`, and `disabled` states on the compact `32px` shell.
- The current canonical source sets now live at light `1842:408` and dark
  `1842:466`, with a `View all` label + shared `ArrowRight` icon instance on
  the same `32px` shell. The current board geometry also follows the standard
  foundations pattern now: usage card `24` padding / `8` gap, variants card
  `32` padding / `24` gap, and source-set shell `12` padding / `12` gap.
  Current token bindings are explicit:
  `default = action/primary`, `hover = bg/inset + fg/default`,
  `focus-visible = focus/ring 2px + action/primary`, and
  `disabled = fg/subtle`.
- The shell contract is now explicitly left/right-asymmetric for browse-link
  posture instead of chip-like symmetry: `height=32`,
  `padding = 4 / 12 / 4 / 16`, `label-icon gap = 8`, and `icon = 14`.
- Its scope is intentionally smaller than `Chip`: treat it as a
  section-header secondary-navigation affordance only. Do not pull
  empty-state pill links, card-footer text CTAs, or read-only tokens into this
  primitive until those families are audited on their own terms.
- `EmptyStatePillLink` is now a separate DS primitive for empty-state
  browse/recovery actions such as `Clear filters` and
  `Explore all resources`.
- Canonical Figma coverage now exists for that slice too:
  `DS Primitives` carries `EmptyStatePillLink / Foundations / Light` and
  `EmptyStatePillLink / Foundations / Dark`, while runtime mirrors the same
  bounded family through `src/design-system/primitives/EmptyStatePillLink.tsx`.
- The current foundations slice stays intentionally narrow:
  it proves one bordered `40px` empty-state shell only, with `default`,
  `hover`, `focus-visible`, and `disabled` states.
- The current canonical source sets now live at light `1854:432` and dark
  `1854:474`, with `Explore all resources` as the bounded label, no trailing
  icon, and shell geometry locked to `padding 8/16`, `height 40`, and
  `border/default` rest posture with `focus/ring 2px` on focus.
- Keep `EmptyStatePillLink` scoped to empty-state secondary actions only:
  runtime owners on `ResourceGrid` and `categories/[slug]` now reuse the same
  contract, while section-header browse links stay on `PillLink` and
  retry/error pairs remain on `Button`.
- `ReadOnlyToken` is now a separate canonical primitive for content metadata
  tokens such as `Test Prep learners` and `Self-paced revision`.
- The current canonical boards now live at light `1863:416` and dark
  `1863:442`, with `ReadOnlyToken / Content metadata / Source` proving the
  bounded `34px` shell (`space/12` currently bound on all four sides,
  `bg/inset`, `border/default`, `type/label` semibold text, no icon).
- Keep it scoped to read-only content metadata only:
  runtime adoption starts on the resource-detail identity-target lane, while
  creator-form context labels, badges, chips, and pill-links remain outside
  this family until those postures are promoted intentionally.
- The 2026-05-03 re-audit closes the Figma-side binding debt for this slice:
  light/dark source nodes now bind shell spacing and all painted/text
  properties to DS variables. Any remaining drift is runtime parity rather
  than missing Figma token binding.
- The 2026-04-29 badge residual cleanup closed the last canonical badge-board
  gaps too: the light/dark `Badge / Variant / Source` wrappers now sit at
  `cornerRadius=0`, and the seven badge labels now bind to dedicated
  `type/badge/size` + `type/badge/line` variables instead of local `12/16`
  overrides.
- Runtime `Badge.tsx` now locks the same `12/16` badge recipe at the root via
  shared badge font-size and line-height vars, so text-color variants no longer
  strip the canonical size/line-height contract through class merging, and the
  primitive now enforces the canonical `24px` shell height directly instead of
  leaving runtime badges at a shorter content-derived height.
- The current dark source set for that canonical badge block now lives at
  `1494:1803`; repo mapping should follow the live node instead of the earlier
  `746:208` / `736:206` ids from the first landing pass.
- Do not solve interactive chip needs by adding more `Badge` variants just
  because the silhouette is similar.
- The canonical Figma `FormSection` base now lives in
  `FormSection / Foundations / Light` and `FormSection / Foundations / Dark`,
  with source sets that cover only `variant=flat` and `variant=card`.
- The foundations boards now also carry usage-only optional-structure proofs
  for `flat / no-description` and `card / no-footer`; these examples exist to
  prove optional header/footer posture without widening the variant contract.
- Keep `flat` as the default divider-first settings/admin section shell and
  reserve `card` for clearly bounded secondary sections that intentionally sit
  on top of the `Card` + `Surface` family.
- The current canonical `FormSection` boards are now fully bound for live
  paints, text props, radius, and spacing. The remaining explicit gap is
  parity rather than missing bindings:
  - live Figma now normalizes former local title/label values onto shared
    `type/label` (`14/20`)
  - live Figma now normalizes former local `6px` and `20px` spacing onto
    shared `space/8` and `space/24`
  - runtime still carries narrower literal geometry in places
  - divider/footer separators still rely on `border/default` until a dedicated
    `border/subtle` semantic exists
- The current dark source set for that canonical `FormSection` block now lives
  at `746:275`; repo mapping should follow the live node instead of the older
  `759:252` id from the first landing pass.
- The canonical Figma `DataPanelTable` base now lives in
  `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark`,
  with source sets that stay intentionally shell-scoped instead of pretending to
  own every table schema.
- Those live light/dark source sets now reuse the shared `RowAction / State`
  default instances directly in their row-action lanes instead of generic
  quiet button placeholders, so the composed shell and the bounded row-action
  family read from the same canonical source.
- Keep the current `DataPanelTable` source set progressive rather than
  combinatorially exhaustive: it proves the shell combinations for
  `actions`, `toolbar`, and `footer`, while columns, table-head fills, row
  rendering, empty-state content, and business actions stay route-owned.
- Treat the action controls shown with `DataPanelTable` as a recipe posture,
  not as a new button family: row actions, pagination items, and panel CTAs
  should use the same rounded-rect `radius/sm (8px)` shape in Figma before
  any broader button-shape adoption is considered. Keep row actions and
  pagination outline-adjacent; use the quieter bounded-neutral `soft` tone for
  table-shell panel CTAs instead of primary pill emphasis.
- The current footer proof point should stay close to runtime usage too: use a
  muted metadata-note footer before inventing CTA-heavy footer recipes.
- The current canonical `DataPanelTable` board also keeps its token debt
  explicit:
  - the two `Showing latest 2 entries` footer-note copies still sit fully
    local for family/size/line-height/fill
  - the light/dark source-set wrapper frames still keep local `radius=5`
  - the shell copy itself still relies on local type recipes:
    - `16/20` titles
    - `14/20` descriptions, column labels, row meta, and updated dates
    - inherited `12/16` badge sizing from the shared badge recipe
  - runtime still asks for `border-subtle`
  - the table-head fill remains a route-owned local treatment rather than a
    shared semantic token
- The earlier `ghost action` footer study has now been folded into the Figma
  button source as a bounded neutral `soft` direction that now sits beside
  text-first `tertiary`, not the older `ghost` posture. That move is no longer
  Figma-only: runtime now adopts both `soft` and `tertiary` as real shared
  tones too. The old `sm=36` size trial is now landed in runtime as well, so
  the remaining follow-up is deprecating compatibility aliases rather than
  deciding whether the tone family itself belongs in shared UI.

## Figma Implementation Fidelity Workflow

When implementing or patching UI from Figma:

1. lock one canonical frame or variant
2. inspect important child nodes individually
3. inspect the surrounding section shell
4. patch code
5. sync skeleton/loading geometry
6. compare back to the same canonical frame again

Do not call a component or section “matched” or “1:1” unless that node-level
inspection loop has happened.

## Current Figma Progress

Use `figma-component-map.md` for the live registry status.

At a high level:

- the canonical Figma file is now `Krukraft Theme Lab Source-of-Truth`, not the
  older `Krukraft Design System` file previously referenced in repo docs
- the current canonical file now separates page roles explicitly:
  - `DS Foundations` (`13:20`) is the true base page and now holds only `5`
    top-level foundation frames: typography, color primitives, and
    spacing/radius
  - `DS Primitives` (`1037:312`) now holds `14` primitive component boards for
    `Button`, `Input / Search`, `Card`, `Dropdown`, `Badge`, `Select`, and
    `Textarea`
  - `DS Components` (`1037:313`) now holds `6` composed shared-component boards
    for `Surface`, `FormSection`, and `DataPanelTable`
  - `DS Parking / Legacy` (`1037:314`) is a non-canonical parking page for
    recovered orphan nodes that must stay off the live library pages
  - `Foundation Review` (`1041:312`) remains a review-only page with one
    top-level frame, not a reusable component library source
- `DS Foundations` is now the stronger token-bound page:
  - the older page-wide counts from the all-in-one foundations page are now
    obsolete after the 2026-04-30 page-role split
  - treat section-level audits, not frozen old page totals, as the source of
    truth going forward
  - the latest foundations re-audit also corrected the radius reading: the
    audited typography, color, and spacing/radius boards bind radius through
    per-corner variables, so those boards should not be treated as local-radius
    drift
  - the latest `Button / Foundations` re-audit confirmed that the light/dark
    header, usage, states, size, icon, and recipe cards all use semantic shell
    tokens rather than local paint overrides, and the old wrapper-radius caveat
    is now closed too: the live `Button / State`, `Button / Size`, and
    `Button / Icon` sets no longer show any non-zero local radius drift
  - the same re-audit also confirms the old dark `light recipe` subtitle drift
    is gone
  - that same re-audit also showed a live design-vs-runtime contract gap:
    Figma now expresses `quiet` / `tertiary` state foreground changes more
    explicitly than the current runtime `Button.tsx` variant contract does,
    and the runtime now mirrors that rename directly, so treat any remaining
    `ghost` references as compatibility cleanup rather than live DS drift
  - the tertiary icon audit is now closed too: the canonical `Button / Icon`
    derivatives no longer leave their glyph strokes on a stale orange local
    paint; label and icon now share the same neutral token in both modes
  - the current `Button recipes` card is now part of that audited truth too:
    `Row action` keeps an `Edit / Open` example row plus a compact
    `Default|Hover|Focus|Pressed|Disabled` state strip, `Pagination item`
    shares the same rounded-rect `radius/sm (8px)` geometry, and `Panel CTA`
    now follows the same rounded-rect table posture on the bounded-neutral
    `soft` tone instead of staying on the older primary-pill candidate
  - the latest `Input / Search` re-audit also confirmed that both
    `Input / State` / `SearchInput / State` and `Input / Size` /
    `SearchInput / Size` now use `radius/sm = 8px` across light and dark; repo
    runtime code no longer drifts uniformly:
    - `SearchInput variant="default"` now adopts the canonical `8px` radius
      shell at runtime
    - the first route proofs are `/dashboard/library` toolbar search
      (`40px / 8px`) and dashboard topbar search on that same
      `40px / 8px` ladder
    - the shared start/loading adornments on that branch now render through
      full-height wrappers, so the icon stays centered in toolbar/topbar mounts
      instead of collapsing into the top-left corner
    - the dashboard topbar clear action is now route-proved too after client
      hydration: the clear button appears, keeps `8px` radius, and resets the
      local query state
    - admin global search, admin users, admin resources, admin activity, and
      admin ranking now use the same `SearchInput` primitive too, so the shared
      default search posture is `40px / 8px` across dashboard/admin before
      route-owned exceptions
    - public `/resources` search remains a route-owned product override with
      `40px` height and pill geometry
    - dashboard route intros now normalize through the shared
      `DashboardRouteIntro` / `DashboardPageHeader` eyebrow-text pattern rather
      than route-owned `Badge` pills, and matching header CTAs use `md`
      posture by default
    - creator workspace now rides that same shared intro authority instead of a
      bespoke `Badge + h1 + sm CTA` block, and its loading companion inherits
      the same geometry
    - creator resource-form preview labels now also treat tracking as drift
      rather than as a creator-specific pattern, and label-adjacent emphasis in
      that form now prefers semantic `primary` / `danger` tokens over local
      `red`, `blue`, and `indigo` utilities
    - creator settings micro-labels now follow that same no-tracking rule on
      the visible `/dashboard/settings` route too; `Security` is no longer a
      route-owned uppercase/tracked exception
    - `/admin/creators` now routes its table headers back through the shared
      admin table contract and drops route-owned tracking on summary metrics,
      instead of keeping raw uppercase/tracking-heavy `<th>` copies
    - dashboard/admin shared product headers and sidebar labels now also treat
      tracking as opt-in instead of default: the shared `DashboardPageHeader`,
      `AdminPageHeader`, and `DashboardSidebar` patterns no longer inject
      letter-spacing into those labels/headings
    - `Input.tsx` no longer carries that older radius branch at runtime:
      the shared field primitive now enforces `radius/sm (8px)` directly, with
      `/admin/users` as the first proof route
  - that same control re-audit also keeps two narrow Figma gaps explicit
    instead of hiding them: the light/dark component-set wrappers still carry a
    local `cornerRadius=5`, and the `Clear` action label in the search-state
    explainer still uses a local `14/20` type recipe while staying bound for
    font family and text fill
  - the first follow-up control mapping beyond `Input / Search` now exists too:
    - `Select / Foundations / Light` and `Select / Foundations / Dark` now live
      under `994:244` and `994:421`
    - the verified reusable nodes are `Select / State` (`994:342`, `994:519`)
      and `Select / Size` (`994:366`, `994:543`)
    - the canonical `Select` contract intentionally inherits the shared field
      shell grammar (pill radius, shared height ladder, helper/error copy
      below the shell) and only adds the explicit caret affordance plus the
      deeper `paddingLeft=24` field start; option lists remain route-owned
    - the 2026-05-03 Figma binding pass closes the exact-match radius debt on
      those boards: usage cards and component-set cards now bind `radius/lg`,
      and field shells across the state + size ladders now bind
      `radius/pill`
    - the follow-up nearest-token binding pass closes the remaining
      wrapper/set drift too: light/dark `Select / State` and `Select / Size`
      now bind `radius/xs`, and the light/dark `Select / State` sets now bind
      `space/12` in place of the prior local `11px` gap
    - the latest padding pass now binds `paddingLeft=space/24` across both
      light/dark state + size ladders
    - the latest state-fill pass now binds both light/dark `hover` and
      `focus` shells to `bg/inset`
    - the latest caret pass now binds every `CaretDown` instance on the
      light/dark boards and source sets to `fg/subtle`
    - the latest size cleanup narrows the canonical `Select / Size` slice down
      to the two live sizes only: `md` as the shared default and `field` as
      the taller editor-grade shell
    - the shared runtime parity slice is now landed: `Select.tsx` matches the
      pill radius, `paddingLeft=24`, and inset hover/focus fill from the
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
    - `Textarea / Foundations / Light` and `Textarea / Foundations / Dark` now
      live under `1019:312` and `1019:433`
    - the verified reusable nodes are `Textarea / State`
      (`1019:386`, `1019:507`)
    - the canonical `Textarea` contract reuses the same quiet field-shell
      target and helper/error posture, but keeps rows, counters, max length,
      and resize behavior route-owned instead of inventing a fake size ladder
    - the first runtime parity slice is now live too:
      - `Select.tsx` now follows the canonical pill shell at runtime
      - `Textarea.tsx` now keeps the same `8px` target while preserving
        route-owned rows / counter / resize behavior
      - `/admin/settings` is the first proved route family because it mounts
        `Input`, `Select`, and `Textarea` together without product-owned search
        overrides
      - `/admin/resources` is now the first widened follow-up family: the
        resource form, listing filters, move-category modal, and bulk-upload
        editor all stay on the same shared `Select` / `Textarea` shell grammar
        while leaving route-owned JSON/editor coloration intact
      - the next narrowed widening follow-up is now the admin filter-shell
        bucket: `/admin/activity`, `/admin/audit`, and
        `/admin/analytics/ranking` all explicitly keep the same shared `Select`
        geometry (`40px` default shell, pill radius) without reopening
        creator-owned forms
      - the first creator-owned widened follow-up is now
        `/dashboard/creator/profile`: the storefront-status `Select` now
        follows the shared default `md` shell there, and the creator bio keeps
        the same `8px` `Textarea` shell while `min-height` plus the
        character-count affordance remain route-owned
      - the next creator-owned widened slice is now the metadata zone of
        `/dashboard/creator/resources/*`: the edit-only `status` select plus
        the shared `type` / `category` selects now keep the explicit `field`
        shell there, and the main `description` textarea stays on the shared
        multiline shell across both new and edit routes
      - the delivery/previews linked URL follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit keep the preview image URL
        rows plus the external file URL editor on the same shared
        `56px / 8px` `Input` shell
      - the bulk preview parser follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit prove that the bulk
        preview textarea already sits on the shared `Textarea` shell, while
        parsing, validation, apply-state, and cover-order side effects stay
        route-owned composite behavior
      - the creator upload-controls follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit prove the creator-owned
        delivery-source toggle plus the upload-branch wrapper shell without
        widening shared `FileUploadWidget` internals; canonical Figma now
        mirrors that split too by giving the toggle its own bounded
        `Delivery method toggle / Foundations` boards while keeping the upload
        branch on `FileUploadWidget / Foundations`
      - the next creator-owned control-styling follow-up is now closed too:
        `/dashboard/creator/resources/new` and edit prove the external-file
        action cluster (`Clear link`, `Edit`, `Open link`, and the
        uploaded-file guard action) on the explicit compact `40px / 8px`
        route-owned posture, while shared widget internals stay frozen
      - the first shared widget follow-up is now closed too:
        `/dashboard/creator/resources/new` and `/admin/resources/new` prove the
        shared pre-upload branch (`dropzone`, selected-file preview, upload
        CTA) without reopening creator-only wrappers
      - the next shared widget follow-up is now closed too:
        `/dashboard/creator/resources/[id]` and `/admin/resources/[id]` prove
        the uploaded-file card plus replace/remove posture without reopening
        creator-only wrappers or route-level flash messaging
      - the latest shared widget follow-ups are now closed too:
        - `/dashboard/creator/resources/new` and `/admin/resources/new` now
          prove the widget-owned success banner after upload completes
        - those same creator/admin create routes now also prove the shared
          oversize-validation error banner after selecting a file larger than
          `50 MB`
      - a later route-owned follow-up now also proves the draft-create /
        `saveFirstError` slice on those creator/admin create routes:
        - the shared widget now catches `onEnsureResourceId()` failures before
          upload starts
        - the visible copy still stays route-owned
          (`/api/creator/resources/draft` Thai payload vs
          `/api/admin/resources/draft` English fallback copy)
      - the next route-owned follow-up now also proves the backend
        `500`/fallback upload-failure slice on those creator/admin create
        routes:
        - the shared widget still owns the error-banner shell after upload
          starts
        - the visible copy still stays route-owned
          (`/api/creator/resources/upload` Thai fallback vs
          `/api/admin/resources/upload` English fallback copy)
      - the next route-owned follow-up now also proves the creator/admin `404`
        upload-not-found slice on those create routes:
        - the shared widget still owns the error-banner shell after upload
          starts
        - the visible copy still stays route-owned
          (`/api/creator/resources/upload` Thai not-found vs
          `/api/admin/resources/upload` English not-found)
      - the remaining `400` validation strings still stay shared service copy,
        and the first shared proof slice is now closed too:
        - creator/admin create routes both prove the shared `unsupported
          format` `400` branch after draft creation succeeds
        - the lower-signal `resourceId required`, empty-file, and invalid
          generated-key branches stay optional follow-up territory
      - route-level flash messaging is narrower too:
        - creator create now proves the route-owned remove-file failure
          message outside the widget shell
        - admin create does not expose a matching upload/remove flash slice
          beyond the already-frozen widget banners
      - the separate admin edit-flow follow-up is now closed too:
        - `/admin/resources/[id]` proves the route-owned remove-file
          success/error rail outside the shared widget shell
        - `FileUploadWidget` now preserves the uploaded card and suppresses
          dev-overlay escalation when that route-owned delete callback fails
  - the latest `Card / Foundations` cleanup also closed the old wrapper-radius
    debt on `Card / Size / Source`; the remaining card debt is now explicit and
    narrow:
    - local type sizes still drive the title/body/footer copy in the light/dark
      source sets even though font family, line height, and text fill are bound
    - the geometry still keeps intentional local values such as `space/20`,
      `space/10`, and the preview-stack arrangement
  - runtime `Card.tsx` has started adopting the same shell hierarchy by using
    `surface` for the card root and `inset` for the footer band
  - the latest `Dropdown / Foundations` shell re-audit also confirms that both
    light/dark study boards stay fully bound for all `23/23` text nodes across
    font family, font size, line height, and text fill, and all painted
    fills/strokes on those boards remain token-bound too
  - the remaining dropdown debt is now explicit and narrow instead of a broad
    shell-token concern:
    - the study containers `context scene` and `row calibration scene` still
      use local `20` radius
    - the default/unselected `menu row` shells still use local `12` radius
  - `Dropdown` still stays a verified study-board reference rather than a
    reusable component-set mapping; the current shell audit should not be read
    as proof that canonical dropdown variants or prop-driven component sets
    already exist in the file
  - the latest `Surface / Foundations` shell re-audit also confirms that both
    light/dark boards stay fully bound for all `26/26` text nodes across font
    family, font size, line height, and text fill, and all painted
    fills/strokes on the live source/hierarchy blocks remain token-bound too
  - the remaining live `Surface` debt is now narrower than the older repo notes
    claimed:
    - the live dark source/hierarchy ids are `627:633` and `627:646`
    - the hierarchy demo now matches the source-set shell ladder directly too:
      `panel = bg/surface`, `subtle = bg/canvas`, `muted = bg/inset`, and the
      inner `panel / subtle / muted / popover / support` shells now all sit on
      `16px` radius while the outer `shell zone` now binds to `radius/lg (24px)`
      instead of keeping the older local `20` posture
  - the current `Surface` board copy itself is now partially stale: it still
    warns about a broader token-gap story (`border/subtle`, `bg-muted`,
    `radius/12`, `space/20`) even though the live subtle/muted/popover/support
    blocks already bind their fills, strokes, and radii; treat the nodes, not
    the stale explanatory sentence, as the source of truth for this audit
  - runtime token semantics now mirror that same split more broadly too:
    `bg-card` resolves to the `surface` layer, while shared chrome that should
    remain on the calmer outer shell must opt into `bg-shell` explicitly
- `Foundation Review` still behaves differently on purpose:
  - its text fills are bound, but its current text nodes are not yet bound to
    the font-family variable
  - treat it as a comparison/review artifact, not as proof that the review page
    is as tokenized as the foundations page
- reusable-library coverage beyond that foundation slice is still in migration;
  treat `figma-component-map.md` as the status ledger for what is mapped,
  pending, or drifting rather than as proof that every older node ID has
  already been re-established in the new canonical file
- product-bound DS exports such as `ResourceCard`, `PriceBadge`, and
  `PriceLabel` still depend on refreshed product exemplars instead of a fully
  closed library mapping

## Layout And Pattern Rules For Figma

- Use product or workflow pages for product-bound exports and flow exemplars.
- Prefer proving DS-backed composition on the owning page inside the DS file
  rather than drawing detached exploration mocks.
- For non-trivial Figma-to-code work, lock one canonical node or variant and
  extract structured metadata/JSON from that exact node before editing code.
- Write a numeric contract from that metadata before implementation at minimum
  for width, height, padding, gap, title/body/action type scale, line-height,
  icon size, and dismiss size.
- When spacing depends on auto-layout hierarchy, write the DOM sibling
  structure explicitly too: parent stack, child order, sibling groups, and
  which node actually owns each gap.
- Do not let screenshot reading outrank structured node data during the mapping
  step; use screenshots to validate the rendered result after the numeric
  contract is already mapped into code.
- Before calling a runtime result “not like Figma,” confirm that the compared
  surfaces are the same scope, such as bounded item shell vs stack layout vs
  bell list.
- Treat overflow, clipping, and frame escape as failures during Figma work:
  verify one block at a time with metadata and screenshot before moving to the
  next block, and do not close the task while any child unintentionally exceeds
  its parent content box.
- Do not use light-theme-only fills to represent dark-shell selected or
  feedback states.
- Keep loading examples neutral; do not encode success/recovery/marketing
  emphasis into default skeleton states.

## Code Connect Priorities

When Code Connect is available, prioritize:

1. primitives under `src/design-system/primitives`
2. reusable composed DS surfaces under `src/design-system/components`
3. product-bound exports only after their canonical owner and Figma exemplar are
   stable

When Code Connect is not available, rely on `figma-component-map.md`.

## Handoff Checklist

When shared DS ownership, tokens, or reusable Figma components change:

1. update code under `src/design-system/*` first
2. update the matching Figma library surface
3. update `figma-component-map.md` if a mapped component or registry row changed
4. update `src/design-system/README.md` if inventory or ownership changed
5. update `krukraft-ai-contexts/06-design-system.md` if the agent digest needs a
   new active fact or caveat
6. run `npm run figma-map:check`
7. run `npm run tokens:audit` when token files or token inventory wording changed

When the change is only a token-migration contract pass and not a live token
implementation pass yet:

1. update `src/design-system/README.md` with the locked contract
2. update `design-system.md` so Figma guidance matches the same contract
3. update `krukraft-ai-contexts/06-design-system.md` and `09-todos.md`
4. do not rename live Figma collections or token files yet
