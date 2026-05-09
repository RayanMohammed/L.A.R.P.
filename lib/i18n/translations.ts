export const translations = {
  en: {
    step1Heading: "Pick a direction — you can always change it.",
    quickContextLabel: "Which best describes you?",
    contextLabel: "Anything else worth knowing?",
    contextPlaceholder:
      "Optional. e.g. 'I'm a transfer student' or 'I already have an internship lined up but want a stretch role'",
    chipFirstYear: "I'm a first year",
    chipSwitchingMajors: "I'm switching majors",
    chipTransfer: "I'm a transfer student",
    chipFirstGen: "I'm first-gen",
    chipWorkingPartTime: "I'm working part-time",
  },
  es: {
    step1Heading: "Elige una dirección — siempre puedes cambiarla.",
    quickContextLabel: "¿Cuál te describe mejor?",
    contextLabel: "¿Algo más que debamos saber?",
    contextPlaceholder:
      "Opcional. Ejemplo: 'Soy estudiante de transferencia' o 'Ya tengo una pasantía, pero quiero un rol más ambicioso'",
    chipFirstYear: "Estoy en primer año",
    chipSwitchingMajors: "Estoy cambiando de carrera",
    chipTransfer: "Soy estudiante de transferencia",
    chipFirstGen: "Soy primera generación",
    chipWorkingPartTime: "Trabajo mientras estudio",
  },
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, language: Language = "en"): string {
  return translations[language][key];
}
