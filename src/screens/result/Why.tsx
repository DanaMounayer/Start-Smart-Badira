import { Navigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { InfoGroup } from '@/components/result/InfoGroup'

/**
 * "Why this result?"
 *
 * Says what each of the three readings on the result means, then shows the
 * information the assessment had behind it. Wording is deliberately
 * non-causal: this screen names what was taken into account, never reasons
 * the user "is at risk".
 *
 * `result.factors` carries a model's own explanation output. While it is
 * empty there is nothing ranked to show, so the screen explains the three
 * readings instead; the ranked list appears here as soon as one is supplied.
 */
export function ResultWhy() {
  const { t } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useStoredResult(id)

  // A result only exists for a completed assessment; an unknown id has
  // nothing to show, so it goes home rather than rendering an empty shell.
  if (!result) return <Navigate to="/" replace />

  const fromProfile = result.information.filter(
    (item) => item.source === 'profile' && item.status === 'provided',
  )
  const fromToday = result.information.filter(
    (item) => item.source === 'assessment' && item.status === 'provided',
  )

  return (
    <SubScreen title={t('whyThisResult')} backTo={`/result/${id}`}>
      <p className="lede">{t('whyLede')}</p>

      {result.factors.length > 0 ? (
        <section className="info-group">
          <h2 className="eyebrow">{t('whyConsidered')}</h2>
          <ul className="info-list">
            {result.factors.map((factor) => (
              <li key={factor.id} className="info-list__item">
                <span className="info-list__label">{t(factor.labelKey)}</span>
                <span className="info-list__source">
                  {factor.source === 'profile' ? t('sourceProfile') : t('sourceToday')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="info-group">
          <h2 className="eyebrow">{t('whyDimensionsTitle')}</h2>
          <dl className="report">
            <div className="report__row report__row--block">
              <dt>{t('riskLabel')}</dt>
              <dd>{t('whyRiskMeans')}</dd>
            </div>
            <div className="report__row report__row--block">
              <dt>{t('reliabilityLabel')}</dt>
              <dd>{t('whyReliabilityMeans')}</dd>
            </div>
            <div className="report__row report__row--block">
              <dt>{t('timeLabel')}</dt>
              <dd>{t('whyTimeMeans')}</dd>
            </div>
          </dl>
        </section>
      )}

      <InfoGroup label={t('whyFromProfile')} items={fromProfile} />
      <InfoGroup label={t('whyFromToday')} items={fromToday} />
    </SubScreen>
  )
}
