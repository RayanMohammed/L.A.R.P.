import type { ReactNode } from "react";
import { tArchetypeName } from "@/lib/i18n/dataTranslations";
import { type Language, t, tResourceType } from "@/lib/i18n/translations";
import type { PlanResponse } from "@/lib/plan/types";

type DashboardPlaceholderProps = {
  plan: PlanResponse;
  language?: Language;
};

const LATEX_RESUME_STUB = String.raw`\section{Projects}
\resumeItem{Campus action plan for <target role>}
  {Built early experience through a UCSD resource, practiced a target skill, and documented the outcome.}`;

export function DashboardPlaceholder({
  plan,
  language = "en",
}: DashboardPlaceholderProps) {
  const skills = Array.from(new Set(plan.actionItems.map((item) => item.skillBuilt))).slice(0, 6);
  const locations = Array.from(
    new Map(plan.actionItems.map((item) => [item.resource.id, item.resource])).values(),
  ).slice(0, 4);

  return (
    <section className="w-full space-y-6 border border-cyber/30 bg-panel/70 p-5 sm:p-6">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-border pb-4">
        <div className="space-y-2">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
            {t("dashboardEyebrow", language)}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            {t("dashboardHeadingPrefix", language)} {tArchetypeName(plan.archetype, language)}
          </h2>
          <p className="max-w-3xl font-mono text-sm leading-relaxed text-muted-strong">
            {t("dashboardSubheading", language)}
          </p>
        </div>
        <span className="border border-border px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted">
          {t("dashboardReplaceMe", language)}
        </span>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4">
        <DashboardPanel title={t("dashboardSkillsSnapshot", language)}>
          <ul className="space-y-2">
            {skills.map((skill) => (
              <li key={skill} className="border border-border bg-bg/40 px-3 py-2 text-sm text-muted-strong">
                {skill}
              </li>
            ))}
          </ul>
        </DashboardPanel>

        <DashboardPanel title={t("dashboardResumeBuilder", language)}>
          <p className="mb-3 text-sm leading-relaxed text-muted-strong">
            {t("dashboardResumeBuilderDescription", language)}
          </p>
          <pre className="overflow-x-auto border border-border bg-bg/60 p-3 font-mono text-[11px] leading-relaxed text-muted">
            <code>{LATEX_RESUME_STUB}</code>
          </pre>
        </DashboardPanel>

        <DashboardPanel title={t("dashboardLocations", language)}>
          <ul className="space-y-2">
            {locations.map((resource) => (
              <li key={resource.id} className="border border-border bg-bg/40 px-3 py-2">
                <p className="text-sm font-medium text-foreground">{resource.name}</p>
                <p className="font-label text-[10px] font-semibold uppercase tracking-wider text-muted">
                  {tResourceType(resource.type, language)}
                </p>
              </li>
            ))}
          </ul>
        </DashboardPanel>

        <DashboardPanel title={t("dashboardNextSteps", language)}>
          <ol className="space-y-2">
            {plan.actionItems.slice(0, 3).map((item) => (
              <li key={`${item.rank}-${item.thisWeekAction}`} className="border border-border bg-bg/40 px-3 py-2">
                <span className="font-mono text-xs text-cyber">
                  {String(item.rank).padStart(2, "0")}
                </span>
                <p className="mt-1 text-sm leading-relaxed text-muted-strong">
                  {item.thisWeekAction}
                </p>
              </li>
            ))}
          </ol>
        </DashboardPanel>
      </div>
    </section>
  );
}

function DashboardPanel({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="min-h-[220px] border border-border bg-bg/30 p-4">
      <h3 className="mb-4 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-cyber-bright">
        {title}
      </h3>
      {children}
    </article>
  );
}
