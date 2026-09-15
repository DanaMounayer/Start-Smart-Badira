import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  dictionaries,
  directionOf,
  type Direction,
  type Language,
  type Strings,
} from './index'

type LanguageContextValue = {
  language: Language
  direction: Direction
  /** Translation lookup, e.g. t('tagline'). */
  t: (key: keyof Strings) => string
  setLanguage: (language: Language) => void
  toggleLanguage: () => void
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

const STORAGE_KEY = 'badira.language'

const readStoredLanguage = (): Language => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') return stored
  } catch {
    // Storage can be unavailable (private mode, blocked cookies); fall through.
  }
  return 'en'
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readStoredLanguage)
  const direction = directionOf(language)

  // Keep <html lang/dir> in sync so the browser handles RTL mirroring for us.
  useEffect(() => {
    document.documentElement.lang = language
    document.documentElement.dir = direction
    try {
      localStorage.setItem(STORAGE_KEY, language)
    } catch {
      // Persisting the preference is best-effort only.
    }
  }, [language, direction])

  const setLanguage = useCallback((next: Language) => setLanguageState(next), [])
  const toggleLanguage = useCallback(
    () => setLanguageState((current) => (current === 'en' ? 'ar' : 'en')),
    [],
  )

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      direction,
      t: (key) => dictionaries[language][key],
      setLanguage,
      toggleLanguage,
    }),
    [language, direction, setLanguage, toggleLanguage],
  )

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used inside a LanguageProvider')
  }
  return context
}
