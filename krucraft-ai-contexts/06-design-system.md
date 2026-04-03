# KruCraft — Design System

> Design-system reference. For implementation details, prefer the repo design
> system code and current component usage patterns over older exported design
> conversation wording.

## Source of Truth

- App and feature code should import design-system-covered surfaces from `@/design-system`.
- `src/components/ui/*` is a transitional primitive layer for maintenance only, not the default import surface for new app code.
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
- `FormSection`
- `Pagination`
- `PickerControls`
- `ResourceCard`
- `RowActions`

## Current Implementation Notes

- `RevealImage` is the shared image primitive for already-sized containers. It wraps `next/image`, keeps images visible by default, and expects the surrounding container to own placeholder/background treatment.
- The image delivery policy is selective:
  - optimizer-compatible HTTPS sources use Next Image
  - bypass happens only for non-optimizable cases surfaced through `shouldBypassImageOptimizer`
- `SearchInput` is the canonical DS search primitive with:
  - `default` and `hero` variants
  - clear and loading affordances
  - optional submit-button slot
  - optional leading and trailing adornments
- `src/design-system/tokens/hero.ts` now holds the browse-stage / merchandising-hero support layer for hero-specific spacing, radii, and typography only. Hero color decisions are expected to come from the shared DS semantic and scale tokens in `src/design-system/tokens/colors.ts`, and Pencil sync should bind hero surfaces to those canonical DS colors rather than a separate hero-only palette.
- `ResourceCard` in the design-system component barrel is currently a thin re-export of the marketplace implementation in `src/components/resources/ResourceCard`. Product-card changes may therefore land outside `src/design-system/components` while still affecting the DS surface.

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

## Storybook Scope

- Storybook is intentionally scoped to the design-system surface only:
  - `src/design-system/primitives/**/*.stories.*`
  - `src/design-system/components/**/*.stories.*`
- Current local verification paths:
  - `npm run storybook:build`
  - `npm run storybook:smoke`
- Hosted visual review can be layered on the same Storybook surface through `npm run chromatic`, but that command remains opt-in until a `CHROMATIC_PROJECT_TOKEN` is configured for the repo/workspace.
- In this environment, the build-based smoke path is the verified Storybook workflow.

---

*Refreshed against the repo state on 2026-04-03.*
