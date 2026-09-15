import { BloodPressureChart } from '@/components/history/BloodPressureChart'
import { saraProfile } from '@/data/mockProfile'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatDate } from '@/lib/format'
import { SubScreen } from '@/components/SubScreen'

/** Secondary view: the full measurement history moved off the home screen. */
export function History() {
  const { t, language } = useLanguage()
  const readings = [...saraProfile.bloodPressureReadings].sort((a, b) =>
    a.recordedAt.localeCompare(b.recordedAt),
  )

  return (
    <SubScreen title={t('historyTitle')}>
      <section className="card">
        <h2 className="card__title">{t('chartTitle')}</h2>
        <p className="muted muted--small">{t('measurementsSubtitle')}</p>
        <BloodPressureChart readings={readings} />
      </section>

      <section className="card">
        <h2 className="card__title">{t('allReadings')}</h2>
        <ul className="reading-list">
          {[...readings].reverse().map((reading) => (
            <li key={reading.id} className="reading-list__item">
              <span>{formatDate(reading.recordedAt, language)}</span>
              <span className="reading-list__value" dir="ltr">
                {reading.systolic}/{reading.diastolic}
              </span>
              <span className="reading-list__source">
                {reading.source === 'home' ? t('sourceHome') : t('sourceClinic')}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </SubScreen>
  )
}
