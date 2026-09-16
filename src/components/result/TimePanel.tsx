import type { TimeContext } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate } from '@/lib/format'
import { progressOf, TERM_WEEKS } from '@/domain/gestation'

/**
 * Time — where in the pregnancy this result belongs.
 *
 * The marker fixes the result to a point on the pregnancy rather than letting
 * it read as timeless. The clinical meaning of that timing is deliberately
 * absent: no timing rule is invented.
 */
export function TimePanel({ time }: { time: TimeContext }) {
  const { t, language } = useLanguage()
  const age = time.gestationalAge
  const position = age ? progressOf(age) : 0

  return (
    <section className="context-panel">
      <div className="context-panel__head">
        <h3 className="panel-title">{t('timeLabel')}</h3>
        {time.interpretation.state === 'awaitingModel' && (
          <span className="tagline-pill">{t('awaitingModelShort')}</span>
        )}
      </div>

      <p className="time-at">
        {age ? (
          <>
            <strong>
              {age.weeks} {t('weeksWord')}
            </strong>
            <span>
              <bdi dir="ltr">+{age.days}</bdi> {t('daysWord')}
            </span>
          </>
        ) : (
          <strong>{t('gestationUnknown')}</strong>
        )}
      </p>

      {age && (
        <div className="timeline" aria-hidden="true">
          <span className="timeline__rail" />
          <span className="timeline__marker" style={{ insetInlineStart: `${position * 100}%` }} />
          <span className="timeline__ends">
            <span>0</span>
            <span>{TERM_WEEKS}</span>
          </span>
        </div>
      )}

      <p className="context-panel__note">
        <span className="time-stamp">
          {t('timeAssessedOn')} {formatFullDate(time.assessedAt, language)}
        </span>
        {t('timeBelongsNote')}
      </p>
    </section>
  )
}
