import { useNavigate } from 'react-router-dom'
import { BadiraMark } from './BadiraMark'
import { useLanguage } from '@/i18n/LanguageProvider'

/** Top app bar: brand mark, language toggle, profile avatar. */
export function AppBar({ initial }: { initial: string }) {
  const { t, toggleLanguage } = useLanguage()
  const navigate = useNavigate()

  return (
    <header className="appbar">
      <span className="appbar__brand">
        <BadiraMark size={24} tone="var(--c-primary)" />
        <span className="appbar__wordmark">{t('appName')}</span>
      </span>

      <span className="appbar__actions">
        <button type="button" className="lang-toggle" onClick={toggleLanguage}>
          {t('switchLanguage')}
        </button>
        <button
          type="button"
          className="avatar"
          onClick={() => navigate('/profile')}
          aria-label={t('yourProfile')}
        >
          {initial}
        </button>
      </span>
    </header>
  )
}
