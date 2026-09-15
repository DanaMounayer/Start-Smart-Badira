import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Destination placeholder for routes that exist in the flow but are not built
 * yet, so the dashboard's actions lead somewhere real during a demo.
 */
export function NotBuiltYet({ titleKey }: { titleKey: 'startAssessment' | 'updateInformation' }) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="card">
      <h1 className="card__title">{t(titleKey)}</h1>
      <p className="muted">{t('notImplemented')}</p>
      <button type="button" className="btn btn--secondary" onClick={() => navigate('/')}>
        {t('back')}
      </button>
    </section>
  )
}
