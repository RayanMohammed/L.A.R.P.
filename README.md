# L.A.R.P.

A career sandbox for first-year college students who don't have a resume yet.

The catch-22: every job filter assumes prior experience. L.A.R.P. inverts that.
Pick a direction you might want in a couple of years, say what you've done so far
(empty is valid), and get **3–5 concrete things you can do this week on campus**
that start building toward that path.

## Stack

- **Next.js 15** (App Router) + **React 19** + **Tailwind v4**
- **Groq** — plan generation (default **Llama 3.3 70B**); **Compound Mini** may run **web search** when the student describes a custom role in free text
- **@xenova/transformers** (server-only) — precomputed resource embeddings to shortlist campus resources before the LLM call
- **Static JSON** — job archetypes and curated **UCSD** campus resources
- **No database, no accounts** — intake lives in browser state until you generate a plan

## Features (current)

- **Landing** (`/`) — entry + language; **intake & dashboard** (`/plan`, optional `?lang=en|es`).
- **Step 1 — six tracks** — Finance, Data, Software Engineering, Hardware, Outreach, Bioengineering (`lib/plan/fields.ts`); each maps to a default archetype for prompts. Optional free-text role if nothing fits.
- **Step 2 — field-tuned skill chips** — “describe you” chips first, then track-specific groups + shared transferable / “not sure” chips; optional context textarea.
- **Step 3 — plan + dashboard** — ranked action items with campus resources; **SkillsRadar** (industry vs selected chips); **ResumeBuilder** (LaTeX / PDF path).
- **English / Spanish** — UI via `lib/i18n/translations.ts`, field cards via `fieldTranslations.ts`, skill chips in `dataTranslations.ts` where needed.
- **Privacy (practical, not cryptographic)** — **`PrivacyGuardrails`** + short hint next to free-text fields; **`lib/plan/redactPii.ts`** scrubs obvious emails, phone-shaped strings, and long digit runs on the server **before** Groq/embeddings. Users can still type identifying prose; Groq's policies apply to what is sent after redaction.

## Run it

```bash
cp .env.example .env.local   # add GROQ_API_KEY
npm install
npm run dev
```

Open <http://localhost:3000> and use **START** to open `/plan`.

## Repo layout (abbreviated)

```
app/
├── page.tsx                  # Landing
├── plan/page.tsx             # Suspense-wrapped IntakeFlow
├── api/plan/route.ts         # POST: validate → redact → Groq → hydrate resources
├── layout.tsx
└── globals.css
components/
├── intake/                   # IntakeFlow, StepRole, StepSkills, PlanCard, PrivacyGuardrails, …
├── dashboard/                # Dashboard, SkillsRadar, ResumeBuilder, …
├── i18n/LanguageSwitcher.tsx
├── telemetry/TelemetryAsciiBanner.tsx   # decorative “brand” only, not analytics
└── ui/Button.tsx
lib/
├── i18n/                     # translations, fieldTranslations, dataTranslations
└── plan/
    ├── catalog.ts            # Archetype/resource JSON; split from data.ts so client bundles skip embeddings
    ├── data.ts               # getTopResources + embeddings (server path)
    ├── embeddings.ts         # similarity over resourceEmbeddings.json
    ├── fields.ts             # CAREER_FIELDS (tracks) + skill group labels
    ├── redactPii.ts          # server-side scrub before LLM
    ├── prompt.ts, groq.ts, roleResearch.ts, skillOptions.ts, types.ts
    └── data/
        ├── campusResources.json
        ├── jobArchetypes.json
        └── resourceEmbeddings.json   # generated: npm run generate:embeddings
scripts/generateEmbeddings.ts
```

## Scope honesty

UCSD-only resource data in this repo. The pattern (tracks × archetypes × resources × LLM) generalises; another school needs its own curated `campusResources.json` (and regenerated embeddings if you keep semantic pre-filtering).
