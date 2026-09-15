import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'
import { useAssessment } from '@/app/assessmentSession'
import { SubScreen } from '@/components/SubScreen'

/**
 * Assessment introduction.
 *
 * Sets the expectation that BADIRA reuses what it already holds. The two lists
 * are DEMO content illustrating the idea, not a clinical inventory.
 */
export function AssessmentIntro() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const { steps, reset } = useAssessment()
  const navigate = useNavigate()

  const available = profile
    ? ['introHaveProfile', 'introHaveHistory', 'introHaveFamily', 'introHaveMeasurements']
    : []
  const needed = profile
    ? ['introNeedMeasurements', 'introNeedSymptoms', 'introNeedChanges']
    : ['introNeedAbout', 'introNeedMeasurements', 'introNeedSymptoms', 'introNeedChanges']

  const begin = () => {
    reset()
    navigate(`/assessment/${steps[0]}`)
  }

  return (
    <SubScreen title={t('assessmentTitle')}>
      <p className="lede">{profile ? t('introLede') : t('introLedeGuest')}</p>

      {available.length > 0 && (
        <section className="group">
          <h2 className="group__label">{t('introAvailable')}</h2>
          <ul className="ticks">
            {available.map((key) => (
              <li key={key} className="tick">
                <TickGlyph />
                {t(key as 'introHaveProfile')}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="group">
        <h2 className="group__label">{t('introNeeded')}</h2>
        <ul className="ticks">
          {needed.map((key) => (
            <li key={key} className="tick tick--open">
              <span className="tick__ring" aria-hidden="true" />
              {t(key as 'introNeedSymptoms')}
            </li>
          ))}
        </ul>
      </section>

      <p className="fineprint">{t('introSkipNote')}</p>

      <button type="button" className="btn btn--primary" onClick={begin}>
        {t('beginAssessment')}
      </button>
    </SubScreen>
  )
}

function TickGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="tick__glyph">
      <circle cx="9" cy="9" r="9" fill="currentColor" opacity="0.14" />
      <path
        d="M5.2 9.2 7.8 11.8 12.8 6.2"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
