import type { Strings } from '@/i18n'
import type { PregnancyProfile } from '@/domain/types'

/**
 * Data-driven assessment schema.
 *
 * Questions, their options and their visibility rules are DATA, not markup.
 * The step screen renders whatever the engine says is visible, so changing the
 * assessment means editing the spec — not editing a screen.
 *
 * Nothing here encodes clinical meaning. Visibility rules are interaction
 * logic only: they decide what to *ask*, never what anything *means*.
 */

export type StepId = 'about' | 'measurements' | 'symptoms' | 'changes'

export const STEP_ORDER: StepId[] = ['about', 'measurements', 'symptoms', 'changes']

/** Why a question has no usable answer. Stage 3 consumes this for Reliability. */
export type MissingReason = 'unknown' | 'unavailable' | 'skipped'

export type Answer =
  | { kind: 'choice'; values: string[] }
  | { kind: 'number'; value: number }
  /**
   * A reading being typed. Either half may still be empty — without that the
   * first digit of a pair could not be held anywhere, and the field would
   * clear itself as the user typed.
   */
  | { kind: 'bp'; systolic: number | ''; diastolic: number | '' }
  | { kind: 'fromProfile' }
  | { kind: 'missing'; reason: MissingReason }

export type Answers = Record<string, Answer | undefined>

/** Everything a visibility rule may read. */
export type RuleContext = {
  answers: Answers
  profile: PregnancyProfile | null
}

export type Option = {
  id: string
  labelKey: keyof Strings
  /** Clears every other selection when chosen (e.g. "None of these"). */
  exclusive?: boolean
}

export type Question = {
  id: string
  step: StepId
  promptKey: keyof Strings
  hintKey?: keyof Strings
  kind: 'single' | 'multi' | 'number' | 'bloodPressure'
  options?: Option[]
  /** Unit shown beside a number field, already an i18n key. */
  unitKey?: keyof Strings
  /** Offers "I don't know / not sure". */
  allowUnknown?: boolean
  /** Offers "Not available". */
  allowUnavailable?: boolean
  /** Offers "Skip for now". */
  allowSkip?: boolean
  /**
   * A saved value this question can reuse instead of asking again. Returning
   * null means nothing is saved, so the question is asked plainly.
   */
  savedValue?: (profile: PregnancyProfile | null) => SavedValue | null
  /** Shown only when this returns true. Absent means always shown. */
  when?: (context: RuleContext) => boolean
}

export type SavedValue = {
  /** Display text, already formatted. */
  display: string
  /** When it was recorded, ISO date. */
  recordedAt: string
}

export type AssessmentSpec = {
  questions: Question[]
}

/** Convenience for rules: the ids selected for a question, or an empty list. */
export const selected = (answers: Answers, questionId: string): string[] => {
  const answer = answers[questionId]
  return answer?.kind === 'choice' ? answer.values : []
}

export const hasSelected = (
  answers: Answers,
  questionId: string,
  optionId: string,
): boolean => selected(answers, questionId).includes(optionId)
