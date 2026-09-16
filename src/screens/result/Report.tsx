import { Navigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { formatFullDate } from '@/lib/format'
import { COVERAGE_COPY, RISK_COPY } from '@/domain/result/copy'

/**
 * Detailed report — readable by the woman and by a clinician.
 *
 * A structured document, not a debug dump: every section is labelled in plain
 * language, and the simulated Risk carries its "Simulation" label into the
 * document rather than reading as a finding.
 */
export function ResultReport() {
  const { t, language } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useStoredResult(id)

  // A result only exists for a completed assessment; an unknown id has
  // nothing to show, so it goes home rather than rendering an empty shell.
  if (!result) return <Navigate to="/" replace />
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
          value={t(RISK_COPY[result.risk.category].categoryKey)}
        />
        <Row
          label={t('reliabilityLabel')}
          value={t(COVERAGE_COPY[result.reliability.coverage].labelKey)}
        />
        <Row
          label={t('timeLabel')}
          value={t('timeRecordedSummary')}
          block
        />
      </dl>

      <ReportList label={t('reportInformationUsed')} items={held.map((i) => t(i.labelKey))} />
      <ReportList
        label={t('reportUnavailable')}
        items={unavailable.map((i) => t(i.labelKey))}
        emptyLabel={t('reviewNothingMissing')}
      />
      {/* The simulation weighs nothing, so there is no ranked list to show and
          no "awaiting model" to fall back to: the report names what was
          considered, which is the whole of what the prototype used. */}
      <ReportList
        label={t('whyConsidered')}
        items={
          result.factors.length > 0
            ? result.factors.map((f) => t(f.labelKey))
            : held.map((i) => t(i.labelKey))
        }
        emptyLabel={t('noneRecorded')}
      />

    </SubScreen>
  )
}

function Row({
  label,
  value,
  block = false,
}: {
  label: string
  value: string
  /** Stacks label over value, for a reading that is a sentence, not a term. */
  block?: boolean
}) {
  return (
    <div className={`report__row${block ? ' report__row--block' : ''}`}>
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
      <h2 className="eyebrow">{label}</h2>
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
