import { Navigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { InfoGroup } from '@/components/result/InfoGroup'

/**
 * "Why this result?" — model transparency.
 *
 * Wording is deliberately non-causal: this screen names information that the
 * assessment took into account, never reasons the user "is at risk".
 *
 * `result.factors` stays empty in the prototype: the simulated risk state is
 * not calculated from the answers, so there is nothing weighted to rank, and
 * inventing one would assert a cause. The screen explains that and shows the
 * information BADIRA held instead — which is factual. The ranked-factor list
 * appears as soon as a validated model supplies one.
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
        <section className="notice">
          <p className="notice__title">
            {result.demo ? t('whySimulationTitle') : t('whyNoModelTitle')}
          </p>
          <p className="notice__body">
            {result.demo ? t('whySimulationBody') : t('whyNoModelBody')}
          </p>
        </section>
      )}

      <InfoGroup label={t('whyFromProfile')} items={fromProfile} />
      <InfoGroup label={t('whyFromToday')} items={fromToday} />

      <p className="fineprint">{t('whyNoCausation')}</p>
    </SubScreen>
  )
}
