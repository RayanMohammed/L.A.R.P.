"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { t, type TranslationKey } from "@/lib/i18n/translations";
import { SKILL_GROUPS } from "@/lib/plan/skillOptions";

const QUICK_CONTEXT_CHIPS = [
  "chipSwitchingMajors",
  "chipTransfer",
  "chipFirstGen",
  "chipWorkingPartTime",
] as const satisfies readonly TranslationKey[];

type StepSkillsProps = {
  initialSkills: string[];
  initialContext: string;
  onBack: () => void;
  onSubmit: (value: { skills: string[]; context: string }) => void;
};

export function StepSkills({
  initialSkills,
  initialContext,
  onBack,
  onSubmit,
}: StepSkillsProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSkills),
  );
  const [context, setContext] = useState(initialContext);

  function toggle(value: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function toggleContextChip(label: string) {
    setContext((prev) =>
      prev.includes(label)
        ? prev
            .replace(label, "")
            .replace(/,\s*,/, ",")
            .replace(/^,\s*|,\s*$/g, "")
            .trim()
        : prev.trim()
          ? `${prev.trim()}, ${label}`
          : label,
    );
  }

  return (
    <section className="w-full flex-1 space-y-8">
      <header className="space-y-3">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          Step 02 / Inputs
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What have you done so far?
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-muted-strong">
          Tap anything that&apos;s true. Nothing yet is a real answer — first
          quarter is allowed to be empty.
        </p>
      </header>

      <div className="space-y-6">
        {SKILL_GROUPS.map((group) => (
          <fieldset key={group.label} className="space-y-3">
            <legend className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
              {group.label}
            </legend>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const on = selected.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    aria-pressed={on}
                    className={[
                      "border px-3 py-1.5 font-mono text-xs transition-colors",
                      on
                        ? "border-cyber bg-cyber-dim text-cyber-bright"
                        : "border-border bg-panel text-muted-strong hover:border-cyber/60 hover:text-foreground",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="space-y-2">
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
          {t("quickContextLabel")}
        </span>
        <div className="flex flex-wrap gap-2">
          {QUICK_CONTEXT_CHIPS.map((key) => {
            const label = t(key);
            const active = context.includes(label);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleContextChip(label)}
                aria-pressed={active}
                className={[
                  "border px-3 py-1.5 font-mono text-xs transition-colors",
                  active
                    ? "border-cyber bg-cyber-dim text-cyber-bright"
                    : "border-border bg-panel text-muted-strong hover:border-cyber/60 hover:text-foreground",
                ].join(" ")}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <label className="block space-y-2">
        <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
          {t("contextLabel")}
        </span>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t("contextPlaceholder")}
          rows={3}
          className="w-full resize-y border border-border bg-panel p-3 font-mono text-sm text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>
          ← Back
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() =>
            onSubmit({
              skills: Array.from(selected),
              context: context.trim(),
            })
          }
        >
          Generate plan →
        </Button>
      </div>
    </section>
  );
}
