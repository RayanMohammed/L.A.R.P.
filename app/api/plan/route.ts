import { NextResponse } from "next/server";
import { z } from "zod";
import { getArchetype, getResource, getTopResources } from "@/lib/plan/data";
import { GROQ_MODEL, getGroq } from "@/lib/plan/groq";
import { buildUserPrompt, SYSTEM_PROMPT } from "@/lib/plan/prompt";
import { researchFreeTextRole } from "@/lib/plan/roleResearch";
import { redactPlanRequest } from "@/lib/plan/redactPii";
import {
  type ActionItem,
  LlmPlanSchema,
  type PlanResponse,
  PlanRequestSchema,
} from "@/lib/plan/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let parsed;
  try {
    const body = await req.json();
    parsed = PlanRequestSchema.parse(body);
  } catch (err) {
    if (err instanceof z.ZodError) {
      return NextResponse.json(
        { error: "invalid_request", issues: err.issues },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: "invalid_json" },
      { status: 400 },
    );
  }

  const request = redactPlanRequest(parsed);
  if (!request.targetRoleId && !request.targetRoleFreeText?.trim()) {
    return NextResponse.json(
      { error: "target_text_only_sensitive_removed" },
      { status: 400 },
    );
  }

  const archetype = request.targetRoleId
    ? getArchetype(request.targetRoleId) ?? null
    : null;
  if (request.targetRoleId && !archetype) {
    return NextResponse.json(
      { error: "unknown_target_role", targetRoleId: request.targetRoleId },
      { status: 400 },
    );
  }

  let groq;
  try {
    groq = getGroq();
  } catch {
    return NextResponse.json(
      {
        error: "groq_not_configured",
        hint: "Set GROQ_API_KEY in .env.local",
      },
      { status: 503 },
    );
  }

  // If the student typed a free-text role with no archetype match, research
  // it with Compound Mini before building the plan prompt. This replaces
  // hallucinated requirements with real entry-level signals from the web.
  // Never throws — degrades to an LLM-only or minimal context on failure.
  const enrichedRole =
    !archetype && request.targetRoleFreeText
      ? await researchFreeTextRole(request.targetRoleFreeText)
      : null;

  // Pre-filter the resource catalog with semantic search so we only send the
  // top-k most relevant resources to Groq (large token saving as the catalog
  // grows). For free-text roles we use the enriched roleSummary as the query
  // — short raw inputs like "immigration paralegal" don't carry enough signal
  // for the embedding model on their own. Falls back to the full list on any
  // embedding failure.
  const roleDescription = archetype
    ? `${archetype.name}: ${archetype.summary}`
    : enrichedRole
      ? `${enrichedRole.rawInput}: ${enrichedRole.roleSummary}`
      : request.targetRoleFreeText ?? "";

  const filteredResources = await getTopResources({
    roleDescription,
    currentSkills: request.currentSkills,
    topK: 6,
  });

  const userPrompt = buildUserPrompt({
    request,
    archetype,
    enrichedRole,
    resources: filteredResources,
  });

  let completion;
  try {
    completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      temperature: 0.4,
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: userPrompt },
      ],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "groq_request_failed", detail: errorMessage(err) },
      { status: 502 },
    );
  }

  const raw = completion.choices?.[0]?.message?.content?.trim();
  if (!raw) {
    return NextResponse.json(
      { error: "empty_completion" },
      { status: 502 },
    );
  }

  let llmJson: unknown;
  try {
    llmJson = JSON.parse(raw);
  } catch {
    return NextResponse.json(
      { error: "invalid_json_from_model", raw },
      { status: 502 },
    );
  }

  const plan = LlmPlanSchema.safeParse(llmJson);
  if (!plan.success) {
    return NextResponse.json(
      {
        error: "model_output_schema_mismatch",
        issues: plan.error.issues,
        raw,
      },
      { status: 502 },
    );
  }

  // Hydrate resources from our local JSON so URLs/names are guaranteed correct,
  // and silently drop any items that reference an unknown resourceId.
  const seen = new Set<string>();
  const items: ActionItem[] = plan.data.actionItems
    .sort((a, b) => a.rank - b.rank)
    .flatMap((it) => {
      if (seen.has(it.resourceId)) return [];
      const resource = getResource(it.resourceId);
      if (!resource) return [];
      seen.add(it.resourceId);
      return [
        {
          rank: it.rank,
          gap: it.gap,
          resource,
          skillBuilt: it.skillBuilt,
          jobUnlocked: it.jobUnlocked,
          thisWeekAction: it.thisWeekAction,
        } satisfies ActionItem,
      ];
    })
    .slice(0, 5)
    .map((it, i) => ({ ...it, rank: i + 1 }));

  if (items.length === 0) {
    return NextResponse.json(
      {
        error: "no_valid_resources_in_plan",
        hint: "Model picked resourceIds that don't exist in campusResources.json.",
        raw,
      },
      { status: 502 },
    );
  }

  const response: PlanResponse = {
    archetype:
      archetype ?? {
        name: request.targetRoleFreeText ?? "Custom target role",
        summary: "Free-text target role provided by the student.",
      },
    summary: plan.data.summary,
    actionItems: items,
    model: GROQ_MODEL,
    generatedAtMs: Date.now(),
  };

  return NextResponse.json(response);
}

function errorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  return String(e);
}
