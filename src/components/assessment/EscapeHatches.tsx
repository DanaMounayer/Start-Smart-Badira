import type { MissingReason, Question } from '@/domain/assessment/schema'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The ways out of answering.
 *
 * Present but deliberately quiet: plain tinted text, below the answer, so the
 * user is never pushed toward inventing a value nor toward skipping. Each
 * choice records *why* the value is absent, for Stage 3 to read.
 */
export function EscapeHatches({
  question,
  activeReason,
  onChoose,
}: {
  question: Question
  activeReason: MissingReason | null
  onChoose: (reason: MissingReason) => void
}) {
  const { t } = useLanguage()

  const hatches: { reason: MissingReason; label: string }[] = []
  if (question.allowUnknown) hatches.push({ reason: 'unknown', label: t('iDontKnow') })
  if (question.allowUnavailable) {
    hatches.push({ reason: 'unavailable', label: t('notAvailable') })
  }
  if (question.allowSkip) hatches.push({ reason: 'skipped', label: t('skipForNow') })
  if (hatches.length === 0) return null

  return (
    <div className="hatches">
      {hatches.map((hatch) => (
        <button
          key={hatch.reason}
          type="button"
          aria-pressed={activeReason === hatch.reason}
          className={`hatch${activeReason === hatch.reason ? ' is-active' : ''}`}
          onClick={() => onChoose(hatch.reason)}
        >
          {activeReason === hatch.reason && (
            <svg width="13" height="13" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path
                d="M3.8 9.4 7.2 12.8 14.2 5.4"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
          {hatch.label}
        </button>
      ))}
    </div>
  )
}
