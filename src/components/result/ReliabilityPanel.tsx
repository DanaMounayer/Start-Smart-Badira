import { useNavigate } from 'react-router-dom'
import { countBy, type BadiraResult } from '@/domain/result/schema'
import { COVERAGE_COPY } from '@/domain/result/copy'
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
  const reading =
    result.reliability.state === 'simulated'
      ? COVERAGE_COPY[result.reliability.coverage]
      : null

  return (
    <section className="context-panel">
      <div className="context-panel__head">
        <h3 className="panel-title">{t('reliabilityLabel')}</h3>
        <span className="tagline-pill">
          {reading ? t('simulatedShort') : t('awaitingModelShort')}
        </span>
      </div>

      {reading ? (
        <>
          <p className="context-panel__reading">{t(reading.labelKey)}</p>
          <p className="context-panel__note">{t(reading.bodyKey)}</p>
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
