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
- Variants in scope: `default | minimal`

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
- Notes on nodes that must stay separate: do not merge the copy nodes into one
  rich-text block if the design expects the `title -> description` gap to stay
  independently tunable

#### Typography
- Title: `16/24`, semibold
- Description: `14/20`
- Action example: shared `Button size=sm`

#### Variant Rules
- `default`: full stack `icon -> title -> description -> action`
- `minimal`: proves collapse without inventing new product chrome

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
  - light board `575:144`
  - dark board `627:633`
  - light source `575:157`
  - dark source `627:646`
- Runtime owner: `src/design-system/components/Surface.tsx`
- Variants in scope: `panel | subtle | muted`

#### Shell
- Width: parent-owned
- Height: content-owned
- Padding: parent-owned
- Gap: parent-owned
- Radius:
  - `panel` `16`
  - `subtle` `12`
  - `muted` `12`
- Border: `1`
- Background:
  - `panel` semantic card shell
  - `subtle` semantic card shell
  - `muted` semantic muted shell

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
- `panel`: strongest bordered shell with shadow
- `subtle`: calmer bordered shell without shadow
- `muted`: quieter muted background shell without shadow

#### Runtime Notes
- Parent-owned: all interior spacing, headings, actions, and dividers
- Route-owned: content hierarchy and business affordances
- Known token gaps: hierarchy study copy in Figma still mentions older token-gap
  guidance more broadly than the live nodes now prove

#### Proof
- Figma screenshot: `Surface / Variant / Source` dark set `627:646`
- Runtime proof: any bounded DS consumer using the shared shell

### FormSection

- Scope: composed form shell only, not field-row layout or workflow-specific
  CTA semantics
- Canonical nodes:
  - light board `759:251`
  - dark board `746:275`
- Runtime owner: `src/design-system/components/FormSection.tsx`
- Variants in scope: `flat | card`

#### Shell
- Width: parent-owned
- Height: content-owned
- Padding:
  - `flat` none on outer shell
  - `card` inherited from shared `Card`
- Gap:
  - `flat` root stack `20`
  - `flat` header stack `6`
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
- Title: local `16/20`, semibold in current Figma/runtime
- Description: `14/20`
- Action: footer-owned, route-owned
- Eyebrow/label: none owned by `FormSection`

#### Variant Rules
- `flat`: divider-led section with transparent shell
- `card`: delegates shell posture to shared `Card`

#### Runtime Notes
- Parent-owned: actual field grid, submit controls, validation layout
- Route-owned: footer action semantics and any helper rows inside `children`
- Known token gaps: current canonical file still keeps explicit local gaps for
  `16/20` title, `14/20` labels, `20px` card padding, and `border/subtle`
  semantics

#### Proof
- Figma screenshot: `FormSection / Variant / Source` dark board `746:275`
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
