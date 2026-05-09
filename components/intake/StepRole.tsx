"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ARCHETYPES } from "@/lib/plan/data";

type StepRoleProps = {
  initialRoleId: string | null;
  initialFreeText: string;
  onSubmit: (value: { roleId: string | null; freeText: string }) => void;
};

export function StepRole({
  initialRoleId,
  initialFreeText,
  onSubmit,
}: StepRoleProps) {
  const [roleId, setRoleId] = useState<string | null>(initialRoleId);
  const [freeText, setFreeText] = useState(initialFreeText);
  const [showFreeText, setShowFreeText] = useState(Boolean(initialFreeText));

  const canContinue = Boolean(roleId) || freeText.trim().length > 2;

  return (
    <section className="space-y-8">
      <header className="space-y-3">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
          Step 01 / Target
        </p>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          What kind of work do you want to do someday?
        </h2>
        <p className="max-w-2xl font-mono text-sm leading-relaxed text-muted-strong">
          Pick one. You don&apos;t have to be sure — we just need somewhere to
          start.
        </p>
      </header>

      <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {ARCHETYPES.map((a) => {
          const selected = roleId === a.id;
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
                  "h-full w-full border bg-panel px-4 py-3 text-left transition-colors",
                  "hover:border-cyber hover:bg-surface-2",
                  selected
                    ? "border-cyber bg-cyber-dim shadow-[0_0_18px_rgba(100,149,237,0.18)]"
                    : "border-border",
                ].join(" ")}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-medium text-foreground">{a.name}</span>
                  <span className="font-label text-[10px] font-semibold uppercase tracking-wider text-muted">
                    {a.typicalTimeline.split("—")[0].trim()}
                  </span>
                </div>
                <p className="mt-1 text-sm leading-snug text-muted">
                  {a.summary}
                </p>
              </button>
            </li>
          );
        })}
      </ul>

      <div className="border border-dashed border-border bg-panel/40 p-4">
        {showFreeText ? (
          <label className="block space-y-2">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
              Or describe it in your own words
            </span>
            <textarea
              value={freeText}
              onChange={(e) => {
                setFreeText(e.target.value);
                if (e.target.value.trim().length > 0) setRoleId(null);
              }}
              placeholder="e.g. something where I get paid to write or research"
              rows={2}
              className="w-full resize-y border border-border bg-bg p-3 font-mono text-sm text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
            />
          </label>
        ) : (
          <button
            type="button"
            onClick={() => setShowFreeText(true)}
            className="font-mono text-sm text-cyber underline-offset-4 hover:underline"
          >
            None of these fit — let me describe it
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
          Continue →
        </Button>
      </div>
    </section>
  );
}
