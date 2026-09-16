import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { Chevron } from '@/components/ui/Chevron'
import { formatFullDate, formatTime } from '@/lib/format'

/**
 * Previous BADIRA assessments.
 *
 * Records are created only by completing an assessment in this session. No
 * past result is fabricated, and each record carries the true state of its
 * readings: awaiting the validated model.
 */
export function Assessments() {
  const { t, language } = useLanguage()
  const { assessments } = useSession()
  const navigate = useNavigate()

  if (assessments.length === 0) {
    return (
      <SubScreen title={t('navAssessments')}>
        <section className="empty-state">
          <span className="empty-state__glyph" aria-hidden="true" />
          <p className="empty-state__title">{t('noAssessmentsTitle')}</p>
          <p className="empty-state__body">{t('noAssessmentsBody')}</p>
        </section>
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate('/assessment')}
        >
          {t('startAssessment')}
        </button>
      </SubScreen>
    )
  }

  return (
    <SubScreen title={t('navAssessments')}>
      <div className="list">
        {assessments.map((record) => (
          // The record owns its result snapshot, so opening it needs no
          // recomputation — the existing result route renders it by id.
          <button
            key={record.id}
            type="button"
            className="record"
            onClick={() => navigate(`/result/${record.id}`)}
          >
            {/* The date owns its line: with the tag beside it, a full date and
                time wrapped at phone width. The tag rides the shorter line
                below, where both fit without collision. */}
            <p className="record__date">
              {formatFullDate(record.completedAt, language)}
              {/* Isolated so the clock digits never merge with the year in Arabic. */}
              <bdi className="record__time">
                {formatTime(record.completedAt, language)}
              </bdi>
            </p>
            <div className="record__line">
              <p className="record__meta">
                {record.gestationalAge
                  ? `${record.gestationalAge.weeks} ${t('weeksWord')} + ${record.gestationalAge.days} ${t('daysWord')}`
                  : t('gestationUnknown')}
              </p>
              <span className="tagline-pill">
                {record.result.risk.state === 'awaitingModel'
                  ? t('awaitingModelShort')
                  : t('simulatedShort')}
              </span>
            </div>
            <p className="record__counts">
              {t('infoProvided')}: {record.informationProvided} ·{' '}
              {t('infoUnavailable')}: {record.informationUnavailable}
            </p>
            <span className="record__go" aria-hidden="true">
              <Chevron />
            </span>
          </button>
        ))}
      </div>
      <p className="fineprint">{t('recordsNote')}</p>
    </SubScreen>
  )
}
