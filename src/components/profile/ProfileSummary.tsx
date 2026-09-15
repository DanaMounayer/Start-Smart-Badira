import type { PregnancyProfile } from '@/domain/types'
import type { Strings } from '@/i18n'
import { useLanguage } from '@/i18n/LanguageProvider'

type Row = {
  label: keyof Strings
  value: string
  /** Rendered muted when the entry records an absence rather than a finding. */
  absent?: boolean
}

/**
 * "Your Pregnancy Profile" — the saved information BADIRA already holds.
 *
 * Entries are presented neutrally. Nothing here is weighted, scored or
 * flagged; that belongs to the assessment layer.
 */
export function ProfileSummary({ profile }: { profile: PregnancyProfile }) {
  const { t, language } = useLanguage()
  const listSeparator = language === 'ar' ? '، ' : ', '
  const previous = profile.previousPregnancies[0]

  const rows: Row[] = [
    { label: 'age', value: `${profile.age} ${t('years')}` },
    {
      label: 'pregnancyNumber',
      value: profile.pregnancyNumber === 2 ? t('secondPregnancy') : `#${profile.pregnancyNumber}`,
    },
    { label: 'bmi', value: profile.bmi ? `${profile.bmi} ${t('bmiUnit')}` : '—' },
    {
      label: 'previousPregnancy',
      value:
        previous && previous.hadPreeclampsia === false
          ? t('noPreeclampsiaBefore')
          : '—',
      absent: previous?.hadPreeclampsia === false,
    },
    {
      label: 'chronicConditionsLabel',
      value: profile.chronicConditions
        .map((key) => t(key as keyof Strings))
        .join(listSeparator),
    },
    {
      label: 'familyHistoryLabel',
      value: profile.familyHistory.map((key) => t(key as keyof Strings)).join(listSeparator),
    },
    {
      label: 'symptomsLabel',
      value: profile.reportedSymptoms.length
        ? profile.reportedSymptoms.join(listSeparator)
        : t('noSymptoms'),
      absent: profile.reportedSymptoms.length === 0,
    },
  ]

  return (
    <section className="card">
      <header className="card__header">
        <h2 className="card__title">{t('profileTitle')}</h2>
        <p className="muted">{t('profileSubtitle')}</p>
      </header>

      <dl className="profile-grid">
        {rows.map((row) => (
          <div className="profile-grid__row" key={row.label}>
            <dt>{t(row.label)}</dt>
            <dd className={row.absent ? 'is-absent' : undefined}>{row.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
