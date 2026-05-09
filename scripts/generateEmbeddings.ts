/**
 * generateEmbeddings.ts
 *
 * Run with: npm run generate:embeddings
 *
 * Reads campusResources.json, generates an embedding for each resource using
 * all-MiniLM-L6-v2 (runs locally, no API key needed), and writes the result
 * to lib/plan/data/resourceEmbeddings.json.
 *
 * Re-run this whenever you add or change resources. Commit the output.
 */

import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pipeline } from "@xenova/transformers";
import resources from "../lib/plan/data/campusResources.json";

const OUTPUT_PATH = resolve("lib/plan/data/resourceEmbeddings.json");

type EmbeddableResource = {
  id: string;
  name: string;
  description: string;
  skillsItBuilds: string[];
};

// The text we embed for each resource — name + description + skills it builds
// is the most semantically relevant signal for matching against a student's gap.
function resourceToText(r: EmbeddableResource): string {
  return `${r.name}. ${r.description}. Skills: ${r.skillsItBuilds.join(", ")}`;
}

async function main() {
  console.log("Loading embedding model (all-MiniLM-L6-v2)...");
  const embed = await pipeline("feature-extraction", "Xenova/all-MiniLM-L6-v2");

  const list = resources as EmbeddableResource[];
  console.log(`Embedding ${list.length} resources...`);

  const results: { id: string; embedding: number[] }[] = [];

  for (const resource of list) {
    const text = resourceToText(resource);
    const output = await embed(text, { pooling: "mean", normalize: true });
    results.push({
      id: resource.id,
      embedding: Array.from(output.data as Float32Array),
    });
    console.log(`  ✓ ${resource.id}`);
  }

  writeFileSync(OUTPUT_PATH, JSON.stringify(results, null, 2));
  console.log(`\nWrote ${results.length} embeddings to ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
