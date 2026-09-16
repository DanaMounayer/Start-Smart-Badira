import type { Option } from '@/domain/assessment/schema'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Selection list.
 *
 * One soft surface, generous rows and a filled mark on the trailing edge — the
 * selected state should read from across the room without the row becoming a
 * coloured block.
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
            <span className={`choice__mark${multi ? '' : ' choice__mark--round'}`}>
              {isSelected && (
                <svg width="15" height="15" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <path
                    d="M3.8 9.4 7.2 12.8 14.2 5.4"
                    stroke="currentColor"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )
}
