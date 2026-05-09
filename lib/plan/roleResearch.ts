/**
 * roleResearch.ts
 *
 * When a student enters a free-text role with no archetype match, this module:
 *   1. Calls groq/compound-mini with web search to research the role
 *   2. Calls llama-3.3-70b-versatile to extract structured JSON from the prose
 *   3. Returns an EnrichedRoleContext ready for buildUserPrompt
 *
 * Falls back to a pure LLM extraction (no web search) if Compound fails, and
 * to a minimal placeholder if extraction also fails. Never throws — plan
 * generation should always be able to proceed.
 */

import { COMPOUND_MINI_MODEL, getGroq, GROQ_MODEL } from "./groq";
import type { EnrichedRoleContext } from "./types";

const RESEARCH_PROMPT = (role: string) =>
  `I am helping a first-year college student who wants to eventually work as a "${role}".

Search the web and tell me:
1. What does this role actually do day-to-day?
2. What skills or experience do entry-level candidates (0–1 years) typically need?
3. What do job postings for junior or entry-level versions of this role ask for?
4. How long does it typically take a college student to land their first opportunity in this area?

Be specific and practical. Focus on entry-level and internship requirements, not senior roles.
Keep your answer to 200 words or less.`;

const EXTRACTION_SYSTEM_PROMPT = `You extract structured data from career research text.
Return ONE JSON object. No prose, no markdown, no preamble.

JSON schema:
{
  "roleSummary": "1-2 sentences describing what this role does day-to-day",
  "requiredSkills": ["skill1", "skill2", "skill3"],
  "entryLevelSignals": ["signal1", "signal2"],
  "typicalTimeline": "e.g. 6-12 months"
}

Rules:
- requiredSkills: 4 to 8 items, concrete and specific (not "communication skills")
- entryLevelSignals: 2 to 4 items, what a recruiter actually looks for at entry level
- typicalTimeline: a range like "6–12 months" or "12–18 months"
- If the research text is vague, use your own knowledge to fill gaps
- Never return null fields`;

/**
 * Research a free-text role using Compound Mini web search + structured
 * extraction. Returns an EnrichedRoleContext for use in buildUserPrompt.
 *
 * Never throws — falls back gracefully so plan generation can continue.
 */
export async function researchFreeTextRole(
  roleInput: string,
): Promise<EnrichedRoleContext> {
  const groq = getGroq();

  // Step 1: Compound Mini web search.
  let researchText: string;
  let source: EnrichedRoleContext["source"] = "web_search";

  try {
    const searchResponse = await groq.chat.completions.create({
      model: COMPOUND_MINI_MODEL,
      // Compound does not support `response_format: { type: "json_object" }`
      // — it returns prose, which the extraction step below converts to JSON.
      messages: [{ role: "user", content: RESEARCH_PROMPT(roleInput) }],
      // Restrict search to educational and reputable career sources only.
      // Keeps results relevant to college students and avoids low-quality
      // job boards / content farms. `search_settings` is a Groq extension
      // accepted by the SDK as an extra field.
      search_settings: {
        include_domains: [
          "*.edu",
          "bls.gov",
          "onetonline.org",
          "linkedin.com",
          "indeed.com",
          "glassdoor.com",
        ],
      },
    });

    researchText = searchResponse.choices[0]?.message?.content ?? "";
    if (!researchText.trim()) throw new Error("empty_research_response");
  } catch (err) {
    console.warn(
      "[roleResearch] Compound Mini search failed, using LLM fallback:",
      err,
    );
    source = "llm_fallback";
    researchText = `The role is: "${roleInput}". Use your training knowledge about entry-level requirements for this role.`;
  }

  // Step 2: Extract structured JSON from the prose research text.
  try {
    const extractResponse = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.1,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: EXTRACTION_SYSTEM_PROMPT },
        {
          role: "user",
          content: `Research text:\n\n${researchText}\n\nExtract the JSON now.`,
        },
      ],
    });

    const raw = extractResponse.choices[0]?.message?.content?.trim() ?? "";
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    return {
      rawInput: roleInput,
      roleSummary: String(parsed.roleSummary ?? `Entry-level ${roleInput} role`),
      requiredSkills: Array.isArray(parsed.requiredSkills)
        ? parsed.requiredSkills.map(String).slice(0, 8)
        : [],
      entryLevelSignals: Array.isArray(parsed.entryLevelSignals)
        ? parsed.entryLevelSignals.map(String).slice(0, 4)
        : [],
      typicalTimeline: String(parsed.typicalTimeline ?? "12–18 months"),
      source,
    };
  } catch (err) {
    // Extraction failed — return a minimal fallback so plan generation
    // can still proceed with something rather than erroring entirely.
    console.warn(
      "[roleResearch] Extraction failed, returning minimal context:",
      err,
    );
    return {
      rawInput: roleInput,
      roleSummary: `Entry-level ${roleInput} position.`,
      requiredSkills: [],
      entryLevelSignals: [],
      typicalTimeline: "12–18 months",
      source: "llm_fallback",
    };
  }
}
