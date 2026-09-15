import { useLanguage } from '@/i18n/LanguageProvider'

type Indicator = { key: string; label: string }

/**
 * The check-in card: tells Sara that BADIRA already holds what it needs for
 * today, as three compact indicators rather than a list of her history.
 */
export function CheckInCard({ indicators }: { indicators: Indicator[] }) {
  const { t } = useLanguage()

  return (
    <section className="checkin">
      <p className="checkin__eyebrow">{t('checkInEyebrow')}</p>
      <h2 className="checkin__title">{t('checkInTitle')}</h2>

      <ul className="checkin__indicators">
        {indicators.map((indicator) => (
          <li key={indicator.key} className="checkin__indicator">
            <CheckIcon />
            {indicator.label}
          </li>
        ))}
      </ul>
    </section>
  )
}

function CheckIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d="M3.5 8.5 6.5 11.5 12.5 5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
