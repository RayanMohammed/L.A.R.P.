"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { t } from "@/lib/i18n/translations";
import { CAREER_FIELDS, type FieldId } from "@/lib/plan/fields";

type StepRoleProps = {
  initialFieldId: FieldId | null;
  onSubmit: (value: { fieldId: FieldId }) => void;
};

export function StepRole({
  initialFieldId,
  onSubmit,
}: StepRoleProps) {
  const [fieldId, setFieldId] = useState<FieldId | null>(initialFieldId);

  const canContinue = Boolean(fieldId);

  return (
    <section className="w-full flex-1 space-y-8">
      <header className="space-y-3">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          Step 01 / Target
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          {t("step1Heading")}
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-muted-strong">
          Pick the broad lane that feels closest. You can specialize later; this
          just shapes the questions and dashboard.
        </p>
      </header>

      <ul className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAREER_FIELDS.map((field) => {
          const selected = fieldId === field.id;
          return (
            <li key={field.id}>
              <button
                type="button"
                onClick={() => {
                  setFieldId(field.id);
                }}
                aria-pressed={selected}
                className={[
                  "min-h-52 w-full border bg-panel px-5 py-5 text-left transition-colors sm:min-h-56",
                  "hover:border-cyber hover:bg-surface-2",
                  selected
                    ? "border-cyber bg-cyber-dim shadow-[0_0_18px_rgba(100,149,237,0.18)]"
                    : "border-border",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-medium text-foreground">
                    {field.name}
                  </span>
                  <span className="font-label text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {field.sampleRoles.length} paths
                  </span>
                </div>
                <p className="mt-4 text-sm capitalize leading-relaxed text-muted">
                  {field.summary}
                </p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {field.sampleRoles.slice(0, 3).map((role) => (
                    <li
                      key={role}
                      className="border border-border bg-bg/40 px-2.5 py-1 font-mono text-[10px] capitalize text-muted-strong"
                    >
                      {role}
                    </li>
                  ))}
                </ul>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!canContinue}
          onClick={() => {
            if (fieldId) onSubmit({ fieldId });
          }}
        >
          Continue →
        </Button>
      </div>
    </section>
  );
}
