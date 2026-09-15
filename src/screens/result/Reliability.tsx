import { useNavigate, useParams } from 'react-router-dom'
import { useResult } from '@/app/useResult'
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
  const result = useResult()
  const navigate = useNavigate()

  const held = result.information.filter((item) => item.status === 'provided')
  const unavailable = result.information.filter((item) => item.status === 'unavailable')

  return (
    <SubScreen title={t('improveReliability')} backTo={`/result/${id}`}>
      <p className="lede">{t('reliabilityExplainer')}</p>

      <section className="notice">
        <p className="notice__body">{t('reliabilityNotRisk')}</p>
      </section>

      <InfoGroup label={t('reliabilityHas')} items={held} />
      <InfoGroup
        label={t('reliabilityMissing')}
        items={unavailable}
        tone="muted"
        emptyLabel={t('reviewNothingMissing')}
      />

      {unavailable.length > 0 && (
        <section className="info-group">
          <h2 className="info-group__label">{t('reliabilityCouldHelp')}</h2>
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
