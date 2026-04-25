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
- `FormSection` is the canonical settings/admin form layout helper. Prefer its
  default `flat` variant before introducing nested cards.
- `LoadingSkeleton` is the canonical skeleton primitive. Placeholders should
  stay neutral and use no more than three tones on a single surface.

## Current Implementation Rules

- `Button` is now the first themed runtime slice. Treat `primary`, `quiet`,
  and `ghost` as the canonical family for new work.
- `Button` should read as one pill-shaped family across sizes, icons, and
  disabled/loading states rather than separate button recipes per surface.
- `secondary` remains a compatibility alias for quiet-style usage, and
  `outline` remains available for legacy surfaces that still depend on
  explicit borders.
- `Input` and `SearchInput` are now the second themed runtime slice. Keep
  both on the same quiet field shell, placeholder/value hierarchy, and focus
  ring language for new work.
- `SearchInput` is the canonical DS search primitive. Reuse it before creating
  route-owned search shells.
- `Input` and `SearchInput` should stay on the same field recipe. Search may
  add search-specific affordances, but it should not drift into a separate
  shell language for default, hover, focus, or filled states.
- `RevealImage` is the shared image primitive for already-sized containers. Let
  the surrounding container own placeholder and background treatment.
- Runtime route-level and Suspense-critical skeletons should stay visually
  neutral even when the resolved UI uses richer emphasis or recovery states.
- Dark-shell selected rows and feedback chips should prefer theme-aware
  emphasis surfaces such as `bg-accent + semantic border/text color` instead of
  fixed light-only `*-50` fills.
- `Badge.featured` should follow the same rule when used on dark shells: keep
  the surface theme-aware and carry emphasis through border/text color.
- `Badge` is the non-interactive semantic label primitive. Use it for status,
  metadata, or read-only emphasis.
- `Chip` is now reserved for interactive token-like controls only, such as
  filter chips, pressed/selected chips, removable chips, or navigation chips.
  Do not expand `Badge` to cover those interactive contracts once `Chip` lands.
- Hero surfaces are not generic `card` surfaces. Use the hero semantic layer
  (`heroBackground`, `heroPanel`, `heroChip`, and related roles) instead of
  rebinding hero UI to default card tokens.
- `boneyard-js` is an optional capture workflow for generated skeletons under
  `src/bones`. It supplements the repo's loading/fallback parity rules; it does
  not replace route-owned loading, empty, or error-state design.

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
