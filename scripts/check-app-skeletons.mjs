import fs from "node:fs";
import path from "node:path";

const APP_ROOT = path.join(process.cwd(), "src", "app");
const FILE_EXTENSIONS = new Set([".ts", ".tsx"]);
const PATTERNS = [
  {
    type: "function",
    regex:
      /^\s*(?:export\s+)?(?:async\s+)?function\s+([A-Z][A-Za-z0-9]*(?:Skeleton|Fallback))\b/gm,
  },
  {
    type: "const",
    regex:
      /^\s*(?:export\s+)?const\s+([A-Z][A-Za-z0-9]*(?:Skeleton|Fallback))\b/gm,
  },
];

function walk(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      files.push(...walk(fullPath));
      continue;
    }

    if (FILE_EXTENSIONS.has(path.extname(entry.name)) && !entry.name.endsWith(".d.ts")) {
      files.push(fullPath);
    }
  }

  return files;
}

function getLineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}

const violations = [];

for (const filePath of walk(APP_ROOT)) {
  const source = fs.readFileSync(filePath, "utf8");

  for (const { regex, type } of PATTERNS) {
    for (const match of source.matchAll(regex)) {
      if (match.index == null) continue;

      violations.push({
        file: path.relative(process.cwd(), filePath),
        line: getLineNumber(source, match.index),
        name: match[1],
        type,
      });
    }
  }
}

if (violations.length > 0) {
  console.error(
    "Inline skeleton/fallback components are not allowed in src/app. Move them to src/components/skeletons and import them into the route file.",
  );

  for (const violation of violations) {
    console.error(
      `- ${violation.file}:${violation.line} ${violation.type} ${violation.name}`,
    );
  }

  process.exit(1);
}

console.log("No inline app-level skeleton or fallback components found.");
