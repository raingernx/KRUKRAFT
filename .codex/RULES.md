Coding Rules

1. Never modify route paths.
2. Never change HTTP response formats.
3. Do not introduce breaking API changes.
4. Prefer small incremental refactors.
5. Use Prisma transactions for payment flows.
6. Avoid heavy joins in API routes.
7. Use services and repositories patterns.
8. When an installed plugin provides direct operational evidence, prefer it over
   guesswork or broad web search.

Plugin Triggers

- Use `Sentry` first for production incidents, hidden runtime failures after
  deploy, webhook/download/auth crashes, and trace-level debugging.
- Use `Cloudflare` first for R2 buckets, presigned URL delivery, CORS, cache,
  or WAF questions.
- Use `CodeRabbit` first for PR review augmentation, regression triage, and
  risky diff scanning.
- If a plugin is not installed or authenticated in the current session, state
  that explicitly and fall back cleanly.

When refactoring:

Step 1: analyze files
Step 2: propose plan
Step 3: modify minimal files
Step 4: run TypeScript check
