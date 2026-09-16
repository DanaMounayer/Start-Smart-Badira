import type { GestationalAge } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate } from '@/lib/format'
import { progressOf, trimesterOf, weeksRemaining } from '@/domain/gestation'

const TRIMESTER_KEY = { 1: 'trimester1', 2: 'trimester2', 3: 'trimester3' } as const

const SIZE = 190
const STROKE = 13
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

/**
 * The home screen's centrepiece: where this pregnancy is, right now.
 *
 * Given the most space and the largest type on the screen — Time is both the
 * user's primary context and one of BADIRA's three axes. Everything else on
 * the screen is deliberately quieter than this.
 */
export function GestationHero({
  age,
  dueDate,
}: {
  age: GestationalAge
  dueDate: string
}) {
  const { t, language } = useLanguage()
  const progress = progressOf(age)
  const percent = Math.round(progress * 100)

  return (
    <section className="hero">
      <div className="hero__ring">
        <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`} aria-hidden="true">
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            className="hero__track"
            fill="none"
            strokeWidth={STROKE}
          />
          <circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RADIUS}
            className="hero__progress"
            fill="none"
            strokeWidth={STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - progress)}
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </svg>

        <div
          className="hero__readout"
          role="progressbar"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={t('progressLabel')}
        >
          <span className="hero__week">{age.weeks}</span>
          <span className="hero__weeks-label">{t('weeksWord')}</span>
          <span className="hero__days">
            <bdi dir="ltr">+{age.days}</bdi> {t('daysWord')}
          </span>
        </div>
      </div>

      <p className="hero__trimester">
        {t(TRIMESTER_KEY[trimesterOf(age)] satisfies keyof Strings)}
      </p>

      <div className="hero__meta">
        <span>
          {weeksRemaining(age)} {t('weeksToGo')}
        </span>
        <span className="hero__dot" aria-hidden="true" />
        <span>
          {t('dueShort')} {formatFullDate(dueDate, language)}
        </span>
      </div>
    </section>
  )
}
