import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from '@/app/routes'
import { LanguageProvider } from '@/i18n/LanguageProvider'

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </LanguageProvider>
  )
}
