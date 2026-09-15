import { useNavigate } from 'react-router-dom'
import { GestationHero } from '@/components/home/GestationHero'
import { HealthSnapshot } from '@/components/home/HealthSnapshot'
import { QuickAccess } from '@/components/home/QuickAccess'
import { StartBlock } from '@/components/home/StartBlock'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'
import { isToday } from '@/lib/format'

/**
 * Screen 1 — home.
 *
 * Summaries only: how far along, what BADIRA holds, whether anything is
 * missing, and what to do next. Detail lives in /profile, /history and
 * /assessments.
 */
export function Home() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const navigate = useNavigate()

  if (!profile) return <GuestHome />

  const readings = profile.bloodPressureReadings
  const indicators = [
    t('chipProfileSaved'),
    isToday(profile.lastUpdatedAt) ? t('chipUpdatedToday') : t('chipUpdatedRecently'),
  ]

  return (
    <>
      <h1 className="page-greeting">{t('greeting')}</h1>

      <GestationHero
        age={profile.gestationalAge}
        dueDate={profile.estimatedDueDate}
      />

      <HealthSnapshot
        chips={[
          { key: 'htn', label: t('chronicHypertension'), tone: 'blush' as const },
          { key: 'family', label: t('familyHistoryChip'), tone: 'butter' as const },
          { key: 'bmi', label: `${t('bmi')} ${profile.bmi}`, tone: 'sage' as const },
        ]}
        readings={readings}
      />

      <QuickAccess
        tiles={[
          { to: '/profile', label: 'navProfile', meta: t('navProfileMeta'), icon: 'profile' },
          {
            to: '/history',
            label: 'navHistory',
            meta: `${readings.length} ${t('chipRecentReadings')}`,
            icon: 'history',
          },
          {
            to: '/assessments',
            label: 'navAssessments',
            meta: t('noAssessmentsYet'),
            icon: 'assessments',
          },
        ]}
      />

      <StartBlock
        indicators={indicators}
        reliabilityNote={{
          text: t('reliabilityHint'),
          action: t('reliabilityHintAction'),
          to: '/profile/update',
        }}
      />

      <button
        type="button"
        className="btn btn--ghost btn--block"
        onClick={() => navigate('/profile/update')}
      >
        {t('updateInformation')}
      </button>
    </>
  )
}

/** Guest variant: nothing is saved, so the screen asks rather than reports. */
function GuestHome() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <>
      <h1 className="page-greeting">{t('greetingGuest')}</h1>

      <section className="hero hero--empty">
        <p className="hero__empty-title">{t('guestHeroTitle')}</p>
        <p className="muted muted--small">{t('guestHeroBody')}</p>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={() => navigate('/profile/update')}
        >
          {t('addMyInformation')}
        </button>
      </section>

      <StartBlock
        indicators={[]}
        reliabilityNote={{
          text: t('guestReliabilityHint'),
          action: t('addMyInformation'),
          to: '/profile/update',
        }}
      />

      <button
        type="button"
        className="btn btn--ghost btn--block"
        onClick={() => navigate('/welcome')}
      >
        {t('signIn')}
      </button>
    </>
  )
}
