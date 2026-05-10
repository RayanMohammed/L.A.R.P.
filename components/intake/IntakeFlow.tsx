"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { LanguageSwitcher } from "@/components/i18n/LanguageSwitcher";
import { LoadingPlan } from "@/components/intake/LoadingPlan";
import { Stepper } from "@/components/intake/Stepper";
import { StepRole } from "@/components/intake/StepRole";
import { StepSkills } from "@/components/intake/StepSkills";
import { TelemetryAsciiBanner } from "@/components/telemetry/TelemetryAsciiBanner";
import type { Language } from "@/lib/i18n/translations";
import { getFieldForArchetypeId } from "@/lib/plan/fields";
import type { PlanResponse } from "@/lib/plan/types";

type IntakeState = {
  roleId: string | null;
  freeText: string;
  skills: string[];
  context: string;
};

const EMPTY_STATE: IntakeState = {
  roleId: null,
  freeText: "",
  skills: [],
  context: "",
};

export function IntakeFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [intake, setIntake] = useState<IntakeState>(EMPTY_STATE);
  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const lang = searchParams.get("lang");
    if (lang === "es") {
      setLanguage("es");
    }
  }, [searchParams]);

  async function generate(next: IntakeState) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/plan", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          targetRoleId: next.roleId ?? undefined,
          targetRoleFreeText: next.roleId ? undefined : next.freeText,
          currentSkills: next.skills,
          context: next.context || undefined,
          language,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const code =
          typeof data?.error === "string" ? data.error : `http_${res.status}`;
        throw new Error(humanizeError(code));
      }
      setPlan(data as PlanResponse);
      setStep(3);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  function startOver() {
    setStep(1);
    setPlan(null);
    setError(null);
    setIntake(EMPTY_STATE);
  }

  // Field is derived from the chosen archetype id. Free-text roles produce
  // undefined here, and downstream components already handle that gracefully
  // (Dashboard falls back to archetype name/summary, ResumeBuilder uses
  // empty buzzword arrays, SkillsRadar hides itself).
  const field = getFieldForArchetypeId(intake.roleId);

  return (
    <div className="flex w-full flex-1 flex-col gap-10 px-4 py-8 sm:px-6 sm:py-12 lg:px-10 xl:px-14">
      <div className="no-print flex justify-end">
        <LanguageSwitcher language={language} onChange={setLanguage} />
      </div>

      <TelemetryAsciiBanner language={language} />

      <div className="no-print flex justify-center">
        <Stepper current={step} language={language} />
      </div>

      {step === 1 ? (
        <StepRole
          initialRoleId={intake.roleId}
          initialFreeText={intake.freeText}
          language={language}
          onSubmit={({ roleId, freeText }) => {
            setIntake((s) => ({ ...s, roleId, freeText }));
            setStep(2);
          }}
        />
      ) : null}

      {step === 2 ? (
        loading ? (
          <LoadingPlan language={language} />
        ) : (
          <>
            <StepSkills
              initialSkills={intake.skills}
              initialContext={intake.context}
              language={language}
              fieldId={field?.id ?? null}
              onBack={() => setStep(1)}
              onSubmit={({ skills, context }) => {
                const next = { ...intake, skills, context };
                setIntake(next);
                void generate(next);
              }}
            />
            {error ? (
              <div
                role="alert"
                className="border border-alert/40 bg-alert/10 px-4 py-3 font-mono text-sm text-alert"
              >
                {error}
              </div>
            ) : null}
          </>
        )
      ) : null}

      {step === 3 && plan ? (
        <Dashboard
          field={field}
          plan={plan}
          selectedSkills={intake.skills}
          context={intake.context}
          language={language}
          onStartOver={startOver}
        />
      ) : null}
    </div>
  );
}

function humanizeError(code: string): string {
  switch (code) {
    case "groq_not_configured":
      return "GROQ_API_KEY isn't set. Add it to .env.local and restart dev.";
    case "groq_request_failed":
      return "Couldn't reach Groq. Check your network or API key and try again.";
    case "model_output_schema_mismatch":
    case "invalid_json_from_model":
    case "empty_completion":
      return "The model returned something we couldn't parse. Try again.";
    case "no_valid_resources_in_plan":
      return "The model didn't pick valid campus resources. Try again.";
    case "invalid_request":
      return "Something about the form input was off. Try again.";
    case "target_text_only_sensitive_removed":
      return "That description was only contact or ID-style text. Add a few words about the role you want.";
    default:
      return "Something went wrong generating your plan. Try again.";
  }
}
