import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Temporary landing screen. It exists to prove the shell, routing, styling and
 * bilingual layout work, and will be replaced by the pregnancy dashboard.
 */
export function Welcome() {
  const { t } = useLanguage()

  return (
    <>
      <div>
        <span className="pill">v0.1 · prototype</span>
        <h1 style={{ marginTop: 'var(--s-3)', fontSize: '26px' }}>
          {t('appName')}
        </h1>
        <p className="muted">{t('tagline')}</p>
      </div>

      <section className="card">
        <h2 className="card__title">{t('setupTitle')}</h2>
        <p className="muted">{t('setupBody')}</p>
      </section>

      <section className="card">
        <h2 className="card__title">{t('modelTitle')}</h2>
        <p className="muted">{t('modelBody')}</p>
      </section>

      <section className="card">
        <h2 className="card__title">{t('nextUpTitle')}</h2>
        <ol className="stack-list">
          <li>{t('screen1')}</li>
          <li>{t('screen2')}</li>
          <li>{t('screen3')}</li>
        </ol>
      </section>
    </>
  )
}
