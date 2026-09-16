import { useNavigate } from 'react-router-dom'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

type Row = {
  to: string
  label: keyof Strings
  /** Already-localized trailing value. */
  value: string
}

/**
 * Grouped inset list — the native pattern for "everything saved lives here".
 * One surface, hairline separators, no nested boxes and no tile grid.
 */
export function InfoList({ rows }: { rows: Row[] }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <nav className="list" aria-label={t('quickAccess')}>
      {rows.map((row) => (
        <button
          key={row.to}
          type="button"
          className="list__row"
          onClick={() => navigate(row.to)}
        >
          <span className="list__label">{t(row.label)}</span>
          <span className="list__value">{row.value}</span>
          <Chevron />
        </button>
      ))}
    </nav>
  )
}
