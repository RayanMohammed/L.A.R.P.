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
