import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useBuiltResult } from '@/app/useResult'
import { useSession } from '@/app/session'
import { countBy } from '@/domain/result/schema'

const AXES = ['riskLabel', 'reliabilityLabel', 'timeLabel'] as const

/**
 * Transition between the assessment and the result.
 *
 * It names the three axes BADIRA considers and nothing else. No computation
 * runs, no progress is simulated against real work, and no value is produced —
 * the result system is not defined yet.
 *
 * This is also where a run becomes a record: completing the assessment creates
 * exactly one, and the result route then renders that record.
 */
export function Analyzing() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const built = useBuiltResult()
  const { recordAssessment } = useSession()
  const [lit, setLit] = useState(0)
  // Guards against a second record if this effect re-runs.
  const recorded = useRef<string | null>(null)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const beat = reduced ? 220 : 620
    const timers = AXES.map((_, i) =>
      window.setTimeout(() => setLit(i + 1), beat * (i + 1)),
    )
    const done = window.setTimeout(() => {
      if (!recorded.current) {
        const id = `a${Date.now().toString(36)}`
        recorded.current = id
        recordAssessment({
          id,
          completedAt: built.time.assessedAt,
          gestationalAge: built.time.gestationalAge,
          informationProvided: countBy(built.information, 'provided'),
          informationUnavailable: countBy(built.information, 'unavailable'),
          result: { ...built, id },
        })
      }
      navigate(`/result/${recorded.current}`, { replace: true })
    }, beat * (AXES.length + 1.4))
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(done)
    }
  }, [navigate, built, recordAssessment])

  return (
    <div className="analyzing" role="status" aria-live="polite">
      <div className="analyzing__pulse" aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <p className="analyzing__title">{t('analyzingTitle')}</p>

      <ul className="analyzing__axes">
        {AXES.map((axis, i) => (
          <li key={axis} className={`analyzing__axis${i < lit ? ' is-lit' : ''}`}>
            {t(axis)}
          </li>
        ))}
      </ul>

      <p className="fineprint fineprint--center">{t('analyzingNote')}</p>
    </div>
  )
}
