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
  resolveRepoRelativePath,
} from "./lib/knowledge-wiki.mjs";

const rawCoverage = new Map();
const canonicalCoverage = [];
const rawOnlyPages = [];

for (const rawFile of getRawFiles()) {
  rawCoverage.set(getRepoRelativePath(rawFile), []);
}

for (const wikiFile of getWikiFiles()) {
  const relativePath = getKnowledgeRelativePath(wikiFile);
  const content = normalizeContent(readFileSync(wikiFile, "utf8"));
  const sourcesSection = extractSection(content, "## Sources");
  const sourceLinks = extractMarkdownLinks(sourcesSection);
  const resolvedSources = sourceLinks
    .map((link) => resolveRepoRelativePath(wikiFile, link.target))
    .filter(Boolean);

  const hasCanonicalSource = resolvedSources.some((target) => isCanonicalSourceTarget(target));
  if (hasCanonicalSource) {
    canonicalCoverage.push(relativePath);
  } else {
    rawOnlyPages.push(relativePath);
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

const coveredRaw = [...rawCoverage.entries()].filter(([, refs]) => refs.length > 0);
const uncoveredRaw = [...rawCoverage.entries()].filter(([, refs]) => refs.length === 0);

console.log(`[wiki-coverage] Wiki pages: ${getWikiFiles().length}`);
console.log(`[wiki-coverage] Raw notes: ${getRawFiles().length}`);
console.log(`[wiki-coverage] Raw notes cited by wiki pages: ${coveredRaw.length}/${getRawFiles().length}`);
console.log(`[wiki-coverage] Wiki pages with canonical source backing: ${canonicalCoverage.length}/${getWikiFiles().length}`);

if (uncoveredRaw.length > 0) {
  console.log("[wiki-coverage] Uncovered raw notes:");
  for (const [rawFile] of uncoveredRaw) {
    console.log(`- ${rawFile}`);
  }
}

if (rawOnlyPages.length > 0) {
  console.log("[wiki-coverage] Wiki pages without canonical source backing:");
  for (const page of rawOnlyPages) {
    console.log(`- ${page}`);
  }
}
