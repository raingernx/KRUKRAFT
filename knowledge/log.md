# Knowledge Log

## 2026-04-06

- Added repo-owned `wiki:index`, `wiki:stale`, and `wiki:ingest` commands plus a shared helper module for knowledge-tree discovery.
- Strengthened `wiki:lint` so it now checks that `knowledge/index.md` matches the actual wiki tree instead of only checking for manual links.
- Added an operations wiki page for the knowledge layer and documented the workflow in `AGENTS.md` and `krukraft-ai-contexts/`.
- Seeded the initial `knowledge/` structure with `raw/`, `schema/`, and `wiki/`.
- Added repo-specific schema docs for ingest, query, source priority, and lint.
- Added initial core wiki pages for auth, payments, search, storage/downloads, core routes, CI browser smoke, browser verification, skeleton policy, and purchase-to-library flow.
- Added `npm run wiki:lint` and a repo-owned structural checker for the knowledge layer.
