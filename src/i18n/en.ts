export const en = {
  // --- Shell ---
  appName: 'BADIRA',
  switchLanguage: 'العربية',
  yourProfile: 'Your profile',
  back: 'Back',
  disclaimer: 'Not a diagnosis. BADIRA supports earlier awareness only.',
  disclaimerFull:
    'BADIRA is not a symptom checker and does not diagnose or treat. It supports earlier awareness and never replaces professional medical assessment.',
  notImplemented: 'This part of the prototype has not been built yet.',

  // --- Entry / guest ---
  tagline: 'Know earlier. Act at the right time.',
  signIn: 'Sign in',
  continueAsGuest: 'Continue as guest',
  guestNote: 'As a guest, nothing is saved. BADIRA will have less to work with, which lowers the Reliability of its assessment.',
  greetingGuest: 'Welcome',
  guestHeroTitle: 'No pregnancy information yet',
  guestHeroBody: 'Add a few details and BADIRA can give a more reliable assessment. You can also start now with what you have.',
  guestReliabilityHint: 'Without saved history, Reliability will be limited.',
  addMyInformation: 'Add my information',
  dueShort: 'Due',
  quickAccess: 'Your information',
  navProfile: 'Profile',
  navProfileMeta: 'Full details',
  navHistory: 'Measurements',
  navAssessments: 'Assessments',
  noAssessmentsYet: 'None yet',
  noAssessmentsTitle: 'No assessments yet',
  noAssessmentsBody: 'When you complete a BADIRA assessment, its Risk, Reliability and Time result is saved here so you can compare over time.',
  reliabilityHint: 'Your latest weight and any symptoms are missing.',
  reliabilityHintAction: 'Add them',
  // --- Pregnancy header ---
  greeting: 'Hello, Sara',
  weeksWord: 'weeks',
  daysWord: 'days',
  trimester1: 'First trimester',
  trimester2: 'Second trimester',
  trimester3: 'Third trimester',
  weeksToGo: 'weeks to go',
  progressLabel: 'Pregnancy progress',

  // --- Check-in card ---
  checkInEyebrow: "Today's check-in",
  checkInTitle: 'Your saved profile is ready',
  chipProfileSaved: 'Profile saved',
  chipRecentReadings: 'recent readings',
  chipUpdatedToday: 'Updated today',
  chipUpdatedRecently: 'Recently updated',

  // --- Snapshot ---
  snapshotTitle: 'Health snapshot',
  viewHistory: 'View history',
  chronicHypertension: 'Chronic hypertension',
  familyHistoryChip: 'Family history',
  bmi: 'BMI',
  bloodPressure: 'Blood pressure',
  mmhg: 'mmHg',

  // --- Actions ---
  startAssessment: 'Start BADIRA Assessment',
  ctaSupport:
    'BADIRA will use your current and saved information to assess Risk × Reliability × Time.',
  updateInformation: 'Update my information',

  // --- History view ---
  historyTitle: 'Measurement history',
  chartTitle: 'Blood pressure over time',
  measurementsSubtitle: 'BADIRA looks at your readings over time, not just today',
  allReadings: 'All readings',
  systolic: 'Systolic',
  diastolic: 'Diastolic',
  chartTableView: 'View as table',
  chartDate: 'Date',
  sourceHome: 'Home',
  sourceClinic: 'Clinic',

  // --- Profile view ---
  profileTitle: 'Your pregnancy profile',
  profileSubtitle: 'Saved information BADIRA already knows about you',
  age: 'Age',
  years: 'years',
  pregnancyNumber: 'Pregnancy',
  secondPregnancy: 'Second pregnancy',
  previousPregnancy: 'Previous pregnancy',
  noPreeclampsiaBefore: 'No preeclampsia',
  chronicConditionsLabel: 'Chronic conditions',
  familyHistoryLabel: 'Family history',
  motherPreeclampsia: 'Mother had preeclampsia',
  bmiUnit: 'kg/m²',
  symptomsLabel: 'Current symptoms',
  noSymptoms: 'None reported',
  lastUpdated: 'Last updated',
  updatedToday: 'Today',
} as const

/** Every dictionary must supply exactly these keys. */
export type Strings = Record<keyof typeof en, string>
