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
}: {
  question: Question
  answer: Answer | undefined
  onAnswer: (answer: Answer | undefined) => void
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
    <section className="question">
      <h2 className="question__prompt" id={`${fieldId}-prompt`}>
        {t(question.promptKey)}
      </h2>
      {question.hintKey && <p className="question__hint">{t(question.hintKey)}</p>}

      {saved && (
        <p className="saved-chip">
          <span className="saved-chip__dot" aria-hidden="true" />
          {t('savedAlready')} <strong>{saved.display}</strong> ·{' '}
          {formatDate(saved.recordedAt, language)}
        </p>
      )}

      {(question.kind === 'single' || question.kind === 'multi') && question.options && (
        <ChoiceList
          options={question.options}
          selectedIds={selectedIds}
          multi={question.kind === 'multi'}
          onToggle={toggle}
        />
      )}

      {question.kind === 'number' && (
        <NumberField
          id={fieldId}
          labelledBy={`${fieldId}-prompt`}
          unit={question.unitKey ? t(question.unitKey) : undefined}
          value={answer?.kind === 'number' ? answer.value : ''}
          onChange={(value) =>
            onAnswer(value === '' ? undefined : { kind: 'number', value })
          }
        />
      )}

      {question.kind === 'bloodPressure' && (
        <BloodPressureField
          id={fieldId}
          systolic={answer?.kind === 'bp' ? answer.systolic : ''}
          diastolic={answer?.kind === 'bp' ? answer.diastolic : ''}
          onChange={(systolic, diastolic) =>
            onAnswer(
              systolic === '' || diastolic === ''
                ? undefined
                : { kind: 'bp', systolic, diastolic },
            )
          }
          onUseSaved={saved ? () => onAnswer({ kind: 'fromProfile' }) : undefined}
          usingSaved={answer?.kind === 'fromProfile'}
          savedDisplay={saved?.display}
        />
      )}

      <EscapeHatches
        question={question}
        activeReason={missingReason}
        onChoose={(reason) =>
          onAnswer(
            missingReason === reason ? undefined : { kind: 'missing', reason },
          )
        }
      />
    </section>
  )
}

function NumberField({
  id,
  labelledBy,
  unit,
  value,
  onChange,
}: {
  id: string
  labelledBy: string
  unit?: string
  value: number | ''
  onChange: (value: number | '') => void
}) {
  return (
    <div className="field">
      <input
        id={id}
        aria-labelledby={labelledBy}
        className="field__input"
        type="text"
        inputMode="decimal"
        value={value}
        onChange={(event) => {
          const raw = event.target.value.replace(/[^\d.]/g, '')
          onChange(raw === '' ? '' : Number(raw))
        }}
        placeholder="—"
      />
      {unit && <span className="field__unit">{unit}</span>}
    </div>
  )
}

function BloodPressureField({
  id,
  systolic,
  diastolic,
  onChange,
  onUseSaved,
  usingSaved,
  savedDisplay,
}: {
  id: string
  systolic: number | ''
  diastolic: number | ''
  onChange: (systolic: number | '', diastolic: number | '') => void
  onUseSaved?: () => void
  usingSaved: boolean
  savedDisplay?: string
}) {
  const { t } = useLanguage()
  const clean = (raw: string) => (raw === '' ? '' : Number(raw.replace(/\D/g, '')))

  return (
    <>
      <div className="bp-field" dir="ltr">
        <input
          id={`${id}-sys`}
          className="bp-field__input"
          type="text"
          inputMode="numeric"
          value={usingSaved ? '' : systolic}
          onChange={(event) => onChange(clean(event.target.value), diastolic)}
          placeholder="—"
          aria-label={t('systolic')}
        />
        <span className="bp-field__slash" aria-hidden="true">
          /
        </span>
        <input
          id={`${id}-dia`}
          className="bp-field__input"
          type="text"
          inputMode="numeric"
          value={usingSaved ? '' : diastolic}
          onChange={(event) => onChange(systolic, clean(event.target.value))}
          placeholder="—"
          aria-label={t('diastolic')}
        />
        <span className="bp-field__unit">{t('mmhg')}</span>
      </div>

      {onUseSaved && (
        <button
          type="button"
          aria-pressed={usingSaved}
          className={`hatch hatch--wide${usingSaved ? ' is-active' : ''}`}
          onClick={onUseSaved}
        >
          {t('useSavedReading')} {savedDisplay && <strong>{savedDisplay}</strong>}
        </button>
      )}
    </>
  )
}
