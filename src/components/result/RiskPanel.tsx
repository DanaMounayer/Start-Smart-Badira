import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk — the result's centre of gravity.
 *
 * Contains no threshold, band or colour rule. When the model has not produced
 * a reading, the panel says so plainly instead of showing a placeholder
 * number that could be mistaken for an estimate.
 */
export function RiskPanel({ risk, resultId }: { risk: RiskReading; resultId: string }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="risk">
      <div className="risk__head">
        <p className="risk__eyebrow">{t('riskLabel')}</p>
        {risk.state === 'awaitingModel' && (
          <span className="tagline-pill">{t('awaitingModelShort')}</span>
        )}
      </div>

      {risk.state === 'awaitingModel' ? (
        <>
          <h2 className="risk__headline">{t('riskAwaitingTitle')}</h2>
          <p className="risk__body">{t('riskAwaitingBody')}</p>
        </>
      ) : (
        <>
          <h2 className="risk__headline risk__headline--value">
            {risk.label}
            {risk.value && (
              <span className="risk__value">
                {risk.value.amount}
                {risk.value.unit === 'percent' ? '%' : ''}
              </span>
            )}
          </h2>
          <p className="risk__body">{risk.summary}</p>
        </>
      )}

      <button
        type="button"
        className="risk__link"
        onClick={() => navigate(`/result/${resultId}/why`)}
      >
        {t('whyThisResult')}
        <Chevron />
      </button>
    </section>
  )
}
