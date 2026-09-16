import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { PRIORITY_COPY } from '@/domain/result/copy'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk — the result's centre of gravity.
 *
 * Contains no threshold, band or colour rule. It renders whichever reading it
 * is given: the prototype's simulated screening-priority state, labelled as a
 * simulation, or the awaiting-model notice when no reading exists.
 */
export function RiskPanel({ risk, resultId }: { risk: RiskReading; resultId: string }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="risk">
      <div className="risk__head">
        <p className="risk__eyebrow">{t('riskLabel')}</p>
        <span className="tagline-pill">
          {risk.state === 'awaitingModel' ? t('awaitingModelShort') : t('simulatedShort')}
        </span>
      </div>

      {risk.state === 'awaitingModel' ? (
        <>
          <h2 className="risk__headline">{t('riskAwaitingTitle')}</h2>
          <p className="risk__body">{t('riskAwaitingBody')}</p>
        </>
      ) : (
        <>
          <h2 className="risk__headline">{t(PRIORITY_COPY[risk.priority].labelKey)}</h2>
          <p className="risk__body">{t(PRIORITY_COPY[risk.priority].bodyKey)}</p>
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
