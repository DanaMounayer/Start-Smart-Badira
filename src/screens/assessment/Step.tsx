import { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { STEP_ORDER, type StepId } from '@/domain/assessment/schema'
import { useAssessment } from '@/app/assessmentSession'
import { useLanguage } from '@/i18n/LanguageProvider'
import { StepProgress } from '@/components/assessment/StepProgress'
import { QuestionBlock } from '@/components/assessment/QuestionBlock'

const isStepId = (value: string | undefined): value is StepId =>
  STEP_ORDER.includes(value as StepId)

/**
 * One step of the assessment.
 *
 * Generic: it asks the engine which questions are visible for this step and
 * renders them. Adding, removing or re-gating a question is a spec change,
 * never a change here.
 */
export function AssessmentStep() {
  const { step } = useParams()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { steps, questionsFor, answers, setAnswer } = useAssessment()

  const valid = isStepId(step) && steps.includes(step)

  // A step can stop existing while it is open (answers changed upstream).
  useEffect(() => {
    if (!valid) navigate('/assessment', { replace: true })
  }, [valid, navigate])
  if (!valid) return null

  const questions = questionsFor(step)
  const index = steps.indexOf(step)
  const isLast = index === steps.length - 1
  const next = isLast ? '/assessment/review' : `/assessment/${steps[index + 1]}`
  const back = index === 0 ? '/assessment' : `/assessment/${steps[index - 1]}`

  return (
    <>
      <div className="step-head">
        <button
          type="button"
          className="icon-btn"
          onClick={() => navigate(back)}
          aria-label={t('back')}
        >
          <BackGlyph />
        </button>
        <StepProgress steps={[...steps, 'review']} current={step} />
      </div>

      <div className="questions">
        {questions.map((question) => (
          <QuestionBlock
            key={question.id}
            question={question}
            answer={answers[question.id]}
            onAnswer={(answer) => setAnswer(question.id, answer)}
          />
        ))}
      </div>

      <div className="step-foot">
        <button type="button" className="btn btn--primary" onClick={() => navigate(next)}>
          {isLast ? t('toReview') : t('continue')}
        </button>
      </div>
    </>
  )
}

function BackGlyph() {
  return (
    <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="chevron">
      <path
        d="m10 3.5-4.5 4.5 4.5 4.5"
        stroke="currentColor"
        strokeWidth="1.9"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
