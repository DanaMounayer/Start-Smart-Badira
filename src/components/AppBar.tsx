import { useEffect, useState } from 'react'
import { BadiraMark } from './BadiraMark'
import { AccountMenu } from './AccountMenu'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Navigation bar.
 *
 * Transparent over the page at rest; it gains a translucent ground and a
 * hairline once content scrolls beneath it, the way a native bar does.
 */
export function AppBar({ initial }: { initial: string }) {
  const { t, toggleLanguage } = useLanguage()
  const [scrolled, setScrolled] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`navbar${scrolled ? ' is-scrolled' : ''}`}>
      <span className="navbar__brand">
        <BadiraMark size={24} />
        <span className="navbar__wordmark">{t('appName')}</span>
      </span>

      <span className="navbar__actions">
        <button type="button" className="pill-btn" onClick={toggleLanguage}>
          {t('switchLanguage')}
        </button>
        <button
          type="button"
          className="avatar"
          onClick={() => setAccountOpen(true)}
          aria-label={t('openAccountMenu')}
          aria-haspopup="dialog"
          aria-expanded={accountOpen}
        >
          {initial || <PersonGlyph />}
        </button>
      </span>

      {accountOpen && <AccountMenu onClose={() => setAccountOpen(false)} />}
    </header>
  )
}

/** Shown before a profile has a name — a new user has not added one yet. */
function PersonGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="10" cy="7" r="3" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M4.5 16.2c1.2-2.5 3.2-3.7 5.5-3.7s4.3 1.2 5.5 3.7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}
