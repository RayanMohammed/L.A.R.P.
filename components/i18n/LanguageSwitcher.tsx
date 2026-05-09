"use client";

import { type Language, t } from "@/lib/i18n/translations";

type LanguageSwitcherProps = {
  language: Language;
  onChange: (next: Language) => void;
};

const OPTIONS: ReadonlyArray<{ value: Language; labelKey: "languageEnglish" | "languageSpanish" }> = [
  { value: "en", labelKey: "languageEnglish" },
  { value: "es", labelKey: "languageSpanish" },
];

export function LanguageSwitcher({ language, onChange }: LanguageSwitcherProps) {
  return (
    <div
      role="group"
      aria-label={t("languageLabel", language)}
      className="no-print inline-flex items-center gap-1 border border-border bg-panel/60 p-1"
    >
      {OPTIONS.map((opt) => {
        const active = opt.value === language;
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            aria-pressed={active}
            className={[
              "px-3 py-1.5 font-label text-xs font-semibold uppercase tracking-[0.18em] transition-colors",
              active
                ? "bg-cyber text-bg"
                : "text-muted-strong hover:text-foreground",
            ].join(" ")}
          >
            {t(opt.labelKey, language)}
          </button>
        );
      })}
    </div>
  );
}
