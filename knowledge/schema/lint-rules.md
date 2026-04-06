# Lint Rules

Phase 1 lint is structural, not semantic.

It should check:

- required root files exist
- required schema files exist
- every page under `knowledge/wiki/` contains the standard section headings
- `knowledge/index.md` matches the current wiki tree

Phase 2 maintenance adds:

- `npm run wiki:stale` to flag wiki pages with old `Last Reviewed` dates
- `npm run wiki:stale` to flag `Sources` sections that have no markdown links

Phase 4 semantic lint adds:

- `npm run wiki:lint:semantic` to catch duplicate wiki titles
- `npm run wiki:lint:semantic` to flag wiki pages that cite only `knowledge/raw/` / `knowledge/wiki/` without canonical backing
- `npm run wiki:lint:semantic` to flag raw notes that no wiki page references
- `npm run wiki:coverage` to print raw-note coverage and canonical-source coverage summaries

Manual review still needs to check:

- stale summaries
- contradictory claims
- weak or missing citations
- pages that duplicate each other semantically
- wiki pages that drift from code or runtime behavior
