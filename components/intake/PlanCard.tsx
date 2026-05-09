"use client";

import { Button } from "@/components/ui/Button";
import {
  tArchetypeName,
  tArchetypeSummary,
} from "@/lib/i18n/dataTranslations";
import { type Language, t, tResourceType } from "@/lib/i18n/translations";
import type { PlanResponse } from "@/lib/plan/types";

type PlanCardProps = {
  plan: PlanResponse;
  language?: Language;
  onStartOver: () => void;
};

export function PlanCard({ plan, language = "en", onStartOver }: PlanCardProps) {
  return (
    <section className="w-full flex-1 space-y-8">
      <div className="no-print flex flex-wrap items-center justify-between gap-3">
        <Button variant="ghost" size="md" onClick={onStartOver}>
          {t("planStartOver", language)}
        </Button>
        <Button
          variant="outline"
          size="md"
          onClick={() => window.print()}
        >
          {t("planPrint", language)}
        </Button>
      </div>

      <article className="print-card w-full space-y-6 border border-border bg-panel p-6 sm:p-8">
        <header className="space-y-2 border-b border-border pb-5">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
            {t("planEyebrow", language)}
          </p>
          <h2 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {tArchetypeName(plan.archetype, language)}
          </h2>
          {plan.archetype.summary ? (
            <p className="font-mono text-sm text-muted">
              {tArchetypeSummary(plan.archetype, language)}
            </p>
          ) : null}
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
    </section>
  );
}
