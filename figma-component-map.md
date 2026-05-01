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
- Canonical scope today: `DS Foundations` + `DS Primitives` +
  `DS Components` + `DS Parking / Legacy` + `Foundation Review`
  (reorganized on `2026-04-30`)
- Migration note: the canonical file is now foundation-first. Until the
  inventory-diff pass remaps every row, some page names/node IDs below should be
  treated as legacy placeholders rather than verified live-node mappings in the
  new canonical file.

## Canonical Page Audit

Detailed file audit against the live canonical file `koZEgVUfQhNEQmXISNQx56`
was refreshed through the 2026-04-30 page-role split. Use this section as the current page/section
baseline when repo docs and older node claims disagree.

### Page Inventory

| Page | Page node | Top-level coverage | Binding posture | Notes |
| --- | --- | --- | --- | --- |
| `DS Foundations` | `13:20` | 5 top-level frames spanning `Typography`, `Color Primitives`, and `Spacing + Radius` only | 2026-04-30 page-role split isolates true foundations again; this page now holds only token-bound boards and no shared component shells | treat this page as the true foundation source of truth, not a catch-all canonical build surface |
| `DS Primitives` | `1037:312` | 22 top-level frames spanning `Button`, `Input / Search`, `Card`, `Dropdown`, `Badge`, `Select`, `Textarea`, `Avatar`, `Switch`, `Modal`, and `LoadingSkeleton` in paired light/dark boards | 2026-04-30 page-role split moved primitive component boards off `DS Foundations`; the same day added canonical `Avatar / Foundations` light/dark boards plus nested `Avatar / Size` and `Avatar / Source` sets, the follow-up slice added paired `Switch / Foundations` boards with reusable state sets, the next heavier-primitive slice added paired `Modal / Foundations` boards plus nested `Modal / Size` sets, and the next narrow follow-up added paired `LoadingSkeleton / Foundations` boards plus nested `LoadingSkeleton / Shape` sets | use this page only for bounded visual primitives; both `RevealImage` and `ToastProvider` are now deliberately deferred because their real contracts stay container-owned or behavior-owned rather than board-owned |
| `DS Components` | `1037:313` | 10 top-level frames spanning `Surface`, `FormSection`, `DataPanelTable`, `EmptyState`, and `SectionHeader` in paired light/dark boards | 2026-04-30 page-role split moved composed shared-component boards off `DS Foundations` without changing their live node ids; the first composed follow-up slice then added paired `EmptyState / Foundations` boards plus nested light/dark source sets, and the next slice added paired `SectionHeader / Foundations` boards plus nested light/dark source sets | use this page for composed shared surfaces instead of mixing them with tokens or primitive boards |
| `DS Parking / Legacy` | `1037:314` | 1 top-level parking frame: `Recovered DataPanelTable root text` | recovered non-canonical root text is intentionally parked here so it stops polluting the live library pages | do not treat this page as canonical DS coverage |
| `Foundation Review` | `1041:312` | 1 top-level review frame: `Foundation Review / Light` (`1041:313`) | the 2026-04-30 page-role split restored a dedicated review-only surface after canonical pages were separated by role | keep this page as a review surface, not a reusable library source |

### Section Inventory

| Page | Section node | Section | Audit status | Notes |
| --- | --- | --- | --- | --- |
| `DS Foundations` | `47:2` | `Typography / Light` | verified | 2026-04-28 section re-audit confirms all text nodes stay bound for font family, font size, line height, and text fill, and the five section cards bind their 24px corners through per-corner `radius/lg` variables rather than local radius drift |
| `DS Foundations` | `2:1176` | `Typography / Dark` | verified | 2026-04-28 section re-audit confirms all text nodes stay bound for font family, font size, line height, and text fill, and the five section cards bind their 24px corners through per-corner `radius/lg` variables rather than local radius drift |
| `DS Foundations` | `2:1269` | `Color Primitives / Light` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, displayed hex labels, and per-corner radius. The live primitive collection now includes `26` color variables after adding the dedicated `support/success/*` and `support/warning/*` `base / dust / soft` families surfaced on this board |
| `DS Foundations` | `158:177` | `Color Primitives / Dark` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, displayed hex labels, and per-corner radius. The live primitive collection now includes `26` color variables after adding the dedicated `support/success/*` and `support/warning/*` `base / dust / soft` families surfaced on this board |
| `DS Foundations` | `147:2` | `Spacing + Radius / Primitives` | verified | 2026-04-28 section re-audit confirms the board stays fully bound for text, fills, strokes, spacing samples, and per-corner radius, including the `radius/xs` sample row and the existing `space/2` variable in the primitive collection |
| `DS Primitives` | `191:2` | `Button / Foundations / Light` | verified | 2026-04-28 control re-audit confirms the light board stays fully bound for text family/size/line-height/fill and for shell fills, strokes, and per-corner radius across the live `Button / State`, `Button / Size`, and `Button / Icon` sets. The earlier `wrapper radius debt` note was a false positive caused by zero-radius container frames and icon-instance shells, not by any non-zero local radius drift. The current recipe card now keeps `Row action` as an `Edit / Open` example row plus a compact state strip, locks `Pagination item` to the same rounded-rect `radius/sm (8px)` posture, and leaves `Panel CTA` on the bounded-neutral pill candidate. |
| `DS Primitives` | `294:29` | `Button / Foundations / Dark` | verified | same token-bound posture as the light board. The 2026-04-28 control re-audit also confirms the old dark `light recipe` subtitle drift is gone, the live recipe card mirrors the light board structure, and no non-zero local radius debt remains in the dark `Button / State`, `Button / Size`, or `Button / Icon` component sets. |
| `DS Primitives` | `315:56` | `Input / Search / Light` | verified with explicit wrapper/token gaps | 2026-04-28 control re-audit confirms the light board stays fully bound for text family and text fills, shell fills/strokes, and field-shell radius across the live `Input / State`, `Input / Size`, `SearchInput / State`, and `SearchInput / Size` sets. The remaining live gaps are narrow and explicit: the four component-set wrappers still keep local `cornerRadius=5`, and the `Clear` action label in the search-state explainer still uses local `14/20` typography while staying bound for font family and text fill. |
| `DS Primitives` | `360:2` | `Input / Search / Dark` | verified with explicit wrapper/token gaps | same token-bound posture as the light board and the same two remaining gaps: local `cornerRadius=5` on the four component-set wrappers plus a local `14/20` `Clear` action label in the search-state explainer. |
| `DS Primitives` | `439:110` | `Card / Foundations / Light` | verified with explicit token gaps | 2026-04-28 shell re-audit confirms the light board stays bound for font family, line height, text fill, shell fills/strokes, and per-corner radius on the section cards plus the live `Card / Size / Source` set. The remaining card gaps are explicit rather than structural: local type sizes still drive the title/body/footer copy, and the geometry keeps intentional local values such as `space/20`, `space/10`, and the preview-stack arrangement. |
| `DS Primitives` | `726:156` | `Card / Foundations / Dark` | verified with explicit token gaps | same remaining token-gap posture as the light board, now tracked under the current live dark frame id. The dark board still uses the same source-set geometry and the same local type-size gap, and the old wrapper-radius debt claim remains closed. |
| `DS Primitives` | `499:110` | `Dropdown / Foundations / Light` | verified with explicit token gaps | 2026-04-28 shell re-audit confirms the light board stays fully bound for all `23/23` text nodes across font family, font size, line height, and text fill, and all painted fills/strokes on the board remain token-bound. The remaining Figma-only gap is now narrowed to explicit local radius on the study containers `context scene` (`20`) and `row calibration scene` (`20`) plus the default/unselected `menu row` shells (`12`). |
| `DS Primitives` | `499:181` | `Dropdown / Foundations / Dark` | verified with explicit token gaps | same token-bound posture as the light board and the same narrow local-radius gap: `context scene` + `row calibration scene` stay on local `20`, while the default/unselected `menu row` shells keep local `12`. |
| `DS Components` | `573:143` | `Surface / Foundations / Light` | verified with explicit token/copy gaps | 2026-04-28 shell re-audit confirms the light board stays fully bound for all `26/26` text nodes across font family, font size, line height, and text fill, and all painted fills/strokes remain token-bound. The only remaining live local-radius gap is `shell zone` (`20`). The older broad token-gap claim on the board copy itself is now partially stale: live subtle/muted/popover/support nodes already bind their fills, strokes, and radii even though the card text still describes a wider gap. |
| `DS Components` | `573:182` | `Surface / Foundations / Dark` | verified with explicit token/copy gaps | same token-bound posture as the light board, tracked under the live dark frame id. The only remaining live local-radius gap is `shell zone` (`20`), while the dark source/hierarchy ids now live under `627:633` and `627:646` rather than the older repo claims. |
| `Foundation Review` | `1041:313` | `Foundation Review / Light` | review-only | keep as a comparison board; it should not be treated as a reusable library source or a proof that every review text node already mirrors the canonical font-family variable |

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
`2026-04-30`.

This snapshot is the working migration ledger for the current
`Inventory diff + docs drift` phase. Use it to distinguish current canonical
coverage from older row/node claims that still need to be re-established in the
new file.

| Area | DS items | Classification | Canonical Figma evidence | Action |
| --- | --- | --- | --- | --- |
| Tokens | `colors.ts`, `spacing.ts`, `radius.ts`, `typography.ts` | `mapped and current` | `DS Foundations` contains color, spacing/radius, and typography boards plus matching variable collections | carry forward as the current foundation baseline |
| Tokens | `hero.ts` | `code exists, figma missing` | no hero-token board or hero-specific variable collection in the canonical file | leave out of the foundation pass; revisit with product exemplars |
| Foundations | `Button` | `mapped and current` | canonical file contains reusable `Button / State`, `Button / Size`, and `Button / Icon` component sets in light/dark coverage; the current Figma source now uses `primary | quiet | ghost | soft` and trials `sm=36` on the size boards while runtime now matches the tone family and still trails only on `sm=32` | keep as the best-aligned foundation slice and track the remaining size adoption gap explicitly |
| Foundations | `Input`, `SearchInput` | `mapped and current` | canonical file now contains light/dark `Input / State`, `Input / Size`, `SearchInput / State`, and `SearchInput / Size` component sets under the `Input / Search` foundation boards | carry forward as the current field-shell foundation mapping; the 2026-04-27 re-audit locked both families to `radius/sm (8px)` across state + size coverage, while hero/loading/submit-button coverage remains follow-up scope |
| Primitives | `Card` | `mapped and current` | canonical file now contains `Card / Size` and `Card / Size / Dark` component sets under dedicated `Card / Foundations` light/dark boards | carry forward as the first shared-library shell proof point and reuse it when remapping generic surface posture |
| Primitives | `LoadingSkeleton` | `mapped and current` | canonical file now contains paired `LoadingSkeleton / Foundations / Light` and `LoadingSkeleton / Foundations / Dark` boards plus reusable `LoadingSkeleton / Shape` sets | carry forward as a shell-only primitive slice; keep content-block, table-row, hero, and detail loading geometry route-owned while leaving the `bg/muted` semantic token gap explicit |
| Primitives | `Dropdown` | `mapped study reference` | canonical file now contains verified light/dark dropdown-popover shell study boards, but it still does not expose a reusable component set or final mapping node | close the current shared-library pass with `Dropdown` intentionally kept as a study-board reference; reopen only when a true reusable component-set mapping is ready |
| Primitives | `RevealImage`, `ToastProvider` | `code exists, figma missing` | no canonical pattern or component for either item in the current file | both items are now intentionally deferred after inventory: `RevealImage` because its visual contract stays container-owned, `ToastProvider` because its shared contract is provider behavior/timing rather than a bounded static primitive board |
| Composed | `FormSection` | `mapped and current` | canonical file now contains dedicated `FormSection / Foundations / Light` and `FormSection / Foundations / Dark` boards plus reusable `FormSection / Variant / Source` light/dark sets for `flat` and `card` | carry forward as the first composed shared-form shell on top of `Surface` and `Card`; keep the explicit typography/spacing/border token gaps visible |
| Composed | `Pagination`, `RowActions`, `ConfirmDialog` | `doc drift` | older rows still point at pages/nodes from the previous file, while the current canonical file still does not yet verify these three components | revisit only if a separate optional composed follow-up plan is opened |
| Composed | `DataPanelTable` | `mapped and current` | canonical file now contains dedicated `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark` boards plus reusable `DataPanelTable / Variant / Source` light/dark sets | carry forward as the canonical dashboard/admin table shell; keep row schema, filters, and business actions route-owned while leaving the `border/subtle` token gap explicit |
| Composed | `Surface` | `mapped and current` | canonical file now contains verified `Surface / Foundations / Light` and `Surface / Foundations / Dark` boards with a `Surface / Variant / Source` block plus a hierarchy study card | carry forward as the shared shell bridge before remapping `FormSection` and `DataPanelTable`; keep the remaining token gaps explicit |
| Product-bound | `ResourceCard`, `PriceBadge`, `PriceLabel` | `code exists, figma missing` | no canonical marketplace pricing/card exemplar in the current file | defer to the product exemplar pass |
| Product-bound | `FileUploadWidget`, `NotificationButton`, `PickerControls` | `doc drift` | older rows still claim canonical admin mappings, but the current file does not yet contain verified `Product / Admin` coverage | re-audit after the foundation/library passes |
| Layout | `Container`, `PageContainer`, `PageContent`, `PageContentWide`, `PageContentNarrow`, `SidebarContainer`, `SidebarNav`, `SidebarSection`, `SidebarSectionLabel`, `IconWrapper`, `SidebarBadge`, `SidebarItem`, `SidebarFooter`, `Divider`, `NavGroup` | `code exists, figma missing` | no layout-helper page or verified layout primitive board exists in the current canonical file | decide later whether these should gain Figma coverage or remain code-owned/documented only |
| Review-only Figma surface | `Foundation Review / Light` | `figma exists, code missing` | review board exists in the canonical file but is not a code component | keep as a review surface, not a DS mapping target |

## Primitives

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `DS Primitives` | `746:510`, `553:167`, `259:92`, `746:468`, `746:598`, `746:635` | `Button` | `src/design-system/primitives/Button.tsx` | DS primitive | `mapped-manual` | Canonical file now verifies light/dark `Button / State`, `Button / Size`, and `Button / Icon` sets with the current live ids. The 2026-04-28 control re-audit cleared the stale `wrapper radius debt` claim too: the component sets no longer carry any non-zero local radius drift, and the dark subtitle drift is gone. The current Figma base keeps `primary | quiet | ghost | soft`, trials `sm=36`, and now documents recipes more explicitly: `Row action` shows an `Edit / Open` example row plus a compact state strip, `Pagination item` shares the same rounded-rect `radius/sm (8px)` posture, and `Panel CTA` stays on the bounded-neutral pill candidate. Runtime now mirrors the full tone family too: `Button.tsx` adopts `soft` with the same `bg/inset -> bg/surface` hover contract plus disabled `fg/subtle`, while `RowActionButton size=\"md\"` and `PaginationButton size=\"md\"` continue to carry the rounded-rect posture for dashboard creator-resources. The remaining runtime gap is the global `sm=32` ladder versus the Figma `sm=36` trial. |
| `DS Primitives` | `736:178`, `746:208` | `Badge` | `src/design-system/primitives/Badge.tsx` | DS primitive | `mapped-manual` | Canonical file now provides verified `Badge / Variant / Source` and `Badge / Variant / Source / Dark` sets inside dedicated `Badge / Foundations` light/dark boards. The canonical set keeps `Badge` non-interactive and covers `neutral`, `info`, `success`, `warning`, `featured`, `destructive`, and `outline`. The 2026-04-28 shared-component re-audit confirmed the boards were fully bound for font family/text fill and for all painted fills/strokes, and the warm split still holds: `warning` stays on `bg/inset` with `support/warning/base` stroke and `support/warning/dust` text, while `featured` uses an editorial `accent/sand/wash` fill with `accent/sand/base` border/text in both light and dark. The 2026-04-29 residual cleanup closed the remaining Figma-side badge gaps too: the light/dark source-set wrappers now sit at `cornerRadius=0`, and the seven badge labels now bind to dedicated `type/badge/size` + `type/badge/line` variables instead of local `12/16` overrides. Runtime `Badge.tsx` now mirrors the same canonical set directly, with the earlier runtime-only aliases removed from the shared primitive contract and the primitive now consuming the matching `text-badge` `12/16` size token. |
| `DS Primitives` | `432:218`, `548:134`, `627:780`, `627:804` | `Input` | `src/design-system/primitives/Input.tsx` | DS primitive | `mapped-manual` | Canonical file now provides normalized light/dark `Input / State` and `Input / Size` sets with the current live ids. The 2026-04-28 control re-audit confirms that every field shell in those sets still uses `radius/sm (8px)` with the shared `field` height ladder, `space/16`, and caption-scale text. The remaining Figma-only gaps are explicit: the light/dark component-set wrappers keep local `cornerRadius=5`, and the search-explainer `Clear` text keeps a local `14/20` typography override. The 2026-04-29 residual follow-up now closes the shared runtime field-shell drift too: `Input.tsx` enforces the same `8px` radius at runtime, with `/admin/users` as the first proof route. |
| `DS Primitives` | `994:342`, `994:366`, `994:519`, `994:543` | `Select` | `src/design-system/primitives/Select.tsx` | DS primitive | `mapped-manual` | Canonical file now provides `Select / Foundations / Light` and `Select / Foundations / Dark` boards plus dedicated `Select / State` and `Select / Size` sets under the current live ids. The mapping intentionally mirrors the shared field-shell grammar proven in `Input / Search`: `radius/sm (8px)`, shared field heights, helper/error copy below the shell, and an explicit caret affordance on every state/size variant while option lists remain route-owned. The first runtime parity slice is now live too: `Select.tsx` explicitly keeps the same `8px` radius target at runtime, `/admin/settings` is the first proved route family because it mounts `Input`, `Select`, and `Textarea` together without product-owned search overrides, `admin/resources` is the first widened follow-up family for shared select shells, and the low-risk admin filter bucket (`/admin/activity`, `/admin/audit`, `/admin/analytics/ranking`) now proves the same shared select geometry on select-only routes. |
| `DS Primitives` | `1019:386`, `1019:507` | `Textarea` | `src/design-system/primitives/Textarea.tsx` | DS primitive | `mapped-manual` | Canonical file now provides `Textarea / Foundations / Light` and `Textarea / Foundations / Dark` boards plus dedicated `Textarea / State` sets under the current live ids. The multiline contract intentionally reuses the same quiet field-shell target as `Input / Search` and `Select` (`radius/sm (8px)`, helper/error copy below the shell) while keeping exact rows, max length, counters, and AI-specific affordances route-owned. Unlike `Select`, `Textarea` does not invent a fake size ladder in Figma; the canonical slice proves state choreography only and documents min-height / resize behavior as route-owned shell guidance. The first runtime parity slice is now live too: `Textarea.tsx` keeps the same `8px` radius target at runtime, `/admin/settings` proves the roomy multiline shell without widening product-owned long-form behaviors, and `admin/resources` is now the first widened follow-up family for shared multiline shells. |
| `DS Primitives` | `439:303`, `726:171` | `Card` | `src/design-system/primitives/Card.tsx` | DS primitive | `mapped-manual` | Canonical file now provides first-pass light/dark `Card / Size / Source` component sets with `size=default` and `size=sm`, plus dedicated `Card / Foundations` study boards for shell posture reference under the current live ids. Repo runtime adoption started on 2026-04-28 too: the shared `Card` primitive now renders its root shell through `surface` and its footer through `inset`, matching the current Figma base more directly. The remaining Figma-side debt is explicit instead of structural: local type sizes on the title/body/footer copy plus the intentional local geometry values (`space/20`, `space/10`, preview-stack arrangement). |
| `DS Primitives` | `1087:246`, `1087:292`, `1087:350`, `1087:363` | `Switch` | `src/design-system/primitives/Switch.tsx` | DS primitive | `mapped-manual` | Canonical file now provides paired `Switch / Foundations / Light` and `Switch / Foundations / Dark` boards plus reusable `Switch / State` sets under the current live ids. The slice intentionally stays narrow: it locks the current runtime `46×24` track, `20×20` thumb, and the four visual states (`unchecked`, `checked`, `disabled unchecked`, `disabled checked`) while leaving labels, helper copy, row shells, and form composition route-owned. Focus remains documented as a runtime accessibility affordance rather than a Figma source variant, and no broader control-size ladder is invented around the switch yet. |
| `DS Primitives` | `499:110`, `499:181` | `Dropdown` | `src/design-system/primitives/Dropdown.tsx` | DS primitive | `mapped-study` | Canonical file now contains verified `Dropdown / Foundations / Light` and `Dropdown / Foundations / Dark` study boards covering trigger context, open shell, selected row, submenu edge, and destructive row. The 2026-04-28 shell re-audit confirms those boards are fully bound for text family/size/line-height/fill and for all painted fills/strokes; the only remaining Figma-only debt is the intentional local radius on `context scene` + `row calibration scene` (`20`) and the default/unselected `menu row` shells (`12`). `Dropdown` stays a study-board reference rather than a promoted reusable component-set mapping. |
| `DS Primitives` | `1063:246`, `1063:367`, `1063:317`, `1063:366`, `1063:438`, `1063:487` | `Avatar` | `src/design-system/primitives/Avatar.tsx` | DS primitive | `mapped-manual` | Canonical file now provides `Avatar / Foundations / Light` and `Avatar / Foundations / Dark` boards plus nested `Avatar / Size` and `Avatar / Source` component sets under the current live ids. The source slice locks the shared 24/32/40/56 ladder and the current runtime fallback order (image, name-derived initials, email-derived initials, explicit initials, anonymous default). Image and fallback states now share the same stroked circular shell posture in both Figma and code. The remaining gap stays narrow and explicit: runtime-only 28/36/72/104 mounts still sit outside the canonical ladder, and the fallback shell keeps a local brand gradient plus proportional initials sizing until avatar-specific gradient/type tokens exist. |
| `DS Primitives` | `1146:246`, `1154:246`, `1146:352`, `1154:259` | `Modal` | `src/design-system/primitives/Modal.tsx` | DS primitive | `mapped-manual` | Canonical file now provides `Modal / Foundations / Light` and `Modal / Foundations / Dark` boards plus nested `Modal / Size` sets under the current live ids. The slice locks the shared runtime shell instead of route-specific form content: `sm`, `md`, `lg`, and `xl` prove the `384 / 448 / 512 / 576` width ladder, the centered surface frame, header/body/footer rail structure, and the default close affordance posture that backs the real `/admin/categories` consumer. The current Figma-only gap is explicit rather than silent: divider rails still bind to `neutral/line` because the canonical file does not yet expose a separate semantic `border/subtle` variable, while overlay tint, portal motion, and footer button semantics stay runtime-owned concerns. |
| `DS Primitives` | `1170:246`, `1170:272`, `1170:302`, `1170:307` | `LoadingSkeleton` | `src/design-system/primitives/LoadingSkeleton.tsx` | DS primitive | `mapped-manual` | Canonical file now provides `LoadingSkeleton / Foundations / Light` and `LoadingSkeleton / Foundations / Dark` boards plus nested `LoadingSkeleton / Shape` sets under the current live ids. The slice intentionally stays shell-only: it proves the neutral pulse primitive and a bounded `line | bar | circle | pill` posture set without promoting content-block, table-row, hero, or detail loading layouts into the primitive contract. The current Figma-only gap is explicit: there is still no dedicated semantic `bg/muted` variable in the canonical file, so the light board binds shell fills to `bg/inset` and the dark board binds them to `border/default` to mirror the current runtime aliasing. |
| `DS Primitives` | `432:276`, `548:166`, `627:821`, `627:842` | `SearchInput` | `src/design-system/primitives/SearchInput.tsx` | DS primitive | `mapped-manual` | Canonical file now provides normalized light/dark `SearchInput / State` and `SearchInput / Size` sets with the current live ids. The 2026-04-28 control re-audit confirms the same `radius/sm (8px)` field shell across all four sets, plus the same narrow wrapper/token gaps tracked on the parent `Input / Search` boards: local `cornerRadius=5` on the component-set wrappers and a local `14/20` `Clear` action label in the search-state explainer. The 2026-04-29 runtime parity slice now adopts that shell on `SearchInput variant=\"default\"` itself: `/dashboard/library` proves the shared `40px / 8px` toolbar search, the dashboard topbar search on that same `40px / 8px` ladder, the hydrated topbar clear action, and the admin global/users/resources/activity/ranking mounts now route through the same primitive instead of local `Input + icon` wrappers. Public `/resources` remains a route-owned product override with `40px` height and pill geometry. `hero`, `loading`, and route-owned search-shell overrides remain outside this foundation-first mapping. |
| `Primitives` | `not-built` | `RevealImage` | `src/design-system/primitives/RevealImage.tsx` | DS primitive | `deferred-after-inventory` | The runtime helper only wraps `next/image` for already-sized containers and lets the caller own shell geometry, crop mode, placeholder tone, overlay, and decoration. Real mounts in `ResourceGallery`, `ResourceCard`, and `HeroSearch` prove product-/container-owned image behavior rather than a bounded shared Figma primitive contract, so canonical board coverage should stay deferred for now. |
| `Primitives` | `not-built` | `ToastProvider` | `src/design-system/primitives/ToastProvider.tsx` | DS primitive | `deferred-after-inventory` | The runtime primitive is a provider + queue manager whose important contract is behavioral: global mount ownership, viewport anchoring, success-dedupe, auto-dismiss timing, persistent warning/error defaults, and exit choreography. With no canonical `Toast` or `Notification` nodes in the Figma file, a static primitive board would under-describe the real shared contract, so canonical Figma coverage should stay deferred for now. |

## Composed

| Figma page | Figma node | Figma component | Code path | Owner | Status | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| `DS Components` | `759:251`, `746:275` | `FormSection` | `src/design-system/components/FormSection.tsx` | DS composed | `mapped-manual` | Canonical file now provides `FormSection / Foundations / Light` and `FormSection / Foundations / Dark` boards plus `FormSection / Variant / Source` light/dark sets under the current live ids for `variant=flat|card`. The 2026-04-28 shared-component re-audit confirms the boards stay fully bound for all `24/24` text nodes across font family and text fill plus all painted fills/strokes, and there is no remaining local radius debt. The remaining live Figma-only gaps are explicit geometry/type gaps instead: the section titles still use local `16/20`, the field labels still use local `14/20`, `card` still keeps local `20px` padding, `flat` still keeps the local `6px` header gap, and divider/footer separators still rely on the broader `border/default` token until a dedicated `border/subtle` semantic exists. |
| `DS Components` | `1214:68`, `1214:93`, `1214:141`, `1214:165` | `SectionHeader` | `src/design-system/components/SectionHeader.tsx` | DS composed | `mapped-manual` | Canonical file now provides `SectionHeader / Foundations / Light` and `SectionHeader / Foundations / Dark` boards plus light/dark `SectionHeader / Variant / Source` sets under the current live ids. The 2026-05-01 composed-slice pass locks the bounded shared shell only: eyebrow, title, description, alignment, and the optional trailing actions slot through a `default | centered | with-actions | minimal` source set that mirrors runtime plus Storybook posture. The `with-actions` lane now reuses canonical `Button size=sm` instances from the shared button family with generic `Quiet action` / `Primary action` labels, so the board proves a DS-backed action cluster without inventing route-specific CTA semantics. |
| `DS Components` | `813:545`, `873:1766` | `DataPanelTable` | `src/design-system/components/DataPanelTable.tsx` | DS composed | `mapped-manual` | Canonical file now provides `DataPanelTable / Foundations / Light` and `DataPanelTable / Foundations / Dark` boards plus `DataPanelTable / Variant / Source` light/dark sets under the current live ids. The 2026-04-28 shared-component re-audit confirms the source stays shell-scoped and progressive: it proves `actions=false, toolbar=false, footer=false`, `actions=true, toolbar=false, footer=false`, `actions=true, toolbar=true, footer=false`, and `actions=true, toolbar=false, footer=true` while keeping column schema, row rendering, empty-state content, and business actions route-owned. The related `row action` / `pagination item` button recipes now intentionally use the same rounded-rect `radius/sm (8px)` posture plus the restored `example row + state strip` guidance seen in the canonical `Button recipes` card instead of the core pill shape. The first runtime rollout slice now uses that recipe in the dashboard creator-resources table by switching the `Edit` action to `RowActionButton size=\"md\"` and the page controls to `PaginationButton size=\"md\"`. The remaining live Figma-only gaps are explicit instead of broad: the two `Showing latest 2 entries` footer-note copies still sit fully local, the light/dark source-set wrapper frames still keep local `cornerRadius=5`, and the table copy itself still relies on local type recipes (`16/20` titles, `14/20` descriptions/columns/row copy, inherited `12/16` badge sizing from the shared badge recipe) while runtime still asks for `border-subtle` and route-owned table-head fills. |
| `not-built` | `not-built` | `Pagination` | `src/design-system/components/Pagination.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `DS Components` | `1192:68`, `1192:121`, `1192:196`, `1192:220` | `EmptyState` | `src/design-system/components/EmptyState.tsx` | DS composed | `mapped-manual` | Canonical file now provides `EmptyState / Foundations / Light` and `EmptyState / Foundations / Dark` boards plus light/dark `EmptyState / Variant / Source` sets under the current live ids. The 2026-04-30 composed-slice pass locks the bounded shared shell only: dashed rounded container, centered stack rhythm, `icon | title | description | action` slot order, and a `default | minimal` source pair that matches runtime plus Storybook posture. Icon examples stay neutral placeholders, while the action lane now reuses a canonical `Button size=sm` soft instance with a generic `Soft action` label so the board proves a DS-backed CTA without letting the action outweigh the empty-state message. The remaining explicit Figma-only gap is narrow: runtime asks for `border-border-subtle`, but canonical Figma still lacks a semantic `border/subtle` variable, so the dashed rail currently binds to `border/default`. |
| `not-built` | `not-built` | `RowActions` | `src/design-system/components/RowActions.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `not-built` | `not-built` | `ConfirmDialog` | `src/design-system/components/ConfirmDialog.tsx` | DS composed | `pending-figma` | Previous mapping came from the older DS file; rebuild and remap after the foundation pass. |
| `DS Components` | `575:144`, `627:633`, `575:157`, `627:646` | `Surface` | `src/design-system/components/Surface.tsx` | DS composed | `mapped-manual` | Canonical file now contains verified light/dark `Surface / Variant / Source` blocks plus paired hierarchy study cards under the current live ids. The 2026-04-28 shell re-audit confirms those blocks stay fully bound for text family/size/line-height/fill and for all painted fills/strokes; the only remaining live local-radius gap is the hierarchy `shell zone` (`20`). The board copy still mentions a broader token-gap story (`border/subtle`, `bg-muted`, `radius/12`, `space/20`) than the live nodes now show, so treat that text as stale guidance rather than as the authoritative node-level truth. |

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
