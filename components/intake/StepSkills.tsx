"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { tSkillOption } from "@/lib/i18n/dataTranslations";
import {
  type Language,
  t,
  tSkillGroupLabel,
  type TranslationKey,
} from "@/lib/i18n/translations";
import type { FieldId } from "@/lib/plan/fields";
import { getSkillGroupsForField } from "@/lib/plan/skillOptions";

const QUICK_CONTEXT_CHIPS = [
  "chipSwitchingMajors",
  "chipTransfer",
  "chipFirstGen",
  "chipWorkingPartTime",
] as const satisfies readonly TranslationKey[];

type StepSkillsProps = {
  initialSkills: string[];
  initialContext: string;
  language?: Language;
  fieldId?: FieldId | null;
  onBack: () => void;
  onSubmit: (value: { skills: string[]; context: string }) => void;
};

export function StepSkills({
  initialSkills,
  initialContext,
  language = "en",
  fieldId = null,
  onBack,
  onSubmit,
}: StepSkillsProps) {
  const [selected, setSelected] = useState<Set<string>>(
    new Set(initialSkills),
  );
  const [context, setContext] = useState(initialContext);
  // Skill groups follow the chosen field. Free-text role → null → falls back
  // to the default field's groups + shared groups inside getSkillGroupsForField.
  const skillGroups = getSkillGroupsForField(fieldId);

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
      <header className="space-y-4">
        <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-cyber">
          {t("step2Eyebrow", language)}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("step2Heading", language)}
        </h2>
        <p className="max-w-3xl font-mono text-base leading-relaxed text-muted-strong">
          {t("step2Subheading", language)}
        </p>
      </header>

      <div className="space-y-6">
        {skillGroups.map((group) => (
          <fieldset key={group.label} className="space-y-3">
            <legend className="font-label text-xs font-bold uppercase tracking-[0.18em] text-muted-strong">
              {tSkillGroupLabel(group.label, language)}
            </legend>
            <div className="flex flex-wrap gap-2.5">
              {group.options.map((option) => {
                const on = selected.has(option);
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => toggle(option)}
                    aria-pressed={on}
                    className={[
                      "border px-4 py-2 font-mono text-sm transition-colors",
                      on
                        ? "border-cyber bg-cyber-dim text-cyber-bright"
                        : "border-border bg-panel text-muted-strong hover:border-cyber/60 hover:text-foreground",
                    ].join(" ")}
                  >
                    {tSkillOption(option, language)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
      </div>

      <div className="space-y-2">
        <span className="font-label text-xs font-bold uppercase tracking-[0.18em] text-muted-strong">
          {t("quickContextLabel", language)}
        </span>
        <div className="flex flex-wrap gap-2.5">
          {QUICK_CONTEXT_CHIPS.map((key) => {
            const label = t(key, language);
            const active = context.includes(label);
            return (
              <button
                key={key}
                type="button"
                onClick={() => toggleContextChip(label)}
                aria-pressed={active}
                className={[
                  "border px-4 py-2 font-mono text-sm transition-colors",
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
        <span className="font-label text-xs font-bold uppercase tracking-[0.18em] text-muted-strong">
          {t("contextLabel", language)}
        </span>
        <textarea
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder={t("contextPlaceholder", language)}
          rows={3}
          className="w-full resize-y border border-border bg-panel p-4 font-mono text-base text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
        />
      </label>

      <div className="flex items-center justify-between">
        <Button variant="ghost" size="md" onClick={onBack}>
          {t("step2Back", language)}
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
          {t("step2GeneratePlan", language)}
        </Button>
      </div>
    </section>
  );
}
