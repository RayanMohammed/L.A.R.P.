"use client";

import { ResumeBuilder } from "@/components/dashboard/ResumeBuilder";
import { Button } from "@/components/ui/Button";
import type { CareerField } from "@/lib/plan/fields";
import type { PlanResponse } from "@/lib/plan/types";

type DashboardProps = {
  field: CareerField | undefined;
  plan: PlanResponse;
  selectedSkills: string[];
  context: string;
  onStartOver: () => void;
};

const RESOURCE_TYPE_LABEL: Record<string, string> = {
  club: "Club",
  research: "Research",
  workshop: "Workshop",
  "internship-lite": "Internship-lite",
  incubator: "Incubator",
  program: "Program",
};

export function Dashboard({
  field,
  plan,
  selectedSkills,
  context,
  onStartOver,
}: DashboardProps) {
  return (
    <section className="w-full flex-1 space-y-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="md" onClick={onStartOver}>
          ← Start over
        </Button>
        <Button variant="outline" size="md" onClick={() => window.print()}>
          Print
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          Dashboard
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {field?.name ?? plan.archetype.name}
        </h2>
        <p className="max-w-3xl font-mono text-sm capitalize leading-relaxed text-muted-strong">
          {field?.summary ?? plan.archetype.summary}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <WeeklyPlan plan={plan} />

        <aside className="space-y-4">
          <IndustrySkills field={field} plan={plan} />
          <SelectedInputs selectedSkills={selectedSkills} context={context} />
        </aside>
      </div>

      <ResumeBuilder
        field={field}
        plan={plan}
        selectedSkills={selectedSkills}
        context={context}
      />
    </section>
  );
}

function WeeklyPlan({ plan }: { plan: PlanResponse }) {
  return (
    <article className="print-card w-full space-y-6 border border-border bg-panel p-6 sm:p-8">
      <header className="space-y-2 border-b border-border pb-5">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          This week — your plan
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {plan.archetype.name}
        </h3>
        <p className="pt-2 text-base capitalize leading-relaxed text-muted-strong">
          {plan.summary}
        </p>
      </header>

      <ol className="space-y-5">
        {plan.actionItems.map((item) => (
          <li
            key={`${item.rank}-${item.resource.id}`}
            className="border border-border bg-bg/40 p-4 sm:p-5"
          >
            <div className="flex flex-wrap items-baseline gap-3">
              <span className="font-mono text-sm font-semibold text-cyber">
                {String(item.rank).padStart(2, "0")}
              </span>
              <a
                href={item.resource.url}
                target="_blank"
                rel="noreferrer"
                className="text-base font-semibold text-foreground underline decoration-cyber/40 underline-offset-4 hover:decoration-cyber"
              >
                {item.resource.name}
              </a>
              <span className="ml-auto border border-border px-2 py-0.5 font-label text-[10px] font-semibold uppercase tracking-wider text-muted">
                {RESOURCE_TYPE_LABEL[item.resource.type] ?? item.resource.type}
              </span>
            </div>

            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  Gap
                </dt>
                <dd className="capitalize text-foreground/85">{item.gap}</dd>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  Skill
                </dt>
                <dd className="capitalize text-foreground/85">{item.skillBuilt}</dd>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  Unlocks
                </dt>
                <dd className="capitalize text-foreground/85">{item.jobUnlocked}</dd>
              </div>
            </dl>

            <div className="mt-4 border border-cyber/40 bg-cyber-dim/60 p-3 text-sm capitalize text-cyber-bright">
              <span className="mr-2 font-label text-[10px] font-bold uppercase tracking-wider text-cyber">
                Do this week →
              </span>
              {item.thisWeekAction}
            </div>
          </li>
        ))}
      </ol>

      <footer className="border-t border-border pt-4 font-mono text-[11px] text-muted">
        Generated by L.A.R.P. with {plan.model} ·{" "}
        {new Date(plan.generatedAtMs).toLocaleString()}
      </footer>
    </article>
  );
}

function IndustrySkills({
  field,
  plan,
}: {
  field: CareerField | undefined;
  plan: PlanResponse;
}) {
  const skills = field?.topIndustrySkills ?? plan.archetype.summary.split(", ");

  return (
    <section className="border border-border bg-panel p-5">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-cyber">
        Top skills in industry
      </p>
      <ul className="mt-4 grid gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="border border-border bg-bg/40 px-3 py-2 font-mono text-xs capitalize text-muted-strong"
          >
            {skill}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SelectedInputs({
  selectedSkills,
  context,
}: {
  selectedSkills: string[];
  context: string;
}) {
  return (
    <section className="border border-border bg-panel p-5">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-cyber">
        Resume inputs
      </p>
      {selectedSkills.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <li
              key={skill}
              className="border border-cyber/40 bg-cyber-dim/50 px-3 py-1.5 font-mono text-xs capitalize text-cyber-bright"
            >
              {skill}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-mono text-sm text-muted">
          No chips selected yet. The resume builder will still give you a
          starter template.
        </p>
      )}
      {context ? (
        <p className="mt-4 border-t border-border pt-4 font-mono text-xs capitalize leading-relaxed text-muted">
          {context}
        </p>
      ) : null}
    </section>
  );
}
