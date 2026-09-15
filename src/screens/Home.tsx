import { useNavigate } from 'react-router-dom'
import { GestationHero } from '@/components/home/GestationHero'
import { HealthSnapshot } from '@/components/home/HealthSnapshot'
import { InfoList } from '@/components/home/InfoList'
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

  return (
    <>
      <h1 className="large-title">{t('greeting')}</h1>

      <GestationHero age={profile.gestationalAge} dueDate={profile.estimatedDueDate} />

      <HealthSnapshot
        factors={[
          { key: 'htn', label: t('chronicHypertension'), tone: 'blush' as const },
          { key: 'family', label: t('familyHistoryChip'), tone: 'butter' as const },
          { key: 'bmi', label: `${t('bmi')} ${profile.bmi}`, tone: 'sage' as const },
        ]}
        readings={readings}
      />

      <section className="group">
        <InfoList
          rows={[
            { to: '/profile', label: 'navProfile', value: t('navProfileMeta') },
            {
              to: '/history',
              label: 'navHistory',
              value: `${readings.length} ${t('chipRecentReadings')}`,
            },
            { to: '/assessments', label: 'navAssessments', value: t('noAssessmentsYet') },
          ]}
        />
        <button
          type="button"
          className="text-btn text-btn--block"
          onClick={() => navigate('/profile/update')}
        >
          {t('updateInformation')}
        </button>
      </section>

      <StartBlock
        indicators={[
          t('chipProfileSaved'),
          isToday(profile.lastUpdatedAt) ? t('chipUpdatedToday') : t('chipUpdatedRecently'),
        ]}
        reliabilityNote={{
          text: t('reliabilityHint'),
          action: t('reliabilityHintAction'),
          to: '/profile/update',
        }}
      />
    </>
  )
}

/** Guest variant: nothing is saved, so the screen asks rather than reports. */
function GuestHome() {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <>
      <h1 className="large-title">{t('greetingGuest')}</h1>

      <section className="empty-hero">
        <p className="empty-hero__title">{t('guestHeroTitle')}</p>
        <p className="empty-hero__body">{t('guestHeroBody')}</p>
        <button
          type="button"
          className="btn btn--tinted"
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

      <button type="button" className="text-btn text-btn--block" onClick={() => navigate('/welcome')}>
        {t('signIn')}
      </button>
    </>
  )
}
