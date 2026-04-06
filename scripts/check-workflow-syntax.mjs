import { readdirSync } from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const workflowsDir = path.resolve(".github/workflows");

function listWorkflowFiles(directory) {
  return readdirSync(directory, { withFileTypes: true })
    .filter((entry) => entry.isFile() && /\.(ya?ml)$/i.test(entry.name))
    .map((entry) => path.join(directory, entry.name))
    .sort();
}

function parseWorkflowWithRuby(filePath) {
  execFileSync(
    "ruby",
    [
      "-e",
      'require "yaml"; YAML.load_file(ARGV.fetch(0)); puts "ok"',
      filePath,
    ],
    { stdio: "pipe" },
  );
}

const workflowFiles = listWorkflowFiles(workflowsDir);

if (workflowFiles.length === 0) {
  console.log("[workflow-check] No workflow files found.");
  process.exit(0);
}

try {
  for (const workflowFile of workflowFiles) {
    parseWorkflowWithRuby(workflowFile);
  }
} catch (error) {
  const message =
    error instanceof Error && "message" in error ? error.message : String(error);
  console.error("[workflow-check] Invalid GitHub Actions workflow YAML detected.");
  console.error(message);
  process.exit(1);
}

console.log(
  `[workflow-check] OK: ${workflowFiles.length} workflow files parsed successfully.`,
);
