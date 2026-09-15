import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'

const AXES = ['riskLabel', 'reliabilityLabel', 'timeLabel'] as const

/**
 * Transition between the assessment and the result.
 *
 * It names the three axes BADIRA considers and nothing else. No computation
 * runs, no progress is simulated against real work, and no value is produced —
 * the result system is not defined yet.
 */
export function Analyzing() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const [lit, setLit] = useState(0)

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const beat = reduced ? 220 : 620
    const timers = AXES.map((_, i) =>
      window.setTimeout(() => setLit(i + 1), beat * (i + 1)),
    )
    const done = window.setTimeout(
      () => navigate('/result/demo', { replace: true }),
      beat * (AXES.length + 1.4),
    )
    return () => {
      timers.forEach(window.clearTimeout)
      window.clearTimeout(done)
    }
  }, [navigate])

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
