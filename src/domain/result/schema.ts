import type { GestationalAge } from '@/domain/types'

/**
 * The shape of a BADIRA result.
 *
 * Risk, Reliability and Time are three separate readings and are never
 * combined into one score. Each model-derived reading is a discriminated
 * union whose default state is `awaitingModel`: no validated prediction model
 * is connected, so there is nothing to report and the UI says so rather than
 * showing a placeholder number.
 *
 * When a validated model arrives it supplies the `available` variant. No
 * component contains a threshold, band or cutoff — the UI renders whatever
 * valid result object it is given.
 */

/** BADIRA's estimated risk. Labels and any value come from the model. */
export type RiskReading =
  | { state: 'awaitingModel' }
  | {
      state: 'available'
      /** Model-supplied classification, already localized. */
      label: string
      /** Optional numeric output, if the validated model provides one. */
      value?: { amount: number; unit: 'percent' }
      /** Plain-language summary, model-supplied. */
      summary: string
    }

/**
 * How well the available information supports this particular prediction.
 *
 * Explicitly NOT a measure of the user's health risk. There is no formula
 * here and none is invented; the counts the UI shows are a factual inventory
 * of what the assessment did and did not have.
 */
export type ReliabilityReading =
  | { state: 'awaitingModel' }
  | { state: 'available'; label: string; summary: string }

/** Where the pregnancy was when this result was produced. */
export type TimeContext = {
  gestationalAge: GestationalAge | null
  /** ISO timestamp of the assessment. */
  assessedAt: string
  /**
   * Why this timing matters clinically. Awaiting validated interpretation —
   * no timing rule is invented.
   */
  interpretation: { state: 'awaitingModel' } | { state: 'available'; summary: string }
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
  label: string
  source: InformationSource
  status: InformationStatus
}

/**
 * A factor the model weighed. Populated only from the model's own
 * explanation output — never inferred by the UI, and never described as
 * having caused anything.
 */
export type InfluentialFactor = {
  id: string
  label: string
  source: InformationSource
}

export type BadiraResult = {
  id: string
  /** True when any model-derived content is demonstration data, not clinical. */
  demo: boolean
  risk: RiskReading
  reliability: ReliabilityReading
  time: TimeContext
  /** Factual inventory drawn from the profile and this assessment. */
  information: InformationItem[]
  /** Model explanation output. Empty until a model supplies it. */
  factors: InfluentialFactor[]
}

export const countBy = (
  items: InformationItem[],
  status: InformationStatus,
): number => items.filter((item) => item.status === status).length
