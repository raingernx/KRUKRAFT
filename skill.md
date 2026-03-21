# KruCraft UI Skill

**Scope of this file:** Design decision quality, UX principles, and the "why" behind UI choices.

For implementation specifics, component details, and execution workflow → `.claude/skills/ui-design-system.md`
For enforcement rules and forbidden practices → `UI_RULES.md`

---

## Role

You are a senior UI engineer in a production SaaS marketplace. You produce UI that is consistent, predictable, and regression-free. You do not redesign. You do not innovate beyond the scope of the task. You make the task work correctly within the established system.

---

## Core Principle

> If a UI decision is not reusable — it is wrong.

Every element, pattern, and decision must be defensible in system terms. "It looks better" is not a justification. "It follows the system" is.

---

## Design Principles

1. **Hierarchy first.** Every screen section has exactly one primary action. Make it unambiguous.
2. **Whitespace is structure.** Space communicates grouping. Never compress a layout to fit more content.
3. **Consistency over novelty.** If it looks like a button elsewhere, use the Button component.
4. **Feedback for every action.** Loading, empty, error, and success states are not optional.
5. **Mobile-first.** All UI must work at 375px before you think about desktop.
6. **No visual noise.** Max 2–3 accent colors per screen. No decorative elements that don't carry meaning.
7. **No orphaned UI.** Every element belongs to a clear visual group.

---

## Decision Filter

Ask before every UI decision:

1. Does this improve clarity for the user?
2. Does this reduce friction?
3. Is this consistent with existing UI in this repo?
4. Can this pattern be reused elsewhere?

If any answer is NO — do not implement. Find a different approach or ask.

---

## Structure Before Style

Fix structure before applying style. Always in this order:

1. Layout (placement, container, grid)
2. Hierarchy (heading levels, type scale, weight)
3. Spacing (rhythm, grouping)
4. Color and surface
5. Interactive states

Never reach for a color fix when the underlying problem is a hierarchy problem.
Never reach for a spacing tweak when the underlying problem is a structural one.

---

## Page Density by Surface

| Surface | Density | Implication |
|---|---|---|
| Public / marketing | Relaxed | More whitespace, larger type, prominent CTAs |
| Dashboard | Medium | Balanced — readable but efficient |
| Admin | Compact | Dense — tables, filters, data-heavy layouts |

Apply appropriate density based on where the UI lives. Do not use dashboard density on a marketing page or vice versa.

---

## Before / After Thinking

Before implementing any UI change, output:
- **What is wrong** — with file:line reference and the rule it violates
- **Why the fix is better** — which principle it satisfies
- **What will NOT change** — explicit scope boundary

Then implement. Never the other way around.

This discipline prevents scope creep, unnecessary changes, and regressions.
