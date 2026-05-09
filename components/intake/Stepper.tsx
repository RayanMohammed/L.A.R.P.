type StepperProps = {
  current: 1 | 2 | 3;
};

const STEPS = ["Pick a field", "Map what you have", "Dashboard"];

export function Stepper({ current }: StepperProps) {
  return (
    <ol
      aria-label="Progress"
      className="no-print flex flex-wrap items-center gap-x-3 gap-y-2 font-label text-[10px] font-semibold uppercase tracking-[0.18em] text-muted"
    >
      {STEPS.map((label, i) => {
        const idx = (i + 1) as 1 | 2 | 3;
        const active = idx === current;
        const done = idx < current;
        return (
          <li key={label} className="flex items-center gap-2">
            <span
              aria-current={active ? "step" : undefined}
              className={[
                "flex h-5 w-5 items-center justify-center border font-mono text-[10px] font-semibold",
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
              <span aria-hidden className="ml-1 h-px w-6 bg-border sm:w-10" />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
