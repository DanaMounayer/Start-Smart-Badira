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
 * The simulated Risk output, in words. A fixed entry, not a mapping from
 * anything the user answered: the Result, the Report and the share text all
 * read the same three keys, so none of them can describe it as more than a
 * demonstration.
 */
export const RISK_COPY: Record<
  SimulatedRiskId,
  { titleKey: keyof Strings; categoryKey: keyof Strings; bodyKey: keyof Strings }
> = {
  elevatedPriority: {
    titleKey: 'riskSimulatedTitle',
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
