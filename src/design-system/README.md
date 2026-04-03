# Krukraft Design System

This directory is the canonical UI source of truth for shared Krukraft
surfaces.

## Import Rules

- App and feature code should import shared UI from `@/design-system`.
- Do not add new primitives to `src/components/ui`.
- Treat `src/components/ui/*` as transitional implementation details or
  compatibility re-exports.

## Directory Roles

- `tokens/`
  - semantic colors, spacing, radius, typography, hero support tokens
- `primitives/`
  - low-level reusable controls and feedback surfaces
- `components/`
  - reusable composed components built from primitives
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
- `EmptyState`
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

### Layout

- `Container`
- `PageContainer`
- `PageContent`
- `PageContentWide`
- `PageContentNarrow`
- `PageSection`
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

- `ResourceCard` is exported from the DS barrel but its implementation owner is
  `src/components/resources/ResourceCard.tsx`. Treat it as a marketplace product
  component, not as a generic foundation.
- `FileUploadWidget`, `NotificationButton`, `PriceBadge`, `PriceLabel`, and
  `PickerControls` are DS-exposed composed components, but they remain more
  workflow-bound than true primitives.
- `FormSection` is the canonical settings/admin form layout helper. Prefer its
  default `flat` variant before introducing nested cards.
- `LoadingSkeleton` is the canonical skeleton primitive. Placeholders should
  stay neutral and use no more than three tones on a single surface.

## Figma Handoff

- Live Figma library file:
  - `Krukraft Design System`
  - [https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf](https://www.figma.com/design/D3cCyIYFnHDlY34eCqDURf)
- Manual mapping registry:
  - `/figma-component-map.md`
- Registry validation:
  - `npm run figma-map:check`
- Repo-wide Figma handoff guidance lives in `/design-system.md`.
- AI/system-level context lives in
  `krukraft-ai-contexts/06-design-system.md`.
- When tokens, DS ownership, or component inventories change materially, update
  the registry and both docs in the same work session.
- `npm run figma-map:check` currently enforces registry coverage for every
  `.tsx` file under `src/design-system/primitives` and
  `src/design-system/components`.
- The live Figma `Primitives` page already has real component sets for:
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
- The live Figma `Composed` page already has real component sets for:
  - `FormSection`
  - `SectionHeader`
  - `Pagination`
  - `EmptyState`
  - `RowActions`
  - `ConfirmDialog`
- The live Figma `Product / Marketplace` page already has real component sets
  for:
  - `ResourceCard`
  - `PriceBadge`
  - `PriceLabel`
  - `SearchInput`
- The live Figma `Product / Admin` page already has real component sets for:
  - `FileUploadWidget`
  - `NotificationButton`
  - `PickerControls`
- The live Figma `Patterns` page now contains validated layout exemplars for:
  - admin settings
  - marketplace discover
  - resource detail
  - creator dashboard
- Canonical Figma text styles now exist for the core Krukraft type ramp using
  `Noto Sans Thai` (`Regular`, `Medium`, `SemiBold`).
