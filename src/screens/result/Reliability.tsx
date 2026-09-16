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

      <details className="disclosure">
        <summary className="disclosure__summary">
          <span>{t('reliabilityHas')}</span>
          <span className="disclosure__count">{held.length}</span>
        </summary>
        <div className="disclosure__body">
          <InfoGroup label="" items={held} />
        </div>
      </details>
      {unavailable.length > 0 && (
        <section className="info-group">
          <h2 className="info-eyebrow">{t('reliabilityCouldHelp')}</h2>
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
