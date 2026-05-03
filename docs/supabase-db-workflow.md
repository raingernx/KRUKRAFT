# Supabase DB Workflow

This file defines the recommended Krukraft database workflow when the team uses
Supabase as the hosted Postgres platform and Codex has a live Supabase MCP
connection available.

Current connector note:

- the Supabase MCP connection is now verified against the live Krukraft hosted
  project and can read project metadata, tables, and recent logs successfully
- on the current connected project, `list_migrations` may return an empty set
  even when the remote schema is clearly populated, so do not treat that MCP
  migration list alone as authoritative proof that the hosted database has no
  applied schema history
- when migration-state questions are ambiguous, cross-check committed Prisma
  migrations plus live table shape/log evidence before concluding that remote
  drift exists

Incident response companion:

- `docs/supabase-incident-playbook.md`

## Short Answer

Yes, Krukraft should keep a Supabase workflow even when Codex has a live
Supabase MCP connection.

Reason:

- Supabase is the operational database platform.
- Prisma is still the repo's schema-history authority.
- Codex needs explicit guidance so it uses Supabase MCP for live operational
  evidence without mixing Supabase-managed changes with Prisma-managed
  migrations.

## System Roles

### Supabase Owns

- hosted Postgres environments
- connection strings and platform settings
- optional branch/project management on the Supabase side
- live project inspection through Supabase MCP first, then Dashboard or CLI when
  needed

### Prisma Owns

- schema definition in `prisma/schema.prisma`
- committed migration history under `prisma/migrations`
- repo-local schema workflows: `db:push`, `db:migrate`, `db:deploy`

### Repo Scripts Own

- local development database bootstrap via `npm run db:local:*`
- Prisma Studio convenience commands
- verification and deployment commands tied to the app workflow

## Canonical Rule

For Krukraft, do not run two migration authorities in parallel.

That means:

- do not treat Supabase SQL migrations as the canonical history while Prisma is
  already the repo authority
- do not make dashboard-only schema changes and leave them undocumented in
  Prisma
- if a remote change happens outside Prisma, capture and reconcile it back into
  the repo before treating the schema as stable

## Preferred Workflow

### Local Iteration

Use the repo's local Postgres path first.

1. Start the clean local database when needed with `npm run db:local:start`
2. Point local env at the repo-approved local DB
3. Iterate with `npm run db:push` while the schema is still changing
4. Verify affected code paths and UI/loading states
5. Once the schema is stable, record it with `npm run db:migrate`

Why:

- this repo already has a local DB path and Prisma-first rules
- it avoids coupling every small experiment to a hosted Supabase environment

### Staging / Remote Non-Prod

Use Supabase as the hosted environment target, but keep Prisma as the change
authority.

1. Keep app runtime traffic on `DATABASE_URL`
2. Keep Prisma CLI / migration workflows on `DIRECT_URL`
3. Use Supabase MCP first for live state checks such as project URL, tables,
   migrations, logs, and advisors
4. Apply already-committed migrations with `npm run db:deploy`
5. Seed or verify data through repo-owned scripts where appropriate

### Production

Use Supabase as the production Postgres host, but do not invent an alternate
schema workflow.

1. Merge reviewed Prisma migrations into the repo
2. Use Supabase MCP for read-only operational evidence when live state matters
3. Apply them to the target Supabase environment with `npm run db:deploy`
4. Verify app/runtime behavior after deploy

## Operational Checklist

Use this as the short operational checklist for Krukraft.

### Environment Contract

#### Local

- use the repo-owned clean local Postgres path for most schema iteration
- keep local app runtime on local `DATABASE_URL`
- keep local Prisma CLI on local `DIRECT_URL` when needed
- prefer `npm run db:local:start` before local schema work

#### Staging

- treat staging as the first hosted environment that should match production
  shape closely
- set staging app runtime to the staging Supabase `DATABASE_URL`
- set staging Prisma CLI / migration access through staging `DIRECT_URL`
- apply only committed Prisma migrations with `npm run db:deploy`
- do not use staging dashboard edits as untracked schema shortcuts

#### Production

- keep production app runtime on production `DATABASE_URL`
- keep production Prisma CLI / migration access on production `DIRECT_URL`
- apply only reviewed, committed Prisma migrations
- verify runtime behavior after deploy instead of treating a successful
  migration command as sufficient proof

### Branch / Environment Policy

Keep the environment policy simple:

1. `local` is the default schema experimentation surface
2. `staging` is the hosted validation surface
3. `production` is the deploy target

If Supabase branching is adopted later:

- branch for validation or preview environments only
- do not let branches become a second migration authority
- merge schema intent back through Prisma migrations before treating it as
  canonical

### Change Checklist

For schema changes:

1. edit `prisma/schema.prisma`
2. iterate locally with `npm run db:push` if the schema is still fluid
3. update route, service, repository, and UI/loading states
4. once stable, record the change with `npm run db:migrate`
5. verify `typecheck`, `lint`, and the affected runtime flow
6. deploy committed history to hosted environments with `npm run db:deploy`

For connection or environment changes:

1. confirm which environment is being changed: `local`, `staging`, or
   `production`
2. confirm both `DATABASE_URL` and `DIRECT_URL` targets
3. avoid swapping pooler/direct URLs blindly
4. verify Prisma CLI still reaches the intended direct connection path

## RLS Timing Note

Current Krukraft recommendation:

- treat broad Supabase RLS remediation as `pre-launch hardening`, not as a
  blocker for the current product-build phase
- keep it visible as launch-readiness work, not as background trivia
- if the app later starts using Supabase REST, Realtime, or browser/client SDK
  surfaces directly, raise the priority of RLS work immediately

Why:

- the current app primarily uses Prisma plus server-owned routes instead of
  Supabase client-side data access
- that makes the current Supabase RLS findings important hardening work, but
  not the highest-priority build-phase task while the product is still being
  assembled

## When Codex Should Use Supabase MCP First

When the answer depends on live Supabase state, use Supabase MCP before asking
the user to open Supabase Dashboard.

Use Supabase MCP first for:

- confirming the project URL or project identity
- listing tables and checking whether expected schema objects exist
- checking migration history, while remembering that the current connected
  project may not expose useful migration rows through MCP even when the schema
  is live
- reading recent platform logs
- checking security or performance advisors
- generating current TypeScript types from the connected project

## When Codex Should Still Ask You To Inspect Supabase Dashboard

Ask for Dashboard inspection when the missing evidence is not available through
the current MCP connection or when the question depends on a UI-only platform
surface.

Ask for Dashboard inspection when:

- confirming which Supabase project is currently linked to `staging` or
  `production`
- confirming direct vs pooler connection details
- checking branch/environment existence or branch protection state
- inspecting live table rows, RLS, extensions, or platform settings
- verifying remote query behavior that cannot be inferred from repo code alone
- the MCP session is unavailable or returns insufficient evidence for the needed
  platform state

Codex should not ask for Dashboard inspection when:

- the question can be answered from `prisma/schema.prisma`, committed
  migrations, env wiring, repo scripts, or Supabase MCP
- the issue is clearly a local Prisma workflow problem
- the task is documentation, planning, or code-only refactoring

## Codex Ask Template

When live Supabase state is required, keep the ask short and concrete.

Preferred pattern:

- ask which environment to inspect
- ask for the exact page or setting to confirm
- ask for the smallest evidence needed, such as a connection mode, branch name,
  migration status, or screenshot/text summary

Example asks:

- "Check Supabase Dashboard for the `staging` project and confirm whether the
  latest Prisma migration appears as applied."
- "Open the production Supabase project settings and confirm the direct
  connection string target versus the pooler target."
- "Check whether the staging branch/project exists and whether it matches the
  environment this deploy is using."

## When To Use Supabase Dashboard Or CLI

Use Supabase surfaces for platform operations, not as a substitute for Prisma
history.

Good uses:

- checking live state through Supabase MCP first
- checking project settings, branches, and credentials
- inspecting remote tables or query behavior
- confirming pooler/direct connection details
- creating or managing hosted environments

Avoid as default schema workflow:

- creating production schema changes only in the dashboard
- using Supabase MCP write-capable tools such as raw SQL or migration apply as
  a shortcut around Prisma history unless the user explicitly requests that path
  and the repo workflow is updated accordingly
- relying on Supabase migration files as a second source of truth
- bypassing repo migration history for convenience

## Codex Agent Behavior

Because Supabase MCP is connected for this workflow:

1. Use repo code, env wiring, Prisma config, and repo docs first for schema
   intent and committed history.
2. Use Supabase MCP for live operational evidence before falling back to manual
   Dashboard inspection.
3. Treat Supabase MCP as read-only by default even if write-capable tools are
   exposed in the client.
4. Do not use `apply_migration` or ad-hoc write operations to bypass the
   Prisma-first workflow unless the user explicitly requests it and the risk is
   acknowledged.
5. Use official Supabase docs as the external reference when needed.

## Current Krukraft Defaults

- local database experimentation should stay on the repo-owned local Postgres
  path unless the user explicitly wants hosted Supabase verification
- `DATABASE_URL` is the app runtime connection
- `DIRECT_URL` is still required for Prisma CLI / migration workflows
- the current local database caveat still applies:
  the main local DB is not the safe default for blind `db:deploy`, so prefer
  the clean local DB path or narrow SQL fixes when needed

## Optional Later Expansion

If the team later adopts Supabase branching or GitHub integration, keep the
same rule:

- Supabase may own environment orchestration
- Prisma still owns committed schema history unless the repo explicitly migrates
  away from Prisma-first DB management

## Source Notes

- Supabase local development and migration workflow:
  [supabase.com/docs/guides/cli/local-development](https://supabase.com/docs/guides/cli/local-development)
- Supabase branching:
  [supabase.com/docs/guides/deployment/branching](https://supabase.com/docs/guides/deployment/branching)
- Supabase CLI overview:
  [supabase.com/docs/guides/cli/getting-started](https://supabase.com/docs/guides/cli/getting-started)
