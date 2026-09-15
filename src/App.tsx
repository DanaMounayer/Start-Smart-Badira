import { HashRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/routes'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { SessionProvider } from '@/app/session'
import { AssessmentProvider } from '@/app/assessmentSession'

/**
 * Hash routing keeps every route reachable when the build is served from a
 * static host or a subpath, so the prototype is previewable anywhere without
 * server rewrites.
 */
export default function App() {
  return (
    <LanguageProvider>
      <SessionProvider>
        <AssessmentProvider>
          <HashRouter>
            <AppRoutes />
          </HashRouter>
        </AssessmentProvider>
      </SessionProvider>
    </LanguageProvider>
  )
}
