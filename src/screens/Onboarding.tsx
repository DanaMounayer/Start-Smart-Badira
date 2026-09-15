import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SectionList } from './profile/SectionList'
import { firstIncompleteSection, profileCompletion } from '@/domain/profile/sections'

/**
 * First-time setup.
 *
 * Section-based and resumable rather than one long questionnaire: sections can
 * be filled in any order, left part-done, and picked up later. A partially
 * complete profile is a valid state, so leaving is never blocked.
 */
export function Onboarding() {
  const { t } = useLanguage()
  const { profile } = useSession()
  const navigate = useNavigate()

  if (!profile) {
    navigate('/welcome', { replace: true })
    return null
  }

  const next = firstIncompleteSection(profile)
  const { done, total } = profileCompletion(profile)
  const finished = done === total

  return (
    <div className="onboarding">
      <header className="onboarding__head">
        <h1 className="large-title">{t('onboardingTitle')}</h1>
        <p className="lede">{t('onboardingLede')}</p>
      </header>

      <SectionList profile={profile} returnTo="/onboarding" />

      <div className="stack">
        {next && (
          <button
            type="button"
            className="btn btn--primary"
            onClick={() =>
              navigate(`/profile/section/${next.id}`, { state: { returnTo: '/onboarding' } })
            }
          >
            {done === 0 ? t('onboardingStart') : t('onboardingContinue')}
          </button>
        )}
        <button
          type="button"
          className={finished ? 'btn btn--primary' : 'text-btn text-btn--block'}
          onClick={() => navigate('/')}
        >
          {finished ? t('onboardingDone') : t('onboardingLater')}
        </button>
      </div>

      <p className="fineprint fineprint--center">{t('onboardingResumeNote')}</p>
    </div>
  )
}
