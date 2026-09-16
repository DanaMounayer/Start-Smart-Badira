import { useMemo } from 'react'
import { buildDemoResult } from '@/domain/result/demoResult'
import type { BadiraResult } from '@/domain/result/schema'
import { useSession } from './session'
import { useAssessment } from './assessmentSession'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Builds a result from the answers currently in the assessment session.
 *
 * Used once, at the end of a run, to produce the snapshot that gets stored on
 * the record. Screens never call this — they read the stored result, so a
 * result URL cannot conjure a new one.
 */
export function useBuiltResult(): BadiraResult {
  const { profile } = useSession()
  const { answers } = useAssessment()
  const { t, language } = useLanguage()

  return useMemo(
    () => buildDemoResult({ profile, answers, t }),
    // `language` participates so labels re-resolve when the language changes.
    [profile, answers, t, language],
  )
}

/**
 * Reads a stored result by id.
 *
 * Returns null when no completed assessment matches, which is how the result
 * routes refuse a URL typed directly or reloaded after the session reset.
 */
export function useStoredResult(id: string | undefined): BadiraResult | null {
  const { assessments } = useSession()
  return useMemo(
    () => assessments.find((record) => record.id === id)?.result ?? null,
    [assessments, id],
  )
}
