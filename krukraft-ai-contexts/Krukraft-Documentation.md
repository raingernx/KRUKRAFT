# Krukraft Marketplace — Comprehensive Documentation

This file is a stitched summary for agents that want one entry point, but the
modular docs in `krukraft-ai-contexts/` are the primary source of truth.

## Read These First

1. [README.md](README.md)
2. [03-tech-stack.md](03-tech-stack.md)
3. [04-architecture.md](04-architecture.md)
4. [05-features.md](05-features.md)
5. [08-performance-audit.md](08-performance-audit.md)
6. [09-todos.md](09-todos.md)

## Current Repo-Aligned Summary

- Krukraft is a Thai marketplace for downloadable educational resources at `krukraft.com`
- The repo is now on **Next.js 16 App Router**
- Core architecture remains:

```text
API Route → Service → Repository → Prisma
```

- `src/proxy.ts` is the active request interception entry
- Build is schema-mutation-free; Prisma migrations are a separate deploy step
- Public marketplace and detail pages now use multi-tier caching and more granular RSC streaming
- Public preview images use Next Image when the source is optimizer-compatible and bypass the optimizer only for non-optimizable cases
- Local verification now spans Playwright browser smoke, Storybook build smoke, Lighthouse CI, and bundle analysis
- Admin settings must use live DB-backed platform config; build-safe defaults are only for branding/build paths
- Current notable ops warning: production still uses an Xendit test key

## Why This File Is Short

An older version of this file mirrored conversation exports too literally and
drifted from the repo. The modular docs were refreshed to fix that. Keep this
file intentionally short so agents read the focused docs above instead of stale
historical prose.

---

*Refreshed against the repo state on 2026-04-02.*
