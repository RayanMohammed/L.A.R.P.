import type { PlanRequest } from "./types";

/**
 * Best-effort PII stripping before user text is sent to Groq. Regex-based only;
 * does not catch names or gray-area identifiers.
 */
const EMAIL =
  /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
const PHONE =
  /\b(?:\+?\d{1,3}[-.\s()])?(?:\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/gi;

function applyRedactions(text: string): string {
  let s = text;
  s = s.replace(EMAIL, "[redacted]");
  s = s.replace(PHONE, "[redacted]");
  s = s.replace(/\b\d{9,}\b/g, "[redacted]");
  return s;
}

export function redactPii(text: string): string {
  return applyRedactions(text);
}

/** Sanitize request fields that are forwarded to LLMs or embeddings. */
export function redactPlanRequest(input: PlanRequest): PlanRequest {
  const next: PlanRequest = { ...input };

  if (next.targetRoleFreeText != null) {
    const r = applyRedactions(next.targetRoleFreeText).trim().slice(0, 280);
    next.targetRoleFreeText = r.length > 0 ? r : undefined;
  }
  if (next.context != null && next.context !== "") {
    const r = applyRedactions(next.context).trim().slice(0, 1500);
    next.context = r.length > 0 ? r : undefined;
  }
  next.currentSkills = next.currentSkills
    .map((s) => applyRedactions(s).trim().slice(0, 120))
    .filter((s) => s.length > 0);

  return next;
}
