import type { GestationalAge } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { progressOf, trimesterOf, weeksRemaining } from '@/domain/gestation'

const TRIMESTER_KEY = { 1: 'trimester1', 2: 'trimester2', 3: 'trimester3' } as const

/**
 * Compact pregnancy header: who, how far along, and a slim progress rail.
 *
 * The rail is segmented by trimester so position is readable at a glance
 * without a large ring taking vertical space.
 */
export function PregnancyHeader({ age }: { age: GestationalAge }) {
  const { t } = useLanguage()
  const trimester = trimesterOf(age)
  const percent = Math.round(progressOf(age) * 100)

  return (
    <section className="preg-header">
      <div className="preg-header__row">
        <div>
          <h1 className="preg-header__greeting">{t('greeting')}</h1>
          {/* No dir override: the line mixes numerals with translated words,
              so it must follow page direction or bidi reorders the runs. */}
          <p className="preg-header__age">
            {age.weeks} {t('weeksWord')} + {age.days} {t('daysWord')}
          </p>
        </div>
        <span className="chip chip--accent">
          {t(TRIMESTER_KEY[trimester] satisfies keyof Strings)}
        </span>
      </div>

      <div
        className="rail"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={t('progressLabel')}
      >
        <span className="rail__fill" style={{ inlineSize: `${percent}%` }} />
        <span className="rail__tick" style={{ insetInlineStart: '32.5%' }} />
        <span className="rail__tick" style={{ insetInlineStart: '67.5%' }} />
      </div>

      <p className="preg-header__remaining">
        {weeksRemaining(age)} {t('weeksToGo')}
      </p>
    </section>
  )
}
