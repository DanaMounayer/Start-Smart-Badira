import { useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { sectionById } from '@/domain/profile/sections'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { SectionFields } from '@/components/profile/SectionFields'

/**
 * Edit one section.
 *
 * Changes are held in a draft and committed on save, so leaving without
 * saving changes nothing. Saving writes through the session, which is what
 * every other screen reads — so an edit shows up on Home and in the next
 * assessment immediately.
 */
export function ProfileSection() {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const { t } = useLanguage()
  const { profile, updateProfile } = useSession()

  const section = id ? sectionById(id) : undefined
  const returnTo = (location.state as { returnTo?: string } | null)?.returnTo ?? '/profile'
  const [draft, setDraft] = useState(profile)

  if (!section || !profile || !draft) {
    navigate(returnTo, { replace: true })
    return null
  }

  const save = () => {
    updateProfile(draft)
    navigate(returnTo)
  }

  return (
    <SubScreen title={t(section.titleKey)} backTo={returnTo}>
      <p className="lede">{t(section.blurbKey)}</p>

      <SectionFields
        fields={section.fields}
        draft={draft}
        onChange={(patch) => setDraft((current) => (current ? { ...current, ...patch } : current))}
      />

      <button type="button" className="btn btn--primary" onClick={save}>
        {t('saveChanges')}
      </button>
      <p className="fineprint fineprint--center">{t('storageNote')}</p>
    </SubScreen>
  )
}
