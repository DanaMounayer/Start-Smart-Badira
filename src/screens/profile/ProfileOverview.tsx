import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { SectionList } from './SectionList'
import { formatFullDate, isToday } from '@/lib/format'

/**
 * `/profile` and `/profile/update` are the same screen with a different
 * framing: one invites reading, the other invites changing. Both route into
 * the same section editors, so there is one place where a field is edited.
 */
export function ProfileOverview({ intent }: { intent: 'view' | 'update' }) {
  const { t, language } = useLanguage()
  const { profile } = useSession()
  const navigate = useNavigate()

  if (!profile) {
    return (
      <SubScreen title={t('profileTitle')}>
        <section className="notice">
          <p className="notice__title">{t('guestNoProfileTitle')}</p>
          <p className="notice__body">{t('guestNoProfileBody')}</p>
        </section>
        <button type="button" className="btn btn--primary" onClick={() => navigate('/welcome')}>
          {t('signIn')}
        </button>
      </SubScreen>
    )
  }

  return (
    <SubScreen title={intent === 'update' ? t('updateInformation') : t('profileTitle')}>
      <p className="lede">
        {intent === 'update' ? t('updateLede') : t('profileSubtitle')}
      </p>

      <SectionList profile={profile} returnTo={intent === 'update' ? '/profile/update' : '/profile'} />

      <p className="fineprint">
        {t('lastUpdated')}:{' '}
        {isToday(profile.lastUpdatedAt)
          ? t('updatedToday')
          : formatFullDate(profile.lastUpdatedAt, language)}
      </p>
      <p className="fineprint">{t('storageNote')}</p>
    </SubScreen>
  )
}
