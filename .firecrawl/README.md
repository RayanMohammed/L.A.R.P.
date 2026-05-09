# API references

Live scrapes via `firecrawl` were skipped because authentication requires
interactive browser auth that we couldn't complete during the autonomous build.
The notes below capture the response/request shapes Person B needs to wire
real services. The `lib/server/stubs.ts` mocks already match these shapes so
swapping is mechanical.

To run real scrapes later:

```bash
npx firecrawl-cli login --browser
npx firecrawl-cli scrape https://developer.adzuna.com/docs/search -o .firecrawl/adzuna-search.md
npx firecrawl-cli scrape https://docs.mapbox.com/mapbox-gl-js/example/heatmap-layer -o .firecrawl/mapbox-heatmap.md
npx firecrawl-cli scrape https://console.groq.com/docs/text-chat -o .firecrawl/groq-chat.md
```

## Adzuna jobs search (Person B → `app/api/skills/extract` and `app/api/regions`)

`GET https://api.adzuna.com/v1/api/jobs/{country}/search/{page}?app_id=...&app_key=...&where=Phoenix&results_per_page=50`

Response (relevant fields):

```jsonc
{
  "results": [
    {
      "id": "1234567890",
      "title": "Backend Engineer",
      "company": { "display_name": "Brightline" },
      "location": { "area": ["US", "Arizona", "Phoenix"], "display_name": "Phoenix, AZ" },
      "description": "We are looking for a backend engineer with FastAPI...",
      "redirect_url": "https://www.adzuna.com/...",
      "created": "2026-05-08T12:34:56Z",
      "salary_min": 95000,
      "salary_max": 130000,
      "category": { "tag": "it-jobs", "label": "IT Jobs" }
    }
  ],
  "count": 4321
}
```

NLP step: run spaCy / phrase-matcher over `description` to extract canonical
skill ids (the same ids in `lib/mock/skills.ts`). Aggregate per `metroId`.

## Mapbox heatmap layer (already wired in the UI)

The heatmap layer config lives in `components/map/MapHeatmap.tsx`. Source data
is the GeoJSON FeatureCollection from `lib/heatmap.ts`, with `intensity`
(0..1) used for `heatmap-weight` and a heat ramp from indigo → teal → amber →
coral.

## Groq chat completions (Person B → `app/api/roadmap`)

`POST https://api.groq.com/openai/v1/chat/completions`

Request:

```jsonc
{
  "model": "llama-3.3-70b-versatile",
  "messages": [
    { "role": "system", "content": "You are L.A.R.P. Output a 14-day plan as JSON matching the Roadmap type. Use only free resources. Cite the metro and weekly posting count for each ranked skill." },
    { "role": "user", "content": "Profile: {...}\nLive demand snapshot: {...}" }
  ],
  "response_format": { "type": "json_object" }
}
```

The stub in `lib/server/stubs.ts::generateRoadmap` already emits the exact
`Roadmap` shape from `lib/types.ts`. Person B should validate the LLM JSON
against `Roadmap` (e.g. with zod) before returning.

## Supabase (anonymous aggregates only)

Table `skill_demand_weekly`:

| col | type | notes |
| --- | --- | --- |
| skill_id | text | matches `lib/mock/skills.ts` ids |
| metro_id | text | matches `lib/mock/metros.ts` ids |
| week_start | date | ISO Monday |
| postings | int | count |
| velocity_wow | numeric | 0..1, can be negative |

RLS: anon read-only on this table. No PII anywhere. Service role key only
used by Person B's ingestion worker.
