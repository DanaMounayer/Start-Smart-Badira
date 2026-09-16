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
 * Stage indicator.
 *
 * Named stages rather than "question 4 of 17" — the number of questions
 * changes as the assessment adapts. The current stage's bar fills with
 * progress through that stage, so movement is visible without a count.
 * Segments lay out with flex, so RTL mirrors them.
 */
export function StepProgress({
  steps,
  current,
  fraction = 1,
}: {
  steps: (StepId | 'review')[]
  current: StepId | 'review'
  fraction?: number
}) {
  const { t } = useLanguage()
  const index = steps.indexOf(current)

  return (
    <div className="steps" aria-label={t('assessmentProgress')}>
      <p className="steps__current">{t(STEP_LABEL[current])}</p>
      <ol className="steps__track">
        {steps.map((step, i) => (
          <li
            key={step}
            className={`steps__seg${i < index ? ' is-done' : ''}`}
            aria-current={i === index ? 'step' : undefined}
          >
            <span className="steps__bar">
              {i === index && (
                <span
                  className="steps__fill"
                  style={{ inlineSize: `${Math.round(fraction * 100)}%` }}
                />
              )}
            </span>
            <span className="sr-only">{t(STEP_LABEL[step])}</span>
          </li>
        ))}
      </ol>
    </div>
  )
}
