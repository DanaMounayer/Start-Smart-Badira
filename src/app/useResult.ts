import { useMemo } from 'react'
import { buildDemoResult } from '@/domain/result/demoResult'
import type { BadiraResult } from '@/domain/result/schema'
import { useSession } from './session'
import { useAssessment } from './assessmentSession'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The result for the current assessment run.
 *
 * Derived from the session and the answers still held by the assessment
 * provider, so navigating between result sub-screens preserves it without a
 * separate store. A real backend would fetch by id instead; the screens only
 * ever see a `BadiraResult`.
 */
export function useResult(): BadiraResult {
  const { profile } = useSession()
  const { answers } = useAssessment()
  const { t, language } = useLanguage()

  return useMemo(
    () => buildDemoResult({ profile, answers, t }),
    // `language` participates so labels re-resolve when the language changes.
    [profile, answers, t, language],
  )
}
