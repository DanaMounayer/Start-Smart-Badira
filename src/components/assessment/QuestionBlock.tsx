import { useId } from 'react'
import type {
  Answer,
  MissingReason,
  Option,
  Question,
} from '@/domain/assessment/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'
import { formatDate } from '@/lib/format'
import { ChoiceList } from './ChoiceList'
import { EscapeHatches } from './EscapeHatches'

/**
 * Renders one question from the spec. The step screen never knows what kind of
 * question it is showing — that is decided here, from the data.
 */
export function QuestionBlock({
  question,
  answer,
  onAnswer,
  isFollowUp = false,
}: {
  question: Question
  answer: Answer | undefined
  onAnswer: (answer: Answer | undefined) => void
  /** Marks a question that only exists because of an earlier answer. */
  isFollowUp?: boolean
}) {
  const { t, language } = useLanguage()
  const { profile } = useSession()
  const fieldId = useId()

  const saved = question.savedValue?.(profile) ?? null
  const missingReason: MissingReason | null =
    answer?.kind === 'missing' ? answer.reason : null
  const selectedIds = answer?.kind === 'choice' ? answer.values : []

  const toggle = (optionId: string, option: Option) => {
    if (option.exclusive) {
      const isOn = selectedIds.includes(optionId)
      onAnswer(isOn ? undefined : { kind: 'choice', values: [optionId] })
      return
    }
    if (question.kind === 'single') {
      onAnswer({ kind: 'choice', values: [optionId] })
      return
    }
    // Choosing a normal option clears any exclusive one already selected.
    const exclusiveIds = (question.options ?? [])
      .filter((o) => o.exclusive)
      .map((o) => o.id)
    const base = selectedIds.filter((id) => !exclusiveIds.includes(id))
    const next = base.includes(optionId)
      ? base.filter((id) => id !== optionId)
      : [...base, optionId]
    onAnswer(next.length ? { kind: 'choice', values: next } : undefined)
  }

  return (
    <section className="ask__body">
      <header className="ask__prompt-block">
        {isFollowUp && (
          <p className="followup-tag">
            <span className="followup-tag__line" aria-hidden="true" />
            {t('followUp')}
          </p>
        )}
        <h1 className="ask__prompt" id={`${fieldId}-prompt`}>
          {t(question.promptKey)}
        </h1>
        {question.hintKey && <p className="ask__hint">{t(question.hintKey)}</p>}
      </header>

      {(question.kind === 'single' || question.kind === 'multi') && question.options && (
        <ChoiceList
          options={question.options}
          selectedIds={selectedIds}
          multi={question.kind === 'multi'}
          onToggle={toggle}
        />
      )}

      {question.kind === 'number' && (
        <div className="measure">
          <input
            id={fieldId}
            aria-labelledby={`${fieldId}-prompt`}
            className="measure__input"
            type="text"
            inputMode="decimal"
            value={answer?.kind === 'number' ? answer.value : ''}
            onChange={(event) => {
              const raw = event.target.value.replace(/[^\d.]/g, '')
              onAnswer(raw === '' ? undefined : { kind: 'number', value: Number(raw) })
            }}
            placeholder="—"
          />
          {question.unitKey && (
            <span className="measure__unit">{t(question.unitKey)}</span>
          )}
        </div>
      )}

      {question.kind === 'bloodPressure' && (
        <BloodPressureEntry
          id={fieldId}
          systolic={answer?.kind === 'bp' ? answer.systolic : ''}
          diastolic={answer?.kind === 'bp' ? answer.diastolic : ''}
          usingSaved={answer?.kind === 'fromProfile'}
          onChange={(systolic, diastolic) =>
            // A half-typed reading is kept as it is entered; the engine decides
            // separately that it is not a value until both halves are there.
            onAnswer(
              systolic === '' && diastolic === ''
                ? undefined
                : { kind: 'bp', systolic, diastolic },
            )
          }
        />
      )}

      {saved && (
        <div className="saved-note">
          <p className="saved-note__text">
            {t('savedAlready')} <strong>{saved.display}</strong>
            <span>{formatDate(saved.recordedAt, language)}</span>
          </p>
          <button
            type="button"
            aria-pressed={answer?.kind === 'fromProfile'}
            className={`saved-note__use${answer?.kind === 'fromProfile' ? ' is-active' : ''}`}
            onClick={() =>
              onAnswer(answer?.kind === 'fromProfile' ? undefined : { kind: 'fromProfile' })
            }
          >
            {answer?.kind === 'fromProfile' ? t('usingSavedReading') : t('useSavedReading')}
          </button>
        </div>
      )}

      <EscapeHatches
        question={question}
        activeReason={missingReason}
        onChoose={(reason) =>
          onAnswer(missingReason === reason ? undefined : { kind: 'missing', reason })
        }
      />

      {/* Appears only once something is actually marked unavailable, so the
          connection to Reliability is made where it is earned. */}
      {missingReason && <p className="missing-note">{t('missingNote')}</p>}
    </section>
  )
}

/**
 * Blood pressure entry.
 *
 * The numbers are the screen's subject — large, centred, on one soft surface,
 * with the labels beneath rather than a pair of boxed web inputs.
 */
function BloodPressureEntry({
  id,
  systolic,
  diastolic,
  usingSaved,
  onChange,
}: {
  id: string
  systolic: number | ''
  diastolic: number | ''
  usingSaved: boolean
  onChange: (systolic: number | '', diastolic: number | '') => void
}) {
  const { t } = useLanguage()
  const clean = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 3)
    return digits === '' ? '' : Number(digits)
  }

  return (
    <div className={`bp${usingSaved ? ' is-muted' : ''}`}>
      {/* Each caption sits inside its own cell, so it stays under its field. */}
      <div className="bp__row" dir="ltr">
        <label className="bp__cell">
          <input
            id={`${id}-sys`}
            className="bp__digits"
            type="text"
            inputMode="numeric"
            value={usingSaved ? '' : systolic}
            onChange={(event) => onChange(clean(event.target.value), diastolic)}
            placeholder="—"
            aria-label={t('systolic')}
          />
          <span className="bp__cap">{t('systolic')}</span>
        </label>
        <span className="bp__slash" aria-hidden="true">
          /
        </span>
        <label className="bp__cell">
          <input
            id={`${id}-dia`}
            className="bp__digits"
            type="text"
            inputMode="numeric"
            value={usingSaved ? '' : diastolic}
            onChange={(event) => onChange(systolic, clean(event.target.value))}
            placeholder="—"
            aria-label={t('diastolic')}
          />
          <span className="bp__cap">{t('diastolic')}</span>
        </label>
      </div>
      <p className="bp__unit">{t('mmhg')}</p>
    </div>
  )
}
