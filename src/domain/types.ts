/**
 * Core domain types for BADIRA.
 *
 * These describe the *shape* of the information the product reasons about.
 * They deliberately contain no clinical thresholds or scoring rules.
 */

/** Everything the prototype may know about a user's pregnancy. */
export type PregnancyProfile = {
  id: string
  displayName: string
  /** Completed weeks of gestation, when known. */
  gestationalWeek: number | null
  medicalHistory: string[]
  previousPregnancies: string[]
  familyHistory: string[]
  measurements: Measurement[]
  reportedSymptoms: string[]
  lastUpdatedAt: string
}

/** A single recorded value, e.g. a blood-pressure reading. */
export type Measurement = {
  id: string
  kind: string
  value: number
  unit: string
  recordedAt: string
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
