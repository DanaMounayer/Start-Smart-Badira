import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Explains the Risk x Reliability x Time model and states plainly that no
 * assessment has been produced yet. The three axes are named but carry no
 * values — Screen 3 owns the result.
 */
export function HowBadiraUsesThis() {
  const { t } = useLanguage()

  return (
    <section className="card card--quiet">
      <h2 className="card__title">{t('howItWorksTitle')}</h2>
      <p className="muted">{t('howItWorksBody')}</p>

      <div className="triad">
        <span className="triad__axis">{t('riskLabel')}</span>
        <span className="triad__times" aria-hidden="true">×</span>
        <span className="triad__axis">{t('reliabilityLabel')}</span>
        <span className="triad__times" aria-hidden="true">×</span>
        <span className="triad__axis">{t('timeLabel')}</span>
      </div>

      <p className="muted muted--small">{t('noResultYet')}</p>
    </section>
  )
}
