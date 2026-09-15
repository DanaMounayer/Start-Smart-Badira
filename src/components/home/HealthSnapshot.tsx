import { useNavigate } from 'react-router-dom'
import type { BloodPressureReading } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Sparkline } from '@/components/ui/Sparkline'
import { Chevron } from '@/components/ui/Chevron'

type Factor = { key: string; label: string; tone: 'blush' | 'butter' | 'sage' }

/**
 * Health snapshot — secondary to the gestation hero by design.
 *
 * The saved factors read as quiet tags and the latest reading as a single
 * tappable row. Nothing here is scored, flagged or colour-coded by value;
 * interpretation belongs to the assessment.
 */
export function HealthSnapshot({
  factors,
  readings,
}: {
  factors: Factor[]
  readings: BloodPressureReading[]
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const latest = readings[readings.length - 1]

  return (
    <section className="snapshot">
      <div className="section-head">
        <h2 className="section-head__title">{t('snapshotTitle')}</h2>
        <button
          type="button"
          className="text-btn"
          onClick={() => navigate('/history')}
        >
          {t('viewHistory')}
        </button>
      </div>

      <div className="snapshot__card">
        <ul className="tags">
          {factors.map((factor) => (
            <li key={factor.key} className={`tag tag--${factor.tone}`}>
              {factor.label}
            </li>
          ))}
        </ul>

        <button
          type="button"
          className="list__row list__row--flush"
          onClick={() => navigate('/history')}
          aria-label={`${t('bloodPressure')} ${latest.systolic}/${latest.diastolic} ${t('mmhg')} — ${t('viewHistory')}`}
        >
          <span className="list__label">{t('bloodPressure')}</span>
          <Sparkline values={readings.map((r) => r.systolic)} />
          <span className="snapshot__value" dir="ltr">
            {latest.systolic}/{latest.diastolic}
          </span>
          <Chevron />
        </button>
      </div>
    </section>
  )
}
