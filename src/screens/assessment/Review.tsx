import { useNavigate } from 'react-router-dom'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import type { Answer, Question } from '@/domain/assessment/schema'
import type { Strings } from '@/i18n'
import { useAssessment } from '@/app/assessmentSession'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { StepProgress } from '@/components/assessment/StepProgress'

/**
 * Review before analysis.
 *
 * Three collapsed summaries — already known, updated today, unavailable —
 * rather than a table of every answer. The screen's subject is the decision to
 * run the analysis; the detail is one tap away for whoever wants it.
 *
 * Missing information is stated neutrally. No consequence is asserted, because
 * Reliability is not defined yet.
 */
export function AssessmentReview() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const { answers, steps } = useAssessment()
  const navigate = useNavigate()

  const context = { answers, profile }
  const provided = providedQuestions(demoSpec, context)
  const missing = missingQuestions(demoSpec, context)

  const savedItems: (keyof Strings)[] = profile
    ? ['introHaveProfile', 'introHaveHistory', 'introHaveFamily', 'introHaveMeasurements']
    : []

  return (
    <div className="ask">
      <div className="ask__head">
        <button
          type="button"
          className="icon-btn"
          onClick={() =>
            navigate(`/assessment/${steps[steps.length - 1]}`, { state: { atLast: true } })
          }
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

      <div className="ask__body">
        <header className="ask__prompt-block">
          <h1 className="ask__prompt">{t('reviewTitle')}</h1>
          <p className="ask__hint">{t('reviewLede')}</p>
        </header>

        <div className="summaries">
          {savedItems.length > 0 && (
            <Summary
              label={t('reviewFromProfile')}
              count={savedItems.length}
              tone="known"
            >
              <ul className="summary__list">
                {savedItems.map((key) => (
                  <li key={key}>{t(key)}</li>
                ))}
              </ul>
            </Summary>
          )}

          <Summary
            label={t('reviewUpdatedToday')}
            count={provided.length}
            tone="updated"
            emptyLabel={provided.length === 0 ? t('reviewNothingAddedYet') : undefined}
          >
            <AnswerList
              questions={provided}
              answers={answers}
              onEdit={(q) => navigate(`/assessment/${q.step}`)}
            />
          </Summary>

          <Summary
            label={t('reviewUnavailable')}
            count={missing.length}
            tone="missing"
            emptyLabel={missing.length === 0 ? t('reviewNothingMissing') : undefined}
          >
            <AnswerList
              questions={missing}
              answers={answers}
              onEdit={(q) => navigate(`/assessment/${q.step}`)}
            />
          </Summary>
        </div>

        <p className="ask__note">{t('reviewMissingNote')}</p>
      </div>

      <div className="ask__foot">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate('/assessment/analyzing')}
        >
          {t('analyzeWithBadira')}
        </button>
        <p className="fineprint fineprint--center">{t('disclaimerFull')}</p>
      </div>
    </div>
  )
}

/** A collapsed group. Open it to see what it contains. */
function Summary({
  label,
  count,
  tone,
  emptyLabel,
  children,
}: {
  label: string
  count: number
  tone: 'known' | 'updated' | 'missing'
  emptyLabel?: string
  children: React.ReactNode
}) {
  if (emptyLabel) {
    return (
      <div className={`summary summary--${tone} is-empty`}>
        <span className="summary__label">{label}</span>
        <span className="summary__empty">{emptyLabel}</span>
      </div>
    )
  }

  return (
    <details className={`summary summary--${tone}`}>
      <summary className="summary__head">
        <span className="summary__label">{label}</span>
        <span className="summary__count">{count}</span>
        <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="summary__caret">
          <path d="m4 6 4 4 4-4" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </summary>
      <div className="summary__body">{children}</div>
    </details>
  )
}

function AnswerList({
  questions,
  answers,
  onEdit,
}: {
  questions: Question[]
  answers: Record<string, Answer | undefined>
  onEdit: (question: Question) => void
}) {
  const { t, language } = useLanguage()
  const separator = language === 'ar' ? '، ' : ', '

  return (
    <ul className="summary__answers">
      {questions.map((question) => (
        <li key={question.id}>
          <button type="button" className="answer" onClick={() => onEdit(question)}>
            <span className="answer__q">{t(question.promptKey)}</span>
            <span className="answer__a">
              {describe(question, answers[question.id], t, separator)}
            </span>
          </button>
        </li>
      ))}
    </ul>
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
