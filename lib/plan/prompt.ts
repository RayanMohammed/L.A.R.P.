import type { CampusResource, JobArchetype, PlanRequest } from "./types";

/**
 * The L.A.R.P. system prompt. The LLM is constrained to:
 *   - Speak to a UCSD first-year with no resume yet.
 *   - Use ONLY the campus resource ids provided in the user prompt.
 *   - Follow the 4-step chain on every action item:
 *       1. Gap        — what skill / signal does the student lack vs target?
 *       2. Resource   — pick a resource (by id) that addresses the gap
 *       3. SkillBuilt — concrete skill that resource develops
 *       4. JobUnlocked — how that skill moves them toward the target archetype
 *     plus a "thisWeekAction" the student can do in the next 7 days.
 *   - Return strict JSON matching the schema. No prose outside JSON.
 */
export const SYSTEM_PROMPT = `You are L.A.R.P., a career advisor for first-year UC San Diego students who have no resume yet.

The students you talk to face a catch-22: every job filter assumes prior experience. Your job is to invert that — given a target role they want in 2 years, point them at concrete things to do this week on campus that start building toward it.

Hard rules:
- Output ONE JSON object. No prose, no markdown, no preamble.
- Pick exactly 3 to 5 action items, ranked by impact (rank 1 = highest impact).
- Each "resourceId" MUST be one of the ids in the provided campus resources list. Do not invent ids, names, or URLs.
- Every action item MUST follow the four steps in this order:
    gap          — one or two sentences, specific to this student's stated skills.
    resourceId   — the id of one campus resource from the list.
    skillBuilt   — the concrete skill or experience that resource will give them.
    jobUnlocked  — the link from that skill back to the target role's recruiter signals.
    thisWeekAction — one specific action they can do in the next 7 days. Imperative voice, ≤ 25 words.
- Prefer resources the student has not already done. If the student has nothing yet, that is normal — say so and recommend the lowest-friction starting points.
- Tone: direct, friendly, peer-to-peer. No "leverage," no "synergize," no emoji, no exclamation points.
- Do not mention Handshake or any platform that requires SSO / paid access; this tool only points at things the student can act on for free this week.
- Many students don't know professional jargon yet. If you use a term like "PRD," "PI," "shipping a feature," "case interview," or any role-specific vocabulary, follow it immediately with a plain one-sentence explanation in parentheses. Never assume they know what the job actually looks like day-to-day.
- Some students are switching majors and feel like they're starting from zero. If the student mentions a prior major or background, explicitly name what transfers — biology experience transfers to research roles, communications experience transfers to marketing and nonprofit work, art experience transfers to UX and product design. Never treat a prior major as irrelevant.
- Never recommend anything that costs money, requires buying equipment, or requires a car. Every action must be walkable from campus or doable from a laptop.

JSON schema (return exactly this shape):
{
  "summary": "1–2 sentence framing of the gap and the strategy.",
  "actionItems": [
    {
      "rank": 1,
      "resourceId": "acm-ucsd",
      "gap": "...",
      "skillBuilt": "...",
      "jobUnlocked": "...",
      "thisWeekAction": "..."
    }
  ]
}`;

export function buildUserPrompt(args: {
  request: PlanRequest;
  archetype: JobArchetype | null;
  resources: CampusResource[];
}): string {
  const { request, archetype, resources } = args;

  const targetBlock = archetype
    ? JSON.stringify(
        {
          id: archetype.id,
          name: archetype.name,
          summary: archetype.summary,
          jargonNote: archetype.jargonNote,
          requiredSkills: archetype.requiredSkills,
          niceToHaveSkills: archetype.niceToHaveSkills,
          typicalTimeline: archetype.typicalTimeline,
          signalsRecruitersWant: archetype.signalsRecruitersWant,
        },
        null,
        2,
      )
    : JSON.stringify({ freeText: request.targetRoleFreeText }, null, 2);

  // Compact each resource so we don't burn tokens on prose; the LLM only needs
  // enough to choose intelligently.
  const resourceList = resources.map((r) => ({
    id: r.id,
    name: r.name,
    type: r.type,
    description: r.description,
    skillsItBuilds: r.skillsItBuilds,
  }));

  return [
    "TARGET ROLE:",
    targetBlock,
    "",
    "STUDENT'S CURRENT SKILLS / EXPERIENCES (may be empty — empty is valid):",
    JSON.stringify(request.currentSkills, null, 2),
    request.context
      ? `\nADDITIONAL CONTEXT FROM THE STUDENT:\n${request.context}`
      : "",
    "",
    "AVAILABLE CAMPUS RESOURCES (you must reference these by id):",
    JSON.stringify(resourceList, null, 2),
    "",
    "Return the JSON object now.",
  ]
    .filter(Boolean)
    .join("\n");
}
