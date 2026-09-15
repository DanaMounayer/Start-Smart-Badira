import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'

/**
 * Primary action, with the readiness of the saved profile stated beside it
 * rather than as a headline card, and a gentle note about what is missing.
 */
export function StartBlock({
  indicators,
  reliabilityNote,
}: {
  indicators: string[]
  reliabilityNote?: { text: string; action: string; to: string }
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <section className="start">
      {reliabilityNote && (
        <button
          type="button"
          className="note"
          onClick={() => navigate(reliabilityNote.to)}
        >
          <InfoGlyph />
          <span className="note__text">
            {reliabilityNote.text}
            <strong>{reliabilityNote.action}</strong>
          </span>
        </button>
      )}

      <button
        type="button"
        className="btn btn--primary"
        onClick={() => navigate('/assessment')}
      >
        {t('startAssessment')}
      </button>

      <p className="start__caption">
        {indicators.length > 0 && (
          <span className="start__ready">{indicators.join(' · ')}</span>
        )}
        {t('ctaSupport')}
      </p>
    </section>
  )
}

function InfoGlyph() {
  return (
    <svg width="17" height="17" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7.3" stroke="currentColor" strokeWidth="1.4" />
      <path d="M9 8.1v4.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="9" cy="5.6" r="1" fill="currentColor" />
    </svg>
  )
}
