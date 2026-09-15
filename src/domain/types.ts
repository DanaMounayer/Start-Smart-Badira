/**
 * Core domain types for BADIRA.
 *
 * These describe the *shape* of the information the product reasons about.
 * They deliberately contain no clinical thresholds or scoring rules.
 */

/** Gestational age expressed the way clinicians and users say it: "12w+4d". */
export type GestationalAge = {
  weeks: number
  days: number
}

/** A blood-pressure reading. Both values share one unit (mmHg). */
export type BloodPressureReading = {
  id: string
  systolic: number
  diastolic: number
  recordedAt: string
  /** Where the reading came from, e.g. self-measured at home. */
  source: 'home' | 'clinic'
}

/** A previous pregnancy and what is known about it. */
export type PreviousPregnancy = {
  id: string
  year: number | null
  /** Whether preeclampsia occurred. `null` means not known. */
  hadPreeclampsia: boolean | null
}

/** Everything the prototype may know about a user's pregnancy. */
export type PregnancyProfile = {
  id: string
  firstName: string
  age: number
  /** 1 = first pregnancy, 2 = second, and so on. */
  pregnancyNumber: number
  gestationalAge: GestationalAge
  /** Estimated due date, ISO date string. */
  estimatedDueDate: string
  bmi: number | null
  chronicConditions: string[]
  familyHistory: string[]
  previousPregnancies: PreviousPregnancy[]
  bloodPressureReadings: BloodPressureReading[]
  /** Symptoms the user has reported. Empty means none reported. */
  reportedSymptoms: string[]
  lastUpdatedAt: string
}

/** How confident the system is allowed to be, given the inputs it has. */
export type ReliabilityLevel = 'insufficient' | 'limited' | 'adequate'

/** Relative risk band. Bands are labels only — no thresholds are defined here. */
export type RiskLevel = 'unknown' | 'low' | 'moderate' | 'elevated'

/** How promptly professional assessment may be warranted. */
export type TimeUrgency = 'unknown' | 'routine' | 'soon' | 'prompt'

/** Information the system needs but does not have. */
export type MissingInput = {
  field: string
  /** Why this input matters, expressed as an i18n-able key or plain text. */
  reason: string
}

/**
 * The combined output of the assessment layer.
 *
 * Risk and Reliability are reported separately on purpose: a prediction the
 * system cannot stand behind must surface `missingInputs` instead of a
 * confident risk band.
 */
export type AssessmentResult = {
  risk: RiskLevel
  reliability: ReliabilityLevel
  time: TimeUrgency
  missingInputs: MissingInput[]
  /** Human-readable notes supporting the result. */
  rationale: string[]
}
