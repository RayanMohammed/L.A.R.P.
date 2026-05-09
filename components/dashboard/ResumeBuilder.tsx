"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import type { CareerField } from "@/lib/plan/fields";
import type { PlanResponse } from "@/lib/plan/types";

type ResumeBuilderProps = {
  field: CareerField | undefined;
  plan: PlanResponse;
  selectedSkills: string[];
  context: string;
};

const STOP_WORDS = new Set([
  "about",
  "across",
  "after",
  "also",
  "based",
  "build",
  "using",
  "with",
  "from",
  "that",
  "this",
  "their",
  "there",
  "will",
  "work",
  "team",
  "teams",
  "role",
  "intern",
  "student",
  "experience",
  "skills",
  "ability",
]);

export function ResumeBuilder({
  field,
  plan,
  selectedSkills,
  context,
}: ResumeBuilderProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [appliedJobDescription, setAppliedJobDescription] = useState("");
  const [appliedProjectDescription, setAppliedProjectDescription] = useState("");
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  const jobKeywords = useMemo(
    () => extractJobKeywords(appliedJobDescription, field?.resumeBuzzwords ?? []),
    [appliedJobDescription, field?.resumeBuzzwords],
  );
  const latex = useMemo(
    () =>
      buildLatexResume({
        field,
        plan,
        selectedSkills,
        context,
        jobKeywords,
        projectDescription: appliedProjectDescription,
      }),
    [appliedProjectDescription, context, field, jobKeywords, plan, selectedSkills],
  );

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    async function renderPdfPreview() {
      const { jsPDF } = await import("jspdf");
      if (cancelled) return;

      const pdf = new jsPDF({ unit: "pt", format: "letter" });
      writeResumePdf(pdf, {
        field,
        plan,
        selectedSkills,
        context,
        jobKeywords,
        projectDescription: appliedProjectDescription,
      });

      objectUrl = URL.createObjectURL(pdf.output("blob"));
      if (cancelled) {
        URL.revokeObjectURL(objectUrl);
        return;
      }

      setPdfUrl((previousUrl) => {
        if (previousUrl) URL.revokeObjectURL(previousUrl);
        return objectUrl;
      });
    }

    void renderPdfPreview();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [appliedProjectDescription, context, field, jobKeywords, plan, selectedSkills]);

  function applyResumeInputs() {
    setAppliedJobDescription(jobDescription.trim());
    setAppliedProjectDescription(projectDescription.trim());
  }

  async function copyLatex() {
    await navigator.clipboard.writeText(latex);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  async function downloadPdf() {
    setDownloading(true);
    try {
      const { jsPDF } = await import("jspdf");
      const pdf = new jsPDF({ unit: "pt", format: "letter" });
      writeResumePdf(pdf, {
        field,
        plan,
        selectedSkills,
        context,
        jobKeywords,
        projectDescription: appliedProjectDescription,
      });
      pdf.save("larp-jake-resume.pdf");
    } finally {
      setDownloading(false);
    }
  }

  return (
    <section className="no-print border border-border bg-panel p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.22em] text-cyber">
            Resume builder
          </p>
          <h3 className="text-2xl font-semibold tracking-tight text-foreground">
            Jake&apos;s Resume Template, prefilled
          </h3>
          <p className="max-w-3xl font-mono text-sm leading-relaxed text-muted-strong">
            Paste a job description and any completed project notes, then click
            Go to rewrite the resume keywords. The preview shows the PDF as an
            employer would see it, and the LaTeX can be copied into Overleaf for
            easy editing.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="md" onClick={copyLatex}>
            {copied ? "Copied" : "Copy LaTeX"}
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={downloadPdf}
            disabled={downloading}
          >
            {downloading ? "Building PDF" : "Download PDF"}
          </Button>
        </div>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <div className="grid gap-4">
          <label className="block space-y-2">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
              Intended job description
            </span>
            <textarea
              value={jobDescription}
              onChange={(event) => setJobDescription(event.target.value)}
              placeholder="Paste the internship or role description here. Keywords will be folded into the resume draft after you click Go."
              rows={8}
              className="min-h-48 w-full resize-y border border-border bg-bg p-3 font-mono text-sm text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
            />
          </label>

          <label className="block space-y-2">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
              Projects or resume additions
            </span>
            <textarea
              value={projectDescription}
              onChange={(event) => setProjectDescription(event.target.value)}
              placeholder="Describe projects, clubs, lab work, class assignments, or jobs you want included. Example: built a React site for a student org, cleaned survey data in Python, led event logistics."
              rows={8}
              className="min-h-48 w-full resize-y border border-border bg-bg p-3 font-mono text-sm text-foreground placeholder:text-muted/70 focus:border-cyber focus:outline-none"
            />
          </label>

          <div className="flex justify-end">
            <Button variant="hot" size="md" onClick={applyResumeInputs}>
              Go
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-label text-[10px] font-bold uppercase tracking-[0.18em] text-muted-strong">
              Inbuilt PDF viewer
            </span>
            <span className="font-mono text-[11px] text-muted">
              Copy LaTeX if you want to edit the source.
            </span>
          </div>
          {pdfUrl ? (
            <iframe
              title="Resume PDF preview"
              src={pdfUrl}
              className="h-[520px] w-full border border-border bg-bg"
            />
          ) : (
            <div className="flex h-[520px] items-center justify-center border border-border bg-bg font-mono text-sm text-muted">
              Building PDF Preview...
            </div>
          )}
        </div>
      </div>

      {jobKeywords.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {jobKeywords.map((keyword) => (
            <span
              key={keyword}
              className="border border-border bg-bg/60 px-2 py-1 font-mono text-[11px] text-muted"
            >
              {toTitleCase(keyword)}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}

function extractJobKeywords(
  jobDescription: string,
  fieldBuzzwords: string[],
): string[] {
  const normalized = jobDescription.toLowerCase();
  const matchedBuzzwords = fieldBuzzwords.filter((word) =>
    normalized.includes(word.toLowerCase()),
  );
  const frequentTerms = Array.from(
    normalized
      .replace(/[^a-z0-9+#.\s-]/g, " ")
      .split(/\s+/)
      .filter((word) => word.length > 4 && !STOP_WORDS.has(word)),
      (word) => word.replace(/^-+|-+$/g, ""),
  ).filter(Boolean);

  return Array.from(new Set([...matchedBuzzwords, ...frequentTerms])).slice(0, 12);
}

function buildLatexResume(args: {
  field: CareerField | undefined;
  plan: PlanResponse;
  selectedSkills: string[];
  context: string;
  jobKeywords: string[];
  projectDescription: string;
}): string {
  const { field, plan, selectedSkills, context, jobKeywords, projectDescription } =
    args;
  const fieldName = latexEscape(field?.name ?? plan.archetype.name);
  const targetRole = latexEscape(plan.archetype.name);
  const allSkills = uniqueList([
    ...selectedSkills,
    ...(field?.topIndustrySkills ?? []),
    ...jobKeywords,
  ]);
  const buzzwords = uniqueList([...(field?.resumeBuzzwords ?? []), ...jobKeywords]);
  const skillsLine = allSkills.length
    ? allSkills.map(latexEscape).join(", ")
    : "Add course, tool, and project skills here";
  const buzzwordLine = buzzwords.length
    ? buzzwords.map(latexEscape).join(", ")
    : "Add role keywords from the job description here";
  const projectBullets = buildProjectBullets({
    plan,
    projectDescription,
  });
  const contextLine = context
    ? `        \\resumeItem{Additional context to translate into bullets: ${latexEscape(context)}}`
    : "        \\resumeItem{Add context from part-time work, clubs, service, or coursework that proves consistency.}";

  return String.raw`% Jake's Resume style starter generated by L.A.R.P.
% Replace bracketed placeholders with your real details, then compile with pdfLaTeX.
\documentclass[letterpaper,11pt]{article}

\usepackage{latexsym}
\usepackage[empty]{fullpage}
\usepackage{titlesec}
\usepackage{marvosym}
\usepackage[usenames,dvipsnames]{color}
\usepackage{verbatim}
\usepackage{enumitem}
\usepackage[hidelinks]{hyperref}
\usepackage{fancyhdr}
\usepackage[english]{babel}
\usepackage{tabularx}
\input{glyphtounicode}

\pagestyle{fancy}
\fancyhf{}
\fancyfoot{}
\renewcommand{\headrulewidth}{0pt}
\renewcommand{\footrulewidth}{0pt}

\addtolength{\oddsidemargin}{-0.5in}
\addtolength{\evensidemargin}{-0.5in}
\addtolength{\textwidth}{1in}
\addtolength{\topmargin}{-.5in}
\addtolength{\textheight}{1.0in}

\urlstyle{same}
\raggedbottom
\raggedright
\setlength{\tabcolsep}{0in}

\titleformat{\section}{
  \vspace{-4pt}\scshape\raggedright\large
}{}{0em}{}[\color{black}\titlerule \vspace{-5pt}]

\pdfgentounicode=1

\newcommand{\resumeItem}[1]{
  \item\small{
    {#1 \vspace{-2pt}}
  }
}

\newcommand{\resumeSubheading}[4]{
  \vspace{-2pt}\item
    \begin{tabular*}{0.97\textwidth}[t]{l@{\extracolsep{\fill}}r}
      \textbf{#1} & #2 \\
      \textit{\small#3} & \textit{\small #4} \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeProjectHeading}[2]{
    \item
    \begin{tabular*}{0.97\textwidth}{l@{\extracolsep{\fill}}r}
      \small#1 & #2 \\
    \end{tabular*}\vspace{-7pt}
}

\newcommand{\resumeSubItem}[1]{\resumeItem{#1}\vspace{-4pt}}
\renewcommand\labelitemii{$\vcenter{\hbox{\tiny$\bullet$}}$}
\newcommand{\resumeSubHeadingListStart}{\begin{itemize}[leftmargin=0.15in, label={}]}
\newcommand{\resumeSubHeadingListEnd}{\end{itemize}}
\newcommand{\resumeItemListStart}{\begin{itemize}}
\newcommand{\resumeItemListEnd}{\end{itemize}\vspace{-5pt}}

\begin{document}

\begin{center}
    \textbf{\Huge \scshape [Your Name]} \\ \vspace{1pt}
    \small [Phone] $|$ \href{mailto:[email]}{\underline{[email]}} $|$
    \href{https://linkedin.com/in/[handle]}{\underline{linkedin.com/in/[handle]}} $|$
    \href{https://github.com/[handle]}{\underline{github.com/[handle]}}
\end{center}

\section{Education}
  \resumeSubHeadingListStart
    \resumeSubheading
      {University of California San Diego}{La Jolla, CA}
      {[Degree / Major], ${fieldName} direction}{Expected [Month Year]}
  \resumeSubHeadingListEnd

\section{Experience}
  \resumeSubHeadingListStart
    \resumeSubheading
      {[Campus Organization / Lab / Job]}{[Dates]}
      {Early ${targetRole} Preparation}{UC San Diego}
      \resumeItemListStart
${contextLine}
        \resumeItem{Target keywords from job description: ${buzzwordLine}.}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

\section{Projects}
  \resumeSubHeadingListStart
    \resumeProjectHeading
      {\textbf{L.A.R.P. Starter Project for ${targetRole}} $|$ \emph{${fieldName}}}{[Dates]}
      \resumeItemListStart
${projectBullets}
      \resumeItemListEnd
  \resumeSubHeadingListEnd

\section{Skills}
 \begin{itemize}[leftmargin=0.15in, label={}]
    \small{\item{
     \textbf{Courses, Tools, and Skills}{: ${skillsLine}} \\
     \textbf{Industry Keywords}{: ${buzzwordLine}}
    }}
 \end{itemize}

\end{document}
`;
}

function writeResumePdf(
  pdf: {
    setFont: (fontName: string, fontStyle?: string) => unknown;
    setFontSize: (fontSize: number) => unknown;
    text: (
      text: string | string[],
      x: number,
      y: number,
      options?: { align?: "left" | "center" | "right" | "justify" },
    ) => unknown;
    line: (x1: number, y1: number, x2: number, y2: number) => unknown;
    splitTextToSize: (text: string, maxWidth: number) => string[];
    addPage: () => unknown;
  },
  args: {
    field: CareerField | undefined;
    plan: PlanResponse;
    selectedSkills: string[];
    context: string;
    jobKeywords: string[];
    projectDescription: string;
  },
) {
  const {
    field,
    plan,
    selectedSkills,
    context,
    jobKeywords,
    projectDescription,
  } = args;
  const margin = 54;
  const width = 612 - margin * 2;
  let y = 48;

  function ensureSpace(height: number) {
    if (y + height > 742) {
      pdf.addPage();
      y = 48;
    }
  }

  function section(title: string) {
    ensureSpace(28);
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(12);
    pdf.text(title.toUpperCase(), margin, y);
    pdf.line(margin, y + 5, 612 - margin, y + 5);
    y += 20;
  }

  function line(text: string, options?: { bold?: boolean; size?: number; indent?: number }) {
    const indent = options?.indent ?? 0;
    const size = options?.size ?? 10;
    pdf.setFont("helvetica", options?.bold ? "bold" : "normal");
    pdf.setFontSize(size);
    const lines = pdf.splitTextToSize(text, width - indent);
    ensureSpace(lines.length * (size + 3));
    pdf.text(lines, margin + indent, y);
    y += lines.length * (size + 3);
  }

  const skills = uniqueList([
    ...selectedSkills,
    ...(field?.topIndustrySkills ?? []),
    ...jobKeywords,
  ]);
  const keywords = uniqueList([...(field?.resumeBuzzwords ?? []), ...jobKeywords]);

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.text("[Your Name]", 306, y, { align: "center" });
  y += 16;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.text("[Phone] | [email] | linkedin.com/in/[handle] | github.com/[handle]", 306, y, {
    align: "center",
  });
  y += 28;

  section("Education");
  line("University of California San Diego", { bold: true });
  line(`[Degree / Major], ${field?.name ?? plan.archetype.name} Direction | Expected [Month Year]`);
  y += 6;

  section("Experience");
  line("[Campus Organization / Lab / Job]", { bold: true });
  line(`Early ${plan.archetype.name} Preparation | UC San Diego`);
  line(
    context
      ? `• Additional context to translate into bullets: ${context}`
      : "• Add context from part-time work, clubs, service, or coursework that proves consistency.",
    { indent: 10 },
  );
  line(`• Target keywords from job description: ${keywords.join(", ") || "Add Role Keywords"}.`, {
    indent: 10,
  });
  y += 6;

  section("Projects");
  line(`L.A.R.P. Starter Project for ${plan.archetype.name}`, { bold: true });
  buildPdfProjectBullets({ plan, projectDescription }).forEach((bullet) => {
    line(`• ${bullet}`, { indent: 10 });
  });
  y += 6;

  section("Skills");
  line(`Courses, Tools, and Skills: ${skills.join(", ") || "Add Course, Tool, And Project Skills"}`);
  line(`Industry Keywords: ${keywords.join(", ") || "Add Role Keywords From The Job Description"}`);
}

function latexEscape(value: string): string {
  return value
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/&/g, "\\&")
    .replace(/%/g, "\\%")
    .replace(/\$/g, "\\$")
    .replace(/#/g, "\\#")
    .replace(/_/g, "\\_")
    .replace(/{/g, "\\{")
    .replace(/}/g, "\\}")
    .replace(/~/g, "\\textasciitilde{}")
    .replace(/\^/g, "\\textasciicircum{}");
}

function buildProjectBullets(args: {
  plan: PlanResponse;
  projectDescription: string;
}): string {
  const bullets = buildProjectBulletText(args);
  return bullets
    .map((bullet) => `        \\resumeItem{${latexEscape(bullet)}}`)
    .join("\n");
}

function buildPdfProjectBullets(args: {
  plan: PlanResponse;
  projectDescription: string;
}): string[] {
  return buildProjectBulletText(args);
}

function buildProjectBulletText({
  plan,
  projectDescription,
}: {
  plan: PlanResponse;
  projectDescription: string;
}): string[] {
  const userBullets = projectDescription
    .split(/\n+/)
    .map((line) => line.replace(/^[-*•]\s*/, "").trim())
    .filter(Boolean)
    .slice(0, 3)
    .map(
      (line) =>
        `${line} Translate this into an action-oriented bullet with tools, scope, and outcome.`,
    );

  if (userBullets.length > 0) return userBullets;

  if (plan.actionItems.length > 0) {
    return plan.actionItems
      .slice(0, 2)
      .map((item) => `${item.thisWeekAction} Built signal: ${item.skillBuilt}.`);
  }

  return ["Add one project bullet with scope, tools, and measurable outcome."];
}

function toTitleCase(value: string): string {
  return value
    .split(" ")
    .map((word) =>
      word.length > 3
        ? `${word.charAt(0).toUpperCase()}${word.slice(1)}`
        : word,
    )
    .join(" ");
}

function uniqueList(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)));
}
