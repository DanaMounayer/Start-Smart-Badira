import { useParams } from 'react-router-dom'
import { useResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { InfoGroup } from '@/components/result/InfoGroup'

/**
 * "Why this result?" — model transparency.
 *
 * Wording is deliberately non-causal: this screen names information that the
 * assessment took into account, never reasons the user "is at risk".
 *
 * Until a validated model produces explanation output, `result.factors` is
 * empty and the screen shows the information used instead — which is factual.
 * The ranked-factor list appears as soon as the model supplies one.
 */
export function ResultWhy() {
  const { t } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useResult()

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
          <h2 className="info-group__label">{t('whyInfluential')}</h2>
          <ul className="info-list">
            {result.factors.map((factor) => (
              <li key={factor.id} className="info-list__item">
                <span className="info-list__label">{factor.label}</span>
                <span className="info-list__source">
                  {factor.source === 'profile' ? t('sourceProfile') : t('sourceToday')}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ) : (
        <section className="notice">
          <p className="notice__title">{t('whyNoModelTitle')}</p>
          <p className="notice__body">{t('whyNoModelBody')}</p>
        </section>
      )}

      <InfoGroup label={t('whyFromProfile')} items={fromProfile} />
      <InfoGroup label={t('whyFromToday')} items={fromToday} />

      <p className="fineprint">{t('whyNoCausation')}</p>
    </SubScreen>
  )
}
