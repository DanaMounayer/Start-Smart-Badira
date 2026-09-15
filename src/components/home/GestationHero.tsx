import type { GestationalAge } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate } from '@/lib/format'
import { progressOf, trimesterOf, weeksRemaining } from '@/domain/gestation'

const TRIMESTER_KEY = { 1: 'trimester1', 2: 'trimester2', 3: 'trimester3' } as const

/**
 * The home screen's anchor: where this pregnancy is, right now.
 *
 * Given the most typographic weight on the screen because Time is both the
 * user's primary context and one of BADIRA's three axes.
 */
export function GestationHero({
  age,
  dueDate,
}: {
  age: GestationalAge
  dueDate: string
}) {
  const { t, language } = useLanguage()
  const percent = Math.round(progressOf(age) * 100)

  return (
    <section className="hero">
      <div className="hero__top">
        <p className="hero__figure">
          <span className="hero__week">{age.weeks}</span>
          <span className="hero__unit">
            {t('weeksWord')}
            <em>
              {/* Isolated: "+4" is sign-plus-digit with no strong character,
                  so an RTL base direction would render it as "4+". */}
              <bdi dir="ltr">+{age.days}</bdi> {t('daysWord')}
            </em>
          </span>
        </p>
        <span className="chip chip--accent">
          {t(TRIMESTER_KEY[trimesterOf(age)] satisfies keyof Strings)}
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

      <div className="hero__foot">
        <span>
          {weeksRemaining(age)} {t('weeksToGo')}
        </span>
        <span className="hero__due">
          {t('dueShort')} {formatFullDate(dueDate, language)}
        </span>
      </div>
    </section>
  )
}
