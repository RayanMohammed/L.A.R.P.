import type { Language } from "./translations";
import type { JobArchetype } from "@/lib/plan/types";

/**
 * Spanish translations for data that is otherwise stored canonically in
 * English (job archetypes and skill chips). The English source values
 * stay untouched so the API/Groq side keeps a stable shape.
 */

type ArchetypeEsCopy = {
  name: string;
  summary: string;
  jargonNote?: string;
  /** Pre-truncated short label used in the role-card timeline pill. */
  typicalTimelineShort: string;
};

const ARCHETYPE_ES: Record<string, ArchetypeEsCopy> = {
  "swe-intern": {
    name: "Pasante de Ingeniería de Software",
    summary:
      "Construye y lanza funciones en una base de código real junto a ingenieros — generalmente web, móvil o servicios backend.",
    jargonNote:
      "Esto significa escribir el código que hace que una app o sitio web funcione — no diseñar cómo se ve, sino construir cómo opera.",
    typicalTimelineShort: "12–18 meses",
  },
  "pm-intern": {
    name: "Pasante de Product Manager",
    summary:
      "Trabaja entre usuarios, diseño e ingeniería — define qué construir, por qué y en qué orden.",
    jargonNote:
      "Un PM decide qué debería construir el equipo y por qué — piénsalo como el traductor entre usuarios, diseñadores e ingenieros.",
    typicalTimelineShort: "18–24 meses",
  },
  "data-analyst-intern": {
    name: "Pasante de Analista de Datos",
    summary:
      "Extrae datos, los limpia y los convierte en una gráfica, panel o recomendación que un equipo no técnico puede usar.",
    jargonNote:
      "Este rol saca números de bases de datos, los convierte en gráficas y le dice al equipo qué significan los datos.",
    typicalTimelineShort: "9–15 meses",
  },
  "ds-ml-intern": {
    name: "Pasante de Data Science / ML",
    summary:
      "Construye modelos o experimentos rigurosos que cambian una decisión de producto o de negocio.",
    jargonNote:
      "Esto es construir modelos de IA — enseñarle a una computadora a hacer predicciones o decisiones a partir de datos. Necesita más matemáticas que un rol de analista de datos.",
    typicalTimelineShort: "18–30 meses",
  },
  "ux-research-intern": {
    name: "Pasante de Investigación UX",
    summary:
      "Diseña y dirige estudios — entrevistas, encuestas, pruebas de usabilidad — que cambian lo que el equipo construye.",
    jargonNote:
      "Este rol habla con usuarios reales, hace estudios y reporta lo que la gente realmente necesita — para que diseñadores y PMs no tengan que adivinar.",
    typicalTimelineShort: "15–24 meses",
  },
  "product-design-intern": {
    name: "Pasante de Diseño de Producto",
    summary:
      "Diseña interfaces y flujos para un equipo de producto — a menudo trabajando de cerca con PMs e ingenieros.",
    jargonNote:
      "Esto es diseñar cómo se ve y funciona una app o sitio web — los botones, diseños y flujos con los que los usuarios realmente interactúan.",
    typicalTimelineShort: "12–24 meses",
  },
  "finance-analyst-intern": {
    name: "Pasante de Analista Financiero",
    summary:
      "Construye modelos, presentaciones y análisis para banca de inversión, finanzas corporativas o gestión de activos.",
    jargonNote:
      "Este rol construye modelos en hojas de cálculo, lee reportes financieros de empresas y ayuda a los equipos a decidir si un trato o inversión tiene sentido.",
    typicalTimelineShort: "12–24 meses",
  },
  "marketing-intern": {
    name: "Pasante de Marketing",
    summary:
      "Ayuda a ejecutar campañas, contenido, redes sociales o experimentos de crecimiento — a menudo analítico y creativo a la vez.",
    jargonNote:
      "Esto es lograr que la gente note y le importe un producto — a través de redes sociales, campañas, anuncios o contenido.",
    typicalTimelineShort: "9–15 meses",
  },
  "consulting-intern": {
    name: "Pasante de Consultoría",
    summary:
      "Ayuda a equipos cliente a estructurar problemas, reunir evidencia y recomendar un camino — generalmente en presentaciones.",
    jargonNote:
      "Los consultores ayudan a empresas externas a resolver problemas de negocio — entras, descubres qué está mal y presentas una recomendación en diapositivas.",
    typicalTimelineShort: "15–24 meses",
  },
  "hardware-intern": {
    name: "Pasante de Hardware / Embebidos",
    summary:
      "Diseña o programa sistemas físicos — PCBs, microcontroladores, robótica o procesamiento de señales.",
    jargonNote:
      "Esto es construir y programar cosas físicas — placas de circuito, robots, sensores — no solo software.",
    typicalTimelineShort: "15–24 meses",
  },
  "bio-research-intern": {
    name: "Pasante de Bioingeniería / Laboratorio",
    summary:
      "Se une a un laboratorio y contribuye con experimentos — pipetas, protocolos, datos y algún póster ocasional.",
    jargonNote:
      "Esto significa trabajar en un laboratorio de ciencia, hacer experimentos y recoger datos — usualmente el primer paso hacia medicina, farmacéutica o investigación académica.",
    typicalTimelineShort: "6–12 meses",
  },
  "devops-intern": {
    name: "Pasante de DevOps / SRE",
    summary:
      "Mantiene los servicios confiables y la experiencia de los desarrolladores rápida — CI/CD, infraestructura, observabilidad e incidentes.",
    jargonNote:
      "Este rol mantiene los servidores y herramientas que ejecutan el software funcionando bien — piénsalo como la plomería que mantiene las apps en línea.",
    typicalTimelineShort: "15–24 meses",
  },
  "healthcare-research-intern": {
    name: "Pasante de Investigación en Salud",
    summary:
      "Apoya a equipos de investigación médica o de salud pública con coordinación de estudios, limpieza de datos, materiales para pacientes o revisión de literatura.",
    jargonNote:
      "Esto significa ayudar a llevar a cabo estudios médicos o apoyar a equipos de hospital con datos y documentación — un primer paso común hacia medicina o salud pública.",
    typicalTimelineShort: "6–18 meses",
  },
  "nonprofit-intern": {
    name: "Pasante en Programa Comunitario / Sin Fines de Lucro",
    summary:
      "Ayuda a una organización con propósito social a organizar eventos, apoyar a voluntarios, escribir materiales, recoger datos o servir a una comunidad específica.",
    jargonNote:
      "Esto es trabajar para una organización cuyo objetivo es ayudar a la gente, no generar ganancias — podrías organizar eventos, gestionar voluntarios o escribir propuestas de financiamiento.",
    typicalTimelineShort: "3–12 meses",
  },
  "education-tutor-intern": {
    name: "Pasante de Educación / Tutoría",
    summary:
      "Trabaja directamente con estudiantes a través de tutoría, mentoría, apoyo en el salón, ayuda con el currículo o programas de acceso a la universidad.",
    jargonNote:
      "Esto significa trabajar directamente con estudiantes — dar tutoría, ser mentor o ayudar a dirigir programas extracurriculares o de acceso a la universidad.",
    typicalTimelineShort: "3–9 meses",
  },
  "bilingual-outreach-intern": {
    name: "Pasante de Difusión Bilingüe",
    summary:
      "Usa tu fluidez de idioma y cultura para ayudar a organizaciones a llegar a familias, estudiantes, pacientes o miembros de la comunidad que a menudo son ignorados.",
    jargonNote:
      "Este rol usa tu segundo idioma como una habilidad profesional — traduciendo, conectando comunidades con servicios y construyendo confianza a través de barreras de idioma.",
    typicalTimelineShort: "3–12 meses",
  },
};

const SKILL_OPTION_ES: Record<string, string> = {
  // Coding
  "intro CS course (CSE 8A / 11)": "curso intro de CS (CSE 8A / 11)",
  "data structures course (CSE 12 / 30)": "curso de estructuras de datos (CSE 12 / 30)",
  Python: "Python",
  "JavaScript or TypeScript": "JavaScript o TypeScript",
  Java: "Java",
  "C or C++": "C o C++",
  "HTML / CSS": "HTML / CSS",
  SQL: "SQL",
  "git basics": "fundamentos de git",
  "built a personal website": "construí un sitio web personal",
  "completed an online tutorial / bootcamp": "completé un tutorial / bootcamp en línea",

  // Data & analysis
  "Excel or Google Sheets": "Excel o Google Sheets",
  "Tableau / Power BI / Looker": "Tableau / Power BI / Looker",
  "pandas or R": "pandas o R",
  "intro statistics course": "curso intro de estadística",
  "Kaggle or DataFest project": "proyecto de Kaggle o DataFest",

  // Design & creative
  "Figma basics": "fundamentos de Figma",
  "Canva or Adobe": "Canva o Adobe",
  "wrote for a publication": "escribí para una publicación",
  "ran a social media account with real followers":
    "manejé una cuenta de redes con seguidores reales",
  "edited video": "edité video",

  // Research & lab
  "joined a research lab": "me uní a un laboratorio de investigación",
  "lab course (chem, bio, physics)": "curso de laboratorio (química, biología, física)",
  "read a research paper end-to-end": "leí un paper de investigación de principio a fin",
  "presented at a poster session": "presenté en una sesión de pósters",

  // Leadership & community
  "led a high-school club": "dirigí un club en la prepa",
  "ran an event (>20 people)": "organicé un evento (>20 personas)",
  "tutored or TA'd": "di tutoría o fui asistente de profesor",
  "founded something": "fundé algo",
  "volunteered consistently for a cause": "fui voluntario constantemente por una causa",
  "competitive sport / performing arts at a serious level":
    "deporte competitivo / artes escénicas a nivel serio",

  // Work & money
  "had a paid job (any kind)": "tuve un trabajo pagado (de cualquier tipo)",
  "freelanced or sold something": "trabajé como freelance o vendí algo",
  "managed a budget for an org": "manejé el presupuesto de una organización",
  "customer service experience": "experiencia en servicio al cliente",

  // Tools & misc
  "comfortable on the command line": "cómodo en la línea de comandos",
  "used Linux": "usé Linux",
  "AWS / GCP / Azure (free tier)": "AWS / GCP / Azure (capa gratuita)",
  "soldered or wired a circuit": "soldé o cableé un circuito",
  "CAD (Fusion / SolidWorks)": "CAD (Fusion / SolidWorks)",
  "spoke at a meetup or conference": "hablé en un meetup o conferencia",

  // Honest answers
  "nothing yet — first quarter": "nada todavía — primer trimestre",
  "I'm not sure what counts": "no estoy seguro de qué cuenta",
};

/**
 * Free-text fallback archetypes (when the user typed their own role) have
 * a `name`/`summary` but no `id`, so the helpers below accept the looser
 * shape and only consult the Spanish map when an id is present.
 */
type ArchetypeNameInput = { id?: string } & Pick<JobArchetype, "name">;
type ArchetypeSummaryInput = { id?: string } & Pick<JobArchetype, "summary">;
type ArchetypeJargonInput = { id?: string } & Pick<JobArchetype, "jargonNote">;
type ArchetypeTimelineInput = { id?: string } & Pick<JobArchetype, "typicalTimeline">;

export function tArchetypeName(archetype: ArchetypeNameInput, language: Language): string {
  if (language === "es" && archetype.id) {
    return ARCHETYPE_ES[archetype.id]?.name ?? archetype.name;
  }
  return archetype.name;
}

export function tArchetypeSummary(archetype: ArchetypeSummaryInput, language: Language): string {
  if (language === "es" && archetype.id) {
    return ARCHETYPE_ES[archetype.id]?.summary ?? archetype.summary;
  }
  return archetype.summary;
}

export function tArchetypeJargonNote(
  archetype: ArchetypeJargonInput,
  language: Language,
): string | undefined {
  if (language === "es" && archetype.id) {
    return ARCHETYPE_ES[archetype.id]?.jargonNote ?? archetype.jargonNote;
  }
  return archetype.jargonNote;
}

export function tArchetypeTimelineShort(
  archetype: ArchetypeTimelineInput,
  language: Language,
): string {
  if (language === "es" && archetype.id) {
    const es = ARCHETYPE_ES[archetype.id]?.typicalTimelineShort;
    if (es) return es;
  }
  return archetype.typicalTimeline.split("—")[0].trim();
}

export function tSkillOption(option: string, language: Language): string {
  if (language === "es") return SKILL_OPTION_ES[option] ?? option;
  return option;
}
