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
- Canonical scope today: `DS Foundations` + `Foundation Review` (re-audited on
  `2026-04-27`)
- Migration note: the canonical file is now foundation-first. Until the
  inventory-diff pass remaps every row, some page names/node IDs below should be
  treated as legacy placeholders rather than verified live-node mappings in the
  new canonical file.

## Canonical Page Audit

Detailed file audit against the live canonical file `koZEgVUfQhNEQmXISNQx56`
was rerun on `2026-04-27`. Use this section as the current page/section
baseline when repo docs and older node claims disagree.

### Page Inventory

| Page | Page node | Top-level coverage | Binding posture | Notes |
| --- | --- | --- | --- | --- |
| `DS Foundations` | `13:20` | 21 top-level frames spanning `Typography`, `Color Primitives`, `Spacing + Radius`, `Button`, `Input / Search`, `Card`, `Dropdown`, `Surface`, `Badge`, `FormSection`, and `DataPanelTable` | 2026-04-28 page inventory reports `1045/1047` text nodes with `font/family/base` binding, `1045/1047` text nodes with text-fill binding, `1614` bound fills with `2` local fills, and `441` bound strokes with `0` local strokes; the two current font-family/text-fill exceptions are `Showing latest 2 entries` footer-note copies inside the `DataPanelTable` foundations | this is the canonical build surface; section audits should treat it as source truth while keeping page-wide count drift visible instead of relying on older frozen totals |
| `Foundation Review` | `371:29` | 1 top-level review frame: `Foundation Review / Light` (`371:30`) | page audit reports `47/47` text nodes with text-fill binding, but `0/47` text nodes bound to the font-family variable | keep this page as a review surface, not a reusable library source; it mirrors the visual system but is not yet fully typography-tokenized like `DS Foundations` |

### Section Inventory

| Page | Section node | Section | Audit status | Notes |
| --- | --- | --- | --- | --- |
| `DS Foundations` | `47:2` | `Typography / Light` | verified | 2026-04-28 section re-audit confirms all text nodes stay bound for font family, font size, line height, and text fill, and the five section cards bind their 24px corners through per-corner `radius/lg` variables rather than local radius drift |
| `DS Foundations` | `2:1176` | `Typography / Dark` | verified | 2026-04-28 section re-audit confirms all text nodes stay bound for font family, font size, line height, and text fill, and the five section cards bind their 24px corners through per-corner `radius/lg` variables rather than local radius drift |
| `DS Foundations` | `2:1269` | `Color Primitives / Light` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, displayed hex labels, and per-corner radius. The live primitive collection now includes `26` color variables after adding the dedicated `support/success/*` and `support/warning/*` `base / dust / soft` families surfaced on this board |
| `DS Foundations` | `158:177` | `Color Primitives / Dark` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, displayed hex labels, and per-corner radius. The live primitive collection now includes `26` color variables after adding the dedicated `support/success/*` and `support/warning/*` `base / dust / soft` families surfaced on this board |
| `DS Foundations` | `147:2` | `Spacing + Radius / Primitives` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, spacing samples, and per-corner radius, including the `radius/xs` sample row and the existing `space/2` variable in the primitive collection |
| `DS Foundations` | `191:2` | `Button / Foundations / Light` | verified | 2026-04-28 control re-audit confirms the light board stays fully bound for text family/size/line-height/fill and for shell fills, strokes, and per-corner radius across the live `Button / State`, `Button / Size`, and `Button / Icon` sets. The earlier `wrapper radius debt` note was a false positive caused by zero-radius container frames and icon-instance shells, not by any non-zero local radius drift. The current recipe card now keeps `Row action` as an `Edit / Open` example row plus a compact state strip, locks `Pagination item` to the same rounded-rect `radius/sm (8px)` posture, and leaves `Panel CTA` on the bounded-neutral pill candidate. |
| `DS Foundations` | `294:29` | `Button / Foundations / Dark` | verified | same token-bound posture as the light board. The 2026-04-28 control re-audit also confirms the old dark `light recipe` subtitle drift is gone, the live recipe card mirrors the light board structure, and no non-zero local radius debt remains in the dark `Button / State`, `Button / Size`, or `Button / Icon` component sets. |
| `DS Foundations` | `315:56` | `Input / Search / Light` | verified with narrow local radius debt | current audit still sees local radius on the component-set wrapper containers |
| `DS Foundations` | `360:2` | `Input / Search / Dark` | verified with narrow local radius debt | same wrapper-radius caveat as the light board |
| `DS Foundations` | `439:110` | `Card / Foundations / Light` | verified with explicit token gaps | `Card / Size / Source` no longer carries wrapper-radius debt after the 2026-04-28 cleanup; the remaining card gaps are intentional local geometry (`space/20`, `space/10`, and the preview-stack arrangement) rather than silent wrapper styling drift |
| `DS Foundations` | `439:304` | `Card / Foundations / Dark` | verified with explicit token gaps | same remaining card token-gap posture as the light board; wrapper-radius debt on `Card / Size / Source` is now cleared |
| `DS Foundations` | `499:110` | `Dropdown / Foundations / Light` | verified with explicit token gaps | current audit still sees local radius on `context scene` (`20`), `menu row` (`12`), and `row calibration scene` (`20`) |
| `DS Foundations` | `499:181` | `Dropdown / Foundations / Dark` | verified with explicit token gaps | same local-radius caveat as the light board |
| `DS Foundations` | `573:143` | `Surface / Foundations / Light` | verified with explicit token gaps | current audit still sees local radius on `shell zone` (`20`) |
| `DS Foundations` | `573:182` | `Surface / Foundations / Dark` | verified with explicit token gaps | same local-radius caveat as the light board |
| `Foundation Review` | `371:30` | `Foundation Review / Light` | review-only | keep as a comparison board; it should not be treated as a reusable library source or a proof that every review text node already mirrors the canonical font-family variable |

### Variable Collection Audit

| Collection | Modes | Variable count | Current prefix groups |
| --- | --- | --- | --- |
| `Color / Primitives` | `Light`, `Dark` | 26 | `neutral` (8), `primary` (4), `accent` (8), `support` (6) |
| `Color / Semantic` | `Light`, `Dark` | 22 | `bg` (4), `border` (1), `fg` (5), `action` (5), `focus` (1), `state` (6) |
| `Typography / Primitives` | `Base` | 11 | `font` (3), `type` (8) |
| `Typography / Semantic` | `Base` | 15 | `type` (15) |
| `Spacing / Primitives` | `Base` | 9 | `space` (9) |
| `Radius / Primitives` | `Mode 1` | 6 | `radius` (6) |

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
`2026-04-27`.

This snapshot is the working migration ledger for the current
`Inventory diff + docs drift` phase. Use it to distinguish current canonical
coverage from older row/node claims that still need to be re-established in the
new file.

| Area | DS items | Classification | Canonical Figma evidence | Action |
| --- | --- | --- | --- | --- |
| Tokens | `colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts` | `mapped and current` | `DS Foundations` contains color, spacing/radius, and typography boards plus matching variable collections | carry forward as the current foundation baseline |
| Tokens | `hero.ts` | `code exists, figma missing` | no hero-token board or hero-specific variable collection in the canonical file | leave out of the foundation pass; revisit with product exemplars |
| Foundations | `Button` | `mapped and current` | canonical file contains reusable `Button / State`, `Button / Size`, and `Button / Icon` component sets in light/dark coverage; the current Figma source now uses `primary | quiet | ghost | soft` and trials `sm=36` on the size boards while runtime still trails on `primary | quiet | ghost` and `sm=32` | keep as the best-aligned foundation slice and track the remaining runtime adoption gap explicitly |
| Foundations | `Input`, `SearchInput` | `mapped and current` | canonical file now contains light/dark `Input / State`, `Input / Size`, `SearchInput / State`, and `SearchInput / Size` component sets under the `Input / Search` foundation boards | carry forward as the current field-shell foundation mapping; the 2026-04-27 re-audit locked both families to `radius/sm (8px)` across state + size coverage, while hero/loading/submit-button coverage remains follow-up scope |
| Primitives | `Card` | `mapped and current` | canonical file now contains `Card / Size` and `Card / Size / Dark` component sets under dedicated `Card / Foundations` light/dark boards | carry forward as the first shared-library shell proof point and reuse it when remapping generic surface posture |
| Primitives | `Select`, `Switch`, `Textarea`, `Avatar`, `Modal`, `LoadingSkeleton` | `doc drift` | current canonical file does not yet expose verified reusable nodes for these items, even though older rows still claim mapped status | re-audit and remap each item before keeping `mapped-manual` claims |
| Primitives | `Dropdown` | `mapped study reference` | canonical file now contains verified light/dark dropdown-popover shell study boards, but it still does not expose a reusable component set or final mapping node | close the current shared-library pass with `Dropdown` intentionally kept as a study-board reference; reopen only when a true reusable component-set mapping is ready |
| Primitives | `RevealImage`, `ToastProvider` | `code exists, figma missing` | no canonical pattern or component for either item in the current file | keep intentionally pending until a real pattern exists |
| Composed | `FormSection` | `mapped and current` | canonical file now contains dedicated `FormSection / Foundations / Light` and `FormSection / Foundations / Dark` boards plus reusable `FormSection / Variant / Source` light/dark sets for `flat` and `card` | carry forward as the first composed shared-form shell on top of `Surface` and `Card`; keep the explicit typography/spacing/border token gaps visible |
| Composed | `SectionHeader`, `Pagination`, `EmptyState`, `RowActions`, `ConfirmDialog` | `doc drift` | older rows still point at pages/nodes from the previous file, while the current canonical file still does not verify these components | re-audit and remap each item during the remaining shared-library pass |
| Composed | `DataPanelTable` | `mapped and current` | canonical file now contains dedicated `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark` boards plus reusable `DataPanelTable / Variant / Source` light/dark sets | carry forward as the canonical dashboard/admin table shell; keep row schema, filters, and business actions route-owned while leaving the `border/subtle` token gap explicit |
| Composed | `Surface` | `mapped and current` | canonical file now contains verified `Surface / Foundations / Light` and `Surface / Foundations / Dark` boards with a `Surface / Variant / Source` block plus a hierarchy study card | carry forward as the shared shell bridge before remapping `FormSection` and `DataPanelTable`; keep the remaining token gaps explicit |
| Product-bound | `ResourceCard`, `PriceBadge`, `PriceLabel` | `code exists, figma missing` | no canonical marketplace pricing/card exemplar in the current file | defer to the product exemplar pass |
| Product-bound | `FileUploadWidget`, `NotificationButton`, `PickerControls` | `doc drift` | older rows still claim canonical admin mappings, but the current file does not yet contain verified `Product / Admin` coverage | re-audit after the foundation/library passes |
| Layout | `Container`, `PageContainer`, `PageContent`, `PageContentWide`, `PageContentNarrow`, `SidebarContainer`, `SidebarNav`, `SidebarSection`, `SidebarSectionLabel`, `IconWrapper`, `SidebarBadge`, `SidebarItem`, `SidebarFooter`, `Divider`, `NavGroup` | `code exists, figma missing` | no layout-helper page or verified layout primitive board exists in the current canonical file | decide later whether these should gain Figma coverage or remain code-owned/documented only |
| Review-only Figma surface | `Foundation Review / Light` | `figma exists, code missing` | review board exists in the canonical file but is not a code component | keep as a review surface, not a DS mapping target |

## Primitives

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `DS Foundations` | `746:510`, `553:167`, `259:92`, `746:468`, `746:598`, `746:635` | `Button` | `src/design-system/primitives/Button.tsx` | DS primitive | `mapped-manual` | Canonical file now verifies light/dark `Button / State`, `Button / Size`, and `Button / Icon` sets with the current live ids. The 2026-04-28 control re-audit cleared the stale `wrapper radius debt` claim too: the component sets no longer carry any non-zero local radius drift, and the dark subtitle drift is gone. The current Figma base keeps `primary | quiet | ghost | soft`, trials `sm=36`, and now documents recipes more explicitly: `Row action` shows an `Edit / Open` example row plus a compact state strip, `Pagination item` shares the same rounded-rect `radius/sm (8px)` posture, and `Panel CTA` stays on the bounded-neutral pill candidate. Runtime still trails on `primary | quiet | ghost`, `sm=32`, and the older state choreography. |
| `DS Foundations` | `736:178`, `746:208` | `Badge` | `src/design-system/primitives/Badge.tsx` | DS primitive | `mapped-manual` | Canonical file now provides verified `Badge / Variant / Source` and `Badge / Variant / Source / Dark` sets inside dedicated `Badge / Foundations` light/dark boards. The canonical set keeps `Badge` non-interactive and covers `neutral`, `info`, `success`, `warning`, `featured`, `destructive`, and `outline`; runtime-only product/legacy variants remain outside the Figma base. The latest Figma tuning now separates the warm variants on purpose: `warning` stays on `bg/inset` with `support/warning/base` stroke and `support/warning/dust` text, while `featured` uses an editorial `accent/sand/wash` fill with `accent/sand/base` border/text in both light and dark. The board also records one explicit token gap: badge labels still use a narrow local `12/16` type override until the typography scale gains an xs label token. |
| `DS Foundations` | `432:218`, `426:150`, `548:134`, `548:182` | `Input` | `src/design-system/primitives/Input.tsx` | DS primitive | `mapped-manual` | Canonical file now provides normalized light/dark `Input / State` and `Input / Size` sets; the 2026-04-27 re-audit confirmed that every field shell in those sets now uses `radius/sm (8px)` with `field` height, `space/16`, and caption-scale text. Runtime code still carries a larger comfortable-radius branch, so treat Figma as the approved base and runtime as an adoption gap. |
| `not-built` | `not-built` | `Select` | `src/design-system/primitives/Select.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable select component. |
| `not-built` | `not-built` | `Textarea` | `src/design-system/primitives/Textarea.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable textarea component. |
| `DS Foundations` | `439:303`, `426:444` | `Card` | `src/design-system/primitives/Card.tsx` | DS primitive | `mapped-manual` | Canonical file now provides first-pass light/dark `Card / Size / Source` component sets with `size=default` and `size=sm`, plus dedicated `Card / Foundations` study boards for shell posture reference. Repo runtime adoption started on 2026-04-28 too: the shared `Card` primitive now renders its root shell through `surface` and its footer through `inset`, matching the current Figma base more directly. |
| `not-built` | `not-built` | `Switch` | `src/design-system/primitives/Switch.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable switch component. |
| `DS Foundations` | `499:110`, `499:181` | `Dropdown` | `src/design-system/primitives/Dropdown.tsx` | DS primitive | `mapped-study` | Canonical file now contains verified `Dropdown / Foundations / Light` and `Dropdown / Foundations / Dark` study boards covering trigger context, open shell, selected row, submenu edge, and destructive row. The current alignment pass closes with `Dropdown` kept as a study-board reference rather than promoted into a reusable component-set mapping. |
| `not-built` | `not-built` | `Avatar` | `src/design-system/primitives/Avatar.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable avatar component. |
| `not-built` | `not-built` | `Modal` | `src/design-system/primitives/Modal.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable modal shell. |
| `not-built` | `not-built` | `LoadingSkeleton` | `src/design-system/primitives/LoadingSkeleton.tsx` | DS primitive | `pending-figma` | Current canonical file does not yet verify a reusable loading-skeleton component. |
| `DS Foundations` | `432:276`, `426:172`, `548:166`, `548:214` | `SearchInput` | `src/design-system/primitives/SearchInput.tsx` | DS primitive | `mapped-manual` | Canonical file now provides normalized light/dark `SearchInput / State` and `SearchInput / Size` sets that follow the same default field ladder as `Input`; the 2026-04-27 re-audit confirmed the same `radius/sm (8px)` shell across all four sets. `hero`, `loading`, and `submitButton` remain outside this foundation-first mapping. |
| `Primitives` | `not-built` | `RevealImage` | `src/design-system/primitives/RevealImage.tsx` | DS primitive | `pending-figma` | Needs a Figma documentation pattern, not just a static frame. |
| `Primitives` | `not-built` | `ToastProvider` | `src/design-system/primitives/ToastProvider.tsx` | DS primitive | `pending-figma` | Better documented as a behavior pattern than a static component set. |

## Composed

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `DS Foundations` | `759:251`, `759:252` | `FormSection` | `src/design-system/components/FormSection.tsx` | DS composed | `mapped-manual` | Canonical file now provides `FormSection / Foundations / Light` and `FormSection / Foundations / Dark` boards plus `FormSection / Variant / Source` light/dark sets for `variant=flat|card`. The source set stays narrow to the runtime contract: `flat` is the default divider-first settings/admin section shell, while `card` is the bounded secondary shell. Explicit token gaps remain in Figma for the runtime `16/20` section-title rhythm, `20px` card padding, the `6px` flat-header gap, and the missing `border/subtle` semantic. |
| `not-built` | `not-built` | `SectionHeader` | `src/design-system/components/SectionHeader.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `DS Foundations` | `813:545`, `800:1050` | `DataPanelTable` | `src/design-system/components/DataPanelTable.tsx` | DS composed | `mapped-manual` | Canonical file now provides `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark` boards plus `DataPanelTable / Variant / Source` light/dark sets. The source stays shell-scoped and progressive: it proves the combinations `actions=false, toolbar=false, footer=false`, `actions=true, toolbar=false, footer=false`, `actions=true, toolbar=true, footer=false`, and `actions=true, toolbar=false, footer=true` while keeping column schema, row rendering, empty-state content, and business actions route-owned. The footer proof point now mirrors the runtime metadata-note usage instead of inventing a CTA footer, and the related `row action` / `pagination item` button recipes now intentionally use the same rounded-rect `radius/sm (8px)` posture plus the restored `example row + state strip` guidance seen in the canonical `Button recipes` card instead of the core pill shape. Explicit token gaps remain visible for runtime `border-subtle` and route-owned table-head fills. |
| `not-built` | `not-built` | `Pagination` | `src/design-system/components/Pagination.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `EmptyState` | `src/design-system/components/EmptyState.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `RowActions` | `src/design-system/components/RowActions.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `ConfirmDialog` | `src/design-system/components/ConfirmDialog.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `DS Foundations` | `575:144`, `575:191`, `575:157`, `575:204` | `Surface` | `src/design-system/components/Surface.tsx` | DS composed | `mapped-manual` | Canonical file now contains verified light/dark `Surface / Variant / Source` blocks plus paired hierarchy study cards. Current token gaps remain explicit: no semantic `border/subtle`, no semantic `bg-muted`, no `radius/12` token, and no `space/20` token yet. |

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
