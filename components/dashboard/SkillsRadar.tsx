"use client";

import { type Language, t } from "@/lib/i18n/translations";

type SkillsRadarProps = {
  industrySkills: string[];
  selectedSkills: string[];
  language: Language;
};

const STOP_WORDS = new Set([
  "and",
  "the",
  "for",
  "with",
  "any",
  "all",
  "from",
  "into",
  "onto",
  "about",
  "your",
  "have",
  "been",
  "very",
  "more",
  "some",
  "that",
  "this",
  "than",
]);

/** Center + radius tuned so outer labels fit without clipping */
const CX = 150;
const CY = 140;
const R = 58;
/** Labels sit outside the outer ring */
const LABEL_R = R + 26;

function wordsFrom(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+#]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 2 && !STOP_WORDS.has(w));
}

/** Haystack: normalized phrases + per-chip word sets for fuzzy match */
function buildHaystack(selectedSkills: string[]): {
  blob: string;
  wordSet: Set<string>;
} {
  const blob = selectedSkills.map((s) => s.toLowerCase()).join(" \n ");
  const wordSet = new Set(wordsFrom(blob));
  return { blob, wordSet };
}

/**
 * Score how much the user's chips overlap an industry skill label.
 * Uses phrase match, token overlap, and light stemming (prefix) so first-year
 * chip phrasing still registers (e.g. "debugged" ↔ "Debugging", "git" ↔ "Git").
 */
function scoreSkill(industrySkill: string, selectedSkills: string[]): number {
  if (selectedSkills.length === 0) return 0;

  const { blob, wordSet } = buildHaystack(selectedSkills);
  const norm = industrySkill.toLowerCase().trim();

  if (blob.includes(norm)) return 1;

  const industryWords = wordsFrom(industrySkill);
  if (industryWords.length === 0) return 0;

  let matchedWeight = 0;
  for (const iw of industryWords) {
    if (blob.includes(iw)) {
      matchedWeight += 1;
      continue;
    }
    if (wordSet.has(iw)) {
      matchedWeight += 1;
      continue;
    }
    // Prefix / stem: "debugging" ↔ "debugged", "communication" ↔ "communicate"
    let stemHit = false;
    for (const hw of wordSet) {
      const a = iw.length >= 4 ? iw.slice(0, 4) : iw;
      const b = hw.length >= 4 ? hw.slice(0, 4) : hw;
      if (
        hw.startsWith(iw) ||
        iw.startsWith(hw) ||
        (a.length >= 4 && b.length >= 4 && a === b)
      ) {
        matchedWeight += 0.85;
        stemHit = true;
        break;
      }
    }
    if (!stemHit && iw.length <= 4 && blob.includes(iw)) {
      matchedWeight += 1;
    }
  }

  return Math.min(1, matchedWeight / industryWords.length);
}

function polar(angle: number, radius: number) {
  return {
    x: CX + Math.cos(angle) * radius,
    y: CY + Math.sin(angle) * radius,
  };
}

function abbreviate(text: string, max = 20): string {
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

export function SkillsRadar({
  industrySkills,
  selectedSkills,
  language,
}: SkillsRadarProps) {
  const skills = industrySkills.slice(0, 6);
  const n = skills.length;
  if (n < 3) return null;

  const rawScores = skills.map((s) => scoreSkill(s, selectedSkills));

  const angles = skills.map((_, i) => -Math.PI / 2 + (2 * Math.PI * i) / n);

  /** Ensure a visible ring when there is real signal; near-zero stays tiny */
  const displayRadii = rawScores.map((raw) =>
    raw <= 0 ? 0.06 : Math.max(0.22, raw),
  );

  const pointsAt = (radii: number[]) =>
    radii
      .map((rad, i) => {
        const p = polar(angles[i], R * rad);
        return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
      })
      .join(" ");

  const havePolygon = pointsAt(displayRadii);
  const needPolygon = pointsAt(skills.map(() => 1));
  const anyMatch = rawScores.some((s) => s > 0);

  return (
    <div className="space-y-3">
      <svg
        viewBox="0 0 300 280"
        role="img"
        aria-label="Radar chart comparing industry skills needed against your selected skills"
        className="mx-auto block w-full max-w-[280px] overflow-visible"
      >
        {[0.25, 0.5, 0.75, 1].map((rad) => (
          <polygon
            key={rad}
            points={pointsAt(skills.map(() => rad))}
            className="fill-none stroke-border"
            strokeWidth={0.5}
          />
        ))}

        {angles.map((a, i) => {
          const p = polar(a, R);
          return (
            <line
              key={i}
              x1={CX}
              y1={CY}
              x2={p.x}
              y2={p.y}
              className="stroke-border"
              strokeWidth={0.5}
            />
          );
        })}

        <polygon
          points={needPolygon}
          className="fill-cyber/5 stroke-cyber"
          strokeWidth={1}
          strokeDasharray="4 3"
        />

        <polygon
          points={havePolygon}
          className={
            anyMatch
              ? "fill-mint/35 stroke-mint"
              : "fill-mint/10 stroke-mint/50"
          }
          strokeWidth={anyMatch ? 1.75 : 1}
        />

        {!anyMatch && selectedSkills.length > 0 ? (
          <circle cx={CX} cy={CY} r={3} className="fill-mint/60" />
        ) : null}

        {skills.map((skill, i) => {
          const a = angles[i];
          const p = polar(a, LABEL_R);
          const cos = Math.cos(a);
          const textAnchor: "start" | "middle" | "end" =
            cos > 0.25 ? "start" : cos < -0.25 ? "end" : "middle";
          return (
            <text
              key={skill}
              x={p.x}
              y={p.y}
              textAnchor={textAnchor}
              dominantBaseline="middle"
              className="fill-muted-strong font-mono"
              style={{ fontSize: "8.5px" }}
            >
              {abbreviate(skill, 22)}
            </text>
          );
        })}
      </svg>

      <div className="flex justify-center gap-4 font-mono text-[10px] text-muted">
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 border border-cyber bg-cyber/10" />
          {t("dashboardSkillsRadarNeed", language)}
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block h-2 w-2 bg-mint/60" />
          {t("dashboardSkillsRadarHave", language)}
        </span>
      </div>
    </div>
  );
}
