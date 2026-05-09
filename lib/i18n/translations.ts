export const translations = {
  en: {
    step1Heading: "Pick a direction — you can always change it.",
    quickContextLabel: "Anything that describes you?",
    contextLabel: "Anything else worth knowing?",
    contextPlaceholder:
      "Optional. e.g. 'I'm a transfer student' or 'I already have an internship lined up but want a stretch role'",
    chipSwitchingMajors: "I'm switching majors",
    chipTransfer: "I'm a transfer student",
    chipFirstGen: "I'm first-gen",
    chipWorkingPartTime: "I'm working part-time",
  },
  es: {
    step1Heading: "Elige una dirección — siempre puedes cambiarla.",
    quickContextLabel: "¿Algo que nos ayude a conocerte mejor?",
    contextLabel: "¿Algo más que debamos saber?",
    contextPlaceholder:
      "Opcional. Ejemplo: 'Soy estudiante de transferencia' o 'Ya tengo una pasantía, pero quiero un rol más ambicioso'",
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
