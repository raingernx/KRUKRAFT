# Figma Numeric Contracts

This file defines the repo-owned numeric-contract workflow for non-trivial
Figma-to-code implementation work.

Use it when a component, shell, or variant needs high-fidelity translation from
the canonical Figma file into runtime code.

## Workflow

1. Lock one canonical node or variant.
2. Pull structured Figma metadata/JSON for that exact node before editing code.
3. Write a numeric contract from that metadata.
4. Map the contract into code.
5. Verify that token-sensitive utilities resolve to the intended computed CSS
   values in runtime instead of trusting similar class names.
6. Verify with runtime screenshot QA against the same node or variant.
7. Only then sync handoff docs/context if the implementation truth changed.

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

#### Typography
- Title: `18/30`, semibold
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
