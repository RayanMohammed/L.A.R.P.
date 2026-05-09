import type { CampusResource } from "./types";
import { RESOURCES, getResource } from "./catalog";
import { getTopResourceIds } from "./embeddings";

export {
  ARCHETYPES,
  RESOURCES,
  getArchetype,
  getResource,
} from "./catalog";

/**
 * Semantic resource retrieval.
 *
 * Builds a query string from the student's target role and current skills,
 * retrieves the top-k most relevant resource ids via embedding similarity,
 * and returns the hydrated CampusResource objects.
 *
 * Falls back to returning all RESOURCES if embedding fails — so a model
 * error never breaks plan generation, it just costs more tokens.
 */
export async function getTopResources(args: {
  roleDescription: string;
  currentSkills: string[];
  topK?: number;
}): Promise<CampusResource[]> {
  const { roleDescription, currentSkills, topK = 6 } = args;

  const query = [
    `Target role: ${roleDescription}`,
    currentSkills.length > 0
      ? `Current skills: ${currentSkills.join(", ")}`
      : "No prior experience or skills yet.",
  ].join(". ");

  try {
    const ids = await getTopResourceIds(query, topK);
    const hydrated = ids
      .map((id) => getResource(id))
      .filter((r): r is CampusResource => r !== undefined);

    if (hydrated.length === 0) throw new Error("empty retrieval");
    return hydrated;
  } catch (err) {
    console.warn(
      "[embeddings] retrieval failed, falling back to full list:",
      err,
    );
    return RESOURCES;
  }
}
