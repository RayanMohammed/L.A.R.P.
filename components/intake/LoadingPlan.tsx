"use client";

import { useEffect, useState } from "react";
import { type Language, t, type TranslationKey } from "@/lib/i18n/translations";

const LINE_KEYS: ReadonlyArray<TranslationKey> = [
  "loading1",
  "loading2",
  "loading3",
  "loading4",
];

type LoadingPlanProps = {
  language?: Language;
};

export function LoadingPlan({ language = "en" }: LoadingPlanProps) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((prev) => (prev + 1) % LINE_KEYS.length),
      1400,
    );
    return () => clearInterval(id);
  }, []);

  return (
    <section
      className="flex min-h-[320px] w-full flex-1 flex-col items-center justify-center gap-4 border border-dashed border-border bg-panel/40 p-8 text-center"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="flex gap-1.5">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="h-2 w-2 animate-pulse bg-cyber"
            style={{ animationDelay: `${d * 160}ms` }}
          />
        ))}
      </div>
      <p className="font-mono text-sm text-muted-strong transition-opacity">
        {t(LINE_KEYS[i], language)}
      </p>
    </section>
  );
}
