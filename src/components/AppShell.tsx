import type { ReactNode } from 'react'
import { useLanguage } from '@/i18n/LanguageProvider'
import { BadiraMark } from './BadiraMark'

/** Phone-width frame shared by every screen. */
export function AppShell({ children }: { children: ReactNode }) {
  const { t, toggleLanguage } = useLanguage()

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-header__brand">
          <BadiraMark />
          <span>{t('appName')}</span>
        </div>
        <button
          type="button"
          className="btn btn--ghost"
          onClick={toggleLanguage}
          aria-label={t('switchLanguage')}
        >
          {t('switchLanguage')}
        </button>
      </header>

      <main className="app-main">{children}</main>

      <footer className="app-footer">
        <p className="disclaimer">{t('disclaimer')}</p>
      </footer>
    </div>
  )
}
