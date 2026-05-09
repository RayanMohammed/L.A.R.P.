"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  tArchetypeJargonNote,
  tArchetypeName,
  tArchetypeSummary,
  tArchetypeTimelineShort,
} from "@/lib/i18n/dataTranslations";
import { type Language, t } from "@/lib/i18n/translations";
import { ARCHETYPES } from "@/lib/plan/catalog";

type StepRoleProps = {
  initialRoleId: string | null;
  initialFreeText: string;
  language?: Language;
  onSubmit: (value: { roleId: string | null; freeText: string }) => void;
};

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

      <ul className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-[repeat(auto-fit,minmax(18rem,1fr))]">
        {ARCHETYPES.map((a) => {
          const selected = roleId === a.id;
          const jargonNote = tArchetypeJargonNote(a, language);
          return (
            <li key={a.id}>
              <button
                type="button"
                onClick={() => {
                  setRoleId(a.id);
                  if (showFreeText) setFreeText("");
                }}
                aria-pressed={selected}
                className={[
                  "h-full w-full border bg-panel px-5 py-4 text-left transition-colors",
                  "hover:border-cyber hover:bg-surface-2",
                  selected
                    ? "border-cyber bg-cyber-dim shadow-[0_0_18px_rgba(100,149,237,0.18)]"
                    : "border-border",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-lg font-medium text-foreground">
                    {tArchetypeName(a, language)}
                  </span>
                  <span className="font-label text-xs font-semibold uppercase tracking-wider text-muted">
                    {tArchetypeTimelineShort(a, language)}
                  </span>
                </div>
                <ul className="mt-3 list-disc space-y-1.5 pl-5 text-base leading-snug text-muted">
                  <li>{tArchetypeSummary(a, language)}</li>
                  {jargonNote ? (
                    <li className="font-mono text-sm italic text-muted/70">
                      {jargonNote}
                    </li>
                  ) : null}
                </ul>
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
