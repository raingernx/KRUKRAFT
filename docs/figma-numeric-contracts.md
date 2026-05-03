# Figma Numeric Contracts

This file defines the repo-owned numeric-contract workflow for non-trivial
Figma-to-code implementation work.

Use it when a component, shell, or variant needs high-fidelity translation from
the canonical Figma file into runtime code.

## Required Usage

For non-trivial Figma-to-code implementation work, the relevant contract block
in this file must be created or refreshed before closing the task. Treat a
missing or stale block as implementation debt, not optional documentation.

## Workflow

1. Lock one canonical node or variant.
2. Pull structured Figma metadata/JSON for that exact node before editing code.
3. Write a numeric contract from that metadata.
4. Write the DOM sibling structure from that metadata before editing code.
5. Map the contract into code.
6. Verify that token-sensitive utilities resolve to the intended computed CSS
   values in runtime instead of trusting similar class names.
7. Verify with runtime screenshot QA against the same node or variant.
8. Only then sync handoff docs/context if the implementation truth changed.

## Template

Copy this block before implementing a new Figma-backed component.

```md
### <Component name>

- Scope:
- Canonical node:
- Runtime owner:
- Variants in scope:

#### Shell
- Width:
- Height:
- Padding:
- Gap:
- Radius:
- Border:
- Background:

#### Child Geometry
- Icon wrapper:
- Icon:
- Content width:
- Dismiss/action wrapper:

#### DOM Sibling Structure
- Parent stack:
- Child order:
- Sibling groups:
- Gap owner:
- Notes on nodes that must stay separate:

#### Typography
- Title:
- Description:
- Action:
- Eyebrow/label:

#### Variant Rules
- no-action:
- with-action:
- centered/minimal/etc:

#### Runtime Notes
- Parent-owned:
- Route-owned:
- Known token gaps:

#### Proof
- Figma screenshot:
- Runtime proof route/harness:
```

## Seeded Contracts

### NotificationItem

- Scope: bounded item shell only, not stack choreography or bell-dropdown list
- Canonical node: `1435:2289`
- Runtime owner: `src/components/admin/NotificationItem.tsx`
- Variants in scope: `type=success|info|warning|error`,
  `action=no-action|with-action`

#### Shell
- Width: `325`
- Height:
  - success + no-action `104`
  - info + no-action `130`
  - warning + no-action `100`
  - error + no-action `100`
  - success + with-action `130`
  - info + with-action `130`
  - warning + with-action `100`
  - error + with-action `130`
- Padding: `12`
- Gap: `12`
- Radius: `8`
- Border: `1`
- Background: semantic card shell

#### Child Geometry
- Icon wrapper: `32 x 32`
- Icon: `20 x 20`
- Content width: `223`
- Dismiss wrapper: `20 x 20`
- Dismiss icon: `16 x 16`

#### DOM Sibling Structure
- Parent stack: outer shell row contains `icon wrapper`, `content`, `dismiss`
- Child order: inside `content`, `top row` comes before `description`
- Sibling groups: `title` and `action` are siblings inside `top row`;
  `description` is a sibling of `top row`, not a child of `title`
- Gap owner:
  - shell row owns `12`
  - content column owns `4` or `8` depending on variant
  - top row owns `12` when action exists
- Notes on nodes that must stay separate: do not collapse `description` into
  the same DOM block as `title`, or the Figma content-stack gap will disappear

#### Typography
- Title: `16/24`, semibold via shared `title-sm` token
- Description: `14/20`, regular
- Action: `14/20`, semibold

#### Variant Rules
- no-action content gap:
  - success `8`
  - info `4`
  - warning `4`
  - error `4`
- with-action content gap: `4`
- top row gap when action exists: `12`

#### Runtime Notes
- Parent-owned: stack position, queue order, bell list behavior, unread count
- Route-owned: message copy, action handler semantics
- Known token gaps: none for the current shell contract

#### Proof
- Figma screenshot: `NotificationItem / Variant / Source` dark set `1435:2289`
- Runtime proof route/harness: `/dev/notifications?scenario=all`

### NotificationButton

- Scope: bounded bell/count trigger only, not dropdown panel or notification-row
  behavior
- Canonical nodes:
  - light board `1489:194`
  - dark board `1489:284`
  - light source set `1496:72`
  - dark source set `1496:143`
- Runtime owner: `src/design-system/components/NotificationButton.tsx`
- Variants in scope: `count=0|3|9+`

#### Shell
- Width:
  - `count=0` `40`
  - `count=3|9+` `44`
- Height:
  - `count=0` `40`
  - `count=3|9+` `44`
- Button shell: `40 x 40`
- Badge:
  - `3` = `20 x 20`
  - `9+` = `24 x 20`
- Radius: pill / full circle
- Border: current Figma uses `border/default`; runtime uses `border-border-strong`
- Background: `bg/shell`

#### Child Geometry
- Bell glyph: `20 x 20`
- Badge sits above top-right of the button shell

#### DOM Sibling Structure
- Parent stack: one relative wrapper only
- Child order: `button shell` -> optional `badge`
- Sibling groups:
  - badge is a sibling of the button shell
  - bell icon is a child of the button shell
- Gap owner: none; badge position is absolute/overlayed, not flex-gap driven
- Notes on nodes that must stay separate: do not fold unread badge into the
  bell icon lane or into the bell button's inline content row

#### Typography
- Badge count: `12/16`, semibold

#### Variant Rules
- `count=0`: shell only
- `count=3`: shell + compact unread badge
- `count=9+`: shell + overflow unread badge

#### Runtime Notes
- Parent-owned: open/closed state and placement in topbar shells
- Route-owned: bell dropdown content, unread transitions, notification rows
- Known token gaps:
  - canonical Figma still lacks `border/strong`
  - unread badge still lacks a dedicated semantic beyond `state/danger-fill`

#### Proof
- Figma screenshot: `NotificationButton / Variant / Source` dark set `1496:143`
- Runtime proof: `NotificationButton` Storybook counts and `NotificationBell`
  topbar usage

### PickerControls

- Scope: bounded admin picker shell family only, not upload-progress copy,
  selected-file business metadata, or async workflow messaging
- Canonical nodes:
  - light board `1498:194`
  - dark board `1498:257`
- Runtime owner: `src/design-system/components/PickerControls.tsx`
- Variants in scope:
  - composed `images branch`
  - action row
  - preview + media shell
  - dropzone `default|active|reject`

#### Shell
- Board shell: product-bound exemplar only
- Action row gap: `8`
- Preview row gap: `24`
- Dropzone row gap: `16`
- Action button height: `36`
- Preview card: `440 x 72`, radius `16`
- Media preview: `224 x 160`, radius `8`
- Dropzone shell: `400 x 120`, radius `16`

#### Child Geometry
- Action icon: `16 x 16`
- Preview icon buttons: `28 x 28`
- Preview filename/meta copy stack gap: `4`
- Dropzone upload icon: `20 x 20`
- Dropzone copy stack gap: `4`

#### DOM Sibling Structure
- Parent stack: board owns four sibling sections in order:
  `composed images branch` -> `action row` -> `preview + media` ->
  `dropzone states`
- Child order:
  - composed images branch = `images header` sibling with `dropzone shell`
    sibling with nested `image links context block`
  - action row = three sibling buttons
  - preview row = `preview card` sibling with `media preview`
  - dropzone row = `default` sibling with `active` sibling with `reject`
- Sibling groups:
  - the nested `image links` block inside the composed branch stays a context
    sibling under the branch shell, not a promoted DS primitive on its own
  - preview filename/meta copy stays separate from icon-action cluster
  - media preview stays a sibling of preview card, not nested under it
  - each dropzone state stays a sibling card, not one shared card with nested
    state rows
- Gap owner:
  - composed branch wrapper owns `16`, with the nested content stack owning `12`
  - section wrapper owns `12`
  - row wrappers own `8|24|16` depending on section
  - internal preview/dropzone copy stacks own `4`
- Notes on nodes that must stay separate: do not merge upload-state copy or
  route-owned file metadata into the bounded shells; the board owns posture,
  not workflow state. The nested `Image links` editor remains context-only
  until a bounded editor contract exists.

#### Typography
- Section labels: `14/20`, semibold caption scale
- Action labels: `14/20`, semibold caption scale
- Preview filename: `14/20`, semibold
- Preview meta: `14/20`, regular
- Dropzone title: `14/20`, semibold
- Dropzone helper: `12/16`, regular

#### Variant Rules
- Composed images branch:
  - promote the outer `Images` shell, dropzone posture, and nested empty-state
    context from the creator-resource route
  - keep the nested `Image links` editor as context only; do not treat it as a
    promoted shared control yet
- Action row:
  - `Upload image` = neutral outline
  - `Choose from gallery` = muted outline
  - `Remove image` = dashed danger outline
- Preview shell:
  - preview card stays compact and horizontal
  - media preview stays neutral, centered, and empty-placeholder friendly
- Dropzone:
  - `default` = neutral dashed border
  - `active` = `primary/base` border + inset fill
  - `reject` = `state/danger-stroke` dashed border

#### Runtime Notes
- Parent-owned: upload progress, selected-file metadata, async workflow copy,
  disabled/loading behavior outside the bounded shells
- Route-owned: real file names, image/media assets, admin form orchestration
- Known token gaps:
  - runtime still uses stronger border aliases in some picker states
  - runtime still uses local danger/red emphasis in some picker states
  - canonical Figma currently stays on `border/default`, `primary/base`, and
    `state/danger-*`

#### Proof
- Figma screenshot:
  - `PickerControls / Foundations / Light` `1498:194`
  - `PickerControls / Foundations / Dark` `1498:257`
- Runtime proof: `PickerControls` Storybook stories and admin resource/settings
  consumers

### FileUploadWidget

- Scope: bounded buyer-file upload shell only, not upload progress,
  validation, upload-result states, or selected-file metadata
- Canonical nodes:
  - light board `1558:270`
  - dark board `1558:295`
- Runtime owner: `src/design-system/components/FileUploadWidget.tsx`
- Variants in scope: one bounded `upload branch` shell

#### Shell
- Branch width: `642`
- Branch height: `208`
- Dropzone shell: `642 x 152`
- CTA row: `642 x 40`
- Branch gap: `16`

#### Child Geometry
- Upload icon: `20 x 20`
- Primary helper copy: `14/20`
- Secondary helper lines: `11/20`
- CTA icon: `16 x 16`
- CTA label: `14/20`

#### DOM Sibling Structure
- Parent stack: one vertical branch only
- Child order: `dropzone shell` -> `disabled CTA`
- Sibling groups:
  - helper-copy lines remain separate inside the dropzone shell
  - CTA stays a sibling below the shell, not nested into the shell copy stack
- Gap owner:
  - branch owns the `16` gap between dropzone and CTA
- Notes on nodes that must stay separate: keep upload-state results,
  validation messages, and selected-file summary rows outside this bounded
  shell contract

#### Typography
- Primary helper copy: `14/20`, medium
- Secondary helper copy: `11/20`, regular
- CTA label: `14/20`, regular

#### Variant Rules
- current canonical scope proves only the idle buyer-file upload branch with
  disabled CTA posture

#### Runtime Notes
- Parent-owned: upload progress, success/error messaging, selected-file summary
- Route-owned: admin workflow hooks and delivery-branch orchestration
- Known token gaps: none on the current Figma shell; canonical board stays
  narrow specifically to avoid smuggling broader workflow state into the
  product export

#### Proof
- Figma screenshot:
  - `FileUploadWidget / Foundations / Light` `1558:270`
  - `FileUploadWidget / Foundations / Dark` `1558:295`
- Runtime proof: bounded `FileUploadWidget` usage plus uploader route harnesses

### SectionHeader

- Scope: bounded intro shell only, not page-width shell or route-specific CTA
  semantics
- Canonical nodes:
  - light board `1214:68`
  - dark board `1214:93`
  - light source `1214:141`
  - dark source `1276:1353`
- Runtime owner: `src/design-system/components/SectionHeader.tsx`
- Variants in scope: `default | centered | with-actions | minimal`

#### Shell
- Width: parent-owned
- Height: content-owned
- Root mobile gap: `12`
- Copy stack gap: `8`
- Desktop posture: row split with trailing actions lane

#### Child Geometry
- Eyebrow/title/description live in one vertical stack
- Description max width: runtime `max-w-xl`
- Actions lane: shared `Button size=md` examples in Figma proof only

#### DOM Sibling Structure
- Parent stack:
  - mobile/default uses one vertical root stack
  - desktop `with-actions` uses a row split between `copy stack` and
    `actions lane`
- Child order: inside `copy stack`, `eyebrow` comes before `title`, and
  `title` comes before `description`
- Sibling groups:
  - `eyebrow`, `title`, and `description` stay as siblings in one copy stack
  - `actions lane` is a sibling of `copy stack`, not a child of `title` or
    `description`
- Gap owner:
  - root owns shell-level gap between copy and actions
  - copy stack owns `8`
  - actions lane owns button-to-button spacing, not the copy stack
- Notes on nodes that must stay separate: do not collapse `description` into
  the heading node or nest the action cluster under the title block, or the
  Figma split between copy rhythm and trailing controls will drift

#### Typography
- Eyebrow: `12/16` badge scale
- Title: shared `h2` scale (`32/40`)
- Description: `14/20`
- Action examples: shared button typography, not SectionHeader-owned type scale

#### Variant Rules
- `centered`: centered alignment only, not a new type scale
- `with-actions`: proves trailing action cluster only
- `minimal`: narrows copy stack without inventing a new shell family

#### Runtime Notes
- Parent-owned: surrounding page width, backdrop, section spacing
- Route-owned: real CTA labels and button semantics
- Known token gaps: none called out for the current shell proof

#### Proof
- Figma screenshot: `SectionHeader / Variant / Source` dark set `1276:1353`
- Runtime proof: Storybook `SectionHeader` stories or any bounded DS consumer

### EmptyState

- Scope: bounded empty shell only, not route-owned illustrations or business
  CTA semantics
- Canonical nodes:
  - light board `1192:68`
  - dark board `1192:121`
  - light source `1192:196`
  - dark source `1276:302`
- Runtime owner: `src/design-system/components/EmptyState.tsx`
- Variants in scope: `default | minimal | compact-admin`

#### Shell
- Width: parent-owned
- Min height: `200`
- Radius: `16`
- Border: `2`, dashed
- Alignment: centered column

#### Child Geometry
- Icon slot above title
- Title above description
- Action below description
- Runtime spacing today:
  - icon -> title `12`
  - title -> description `4`
  - description -> action `16`
- `compact-admin`:
  - shell `650 x 82`
  - shell padding `21 / 17 / 1 / 17`
  - row `616 x 40`
  - icon wrapper `40 x 40`
  - icon `20 x 20`
  - copy stack width `389`

#### DOM Sibling Structure
- Parent stack: one centered vertical shell stack
- Child order: `icon` -> `title` -> `description` -> `action`
- Sibling groups:
  - `title` and `description` should stay as siblings, not one nested text
    block
  - `action` stays a sibling below copy, not inside the description wrapper
- Gap owner:
  - outer shell owns the full vertical rhythm in `default`
  - `minimal` keeps the same order but removes optional nodes instead of
    inventing a second wrapper hierarchy
  - `compact-admin` swaps to a tighter horizontal row:
    `icon wrapper` sibling with `copy stack`
- Notes on nodes that must stay separate: do not merge the copy nodes into one
  rich-text block if the design expects the `title -> description` gap to stay
  independently tunable

#### Typography
- Title: `16/24`, semibold
- Description: `14/20`
- Action example: shared `Button size=sm`
- `compact-admin` title: `14/20`, medium
- `compact-admin` description: `12/16`, regular

#### Variant Rules
- `default`: full stack `icon -> title -> description -> action`
- `minimal`: proves collapse without inventing new product chrome
- `compact-admin`: proves the tighter inline empty posture from the creator
  `Image links` branch without carrying the route-owned editor CTA row or bulk
  paste workflow into the shared contract

#### Runtime Notes
- Parent-owned: final illustration choice and business CTA semantics
- Route-owned: real action label, product copy, workflow-specific icon choice
- Known token gaps: Figma still binds dashed rail to `border/default` because
  canonical file lacks semantic `border/subtle`

#### Proof
- Figma screenshot: `EmptyState / Variant / Source` dark set `1276:302`
- Runtime proof: Storybook `EmptyState` stories or bounded DS consumer

### Surface

- Scope: bounded shared shell only, not route-owned content composition
- Canonical nodes:
  - light source set `575:144`
  - dark source set `627:633`
  - light hierarchy card `575:157`
  - dark hierarchy card `627:646`
- Runtime owner: `src/design-system/components/Surface.tsx`
- Variants in scope: `panel | subtle | muted`

#### Shell
- Width: parent-owned
- Height: content-owned
- Padding: parent-owned
- Gap: parent-owned
- Radius: `16` across the source variants and the current inner hierarchy-demo
  shells
- Border: `1`
- Background:
  - `panel` `bg/surface`
  - `subtle` `bg/canvas`
  - `muted` `bg/inset`

#### Child Geometry
- No owned child geometry; `Surface` is a shell wrapper only

#### DOM Sibling Structure
- Parent stack: none owned by `Surface`; layout stays with the caller
- Child order: route-owned
- Sibling groups: route-owned
- Gap owner: route-owned
- Notes on nodes that must stay separate: do not let `Surface` absorb child
  spacing or section rhythm that belongs to composed shells such as
  `FormSection` or `DataPanelTable`

#### Typography
- Title: parent-owned
- Description: parent-owned
- Action: parent-owned
- Eyebrow/label: parent-owned

#### Variant Rules
- `panel`: default shared content shell
- `subtle`: calmer supporting shell that steps back to the canvas layer
- `muted`: quieter inset/support shell

#### Runtime Notes
- Parent-owned: all interior spacing, headings, actions, and dividers
- Route-owned: content hierarchy and business affordances
- Known token gaps:
  - hierarchy study copy in Figma still mentions older token-gap guidance more
    broadly than the live nodes now prove

#### Proof
- Figma screenshot:
  - `Surface / Variant / Source` dark set `627:633`
  - `Surface / Foundations / Dark` hierarchy card `627:646`
- Runtime proof: any bounded DS consumer using the shared shell

### FormSection

- Scope: composed form shell only, not field-row layout or workflow-specific
  CTA semantics
- Canonical nodes:
  - light board `759:156`
  - dark board `759:184`
  - light source `759:251`
  - dark source `746:275`
- Runtime owner: `src/design-system/components/FormSection.tsx`
- Variants in scope: `flat | card`

#### Shell
- Width: parent-owned
- Height: content-owned
- Padding:
  - `flat` none on outer shell
  - `card` source set now binds top/side shell spacing to nearest shared
    `space/24` tokens
- Gap:
  - `flat` root stack now binds to `space/24`
  - `flat` header stack now binds to `space/8`
  - `card` inherited from shared `Card` + `CardHeader`
- Radius:
  - `flat` none
  - `card` inherited from shared `Card`
- Border:
  - `flat` bottom divider only
  - `card` inherited from shared `Card`
- Background:
  - `flat` transparent
  - `card` inherited from shared `Card`

#### Child Geometry
- Header contains `title` and optional `description`
- Content stays in its own sibling block below header
- Footer stays in its own sibling block below content when present

#### DOM Sibling Structure
- Parent stack: one vertical root stack per variant
- Child order: `header` -> `content` -> optional `footer`
- Sibling groups:
  - `title` and `description` are siblings inside `header`
  - `content` is a sibling of `header`, not nested under `description`
  - `footer` is a sibling of both `header` and `content`
- Gap owner:
  - root section owns shell-level spacing between header/content/footer
  - header owns `title -> description`
- Notes on nodes that must stay separate: do not collapse `children` into the
  same wrapper as the header copy or footer actions, or the flat/card section
  rhythm will drift from Figma

#### Typography
- Title: live Figma now binds to shared `type/label` (`14/20`, semibold)
- Description: `14/20`
- Action: footer-owned, route-owned
- Eyebrow/label: none owned by `FormSection`; field labels in the usage shells
  now also bind to shared `type/label`

#### Variant Rules
- `flat`: divider-led section with transparent shell
- `card`: delegates shell posture to shared `Card`

#### Runtime Notes
- Parent-owned: actual field grid, submit controls, validation layout
- Route-owned: footer action semantics and any helper rows inside `children`
- Known token gaps: the canonical file no longer keeps local text/spacing/radius
  debt on the live boards. The remaining gap is parity and semantics instead:
  Figma now normalizes former local values to nearest shared tokens
  (`type/label`, `space/8`, `space/24`), while runtime still carries narrower
  literal geometry in places, and divider/footer separators still wait on a
  dedicated `border/subtle` semantic instead of the broader `border/default`
  token used on the board

#### Proof
- Figma screenshot: `FormSection / Variant / Source` dark board `746:275`
- Figma usage proofs: `FormSection / Foundations` light/dark boards now also
  show `flat / no-description` and `card / no-footer` examples as usage-only
  posture, not as extra variants, and their footer actions now use real shared
  `Button` instances instead of local action frames
- Runtime proof: bounded settings/admin forms using the shared component

### DataPanelTable

- Scope: bounded dashboard/admin table shell only, not row schema, empty-copy
  ownership, or business actions
- Canonical nodes:
  - light board `813:174`
  - dark board `813:227`
  - light source `813:545`
  - dark source `1276:78`
- Runtime owner: `src/design-system/components/DataPanelTable.tsx`
- Variants in scope:
  - `actions=false, toolbar=false, footer=false`
  - `actions=true, toolbar=false, footer=false`
  - `actions=true, toolbar=true, footer=false`
  - `actions=true, toolbar=false, footer=true`

#### Shell
- Width: parent-owned
- Height: content-owned
- Padding:
  - header `20 x 20`
  - body `0`
  - footer inherited from shared `CardFooter`
- Gap:
  - card root `0`
  - header column `16`
  - top row `12`
  - actions lane `12`
- Radius: inherited from shared `Card`
- Border: inherited from shared `Card`; header adds bottom divider
- Background: inherited from shared `Card`

#### Child Geometry
- Header owns intro copy, optional actions, and optional toolbar
- Body is a dedicated sibling block below header
- Footer is a dedicated sibling block below body when present

#### DOM Sibling Structure
- Parent stack: shared `Card` root with three vertical siblings
- Child order: `header` -> `body` -> optional `footer`
- Sibling groups:
  - inside `header`, `top row` and optional `toolbar` are siblings
  - inside `top row`, `copy block` and optional `actions lane` are siblings
  - inside `copy block`, `title` and `description` stay separate
- Gap owner:
  - `Card` root owns zero gap so header/body/footer seams stay tight
  - header column owns `top row -> toolbar`
  - top row owns `copy block -> actions lane`
- Notes on nodes that must stay separate: do not merge `description` into
  `title`, and do not place `toolbar` inside the same wrapper as the title copy
  or the Figma header rhythm and divider posture will drift

#### Typography
- Title: shared `CardTitle`
- Description: `14/20`
- Action: shared button or row-action family, route-owned semantics
- Eyebrow/label: none owned by `DataPanelTable`

#### Variant Rules
- `actions` toggles the trailing actions lane only
- `toolbar` inserts a divided sibling row below header copy
- `footer` inserts a dedicated footer sibling below body

#### Runtime Notes
- Parent-owned: actual table rows, schema, badges, pagination labels, and empty
  copy
- Route-owned: business action labels and row rendering
- Known token gaps: canonical Figma still keeps explicit local type recipes and
  lacks semantic `border/subtle` for some shell rails

#### Proof
- Figma screenshot: `DataPanelTable / Variant / Source` dark set `1276:78`
- Runtime proof: bounded admin/dashboard table surfaces using the shared shell

### Button

- Scope: shared button primitive only, not route-owned CTA semantics or table
  business-action labels
- Canonical nodes:
  - state sets `746:510`, `1276:960`
  - size sets `553:167`, `1276:1021`
  - icon sets `259:92`, `1276:1058`
- Runtime owner: `src/design-system/primitives/Button.tsx`
- Variants in scope: `primary | quiet | soft | tertiary`, shared size ladder,
  icon posture, focus posture

#### Shell
- Width: content-owned except icon sizes
- Height:
  - `xs` `32`
  - `sm` `36`
  - `md` `40`
  - `lg` `48`
- Padding: variant- and size-owned
- Gap: icon/text `8`
- Radius:
  - default button family `pill`
  - compact/recipe-specific row-action posture handled outside primitive
- Border:
  - default transparent
  - `quiet` uses `border/quiet`
  - `soft` uses `primary-soft-border`
  - `tertiary` keeps no rest border; focus alone uses `focus/ring`
- Background: family-owned by variant

#### Child Geometry
- Label and optional icons live in one inline row
- Shared icon size target: `16`
- Loading spinner replaces left icon slot

#### DOM Sibling Structure
- Parent stack: one inline-flex row
- Child order: optional `loading/left icon` -> `label` -> optional `right icon`
- Sibling groups: icons stay siblings of label, not nested inside text wrapper
- Gap owner: button root owns icon/text spacing
- Notes on nodes that must stay separate: do not collapse left/right icons into
  pseudo-elements when the design expects real icon slots and loading swaps

#### Typography
- Title: none
- Description: none
- Action: shared button label `text-sm` / `text-caption` depending on size
- Eyebrow/label: label stays semibold

#### Variant Rules
- `quiet`: filled tonal shell with `border/quiet` and `focus/ring` at `2px`
- `soft`: bordered rounded-rect calmer CTA family with lighter rest state
- `tertiary`: text-first neutral posture; no fill or rest border, no underline
  on hover, tone shift only (`fg/muted` -> `fg/default` -> `fg/subtle` when
  disabled); icon variants use the same neutral token for both label and
  glyph fill/stroke
- `row action` and `pagination` remain recipe/family contracts outside base
  `Button`

#### Runtime Notes
- Parent-owned: surrounding layout, CTA grouping, route labels
- Route-owned: business semantics and icon choice
- Known token gaps: runtime now mirrors the canonical `tertiary` posture and
  `sm=36` ladder; keep `ghost` only as a thin compatibility alias until legacy
  downstream callers disappear

#### Proof
- Figma screenshot: `Button / Foundations / Dark` `294:29`
- Runtime proof: Storybook button stories and shared consumers

### Badge

- Scope: non-interactive status/label primitive only
- Canonical nodes:
  - light source `736:178`
  - dark source `1494:1803`
- Runtime owner: `src/design-system/primitives/Badge.tsx`
- Variants in scope:
  `neutral | info | success | warning | featured | destructive | outline`

#### Shell
- Width: content-owned
- Height: content-owned
- Padding: `8 x 2` equivalent compact pill
- Gap: icon/text `4`
- Radius: full pill
- Border: variant-owned, often transparent or soft semantic stroke
- Background: variant-owned

#### Child Geometry
- Optional icon `12`
- Label sits centered in one inline row

#### DOM Sibling Structure
- Parent stack: one inline-flex row
- Child order: optional icon -> label
- Sibling groups: icon and label are direct siblings
- Gap owner: badge root owns icon/text gap
- Notes on nodes that must stay separate: do not turn badge copy into a nested
  wrapper that changes the compact pill height

#### Typography
- Action/label: `text-badge` (`12/16`)

#### Variant Rules
- `warning` stays on inset-style shell, not generic yellow chip
- `featured` keeps editorial sand family:
  `accent/sand/wash` fill, `accent/sand/dust` stroke, `accent/sand/base` text
- `outline` remains transparent shell with stronger stroke

#### Runtime Notes
- Parent-owned: placement and surrounding density
- Route-owned: icon choice and copy
- `featured` should consume the canonical sand ladder directly in runtime:
  `bg-accent-50` fill, `border-accent-300` stroke, `text-accent-200` label
- `info`, `success`, `warning`, and `destructive` should consume dedicated
  theme-aware runtime vars that mirror the canonical Figma ladders:
  `support/info/*`, `support/success/*`, `support/warning/*`, and
  `state/danger/*`
- Known token gaps: none for current bounded primitive contract

#### Proof
- Figma screenshot: `Badge / Variant / Source / Dark` `1494:1803`
- Runtime proof: Storybook or any DS consumer using shared badges

### Input

- Scope: shared text-field shell only, not search-specific affordances
- Canonical nodes:
  - light state `432:218`
  - dark state `548:134`
  - light size `627:780`
  - dark size `627:804`
- Runtime owner: `src/design-system/primitives/Input.tsx`
- Variants in scope: state + size ladder with optional adornments

#### Shell
- Width: `100%`
- Height:
  - `sm` `32`
  - `md` `40`
  - `lg` `48`
  - `field` `56`
- Padding:
  - no adornment `12/16` horizontal depending on size
  - start/end adornment widths `36/40/44`
- Gap: wrapper `4` to hint/error copy
- Radius: `8`
- Border: shared field shell
- Background: shared field shell

#### Child Geometry
- Optional start adornment lane on left
- Input text field in center
- Optional end adornment lane on right
- Hint/error copy below shell

#### DOM Sibling Structure
- Parent stack: outer vertical stack `shell -> hint/error`
- Child order:
  - without adornments: `input` -> optional `hint/error`
  - with adornments: `relative shell` containing start/input/end -> optional
    `hint/error`
- Sibling groups:
  - hint and error are sibling outputs below shell, never inside it
  - adornments remain siblings of the input element inside the relative shell
- Gap owner:
  - outer wrapper owns shell-to-caption gap
  - relative shell owns no flex gap; absolute adornment lanes own placement
- Notes on nodes that must stay separate: do not nest hint/error copy inside
  the shell wrapper or the field-caption rhythm will drift from Figma

#### Typography
- Field text: `14/20`
- Hint/error: `12/16`

#### Variant Rules
- state matrix proves rest/hover/focus/disabled/error posture
- size matrix proves shell heights; captions remain outside the shell

#### Runtime Notes
- Parent-owned: labels and grid layout
- Route-owned: actual adornment icons and validation copy
- Known token gaps: Figma wrappers still carry explicit local component-set
  radius debt outside the live shell itself

#### Proof
- Figma screenshot: `Input / State` dark set `548:134`
- Runtime proof: bounded admin/settings form routes using shared field shell

### SearchInput

- Scope: shared search field primitive only, excluding product-owned hero shell
  semantics beyond the explicit `hero` variant
- Canonical nodes:
  - light state `432:276`
  - dark state `548:166`
  - light size `627:821`
  - dark size `627:842`
- Runtime owner: `src/design-system/primitives/SearchInput.tsx`
- Variants in scope: `default | hero`

#### Shell
- Width: `100%`
- Height:
  - `default` shared field ladder
  - `hero` route-owned `40`/responsive product posture
- Padding: search-specific left/right reserves for icon and clear/loading lane
- Gap: outer submit split `12` when submit button is present
- Radius:
  - `default` `8`
  - `hero` route-owned rounded hero shell
- Border: shared field shell for `default`
- Background: shared field shell for `default`

#### Child Geometry
- Leading search icon
- Input field
- Trailing clear/loading/end adornment lane
- Optional submit button as sibling outside field shell

#### DOM Sibling Structure
- Parent stack:
  - base case is one relative shell
  - submit case is one row with `input shell` and `submit button`
- Child order: search icon -> input -> trailing adornment within shell
- Sibling groups:
  - clear/loading indicator is a sibling of the input, not nested in text block
  - submit button is a sibling of the entire shell, not a child of it
- Gap owner:
  - relative shell owns icon/input overlay placement
  - outer row owns shell-to-submit gap
- Notes on nodes that must stay separate: do not merge clear/loading behavior
  into the same DOM slot as the submit button

#### Typography
- Field text: `14/20` default; hero remains product-owned
- Clear action: current runtime compact action label/icon lane

#### Variant Rules
- `default` stays on shared search field shell
- `hero` stays as explicit product override within the primitive

#### Runtime Notes
- Parent-owned: labels and surrounding toolbar/hero layout
- Route-owned: hero copy, submit button semantics, and marketplace chrome
- Known token gaps: public `/resources` hero search remains intentionally
  route-owned beyond the shared default shell

#### Proof
- Figma screenshot: `SearchInput / State` dark set `548:166`
- Runtime proof: `/dashboard/library`, admin search mounts, and `/resources`
  hero search as bounded override

### Select

- Scope: shared field-shell select only, not option-list or route-specific
  filtering UX
- Canonical nodes:
  - light board `994:342`
  - dark board `994:366`
  - light source `994:519`
  - dark source `994:543`
- Runtime owner: `src/design-system/primitives/Select.tsx`
- Variants in scope: state + size ladder

#### Shell
- Width: `100%`
- Height:
  - `sm` `32`
  - `md` `40`
  - `lg` `48`
  - `field` `56`
- Padding: field-shell horizontal padding plus caret reserve
- Gap: wrapper `4` to hint/error copy
- Radius: `8`
- Border: shared field shell
- Background: shared field shell

#### Child Geometry
- Native select shell
- Built-in caret affordance remains part of the field shell contract
- Hint/error copy below shell

#### DOM Sibling Structure
- Parent stack: outer vertical stack `select shell -> hint/error`
- Child order: `select` -> optional `hint/error`
- Sibling groups: captions stay outside the select shell
- Gap owner: outer wrapper owns shell-to-caption gap
- Notes on nodes that must stay separate: do not fold helper/error copy into
  the same wrapper as the select element

#### Typography
- Field text: `14/20`
- Hint/error: `12/16`

#### Variant Rules
- state matrix proves shell posture only
- size matrix follows shared field heights

#### Runtime Notes
- Parent-owned: option content and labels
- Route-owned: actual option list and business filtering behavior
- Known token gaps: none called out beyond broader shared field-shell token
  stories

#### Proof
- Figma screenshot: `Select / Foundations / Dark` `994:366`
- Runtime proof: `/admin/settings` and low-risk admin filter routes

### Textarea

- Scope: shared multiline field shell only
- Canonical nodes:
  - light board `1019:386`
  - dark board `1019:507`
- Runtime owner: `src/design-system/primitives/Textarea.tsx`
- Variants in scope: state matrix only

#### Shell
- Width: `100%`
- Min height: `120`
- Padding: `16`
- Gap: wrapper `4` to hint/error copy
- Radius: `8`
- Border: shared field shell
- Background: shared field shell

#### Child Geometry
- Multiline text shell
- Hint/error copy below shell

#### DOM Sibling Structure
- Parent stack: outer vertical stack `textarea -> hint/error`
- Child order: `textarea` -> optional `hint/error`
- Sibling groups: captions stay as siblings below shell
- Gap owner: outer wrapper owns shell-to-caption gap
- Notes on nodes that must stay separate: do not wrap footer copy inside the
  textarea shell

#### Typography
- Field text: `14/20`
- Hint/error: `12/16`

#### Variant Rules
- canonical Figma proves state posture, not a fabricated size ladder

#### Runtime Notes
- Parent-owned: labels, row counts, counters, long-form workflow chrome
- Route-owned: resize expectations and prompt-specific copy
- Known token gaps: none beyond shared field-shell stories

#### Proof
- Figma screenshot: `Textarea / Foundations / Dark` `1019:507`
- Runtime proof: bounded admin/settings and admin/resources multiline surfaces

### Card

- Scope: shared card primitive only, not nested product-specific card layouts
- Canonical nodes:
  - light board `439:303`
  - dark board `726:171`
- Runtime owner: `src/design-system/primitives/Card.tsx`
- Variants in scope: `size=default|sm`, header/content/footer shell posture

#### Shell
- Width: parent-owned
- Height: content-owned
- Gap:
  - `default` `16`
  - `sm` `12`
- Radius: `12`
- Border: `1` subtle shell
- Background: semantic surface shell

#### Child Geometry
- Header `px 20 pt 20` (`sm` `16/16`)
- Content `px 20` (`sm` `16`)
- Footer `px 20 py 12` (`sm` `16/10`)
- Optional action lane in header grid

#### DOM Sibling Structure
- Parent stack: one vertical root stack
- Child order: optional `header` -> optional `content` -> optional `footer`
- Sibling groups:
  - `title`, `description`, and optional `action` stay inside `header`
  - `footer` is a sibling of header/content, not nested under content
- Gap owner:
  - card root owns vertical section gap
  - header owns `title -> description`
  - footer owns its own internal row layout
- Notes on nodes that must stay separate: do not flatten footer into content or
  the inset footer rail from Figma will disappear

#### Typography
- Title: `16/20`, semibold (`sm` can step down to `14/20`)
- Description: `14/20`
- Action: parent-owned

#### Variant Rules
- `default`: full roomy card shell
- `sm`: tighter shell with reduced gaps and padding

#### Runtime Notes
- Parent-owned: actual child layouts and any nested semantic zones
- Route-owned: business actions and imagery behavior
- Known token gaps: current Figma still carries some local type/padding studies
  as explicit debt rather than fully semanticized tokens

#### Proof
- Figma screenshot: `Card / Size / Source / Dark` `726:171`
- Runtime proof: bounded DS card consumers

### Modal

- Scope: bounded modal shell only, not bell/list overlays or route-specific
  form content
- Canonical nodes:
  - light board `1146:246`
  - dark board `1154:246`
  - light size set `1146:352`
  - dark size set `1276:1255`
- Runtime owner: `src/design-system/primitives/Modal.tsx`
- Variants in scope: `size=sm|md|lg|xl`

#### Shell
- Width ladder:
  - `sm` `384`
  - `md` `448`
  - `lg` `512`
  - `xl` `576`
- Height: content-owned
- Radius: `16`
- Border: `1`
- Background: semantic card shell
- Header padding: `20 x 16`
- Body padding: `20 x 16`
- Footer padding: `20 x 12`

#### Child Geometry
- Overlay fills the viewport
- Content is centered shell
- Close affordance sits in top-right shell corner
- Header, body, and footer are separate rails

#### DOM Sibling Structure
- Parent stack: portal contains `overlay` and `content` as siblings
- Child order inside `content`: optional `header` -> `body` -> optional `footer`
- Sibling groups:
  - `title` and `description` are siblings inside `header`
  - `footer` is a sibling rail below `body`
  - close button is its own overlayed sibling inside `content`
- Gap owner:
  - content root owns shell rail order
  - header owns `title -> description`
  - footer owns action-to-action gap
- Notes on nodes that must stay separate: do not merge footer actions into body
  or collapse close affordance into header copy

#### Typography
- Title: `16/20`, semibold
- Description: `14/20`
- Action: shared button typography

#### Variant Rules
- size variants only change width ladder
- overlay tint, portal motion, and escape behavior stay runtime-owned

#### Runtime Notes
- Parent-owned: route content, validation, actual CTA semantics
- Route-owned: form layout and dialog workflow logic
- Known token gaps: canonical Figma still uses `neutral/line` for divider rails
  because `border/subtle` is not exposed there yet

#### Proof
- Figma screenshot: `Modal / Foundations / Dark` `1154:246`
- Runtime proof: bounded admin dialog consumers

### Avatar

- Scope: shared avatar shell and fallback ladder only
- Canonical nodes:
  - light board `1063:246`
  - dark board `1063:367`
  - light size/source `1063:317`, `1063:366`
  - dark size/source `1063:438`, `1063:487`
- Runtime owner: `src/design-system/primitives/Avatar.tsx`
- Variants in scope: image | initials fallback, size ladder `24|32|40|56`

#### Shell
- Width/height ladder:
  - `24`
  - `32`
  - `40`
  - `56`
- Radius: full circle
- Border/ring: stroked circular shell
- Background: fallback shell family-owned

#### Child Geometry
- Image fills the circular shell
- Fallback initials sit centered in same shell

#### DOM Sibling Structure
- Parent stack: single shell only
- Child order:
  - either image node
  - or fallback text node
- Sibling groups: none; image and fallback are mutually exclusive
- Gap owner: none
- Notes on nodes that must stay separate: keep fallback text as a direct child
  of shell so it inherits circular clipping and centered posture

#### Typography
- Fallback initials: size proportional to avatar size, semibold

#### Variant Rules
- source priority: image -> name initials -> email initials -> explicit initials
  -> anonymous default
- image and fallback share the same shell radius and stroke posture

#### Runtime Notes
- Parent-owned: surrounding layout and any presence badge
- Route-owned: actual image source and alt/copy context
- Known token gaps: runtime still supports extra mounts outside canonical Figma
  ladder and keeps fallback gradient/type sizing locally

#### Proof
- Figma screenshot: `Avatar / Foundations / Dark` `1063:367`
- Runtime proof: bounded DS or app consumers using shared avatar shell

### LoadingSkeleton

- Scope: neutral loading primitive only, not feature-specific skeleton layouts
- Canonical nodes:
  - light board `1170:246`
  - dark board `1170:272`
  - light shape set `1170:302`
  - dark shape set `1170:307`
- Runtime owner: `src/design-system/primitives/LoadingSkeleton.tsx`
- Variants in scope: `line | bar | circle | pill`

#### Shell
- Width: caller-owned
- Height: caller-owned
- Radius:
  - `line` subtle rounded
  - `bar` small rounded
  - `circle` full
  - `pill` full
- Background: neutral skeleton fill

#### Child Geometry
- No children; primitive is one painted shape

#### DOM Sibling Structure
- Parent stack: none owned
- Child order: none
- Sibling groups: none
- Gap owner: parent layout owns all spacing between skeleton rows/blocks
- Notes on nodes that must stay separate: do not turn this primitive into a
  full layout block; feature shells own structure

#### Typography
- none

#### Variant Rules
- primitive proves shape posture only, not composed layout groups

#### Runtime Notes
- Parent-owned: exact width/height and arrangement
- Route-owned: skeleton grouping for each feature
- Known token gaps: canonical Figma still aliases to broader neutral tokens
  because dedicated `bg/muted` semantic is not fully exposed there

#### Proof
- Figma screenshot: `LoadingSkeleton / Foundations / Dark` `1170:272`
- Runtime proof: bounded loading states that use the primitive

### Icon

- Scope: icon adapter contract only, not full glyph catalog
- Canonical nodes:
  - light board `1377:280`
  - dark board `1377:394`
- Runtime owner: `src/lib/icons.tsx`
- Variants in scope: size ladder `14|16|20|24`, semantic tone ladder, Phosphor
  light weight

#### Shell
- Width/height ladder:
  - `14`
  - `16`
  - `20`
  - `24`
- Radius: none owned by icon itself
- Border: none owned by icon itself
- Background: none owned by icon itself

#### Child Geometry
- Single SVG glyph only

#### DOM Sibling Structure
- Parent stack: none owned
- Child order: single SVG
- Sibling groups: none
- Gap owner: caller-owned
- Notes on nodes that must stay separate: icon-only controls or wrappers belong
  to other contracts, not to the icon adapter

#### Typography
- none

#### Variant Rules
- default family source: `Phosphor`
- default weight: `light`
- semantic tones:
  - `fg/default`
  - `fg/muted`
  - `fg/subtle`
  - `fg/on-fill-dark`
  - `fg/on-fill-light`

#### Runtime Notes
- Parent-owned: glyph choice, surrounding container, emphasis level
- Route-owned: status/product-specific icon choice
- Known token gaps: none for adapter contract; glyph catalog remains intentionally
  out of scope

#### Proof
- Figma screenshot: `Icon / Foundations / Dark` `1377:394`
- Runtime proof: adapter usage via shared DS and app consumers
