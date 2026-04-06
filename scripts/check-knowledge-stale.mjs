import { readFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import {
  extractSection,
  getKnowledgeRelativePath,
  getWikiFiles,
  normalizeContent,
} from "./lib/knowledge-wiki.mjs";

const { values } = parseArgs({
  options: {
    "max-age-days": {
      type: "string",
      default: "45",
    },
  },
});

const maxAgeDays = Number(values["max-age-days"]);

if (!Number.isFinite(maxAgeDays) || maxAgeDays <= 0) {
  console.error("[wiki-stale] --max-age-days must be a positive number.");
  process.exit(1);
}

const today = new Date();
const failures = [];

for (const file of getWikiFiles()) {
  const relativePath = getKnowledgeRelativePath(file);
  const content = normalizeContent(readFileSync(file, "utf8"));
  const lastReviewedSection = extractSection(content, "## Last Reviewed");
  const sourcesSection = extractSection(content, "## Sources");

  const dateMatch = lastReviewedSection.match(/(\d{4}-\d{2}-\d{2})/);
  if (!dateMatch) {
    failures.push(`${relativePath}: missing ISO date under ## Last Reviewed`);
    continue;
  }

  const reviewedAt = new Date(`${dateMatch[1]}T00:00:00.000Z`);
  if (Number.isNaN(reviewedAt.getTime())) {
    failures.push(`${relativePath}: invalid Last Reviewed date ${dateMatch[1]}`);
    continue;
  }

  const ageDays = Math.floor((today.getTime() - reviewedAt.getTime()) / 86_400_000);
  if (ageDays > maxAgeDays) {
    failures.push(`${relativePath}: stale (${ageDays} days old; max ${maxAgeDays})`);
  }

  if (!/\]\([^)]+\)/.test(sourcesSection)) {
    failures.push(`${relativePath}: ## Sources has no markdown links`);
  }
}

if (failures.length > 0) {
  console.error("[wiki-stale] Knowledge pages need review:");
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(`[wiki-stale] OK: ${getWikiFiles().length} wiki pages reviewed within ${maxAgeDays} days.`);
