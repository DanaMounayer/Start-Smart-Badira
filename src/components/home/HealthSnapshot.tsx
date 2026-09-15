import { useNavigate } from 'react-router-dom'
import type { BloodPressureReading } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Sparkline } from '@/components/ui/Sparkline'

type Chip = { key: string; label: string; tone: 'blush' | 'butter' | 'sage' }

/**
 * Health snapshot: the few saved facts most worth surfacing, as chips, plus
 * the latest reading. Everything else lives behind "View history" and the
 * profile view.
 *
 * Nothing here is scored or flagged — no reading is marked normal or high.
 */
export function HealthSnapshot({
  chips,
  readings,
}: {
  chips: Chip[]
  readings: BloodPressureReading[]
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const latest = readings[readings.length - 1]

  return (
    <section className="snapshot">
      <header className="snapshot__head">
        <h2 className="snapshot__title">{t('snapshotTitle')}</h2>
        <button
          type="button"
          className="link-btn"
          onClick={() => navigate('/history')}
        >
          {t('viewHistory')}
          <Chevron />
        </button>
      </header>

      <div className="snapshot__body">
        <ul className="chips">
        {chips.map((chip) => (
          <li key={chip.key} className={`chip chip--${chip.tone}`}>
            {chip.label}
          </li>
        ))}
        </ul>

        <button
          type="button"
          className="bp-row"
          onClick={() => navigate('/history')}
          aria-label={`${t('bloodPressure')} ${latest.systolic}/${latest.diastolic} ${t('mmhg')} — ${t('viewHistory')}`}
        >
          <span className="bp-row__label">{t('bloodPressure')}</span>
          <span className="bp-row__value" dir="ltr">
            {latest.systolic}/{latest.diastolic}
            <em>{t('mmhg')}</em>
          </span>
          <Sparkline values={readings.map((r) => r.systolic)} />
        </button>
      </div>
    </section>
  )
}

function Chevron() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className="chevron"
    >
      <path
        d="m6 4 4 4-4 4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
