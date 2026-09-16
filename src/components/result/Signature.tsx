import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The BADIRA signature: three dimensions held together but never multiplied
 * into a single number. The × is typographic, not arithmetic.
 */
export function Signature({
  emphasis,
  asHeading = false,
}: {
  emphasis?: 'risk' | 'reliability' | 'time'
  /** Renders as the page's h1 — the signature is the result's title. */
  asHeading?: boolean
}) {
  const { t } = useLanguage()
  const axes = [
    { key: 'risk', label: t('riskLabel') },
    { key: 'reliability', label: t('reliabilityLabel') },
    { key: 'time', label: t('timeLabel') },
  ] as const

  const Tag = asHeading ? 'h1' : 'p'

  return (
    <Tag className="signature">
      {axes.map((axis, i) => (
        <span key={axis.key}>
          {i > 0 && <span className="signature__x" aria-hidden="true">×</span>}
          <span className={`signature__axis${emphasis === axis.key ? ' is-emphasis' : ''}`}>
            {axis.label}
          </span>
        </span>
      ))}
    </Tag>
  )
}
