import type { StepId } from '@/domain/assessment/schema'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'

const STEP_LABEL: Record<StepId | 'review', keyof Strings> = {
  about: 'stepAbout',
  measurements: 'stepMeasurements',
  symptoms: 'stepSymptoms',
  changes: 'stepChanges',
  review: 'stepReview',
}

/**
 * Step indicator.
 *
 * Named stages rather than "question 4 of 17" — the number of questions
 * changes as the assessment adapts, so a count would be wrong as often as it
 * was right. Segments lay out with flex, so RTL mirrors them automatically.
 */
export function StepProgress({
  steps,
  current,
}: {
  steps: (StepId | 'review')[]
  current: StepId | 'review'
}) {
  const { t } = useLanguage()
  const index = steps.indexOf(current)

  return (
    <div className="steps" aria-label={t('assessmentProgress')}>
      {/* Only the current stage is named. Showing every label forces each one
          to truncate as the step count changes, and the others add nothing. */}
      <p className="steps__current">{t(STEP_LABEL[current])}</p>
      <ol className="steps__track">
        {steps.map((step, i) => (
          <li
            key={step}
            className={`steps__seg${i <= index ? ' is-done' : ''}`}
            aria-current={i === index ? 'step' : undefined}
          >
            <span className="steps__bar" />
            <span className="sr-only">{t(STEP_LABEL[step])}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
