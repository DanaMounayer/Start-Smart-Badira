import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { InfoGroup } from '@/components/result/InfoGroup'

/**
 * "Improve reliability".
 *
 * Shows what the assessment had, what it did not, and where adding
 * information would give BADIRA more to work with. It never suggests that
 * adding information lowers risk — only that it strengthens the basis of the
 * prediction.
 */
export function ResultReliability() {
  const { t } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useStoredResult(id)
  const navigate = useNavigate()

  // A result only exists for a completed assessment; an unknown id has
  // nothing to show, so it goes home rather than rendering an empty shell.
  if (!result) return <Navigate to="/" replace />

  const held = result.information.filter((item) => item.status === 'provided')
  const unavailable = result.information.filter((item) => item.status === 'unavailable')

  return (
    <SubScreen title={t('improveReliability')} backTo={`/result/${id}`}>
      <p className="lede">{t('reliabilityNotRisk')}</p>

      <InfoGroup
        label={t('reliabilityMissing')}
        items={unavailable}
        tone="muted"
        emptyLabel={t('reviewNothingMissing')}
      />

      <details className="summary summary--known">
        <summary className="summary__head">
          <span className="summary__label">{t('reliabilityHas')}</span>
          <span className="summary__count">{held.length}</span>
          <svg
            width="13"
            height="13"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            className="summary__caret"
          >
            <path
              d="m4 6 4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </summary>
        <div className="summary__body">
          <InfoGroup label="" items={held} />
        </div>
      </details>
      {unavailable.length > 0 && (
        <section className="info-group">
          <h2 className="eyebrow">{t('reliabilityCouldHelp')}</h2>
          <p className="info-group__body">{t('reliabilityCouldHelpBody')}</p>
        </section>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => navigate('/profile/update')}
      >
        {t('updateInformation')}
      </button>

      <p className="fineprint">{t('reliabilityNoPromise')}</p>
    </SubScreen>
  )
}
