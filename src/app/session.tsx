import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { PregnancyProfile } from '@/domain/types'
import { saraProfile } from '@/data/mockProfile'

/**
 * Mock session layer.
 *
 * There is no authentication here and none is implied: signing in selects the
 * demo profile, and guest mode carries no profile at all. A real auth provider
 * replaces this module without touching the screens, which read `profile` and
 * `mode` only.
 */
export type SessionMode = 'signedIn' | 'guest'

type SessionValue = {
  mode: SessionMode
  /** Null in guest mode — nothing has been saved. */
  profile: PregnancyProfile | null
  signIn: () => void
  continueAsGuest: () => void
  signOut: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('signedIn')

  const signIn = useCallback(() => setMode('signedIn'), [])
  const continueAsGuest = useCallback(() => setMode('guest'), [])
  const signOut = useCallback(() => setMode('guest'), [])

  const value = useMemo<SessionValue>(
    () => ({
      mode,
      profile: mode === 'signedIn' ? saraProfile : null,
      signIn,
      continueAsGuest,
      signOut,
    }),
    [mode, signIn, continueAsGuest, signOut],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used inside a SessionProvider')
  return context
}
