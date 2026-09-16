import type { InformationItem } from '@/domain/result/schema'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * A labelled list of information items. Used by the reliability, why and
 * report screens so all three describe the assessment's inputs identically.
 */
export function InfoGroup({
  label,
  items,
  tone = 'plain',
  emptyLabel,
}: {
  label: string
  items: InformationItem[]
  tone?: 'plain' | 'muted'
  emptyLabel?: string
}) {
  const { t } = useLanguage()

  return (
    <section className="info-group">
      <h2 className="info-eyebrow">{label}</h2>
      {items.length === 0 ? (
        <p className="info-group__empty">{emptyLabel ?? t('noneRecorded')}</p>
      ) : (
        <ul className={`info-list info-list--${tone}`}>
          {items.map((item) => (
            <li key={`${item.source}-${item.id}`} className="info-list__item">
              <span className="info-list__label">{item.label}</span>
              <span className="info-list__source">
                {item.source === 'profile' ? t('sourceProfile') : t('sourceToday')}
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
