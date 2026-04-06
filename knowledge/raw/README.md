# Raw Sources

`knowledge/raw/` is the evidence layer for the repo-owned LLM wiki.

Use it for:

- meeting notes
- incident notes
- decision memos
- research exports
- copied external references that should be versioned in-repo

Do not rewrite these files into polished truth in place. Summaries belong in `knowledge/wiki/`.

Current subdirectories:

- `repo-docs/`
- `product/`
- `architecture/`
- `design/`
- `operations/`
- `incidents/`
- `research/`
- `decisions/`

Operational helpers:

- `npm run wiki:ingest -- --bucket <bucket> --title "..." --source <path>` creates a raw note, appends `knowledge/log.md`, and can optionally seed a wiki page.
- `npm run wiki:index` rebuilds `knowledge/index.md` from the current wiki tree.
- `npm run wiki:stale` flags wiki pages whose `Last Reviewed` date is too old or whose `Sources` section has no links.
- `npm run wiki:coverage` prints which raw notes are already cited by wiki pages and which pages still lack canonical source backing.
- `npm run wiki:drift` checks whether canonical files changed without the related wiki pages being updated in the same diff.

Canonical repo documents such as `AGENTS.md`, `krukraft-ai-contexts/`, `design-system.md`, and `figma-component-map.md` remain outside `knowledge/raw/` and should be linked, not duplicated, unless a specific snapshot is required.
