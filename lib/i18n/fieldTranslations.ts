import type { CareerField, FieldId } from "@/lib/plan/fields";
import type { Language } from "./translations";

/** Spanish copy for career field cards (step 1). English uses `fields.ts` canonical data. */
const FIELD_ES: Record<
  FieldId,
  { name: string; summary: string; sampleRoles: string[] }
> = {
  finance: {
    name: "Finanzas",
    summary:
      "Construye modelos, presentaciones y criterio de mercado para banca, inversión, finanzas corporativas y trabajo afín a consultoría.",
    sampleRoles: [
      "Analista de finanzas",
      "Analista de banca de inversión",
      "Pasante de finanzas corporativas",
      "Analista de consultoría",
    ],
  },
  data: {
    name: "Datos",
    summary:
      "Convierte información desordenada en análisis, paneles, experimentos y recomendaciones accionables.",
    sampleRoles: [
      "Analista de datos",
      "Científico de datos",
      "Ingeniero de analítica",
      "Pasante de ML",
    ],
  },
  swe: {
    name: "Ingeniería de software",
    summary:
      "Construye productos y sistemas con código: aplicaciones web, servicios backend, herramientas para desarrolladores y funciones en producción.",
    sampleRoles: [
      "Pasante de ingeniería de software",
      "Pasante full-stack",
      "Pasante backend",
      "Pasante de DevOps",
    ],
  },
  hardware: {
    name: "Hardware",
    summary:
      "Trabaja con sistemas físicos: circuitos, software embebido, robótica, sensores, PCB y prototipos mecánicos.",
    sampleRoles: [
      "Pasante de hardware",
      "Pasante de sistemas embebidos",
      "Pasante de robótica",
      "Pasante de ingeniería eléctrica",
    ],
  },
  outreach: {
    name: "Alcance comunitario",
    summary:
      "Genera confianza con personas y comunidades mediante programas, eventos, educación, marketing y trabajo de servicio.",
    sampleRoles: [
      "Pasante de programas comunitarios",
      "Pasante de marketing",
      "Pasante de educación",
      "Pasante de alcance bilingüe",
    ],
  },
  bioengineering: {
    name: "Bioingeniería",
    summary:
      "Conecta biología, ingeniería e investigación en laboratorio: protocolos, herramientas biotech y proyectos de salud.",
    sampleRoles: [
      "Pasante de bioingeniería",
      "Asistente de investigación en laboratorio húmedo",
      "Pasante de investigación en salud",
      "Pasante de bioinformática",
    ],
  },
};

export type CareerFieldCardCopy = {
  name: string;
  summary: string;
  sampleRoles: string[];
};

export function tCareerFieldCard(
  field: CareerField,
  language: Language,
): CareerFieldCardCopy {
  if (language === "en") {
    return {
      name: field.name,
      summary: field.summary,
      sampleRoles: field.sampleRoles,
    };
  }
  const es = FIELD_ES[field.id];
  return {
    name: es.name,
    summary: es.summary,
    sampleRoles: es.sampleRoles,
  };
}
