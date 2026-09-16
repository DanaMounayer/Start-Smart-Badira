import { useNavigate } from 'react-router-dom'
import { BadiraMark } from '@/components/BadiraMark'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'

/**
 * Entry screen. Offers the two ways in: sign in to a saved profile, or
 * continue as a guest with nothing saved.
 *
 * Neither path authenticates anything — see `app/session.tsx`.
 */
export function Welcome() {
  const { t, toggleLanguage } = useLanguage()
  const { continueAsGuest } = useSession()
  const navigate = useNavigate()

  const asGuest = () => {
    continueAsGuest()
    navigate('/')
  }

  return (
    <div className="welcome">
      <button type="button" className="pill-btn welcome__lang" onClick={toggleLanguage}>
        {t('switchLanguage')}
      </button>

      <div className="welcome__brand">
        <BadiraMark size={54} tone="var(--c-primary)" />
        <h1 className="welcome__name">{t('appName')}</h1>
        <p className="welcome__tagline">{t('tagline')}</p>
      </div>

      <div className="welcome__actions">
        <button type="button" className="btn btn--primary" onClick={() => navigate('/signin')}>
          {t('signIn')}
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={asGuest}>
          {t('continueAsGuest')}
        </button>
        <p className="welcome__note">{t('guestNote')}</p>
      </div>

      <p className="welcome__disclaimer">{t('disclaimerFull')}</p>
    </div>
  )
}
