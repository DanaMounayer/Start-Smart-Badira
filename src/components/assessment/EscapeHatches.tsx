import type { MissingReason, Question } from '@/domain/assessment/schema'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The ways out of answering.
 *
 * The user is never forced to invent a value. Each choice records *why* the
 * value is absent, which Stage 3 will read as part of Reliability.
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
          {hatch.label}
        </button>
      ))}
    </div>
  )
}
