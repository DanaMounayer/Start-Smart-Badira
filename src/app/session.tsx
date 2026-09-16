import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { GestationalAge, PregnancyProfile } from '@/domain/types'
import type { BadiraResult } from '@/domain/result/schema'
import { saraProfile, emptyProfile } from '@/data/mockProfile'

/**
 * Mock session and profile store.
 *
 * There is no authentication and no server here, and none is implied: signing
 * in selects a demo profile, guest mode carries no profile at all, and every
 * change lives in memory for the length of the session. A real auth provider
 * and backend replace this module without touching the screens, which read
 * `profile`, `mode` and `assessments` only.
 */
export type SessionMode = 'signedIn' | 'guest'

/**
 * A completed run.
 *
 * The record owns the result it produced, so a result URL renders from a
 * stored snapshot rather than from whatever answers happen to be in memory.
 * Risk and Reliability stay absent inside it — no model is connected.
 */
export type AssessmentRecord = {
  id: string
  completedAt: string
  gestationalAge: GestationalAge | null
  informationProvided: number
  informationUnavailable: number
  result: BadiraResult
}

type SessionValue = {
  mode: SessionMode
  /** Null in guest mode — nothing has been saved. */
  profile: PregnancyProfile | null
  assessments: AssessmentRecord[]
  /** Demo sign-in: loads the existing saved profile. */
  signInAsDemo: () => void
  /** Demo sign-in with no profile yet, so onboarding runs. */
  signInAsNewUser: () => void
  continueAsGuest: () => void
  /** Merges a patch into the profile and stamps it as updated now. */
  updateProfile: (patch: Partial<PregnancyProfile>) => void
  recordAssessment: (record: AssessmentRecord) => void
}

const SessionContext = createContext<SessionValue | null>(null)

export function SessionProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SessionMode>('signedIn')
  const [profile, setProfile] = useState<PregnancyProfile | null>(saraProfile)
  const [assessments, setAssessments] = useState<AssessmentRecord[]>([])

  const signInAsDemo = useCallback(() => {
    setMode('signedIn')
    setProfile(saraProfile)
  }, [])

  const signInAsNewUser = useCallback(() => {
    setMode('signedIn')
    setProfile(emptyProfile())
  }, [])

  const continueAsGuest = useCallback(() => {
    setMode('guest')
    // A guest carries no profile, so no signed-in data can reach them.
    setProfile(null)
  }, [])

  const updateProfile = useCallback((patch: Partial<PregnancyProfile>) => {
    setProfile((current) =>
      current ? { ...current, ...patch, lastUpdatedAt: new Date().toISOString() } : current,
    )
  }, [])

  const recordAssessment = useCallback((record: AssessmentRecord) => {
    setAssessments((current) =>
      current.some((item) => item.id === record.id) ? current : [record, ...current],
    )
  }, [])

  const value = useMemo<SessionValue>(
    () => ({
      mode,
      profile,
      assessments,
      signInAsDemo,
      signInAsNewUser,
      continueAsGuest,
      updateProfile,
      recordAssessment,
    }),
    [
      mode,
      profile,
      assessments,
      signInAsDemo,
      signInAsNewUser,
      continueAsGuest,
      updateProfile,
      recordAssessment,
    ],
  )

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>
}

export function useSession(): SessionValue {
  const context = useContext(SessionContext)
  if (!context) throw new Error('useSession must be used inside a SessionProvider')
  return context
}
