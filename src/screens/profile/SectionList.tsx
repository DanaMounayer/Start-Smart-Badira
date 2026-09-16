import { useNavigate } from 'react-router-dom'
import {
  SECTIONS,
  profileCompletion,
  sectionState,
  type SectionState,
} from '@/domain/profile/sections'
import type { PregnancyProfile } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'
import { Chevron } from '@/components/ui/Chevron'

/**
 * The profile as sections rather than one long form.
 *
 * Shared by viewing the profile, updating it and onboarding — the difference
 * is only where a row leads and what the header says.
 */
export function SectionList({
  profile,
  returnTo,
}: {
  profile: PregnancyProfile
  /** Where a section editor should return to after saving. */
  returnTo: string
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()
  const { done, total } = profileCompletion(profile)

  return (
    <>
      <div className="completion">
        <div className="completion__rail">
          <span
            className="completion__fill"
            style={{ inlineSize: `${(done / total) * 100}%` }}
          />
        </div>
        <p className="completion__label">
          {done}/{total} {t('sectionsComplete')}
        </p>
      </div>

      <nav className="list" aria-label={t('profileTitle')}>
        {SECTIONS.map((section) => {
          const state = sectionState(profile, section)
          return (
            <button
              key={section.id}
              type="button"
              className="list__row"
              onClick={() =>
                navigate(`/profile/section/${section.id}`, { state: { returnTo } })
              }
            >
              <span className="section-row">
                <span className="list__label">{t(section.titleKey)}</span>
                <span className="section-row__blurb">{t(section.blurbKey)}</span>
              </span>
              <StateBadge state={state} />
              <Chevron />
            </button>
          )
        })}
      </nav>
    </>
  )
}

function StateBadge({ state }: { state: SectionState }) {
  const { t } = useLanguage()
  if (state === 'complete') {
    return (
      <span className="state-badge state-badge--done" aria-label={t('sectionComplete')}>
        <svg width="14" height="14" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path
            d="M3.8 9.4 7.2 12.8 14.2 5.4"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    )
  }
  return (
    <span className={`state-badge state-badge--${state}`}>
      {state === 'partial' ? t('sectionPartial') : t('sectionEmpty')}
    </span>
  )
}
