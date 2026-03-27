# UX Roadmap Done Checks

Phase 0 guardrails:

- Verify type safety with `npx tsc --noEmit`.
- Verify lint with `npm run lint`.
- If stale generated `.next` output pollutes lint, run `npm run clean` and rerun lint.
- Post-deploy perf smoke must use the warmed flow via `npm run perf:post-deploy`.
- CI perf must use the same warmed smoke flow via `npm run perf:ci`.
