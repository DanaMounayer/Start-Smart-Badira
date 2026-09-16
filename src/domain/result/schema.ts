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
 * Two of the three readings are things the prototype genuinely determines.
 * The third is not, and says so.
 */

/** How much of what the assessment asked for it ended up holding. */
export type CoverageId = 'complete' | 'completeNoProfile' | 'partial' | 'limited'

/**
 * Risk.
 *
 * One state, and it is honest: no validated model is connected, so BADIRA has
 * no risk reading to give. The prototype does not stand in a category, a
 * probability, a priority or an action in its place — an invented risk state
 * is read as a recommendation however it is labelled.
 */
export type RiskReading = { state: 'awaitingModel' }

/**
 * How much information this particular assessment had behind it.
 *
 * Determined, not invented: the coverage id groups a count of what the
 * assessment asked for and what it ended up holding. Explicitly NOT a measure
 * of the user's health risk, and not a score.
 */
export type ReliabilityReading = { state: 'measured'; coverage: CoverageId }

/** Where the pregnancy was when this result was produced. */
export type TimeContext = {
  gestationalAge: GestationalAge | null
  /** ISO timestamp of the assessment. */
  assessedAt: string
  /**
   * The recorded point in the pregnancy, presented as context. Factual: no
   * clinical timing rule is invented, here or anywhere.
   */
  interpretation: { state: 'recorded' }
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
  /** True while this is a prototype result rather than a clinical one. */
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
