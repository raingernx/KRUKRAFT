import { existsSync, readFileSync, readdirSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();
const mapPath = path.join(repoRoot, "figma-component-map.md");

const TARGET_DIRS = [
  "src/design-system/primitives",
  "src/design-system/components",
];

function listExpectedComponents(relativeDir) {
  const absoluteDir = path.join(repoRoot, relativeDir);

  return readdirSync(absoluteDir)
    .filter((entry) => entry.endsWith(".tsx"))
    .filter((entry) => !entry.endsWith(".stories.tsx"))
    .map((entry) => path.basename(entry, ".tsx"))
    .sort();
}

function parseRegistryRows(markdown) {
  return markdown
    .split("\n")
    .filter((line) => line.startsWith("|"))
    .map((line) =>
      line
        .split("|")
        .slice(1, -1)
        .map((part) => part.trim()),
    )
    .filter((cells) => cells.length >= 6)
    .filter((cells) => cells[0] !== "Figma page")
    .filter((cells) => !cells.every((cell) => /^-+$/.test(cell.replace(/`/g, ""))));
}

function normalizeCell(cell) {
  return cell.replace(/^`|`$/g, "").trim();
}

const expectedComponents = TARGET_DIRS.flatMap(listExpectedComponents);
const registryMarkdown = readFileSync(mapPath, "utf8");
const rows = parseRegistryRows(registryMarkdown);
const mappedComponentNames = new Set(rows.map((row) => normalizeCell(row[2])));

const missingComponents = expectedComponents.filter(
  (componentName) => !mappedComponentNames.has(componentName),
);

const missingPaths = rows
  .filter((row) => expectedComponents.includes(normalizeCell(row[2])))
  .map((row) => ({
    componentName: normalizeCell(row[2]),
    codePath: normalizeCell(row[3]),
  }))
  .filter(({ codePath }) => codePath.startsWith("src/"))
  .filter(({ codePath }) => !codePath.includes(","))
  .filter(({ codePath }) => !codePath.includes("*"))
  .filter(({ codePath }) => !existsSync(path.join(repoRoot, codePath)));

if (missingComponents.length === 0 && missingPaths.length === 0) {
  console.log(
    `[figma-map-check] OK: ${expectedComponents.length} design-system components are registered in figma-component-map.md.`,
  );
  process.exit(0);
}

if (missingComponents.length > 0) {
  console.error("[figma-map-check] Missing registry rows for:");
  for (const componentName of missingComponents) {
    console.error(`- ${componentName}`);
  }
}

if (missingPaths.length > 0) {
  console.error("[figma-map-check] Registry rows point to missing code paths:");
  for (const { componentName, codePath } of missingPaths) {
    console.error(`- ${componentName}: ${codePath}`);
  }
}

process.exit(1);
