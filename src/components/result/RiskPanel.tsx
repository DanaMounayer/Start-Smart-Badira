import { useNavigate } from 'react-router-dom'
import type { RiskReading } from '@/domain/result/schema'
import { RISK_COPY } from '@/domain/result/copy'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Risk.
 *
 * The prototype has no validated model, so what this panel holds is a fixed
 * demonstration output and it is labelled three times over: a Simulation tag
 * beside the axis, a headline that names it a simulated result, and body copy
 * that says plainly it is not a clinical prediction. Nothing here is derived
 * from the assessment — the panel only resolves what the result already
 * carries.
 */
export function RiskPanel({ risk, resultId }: { risk: RiskReading; resultId: string }) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const copy = RISK_COPY[risk.category]

  return (
    <section className="risk risk--simulated">
      <div className="risk__head">
        <p className="risk__eyebrow">{t('riskLabel')}</p>
        <span className="tagline-pill">{t('simulationTag')}</span>
      </div>

      <h2 className="risk__headline">{t(copy.titleKey)}</h2>
      <p className="risk__category">{t(copy.categoryKey)}</p>
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
