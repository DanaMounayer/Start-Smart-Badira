import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useAssessment } from '@/app/assessmentSession'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Signature } from '@/components/result/Signature'
import { RiskPanel } from '@/components/result/RiskPanel'
import { ReliabilityPanel } from '@/components/result/ReliabilityPanel'
import { TimePanel } from '@/components/result/TimePanel'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Stage 3 — the BADIRA result.
 *
 * One story rather than three dashboard tiles: Risk carries the weight,
 * Reliability and Time sit beneath it as the context that qualifies it.
 * Everything else is one tap away.
 */
export function Result() {
  const { t } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useStoredResult(id)
  const { reset } = useAssessment()
  const { mode } = useSession()
  const navigate = useNavigate()

  // A result only exists for a completed assessment; a typed or reloaded URL
  // has nothing to show and is sent home rather than inventing a result.
  if (!result) return <Navigate to="/" replace />

  const actions = [
    { key: 'report', label: t('detailedReport'), to: `/result/${id}/report` },
    { key: 'share', label: t('shareWithDoctor'), to: `/result/${id}/share` },
  ]

  return (
    <div className="result">
      <header className="result__head">
        <p className="result__eyebrow">{t('badiraResult')}</p>
        <Signature asHeading />
        {result.demo && <p className="demo-note">{t('demoResultNote')}</p>}
      </header>

      <RiskPanel risk={result.risk} resultId={id} demo={result.demo} />

      <section className="context-stack" aria-label={t('resultContext')}>
        <ReliabilityPanel result={{ ...result, id }} />
        <TimePanel time={result.time} demo={result.demo} />
      </section>

      <nav className="list" aria-label={t('resultActions')}>
        {actions.map((action) => (
          <button
            key={action.key}
            type="button"
            className="list__row"
            onClick={() => navigate(action.to)}
          >
            <span className="list__label">{action.label}</span>
            <Chevron />
          </button>
        ))}
      </nav>

      {mode === 'guest' && (
        <section className="invite">
          <p className="invite__title">{t('guestSaveTitle')}</p>
          <p className="invite__body">{t('guestSaveBody')}</p>
          <button
            type="button"
            className="btn btn--tinted"
            onClick={() => navigate('/signin')}
          >
            {t('guestSaveAction')}
          </button>
        </section>
      )}

      <p className="result__disclaimer">{t('badiraDisclaimer')}</p>

      <button
        type="button"
        className="btn btn--ghost btn--block"
        onClick={() => {
          reset()
          navigate('/')
        }}
      >
        {t('backToHome')}
      </button>
    </div>
  )
}
