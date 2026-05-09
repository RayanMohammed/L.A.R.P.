import Groq from "groq-sdk";

let client: Groq | null = null;

export function getGroq(): Groq {
  if (client) return client;
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable");
  }
  client = new Groq({ apiKey });
  return client;
}

/** Default model is overridable via env so we can swap as Groq's lineup changes. */
export const GROQ_MODEL = process.env.GROQ_MODEL ?? "llama-3.3-70b-versatile";

/**
 * Compound Mini — Groq's web-search-enabled model used to research
 * free-text roles before plan generation. Single tool call, ~3x lower
 * latency than full Compound, same SDK + base URL as GROQ_MODEL.
 */
export const COMPOUND_MINI_MODEL = "groq/compound-mini";
