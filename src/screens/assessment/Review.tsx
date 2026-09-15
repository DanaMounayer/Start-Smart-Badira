import { useNavigate } from 'react-router-dom'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import type { Answer, Question } from '@/domain/assessment/schema'
import type { Strings } from '@/i18n'
import { useAssessment } from '@/app/assessmentSession'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { StepProgress } from '@/components/assessment/StepProgress'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Review before analysis.
 *
 * Three groups: what is reused from the saved profile, what was provided
 * today, and what is unavailable. The profile group stays collapsed — the
 * point is to confirm, not to re-read the whole record.
 *
 * Missing information is stated neutrally. No consequence is asserted here,
 * because Reliability has not been defined yet.
 */
export function AssessmentReview() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const { answers, steps } = useAssessment()
  const navigate = useNavigate()

  const context = { answers, profile }
  const provided = providedQuestions(demoSpec, context)
  const missing = missingQuestions(demoSpec, context)

  const fromProfile: (keyof Strings)[] = profile
    ? ['introHaveProfile', 'introHaveHistory', 'introHaveFamily', 'introHaveMeasurements']
    : []

  return (
    <>
      <div className="step-head">
        <button
          type="button"
          className="icon-btn"
          onClick={() => navigate(`/assessment/${steps[steps.length - 1]}`)}
          aria-label={t('back')}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="chevron">
            <path
              d="m10 3.5-4.5 4.5 4.5 4.5"
              stroke="currentColor"
              strokeWidth="1.9"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <StepProgress steps={[...steps, 'review']} current="review" />
      </div>

      <h1 className="large-title large-title--tight">{t('reviewTitle')}</h1>

      {fromProfile.length > 0 && (
        <details className="disclosure">
          <summary className="disclosure__summary">
            <span>{t('reviewFromProfile')}</span>
            <span className="disclosure__count">{fromProfile.length}</span>
          </summary>
          <ul className="disclosure__body">
            {fromProfile.map((key) => (
              <li key={key}>{t(key)}</li>
            ))}
          </ul>
        </details>
      )}

      <ReviewGroup
        label={t('reviewUpdatedToday')}
        questions={provided}
        answers={answers}
        emptyLabel={t('reviewNothingAddedYet')}
        onEdit={(question) => navigate(`/assessment/${question.step}`)}
      />

      {missing.length > 0 && (
        <ReviewGroup
          label={t('reviewUnavailable')}
          questions={missing}
          answers={answers}
          onEdit={(question) => navigate(`/assessment/${question.step}`)}
        />
      )}

      <p className="fineprint">{t('reviewMissingNote')}</p>

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => navigate('/assessment/analyzing')}
      >
        {t('analyzeWithBadira')}
      </button>

      <p className="fineprint fineprint--center">{t('disclaimerFull')}</p>
    </>
  )
}

function ReviewGroup({
  label,
  questions,
  answers,
  emptyLabel,
  onEdit,
}: {
  label: string
  questions: Question[]
  answers: Record<string, Answer | undefined>
  emptyLabel?: string
  onEdit: (question: Question) => void
}) {
  const { t, language } = useLanguage()
  const listSeparator = language === 'ar' ? '، ' : ', '

  return (
    <section className="group">
      <h2 className="group__label">{label}</h2>
      {questions.length === 0 && emptyLabel ? (
        <p className="group__empty">{emptyLabel}</p>
      ) : (
        <div className="list">
          {questions.map((question) => (
            <button
              key={question.id}
              type="button"
              className="list__row"
              onClick={() => onEdit(question)}
            >
              <span className="list__label">{t(question.promptKey)}</span>
              <span className="list__value">
                {describe(question, answers[question.id], t, listSeparator)}
              </span>
              <Chevron />
            </button>
          ))}
        </div>
      )}
    </section>
  )
}

/** Renders an answer for review. Values only — never an interpretation. */
function describe(
  question: Question,
  answer: Answer | undefined,
  t: (key: keyof Strings) => string,
  separator: string,
): string {
  if (!answer) return t('notAnswered')
  switch (answer.kind) {
    case 'bp':
      return `${answer.systolic}/${answer.diastolic}`
    case 'number':
      return String(answer.value)
    case 'choice': {
      // Name what was chosen; a bare count tells the user nothing.
      const labels = answer.values.map((id) => {
        const option = question.options?.find((o) => o.id === id)
        return option ? t(option.labelKey) : id
      })
      return labels.join(separator)
    }
    case 'fromProfile':
      return t('fromSavedProfile')
    case 'missing':
      return answer.reason === 'unknown'
        ? t('iDontKnow')
        : answer.reason === 'unavailable'
          ? t('notAvailable')
          : t('skipForNow')
  }
}
