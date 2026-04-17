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

Live Figma library file:

- `Krukraft Design System`
- [https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf](https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf)
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

- core primitives such as `Button`, `Badge`, `Input`, `Select`, `Textarea`,
  `Card`, `Switch`, `Dropdown`, `Avatar`, `Modal`, and `LoadingSkeleton` have
  canonical Figma component sets
- several DS-composed surfaces such as `FormSection`, `SectionHeader`,
  `Pagination`, `EmptyState`, `RowActions`, and `ConfirmDialog` are mapped
- product-bound DS exports such as `ResourceCard`, `PriceBadge`, and
  `PriceLabel` still depend on refreshed product exemplars instead of a fully
  closed library mapping
- the live DS file now also contains a `Theme Lab` page used only for palette
  posture and component-shape training; it is a review surface, not a shipped
  design source

## Layout And Pattern Rules For Figma

- Use product or workflow pages for product-bound exports and flow exemplars.
- Prefer proving DS-backed composition on the owning page inside the DS file
  rather than drawing detached exploration mocks.
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
