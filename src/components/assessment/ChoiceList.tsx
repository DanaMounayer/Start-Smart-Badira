import type { Option } from '@/domain/assessment/schema'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Native-feeling selection list. One surface, hairline separators, a checkmark
 * on the trailing edge — no radio dots or Material ripples.
 */
export function ChoiceList({
  options,
  selectedIds,
  multi,
  onToggle,
}: {
  options: Option[]
  selectedIds: string[]
  multi: boolean
  onToggle: (optionId: string, option: Option) => void
}) {
  const { t } = useLanguage()

  return (
    <div className="choices" role={multi ? 'group' : 'radiogroup'}>
      {options.map((option) => {
        const isSelected = selectedIds.includes(option.id)
        return (
          <button
            key={option.id}
            type="button"
            role={multi ? 'checkbox' : 'radio'}
            aria-checked={isSelected}
            className={`choice${isSelected ? ' is-selected' : ''}`}
            onClick={() => onToggle(option.id, option)}
          >
            <span className="choice__label">{t(option.labelKey)}</span>
            {isSelected && <Check />}
          </button>
        )
      })}
    </div>
  )
}

function Check() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true" className="choice__check">
      <path
        d="M3.8 9.4 7.2 12.8 14.2 5.4"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
