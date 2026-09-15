export const en = {
  // --- Shell ---
  appName: 'BADIRA',
  tagline: 'Early awareness companion for preeclampsia',
  switchLanguage: 'العربية',
  disclaimer:
    'BADIRA is not a symptom checker and does not diagnose or treat. It supports earlier awareness and never replaces professional medical assessment.',
  notImplemented: 'This part of the prototype has not been built yet.',
  back: 'Back',

  // --- Greeting / session ---
  greeting: 'Hello, Sara',
  signedInAs: 'Signed in · profile saved',
  welcomeBack: 'Your pregnancy profile and previous information are saved.',

  // --- Gestation ---
  gestationLabel: 'Gestational age',
  weeksShort: 'w',
  daysShort: 'd',
  trimester1: 'First trimester',
  trimester2: 'Second trimester',
  trimester3: 'Third trimester',
  weeksToGo: 'weeks to term',
  dueDate: 'Estimated due date',
  progressLabel: 'Pregnancy progress',

  // --- Profile summary ---
  profileTitle: 'Your Pregnancy Profile',
  profileSubtitle: 'Saved information BADIRA already knows about you',
  age: 'Age',
  years: 'years',
  pregnancyNumber: 'Pregnancy',
  secondPregnancy: 'Second pregnancy',
  previousPregnancy: 'Previous pregnancy',
  noPreeclampsiaBefore: 'No preeclampsia',
  chronicConditionsLabel: 'Chronic conditions',
  chronicHypertension: 'Chronic hypertension',
  familyHistoryLabel: 'Family history',
  motherPreeclampsia: 'Mother had preeclampsia',
  bmi: 'BMI',
  bmiUnit: 'kg/m²',
  symptomsLabel: 'Current symptoms',
  noSymptoms: 'None reported',

  // --- Measurements ---
  measurementsTitle: 'Recent Measurements',
  measurementsSubtitle: 'BADIRA looks at your readings over time, not just today',
  bloodPressure: 'Blood pressure',
  systolic: 'Systolic',
  diastolic: 'Diastolic',
  mmhg: 'mmHg',
  latest: 'Latest',
  readingsCount: 'readings saved',
  sourceHome: 'Home',
  sourceClinic: 'Clinic',
  chartTitle: 'Blood pressure over time',
  chartTableView: 'View as table',
  chartDate: 'Date',

  // --- Freshness ---
  lastUpdated: 'Profile last updated',
  updatedToday: 'Today',

  // --- How BADIRA uses the data ---
  howItWorksTitle: 'How BADIRA uses this',
  howItWorksBody:
    'BADIRA combines your current and saved information to assess Risk, the Reliability of that assessment given what is known, and Time — how promptly professional assessment may be needed.',
  riskLabel: 'Risk',
  reliabilityLabel: 'Reliability',
  timeLabel: 'Time',
  noResultYet: 'No assessment has been run yet.',

  // --- Actions ---
  startAssessment: 'Start Assessment',
  updateInformation: 'Update or add information',
  addMeasurement: 'Add a new measurement',
} as const

/** Every dictionary must supply exactly these keys. */
export type Strings = Record<keyof typeof en, string>
