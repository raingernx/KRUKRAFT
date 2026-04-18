# Supabase Incident Playbook

This file is the short incident-response companion to
`docs/supabase-db-workflow.md`.

Use it when Krukraft hits a database/platform problem involving Supabase and
Codex has a live Supabase MCP connection available.

## Core Rule

Debug in this order:

1. identify the environment
2. identify whether the issue is connection, migration, drift, or query/runtime
3. verify repo truth first
4. use Supabase MCP for live platform evidence
5. ask for Supabase Dashboard inspection only when MCP is unavailable or the
   needed state is not exposed there

## 1. Migration Fail

Symptoms:

- `npm run db:deploy` fails
- Prisma reports migration drift or cannot apply a migration remotely
- app deploy is green but schema-dependent routes fail afterward

Debug order:

1. confirm target environment: `staging` or `production`
2. inspect committed Prisma migrations in `prisma/migrations`
3. confirm `DATABASE_URL` and `DIRECT_URL` point at the intended environment
4. verify whether the failure is local-only or remote-only
5. if remote state is unclear, use Supabase MCP to inspect migrations, tables,
   or logs first
6. if MCP still does not answer the platform-state question, ask the user to
   check Supabase Dashboard for:
   - whether the target project is the right one
   - whether the latest migration/schema change already appears applied
   - whether any manual dashboard SQL was run outside Prisma

Likely causes:

- wrong target environment
- `DIRECT_URL` points to the wrong database
- remote schema changed outside Prisma history
- migration history exists in git but was not applied remotely

## 2. Wrong Connection String

Symptoms:

- app connects to the wrong environment
- Prisma CLI behaves differently from the app runtime
- staging/prod data appears swapped

Debug order:

1. identify whether the failing path is app runtime or Prisma CLI
2. inspect env files and deployment env config
3. confirm `DATABASE_URL` and `DIRECT_URL` are not accidentally swapped
4. confirm the environment name being debugged
5. if still unclear, use Supabase MCP to confirm project identity and recent
   logs first
6. if MCP still cannot confirm connection details, ask the user to inspect
   Supabase Dashboard project settings for:
   - the direct connection target
   - the pooler connection target
   - the project/ref name of the intended environment

Likely causes:

- staging secrets deployed to production or vice versa
- direct and pooler URLs mixed up
- app runtime and migration runtime targeting different projects

## 3. Pooler / Direct Mismatch

Symptoms:

- app works but Prisma migrate fails
- Prisma Studio or CLI cannot reach the database
- some commands succeed only through one connection path

Debug order:

1. confirm which command is failing: app runtime, Studio, migrate, or seed
2. confirm `DATABASE_URL` is used for app runtime traffic
3. confirm `DIRECT_URL` is used for Prisma CLI / migration workflows
4. inspect repo scripts that may intentionally override connection behavior
5. if live settings are needed, use Supabase MCP evidence first where possible
6. if direct vs pooler details are still missing, ask the user to inspect
   Supabase Dashboard for the exact connection details

Likely causes:

- Prisma CLI pointed at the pooler path when a direct path is needed
- app runtime accidentally using the direct path
- copied connection strings from the wrong Supabase page

## 4. Staging Drift

Symptoms:

- staging behaves differently from local or production
- a migration seems applied in one environment but not another
- runtime errors mention missing columns/tables only in staging

Debug order:

1. confirm the exact failing route/API and environment
2. compare repo migration history with the expected schema change
3. confirm staging deploy included the intended migration set
4. verify whether the issue reproduces locally on a clean DB path
5. if remote state is still uncertain, use Supabase MCP to inspect schema shape
   and logs first
6. if MCP still leaves uncertainty, ask the user to inspect Supabase Dashboard
   for:
   - current staging project identity
   - whether the expected tables/columns exist
   - whether manual schema edits were made

Likely causes:

- staging missed a migration deploy
- staging was edited manually
- staging is attached to the wrong Supabase project

## 5. Runtime Query Failure

Symptoms:

- app routes throw DB errors in staging or production
- query works locally but fails remotely
- Prisma/client errors mention missing relation, table, extension, or policy

Debug order:

1. isolate the exact failing route/service/repository call
2. inspect repo schema and committed migrations
3. confirm whether the error implies schema mismatch, missing data, or platform
   configuration
4. if the answer depends on live DB/platform state, use Supabase MCP first
5. if MCP still cannot answer it, ask the user to inspect Supabase Dashboard
   for the smallest needed evidence:
   - table/column existence
   - RLS state
   - extension state
   - relevant row/data presence

Likely causes:

- remote schema drift
- missing seeded/reference data
- remote platform config not matching local assumptions

## Codex Ask Shortcuts

When live Supabase state is needed, keep the ask minimal.

Examples:

- "Check the `staging` Supabase project and confirm whether the latest Prisma
  migration is applied."
- "Open Supabase connection settings for `production` and confirm whether the
  value we should use for `DIRECT_URL` is the direct connection string."
- "Check whether the expected column exists in the staging project and whether
  staging is attached to the intended Supabase project."

## Escalation Rule

If the issue can be explained by repo code, Prisma config, committed migrations,
or local reproduction, do that first.

Use Supabase MCP before asking for manual Dashboard inspection.

Only escalate to Supabase Dashboard inspection when live project/platform state
is still the missing evidence after repo truth and MCP evidence have been
checked.
