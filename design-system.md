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

## Figma Ownership Rules

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
- `FormSection`
- `Pagination`
- `SectionHeader`
- `RowActions`
- `LoadingSkeleton`
- layout helpers under `src/design-system/layout/*`

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
- The canonical Figma `Button / Foundations` boards now keep both `ghost` and
  a bounded neutral `soft` tone, and they trial `sm=36` on the
  `Button / Size` boards, but that extra `soft` posture is still Figma-first
  only. Keep runtime `Button` on the approved `primary | quiet | ghost`
  family and current size ladder until a deliberate button-size adoption pass
  decides whether `soft` and `sm=36` should graduate into code.
- Use the current button decision table when mapping Figma posture into DS:
  - `primary`, `quiet`, and `ghost` are the approved runtime family
  - `outline` remains the bordered fallback and should absorb most existing
    table / inline management actions before a new family member is invented
  - `soft` is a Figma-first bounded neutral candidate, not approved runtime
  - table row actions, pagination items, and panel CTAs should start life as
    recipes on top of `outline` / `ghost` / future `soft` posture rather than
    immediately becoming new top-level variants
  - the current Figma recipe direction now locks `DataPanelTable` row actions
    and pagination items to a rounded-rect `radius/sm (8px)` shape instead of
    the pill geometry used by the core family, and the row-action recipe card
    now keeps both an `Edit / Open` example row and a compact state strip so
    the posture and its states stay visible together
  - the first runtime adoption slice now mirrors that recipe without
    widening the whole button family:
    - `RowActionButton size="md"` carries the 40px rounded-rect posture
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
  `state/selected-fill`, `state/selected-stroke`, and `state/selected-text` as
  the default selected-surface family; use that trio instead of rebinding
  selected UI directly to raw `primary/*` primitives or overloading
  `action/*` / `focus/*` semantics

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
- The canonical Figma `Badge` base now lives in `Badge / Foundations / Light`
  and `Badge / Foundations / Dark`, with source sets that cover `neutral`,
  `info`, `success`, `warning`, `featured`, `destructive`, and `outline`.
- The latest canonical badge tuning now separates the two warm semantics on
  purpose: `warning` stays alert through `bg/inset` plus
  `support/warning/base|dust`, while `featured` stays softer and more editorial
  through `accent/sand/wash` fill with `accent/sand/base` border/text. Keep
  that split intact instead of collapsing both variants back onto the same warm
  recipe.
- Product or legacy runtime variants (`owned`, `new`, `free`, `default`,
  `secondary`, `ghost`, `link`) are intentionally outside that canonical Figma
  set until a deliberate remap or cleanup pass happens.
- The current canonical `Badge` board keeps two explicit Figma-only gaps
  instead of silently drifting:
  - the seven badge labels still use a local `12/16` recipe because the shared
    typography scale still lacks an xs label token
  - the light/dark `Badge / Variant / Source` wrapper frames still keep local
    `cornerRadius=5`
- The current dark source set for that canonical badge block now lives at
  `746:208`; repo mapping should follow the live node instead of the earlier
  `736:206` id from the first landing pass.
- Do not solve interactive chip needs by adding more `Badge` variants just
  because the silhouette is similar.
- The canonical Figma `FormSection` base now lives in
  `FormSection / Foundations / Light` and `FormSection / Foundations / Dark`,
  with source sets that cover only `variant=flat` and `variant=card`.
- Keep `flat` as the default divider-first settings/admin section shell and
  reserve `card` for clearly bounded secondary sections that intentionally sit
  on top of the `Card` + `Surface` family.
- The current canonical `FormSection` board keeps its runtime geometry gaps
  explicit instead of inventing fake tokens:
  - section titles still use local `16/20`
  - field labels still use local `14/20`
  - `card` still keeps local `20px` padding
  - `flat` still keeps the local `6px` header gap
  - divider/footer separators still rely on `border/default` until a dedicated
    `border/subtle` semantic exists
- The current dark source set for that canonical `FormSection` block now lives
  at `746:275`; repo mapping should follow the live node instead of the older
  `759:252` id from the first landing pass.
- The canonical Figma `DataPanelTable` base now lives in
  `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark`,
  with source sets that stay intentionally shell-scoped instead of pretending to
  own every table schema.
- Keep the current `DataPanelTable` source set progressive rather than
  combinatorially exhaustive: it proves the shell combinations for
  `actions`, `toolbar`, and `footer`, while columns, table-head fills, row
  rendering, empty-state content, and business actions stay route-owned.
- Treat the bordered action controls shown with `DataPanelTable` as a recipe
  posture, not as a new button family: row actions and pagination items should
  use the same rounded-rect `radius/sm (8px)` shape in Figma before any
  broader button-shape adoption is considered.
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
    - inherited `12/16` badge labels from the status pills
  - runtime still asks for `border-subtle`
  - the table-head fill remains a route-owned local treatment rather than a
    shared semantic token
- The earlier `ghost action` footer study has now been folded into the Figma
  button source as a bounded neutral `soft` direction that sits beside
  `ghost`, not on top of it. Treat that move as Figma-first only for now: it
  should not be read as a runtime `ghost` recipe replacement or a finished
  button-ladder decision until a dedicated adoption pass lands.

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
- the current canonical file has two audited pages:
  - `DS Foundations` (`13:20`) is the true base page and now holds `21`
    top-level frames spanning typography, color primitives, spacing/radius,
    `Button`, `Input / Search`, `Card`, `Dropdown`, `Surface`, `Badge`,
    `FormSection`, and `DataPanelTable`
  - `Foundation Review` (`371:29`) is a review-only page with one current
    top-level frame, not a reusable component library source
- `DS Foundations` is now the stronger token-bound page:
  - the latest page inventory found `1045/1047` text nodes bound to
    `font/family/base`
  - `1045/1047` text nodes with text-fill binding
  - `1614` bound fills, `2` local fills, and `441` bound strokes with `0`
    local strokes
  - the two current text/fill exceptions are the `Showing latest 2 entries`
    footer-note copies inside `DataPanelTable`
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
    Figma now expresses `quiet` / `ghost` state foreground changes more
    explicitly than the current runtime `Button.tsx` variant contract does, so
    treat the canonical Figma file as the design base and the runtime button
    recipe as adoption drift until code is updated
  - the current `Button recipes` card is now part of that audited truth too:
    `Row action` keeps an `Edit / Open` example row plus a compact
    `Default|Hover|Focus|Pressed|Disabled` state strip, `Pagination item`
    shares the same rounded-rect `radius/sm (8px)` geometry, and `Panel CTA`
    stays on the bounded-neutral pill candidate instead of inheriting the
    rounded-rect table posture
  - the latest `Input / Search` re-audit also confirmed that both
    `Input / State` / `SearchInput / State` and `Input / Size` /
    `SearchInput / Size` now use `radius/sm = 8px` across light and dark; repo
    runtime code still carries an older larger comfortable-radius branch, so
    treat the canonical Figma file as the base and the runtime recipe as drift
    until adoption happens
  - that same control re-audit also keeps two narrow Figma gaps explicit
    instead of hiding them: the light/dark component-set wrappers still carry a
    local `cornerRadius=5`, and the `Clear` action label in the search-state
    explainer still uses a local `14/20` type recipe while staying bound for
    font family and text fill
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
    - the only remaining local-radius gap on the live nodes is `shell zone`
      (`20`) in the hierarchy card
    - the live dark source/hierarchy ids are `627:633` and `627:646`
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
