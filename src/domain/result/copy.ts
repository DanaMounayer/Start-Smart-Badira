import type { Strings } from '@/i18n'
import type { CoverageId, SimulatedRiskId } from './schema'

/**
 * The one place a stored reading becomes words.
 *
 * Every screen resolves through this table, so the Result, the Report, the
 * share text and the history card cannot drift apart or describe the same
 * saved assessment differently.
 */

/**
 * The Risk state, in words: what it is called, and what it means. The Result,
 * the Report and the share text read the same two keys, so none of them can
 * name the state differently.
 */
export const RISK_COPY: Record<
  SimulatedRiskId,
  { categoryKey: keyof Strings; bodyKey: keyof Strings }
> = {
  elevatedPriority: {
    categoryKey: 'riskSimulatedCategory',
    bodyKey: 'riskSimulatedBody',
  },
}

export const COVERAGE_COPY: Record<
  CoverageId,
  { labelKey: keyof Strings; bodyKey: keyof Strings }
> = {
  complete: {
    labelKey: 'reliabilitySimCompleteLabel',
    bodyKey: 'reliabilitySimCompleteBody',
  },
  completeNoProfile: {
    labelKey: 'reliabilitySimGuestLabel',
    bodyKey: 'reliabilitySimGuestBody',
  },
  partial: {
    labelKey: 'reliabilitySimPartialLabel',
    bodyKey: 'reliabilitySimPartialBody',
  },
  limited: {
    labelKey: 'reliabilitySimLimitedLabel',
    bodyKey: 'reliabilitySimLimitedBody',
  },
}
