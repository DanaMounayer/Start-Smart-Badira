import type { GestationalAge } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate } from '@/lib/format'
import { progressOf, trimesterOf, weeksRemaining } from '@/domain/gestation'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const TRIMESTER_KEY = {
  1: 'trimester1',
  2: 'trimester2',
  3: 'trimester3',
} as const

/**
 * Hero card: where this pregnancy currently is in time.
 *
 * Time is one of BADIRA's three axes, so gestational age gets the most visual
 * weight on the dashboard.
 */
export function GestationCard({
  gestationalAge,
  estimatedDueDate,
}: {
  gestationalAge: GestationalAge
  estimatedDueDate: string
}) {
  const { t, language } = useLanguage()
  const progress = progressOf(gestationalAge)
  const trimester = trimesterOf(gestationalAge)

  return (
    <section className="card gestation">
      <div className="gestation__main">
        <div className="gestation__ring" role="img" aria-label={t('progressLabel')}>
          <svg viewBox="0 0 120 120" width="120" height="120">
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              className="gestation__ring-track"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r={RADIUS}
              className="gestation__ring-value"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
              transform="rotate(-90 60 60)"
            />
          </svg>
          <div className="gestation__ring-label" dir="ltr">
            <span className="gestation__weeks">{gestationalAge.weeks}</span>
            <span className="gestation__days">
              +{gestationalAge.days}
              {t('daysShort')}
            </span>
          </div>
        </div>

        <div className="gestation__meta">
          <p className="gestation__eyebrow">{t('gestationLabel')}</p>
          <p className="gestation__trimester">
            {t(TRIMESTER_KEY[trimester] satisfies keyof Strings)}
          </p>
          <p className="muted">
            {weeksRemaining(gestationalAge)} {t('weeksToGo')}
          </p>
        </div>
      </div>

      <div className="gestation__due">
        <span className="muted">{t('dueDate')}</span>
        <strong>{formatFullDate(estimatedDueDate, language)}</strong>
      </div>
    </section>
  )
}
