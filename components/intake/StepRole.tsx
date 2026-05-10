"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { tCareerFieldCard } from "@/lib/i18n/fieldTranslations";
import { type Language, t } from "@/lib/i18n/translations";
import { CAREER_FIELDS, type CareerField } from "@/lib/plan/fields";

type StepRoleProps = {
  initialRoleId: string | null;
  initialFreeText: string;
  language?: Language;
  onSubmit: (value: { roleId: string | null; freeText: string }) => void;
};

function isTrackSelected(field: CareerField, roleId: string | null): boolean {
  if (!roleId) return false;
  return (
    field.defaultArchetypeId === roleId ||
    field.relatedArchetypeIds.includes(roleId)
  );
}

export function StepRole({
  initialRoleId,
  initialFreeText,
  language = "en",
  onSubmit,
}: StepRoleProps) {
  const [roleId, setRoleId] = useState<string | null>(initialRoleId);
  const [freeText, setFreeText] = useState(initialFreeText);
  const [showFreeText, setShowFreeText] = useState(Boolean(initialFreeText));

  const canContinue = Boolean(roleId) || freeText.trim().length > 2;

  return (
    <section className="w-full flex-1 space-y-8">
      <header className="space-y-4">
        <p className="font-label text-xs font-bold uppercase tracking-[0.22em] text-cyber">
          {t("step1Eyebrow", language)}
        </p>
        <h2 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
          {t("step1Heading", language)}
        </h2>
        <p className="max-w-3xl font-mono text-base leading-relaxed text-muted-strong">
          {t("step1Subheading", language)}
        </p>
      </header>

      <ul className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 md:gap-5 lg:grid-cols-3">
        {CAREER_FIELDS.map((field) => {
          const selected = isTrackSelected(field, roleId);
          const copy = tCareerFieldCard(field, language);
          const pathCount = copy.sampleRoles.length;
          return (
            <li key={field.id}>
              <button
                type="button"
                onClick={() => {
                  setRoleId(field.defaultArchetypeId);
                  if (showFreeText) setFreeText("");
                }}
                aria-pressed={selected}
                className={[
                  "flex h-full min-h-[11rem] w-full flex-col border bg-panel px-5 py-4 text-left transition-colors",
                  "hover:border-cyber hover:bg-surface-2",
                  selected
                    ? "border-cyber bg-cyber-dim shadow-[0_0_18px_rgba(100,149,237,0.18)]"
                    : "border-border",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="text-lg font-semibold text-foreground">
                    {copy.name}
                  </span>
                  <span className="shrink-0 uppercase font-label text-[10px] font-semibold tracking-[0.14em] text-muted">
                    {pathCount} {t("step1PathsWord", language)}
                  </span>
                </div>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-strong [text-wrap:pretty]">
                  {copy.summary}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {copy.sampleRoles.map((role) => (
                    <span
                      key={`${field.id}-${role}`}
                      className="border border-border bg-bg/80 px-2 py-1 font-mono text-[11px] font-medium text-muted-strong"
                    >
                      {role}
                    </span>
                  ))}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border border-dashed border-border bg-panel/40 p-4">
        {showFreeText ? (
          <label className="block space-y-2">
            <span className="font-label text-xs font-bold uppercase tracking-[0.18em] text-muted-strong">
              {t("step1FreeTextLabel", language)}
            </span>
            <textarea
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value);
                if (e.target.value.trim().length > 0) setRoleId(null);
              }}
              placeholder={t("step1FreeTextPlaceholder", language)}
              rows={2}
              className="w-full resize-y border border-border bg-bg p-4 font-mono text-base text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => setShowFreeText(true)}
            className="font-mono text-base text-cyber underline-offset-4 hover:underline"
          >
            {t("step1NoneFitButton", language)}
          </button>
        )}
      </div>

      <div className="flex items-center justify-end">
        <Button
          variant="primary"
          size="lg"
          disabled={!canContinue}
          onClick={() => onSubmit({ roleId, freeText: freeText.trim() })}
        >
          {t("step1Continue", language)}
        </Button>
      </div>
    </section>
  );
}
