import { useNavigate } from 'react-router-dom'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import { useAssessment } from '@/app/assessmentSession'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'

/**
 * Stage 3 placeholder.
 *
 * Deliberately produces no result. It reports only what the assessment
 * captured — counts of answered and unavailable items — so the flow can be
 * tested end to end without inventing a risk level, a reliability score or any
 * recommendation.
 */
export function ResultPlaceholder() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const { answers, reset } = useAssessment()
  const navigate = useNavigate()

  const context = { answers, profile }
  const provided = providedQuestions(demoSpec, context).length
  const missing = missingQuestions(demoSpec, context).length

  return (
    <SubScreen title={t('resultTitle')}>
      <section className="card card--notice">
        <p className="card__title">{t('resultNotReadyTitle')}</p>
        <p className="muted muted--small">{t('resultNotReadyBody')}</p>
      </section>

      <section className="group">
        <h2 className="group__label">{t('resultCaptured')}</h2>
        <div className="list">
          <div className="list__row list__row--static">
            <span className="list__label">{t('resultAnswered')}</span>
            <span className="list__value">{provided}</span>
          </div>
          <div className="list__row list__row--static">
            <span className="list__label">{t('resultMissing')}</span>
            <span className="list__value">{missing}</span>
          </div>
        </div>
      </section>

      <p className="fineprint">{t('resultMissingNote')}</p>

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => {
          reset()
          navigate('/')
        }}
      >
        {t('backToHome')}
      </button>
    </SubScreen>
  )
}
