import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * The primary action, with the check-in context that used to occupy a large
 * dark card folded in beside it — the readiness of the saved profile matters
 * at the moment of starting, not as a headline.
 */
export function StartBlock({
  indicators,
  reliabilityNote,
}: {
  indicators: string[]
  /** Optional gentle prompt about information that would improve Reliability. */
  reliabilityNote?: { text: string; action: string; to: string }
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="start">
      {indicators.length > 0 && (
        <ul className="start__indicators">
          {indicators.map((label) => (
            <li key={label}>{label}</li>
          ))}
        </ul>
      )}

      {reliabilityNote && (
        <p className="reliability-note">
          <InfoDot />
          <span>
            {reliabilityNote.text}{' '}
            <button
              type="button"
              className="link-inline"
              onClick={() => navigate(reliabilityNote.to)}
            >
              {reliabilityNote.action}
            </button>
          </span>
        </p>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => navigate('/assessment')}
      >
        {t('startAssessment')}
      </button>
      <p className="start__support">{t('ctaSupport')}</p>
    </section>
  )
}

function InfoDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <circle cx="8" cy="8" r="6.4" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 7.2v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="8" cy="4.9" r="0.9" fill="currentColor" />
    </svg>
  )
}
