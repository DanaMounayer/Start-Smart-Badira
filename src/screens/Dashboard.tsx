import { useNavigate } from 'react-router-dom'
import { GreetingHeader } from '@/components/dashboard/GreetingHeader'
import { GestationCard } from '@/components/dashboard/GestationCard'
import { ProfileSummary } from '@/components/dashboard/ProfileSummary'
import { MeasurementsCard } from '@/components/dashboard/MeasurementsCard'
import { HowBadiraUsesThis } from '@/components/dashboard/HowBadiraUsesThis'
import { saraProfile } from '@/data/mockProfile'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate, isToday } from '@/lib/format'

/**
 * Screen 1 — returning-user pregnancy profile / dashboard.
 *
 * The profile is read from a mock module for now. When a real data source
 * arrives, only that import changes; the components below take a
 * `PregnancyProfile` and are agnostic about where it came from.
 */
export function Dashboard() {
  const { t, language } = useLanguage()
  const navigate = useNavigate()
  const profile = saraProfile

  return (
    <>
      <GreetingHeader profile={profile} />
      <p className="muted muted--small">{t('welcomeBack')}</p>

      <GestationCard
        gestationalAge={profile.gestationalAge}
        estimatedDueDate={profile.estimatedDueDate}
      />

      <ProfileSummary profile={profile} />

      <MeasurementsCard readings={profile.bloodPressureReadings} />

      <p className="last-updated">
        <span className="dot" aria-hidden="true" />
        {t('lastUpdated')}:{' '}
        <strong>
          {isToday(profile.lastUpdatedAt)
            ? t('updatedToday')
            : formatFullDate(profile.lastUpdatedAt, language)}
        </strong>
      </p>

      <HowBadiraUsesThis />

      <div className="actions">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate('/assessment')}
        >
          {t('startAssessment')}
        </button>
        <button
          type="button"
          className="btn btn--secondary"
          onClick={() => navigate('/profile/update')}
        >
          {t('updateInformation')}
        </button>
      </div>
    </>
  )
}
