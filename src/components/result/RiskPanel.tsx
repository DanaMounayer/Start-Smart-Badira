import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { RISK_COPY } from '@/domain/result/copy'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk.
 *
 * Reads as the result it is: the state, what the state means, and the way in.
 * The one mark that it is not a live reading is the small tag beside the axis
 * — said once, where it belongs, rather than repeated through the headline
 * and the copy.
 */
export function RiskPanel({ risk, resultId }: { risk: RiskReading; resultId: string }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const copy = RISK_COPY[risk.category]

  return (
    <section className="risk">
      <div className="risk__head">
        <p className="risk__eyebrow">
          {t('riskLabel')}
          {risk.state === 'simulated' && (
            <span className="risk__tag">{t('simulationTag')}</span>
          )}
        </p>
      </div>

      <h2 className="risk__headline">{t(copy.categoryKey)}</h2>
      <p className="risk__body">{t(copy.bodyKey)}</p>

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
