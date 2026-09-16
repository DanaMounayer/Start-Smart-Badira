import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { firstIncompleteSection } from '@/domain/profile/sections'
import { emptyProfile } from '@/data/mockProfile'
import type { Strings } from '@/i18n'

/**
 * Prototype demo-state switcher.
 *
 * This is NOT authentication and says so on its face. The prototype carries
 * three prepared experiences — a returning user with a saved profile, a new
 * user with an empty one, and a guest — and this sheet is how a demo moves
 * between them.
 *
 * Each row calls the session action that already owns that state, and those
 * actions clear the records; the assessment session separately discards a run
 * in progress when the identity changes. Nothing follows the switch across.
 */
type DemoState = 'sara' | 'new' | 'guest'

const ROWS: { key: DemoState; labelKey: keyof Strings; metaKey: keyof Strings }[] = [
  { key: 'sara', labelKey: 'accountSara', metaKey: 'accountSaraMeta' },
  { key: 'new', labelKey: 'accountNew', metaKey: 'accountNewMeta' },
  { key: 'guest', labelKey: 'accountGuest', metaKey: 'accountGuestMeta' },
]

export function AccountMenu({ onClose }: { onClose: () => void }) {
  const { t } = useLanguage()
  const { mode, profile, signInAsDemo, signInAsNewUser, continueAsGuest } = useSession()
  const navigate = useNavigate()
  const sheet = useRef<HTMLDivElement>(null)

  const current: DemoState =
    mode === 'guest' ? 'guest' : profile?.id === 'demo-sara' ? 'sara' : 'new'

  useEffect(() => {
    sheet.current?.focus()
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const choose = (state: DemoState) => {
    onClose()
    if (state === 'sara') {
      signInAsDemo()
      navigate('/')
      return
    }
    if (state === 'guest') {
      continueAsGuest()
      navigate('/')
      return
    }
    signInAsNewUser()
    // A fresh profile has nothing filled, so onboarding opens at its first
    // section — the same entry the sign-in screen uses.
    navigate(firstIncompleteSection(emptyProfile()) ? '/onboarding' : '/')
  }

  return (
    <div className="sheet-layer">
      <button
        type="button"
        className="sheet-layer__scrim"
        aria-label={t('closeLabel')}
        onClick={onClose}
      />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-label={t('accountTitle')}
        tabIndex={-1}
        ref={sheet}
      >
        <span className="sheet__grip" aria-hidden="true" />
        <h2 className="sheet__title">{t('accountTitle')}</h2>
        <p className="sheet__note">{t('accountNote')}</p>

        <div className="sheet__rows">
          {ROWS.map((row) => (
            <button
              key={row.key}
              type="button"
              className={`sheet__row${row.key === current ? ' is-current' : ''}`}
              aria-current={row.key === current ? 'true' : undefined}
              onClick={() => choose(row.key)}
            >
              <span className="sheet__row-text">
                <span className="sheet__row-label">{t(row.labelKey)}</span>
                <span className="sheet__row-meta">{t(row.metaKey)}</span>
              </span>
              {row.key === current && (
                <span className="sheet__current">{t('accountCurrent')}</span>
              )}
            </button>
          ))}
        </div>

        {profile && (
          <button
            type="button"
            className="sheet__row sheet__row--plain"
            onClick={() => {
              onClose()
              navigate('/profile')
            }}
          >
            <span className="sheet__row-label">{t('accountProfileRow')}</span>
          </button>
        )}

        <p className="sheet__fineprint">{t('accountSwitchNote')}</p>

        <button type="button" className="btn btn--ghost btn--block" onClick={onClose}>
          {t('closeLabel')}
        </button>
      </div>
    </div>
  )
}
