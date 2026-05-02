import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const CONTRACT_DOC = "docs/figma-numeric-contracts.md";

const args = new Set(process.argv.slice(2));
const mode = args.has("--worktree") ? "worktree" : "staged";
const strict = args.has("--strict");

function getChangedFiles() {
  const command =
    mode === "worktree"
      ? ["status", "--porcelain"]
      : ["diff", "--cached", "--name-only", "--diff-filter=ACMRD"];

  const output = execFileSync("git", command, { encoding: "utf8" }).trim();

  if (!output) {
    return [];
  }

  if (mode === "worktree") {
    return output
      .split("\n")
      .map((line) => line.slice(3).trim())
      .filter(Boolean);
  }

  return output.split("\n").map((line) => line.trim()).filter(Boolean);
}

function parseContractOwners(markdown) {
  const lines = markdown.split("\n");
  const owners = [];
  let currentComponent = null;

  for (const line of lines) {
    const headingMatch = line.match(/^###\s+(.+)$/);
    if (headingMatch) {
      currentComponent = headingMatch[1].trim();
      continue;
    }

    const ownerMatch = line.match(/^- Runtime owner:\s+`([^`]+)`/);
    if (ownerMatch && currentComponent) {
      owners.push({
        component: currentComponent,
        runtimeOwner: ownerMatch[1].trim(),
      });
    }
  }

  return owners;
}

const changedFiles = getChangedFiles();

if (changedFiles.length === 0) {
  console.log("[figma-contracts-check] No changed files detected.");
  process.exit(0);
}

const owners = parseContractOwners(readFileSync(CONTRACT_DOC, "utf8"));
const touchedComponents = owners.filter(({ runtimeOwner }) =>
  changedFiles.includes(runtimeOwner),
);

if (touchedComponents.length === 0) {
  console.log(
    `[figma-contracts-check] No tracked Figma-backed runtime owner changes detected in ${mode} files.`,
  );
  process.exit(0);
}

const contractDocTouched = changedFiles.includes(CONTRACT_DOC);

if (contractDocTouched) {
  console.log(
    `[figma-contracts-check] Contract doc updated alongside tracked runtime owners: ${touchedComponents
      .map(({ component }) => component)
      .join(", ")}.`,
  );
  process.exit(0);
}

const touchedOwnerPaths = touchedComponents.map(({ runtimeOwner }) => runtimeOwner);
const touchedComponentNames = touchedComponents.map(({ component }) => component);

console.warn(
  "[figma-contracts-check] Tracked Figma-backed runtime owner files changed without refreshing docs/figma-numeric-contracts.md.",
);
console.warn(
  `[figma-contracts-check] Components: ${touchedComponentNames.join(", ")}`,
);
console.warn(
  `[figma-contracts-check] Runtime owners: ${touchedOwnerPaths.join(", ")}`,
);
console.warn(
  `[figma-contracts-check] Refresh the relevant contract block in ${CONTRACT_DOC} before closing the task.`,
);

if (strict) {
  process.exit(1);
}

process.exit(0);
