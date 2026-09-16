import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk — the result's centre of gravity.
 *
 * Contains no threshold, band or colour rule. It renders whichever reading it
 * is given: a simulated demonstration state in this prototype, plainly
 * labelled as one, or the awaiting-model notice when no reading exists.
 */
export function RiskPanel({
  risk,
  resultId,
  demo,
}: {
  risk: RiskReading
  resultId: string
  /** Marks an available reading as demonstration content, not a prediction. */
  demo: boolean
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  // One pill for the reading's provenance: awaiting the model, or a
  // simulated demonstration state.
  const tag =
    risk.state === 'awaitingModel'
      ? t('awaitingModelShort')
      : demo
        ? t('simulatedShort')
        : null

  return (
    <section className="risk">
      <div className="risk__head">
        <p className="risk__eyebrow">{t('riskLabel')}</p>
        {tag && <span className="tagline-pill">{tag}</span>}
      </div>

      {risk.state === 'awaitingModel' ? (
        <>
          <h2 className="risk__headline">{t('riskAwaitingTitle')}</h2>
          <p className="risk__body">{t('riskAwaitingBody')}</p>
        </>
      ) : (
        <>
          {/* The oversized treatment belongs to a number. A label alone reads
              at the panel's normal headline size. */}
          <h2 className={`risk__headline${risk.value ? ' risk__headline--value' : ''}`}>
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
