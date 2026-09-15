import { HashRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/routes'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { SessionProvider } from '@/app/session'

/**
 * Hash routing keeps every route reachable when the build is served from a
 * static host or a subpath, so the prototype is previewable anywhere without
 * server rewrites.
 */
export default function App() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </SessionProvider>
    </LanguageProvider>
  )
}
