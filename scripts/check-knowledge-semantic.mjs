import { readFileSync } from "node:fs";

import {
  extractMarkdownLinks,
  extractSection,
  getKnowledgeRelativePath,
  getRepoRelativePath,
  getRawFiles,
  getWikiFiles,
  isCanonicalSourceTarget,
  normalizeContent,
  normalizeTitleKey,
  readPageTitle,
  resolveRepoRelativePath,
} from "./lib/knowledge-wiki.mjs";

const failures = [];
const titleOwners = new Map();
const rawCoverage = new Map();

for (const rawFile of getRawFiles()) {
  rawCoverage.set(getRepoRelativePath(rawFile), []);
}

for (const wikiFile of getWikiFiles()) {
  const relativePath = getKnowledgeRelativePath(wikiFile);
  const content = normalizeContent(readFileSync(wikiFile, "utf8"));
  const title = readPageTitle(wikiFile);
  const normalizedTitle = normalizeTitleKey(title);

  if (!titleOwners.has(normalizedTitle)) {
    titleOwners.set(normalizedTitle, []);
  }
  titleOwners.get(normalizedTitle).push(relativePath);

  const sourcesSection = extractSection(content, "## Sources");
  const sourceLinks = extractMarkdownLinks(sourcesSection);
  const resolvedSources = sourceLinks
    .map((link) => resolveRepoRelativePath(wikiFile, link.target))
    .filter(Boolean);

  const hasCanonicalSource = resolvedSources.some((target) => isCanonicalSourceTarget(target));
  if (!hasCanonicalSource) {
    failures.push(`${relativePath}: sources rely only on knowledge/raw or knowledge/wiki links`);
  }

  const pageLinks = extractMarkdownLinks(content);
  for (const link of pageLinks) {
    const resolved = resolveRepoRelativePath(wikiFile, link.target);
    if (!resolved || !resolved.startsWith("knowledge/raw/")) {
      continue;
    }
    if (!rawCoverage.has(resolved)) {
      continue;
    }
    rawCoverage.get(resolved).push(relativePath);
  }
}

for (const [title, owners] of titleOwners.entries()) {
  if (owners.length > 1) {
    failures.push(`duplicate wiki title "${title}" in: ${owners.join(", ")}`);
  }
}

const uncoveredRawNotes = [...rawCoverage.entries()]
  .filter(([, owners]) => owners.length === 0)
  .map(([rawFile]) => rawFile);

for (const rawFile of uncoveredRawNotes) {
  failures.push(`${rawFile}: raw note is not referenced by any wiki page`);
}

if (failures.length > 0) {
  console.error("[wiki-semantic] Semantic issues found:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `[wiki-semantic] OK: ${getWikiFiles().length} wiki pages, ${getRawFiles().length} raw notes, no duplicate titles, all wiki pages have canonical source backing, and every raw note is cited.`,
);
