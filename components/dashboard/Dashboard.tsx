"use client";

import { ResumeBuilder } from "@/components/dashboard/ResumeBuilder";
import { SkillsRadar } from "@/components/dashboard/SkillsRadar";
import { Button } from "@/components/ui/Button";
import { type Language, t, tResourceType } from "@/lib/i18n/translations";
import type { CareerField } from "@/lib/plan/fields";
import type { PlanResponse } from "@/lib/plan/types";

type DashboardProps = {
  field: CareerField | undefined;
  plan: PlanResponse;
  selectedSkills: string[];
  context: string;
  language?: Language;
  onStartOver: () => void;
};

export function Dashboard({
  field,
  plan,
  selectedSkills,
  context,
  language = "en",
  onStartOver,
}: DashboardProps) {
  return (
    <section className="w-full flex-1 space-y-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="md" onClick={onStartOver}>
          {t("planStartOver", language)}
        </Button>
        <Button variant="outline" size="md" onClick={() => window.print()}>
          {t("planPrint", language)}
        </Button>
      </div>

      <header className="space-y-3">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          {t("dashboardSectionEyebrow", language)}
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {field?.name ?? plan.archetype.name}
        </h2>
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-muted-strong">
          {field?.summary ?? plan.archetype.summary}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.25fr)_minmax(22rem,0.75fr)]">
        <WeeklyPlan plan={plan} language={language} />

        <aside className="space-y-4">
          <IndustrySkills
            field={field}
            plan={plan}
            selectedSkills={selectedSkills}
            language={language}
          />
          <SelectedInputs
            selectedSkills={selectedSkills}
            context={context}
            language={language}
          />
        </aside>
      </div>

      <ResumeBuilder
        field={field}
        plan={plan}
        selectedSkills={selectedSkills}
        context={context}
        language={language}
      />
    </section>
  );
}

function WeeklyPlan({
  plan,
  language,
}: {
  plan: PlanResponse;
  language: Language;
}) {
  return (
    <article className="print-card w-full space-y-6 border border-border bg-panel p-6 sm:p-8">
      <header className="space-y-2 border-b border-border pb-5">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          {t("planEyebrow", language)}
        </p>
        <h3 className="text-2xl font-semibold tracking-tight text-foreground">
          {plan.archetype.name}
        </h3>
        <p className="pt-2 text-base leading-relaxed text-muted-strong">
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
                {tResourceType(item.resource.type, language)}
              </span>
            </div>

            <dl className="mt-4 space-y-3 text-sm leading-relaxed">
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t("planGap", language)}
                </dt>
                <dd className="text-foreground/85">{item.gap}</dd>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t("planSkill", language)}
                </dt>
                <dd className="text-foreground/85">{item.skillBuilt}</dd>
              </div>
              <div className="grid grid-cols-[88px_1fr] gap-x-3">
                <dt className="font-label text-[10px] font-bold uppercase tracking-wider text-muted">
                  {t("planUnlocks", language)}
                </dt>
                <dd className="text-foreground/85">{item.jobUnlocked}</dd>
              </div>
            </dl>

            <div className="mt-4 border border-cyber/40 bg-cyber-dim/60 p-3 text-sm text-cyber-bright">
              <span className="mr-2 font-label text-[10px] font-bold uppercase tracking-wider text-cyber">
                {t("planDoThisWeek", language)}
              </span>
              {item.thisWeekAction}
            </div>
          </li>
        ))}
      </ol>

      <footer className="border-t border-border pt-4 font-mono text-[11px] text-muted">
        {t("planFooterPrefix", language)} {plan.model} ·{" "}
        {new Date(plan.generatedAtMs).toLocaleString(
          language === "es" ? "es-ES" : "en-US",
        )}
      </footer>
    </article>
  );
}

function IndustrySkills({
  field,
  plan,
  selectedSkills,
  language,
}: {
  field: CareerField | undefined;
  plan: PlanResponse;
  selectedSkills: string[];
  language: Language;
}) {
  const skills = field?.topIndustrySkills ?? plan.archetype.summary.split(", ");
  const showRadar =
    field?.topIndustrySkills && field.topIndustrySkills.length >= 3;

  return (
    <section className="space-y-4 border border-border bg-panel p-5">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-cyber">
        {t("dashboardTopIndustrySkills", language)}
      </p>

      {showRadar ? (
        <SkillsRadar
          industrySkills={field.topIndustrySkills}
          selectedSkills={selectedSkills}
          language={language}
        />
      ) : null}

      <ul className="grid gap-2">
        {skills.map((skill) => (
          <li
            key={skill}
            className="border border-border bg-bg/40 px-3 py-2 font-mono text-xs capitalize text-muted-strong"
          >
            {toTitleCase(skill)}
          </li>
        ))}
      </ul>
    </section>
  );
}

function SelectedInputs({
  selectedSkills,
  context,
  language,
}: {
  selectedSkills: string[];
  context: string;
  language: Language;
}) {
  return (
    <section className="border border-border bg-panel p-5">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-cyber">
        {t("dashboardResumeInputs", language)}
      </p>
      {selectedSkills.length > 0 ? (
        <ul className="mt-4 flex flex-wrap gap-2">
          {selectedSkills.map((skill) => (
            <li
              key={skill}
              className="border border-cyber/40 bg-cyber-dim/50 px-3 py-1.5 font-mono text-xs capitalize text-cyber-bright"
            >
              {toTitleCase(skill)}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 font-mono text-sm text-muted">
          {t("dashboardNoChipsSelected", language)}
        </p>
      )}
      {context ? (
        <p className="mt-4 border-t border-border pt-4 font-mono text-xs leading-relaxed text-muted">
          {context}
        </p>
      ) : null}
    </section>
  );
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((word) =>
      word.length > 3
        ? `${word.charAt(0).toUpperCase()}${word.slice(1)}`
        : word,
    )
    .join(" ");
}
