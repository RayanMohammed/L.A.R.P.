import { z } from "zod";

export type JobArchetype = {
  id: string;
  name: string;
  summary: string;
  jargonNote?: string;
  requiredSkills: string[];
  niceToHaveSkills: string[];
  typicalTimeline: string;
  signalsRecruitersWant: string[];
};

export type CampusResourceType =
  | "club"
  | "research"
  | "workshop"
  | "internship-lite"
  | "incubator"
  | "program";

export type CampusResource = {
  id: string;
  name: string;
  type: CampusResourceType;
  description: string;
  skillsItBuilds: string[];
  url: string;
};

export const SUPPORTED_LANGUAGES = ["en", "es"] as const;
export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

/**
 * Structured role context extracted from Compound Mini's web search.
 * Used when the student enters a free-text role with no archetype match.
 * Replaces the bare freeText string in buildUserPrompt.
 */
export type EnrichedRoleContext = {
  /** The role name as the student typed it. */
  rawInput: string;
  /** 1–2 sentence plain-English description of what this role actually does. */
  roleSummary: string;
  /** 4–8 concrete skills entry-level candidates need. */
  requiredSkills: string[];
  /** What recruiters or hiring managers look for at the entry level. */
  entryLevelSignals: string[];
  /** Typical timeline to first opportunity (e.g. "6–12 months"). */
  typicalTimeline: string;
  /** Whether web search was used or whether we fell back to LLM knowledge. */
  source: "web_search" | "llm_fallback";
};

/** Input from the client (the 3-step intake form). */
export const PlanRequestSchema = z
  .object({
    targetRoleId: z.string().min(1).optional(),
    targetRoleFreeText: z.string().min(1).max(280).optional(),
    currentSkills: z.array(z.string().min(1).max(120)).max(40).default([]),
    context: z.string().max(1500).optional(),
    language: z.enum(SUPPORTED_LANGUAGES).default("en"),
  })
  .refine((v) => Boolean(v.targetRoleId || v.targetRoleFreeText), {
    message: "targetRoleId or targetRoleFreeText is required",
  });

export type PlanRequest = z.infer<typeof PlanRequestSchema>;

/** What we expect Groq to emit (raw — references resources by id only). */
export const LlmActionItemSchema = z.object({
  rank: z.number().int().min(1).max(10),
  resourceId: z.string().min(1),
  gap: z.string().min(1).max(400),
  skillBuilt: z.string().min(1).max(400),
  jobUnlocked: z.string().min(1).max(400),
  thisWeekAction: z.string().min(1).max(280),
});

export const LlmPlanSchema = z.object({
  summary: z.string().min(1).max(500),
  actionItems: z.array(LlmActionItemSchema).min(1).max(8),
});

export type LlmPlan = z.infer<typeof LlmPlanSchema>;

/** Final shape returned to the client (resources hydrated from local data). */
export type ActionItem = {
  rank: number;
  gap: string;
  resource: CampusResource;
  skillBuilt: string;
  jobUnlocked: string;
  thisWeekAction: string;
};

export type PlanResponse = {
  archetype: JobArchetype | { name: string; summary: string };
  summary: string;
  actionItems: ActionItem[];
  model: string;
  generatedAtMs: number;
};
