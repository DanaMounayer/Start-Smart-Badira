import { useNavigate } from 'react-router-dom'
import { PregnancyHeader } from '@/components/home/PregnancyHeader'
import { CheckInCard } from '@/components/home/CheckInCard'
import { HealthSnapshot } from '@/components/home/HealthSnapshot'
import { saraProfile } from '@/data/mockProfile'
import { useLanguage } from '@/i18n/LanguageProvider'
import { isToday } from '@/lib/format'

/**
 * Screen 1 — home dashboard for a signed-in returning user.
 *
 * Summaries only. Full history, the blood-pressure chart and the complete
 * profile live in secondary views reached from here.
 */
export function Home() {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const profile = saraProfile
  const readings = profile.bloodPressureReadings

  const indicators = [
    { key: 'saved', label: t('chipProfileSaved') },
    { key: 'readings', label: `${readings.length} ${t('chipRecentReadings')}` },
    {
      key: 'updated',
      label: isToday(profile.lastUpdatedAt)
        ? t('chipUpdatedToday')
        : t('chipUpdatedRecently'),
    },
  ]

  const chips = [
    { key: 'htn', label: t('chronicHypertension'), tone: 'blush' as const },
    { key: 'family', label: t('familyHistoryChip'), tone: 'butter' as const },
    { key: 'bmi', label: `${t('bmi')} ${profile.bmi}`, tone: 'sage' as const },
  ]

  return (
    <>
      <PregnancyHeader age={profile.gestationalAge} />
      <CheckInCard indicators={indicators} />
      <HealthSnapshot chips={chips} readings={readings} />

      <div className="cta">
        <button
          type="button"
          className="btn btn--primary"
          onClick={() => navigate('/assessment')}
        >
          {t('startAssessment')}
        </button>
        <p className="cta__support">{t('ctaSupport')}</p>
        <button
          type="button"
          className="btn btn--ghost btn--block"
          onClick={() => navigate('/profile/update')}
        >
          {t('updateInformation')}
        </button>
      </div>
    </>
  )
}
