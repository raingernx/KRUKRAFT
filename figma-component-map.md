# Krukraft Figma Component Map

Repo-owned manual mapping registry between the live Figma design-system file and
the codebase.

What this file owns:
- the live Figma page/node-to-code registry
- mapping status per shared component or exemplar
- registry maintenance rules

What this file does not own:
- the code-side DS inventory or ownership rules
- token mirroring guidance
- Figma reconstruction or fidelity workflow guidance

Use this file when Code Connect is unavailable or when working on `Professional`
plan handoff workflows. For DS ownership and handoff rules, use
`src/design-system/README.md` and `design-system.md`.

If this file conflicts with code, the code wins. If this file conflicts with the
live Figma canvas, update this file in the same work session.

Validation:

- Run `npm run figma-map:check` after adding or renaming DS component files or
  reusable Figma library components.
- Run `npm run tokens:audit` when a DS token file, export surface, or token
  inventory doc changes.
- The check currently enforces row coverage for every `.tsx` file under:
  - `src/design-system/primitives`
  - `src/design-system/components`

## Live File

- Figma file: [Krukraft Theme Lab Source-of-Truth](https://www.figma.com/design/koZEgVUfQhNEQmXISNQx56)
- File key: `koZEgVUfQhNEQmXISNQx56`
- Workspace status: moved into the shared Team project, not kept in personal
  Drafts.
- Canonical scope today: `DS Foundations` + `Foundation Review`
- Migration note: the canonical file is now foundation-first. Until the
  inventory-diff pass remaps every row, some page names/node IDs below should be
  treated as legacy placeholders rather than verified live-node mappings in the
  new canonical file.

## Registry Rules

- Every shared DS component that is added to the live Figma library should get
  a row here.
- Every new row must include:
  - Figma page
  - Figma node ID
  - canonical code path
  - ownership category
  - mapping status
- Use repo-canonical paths, not compatibility wrappers.
- Prefer the implementation owner path even if the component is re-exported from
  `@/design-system`.
- For reusable Figma component-set properties, prefer code-style prop naming:
  - property names should mirror code props such as `variant`, `size`, `align`,
    `submitButton`
  - variant option values should stay lower-case when the code prop values are
    lower-case, such as `primary`, `outline`, `sm`, `md`, `flat`, `card`
- When a component is renamed in Figma or code, update this registry in the same
  change.
- When a component is removed from Figma or code, remove or mark the row in the
  same change.

## Status Legend

- `mapped-manual`: Figma component exists and its code owner is recorded here.
- `pending-figma`: code exists, but a production-quality Figma component is not
  in the live library yet.
- `pending-code`: Figma component exists, but no canonical code owner has been
  chosen yet.
- `legacy`: do not use for new work.

## Canonical File Inventory Snapshot

First-pass repo-vs-Figma diff against the canonical file
`koZEgVUfQhNEQmXISNQx56` (`Krukraft Theme Lab Source-of-Truth`) as of
`2026-04-25`.

This snapshot is the working migration ledger for the current
`Inventory diff + docs drift` phase. Use it to distinguish current canonical
coverage from older row/node claims that still need to be re-established in the
new file.

| Area | DS items | Classification | Canonical Figma evidence | Action |
| --- | --- | --- | --- | --- |
| Tokens | `colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts` | `mapped and current` | `DS Foundations` contains color, spacing/radius, and typography boards plus matching variable collections | carry forward as the current foundation baseline |
| Tokens | `hero.ts` | `code exists, figma missing` | no hero-token board or hero-specific variable collection in the canonical file | leave out of the foundation pass; revisit with product exemplars |
| Foundations | `Button` | `mapped and current` | canonical file contains reusable `Button / State`, `Button / Size`, and `Button / Icon` component sets in light/dark coverage | keep as the best-aligned foundation slice and remap node references intentionally later |
| Foundations | `Input`, `SearchInput` | `mapped and current` | canonical file now contains `Input / State`, `SearchInput / State`, `Input / State / Dark`, and `SearchInput / State / Dark` component sets under the `Input / Search` foundation boards | carry forward as the current field-shell foundation mapping; treat hero/loading/submit-button coverage as follow-up scope, not a blocker for the base shell set |
| Primitives | `Card` | `mapped and current` | canonical file now contains `Card / Size` and `Card / Size / Dark` component sets under dedicated `Card / Foundations` light/dark boards | carry forward as the first shared-library shell proof point and reuse it when remapping generic surface posture |
| Primitives | `Badge`, `Select`, `Switch`, `Textarea`, `Avatar`, `Modal`, `LoadingSkeleton` | `doc drift` | current canonical file does not yet expose verified reusable nodes for these items, even though older rows still claim mapped status | re-audit and remap each item before keeping `mapped-manual` claims |
| Primitives | `Dropdown` | `doc drift` | canonical file now contains verified light/dark dropdown-popover shell study boards, but it still does not expose a reusable component set or final mapping node | keep the primitive status `pending-figma` until the study boards are promoted into a reusable dropdown mapping |
| Primitives | `RevealImage`, `ToastProvider` | `code exists, figma missing` | no canonical pattern or component for either item in the current file | keep intentionally pending until a real pattern exists |
| Composed | `FormSection`, `SectionHeader`, `Pagination`, `EmptyState`, `RowActions`, `ConfirmDialog` | `doc drift` | older rows still point at pages/nodes from the previous file, but the current canonical file is still foundation-first and does not verify these components yet | re-audit and remap in the shared-library pass |
| Composed | `DataPanelTable`, `Surface` | `code exists, figma missing` | no canonical component in the current file yet | add during the shared-library pass |
| Product-bound | `ResourceCard`, `PriceBadge`, `PriceLabel` | `code exists, figma missing` | no canonical marketplace pricing/card exemplar in the current file | defer to the product exemplar pass |
| Product-bound | `FileUploadWidget`, `NotificationButton`, `PickerControls` | `doc drift` | older rows still claim canonical admin mappings, but the current file does not yet contain verified `Product / Admin` coverage | re-audit after the foundation/library passes |
| Layout | `Container`, `PageContainer`, `PageContent`, `PageContentWide`, `PageContentNarrow`, `SidebarContainer`, `SidebarNav`, `SidebarSection`, `SidebarSectionLabel`, `IconWrapper`, `SidebarBadge`, `SidebarItem`, `SidebarFooter`, `Divider`, `NavGroup` | `code exists, figma missing` | no layout-helper page or verified layout primitive board exists in the current canonical file | decide later whether these should gain Figma coverage or remain code-owned/documented only |
| Review-only Figma surface | `Foundation Review / Light` | `figma exists, code missing` | review board exists in the canonical file but is not a code component | keep as a review surface, not a DS mapping target |

## Primitives

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `DS Foundations` | `260:486` | `Button` | `src/design-system/primitives/Button.tsx` | DS primitive | `mapped-manual` | Canonical file now verifies `Button / State`; related size/icon component sets also exist in light/dark coverage. |
| `not-built` | `not-built` | `Badge` | `src/design-system/primitives/Badge.tsx` | DS primitive | `pending-figma` | Older mapping came from the previous file; the canonical foundation-first file does not yet verify a current badge component. |
| `DS Foundations` | `432:218`, `432:409` | `Input` | `src/design-system/primitives/Input.tsx` | DS primitive | `mapped-manual` | Canonical file now provides first-pass light/dark `Input / State` component sets covering default, focus, filled, error, read-only, and disabled shell states. |
| `not-built` | `not-built` | `Select` | `src/design-system/primitives/Select.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable select component. |
| `not-built` | `not-built` | `Textarea` | `src/design-system/primitives/Textarea.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable textarea component. |
| `DS Foundations` | `439:303`, `439:497` | `Card` | `src/design-system/primitives/Card.tsx` | DS primitive | `mapped-manual` | Canonical file now provides first-pass light/dark `Card / Size` component sets with `size=default` and `size=sm`, plus dedicated `Card / Foundations` study boards for shell posture reference. |
| `not-built` | `not-built` | `Switch` | `src/design-system/primitives/Switch.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable switch component. |
| `DS Foundations` | `499:110`, `499:181` | `Dropdown` | `src/design-system/primitives/Dropdown.tsx` | DS primitive | `pending-figma` | Canonical file now contains verified `Dropdown / Foundations / Light` and `Dropdown / Foundations / Dark` study boards covering trigger context, open shell, selected row, submenu edge, and destructive row. Reusable component mapping is still pending a true component-set promotion. |
| `not-built` | `not-built` | `Avatar` | `src/design-system/primitives/Avatar.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable avatar component. |
| `not-built` | `not-built` | `Modal` | `src/design-system/primitives/Modal.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable modal shell. |
| `not-built` | `not-built` | `LoadingSkeleton` | `src/design-system/primitives/LoadingSkeleton.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable loading-skeleton component. |
| `DS Foundations` | `432:276`, `432:467` | `SearchInput` | `src/design-system/primitives/SearchInput.tsx` | DS primitive | `mapped-manual` | Canonical file now provides first-pass light/dark `SearchInput / State` component sets for default, focus, filled, and clear states. `hero`, `loading`, and `submitButton` remain outside this foundation-first mapping. |
| `Primitives` | `not-built` | `RevealImage` | `src/design-system/primitives/RevealImage.tsx` | DS primitive | `pending-figma` | Needs a Figma documentation pattern, not just a static frame. |
| `Primitives` | `not-built` | `ToastProvider` | `src/design-system/primitives/ToastProvider.tsx` | DS primitive | `pending-figma` | Better documented as a behavior pattern than a static component set. |

## Composed

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `not-built` | `not-built` | `FormSection` | `src/design-system/components/FormSection.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `SectionHeader` | `src/design-system/components/SectionHeader.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `Composed` | `not-built` | `DataPanelTable` | `src/design-system/components/DataPanelTable.tsx` | DS composed | `pending-figma` | Dashboard/admin table shell with title, actions, optional toolbar, and table body slot. |
| `not-built` | `not-built` | `Pagination` | `src/design-system/components/Pagination.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `EmptyState` | `src/design-system/components/EmptyState.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `RowActions` | `src/design-system/components/RowActions.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `ConfirmDialog` | `src/design-system/components/ConfirmDialog.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `Composed` | `not-built` | `Surface` | `src/design-system/components/Surface.tsx` | DS composed | `pending-figma` | Canonical generic shell for toolbars, table wrappers, inspector panels, and muted inset bars. |

## Product-Bound DS Exports

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `Product / Marketplace` | `not-built` | `ResourceCard` | `src/components/resources/ResourceCard.tsx` | Product DS export | `pending-figma` | Marketplace card mappings still need a refreshed canonical Figma surface; the hero banner is currently the stable marketplace exemplar. |
| `Product / Marketplace` | `not-built` | `PriceBadge` | `src/design-system/components/PriceBadge.tsx` | Product DS export | `pending-figma` | Still pending a refreshed canonical marketplace pricing surface in Figma. |
| `Product / Marketplace` | `not-built` | `PriceLabel` | `src/design-system/components/PriceLabel.tsx` | Product DS export | `pending-figma` | Still pending a refreshed canonical marketplace pricing surface in Figma. |
| `not-built` | `not-built` | `HeroBanner` | `src/components/marketplace/HeroBanner.tsx`, `src/components/marketplace/HeroSurface.tsx` | Product DS export | `pending-figma` | Current canonical file does not yet carry the previous marketplace hero exemplar; reintroduce it intentionally in the product-exemplar pass. |
| `not-built` | `not-built` | `FileUploadWidget` | `src/design-system/components/FileUploadWidget.tsx` | Product DS export | `pending-figma` | Previous mapping came from the older file; current canonical file does not yet verify an admin upload exemplar. |
| `not-built` | `not-built` | `NotificationButton` | `src/design-system/components/NotificationButton.tsx` | Product DS export | `pending-figma` | Previous mapping came from the older file; current canonical file does not yet verify an admin notification exemplar. |
| `not-built` | `not-built` | `PickerControls` | `src/design-system/components/PickerControls.tsx` | Product DS export | `pending-figma` | Previous mapping came from the older file; current canonical file does not yet verify picker/dropzone exemplars. |

## Product Flow Exemplars

These are owner-page flow exemplars, not one-to-one Code Connect candidates.

| Figma page | Figma node | Pattern | Backing source | Status | Notes |
| --- | --- | --- | --- | --- | --- |
| `not-built` | `not-built` | `Flow / Admin Settings` | `src/components/settings/*`, `src/app/admin/settings/AdminSettingsClient.tsx` | `pending-figma` | Previous flow exemplar came from the older file; re-establish only if this pattern becomes part of the new canonical file. |
| `not-built` | `not-built` | `Flow / Hero Banner` | `src/components/marketplace/HeroSurface.tsx`, `src/components/marketplace/HeroBanner.tsx` | `pending-figma` | Previous flow exemplar came from the older file; re-establish during the product-exemplar pass if marketplace hero remains in scope. |
| `not-built` | `not-built` | `Flow / Creator Dashboard` | `src/app/(dashboard-v2)/dashboard-v2/creator/*` | `legacy` | Historical row from the retired dashboard-v2 route family; do not treat it as a current canonical Figma mapping target. |

## First Manual Mapping Set

If the team stays on Figma Professional and keeps using manual mapping instead
of Code Connect, the minimum set to keep accurate is:

- `Button`
- `Badge`
- `Input`
- `Select`
- `Textarea`
- `Card`
- `FormSection`
- `SectionHeader`
- `Pagination`
- `EmptyState`
- `Surface`

## Change Checklist

When adding a new shared component in code:

1. Add or update the canonical implementation under `src/design-system/*` if it
   is a generic DS surface.
2. Add or update the matching component in the live Figma library.
3. Add or update the row in this file.
4. Update `/design-system.md`, `src/design-system/README.md`, and
   `krukraft-ai-contexts/06-design-system.md` if the change affects shared
   ownership or handoff understanding.
5. Run `npm run figma-map:check` before closing the task.

When adding a new component in Figma first:

1. Decide whether it is a generic DS surface or a product-bound export.
2. Pick the canonical code owner path.
3. Add the row here immediately, even if the code component is still pending.
4. Do not leave anonymous or temporary Figma components without a registry row
   once they are intended to be reused.
5. Run `npm run figma-map:check` after the corresponding code surface is added
   or renamed.
