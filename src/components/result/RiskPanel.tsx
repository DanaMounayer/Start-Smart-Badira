import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk.
 *
 * The prototype has no validated model, so this panel says exactly that and
 * shows nothing in its place. It holds the position Risk will occupy, which
 * is the honest thing to demonstrate: a stand-in category or priority reads
 * as a recommendation however carefully it is labelled.
 */
export function RiskPanel({ risk, resultId }: { risk: RiskReading; resultId: string }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="risk risk--pending">
      <div className="risk__head">
        <p className="risk__eyebrow">{t('riskLabel')}</p>
      </div>

      {risk.state === 'awaitingModel' && (
        <>
          <h2 className="risk__headline">{t('riskNotConnectedTitle')}</h2>
          <p className="risk__body">{t('riskNotConnectedBody')}</p>
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
