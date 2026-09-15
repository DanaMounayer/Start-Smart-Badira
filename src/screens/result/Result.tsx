import { useNavigate, useParams } from 'react-router-dom'
import { useResult } from '@/app/useResult'
import { useAssessment } from '@/app/assessmentSession'
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
  const result = useResult()
  const { reset } = useAssessment()
  const navigate = useNavigate()

  const actions = [
    { key: 'why', label: t('whyThisResult'), to: `/result/${id}/why` },
    { key: 'reliability', label: t('improveReliability'), to: `/result/${id}/reliability` },
    { key: 'report', label: t('detailedReport'), to: `/result/${id}/report` },
    { key: 'share', label: t('shareWithDoctor'), to: `/result/${id}/share` },
  ]

  return (
    <div className="result">
      <header className="result__head">
        <p className="result__eyebrow">{t('badiraResult')}</p>
        <Signature />
        {result.demo && <p className="demo-note">{t('demoResultNote')}</p>}
      </header>

      <RiskPanel risk={result.risk} resultId={id} />

      <div className="result__context">
        <ReliabilityPanel result={{ ...result, id }} />
        <TimePanel time={result.time} />
      </div>

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
