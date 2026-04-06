import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

export const repoRoot = process.cwd();
export const knowledgeRoot = path.join(repoRoot, "knowledge");

export const requiredRootFiles = [
  "knowledge/index.md",
  "knowledge/log.md",
  "knowledge/glossary.md",
  "knowledge/open-questions.md",
  "knowledge/raw/README.md",
];

export const requiredSchemaFiles = [
  "knowledge/schema/wiki-rules.md",
  "knowledge/schema/source-priority.md",
  "knowledge/schema/ingest-rules.md",
  "knowledge/schema/query-rules.md",
  "knowledge/schema/lint-rules.md",
  "knowledge/schema/page-template.md",
];

export const requiredWikiHeadings = [
  "## Summary",
  "## Current Truth",
  "## Why It Matters",
  "## Key Files",
  "## Flows",
  "## Invariants",
  "## Known Risks",
  "## Related Pages",
  "## Sources",
  "## Last Reviewed",
];

export const wikiCategoryOrder = [
  "systems",
  "flows",
  "routes",
  "design-system",
  "testing",
  "operations",
  "decisions",
];

export const wikiCategoryLabels = {
  systems: "Systems",
  flows: "Flows",
  routes: "Routes",
  "design-system": "Design System",
  testing: "Testing",
  operations: "Operations",
  decisions: "Decisions",
};

export function toPosixPath(value) {
  return value.replaceAll(path.sep, "/");
}

export function walk(dir) {
  const entries = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      entries.push(...walk(full));
      continue;
    }
    entries.push(full);
  }
  return entries;
}

export function getWikiFiles() {
  const wikiDir = path.join(knowledgeRoot, "wiki");
  return walk(wikiDir)
    .filter((file) => file.endsWith(".md"))
    .sort((left, right) => left.localeCompare(right));
}

export function getKnowledgeRelativePath(file) {
  return toPosixPath(path.relative(knowledgeRoot, file));
}

export function readPageTitle(file) {
  const content = readFileSync(file, "utf8");
  const match = content.match(/^#\s+(.+)$/m);
  return match ? match[1].trim() : path.basename(file, path.extname(file));
}

export function normalizeContent(value) {
  return value.replaceAll("\r\n", "\n").trimEnd();
}

export function renderKnowledgeIndex() {
  const groupedPages = new Map();

  for (const category of wikiCategoryOrder) {
    groupedPages.set(category, []);
  }

  for (const file of getWikiFiles()) {
    const relativePath = getKnowledgeRelativePath(file);
    const [, category] = relativePath.split("/");
    if (!groupedPages.has(category)) {
      groupedPages.set(category, []);
    }
    groupedPages.get(category).push({
      relativePath,
      title: readPageTitle(file),
    });
  }

  for (const pages of groupedPages.values()) {
    pages.sort((left, right) => left.title.localeCompare(right.title));
  }

  const lines = [
    "# Krukraft Knowledge Index",
    "",
    "This directory is the repo-owned LLM wiki layer for Krukraft.",
    "",
    "It sits between raw source material and one-off assistant answers:",
    "",
    "- `knowledge/raw/` stores evidence, snapshots, or intake material.",
    "- `knowledge/wiki/` stores synthesized markdown pages maintained over time.",
    "- `knowledge/schema/` stores ingest/query/lint rules for agents.",
    "",
    "Canonical repo truth still lives in:",
    "",
    "1. code and verified runtime behavior",
    "2. `AGENTS.md`",
    "3. `krukraft-ai-contexts/`",
    "4. `design-system.md`",
    "5. `figma-component-map.md`",
    "",
    "Use this index as the first entry point for queries.",
    "",
    "## Schema",
    "",
    "- [Wiki Rules](schema/wiki-rules.md)",
    "- [Source Priority](schema/source-priority.md)",
    "- [Ingest Rules](schema/ingest-rules.md)",
    "- [Query Rules](schema/query-rules.md)",
    "- [Lint Rules](schema/lint-rules.md)",
    "- [Page Template](schema/page-template.md)",
    "",
    "## Core Wiki Pages",
    "",
  ];

  for (const category of wikiCategoryOrder) {
    const pages = groupedPages.get(category) ?? [];
    if (pages.length === 0) {
      continue;
    }

    lines.push(`### ${wikiCategoryLabels[category] ?? category}`);
    lines.push("");

    for (const page of pages) {
      lines.push(`- [${page.title}](${page.relativePath})`);
    }

    lines.push("");
  }

  lines.push("## Working Files");
  lines.push("");
  lines.push("- [Log](log.md)");
  lines.push("- [Glossary](glossary.md)");
  lines.push("- [Open Questions](open-questions.md)");
  lines.push("- [Raw Source Notes](raw/README.md)");

  return `${lines.join("\n")}\n`;
}

export function extractSection(content, heading) {
  const escapedHeading = heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`${escapedHeading}\\s*\\n([\\s\\S]*?)(?=\\n## |\\n# |$)`, "m");
  const match = content.match(regex);
  return match ? match[1].trim() : "";
}

export function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
