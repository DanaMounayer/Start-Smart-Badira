import type { Strings } from '@/i18n'
import type { CoverageId } from './schema'

/**
 * The one place a stored reading becomes words.
 *
 * Every screen resolves through this table, so the Result, the Report, the
 * share text and the history card cannot drift apart or describe the same
 * saved assessment differently.
 */

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
