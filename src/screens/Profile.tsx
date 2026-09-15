import { ProfileSummary } from '@/components/profile/ProfileSummary'
import { saraProfile } from '@/data/mockProfile'
import { useLanguage } from '@/i18n/LanguageProvider'
import { formatFullDate, isToday } from '@/lib/format'
import { SubScreen } from '@/components/SubScreen'

/** Secondary view: the complete saved profile, off the home screen. */
export function Profile() {
  const { t, language } = useLanguage()
  const profile = saraProfile

  return (
    <SubScreen title={t('profileTitle')}>
      <ProfileSummary profile={profile} />
      <p className="last-updated">
        {t('lastUpdated')}:{' '}
        <strong>
          {isToday(profile.lastUpdatedAt)
            ? t('updatedToday')
            : formatFullDate(profile.lastUpdatedAt, language)}
        </strong>
      </p>
    </SubScreen>
  )
}
