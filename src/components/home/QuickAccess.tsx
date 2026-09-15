import { useNavigate } from 'react-router-dom'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'

type Tile = {
  to: string
  label: keyof Strings
  /** Small count or state shown under the label, already localized. */
  meta: string
  icon: 'profile' | 'history' | 'assessments'
}

/**
 * The three places detail lives. Keeps the home screen a summary while making
 * everything saved reachable in one tap.
 */
export function QuickAccess({ tiles }: { tiles: Tile[] }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <nav className="quick" aria-label={t('quickAccess')}>
      {tiles.map((tile) => (
        <button
          key={tile.to}
          type="button"
          className="quick__tile"
          onClick={() => navigate(tile.to)}
        >
          <TileIcon name={tile.icon} />
          <span className="quick__label">{t(tile.label)}</span>
          <span className="quick__meta">{tile.meta}</span>
        </button>
      ))}
    </nav>
  )
}

function TileIcon({ name }: { name: Tile['icon'] }) {
  const common = {
    width: 17,
    height: 17,
    viewBox: '0 0 20 20',
    fill: 'none',
    'aria-hidden': true,
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }
  if (name === 'profile') {
    return (
      <svg {...common}>
        <circle cx="10" cy="7" r="3.2" />
        <path d="M4 16.5c1.2-2.7 3.4-4 6-4s4.8 1.3 6 4" />
      </svg>
    )
  }
  if (name === 'history') {
    return (
      <svg {...common}>
        <path d="M3.5 13.5 8 9l3 3 4.5-5.5" />
        <path d="M3.5 3.5v13h13" />
      </svg>
    )
  }
  return (
    <svg {...common}>
      <path d="M5 3.5h10v13H5z" />
      <path d="M7.8 7.5h4.4M7.8 10.5h4.4M7.8 13.5h2.4" />
    </svg>
  )
}
