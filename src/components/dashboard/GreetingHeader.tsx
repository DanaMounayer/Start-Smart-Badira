import type { PregnancyProfile } from '@/domain/types'
import { useLanguage } from '@/i18n/LanguageProvider'

/** Establishes that this is a returning, signed-in user with a saved profile. */
export function GreetingHeader({ profile }: { profile: PregnancyProfile }) {
  const { t } = useLanguage()

  return (
    <section className="greeting">
      <div className="greeting__avatar" aria-hidden="true">
        {profile.firstName.charAt(0)}
      </div>
      <div className="greeting__text">
        <h1 className="greeting__name">{t('greeting')}</h1>
        <p className="greeting__status">
          <span className="dot dot--live" aria-hidden="true" />
          {t('signedInAs')}
        </p>
      </div>
    </section>
  )
}
