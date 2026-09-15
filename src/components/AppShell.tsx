import type { ReactNode } from 'react'
import { AppBar } from './AppBar'
import { useLanguage } from '@/i18n/LanguageProvider'
import { saraProfile } from '@/data/mockProfile'

/** Phone-width frame shared by every screen. */
export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage()

  return (
    <div className="app-shell">
      <AppBar initial={saraProfile.firstName.charAt(0)} />
      <main className="app-main">{children}</main>
      <footer className="app-footer">{t('disclaimer')}</footer>
    </div>
  )
}
