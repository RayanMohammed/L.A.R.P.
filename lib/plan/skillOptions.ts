/**
 * Curated skill / experience tags shown in step 2 of the intake.
 * Designed for first-year reality: lots of "I took an intro class" and
 * "I led one event" — no FAANG bullets. The "Honest answers" group is
 * intentional — first quarter is allowed to be empty.
 */
export type SkillGroup = {
  label: string;
  options: string[];
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    label: "Coding",
    options: [
      "intro CS course (CSE 8A / 11)",
      "data structures course (CSE 12 / 30)",
      "Python",
      "JavaScript or TypeScript",
      "Java",
      "C or C++",
      "HTML / CSS",
      "SQL",
      "git basics",
      "built a personal website",
      "completed an online tutorial / bootcamp",
    ],
  },
  {
    label: "Data & analysis",
    options: [
      "Excel or Google Sheets",
      "Tableau / Power BI / Looker",
      "pandas or R",
      "intro statistics course",
      "Kaggle or DataFest project",
    ],
  },
  {
    label: "Design & creative",
    options: [
      "Figma basics",
      "Canva or Adobe",
      "wrote for a publication",
      "ran a social media account with real followers",
      "edited video",
    ],
  },
  {
    label: "Research & lab",
    options: [
      "joined a research lab",
      "lab course (chem, bio, physics)",
      "read a research paper end-to-end",
      "presented at a poster session",
    ],
  },
  {
    label: "Leadership & community",
    options: [
      "led a high-school club",
      "ran an event (>20 people)",
      "tutored or TA'd",
      "founded something",
      "volunteered consistently for a cause",
      "competitive sport / performing arts at a serious level",
    ],
  },
  {
    label: "Work & money",
    options: [
      "had a paid job (any kind)",
      "freelanced or sold something",
      "managed a budget for an org",
      "customer service experience",
    ],
  },
  {
    label: "Tools & misc",
    options: [
      "comfortable on the command line",
      "used Linux",
      "AWS / GCP / Azure (free tier)",
      "soldered or wired a circuit",
      "CAD (Fusion / SolidWorks)",
      "spoke at a meetup or conference",
    ],
  },
  {
    label: "Honest answers",
    options: [
      "nothing yet — first quarter",
      "I'm not sure what counts",
    ],
  },
];
