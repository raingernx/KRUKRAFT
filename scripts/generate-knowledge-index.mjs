import { writeFileSync } from "node:fs";
import path from "node:path";

import { knowledgeRoot, renderKnowledgeIndex } from "./lib/knowledge-wiki.mjs";

const indexPath = path.join(knowledgeRoot, "index.md");
writeFileSync(indexPath, renderKnowledgeIndex(), "utf8");

console.log("[wiki-index] Rebuilt knowledge/index.md from the current wiki tree.");
