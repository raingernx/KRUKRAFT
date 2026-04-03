# UI_RULES.md — Krukraft Design System Enforcement

This file defines **strict UI implementation rules** for the Krukraft codebase.

This is NOT a guideline. It is a **constraint system** that must be followed by all engineers and AI tools.

For component implementation specifics → `.claude/skills/ui-design-system.md`
For design thinking and decision quality → `skill.md`

---

## Source of Truth Priority

When guidance sources conflict, follow this resolution order — **highest priority first**:

```
1. .claude/skills/ui-design-system.md   ← implementation specifics + repo-aware truth
2. Actual component code in the repo    ← runtime behavior always wins
3. UI_RULES.md (this file)              ← enforcement constraints
4. skill.md                             ← design principles
```

**Hard rules:**
- Never override a higher-priority source with a lower-priority one.
- If docs conflict with actual component code, **follow the code**. Update the docs to match — do not update the code to match outdated docs.
- If `ui-design-system.md` says the primary button is `brand-600` and `UI_RULES.md` says it is `violet`, the component code is the tiebreaker.

---

## System Architecture

The UI stack has a strict hierarchy. Never skip a level.

```
skill.md               → design decision quality (WHY)
  ↓
UI_RULES.md            → enforcement constraints (WHAT IS FORBIDDEN)
  ↓
ui-design-system.md    → repo-aware implementation truth (HOW)
  ↓
design-system primitives + shadcn/ui → component layer (PRIMARY)
  ↓
Tailwind CSS → layout, spacing, minor adjustments (SECONDARY)
```

Tailwind is **not** the design system. It is a utility layer that supports it.

---

## Global Rules — Mandatory

1. Always use existing components first. Never reach for a raw element when a primitive exists.
2. Never style raw HTML elements when a design-system component exists for the purpose.
3. Never introduce new colors, spacing values, or patterns without justification against the system.
4. Keep UI minimal and functional. Visual noise is a bug, not a style choice.
5. Every interactive UI surface must handle all four states: **loading, empty, error, success**.

---

## Design Token Rules

### Colors

Use semantic tokens. See `ui-design-system.md` for the full token reference.

**Allowed intents:**
- Primary / CTA: `brand-*` palette
- Premium / owned: `accent-*` (violet) palette
- Neutral / surface: `zinc-*` and `surface-*` scales
- Success: `success-*` / `emerald-*`
- Warning: `warning-*` / `amber-*`
- Danger: `danger-*` / `red-*` (only via component variant — never raw in feature code)
- Info: `brand-50` / `brand-100` surfaces

**FORBIDDEN:**
- `text-gray-*` or `bg-gray-*` — use `zinc` or `surface` tokens
- `text-slate-*` — not in this system
- Raw hex in className: `text-[#6b6b6b]`
- Inline style colors: `style={{ color: '#333' }}`
- More than 3 distinct accent colors visible on the same screen section

### Typography

Use the defined scale: `text-h1`, `text-h2`, `text-h3`, `text-base`, `text-meta`, `text-micro`

**FORBIDDEN:**
- Arbitrary font sizes: `text-[17px]`, `text-[11.5px]`
- Competing `font-bold` elements at the same hierarchy level

### Spacing

Use Tailwind 4px base scale.

**FORBIDDEN:**
- Arbitrary spacing: `mt-[13px]`, `p-[11px]`, `gap-[7px]`
- Mixing spacing systems within a single layout block

---

## Component Usage Rules

### Button

- One `primary` variant per visual section — never two.
- Destructive actions use `danger` or `destructive` — never `primary`.
- Async actions always include `loading` prop.
- Never use raw `<button>` or `<a>` for interactive actions in feature components.

### Card

- Use `Card` + sub-components for all panels, stat blocks, and content containers.
- Never replicate the Card structure manually with raw divs.

### Badge

- Use for status, category labels, and ownership indicators only.
- Not for decoration.

### Form elements (Input, Textarea, Select, Switch)

- Always use design-system primitives.
- Never use raw `<input>`, `<textarea>`, `<select>`.

### ResourceCard

- This is the **only** resource card component. Never fork, duplicate, or replicate its markup.
- To add a layout variation: add a `variant` prop. Do not create an alternative component.

### PurchaseCard

- One CTA per ownership state. Never add competing actions.
- Do not add new CTAs without explicit product approval.

---

## State Handling — Required

Every list, grid, and table must handle all four states:

| State | Requirement |
|---|---|
| Loading | Skeleton component or loading spinner — never blank white |
| Empty | Icon + message + optional CTA — never silent empty |
| Error | Visible error message — never silent failure |
| Success | Inline confirmation or toast — never silent |

---

## Interaction Requirements

Every interactive element must expose:
- Hover state
- Active / pressed state
- Focus-visible ring
- Disabled state

Hover must not cause layout shift. Animations on interactive elements: 200–300ms max.

---

## Tailwind Usage Rules

Tailwind is used for: **layout, spacing, and minor adjustments only.**

**FORBIDDEN with Tailwind:**
- Full component styling using utilities without a design-system component
- Bypassing design-system primitives with raw utility classes
- Arbitrary values not in the 4px scale
- `!important` modifiers: `!text-red-500`

---

## Reuse Rules

1. Always reuse before creating.
2. Extend via props or variants before creating an alternative.
3. Never create one-off UI wrappers unless they will be used in more than one place.
4. If a pattern appears once, inline it. If it appears twice, extract it.

---

## Forbidden Practices — No Exceptions

- `style={{}}` props for anything achievable with Tailwind
- Raw hex values in className: `#xxxxxx`
- `text-gray-*` or `bg-gray-*`
- Arbitrary spacing or font sizes
- New icon libraries — only `lucide-react`
- Creating a new card, button, or input component when existing ones cover the use case
- Copying ResourceCard's internal markup into another component
- Adding CTAs to PurchaseCard without explicit product approval
- Overdesigned UI: decorative gradients, heavy shadows, dribbble-style layering
- `!important` in Tailwind classes
- Editing files outside the declared task scope
- Changing business logic, data fetching, or API calls as part of a UI task

---

## AI Enforcement Rules

Before writing any UI code, AI must:

1. Search the repo for an existing component that covers the use case.
2. Verify whether the component can be reused as-is.
3. Verify whether it can be extended via props or variants.
4. Only create a new component if steps 1–3 are exhausted — and must justify why.

AI must not assume a component does not exist. It must verify by searching.

See `.claude/skills/ui-design-system.md` for the mandatory execution workflow.
