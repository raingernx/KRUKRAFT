---
name: krukraft-figma-qa
description: Audit and finish Figma work for Krukraft with strict layout QA. Use when writing or reviewing Figma screens, components, Theme Lab studies, or design-system frames where auto layout, Hug/Fill/Fixed sizing, centering, clipping, crop, and final verification must be checked before closing.
user-invocable: true
argument-hint: "[figma surface or section]"
---

# Krukraft Figma QA

Use this skill for any Krukraft Figma write or Figma review where craft errors are expensive:

- missing or wrong auto layout
- wrong `Hug` / `Fill` / `Fixed`
- off-center children
- accidental clipping or crop
- frames not resizing with content
- image fit/fill mistakes
- partial or unfinished section output

This skill is a QA guardrail. It complements general Figma workflow skills; it does not replace them.

## Mandatory Pairing

When the task writes to Figma:

1. load `$figma-use` before any write
2. if building a screen, also use `$figma-generate-design`
3. if building tokens/components/library structure, also use `$figma-generate-library`
4. run this skill before calling the work finished

## Scope

Apply this skill to:

- `Krukraft Design System` file work
- `Theme Lab` studies
- DS component pages
- screen/layout studies
- any Figma frame that will be reviewed by humans or used as implementation input

## Non-Negotiable Rules

### 1. Auto Layout First

- default to auto layout for frames that group UI
- do not leave stacks of manually positioned children when a row/column layout is intended
- only keep absolute positioning for intentional overlays, decorative artwork, or anchored exceptions

### 2. Size Every Node Intentionally

For every important frame and child, decide explicitly:

- `Hug` when the node should size to its content
- `Fill` when the node should stretch with the parent layout
- `Fixed` only when the size is intentionally locked

Do not leave mixed sizing by accident. If a section feels unstable, the first check is sizing mode drift.

### 3. Alignment Must Be Explicit

Check both axes:

- parent alignment
- child self-alignment
- center vs start vs end intent

Do not assume "looks centered enough". Verify the actual layout settings.

### 4. No Accidental Crop Or Clipping

Before closing any frame:

- inspect whether text is clipped
- inspect whether child content overflows hidden bounds
- inspect whether images are unintentionally cropped
- inspect whether nested frames have fixed heights that cut content

If a frame is cropped on purpose, treat that as an explicit design choice and verify the crop is clean.

### 5. Image Fills Need A Real Check

For imagery and artwork:

- confirm whether the node should use fill, fit, crop, or contain behavior
- check that the focal point is intentional
- check that the image is not stretched
- check that masks and corner radius treatments still read correctly after resize

### 6. Frames Must Resize With Real Content

- a frame that should expand with content must not stay fixed by accident
- after text overrides, variant swaps, or content changes, re-check parent height and width behavior
- watch for zero-height or near-zero-height rows after auto layout edits

### 7. Complete The Section

Do not stop after placing the primary objects. Check:

- section shell
- internal spacing and padding
- sibling consistency
- edge alignment with nearby sections
- whether all intended children exist

“Good enough” is not complete if the frame is still structurally unfinished.

## QA Pass Order

Run this order every time:

1. verify parent frame structure
2. verify auto layout direction, gap, and padding
3. verify each child sizing mode (`Hug` / `Fill` / `Fixed`)
4. verify cross-axis alignment and centering
5. verify clipping, crop, overflow, and masks
6. verify text after real content overrides
7. verify section screenshot or visual output
8. fix anything off before closing

## Review Checklist

Use this exact checklist in your head or in notes:

- is auto layout present where it should be?
- is each important node using the right sizing mode?
- is anything off-center or misaligned?
- is any frame clipping content?
- are any images cropped or stretched by accident?
- do parent frames resize with content correctly?
- are gaps and padding consistent?
- is the section complete, not partially assembled?

If any answer is no, the work is not done.

## Required Close-Out

Before reporting success on Figma work, state:

- what frame/page/section was checked
- whether auto layout was verified
- whether sizing modes were verified
- whether clipping/crop/overflow were checked
- whether visual verification was done after the last edit
- any intentional exceptions that were kept on purpose

## Never Do

- never close Figma work without a QA pass
- never leave child sizing implicit on complex frames
- never trust a visual glance when metadata/layout settings can be checked directly
- never treat cropped text, cut-off rows, or off-center objects as minor polish
- never say a screen is complete if the frame is still structurally unstable
