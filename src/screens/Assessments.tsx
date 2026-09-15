import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'

/**
 * Previous BADIRA assessments.
 *
 * Empty for the demo profile: no assessment has been run, and none is
 * fabricated. Once Stage 3 exists this lists real results.
 */
export function Assessments() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <SubScreen title={t('navAssessments')}>
      <section className="card card--empty">
        <p className="card__title">{t('noAssessmentsTitle')}</p>
        <p className="muted muted--small">{t('noAssessmentsBody')}</p>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate('/assessment')}
        >
          {t('startAssessment')}
        </button>
      </section>
    </SubScreen>
  )
}
