import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";

import {
  collectWikiRepoReferences,
  getKnowledgeRelativePath,
  getRepoRelativePath,
  getWikiFiles,
} from "./lib/knowledge-wiki.mjs";

const { values } = parseArgs({
  options: {
    mode: {
      type: "string",
      default: "worktree",
    },
    against: {
      type: "string",
    },
  },
});

const driftTrackedPrefixes = [
  "knowledge/raw/",
  "src/",
  "tests/",
  "scripts/",
  ".github/",
];

const driftTrackedFiles = new Set([
  "middleware.ts",
  "next.config.mjs",
  "package.json",
]);

function fail(message) {
  console.error(`[wiki-drift] ${message}`);
  process.exitCode = 1;
}

function getChangedFiles() {
  const mode = values.mode;
  if (!["worktree", "staged"].includes(mode)) {
    throw new Error(`Unsupported mode "${mode}". Use worktree or staged.`);
  }

  const args = values.against
    ? ["diff", "--name-only", `${values.against}...HEAD`]
    : mode === "staged"
      ? ["diff", "--cached", "--name-only"]
      : ["diff", "--name-only", "HEAD"];

  const output = execFileSync("git", args, {
    cwd: process.cwd(),
    encoding: "utf8",
  });

  return output
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

let changedFiles;

try {
  changedFiles = new Set(getChangedFiles());
} catch (error) {
  console.error(`[wiki-drift] Failed to determine changed files: ${error instanceof Error ? error.message : String(error)}`);
  process.exit(1);
}

if (changedFiles.size === 0) {
  console.log("[wiki-drift] OK: no changed files in the selected diff.");
  process.exit(0);
}

const driftFindings = [];

for (const wikiFile of getWikiFiles()) {
  const pagePath = getRepoRelativePath(wikiFile);
  const references = [...collectWikiRepoReferences(wikiFile)].filter((reference) => {
    if (driftTrackedFiles.has(reference)) {
      return true;
    }
    return driftTrackedPrefixes.some((prefix) => reference.startsWith(prefix));
  });
  const touchedReferences = [...references].filter((reference) => changedFiles.has(reference));

  if (touchedReferences.length === 0) {
    continue;
  }

  if (changedFiles.has(pagePath)) {
    continue;
  }

  driftFindings.push({
    pagePath: getKnowledgeRelativePath(wikiFile),
    touchedReferences,
  });
}

if (driftFindings.length > 0) {
  console.error("[wiki-drift] Wiki pages need review because referenced files changed:");
  for (const finding of driftFindings) {
    console.error(`- ${finding.pagePath}: ${finding.touchedReferences.join(", ")}`);
  }
  process.exit(1);
}

console.log(
  `[wiki-drift] OK: ${getWikiFiles().length} wiki pages checked against ${changedFiles.size} changed file(s); no unreviewed page drift detected.`,
);
