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
 * The third is a labelled simulation, and says so.
 */

/** How much of what the assessment asked for it ended up holding. */
export type CoverageId = 'complete' | 'completeNoProfile' | 'partial' | 'limited'

/**
 * The demonstration outputs Risk can carry. One, for now: a fixed value the
 * prototype shows so a demo audience can see the shape of a future model
 * output.
 */
export type SimulatedRiskId = 'elevatedPriority'

/**
 * Risk.
 *
 * No validated model is connected, and this reading does not pretend one is:
 * `simulated` is a fixed demonstration output, identical on every assessment.
 * It is deliberately not derived from symptoms, measurements, history,
 * missing information, Reliability or a lookup over any of them — a value
 * that moved with the answers would be read as a prediction. Every screen
 * that shows it labels it a simulation.
 */
export type RiskReading = { state: 'simulated'; category: SimulatedRiskId }

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
 * anything. The simulation produces none: a fixed value weighs nothing.
 */
export type InfluentialFactor = {
  id: string
  labelKey: keyof Strings
  source: InformationSource
}

export type BadiraResult = {
  id: string
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
