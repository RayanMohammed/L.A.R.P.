import archetypes from "./data/jobArchetypes.json";
import resources from "./data/campusResources.json";
import type { CampusResource, JobArchetype } from "./types";

export const ARCHETYPES: JobArchetype[] = archetypes as JobArchetype[];
export const RESOURCES: CampusResource[] = resources as CampusResource[];

export function getArchetype(id: string): JobArchetype | undefined {
  return ARCHETYPES.find((a) => a.id === id);
}

export function getResource(id: string): CampusResource | undefined {
  return RESOURCES.find((r) => r.id === id);
}
