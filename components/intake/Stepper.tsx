import { type Language, t, type TranslationKey } from "@/lib/i18n/translations";

type StepperProps = {
  current: 1 | 2 | 3;
  language?: Language;
};

const STEP_LABEL_KEYS: ReadonlyArray<TranslationKey> = [
  "stepperPickTarget",
  "stepperMapWhatYouHave",
  "stepperYourWeek",
];

export function Stepper({ current, language = "en" }: StepperProps) {
  return (
    <ol
      aria-label="Progress"
      className="no-print flex flex-wrap items-center gap-x-4 gap-y-3 font-label text-xs font-semibold uppercase tracking-[0.18em] text-muted"
    >
      {STEP_LABEL_KEYS.map((key, i) => {
        const idx = (i + 1) as 1 | 2 | 3;
        const active = idx === current;
        const done = idx < current;
        const label = t(key, language);
        return (
          <li key={key} className="flex items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={[
                "flex h-7 w-7 items-center justify-center border font-mono text-xs font-semibold",
                done
                  ? "border-cyber bg-cyber text-bg"
                  : active
                    ? "border-cyber text-cyber"
                    : "border-border text-muted",
              ].join(" ")}
            >
              {idx}
            </span>
            <span
              className={[
                "transition-colors",
                active
                  ? "text-cyber-bright"
                  : done
                    ? "text-muted-strong"
                    : "",
              ].join(" ")}
            >
              {label}
            </span>
            {idx !== 3 ? (
              <span aria-hidden className="ml-1 h-px w-8 bg-border sm:w-12" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
