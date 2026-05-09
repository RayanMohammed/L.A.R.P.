"use client";

import { useEffect, useState } from "react";

const LINES = [
  "Reading the role…",
  "Mapping what you have…",
  "Picking campus moves with the highest leverage…",
  "Writing your week…",
];

export function LoadingPlan() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(
      () => setI((prev) => (prev + 1) % LINES.length),
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
        {LINES[i]}
      </p>
    </section>
  );
}
