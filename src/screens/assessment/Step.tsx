import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { STEP_ORDER, type StepId } from '@/domain/assessment/schema'
import { useAssessment } from '@/app/assessmentSession'
import { useLanguage } from '@/i18n/LanguageProvider'
import { StepProgress } from '@/components/assessment/StepProgress'
import { QuestionBlock } from '@/components/assessment/QuestionBlock'

const isStepId = (value: string | undefined): value is StepId =>
  STEP_ORDER.includes(value as StepId)

/**
 * One step of the assessment, asking one question at a time.
 *
 * The engine decides which questions exist; this screen only decides how many
 * to show at once, and shows one — so a follow-up arrives as BADIRA asking
 * something new rather than a form growing another row.
 *
 * The cursor is local presentation state. If an earlier answer removes the
 * question being viewed, the list shortens and the cursor clamps.
 */
export function AssessmentStep() {
  const { step } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { t } = useLanguage()
  const { steps, questionsFor, answers, setAnswer } = useAssessment()

  const valid = isStepId(step) && steps.includes(step)
  const [cursor, setCursor] = useState(0)

  // Entering a step starts at its first question — or its last, when the user
  // arrived by going back from the following step.
  const enterAtLast = (location.state as { atLast?: boolean } | null)?.atLast === true
  useEffect(() => {
    setCursor(enterAtLast ? Number.MAX_SAFE_INTEGER : 0)
  }, [step, enterAtLast])

  useEffect(() => {
    if (!valid) navigate('/assessment', { replace: true })
  }, [valid, navigate])
  if (!valid) return null

  const questions = questionsFor(step)
  if (questions.length === 0) return null

  const at = Math.min(cursor, questions.length - 1)
  const question = questions[at]
  const stepIndex = steps.indexOf(step)
  const isLastQuestion = at === questions.length - 1
  const isLastStep = stepIndex === steps.length - 1

  const goNext = () => {
    if (!isLastQuestion) {
      setCursor(at + 1)
      return
    }
    navigate(isLastStep ? '/assessment/review' : `/assessment/${steps[stepIndex + 1]}`)
  }

  const goBack = () => {
    if (at > 0) {
      setCursor(at - 1)
      return
    }
    if (stepIndex === 0) {
      navigate('/assessment')
      return
    }
    navigate(`/assessment/${steps[stepIndex - 1]}`, { state: { atLast: true } })
  }

  return (
    <div className="ask">
      <div className="ask__head">
        <button type="button" className="icon-btn" onClick={goBack} aria-label={t('back')}>
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
        <StepProgress
          steps={[...steps, 'review']}
          current={step}
          fraction={(at + 1) / questions.length}
        />
      </div>

      <QuestionBlock
        // Remounting per question replays the entry transition, so each
        // question arrives rather than swapping in place.
        key={question.id}
        question={question}
        answer={answers[question.id]}
        onAnswer={(answer) => setAnswer(question.id, answer)}
        isFollowUp={question.when !== undefined}
      />

      <div className="ask__foot">
        <button type="button" className="btn btn--primary" onClick={goNext}>
          {isLastQuestion && isLastStep ? t('toReview') : t('continue')}
        </button>
      </div>
    </div>
  )
}
