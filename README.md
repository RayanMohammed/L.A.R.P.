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
├── api/plan/route.ts          # POST /api/plan → validate request, call Groq, hydrate resources
├── globals.css                # Tailwind v4 theme tokens + global styles
├── layout.tsx                 # Root metadata and app shell
└── page.tsx                   # Home page that renders the intake flow
components/
├── intake/
│   ├── IntakeFlow.tsx         # 3-step client flow: role → skills/context → plan
│   ├── LoadingPlan.tsx        # Loading state while Groq generates a plan
│   ├── PlanCard.tsx           # Generated plan display
│   ├── Stepper.tsx            # Step indicator
│   ├── StepRole.tsx           # Target-role picker/free-text entry
│   └── StepSkills.tsx         # Current skills and context form
├── telemetry/
│   └── TelemetryAsciiBanner.tsx
└── ui/
    └── Button.tsx             # Shared button variants
lib/
├── i18n/
│   └── translations.ts        # UI copy keys for English/Spanish labels
├── plan/
│   ├── data/
│   │   ├── campusResources.json # Curated UCSD opportunities
│   │   └── jobArchetypes.json   # Entry-level role archetypes
│   ├── data.ts                # ARCHETYPES, RESOURCES + lookup helpers
│   ├── groq.ts                # Groq client and model configuration
│   ├── prompt.ts              # System/user prompts for /api/plan
│   ├── skillOptions.ts        # Skill-tag chips shown in step 2
│   └── types.ts               # Zod schemas + shared plan types
└── utils.ts                   # className merging and small UI helpers
next.config.ts                 # Next.js config
package.json                   # npm scripts and dependencies
postcss.config.mjs             # Tailwind/PostCSS setup
tsconfig.json                  # TypeScript config
```

## Scope honesty

UCSD-only data for the demo. Other campuses are a scaling consideration —
the architecture (archetypes × resources × Groq) generalises, but the
campus resource list is hand-curated per school.
