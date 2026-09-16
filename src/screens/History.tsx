import { useNavigate } from 'react-router-dom'
import { BloodPressureChart } from '@/components/history/BloodPressureChart'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatDate } from '@/lib/format'
import { SubScreen } from '@/components/SubScreen'
import { Chevron } from '@/components/ui/Chevron'

/**
 * Measurement history.
 *
 * Readings and their dates, nothing more: no trend is named, no reading is
 * interpreted, flagged or coloured. What makes it part of BADIRA rather than a
 * tracker is the framing — these are the readings BADIRA draws on — and the
 * link out to assessment history, which is a different record entirely.
 */
export function History() {
  const { t, language } = useLanguage()
  const { profile, assessments } = useSession()
  const navigate = useNavigate()

  const readings = [...(profile?.bloodPressureReadings ?? [])].sort((a, b) =>
    a.recordedAt.localeCompare(b.recordedAt),
  )

  if (readings.length === 0) {
    return (
      <SubScreen title={t('historyTitle')}>
        <section className="empty-state">
          <span className="empty-state__glyph" aria-hidden="true" />
          <p className="empty-state__title">{t('historyEmptyTitle')}</p>
          <p className="empty-state__body">{t('historyEmptyBody')}</p>
        </section>
      </SubScreen>
    )
  }

  const first = readings[0]
  const last = readings[readings.length - 1]

  return (
    <SubScreen title={t('historyTitle')}>
      <p className="lede">{t('measurementsSubtitle')}</p>

      <section className="panel">
        <h2 className="panel-title">{t('chartTitle')}</h2>
        <BloodPressureChart readings={readings} />
      </section>

      <section className="group">
        <h2 className="eyebrow">{t('allReadings')}</h2>
        <div className="panel panel--flush">
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
        </div>
        {/* Facts already on the page, stated plainly. No trend, no reading. */}
        <p className="fineprint">
          {readings.length} {t('chipRecentReadings')} ·{' '}
          {formatDate(first.recordedAt, language)} – {formatDate(last.recordedAt, language)}
        </p>
      </section>

      {/* Measurement history and assessment history are different records. */}
      <nav className="list" aria-label={t('navAssessments')}>
        <button type="button" className="list__row" onClick={() => navigate('/assessments')}>
          <span className="section-row">
            <span className="list__label">{t('navAssessments')}</span>
            <span className="section-row__blurb">{t('historyVsAssessments')}</span>
          </span>
          <span className="list__value">
            {assessments.length || t('noAssessmentsYet')}
          </span>
          <Chevron />
        </button>
      </nav>
    </SubScreen>
  )
}
