import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'

/**
 * Destination placeholder for routes that exist in the flow but are not built
 * yet, so the home screen's actions lead somewhere real during a demo.
 */
export function NotBuiltYet({
  titleKey,
}: {
  titleKey: 'startAssessment' | 'updateInformation'
}) {
  const { t } = useLanguage()

  return (
    <SubScreen title={t(titleKey)}>
      <section className="card">
        <p className="muted">{t('notImplemented')}</p>
      </section>
    </SubScreen>
  )
}
