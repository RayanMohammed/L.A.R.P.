"use client";

import {
  type Language,
  t,
  type TranslationKey,
} from "@/lib/i18n/translations";

const ITEM_KEYS = [
  "privacyGuardrailItem1",
  "privacyGuardrailItem2",
  "privacyGuardrailItem3",
  "privacyGuardrailItem4",
] as const satisfies readonly TranslationKey[];

type PrivacyGuardrailsProps = {
  language: Language;
};

/**
 * Visible checklist so users know what not to paste into free-text fields.
 */
export function PrivacyGuardrails({ language }: PrivacyGuardrailsProps) {
  return (
    <aside
      role="note"
      aria-label={t("privacyGuardrailsAria", language)}
      className="border border-cyber/40 bg-cyber-dim/25 px-4 py-3"
    >
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-cyber-bright">
        {t("privacyGuardrailsTitle", language)}
      </p>
      <ul className="mt-2.5 list-disc space-y-1.5 pl-5 font-mono text-[12px] leading-snug text-muted-strong marker:text-cyber/80">
        {ITEM_KEYS.map((key) => (
          <li key={key}>{t(key, language)}</li>
        ))}
      </ul>
    </aside>
  );
}
