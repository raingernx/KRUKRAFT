# Codex Thread Rollup

This file is a recovery rollup for Codex threads tied to this repository.

It does not merge native Codex threads in the app UI. Instead, it gives one shared reference point with the active workspace aliases and the main discussion history that was previously split across multiple threads.

## Workspace aliases

Current canonical repo path:

- `/Users/shanerinen/Projects/krukraft`

Compatibility aliases created for older threads:

- `/Users/shanerinen/Projects/studyplatform` -> `/Users/shanerinen/Projects/krukraft`
- `/Users/shanerinen/Projects/krucraft` -> `/Users/shanerinen/Projects/krukraft`

Use these aliases only for thread recovery and path compatibility. The canonical project name in the filesystem remains `krukraft`.

## Rolled-up thread context

### 2026-04-03

- Context recovery work for old Codex threads that failed with `Current working directory missing`.
- Verified that the broken thread history still existed in Codex state and the rollout file was intact.
- Root cause: older thread metadata still referenced the legacy workspace name `studyplatform`.
- Recovery action: restored the missing workspace path using a symlink to the live repo.
- Follow-up action: added the `krucraft` alias as another compatibility path.

Primary threads:

- `019d522e-137b-7312-b040-e4a8b6ba3eac` — context recovery request
- `019d5132-f54d-74d3-a600-1fbc1b9d7017` — Pencil discussion / legacy-path thread
- `019d51fc-f65a-7071-8ab4-da0b50f9735a` — follow-up on how to restore context
- `019d4ec5-468b-7cf0-bf33-433dd73346a7` — Pencil access check

### 2026-04-02

- Runtime verification and cleanup around performance warnings and smoke coverage.
- Topics included:
  - Next dev warning about above-the-fold images and `loading="eager"`
  - Storybook warning for missing `package.json` lookup under Radix while build still passed
  - browser smoke coverage for canonical search results / no-results paths

Primary thread:

- `019d4b8a-0bd3-7b52-bfdf-5095bd8ed521`

### 2026-04-01

- Audit discussion about where ISR is safe versus unsafe in admin and dashboard surfaces.
- Main conclusion recorded in the thread:
  - dashboard user-specific pages should stay request-bound
  - some admin analytics pages were candidates for ISR
  - loading states needed a parity pass where layout shells were missing
- Several duplicate review threads existed under the old `studyplatform` cwd.

Primary threads:

- `019d482a-1f1d-7af0-8f00-ce68581b4b8f`
- `019d47ed-6e6b-7e02-a497-e3d99782dfd1`
- `019d47ed-6e0c-7901-8e2f-c4d44f36e420`
- `019d47c9-1541-7792-b521-36bb326288f4`
- `019d47c9-14ec-7030-8d06-c2991518920b`
- `019d47b8-efe7-7472-b338-aa5d30e21a5c`
- `019d47b8-ef9f-7dd2-89fa-eaa8a9f8cbf7`

### 2026-03-30

- Figma / Tokens Studio export workstream.
- Goal in that thread: export existing design-system tokens from the repo into JSON sets compatible with Tokens Studio for Figma.

Primary thread:

- `019d3858-6c57-71e0-9b42-47aba3bd195a`

### 2026-03-29

- Resource detail gallery consistency work:
  - ensure thumbnail rail still renders when only one preview image exists
  - keep rail behavior consistent across breakpoints
  - keep loading geometry aligned with loaded state
- Additional prompt-writing / UI direction discussion happened the same day.

Primary threads:

- `019d3551-c5d9-7053-9163-d7acf78b8291`
- `019d39b8-9f9a-7ef2-b1c5-a63d621d1b74`

### 2026-03-24

- Search UI bug audit:
  - diagnose placeholder/icon overlap in mounted search inputs
  - keep fix minimal and layout-only
- Observability / performance measurement planning:
  - identify cache-miss proxies
  - define cold-versus-warm TTFB checks
  - detect wasteful prefetch behavior
- General repository structure analysis.

Primary threads:

- `019d1fcb-4036-7593-8d96-99db8b8cc710`
- `019d1dcd-cc88-7961-bc8d-ea5865fa6c8a`
- `019d1cce-754c-7b81-834e-5c924345e494`

### 2026-03-18

- Early architecture planning thread for introducing `services`, `repositories`, and `features` incrementally without breaking App Router routes, auth, or middleware.

Primary thread:

- `019cef79-5071-7e63-a970-8bc524f29cd4`

## Practical use

When an older Codex thread appears missing or disconnected:

1. Treat `/Users/shanerinen/Projects/krukraft` as the real repo path.
2. Treat `studyplatform` and `krucraft` as compatibility aliases only.
3. Use this file as the high-level thread rollup instead of assuming native thread merge happened.
4. If a specific old thread is needed, search by thread ID or title in Codex state.

## Limitation

Codex thread histories are still separate records in the app database. This rollup is the safe consolidation layer; it is not a low-level mutation of the thread store.
