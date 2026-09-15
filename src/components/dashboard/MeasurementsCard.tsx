import type { BloodPressureReading } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatDate } from '@/lib/format'
import { BloodPressureChart } from './BloodPressureChart'

/**
 * "Recent Measurements" — shows that BADIRA holds a history, not a snapshot.
 *
 * Readings are listed as values only. No reading is marked normal, high or
 * concerning anywhere on this screen.
 */
export function MeasurementsCard({
  readings,
}: {
  readings: BloodPressureReading[]
}) {
  const { t, language } = useLanguage()
  const ordered = [...readings].sort((a, b) =>
    a.recordedAt.localeCompare(b.recordedAt),
  )
  const latest = ordered[ordered.length - 1]

  return (
    <section className="card">
      <header className="card__header">
        <h2 className="card__title">{t('measurementsTitle')}</h2>
        <p className="muted">{t('measurementsSubtitle')}</p>
      </header>

      <div className="measure__latest">
        <div>
          <p className="muted">
            {t('bloodPressure')} · {t('latest')}
          </p>
          <p className="measure__value" dir="ltr">
            {latest.systolic}/{latest.diastolic}
            <span className="measure__unit">{t('mmhg')}</span>
          </p>
        </div>
        <span className="pill pill--quiet">
          {ordered.length} {t('readingsCount')}
        </span>
      </div>

      <BloodPressureChart readings={ordered} />

      <ul className="reading-list">
        {[...ordered].reverse().map((reading) => (
          <li key={reading.id} className="reading-list__item">
            <span className="reading-list__date">
              {formatDate(reading.recordedAt, language)}
            </span>
            <span className="reading-list__value" dir="ltr">
              {reading.systolic}/{reading.diastolic}
            </span>
            <span className="reading-list__source muted">
              {reading.source === 'home' ? t('sourceHome') : t('sourceClinic')}
            </span>
          </li>
        ))}
      </ul>
    </section>
  )
}
