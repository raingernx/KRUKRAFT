# Krukraft Foundation Study Checklist

This file is the canonical checklist for the `Figma foundation first` phase of
the `Krukraft theme refresh plan`.

Use it to decide whether the current canonical Figma foundation work is broad
enough to justify any runtime theme implementation.

This is a study checklist, not a token file.

## Locked Palette Baseline

Use these as the fixed inputs for the current study round:

- neutral: `Paper B`-derived cool-paper light set
  - `shell #FAF8F8`
  - `surface #F5F2F3`
  - `canvas #FFFFFF`
  - `inset #EEE9E8`
  - `line #E5E2E4`
- primary: `#5144ED`
- support accents: `Rust #DB3A1C` and `Sand #E59C46`

Do not reopen these choices while the goal is still building foundation
evidence.

## Hard Rule

Do not change runtime theme values or component code until the checklist below
is complete enough to review as one coherent system.

## Required Study Areas

The first code slice should stay blocked until these five areas exist in Figma.

Current Figma coverage status:

- [x] Card studies exist in the canonical file
- [x] Button states exist in `DS Foundations`
- [x] Input and search state + size coverage exist in `DS Foundations`
- [x] Dropdown / popover shell studies exist in the canonical file
- [x] Section / surface hierarchy board exists in the canonical file

The canonical file was reset to a narrower foundation-first scope. Expand it
again before treating the study pass as complete enough for a broader runtime
theme slice.

### 1. Card Studies

Create at least three card directions that test:

- shell contrast
- border hierarchy
- radius posture
- internal spacing rhythm
- title / meta / support text hierarchy

Approval questions:

- Which shell feels most like `editorial-minimal`?
- Which one starts to feel too SaaS or too soft?
- Which radius feels right for the whole system?

### 2. Button States

Create one shared button family that covers:

- primary
- secondary or quiet
- ghost or low-emphasis
- hover / pressed / focus-visible
- disabled

Approval questions:

- Does the primary feel confident without being loud?
- Do quiet buttons still feel related to the same family?
- Is the contrast/focus treatment strong enough without using extra decoration?

### 3. Input And Search States

Create one shared control family that covers:

- default input
- focused input
- invalid input
- search input
- optional leading/trailing affordance state
- the comfortable field-size ladder (`sm`, `md`, `lg`, `field`) used by code

Approval questions:

- Do input and search read as one family?
- Is the field chrome quiet enough against `Paper B`?
- Does focus feel clear without feeling neon or generic?
- Does the component-set size ladder stay aligned with the runtime field contract?

### 4. Dropdown / Popover Shell

Create one menu / popover shell study that covers:

- closed trigger context
- opened popover shell
- list items
- selected / active row
- destructive or warning row

Approval questions:

- Does the overlay shell belong to the same surface family as cards?
- Are row states legible without becoming colorful noise?
- Does the shell feel product-grade rather than default-library styling?

### 5. Section / Surface Hierarchy

Create one composition board that shows:

- page background
- card shell
- muted inset
- popover shell
- one support surface that can carry `Rust` or `Sand`

Current canonical status:

- `Surface / Foundations / Light` and `Surface / Foundations / Dark` now exist in `DS Foundations`
- both boards include a `Surface / Variant / Source` block plus a dedicated hierarchy card
- remaining gaps are explicit token gaps, not silent local styling: `border/subtle`, `bg-muted`, `radius/12`, and `space/20`

Approval questions:

- Is the hierarchy obvious without stacking too many boxes?
- Do the first four levels stay in one restrained family?
- Do `Rust` and `Sand` stay supportive instead of becoming page chrome?

## Optional But Useful

These are not blockers, but they help reduce ambiguity:

- typography comparison board
- radius comparison board
- density comparison board
- icon or illustration support study

## Exit Criteria Before Code

The foundation round is ready for code only when:

- all five required study areas exist in Figma
- the studies read like one system, not isolated experiments
- the palette roles are visible in use, not just as swatches
- the chosen direction can be described in plain language
- one narrow code slice can be named without guessing

## Allowed Next Step After This Checklist

Only after the checklist is satisfied should the plan move to:

- `choose one narrow code implementation slice`

Good next slices:

- shared surface + neutral posture calibration
- card / popover shell family calibration
- one control family review

Bad next slices:

- route redesign
- dashboard-wide recolor
- broad token churn
