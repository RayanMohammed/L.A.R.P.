export type FieldId =
  | "finance"
  | "data"
  | "swe"
  | "hardware"
  | "outreach"
  | "bioengineering";

export type FieldSkillGroup = {
  label: string;
  options: string[];
};

export type CareerField = {
  id: FieldId;
  name: string;
  shortName: string;
  summary: string;
  sampleRoles: string[];
  defaultArchetypeId: string;
  relatedArchetypeIds: string[];
  topIndustrySkills: string[];
  resumeBuzzwords: string[];
  skillGroups: FieldSkillGroup[];
};

export const CAREER_FIELDS: CareerField[] = [
  {
    id: "finance",
    name: "Finance",
    shortName: "Finance",
    summary:
      "Builds models, pitches, and market judgment for banking, investing, corporate finance, and consulting-adjacent work.",
    sampleRoles: [
      "Finance Analyst",
      "Investment Banking Analyst",
      "Corporate Finance Intern",
      "Consulting Analyst",
    ],
    defaultArchetypeId: "finance-analyst-intern",
    relatedArchetypeIds: ["finance-analyst-intern", "consulting-intern"],
    topIndustrySkills: [
      "Excel modeling",
      "Financial statement analysis",
      "Valuation basics",
      "Market research",
      "Executive communication",
      "Professional networking",
    ],
    resumeBuzzwords: [
      "financial modeling",
      "valuation",
      "market analysis",
      "forecasting",
      "due diligence",
      "stakeholder communication",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["ECON 1 / ECON 3", "MGT 45", "MATH 10 / 20 series", "intro accounting course"],
      },
      {
        label: "Finance signals",
        options: ["Excel modeling", "built a budget", "stock pitch", "read a 10-K", "finance club"],
      },
      {
        label: "Communication",
        options: ["PowerPoint / Google Slides", "case interview practice", "professional email", "presented to a group"],
      },
    ],
  },
  {
    id: "data",
    name: "Data",
    shortName: "Data",
    summary:
      "Turns messy information into analysis, dashboards, experiments, and recommendations people can act on.",
    sampleRoles: [
      "Data Analyst",
      "Data Scientist",
      "Analytics Engineer",
      "ML Intern",
    ],
    defaultArchetypeId: "data-analyst-intern",
    relatedArchetypeIds: ["data-analyst-intern", "ds-ml-intern"],
    topIndustrySkills: [
      "SQL",
      "Python or R",
      "Statistics",
      "Dashboarding",
      "Data cleaning",
      "Insight writing",
    ],
    resumeBuzzwords: [
      "data analysis",
      "SQL",
      "dashboarding",
      "statistical analysis",
      "data visualization",
      "predictive modeling",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["COGS 9 / DSC 10", "MATH 11", "MATH 18", "intro statistics course"],
      },
      {
        label: "Data tools",
        options: ["SQL", "pandas or R", "Excel or Google Sheets", "Tableau / Power BI / Looker", "Jupyter notebooks"],
      },
      {
        label: "Portfolio signals",
        options: ["built a dashboard", "Kaggle or DataFest project", "cleaned a messy dataset", "wrote insights from a chart"],
      },
    ],
  },
  {
    id: "swe",
    name: "Software Engineering",
    shortName: "SWE",
    summary:
      "Builds products and systems with code: web apps, backend services, developer tools, and production features.",
    sampleRoles: [
      "Software Engineering Intern",
      "Full-Stack Intern",
      "Backend Intern",
      "DevOps Intern",
    ],
    defaultArchetypeId: "swe-intern",
    relatedArchetypeIds: ["swe-intern", "devops-intern", "pm-intern"],
    topIndustrySkills: [
      "Data structures",
      "Git workflow",
      "Debugging",
      "Testing",
      "Web development",
      "Technical communication",
    ],
    resumeBuzzwords: [
      "full-stack development",
      "API integration",
      "debugging",
      "unit testing",
      "code review",
      "version control",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["CSE 8A / CSE 11", "CSE 12", "CSE 30", "discrete math course"],
      },
      {
        label: "Programming",
        options: ["Python", "JavaScript or TypeScript", "Java", "C or C++", "HTML / CSS", "SQL"],
      },
      {
        label: "Builder signals",
        options: ["git basics", "built a personal website", "built a web app", "used an API", "completed an online tutorial / bootcamp"],
      },
    ],
  },
  {
    id: "hardware",
    name: "Hardware",
    shortName: "Hardware",
    summary:
      "Works with physical systems: circuits, embedded software, robotics, sensors, PCBs, and mechanical builds.",
    sampleRoles: [
      "Hardware Intern",
      "Embedded Systems Intern",
      "Robotics Intern",
      "Electrical Engineering Intern",
    ],
    defaultArchetypeId: "hardware-intern",
    relatedArchetypeIds: ["hardware-intern", "swe-intern"],
    topIndustrySkills: [
      "Embedded C/C++",
      "Circuit fundamentals",
      "Schematic reading",
      "Lab debugging",
      "CAD",
      "Technical documentation",
    ],
    resumeBuzzwords: [
      "embedded systems",
      "sensor integration",
      "circuit design",
      "hardware debugging",
      "rapid prototyping",
      "technical documentation",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["ECE 5", "PHYS 2A", "CSE 8A / CSE 11", "MAE or ECE intro design course"],
      },
      {
        label: "Hardware tools",
        options: ["soldered or wired a circuit", "Arduino / microcontroller", "CAD (Fusion / SolidWorks)", "used a multimeter", "read a datasheet"],
      },
      {
        label: "Project signals",
        options: ["robotics team", "documented a build", "debugged a physical prototype", "competition project"],
      },
    ],
  },
  {
    id: "outreach",
    name: "Outreach",
    shortName: "Outreach",
    summary:
      "Builds trust with people and communities through programs, events, education, marketing, and service work.",
    sampleRoles: [
      "Community Program Intern",
      "Marketing Intern",
      "Education Intern",
      "Bilingual Outreach Intern",
    ],
    defaultArchetypeId: "nonprofit-intern",
    relatedArchetypeIds: [
      "nonprofit-intern",
      "bilingual-outreach-intern",
      "education-tutor-intern",
      "marketing-intern",
    ],
    topIndustrySkills: [
      "Community listening",
      "Event coordination",
      "Clear writing",
      "Public speaking",
      "Volunteer management",
      "Follow-through",
    ],
    resumeBuzzwords: [
      "community outreach",
      "program coordination",
      "stakeholder engagement",
      "event planning",
      "cross-cultural communication",
      "impact tracking",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["COMM 10", "SOCI 1", "USP intro course", "education or psychology course"],
      },
      {
        label: "People work",
        options: ["community service", "event planning", "bilingual communication", "public speaking", "tutored or mentored someone"],
      },
      {
        label: "Org signals",
        options: ["campus org leadership", "ran an event (>20 people)", "managed volunteers", "made flyers or social posts", "wrote outreach emails"],
      },
    ],
  },
  {
    id: "bioengineering",
    name: "Bioengineering",
    shortName: "Bioengineering",
    summary:
      "Connects biology, engineering, and research through labs, protocols, biotech tools, and health-focused projects.",
    sampleRoles: [
      "Bioengineering Intern",
      "Wet-Lab Research Assistant",
      "Healthcare Research Intern",
      "Bioinformatics Intern",
    ],
    defaultArchetypeId: "bio-research-intern",
    relatedArchetypeIds: [
      "bio-research-intern",
      "healthcare-research-intern",
      "data-analyst-intern",
    ],
    topIndustrySkills: [
      "Lab notebook discipline",
      "Wet-lab technique",
      "Literature review",
      "Experimental design",
      "Data analysis",
      "Scientific communication",
    ],
    resumeBuzzwords: [
      "experimental design",
      "protocol execution",
      "literature review",
      "data analysis",
      "lab safety",
      "scientific communication",
    ],
    skillGroups: [
      {
        label: "Relevant courses",
        options: ["BILD 1 / BILD 2", "CHEM 6A", "BENG intro course", "MATH 10 / 20 series"],
      },
      {
        label: "Lab and research",
        options: ["wet lab", "lab course (chem, bio, physics)", "read a research paper", "kept a lab notebook", "joined a research lab"],
      },
      {
        label: "Bio data",
        options: ["Excel for lab data", "Python or R for bio data", "presented at a poster session", "followed a protocol"],
      },
    ],
  },
];

export const DEFAULT_FIELD_ID: FieldId = "swe";

export function getCareerField(fieldId: string | null | undefined): CareerField | undefined {
  return CAREER_FIELDS.find((field) => field.id === fieldId);
}

export function getDefaultArchetypeIdForField(fieldId: string | null | undefined): string {
  return getCareerField(fieldId)?.defaultArchetypeId ?? "swe-intern";
}

/**
 * Reverse-lookup: given an archetype id, find the career field that lists it
 * in its relatedArchetypeIds. Returns undefined for free-text roles or when
 * the archetype isn't tied to any field.
 */
export function getFieldForArchetypeId(
  archetypeId: string | null | undefined,
): CareerField | undefined {
  if (!archetypeId) return undefined;
  return CAREER_FIELDS.find((field) =>
    field.relatedArchetypeIds.includes(archetypeId),
  );
}
