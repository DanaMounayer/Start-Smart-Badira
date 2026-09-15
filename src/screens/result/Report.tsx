import { useParams } from 'react-router-dom'
import { useResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { formatFullDate } from '@/lib/format'

/**
 * Detailed report — readable by the woman and by a clinician.
 *
 * A structured document, not a debug dump: every section is labelled in plain
 * language, and the readings that await the model say so rather than showing
 * an empty field.
 */
export function ResultReport() {
  const { t, language } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useResult()
  const age = result.time.gestationalAge

  const held = result.information.filter((item) => item.status === 'provided')
  const unavailable = result.information.filter((item) => item.status === 'unavailable')

  return (
    <SubScreen title={t('detailedReport')} backTo={`/result/${id}`}>
      {result.demo && <p className="demo-note">{t('demoResultNote')}</p>}

      <dl className="report">
        <Row label={t('reportDate')} value={formatFullDate(result.time.assessedAt, language)} />
        <Row
          label={t('gestationLabel')}
          value={
            age
              ? `${age.weeks} ${t('weeksWord')} + ${age.days} ${t('daysWord')}`
              : t('gestationUnknown')
          }
        />
        <Row
          label={t('riskLabel')}
          value={result.risk.state === 'awaitingModel' ? t('awaitingModelShort') : result.risk.label}
        />
        <Row
          label={t('reliabilityLabel')}
          value={
            result.reliability.state === 'awaitingModel'
              ? t('awaitingModelShort')
              : result.reliability.label
          }
        />
        <Row
          label={t('timeLabel')}
          value={
            result.time.interpretation.state === 'awaitingModel'
              ? t('awaitingModelShort')
              : result.time.interpretation.summary
          }
        />
      </dl>

      <ReportList label={t('reportInformationUsed')} items={held.map((i) => i.label)} />
      <ReportList
        label={t('reportUnavailable')}
        items={unavailable.map((i) => i.label)}
        emptyLabel={t('reviewNothingMissing')}
      />
      <ReportList
        label={t('whyInfluential')}
        items={result.factors.map((f) => f.label)}
        emptyLabel={t('awaitingModelShort')}
      />

      <p className="result__disclaimer">{t('badiraDisclaimer')}</p>
    </SubScreen>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="report__row">
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  )
}

function ReportList({
  label,
  items,
  emptyLabel,
}: {
  label: string
  items: string[]
  emptyLabel?: string
}) {
  return (
    <section className="info-group">
      <h2 className="info-group__label">{label}</h2>
      {items.length === 0 ? (
        <p className="info-group__empty">{emptyLabel}</p>
      ) : (
        <ul className="report__list">
          {items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
    </section>
  )
}
