import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { AppBar } from './AppBar'
import { useLanguage } from '@/i18n/LanguageProvider'
import { useSession } from '@/app/session'

/** Phone-width frame shared by every screen except the entry screen. */
export function AppShell({ children }: { children: ReactNode }) {
  const { t } = useLanguage()
  const { profile } = useSession()
  const { pathname } = useLocation()

  // The welcome screen carries its own brand lockup and language toggle.
  if (pathname === '/welcome') return <div className="app-shell">{children}</div>

  return (
    <div className="app-shell">
      <AppBar initial={profile?.firstName.charAt(0) ?? '?'} />
      <main className="app-main">{children}</main>
      <footer className="app-footer">{t('disclaimer')}</footer>
    </div>
  )
}
