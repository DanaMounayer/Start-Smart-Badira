import { useState } from 'react'
import type { FieldId } from '@/domain/profile/sections'
import type { PregnancyProfile } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { dueDateFrom } from '@/domain/gestation'

type Patch = Partial<PregnancyProfile>

const CONDITION_OPTIONS: { id: string; labelKey: keyof Strings }[] = [
  { id: 'chronicHypertension', labelKey: 'chronicHypertension' },
  { id: 'diabetes', labelKey: 'optDiabetes' },
  { id: 'kidney', labelKey: 'optKidney' },
]

const FAMILY_OPTIONS: { id: string; labelKey: keyof Strings }[] = [
  { id: 'motherPreeclampsia', labelKey: 'motherPreeclampsia' },
]

/** Simple value fields sit together on one surface as label/value rows. */
const VALUE_FIELDS: FieldId[] = ['gestationalAge', 'pregnancyNumber', 'age', 'bmi']

/** Groups consecutive value fields so they render as one inset list. */
function groupFields(fields: FieldId[]): { kind: 'values' | 'single'; items: FieldId[] }[] {
  const runs: { kind: 'values' | 'single'; items: FieldId[] }[] = []
  for (const field of fields) {
    const kind = VALUE_FIELDS.includes(field) ? 'values' : 'single'
    const last = runs[runs.length - 1]
    if (kind === 'values' && last?.kind === 'values') last.items.push(field)
    else runs.push({ kind, items: [field] })
  }
  return runs
}

/**
 * Editors for the profile fields a section owns.
 *
 * Every field here already exists in the profile model; none is invented, and
 * none carries a threshold, range or validation beyond "is this a number".
 */
export function SectionFields({
  fields,
  draft,
  onChange,
}: {
  fields: FieldId[]
  draft: PregnancyProfile
  onChange: (patch: Patch) => void
}) {
  const { t } = useLanguage()

  const renderField = (field: FieldId) => {
    {
      switch (field) {
          case 'gestationalAge':
            return (
              <Field key={field} label={t('gestationLabel')} inline>
                {/* No dir override: these are two labelled fields, so they
                    follow page direction and "weeks" is read first. */}
                <div className="pair pair--trailing">
                  <NumberBox
                    inline
                    value={draft.gestationalAge?.weeks ?? ''}
                    suffix={t('weeksWord')}
                    ariaLabel={t('weeksWord')}
                    onChange={(weeks) => {
                      const next =
                        weeks === ''
                          ? null
                          : { weeks, days: draft.gestationalAge?.days ?? 0 }
                      onChange({
                        gestationalAge: next,
                        estimatedDueDate: next
                          ? dueDateFrom(next, new Date()).toISOString().slice(0, 10)
                          : null,
                      })
                    }}
                  />
                  <NumberBox
                    inline
                    value={draft.gestationalAge?.days ?? ''}
                    suffix={t('daysWord')}
                    ariaLabel={t('daysWord')}
                    onChange={(days) => {
                      if (!draft.gestationalAge) return
                      const next = { weeks: draft.gestationalAge.weeks, days: days === '' ? 0 : days }
                      onChange({
                        gestationalAge: next,
                        estimatedDueDate: dueDateFrom(next, new Date())
                          .toISOString()
                          .slice(0, 10),
                      })
                    }}
                  />
                </div>
              </Field>
            )

          case 'pregnancyNumber':
            return (
              <Field key={field} label={t('pregnancyNumber')} inline>
                <NumberBox
                  inline
                  value={draft.pregnancyNumber ?? ''}
                  ariaLabel={t('pregnancyNumber')}
                  onChange={(value) =>
                    onChange({ pregnancyNumber: value === '' ? null : value })
                  }
                />
              </Field>
            )

          case 'age':
            return (
              <Field key={field} label={t('age')} inline>
                <NumberBox
                  inline
                  value={draft.age ?? ''}
                  suffix={t('years')}
                  ariaLabel={t('age')}
                  onChange={(value) => onChange({ age: value === '' ? null : value })}
                />
              </Field>
            )

          case 'bmi':
            return (
              <Field key={field} label={t('bmi')} inline>
                <NumberBox
                  inline
                  value={draft.bmi ?? ''}
                  suffix={t('bmiUnit')}
                  ariaLabel={t('bmi')}
                  onChange={(value) => onChange({ bmi: value === '' ? null : value })}
                />
              </Field>
            )

          case 'chronicConditions':
            return (
              <Field key={field} label={t('chronicConditionsLabel')}>
                <Toggles
                  options={CONDITION_OPTIONS}
                  selected={draft.chronicConditions}
                  onToggle={(next) => onChange({ chronicConditions: next })}
                />
              </Field>
            )

          case 'familyHistory':
            return (
              <Field key={field} label={t('familyHistoryLabel')}>
                <Toggles
                  options={FAMILY_OPTIONS}
                  selected={draft.familyHistory}
                  onToggle={(next) => onChange({ familyHistory: next })}
                />
              </Field>
            )

          case 'previousPreeclampsia':
            return (
              <Field key={field} label={t('previousPregnancy')}>
                <Triple
                  value={draft.previousPregnancies[0]?.hadPreeclampsia ?? undefined}
                  onChange={(hadPreeclampsia) =>
                    onChange({
                      previousPregnancies: [
                        { id: 'p1', year: null, hadPreeclampsia },
                      ],
                    })
                  }
                />
              </Field>
            )

          case 'bloodPressure':
            return (
              <Field key={field} label={t('bloodPressure')}>
                <BpAdder
                  onAdd={(systolic, diastolic) =>
                    onChange({
                      bloodPressureReadings: [
                        ...draft.bloodPressureReadings,
                        {
                          id: `bp-${Date.now()}`,
                          systolic,
                          diastolic,
                          recordedAt: new Date().toISOString().slice(0, 10),
                          source: 'home',
                        },
                      ],
                    })
                  }
                  count={draft.bloodPressureReadings.length}
                />
              </Field>
            )
      }
    }
  }

  return (
    <div className="fields">
      {groupFields(fields).map((run, i) =>
        run.kind === 'values' ? (
          <div className="field-group" key={`g${i}`}>
            {run.items.map((field) => renderField(field))}
          </div>
        ) : (
          <div key={`s${i}`}>{run.items.map((field) => renderField(field))}</div>
        ),
      )}
    </div>
  )
}

function Field({
  label,
  children,
  inline = false,
}: {
  label: string
  children: React.ReactNode
  /** Inline rows sit on the shared section surface; blocks stand alone. */
  inline?: boolean
}) {
  if (inline) {
    return (
      <section className="field-row field-row--inline">
        <p className="field-row__label">{label}</p>
        {children}
      </section>
    )
  }
  return (
    <section className="field-row">
      <p className="eyebrow">{label}</p>
      {children}
    </section>
  )
}

function NumberBox({
  value,
  suffix,
  ariaLabel,
  onChange,
  inline = false,
}: {
  value: number | ''
  suffix?: string
  ariaLabel: string
  onChange: (value: number | '') => void
  inline?: boolean
}) {
  return (
    <label className={inline ? 'numbox numbox--inline' : 'numbox'}>
      <input
        className="numbox__input"
        type="text"
        inputMode="decimal"
        value={value}
        aria-label={ariaLabel}
        placeholder="—"
        onChange={(event) => {
          const raw = event.target.value.replace(/[^\d.]/g, '')
          onChange(raw === '' ? '' : Number(raw))
        }}
      />
      {suffix && <span className="numbox__suffix">{suffix}</span>}
    </label>
  )
}

function Toggles({
  options,
  selected,
  onToggle,
}: {
  options: { id: string; labelKey: keyof Strings }[]
  selected: string[]
  onToggle: (next: string[]) => void
}) {
  const { t } = useLanguage()
  return (
    <div className="choices">
      {options.map((option) => {
        const on = selected.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            role="checkbox"
            aria-checked={on}
            className={`choice${on ? ' is-selected' : ''}`}
            onClick={() =>
              onToggle(on ? selected.filter((id) => id !== option.id) : [...selected, option.id])
            }
          >
            <span className="choice__label">{t(option.labelKey)}</span>
            <span className="choice__mark">
              {on && (
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3.8 9.4 7.2 12.8 14.2 5.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

/** Yes / no / not sure — "not sure" is a real answer, stored as null. */
function Triple({
  value,
  onChange,
}: {
  value: boolean | null | undefined
  onChange: (value: boolean | null) => void
}) {
  const { t } = useLanguage()
  const options: { id: string; label: string; value: boolean | null }[] = [
    { id: 'yes', label: t('optYes'), value: true },
    { id: 'no', label: t('optNo'), value: false },
    { id: 'unsure', label: t('iDontKnow'), value: null },
  ]

  return (
    <div className="choices" role="radiogroup">
      {options.map((option) => {
        const on = value === option.value && value !== undefined
        return (
          <button
            key={option.id}
            type="button"
            role="radio"
            aria-checked={on}
            className={`choice${on ? ' is-selected' : ''}`}
            onClick={() => onChange(option.value)}
          >
            <span className="choice__label">{option.label}</span>
            <span className="choice__mark choice__mark--round">
              {on && (
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path d="M3.8 9.4 7.2 12.8 14.2 5.4" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function BpAdder({
  onAdd,
  count,
}: {
  onAdd: (systolic: number, diastolic: number) => void
  count: number
}) {
  const { t } = useLanguage()
  const [sys, setSys] = useState<number | ''>('')
  const [dia, setDia] = useState<number | ''>('')

  return (
    <>
      <div className="pair" dir="ltr">
        <NumberBox value={sys} ariaLabel={t('systolic')} onChange={setSys} />
        <NumberBox value={dia} ariaLabel={t('diastolic')} onChange={setDia} />
      </div>
      <button
        type="button"
        className="btn btn--tinted btn--block"
        disabled={sys === '' || dia === ''}
        onClick={() => {
          if (sys === '' || dia === '') return
          onAdd(sys, dia)
          setSys('')
          setDia('')
        }}
      >
        {t('addReading')}
      </button>
      <p className="field-row__hint">
        {count} {t('chipRecentReadings')}
      </p>
    </>
  )
}
