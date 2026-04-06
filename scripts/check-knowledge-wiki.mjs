import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import {
  getKnowledgeRelativePath,
  getWikiFiles,
  knowledgeRoot,
  normalizeContent,
  renderKnowledgeIndex,
  repoRoot,
  requiredRootFiles,
  requiredSchemaFiles,
  requiredWikiHeadings,
} from "./lib/knowledge-wiki.mjs";

function fail(message) {
  console.error(`[wiki-lint] ${message}`);
  process.exitCode = 1;
}

for (const file of [...requiredRootFiles, ...requiredSchemaFiles]) {
  if (!existsSync(path.join(repoRoot, file))) {
    fail(`Missing required knowledge file: ${file}`);
  }
}

const wikiDir = path.join(repoRoot, "knowledge", "wiki");
const wikiFiles = existsSync(wikiDir) ? getWikiFiles() : [];

if (wikiFiles.length === 0) {
  fail("No wiki pages found under knowledge/wiki.");
}

const indexPath = path.join(knowledgeRoot, "index.md");
const indexContent = existsSync(indexPath) ? readFileSync(indexPath, "utf8") : "";
const expectedIndexContent = renderKnowledgeIndex();

for (const file of wikiFiles) {
  const relativePath = getKnowledgeRelativePath(file);
  const content = readFileSync(file, "utf8");

  for (const heading of requiredWikiHeadings) {
    if (!content.includes(heading)) {
      fail(`Wiki page ${relativePath} is missing heading: ${heading}`);
    }
  }

}

if (normalizeContent(indexContent) !== normalizeContent(expectedIndexContent)) {
  fail("knowledge/index.md is out of date. Run `npm run wiki:index`.");
}

if (process.exitCode) {
  process.exit(process.exitCode);
}

console.log(
  `[wiki-lint] OK: ${wikiFiles.length} wiki pages and ${requiredSchemaFiles.length} schema files passed structural checks.`,
);
