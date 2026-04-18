# Agent Plugin Workflows

This file defines the recommended plugin rollout and the rules for using those
plugins in Krukraft work once they are installed and authenticated in Codex.

Important:

- Marketplace installation and OAuth / API authentication for third-party Codex
  plugins still happen in the Codex UI.
- Repo-owned rules in this file, `AGENTS.md`, and `.codex/RULES.md` exist so
  the plugins get used intentionally after install instead of becoming dormant.
- If a plugin is not installed or is not authenticated in the current Codex
  session, the agent should say so explicitly and fall back to the next-best
  local or web workflow.
- Supabase is handled through a repo-owned DB workflow plus a live Supabase MCP
  connection. See `docs/supabase-db-workflow.md`.

## Install Order

1. `Sentry`
2. `CodeRabbit`
3. `Cloudflare`

Rationale:

- `Sentry` closes the biggest observability gap for a Next.js SaaS with auth,
  checkout, webhook, and protected download flows.
- `CodeRabbit` raises PR review quality immediately with low workflow cost.
- `Cloudflare` matches the repo's R2-based private-file roadmap and edge/WAF
  needs.

## One-Time Setup

### Sentry

Use for production/runtime evidence.

Minimum setup:

1. Install the Sentry plugin in Codex UI and authenticate it.
2. Create or connect the Krukraft Sentry org/project for Next.js.
3. Configure environments for at least `production`, `preview`, and `local` or
   `development`.
4. Add app-side env vars when Sentry instrumentation is enabled:
   `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_ENVIRONMENT`, and `SENTRY_RELEASE`.
5. Add `SENTRY_AUTH_TOKEN`, `SENTRY_ORG`, and `SENTRY_PROJECT` only when you
   want build-time source-map upload.
6. Create alerts for:
   - webhook failures
   - download/API 5xx spikes
   - auth/session failures
   - elevated frontend error rate on `/resources` and `/dashboard`

### CodeRabbit

Use for PR review and change-risk detection.

Minimum setup:

1. Install the CodeRabbit plugin in Codex UI and authenticate it.
2. Install the GitHub app for the Krukraft repo.
3. Start with review comments enabled but do not require it as a blocking
   merge check during the first adoption pass.
4. Focus review attention on:
   - `src/app/api/**`
   - `src/services/**`
   - `src/repositories/**`
   - `prisma/**`
   - `.github/workflows/**`

### Cloudflare

Use for R2/private file delivery, cache, edge, and WAF work.

Minimum setup:

1. Install the Cloudflare plugin in Codex UI and authenticate it.
2. Create or connect the Krukraft account and R2 bucket(s).
3. Create scoped R2 API tokens for the required buckets only.
4. Record and verify:
   - `R2_ENDPOINT`
   - `R2_BUCKET`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
5. Configure bucket CORS narrowly for the live app origins.
6. Use short-lived presigned URLs for private download access.

## Trigger Matrix

The agent should prefer these plugins when they are installed and authenticated.

### Use `Sentry` When

- a production bug or runtime incident is reported
- a deploy appears green but users still hit 500s, hydration errors, or client
  crashes
- Stripe checkout or webhook flows fail after deploy
- protected downloads fail intermittently in production
- smoke/browser checks pass but the user suspects hidden runtime errors
- the user asks for recent incidents, stack traces, or error evidence

Expected behavior:

- inspect the relevant Sentry issues, traces, and latest events first
- distinguish old noise from newly reproduced failures
- summarize concrete findings instead of reporting only that "monitoring looks
  fine"

### Use `CodeRabbit` When

- reviewing a PR or large diff for regressions and missing tests
- deciding whether a risky refactor is merge-ready
- triaging machine review feedback before or after human review
- looking for cross-file risks in routes, services, repositories, Prisma, or CI

Expected behavior:

- treat CodeRabbit as review augmentation, not as sole proof of correctness
- still run repo-owned verification and runtime checks proportional to change

### Use `Cloudflare` When

- touching R2 bucket configuration, presigned URLs, signed/private delivery, or
  bucket CORS
- debugging file download failures that involve object storage or edge delivery
- reviewing cache/WAF behavior on public asset or storage flows
- validating bucket/object state during storage migrations

Expected behavior:

- verify bucket, token, and delivery configuration from Cloudflare data instead
  of guessing from code alone
- treat presigned URLs as short-lived bearer credentials and avoid exposing
  secrets in output

### Use `Supabase MCP` When

- a DB/platform answer depends on live Supabase state rather than repo code
- checking project URL, migration state, table presence, recent logs, or
  advisors
- verifying whether a hosted environment matches the committed Prisma intent
- debugging staging drift, migration deploy problems, or runtime DB incidents

Expected behavior:

- keep Prisma as the schema-history authority
- use Supabase MCP as read-only operational evidence first
- avoid write-capable DB actions through MCP unless the user explicitly asks
  for them and the repo workflow supports that path

## Agent Rules

When one of these plugins is installed and authenticated:

1. Prefer plugin data over broad web search for operational state that the
   plugin can answer directly.
2. Cite the system inspected and the rough time context in the response.
3. If the plugin is unavailable in the current session, say so and use the
   next-best fallback.
4. Do not claim confidence from plugin status alone when the task still needs
   repo-owned runtime verification.
5. For Supabase, prefer MCP evidence over manual Dashboard asks when the
   connected tools can answer the question directly.

## Adoption Workflow

Recommended rollout:

1. Install `Sentry` and `CodeRabbit`.
2. Add or verify the related service-side setup in the app and GitHub.
3. Keep the rules in this file and `AGENTS.md` committed so agent behavior is
   stable across sessions.
4. Install `Cloudflare` once R2/private file work becomes active.
5. Keep Supabase under the repo-owned DB workflow, but use the authenticated
   Supabase MCP connection for live operational state.

## Source Notes

- Sentry Next.js configuration and environment options:
  [docs.sentry.io](https://docs.sentry.io/platforms/javascript/guides/nextjs/)
- CodeRabbit PR review workflow:
  [docs.coderabbit.ai](https://docs.coderabbit.ai/overview/pull-request-review)
- Cloudflare R2 S3 / presigned URL workflow:
  [developers.cloudflare.com](https://developers.cloudflare.com/r2/api/s3/presigned-urls/)
