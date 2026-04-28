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
- The current canonical `Badge` board keeps one explicit token gap instead of
  silently drifting: the label uses a local `12/16` recipe because the shared
  typography scale still lacks an xs label token.
- The current dark source set for that canonical badge block now lives at
  `746:208`; repo mapping should follow the live node instead of the earlier
  `736:206` id from the first landing pass.
- Do not solve interactive chip needs by adding more `Badge` variants just
  because the silhouette is similar.

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
  - `DS Foundations` (`13:20`) is the true base page and now holds 15
    top-level light/dark section frames for typography, color primitives,
    spacing/radius, `Button`, `Input / Search`, `Card`, `Dropdown`, and
    `Surface`
  - `Foundation Review` (`371:29`) is a review-only page with one current
    top-level frame, not a reusable component library source
- `DS Foundations` is now the stronger token-bound page:
  - the latest audit found `633/633` text nodes bound to `font/family/base`
  - `633/633` text nodes with text-fill binding
  - `1057` bound fills and `261` bound strokes with no local paint drift
  - the remaining local styling debt is narrow and explicit: mostly local
    radius geometry inside wrapper frames or study scenes, not broad fill/stroke
    drift
  - the latest `Button / Foundations` re-audit confirmed that the light/dark
    header, usage, states, size, and icon cards all use semantic shell tokens
    rather than local paint overrides; the remaining button debt is narrow:
    wrapper-only local corner radius on the `Button / State` and
    `Button / Size` component-set containers, plus one dark-board copy line
    that still says `light recipe`
  - that same re-audit also showed a live design-vs-runtime contract gap:
    Figma now expresses `quiet` / `ghost` state foreground changes more
    explicitly than the current runtime `Button.tsx` variant contract does, so
    treat the canonical Figma file as the design base and the runtime button
    recipe as adoption drift until code is updated
  - the latest `Input / Search` re-audit also confirmed that both
    `Input / State` / `SearchInput / State` and `Input / Size` /
    `SearchInput / Size` now use `radius/sm = 8px` across light and dark; repo
    runtime code still carries an older larger comfortable-radius branch, so
    treat the canonical Figma file as the base and the runtime recipe as drift
    until adoption happens
  - the latest `Card / Foundations` cleanup also closed the old wrapper-radius
    debt on `Card / Size / Source`; the remaining card debt is now explicit and
    narrow (`space/20`, `space/10`, and preview-stack polish), while runtime
    `Card.tsx` has started adopting the same shell hierarchy by using
    `surface` for the card root and `inset` for the footer band
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
