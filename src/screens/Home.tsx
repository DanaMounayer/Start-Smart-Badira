import { useNavigate } from 'react-router-dom'
import { GestationHero } from '@/components/home/GestationHero'
import { HealthSnapshot } from '@/components/home/HealthSnapshot'
import { InfoList } from '@/components/home/InfoList'
import { StartBlock } from '@/components/home/StartBlock'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'
import { isToday } from '@/lib/format'
import { profileCompletion } from '@/domain/profile/sections'

/**
 * Screen 1 — home.
 *
 * Summaries only: how far along, what BADIRA holds, whether anything is
 * missing, and what to do next. Detail lives in /profile, /history and
 * /assessments.
 */
export function Home() {
  const { t, language } = useLanguage()
  const { profile, assessments } = useSession()
  const navigate = useNavigate()

  if (!profile) return <GuestHome />

  const readings = profile.bloodPressureReadings
  const { done, total } = profileCompletion(profile)
  const incompleteSections = total - done

  return (
    <>
      <h1 className="large-title">{greet(profile.displayName, language, t)}</h1>

      {profile.gestationalAge && profile.estimatedDueDate ? (
        <GestationHero
          age={profile.gestationalAge}
          dueDate={profile.estimatedDueDate}
        />
      ) : (
        <section className="empty-hero">
          <p className="empty-hero__title">{t('homeNoPregnancyTitle')}</p>
          <p className="empty-hero__body">{t('homeNoPregnancyBody')}</p>
          <button
            type="button"
            className="btn btn--tinted"
            onClick={() => navigate('/onboarding')}
          >
            {t('completeProfile')}
          </button>
        </section>
      )}

      {readings.length > 0 && (
        <HealthSnapshot
          factors={[
            ...(profile.chronicConditions.length
              ? [{ key: 'htn', label: t('chronicHypertension'), tone: 'blush' as const }]
              : []),
            ...(profile.familyHistory.length
              ? [{ key: 'family', label: t('familyHistoryChip'), tone: 'butter' as const }]
              : []),
            ...(profile.bmi !== null
              ? [{ key: 'bmi', label: `${t('bmi')} ${profile.bmi}`, tone: 'sage' as const }]
              : []),
          ]}
          readings={readings}
        />
      )}

      <section className="group">
        <InfoList
          rows={[
            {
              to: '/profile',
              label: 'navProfile',
              // An empty profile has no details to describe, so the row asks
              // for them instead of claiming them.
              value:
                done === 0
                  ? t('addDetails')
                  : done === total
                    ? t('navProfileMeta')
                    : `${done}/${total} ${t('sectionsComplete')}`,
            },
            {
              to: '/history',
              label: 'navHistory',
              value: readings.length
                ? `${readings.length} ${t('chipRecentReadings')}`
                : t('noneYet'),
            },
            {
            to: '/assessments',
            label: 'navAssessments',
            value: assessments.length
              ? `${assessments.length}`
              : t('noAssessmentsYet'),
          },
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
        // Only claimed when the profile genuinely has unfilled sections.
        reliabilityNote={
          incompleteSections > 0
            ? {
                text: t('reliabilityHintSections'),
                action: t('reliabilityHintAction2'),
                to: '/profile/update',
              }
            : undefined
        }
      />
    </>
  )
}

/**
 * Greets by name when the profile has one, and without a name when it does
 * not. A new user is never addressed as somebody else.
 */
function greet(
  displayName: Record<'en' | 'ar', string> | null,
  language: 'en' | 'ar',
  t: (key: 'greetingHello') => string,
): string {
  const hello = t('greetingHello')
  if (!displayName) return hello
  return `${hello}${language === 'ar' ? '، ' : ', '}${displayName[language]}`
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
        {/* A guest has no profile to add to, so this leads where it can
            actually help rather than to a page that refuses them. */}
        <button
          type="button"
          className="btn btn--tinted"
          onClick={() => navigate('/signin')}
        >
          {t('guestSignInToSave')}
        </button>
      </section>

      {/* States the consequence without repeating the action above it. */}
      <StartBlock indicators={[]} reliabilityNote={{ text: t('guestReliabilityHint') }} />

      <button type="button" className="text-btn text-btn--block" onClick={() => navigate('/welcome')}>
        {t('signIn')}
      </button>
    </>
  )
}
