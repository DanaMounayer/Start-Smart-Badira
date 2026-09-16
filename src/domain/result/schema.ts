import type { Strings } from '@/i18n'
import type { GestationalAge } from '@/domain/types'

/**
 * The shape of a BADIRA result.
 *
 * Risk, Reliability and Time are three separate readings and are never
 * combined into one score.
 *
 * Nothing here holds user-facing text. A result is stored on the record that
 * produced it and outlives the language it was made in, so it carries ids and
 * i18n keys only and every screen resolves them at render. Storing resolved
 * strings is what froze a result in the language it was completed in.
 *
 * Each reading keeps its `awaitingModel` state for the day a validated model
 * is connected and the prototype's simulation is no longer what is shown.
 */

/**
 * A simulated screening-priority state. Ids only — the wording lives in the
 * dictionaries, and the mapping from an assessment to one of these lives in
 * `demoPriority.ts`, which explains how arbitrary it is.
 */
export type PriorityId = 'routine' | 'earlier' | 'closer'

/** How much of what the assessment asked for it ended up holding. */
export type CoverageId = 'complete' | 'completeNoProfile' | 'partial' | 'limited'

export type RiskReading =
  | { state: 'awaitingModel' }
  | { state: 'simulated'; priority: PriorityId }

/**
 * How much information this particular assessment had behind it.
 *
 * Explicitly NOT a measure of the user's health risk, and not a score: the
 * coverage id below groups a count of what was and was not provided.
 */
export type ReliabilityReading =
  | { state: 'awaitingModel' }
  | { state: 'simulated'; coverage: CoverageId }

/** Where the pregnancy was when this result was produced. */
export type TimeContext = {
  gestationalAge: GestationalAge | null
  /** ISO timestamp of the assessment. */
  assessedAt: string
  /**
   * What this timing means. The prototype presents the recorded point in the
   * pregnancy and says so; no timing rule is invented.
   */
  interpretation: { state: 'awaitingModel' } | { state: 'simulated' }
}

export type InformationSource = 'profile' | 'assessment'

export type InformationStatus =
  /** BADIRA holds a value for this. */
  | 'provided'
  /** The user marked it unknown, unavailable or skipped. */
  | 'unavailable'

/** One piece of information the assessment did or did not have. */
export type InformationItem = {
  id: string
  /** An i18n key, never a resolved string — see the note at the top. */
  labelKey: keyof Strings
  source: InformationSource
  status: InformationStatus
}

/**
 * A factor the model weighed. Populated only from a model's own explanation
 * output — never inferred by the UI, and never described as having caused
 * anything. The simulation produces none: it has no weights to report.
 */
export type InfluentialFactor = {
  id: string
  labelKey: keyof Strings
  source: InformationSource
}

export type BadiraResult = {
  id: string
  /** True when the readings are demonstration content rather than clinical. */
  demo: boolean
  risk: RiskReading
  reliability: ReliabilityReading
  time: TimeContext
  /** Factual inventory drawn from the profile and this assessment. */
  information: InformationItem[]
  /** Model explanation output. Empty in the prototype. */
  factors: InfluentialFactor[]
}

export const countBy = (
  items: InformationItem[],
  status: InformationStatus,
): number => items.filter((item) => item.status === status).length
