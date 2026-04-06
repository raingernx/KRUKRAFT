import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { parseArgs } from "node:util";

import {
  countTokenOverlap,
  knowledgeRoot,
  mergeRelatedPageLinks,
  renderKnowledgeIndex,
  slugify,
  suggestRelatedWikiPages,
  toPosixPath,
  tokenizeForSimilarity,
  wikiCategoryOrder,
} from "./lib/knowledge-wiki.mjs";

const availableBuckets = ["repo-docs", "product", "architecture", "design", "operations", "incidents", "research", "decisions"];
const rawRoot = path.join(knowledgeRoot, "raw");
const wikiRoot = path.join(knowledgeRoot, "wiki");
const knowledgeLogFile = path.join(knowledgeRoot, "log.md");
const knowledgeIndexFile = path.join(knowledgeRoot, "index.md");
const today = new Date().toISOString().slice(0, 10);

const { values } = parseArgs({
  options: {
    batch: { type: "string" },
    bucket: { type: "string" },
    slug: { type: "string" },
    title: { type: "string" },
    summary: { type: "string", default: "TODO: summarize this source." },
    source: { type: "string" },
    "wiki-dir": { type: "string" },
    "wiki-slug": { type: "string" },
    "wiki-title": { type: "string" },
    "dry-run": { type: "boolean", default: false },
  },
});

function fail(message) {
  console.error(`[wiki-ingest] ${message}`);
  process.exit(1);
}

function pushUniqueRelatedEntry(targetEntries, entry) {
  if (!targetEntries.some((candidate) => candidate.label === entry.label && candidate.target === entry.target)) {
    targetEntries.push(entry);
  }
}

function normalizeBatchItem(rawItem, index) {
  if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
    fail(`Batch item ${index + 1} must be an object.`);
  }

  return {
    bucket: rawItem.bucket,
    slug: rawItem.slug,
    title: rawItem.title,
    summary: rawItem.summary ?? "TODO: summarize this source.",
    source: rawItem.source,
    wikiDir: rawItem.wikiDir ?? rawItem["wiki-dir"],
    wikiSlug: rawItem.wikiSlug ?? rawItem["wiki-slug"],
    wikiTitle: rawItem.wikiTitle ?? rawItem["wiki-title"],
  };
}

function loadInputItems() {
  const hasBatch = Boolean(values.batch);
  const hasSingleItemArgs = Boolean(
    values.bucket ||
      values.slug ||
      values.title ||
      values.source ||
      values["wiki-dir"] ||
      values["wiki-slug"] ||
      values["wiki-title"],
  );

  if (hasBatch && hasSingleItemArgs) {
    fail("Use either single ingest flags or --batch <json-file>, not both.");
  }

  if (hasBatch) {
    const batchPath = path.resolve(process.cwd(), values.batch);
    if (!existsSync(batchPath)) {
      fail(`Batch file does not exist: ${toPosixPath(path.relative(process.cwd(), batchPath))}`);
    }

    let parsed;
    try {
      parsed = JSON.parse(readFileSync(batchPath, "utf8"));
    } catch (error) {
      fail(`Could not parse batch JSON: ${error instanceof Error ? error.message : String(error)}`);
    }

    const items = Array.isArray(parsed) ? parsed : parsed?.items;
    if (!Array.isArray(items) || items.length === 0) {
      fail("Batch file must contain a non-empty array or an object with an `items` array.");
    }

    return items.map((item, index) => normalizeBatchItem(item, index));
  }

  return [
    {
      bucket: values.bucket,
      slug: values.slug,
      title: values.title,
      summary: values.summary,
      source: values.source,
      wikiDir: values["wiki-dir"],
      wikiSlug: values["wiki-slug"],
      wikiTitle: values["wiki-title"],
    },
  ];
}

function resolveSourcePath(sourceValue) {
  if (!sourceValue) {
    return null;
  }

  const absolutePath = path.resolve(process.cwd(), sourceValue);
  return existsSync(absolutePath) ? absolutePath : null;
}

function normalizePlanItem(inputItem, index) {
  if (!inputItem.bucket || !availableBuckets.includes(inputItem.bucket)) {
    fail(`Item ${index + 1}: bucket is required and must be one of: ${availableBuckets.join(", ")}`);
  }

  if (!inputItem.title) {
    fail(`Item ${index + 1}: title is required.`);
  }

  const rawSlug = inputItem.slug ? slugify(inputItem.slug) : slugify(inputItem.title);
  if (!rawSlug) {
    fail(`Item ${index + 1}: could not derive a valid slug. Pass slug explicitly.`);
  }

  const rawDir = path.join(rawRoot, inputItem.bucket);
  const rawFile = path.join(rawDir, `${rawSlug}.md`);
  const rawRelativePath = toPosixPath(path.relative(knowledgeRoot, rawFile));
  const sourcePath = resolveSourcePath(inputItem.source);
  const sourceRelativeFromRaw = sourcePath ? toPosixPath(path.relative(rawDir, sourcePath)) : null;

  let wikiFile = null;
  let wikiRelativePath = null;
  let wikiDir = null;
  let wikiTitle = null;

  const hasWikiOptions = Boolean(inputItem.wikiDir || inputItem.wikiSlug || inputItem.wikiTitle);
  if (hasWikiOptions) {
    if (!inputItem.wikiDir || !wikiCategoryOrder.includes(inputItem.wikiDir)) {
      fail(`Item ${index + 1}: wikiDir is required with wiki options and must be one of: ${wikiCategoryOrder.join(", ")}`);
    }

    const wikiSlug = inputItem.wikiSlug ? slugify(inputItem.wikiSlug) : rawSlug;
    wikiTitle = inputItem.wikiTitle ?? inputItem.title;
    wikiDir = path.join(wikiRoot, inputItem.wikiDir);
    wikiFile = path.join(wikiDir, `${wikiSlug}.md`);
    wikiRelativePath = toPosixPath(path.relative(knowledgeRoot, wikiFile));
  }

  return {
    index,
    bucket: inputItem.bucket,
    slug: rawSlug,
    title: inputItem.title,
    summary: inputItem.summary ?? "TODO: summarize this source.",
    sourcePath,
    sourceRelativeFromRaw,
    rawDir,
    rawFile,
    rawRelativePath,
    rawAlreadyExists: existsSync(rawFile),
    wikiDir,
    wikiFile,
    wikiRelativePath,
    wikiAlreadyExists: wikiFile ? existsSync(wikiFile) : false,
    wikiTitle,
    sourceRepoRelativePath: sourcePath ? toPosixPath(path.relative(process.cwd(), sourcePath)) : null,
  };
}

function scoreBatchRelatedness(leftItem, rightItem) {
  const leftTitleTokens = tokenizeForSimilarity(leftItem.title);
  const rightTitleTokens = tokenizeForSimilarity(rightItem.title);
  const leftSourceTokens = leftItem.sourceRepoRelativePath ? tokenizeForSimilarity(leftItem.sourceRepoRelativePath) : [];
  const rightSourceTokens = rightItem.sourceRepoRelativePath ? tokenizeForSimilarity(rightItem.sourceRepoRelativePath) : [];

  let score = 0;
  score += countTokenOverlap(leftTitleTokens, rightTitleTokens) * 6;
  score += countTokenOverlap(leftSourceTokens, rightSourceTokens) * 3;

  if (leftItem.wikiRelativePath && rightItem.wikiRelativePath) {
    const [, leftCategory] = leftItem.wikiRelativePath.split("/");
    const [, rightCategory] = rightItem.wikiRelativePath.split("/");
    if (leftCategory === rightCategory) {
      score += 1;
    }
  }

  return score;
}

function buildWikiDraft(planItem, relatedPages) {
  const rawRelativeFromWiki = toPosixPath(path.relative(planItem.wikiDir, planItem.rawFile));
  const sourceLines = [`- [${planItem.title}](${rawRelativeFromWiki})`];
  if (planItem.sourcePath) {
    sourceLines.push(`- [Canonical source](${toPosixPath(path.relative(planItem.wikiDir, planItem.sourcePath))})`);
  }

  const relatedPageLines = relatedPages.length > 0
    ? relatedPages.map((page) => `- [${page.label}](${page.target})`)
    : ["- TODO"];

  return `# ${planItem.wikiTitle}

## Summary

TODO: summarize this topic.

## Current Truth

- TODO

## Why It Matters

TODO

## Key Files

- TODO

## Flows

- TODO

## Invariants

- TODO

## Known Risks

- TODO

## Related Pages

${relatedPageLines.join("\n")}

## Sources

${sourceLines.join("\n")}

## Last Reviewed

- ${today}
`;
}

function buildRawDraft(planItem, relatedWikiEntries) {
  return [
    `# ${planItem.title}`,
    "",
    "## Summary",
    "",
    planItem.summary,
    "",
    "## Source Reference",
    "",
    planItem.sourceRelativeFromRaw ? `- [Canonical source](${planItem.sourceRelativeFromRaw})` : "- Manual capture / no canonical source path supplied yet.",
    "",
    "## Notes",
    "",
    "- TODO",
    "",
    "## Related Wiki Pages",
    "",
    ...(relatedWikiEntries.length > 0
      ? relatedWikiEntries.map((entry) => `- [${entry.label}](${entry.target})`)
      : ["- TODO"]),
    "",
    "## Captured At",
    "",
    `- ${today}`,
    "",
  ].join("\n");
}

function formatLogEntry(planItem) {
  const titleLink = `[${planItem.title}](${planItem.rawRelativePath})`;
  const details = [`captured ${titleLink} in \`${planItem.bucket}\``];

  if (planItem.sourceRepoRelativePath) {
    details.push(`from \`${planItem.sourceRepoRelativePath}\``);
  }

  if (planItem.wikiRelativePath) {
    details.push(`and seeded [${planItem.wikiTitle}](${planItem.wikiRelativePath})`);
  }

  if (planItem.totalSuggestionCount > 0) {
    details.push(`with ${planItem.totalSuggestionCount} related-page suggestion${planItem.totalSuggestionCount === 1 ? "" : "s"}`);
  }

  return `- ${details.join(" ")}.`;
}

function appendKnowledgeLog(logEntries) {
  const current = readFileSync(knowledgeLogFile, "utf8").replaceAll("\r\n", "\n");
  const lines = current.split("\n");
  const heading = `## ${today}`;
  const headingIndex = lines.findIndex((line) => line.trim() === heading);

  if (headingIndex !== -1) {
    let insertIndex = headingIndex + 1;
    while (insertIndex < lines.length && lines[insertIndex].trim() === "") {
      insertIndex += 1;
    }
    lines.splice(insertIndex, 0, ...logEntries, "");
    writeFileSync(knowledgeLogFile, `${lines.join("\n").replace(/\n{3,}/g, "\n\n").trimEnd()}\n`, "utf8");
    return;
  }

  const nextContent = [
    "# Knowledge Log",
    "",
    heading,
    "",
    ...logEntries,
    "",
    current.replace(/^# Knowledge Log\s*/, "").trimStart(),
  ]
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trimEnd();

  writeFileSync(knowledgeLogFile, `${nextContent}\n`, "utf8");
}

function buildPlan(items) {
  const normalizedItems = items.map((item, index) => normalizePlanItem(item, index));
  const batchRawTargets = new Map();
  const batchWikiTargets = new Map();
  const conflicts = [];
  const batchCreatedWikiItems = normalizedItems.filter((item) => item.wikiRelativePath);
  const batchCreatedWikiRelativePaths = batchCreatedWikiItems.map((item) => item.wikiRelativePath);

  for (const item of normalizedItems) {
    if (item.rawAlreadyExists) {
      conflicts.push(`Raw note already exists for item ${item.index + 1}: ${item.rawRelativePath}`);
    }
    if (batchRawTargets.has(item.rawRelativePath)) {
      conflicts.push(
        `Duplicate raw note target in batch: ${item.rawRelativePath} (items ${batchRawTargets.get(item.rawRelativePath)} and ${item.index + 1})`,
      );
    } else {
      batchRawTargets.set(item.rawRelativePath, item.index + 1);
    }

    if (item.wikiRelativePath) {
      if (item.wikiAlreadyExists) {
        conflicts.push(`Wiki page already exists for item ${item.index + 1}: ${item.wikiRelativePath}`);
      }
      if (batchWikiTargets.has(item.wikiRelativePath)) {
        conflicts.push(
          `Duplicate wiki page target in batch: ${item.wikiRelativePath} (items ${batchWikiTargets.get(item.wikiRelativePath)} and ${item.index + 1})`,
        );
      } else {
        batchWikiTargets.set(item.wikiRelativePath, item.index + 1);
      }
    }
  }

  if (conflicts.length > 0) {
    return {
      items: normalizedItems,
      conflicts,
      backlinkPlans: [],
      groupedBacklinkPlans: new Map(),
      logEntries: [],
    };
  }

  const backlinkPlans = [];
  const groupedBacklinkPlans = new Map();

  for (const item of normalizedItems) {
    const relatedWikiEntries = [];
    const existingSuggestions = suggestRelatedWikiPages({
      title: item.title,
      sourcePath: item.sourcePath,
      preferredCategory: item.wikiRelativePath ? item.wikiRelativePath.split("/")[1] : null,
      excludeRelativePaths: batchCreatedWikiRelativePaths,
    });

    const plannedBatchSuggestions = item.wikiRelativePath
      ? batchCreatedWikiItems
          .filter((candidate) => candidate.wikiRelativePath !== item.wikiRelativePath)
          .map((candidate) => ({
            ...candidate,
            score: scoreBatchRelatedness(item, candidate),
          }))
          .filter((candidate) => candidate.score > 0)
          .sort((left, right) => right.score - left.score || left.title.localeCompare(right.title))
          .slice(0, 3)
      : [];

    if (item.wikiRelativePath) {
      pushUniqueRelatedEntry(relatedWikiEntries, {
        label: item.wikiTitle,
        target: toPosixPath(path.relative(item.rawDir, item.wikiFile)),
      });
    }

    for (const page of existingSuggestions) {
      pushUniqueRelatedEntry(relatedWikiEntries, {
        label: page.title,
        target: toPosixPath(path.relative(item.rawDir, path.join(knowledgeRoot, page.relativePath))),
      });
    }

    for (const page of plannedBatchSuggestions) {
      pushUniqueRelatedEntry(relatedWikiEntries, {
        label: page.wikiTitle,
        target: toPosixPath(path.relative(item.rawDir, page.wikiFile)),
      });
    }

    let wikiDraft = null;
    if (item.wikiRelativePath) {
      const wikiRelatedPages = [];

      for (const page of existingSuggestions) {
        wikiRelatedPages.push({
          label: page.title,
          target: toPosixPath(path.relative(item.wikiDir, path.join(knowledgeRoot, page.relativePath))),
          relativePath: page.relativePath,
          type: "existing",
        });
      }

      for (const page of plannedBatchSuggestions) {
        wikiRelatedPages.push({
          label: page.wikiTitle,
          target: toPosixPath(path.relative(item.wikiDir, page.wikiFile)),
          relativePath: page.wikiRelativePath,
          type: "planned",
        });
      }

      wikiDraft = buildWikiDraft(item, wikiRelatedPages);

      for (const page of existingSuggestions) {
        const backlinkTarget = toPosixPath(path.relative(path.dirname(page.file), item.wikiFile));
        const backlinkPlan = {
          wikiPage: page.relativePath,
          file: page.file,
          label: item.wikiTitle,
          target: backlinkTarget,
        };
        backlinkPlans.push(backlinkPlan);

        if (!groupedBacklinkPlans.has(page.file)) {
          groupedBacklinkPlans.set(page.file, []);
        }
        groupedBacklinkPlans.get(page.file).push({
          label: item.wikiTitle,
          target: backlinkTarget,
        });
      }
    }

    item.existingSuggestions = existingSuggestions;
    item.plannedBatchSuggestions = plannedBatchSuggestions;
    item.totalSuggestionCount = existingSuggestions.length + plannedBatchSuggestions.length;
    item.relatedWikiEntries = relatedWikiEntries;
    item.rawDraft = buildRawDraft(item, relatedWikiEntries);
    item.wikiDraft = wikiDraft;
  }

  return {
    items: normalizedItems,
    conflicts: [],
    backlinkPlans,
    groupedBacklinkPlans,
    logEntries: normalizedItems.map((item) => formatLogEntry(item)),
  };
}

function printDryRun(plan, isBatchMode) {
  console.log("[wiki-ingest] Dry run: no files were written.");
  console.log(`[wiki-ingest] Mode: ${isBatchMode ? "batch" : "single"} (${plan.items.length} item${plan.items.length === 1 ? "" : "s"})`);

  for (const item of plan.items) {
    console.log(`[wiki-ingest] Item ${item.index + 1}: ${item.title}`);
    console.log(`  raw: ${item.rawRelativePath}${item.rawAlreadyExists ? " (already exists)" : ""}`);
    if (item.wikiRelativePath) {
      console.log(`  wiki: ${item.wikiRelativePath}${item.wikiAlreadyExists ? " (already exists)" : ""}`);
    }
    if (item.sourceRepoRelativePath) {
      console.log(`  source: ${item.sourceRepoRelativePath}`);
    }
    if (item.existingSuggestions.length > 0) {
      console.log(`  existing suggestions: ${item.existingSuggestions.map((page) => page.relativePath).join(", ")}`);
    } else {
      console.log("  existing suggestions: none");
    }
    if (item.plannedBatchSuggestions.length > 0) {
      console.log(`  batch suggestions: ${item.plannedBatchSuggestions.map((page) => page.wikiRelativePath).join(", ")}`);
    } else if (isBatchMode) {
      console.log("  batch suggestions: none");
    }
  }

  console.log(
    `[wiki-ingest] Batch summary: ${plan.items.length} raw note${plan.items.length === 1 ? "" : "s"}, ${
      plan.items.filter((item) => item.wikiRelativePath).length
    } wiki page${plan.items.filter((item) => item.wikiRelativePath).length === 1 ? "" : "s"}, ${plan.backlinkPlans.length} backlink write${
      plan.backlinkPlans.length === 1 ? "" : "s"
    }, ${plan.logEntries.length} knowledge-log entr${plan.logEntries.length === 1 ? "y" : "ies"}.`,
  );

  if (plan.backlinkPlans.length > 0) {
    console.log("[wiki-ingest] Backlink plan:");
    for (const entry of plan.backlinkPlans) {
      console.log(`- ${entry.wikiPage} <= [${entry.label}](${entry.target})`);
    }
  }
}

function writePlan(plan) {
  for (const item of plan.items) {
    mkdirSync(item.rawDir, { recursive: true });
    writeFileSync(item.rawFile, `${item.rawDraft}\n`, "utf8");

    if (item.wikiFile) {
      mkdirSync(item.wikiDir, { recursive: true });
      writeFileSync(item.wikiFile, item.wikiDraft, "utf8");
    }
  }

  for (const [wikiFile, linksToAdd] of plan.groupedBacklinkPlans) {
    const current = readFileSync(wikiFile, "utf8");
    const next = mergeRelatedPageLinks(current, linksToAdd);
    if (next !== current) {
      writeFileSync(wikiFile, next, "utf8");
    }
  }

  appendKnowledgeLog(plan.logEntries);
  writeFileSync(knowledgeIndexFile, renderKnowledgeIndex(), "utf8");
}

const inputItems = loadInputItems();
const plan = buildPlan(inputItems);
const dryRun = values["dry-run"];
const isBatchMode = Boolean(values.batch);

if (plan.conflicts.length > 0) {
  for (const conflict of plan.conflicts) {
    console.error(`[wiki-ingest] ${conflict}`);
  }
  process.exit(1);
}

if (dryRun) {
  printDryRun(plan, isBatchMode);
  process.exit(0);
}

writePlan(plan);
console.log(
  `[wiki-ingest] Wrote ${plan.items.length} raw note${plan.items.length === 1 ? "" : "s"} and ${
    plan.items.filter((item) => item.wikiRelativePath).length
  } wiki page${plan.items.filter((item) => item.wikiRelativePath).length === 1 ? "" : "s"}.`,
);
