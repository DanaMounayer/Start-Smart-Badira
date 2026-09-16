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

/**
 * Everything the prototype may know about a user's pregnancy.
 *
 * Almost every field is nullable: a partially complete profile is a valid
 * state. Onboarding fills sections over time, and a profile with gaps simply
 * gives BADIRA less to work with.
 */
export type PregnancyProfile = {
  id: string
  firstName: string
  age: number | null
  /** 1 = first pregnancy, 2 = second, and so on. */
  pregnancyNumber: number | null
  gestationalAge: GestationalAge | null
  /** Estimated due date, ISO date string. */
  estimatedDueDate: string | null
  bmi: number | null
  chronicConditions: string[]
  familyHistory: string[]
  previousPregnancies: PreviousPregnancy[]
  bloodPressureReadings: BloodPressureReading[]
  /** Symptoms the user has reported. Empty means none reported. */
  reportedSymptoms: string[]
  lastUpdatedAt: string
}
