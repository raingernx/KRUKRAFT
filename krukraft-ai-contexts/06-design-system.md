# Krukraft — Design System

> Design-system reference. For implementation details, prefer the repo design
> system code and current component usage patterns over older exported design
> conversation wording.

## Source of Truth

- App and feature code should import design-system-covered surfaces from `@/design-system`.
- `src/components/ui/*` is a transitional primitive layer for maintenance only, not the default import surface for new app code.
- `src/design-system/README.md` is the repo-local DS inventory and ownership reference.
- `/figma-component-map.md` is the repo-owned manual registry that maps live Figma components and patterns back to canonical code owners.
- `npm run figma-map:check` validates that every `.tsx` file under `src/design-system/primitives` and `src/design-system/components` has a registry row in `/figma-component-map.md`.
- `/design-system.md` is the repo-owned Figma reconstruction and handoff document. It should stay aligned with current DS ownership, token names, and component boundaries.
- Core design-system directories:
  - `src/design-system/tokens/*`
  - `src/design-system/primitives/*`
  - `src/design-system/components/*`
  - `src/design-system/layout/*`
- The design-system barrel exports tokens, primitives, components, and layout helpers from `src/design-system/index.ts`.

## Token / Layout Surfaces

- `src/design-system/tokens/index.ts` exports shared token maps for:
  - colors
  - hero
  - spacing
  - radius
  - typography
- `src/design-system/layout/index.ts` exports the shared layout shell helpers:
  - `Container`
  - `PageContainer`
  - `PageContent`
  - `PageContentWide`
  - `PageContentNarrow`
  - `PageSection`

## Primitive Inventory

- `Avatar`
- `Badge`
- `Button`
- `Card`
- `Input`
- `Modal`
- `RevealImage`
- `SearchInput`
- `Select`
- `Switch`
- `Textarea`
- `ToastProvider` and `useToast`

## Component Inventory

- `EmptyState`
- `ConfirmDialog`
- `FileUploadWidget`
- `FormSection`
- `NotificationButton`
- `Pagination`
- `PickerControls`
- `PriceBadge`
- `PriceLabel`
- `ResourceCard`
- `RowActions`
- `SectionHeader`

## Current Implementation Notes

- `src/design-system/README.md` is now the quick DS source for inventory, directory roles, and ownership notes. Use it before treating older docs or historical thread context as current.
- `RevealImage` is the shared image primitive for already-sized containers. It wraps `next/image`, keeps images visible by default, and expects the surrounding container to own placeholder/background treatment.
- The image delivery policy is selective:
  - optimizer-compatible HTTPS sources use Next Image
  - bypass happens only for non-optimizable cases surfaced through `shouldBypassImageOptimizer`
- `FormSection` is the canonical DS helper for settings and configuration sections. Its default `flat` variant is intentionally divider-based rather than card-based so form-heavy pages do not drift into box-in-box layouts. Use `variant="card"` only when a section genuinely needs its own elevated surface.
- Dashboard settings and admin settings now both treat `FormSection` as the canonical section contract, with shared route-level skeletons mirroring the same flat geometry from `src/components/skeletons/SettingsPageSkeleton.tsx` and `src/components/skeletons/AdminSettingsPageSkeleton.tsx`.
- `SearchInput` is the canonical DS search primitive with:
  - `default` and `hero` variants
  - clear and loading affordances
  - optional submit-button slot
  - optional leading and trailing adornments
- `LoadingSkeleton` is the canonical DS loading primitive. New loading work should reference it instead of adding ad-hoc placeholder blocks or reviving `src/components/shared/LoadingSkeleton` as an implementation owner.
- `src/design-system/tokens/hero.ts` now holds the browse-stage / merchandising-hero support layer for hero-specific spacing, radii, and typography only. Hero color decisions are expected to come from the shared DS semantic and scale tokens in `src/design-system/tokens/colors.ts`, and Pencil sync should bind hero surfaces to those canonical DS colors rather than a separate hero-only palette.
- `ResourceCard` in the design-system component barrel is currently a thin re-export of the marketplace implementation in `src/components/resources/ResourceCard`. Product-card changes may therefore land outside `src/design-system/components` while still affecting the DS surface.
- For Figma/library planning, split DS surfaces into two buckets:
  - generic library surfaces: primitives, layout helpers, and composed generic building blocks such as `FormSection`, `SectionHeader`, `Pagination`, and `EmptyState`
  - product-bound DS exports: `ResourceCard`, `FileUploadWidget`, `NotificationButton`, `PriceBadge`, `PriceLabel`, and `PickerControls`
- Product-bound DS exports may still appear in the `@/design-system` barrel for reuse, but they should map to product pages in Figma rather than Foundations/Primitives.

## Visual Language Cues

- Semantic utility classes center on DS token names such as:
  - `bg-surface-*`
  - `border-surface-*`
  - `text-text-primary`
  - `text-text-secondary`
  - `text-text-muted`
  - `text-primary-*`
- Current marketplace and admin UI favors:
  - large radii (`rounded-xl` through `rounded-3xl`)
  - soft surface borders instead of heavy shadows
  - image-led cards with concise metadata rows
  - structural skeletons and empty states that match final geometry closely
- Search, marketplace cards, and empty states are now first-class design-system concerns, not isolated one-off widgets.
- Settings, admin inspector, and form-management surfaces should establish hierarchy with section headers, spacing, and divided rows before reaching for nested cards.
- Repeated controls inside one parent surface should normally render as divided rows, not as a stack of mini-cards with duplicated `bg-white + border + rounded-*` chrome.
- Skeletons are expected to use a neutral DS palette. Placeholder fills should avoid brand/accent colors and stay within a maximum of three tones on a given surface.

## Storybook Scope

- Storybook is intentionally scoped to the design-system surface only:
  - `src/design-system/primitives/**/*.stories.*`
  - `src/design-system/components/**/*.stories.*`
- Current local verification paths:
  - `npm run storybook:build`
  - `npm run storybook:smoke`
- Hosted visual review can be layered on the same Storybook surface through `npm run chromatic`, but that command remains opt-in until a `CHROMATIC_PROJECT_TOKEN` is configured for the repo/workspace.
- In this environment, the build-based smoke path is the verified Storybook workflow.

## Figma Prep Notes

- Live DS library file:
  - `Krukraft Design System`
  - [https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf](https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf)
- Manual repo mapping registry:
  - `/figma-component-map.md`
- Recommended Figma page split:
  - `Foundations`
  - `Primitives`
  - `Composed`
  - `Product / Marketplace`
  - `Product / Admin`
  - `Patterns`
- The live file now already contains those pages plus foundational docs for:
  - primitive colors
  - semantic colors
  - spacing
  - radius
  - typography specimens
- Canonical Figma text styles now exist for:
  - `Display / Display`
  - `Display / Hero`
  - `Heading / H1`
  - `Heading / H2`
  - `Heading / H3`
  - `Body / Large`
  - `Body / Default`
  - `Body / Small`
  - `Meta / Default`
  - `Label / Caption`
  - `Label / Micro`
- The live `Primitives` page now has real component sets for:
  - `Button`
  - `Badge`
  - `Input`
  - `Select`
  - `Textarea`
  - `Card`
  - `Switch`
  - `Dropdown`
  - `Avatar`
  - `Modal`
  - `LoadingSkeleton`
- The live `Composed` page now has real component sets for:
  - `FormSection`
  - `SectionHeader`
  - `Pagination`
  - `EmptyState`
  - `RowActions`
  - `ConfirmDialog`
- The live `Product / Marketplace` page now has real component sets for:
  - `ResourceCard`
  - `PriceBadge`
  - `PriceLabel`
  - `SearchInput`
- The live `Product / Admin` page now has real component sets for:
  - `FileUploadWidget`
  - `NotificationButton`
  - `PickerControls`
- The live `Patterns` page now holds flow-level exemplars for:
  - admin settings anti-nesting
  - marketplace discover with neutral skeletons
  - resource detail shell composition
  - creator dashboard surface hierarchy
- Recommended first Code Connect mappings:
  - `Button`
  - `Badge`
  - `Input`
  - `Select`
  - `Textarea`
  - `Card`
  - `FormSection`
  - `SectionHeader`
  - `Pagination`
- Typography note:
  - the earlier Figma text-style failure was not a permanent platform blocker
  - the current file works with `Noto Sans Thai` using Figma's actual style names (`Regular`, `Medium`, `SemiBold`)
  - `Heading / H3` is the canonical style name in the live file and should stay spaced in docs, scripts, and future automation
  - if typography automation regresses again, re-check the exact available font style names before assuming the API is broken
- Delay `ResourceCard` Code Connect mapping until the marketplace product-card shape is stable enough to be treated as canonical.
- On Professional plan workflows, treat `figma-component-map.md` as the manual substitute for Code Connect and update it whenever a reusable Figma component or its canonical code owner changes.

---

*Refreshed against the repo state on 2026-04-03.*
