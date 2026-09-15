export const en = {
  appName: 'BADIRA',
  tagline: 'Early awareness companion for preeclampsia',
  languageName: 'English',
  switchLanguage: 'العربية',
  setupTitle: 'Prototype shell is running',
  setupBody:
    'The project structure, bilingual layout and styling are in place. The three product screens have not been built yet.',
  nextUpTitle: 'Next up',
  screen1: 'Pregnancy profile / dashboard',
  screen2: 'Adaptive predictive assessment',
  screen3: 'Risk × Reliability × Time result',
  modelTitle: 'Assessment model',
  modelBody:
    'BADIRA evaluates Risk, the Reliability of that risk given the information available, and Time — how promptly professional assessment may be needed.',
  disclaimer:
    'BADIRA is not a symptom checker and does not diagnose or treat. It supports earlier awareness and never replaces professional medical assessment.',
  notImplemented: 'Not implemented in this prototype yet.',
}

/** Every dictionary must supply exactly these keys. */
export type Strings = Record<keyof typeof en, string>
