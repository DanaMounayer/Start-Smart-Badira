import { useNavigate } from 'react-router-dom'
import { countBy, type BadiraResult } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Reliability — how well the available information supports this prediction.
 *
 * Kept visually distinct from Risk and captioned as such, because the two are
 * easy to confuse. The counts shown are a factual inventory of the
 * assessment's inputs, not a score: no reliability formula exists yet and
 * none is invented here.
 */
export function ReliabilityPanel({ result }: { result: BadiraResult }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  const provided = countBy(result.information, 'provided')
  const unavailable = countBy(result.information, 'unavailable')

  // One pill for the reading's provenance: awaiting the model, or a
  // simulated demonstration state.
  const tag =
    result.reliability.state === 'awaitingModel'
      ? t('awaitingModelShort')
      : result.demo
        ? t('simulatedShort')
        : null

  return (
    <section className="context-panel">
      <div className="context-panel__head">
        <h3 className="panel-title">{t('reliabilityLabel')}</h3>
        {tag && <span className="tagline-pill">{tag}</span>}
      </div>

      {result.reliability.state === 'available' ? (
        <>
          <p className="context-panel__reading">{result.reliability.label}</p>
          <p className="context-panel__note">{result.reliability.summary}</p>
        </>
      ) : (
        <p className="context-panel__note">{t('reliabilityExplainer')}</p>
      )}

      <dl className="tally">
        <div className="tally__item">
          <dt>{t('infoProvided')}</dt>
          <dd>{provided}</dd>
        </div>
        <div className="tally__item">
          <dt>{t('infoUnavailable')}</dt>
          <dd>{unavailable}</dd>
        </div>
      </dl>

      <button
        type="button"
        className="context-panel__link"
        onClick={() => navigate(`/result/${result.id}/reliability`)}
      >
        {t('improveReliability')}
        <Chevron />
      </button>
    </section>
  )
}
