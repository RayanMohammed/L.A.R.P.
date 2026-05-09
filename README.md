# L.A.R.P.

A career sandbox for first-year college students who don't have a resume yet.

The catch-22: every job filter assumes prior experience. L.A.R.P. inverts that.
Pick a role you might want in two years, tell it what you've done so far
(empty is valid), and it returns 3–5 specific things you can do **this week
on campus** that start building toward that role.

Powered by:

- Next.js 15 (App Router) + Tailwind v4
- Groq for inference (Llama 3.3 70B by default)
- Static JSON for job archetypes and curated UCSD campus resources
- No database, no accounts — session only

## Run it

```bash
cp .env.example .env.local   # paste your GROQ_API_KEY
npm install
npm run dev
```

Open <http://localhost:3000>.

## Layout

```
app/
├── api/plan/route.ts          # POST → Groq with the 4-step prompt chain
├── layout.tsx
├── globals.css
└── page.tsx                   # 3-step intake → plan card
components/
├── intake/                    # Stepper, StepRole, StepSkills, LoadingPlan, PlanCard, IntakeFlow
├── telemetry/                 # ASCII banner
└── ui/                        # Button
lib/
└── plan/
    ├── data.ts                # ARCHETYPES, RESOURCES + getters
    ├── data/
    │   ├── jobArchetypes.json   # 12 entry-level role archetypes
    │   └── campusResources.json # 18 curated UCSD opportunities
    ├── groq.ts                # Groq client + GROQ_MODEL
    ├── prompt.ts              # System + user prompt for /api/plan
    ├── skillOptions.ts        # Skill-tag chips shown in step 2
    └── types.ts               # Zod schemas + shared types
```

## Scope honesty

UCSD-only data for the demo. Other campuses are a scaling consideration —
the architecture (archetypes × resources × Groq) generalises, but the
campus resource list is hand-curated per school.
