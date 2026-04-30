# Krukraft Theme Playbook v1

This file is the canonical theme-training artifact for the active
`Krukraft theme refresh plan`.

Use it to train, review, and approve Krukraft's theme direction before any new
runtime color slice is landed.

This document is intentionally about posture, vocabulary, and review rules. It
is not a token file and it is not permission to commit new palette values on
its own.

For the current `Figma foundation first` phase, pair this playbook with
[foundation-study-checklist.md](./foundation-study-checklist.md). The playbook
defines posture; the checklist defines the minimum study coverage required
before code implementation resumes.

## Purpose

Krukraft already has a stable DS baseline, reference-alignment baseline, visual
foundation baseline, and one completed `/resources` route pilot. This playbook
exists so the next theme decisions do not jump straight from inspiration into
hardcoded runtime values.

The goal is to train one shared understanding of:

- what Krukraft should feel like
- what it should not become
- how palette decisions should be discussed
- how feedback should be given
- what must be approved before implementation resumes

## Locked Theme Posture

Krukraft should move toward an `editorial-minimal` theme.

That means:

- simple and clean before decorative
- warm and human before playful
- trustworthy and composed before trendy
- premium through restraint, spacing, crop, and contrast rather than visual
  effects
- brand-aware without turning the app into a colorful campaign system

Short version:

> warm paper and ink, not loud poster UI

## Reference Reading

The current image references are useful because they show:

- strong, confident typography
- warm cream-like neutrals
- dark ink-like text and shells
- sparse but memorable accent color
- simple geometric or organic shapes used as support, not as a full system

They should not be copied literally.

Use them as guidance for:

- warmth
- contrast
- rhythm
- type confidence
- atmosphere

Do not use them as guidance for:

- final token values
- direct semantic color mapping
- route-by-route poster treatments
- loud marketing surfaces across the whole product

## Palette Posture

Palette work must be described in layers, not by jumping straight to final hex
values.

### Core Neutral Family

The base of Krukraft should read as:

- warm paper backgrounds
- soft off-white or cream surfaces
- espresso or ink-toned text/shell anchors
- quiet muted insets that still belong to the same family

The neutral family should feel:

- slightly warmer than generic SaaS neutrals
- clean enough for dashboards and admin work
- restrained enough that content stays primary

The neutral family should not feel:

- cold and bluish by default
- bright white and sterile
- sepia or vintage
- muddy, beige-heavy, or low-contrast

### Current Training Decision

- approved neutral direction: `Paper B`
- why it won:
  - cleaner and more restrained than `Paper A`
  - safer for product density than the warmer editorial option
  - quieter and less forceful than `Paper C`
- implication:
  - Krukraft should keep warmth, but in a controlled way
  - neutral surfaces should stay closer to clean paper than overtly creamy
  - the next open decision is accent posture, not another neutral-family vote

### Accent Posture

Accent colors should be `supportive and sparse`.

That means:

- accent exists to create brand memory and selective emphasis
- accent does not become the default background for product shells
- accent should appear more in brand moments, highlights, and support surfaces
  than in base card/chrome layers

Accent colors should not silently replace semantic roles.

Do not use brand accents as substitutes for:

- `primary`
- `destructive`
- `ring`
- success/warning/error semantics

### Current Training Decision

- approved neutral direction: `Paper B`
- approved primary accent: `#5144ED`
- approved support accents: `Rust #DB3A1C` and `Sand #E59C46`
- current posture:
  - keep the base neutral family restrained and paper-led
  - let `#5144ED` carry the main brand/action identity
  - let `Rust #DB3A1C` and `Sand #E59C46` stay support-only, not co-primary
- implication:
  - keep the app clean and restrained through `Paper B`
  - let the main brand accent stay cooler and more decisive than the warm
    support colors
  - the next step is expanding foundation studies in Figma, not reopening
    palette posture or touching runtime tokens yet
  - the canonical Figma file is now `Krukraft Theme Lab Source-of-Truth`, and
    its current `DS Foundations` page should be expanded deliberately instead of
    assuming the older broad `Theme Lab` study board still exists

### Semantic Roles Stay Authoritative

The existing semantic posture stays in force:

- `primary` is still the main action role
- `destructive` is still the risk role
- `ring` is still the focus role

Theme work can shift atmosphere around those roles, but should not weaken their
clarity.

## Surface And Material Rules

Shared surfaces should feel like one editorial-minimal family.

### What Surfaces Should Feel Like

- warm paper under content
- quiet card shells
- selective shell separation
- disciplined border hierarchy
- shadow used sparingly and intentionally

### What Surfaces Should Not Feel Like

- glassy
- glossy
- frosted
- gradient-heavy
- saturated by default
- split into different visual systems between marketplace and admin

### Surface Hierarchy

When judging surfaces, read them in this order:

1. page background
2. shared card shell
3. muted inset / supportive surface
4. popover / overlay shell
5. hero or promotional support surface

The first four should stay in one restrained family. Hero or campaign support
surfaces may carry more character, but they must stay isolated from default
product shells.

## Typography Posture

Typography should carry more of the brand than color does.

The desired posture is:

- confident
- clean
- editorial
- high-contrast
- readable under dense product usage

### Typography Rules

- hierarchy should come from size, weight, spacing, and placement
- keep one family feeling across marketplace, creator, dashboard, and admin
- public surfaces may be slightly more expressive, but not like a different
  product
- do not lean on tracking-heavy labels or novelty display moments across the
  product UI

### Typography Anti-Goals

- not corporate-generic
- not playful
- not fashion-editorial to the point of usability loss
- not marketing-only

## Component Posture

Theme changes should first be judged through shared UI families, not hero
sections.

### Controls

Buttons, inputs, dropdowns, and search controls should feel like:

- one family
- calm and precise
- slightly warmer and more editorial than the current baseline
- still obviously product-grade and reliable

### Cards And Chrome

Cards, popovers, sidebars, and shells should:

- feel quieter than promotional surfaces
- take warmth from background/surface tone before they take it from accent
- preserve operational clarity

### Route-Owned UI

Route-specific visuals should stay out of scope until:

- the palette posture is approved
- one narrow theme slice lands cleanly
- that slice is reviewed against the playbook

## Do / Don't

### Do

- use warmth through neutrals first
- let typography carry more character than color
- keep surfaces quiet
- use accent sparingly
- keep marketplace and operational surfaces in the same family
- describe theme decisions with posture words before token values

### Don't

- turn Krukraft into a colorful poster system
- use inspiration boards as permission to choose final runtime values
- encode semantic intent with decorative accent ramps
- push loud hero aesthetics into default cards, forms, and admin shells
- reopen route rollout before the palette posture is approved

## Feedback Vocabulary

Use direct phrases like these when reviewing future theme work:

### Positive Signals

- this has the right warmth
- this feels more editorial
- this is calm but not sterile
- this feels premium without being loud
- this stays clean under product density

### Negative Signals

- too colorful
- too loud
- too poster-like
- too SaaS
- too cold
- too beige
- not editorial enough
- too brand-heavy
- too decorative for product UI

## Approval Rules

Before any runtime theme values land:

1. the user trains or approves the palette posture in words
2. the next slice stays narrow
3. the slice is justified against this playbook
4. implementation is reviewed as a theme slice, not as an isolated code patch

### Hard Rule

Do not commit new runtime theme values, token ramps, or default surface colors
from references alone.

Direction first. Vocabulary second. Approved posture third. Values last.

## First Slice Criteria

A first theme slice is acceptable only if it:

- stays narrow
- proves the approved posture clearly
- does not require route-level redesign
- does not reopen completed DS boundary or taxonomy work

Good examples:

- shared surface + neutral posture calibration
- card/popover shell family calibration
- one control family review after palette posture is approved

Bad examples:

- full discover redesign
- dashboard-wide recolor
- token churn without explicit review language

## Review Loop

Use this loop for future theme work:

1. update the playbook if the direction changes materially
2. lock one narrow slice in `09-todos.md`
3. implement only that slice
4. review it against this playbook in plain language
5. decide explicitly whether to stop, refine, or open a new slice

## Visual Training Surface

Use the canonical Figma file `Krukraft Theme Lab Source-of-Truth` as the visual
training canvas, starting from the `DS Foundations` page:

- https://www.figma.com/design/koZEgVUfQhNEQmXISNQx56

The old `/dev/theme-playbook` route has been removed on purpose so theme
training stays isolated from the Krukraft app shell.

That page exists to:

- compare the current DS baseline against candidate theme posture
- review neutral warmth, ink strength, and accent behavior visually
- provide a blank component sandbox for structure, spacing, and radius studies
- keep palette exploration out of runtime tokens until the user approves the
  posture

Do not treat that page as a shipped theme implementation. It is a review
surface only.
