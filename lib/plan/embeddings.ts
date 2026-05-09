import { pipeline, type FeatureExtractionPipeline } from "@xenova/transformers";
import resourceEmbeddings from "./data/resourceEmbeddings.json";

// Cached pipeline — initialised once per server process lifetime.
let _embed: FeatureExtractionPipeline | null = null;

async function getEmbedder(): Promise<FeatureExtractionPipeline> {
  if (!_embed) {
    _embed = (await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2",
    )) as FeatureExtractionPipeline;
  }
  return _embed;
}

/** Cosine similarity between two L2-normalised vectors. */
function cosine(a: number[], b: number[]): number {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

/**
 * Given a query string (e.g. the student's gap description), return the ids
 * of the top-k most semantically similar resources from the pre-computed
 * embedding index.
 */
export async function getTopResourceIds(
  query: string,
  topK = 6,
): Promise<string[]> {
  const embed = await getEmbedder();
  const output = await embed(query, { pooling: "mean", normalize: true });
  const queryVec = Array.from(output.data as Float32Array);

  const scored = (resourceEmbeddings as { id: string; embedding: number[] }[])
    .map((r) => ({ id: r.id, score: cosine(queryVec, r.embedding) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored.map((r) => r.id);
}
