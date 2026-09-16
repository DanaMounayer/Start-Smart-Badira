import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { useStoredResult } from '@/app/useResult'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { formatFullDate } from '@/lib/format'

/**
 * Share with doctor.
 *
 * Shows exactly what would be shared before anything happens, and contains
 * only this assessment. No backend exists, so nothing is transmitted: the
 * action copies the summary to the clipboard and says so plainly rather than
 * implying a doctor received it.
 */
export function ResultShare() {
  const { t, language } = useLanguage()
  const { id = 'demo' } = useParams()
  const result = useStoredResult(id)
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle')

  // A result only exists for a completed assessment; an unknown id has
  // nothing to show, so it goes home rather than rendering an empty shell.
  if (!result) return <Navigate to="/" replace />

  const age = result.time.gestationalAge
  const held = result.information.filter((item) => item.status === 'provided')
  const unavailable = result.information.filter((item) => item.status === 'unavailable')

  const lines = [
    `${t('badiraResult')} — ${formatFullDate(result.time.assessedAt, language)}`,
    // Whoever this is pasted to must see the prototype boundary first.
    ...(result.demo ? [t('demoResultNote')] : []),
    `${t('gestationLabel')}: ${
      age ? `${age.weeks} ${t('weeksWord')} + ${age.days} ${t('daysWord')}` : t('gestationUnknown')
    }`,
    `${t('riskLabel')}: ${
      result.risk.state === 'awaitingModel' ? t('awaitingModelShort') : result.risk.label
    }`,
    `${t('reliabilityLabel')}: ${
      result.reliability.state === 'awaitingModel'
        ? t('awaitingModelShort')
        : result.reliability.label
    }`,
    '',
    `${t('reportInformationUsed')}: ${held.map((i) => i.label).join(' · ') || '—'}`,
    `${t('reportUnavailable')}: ${unavailable.map((i) => i.label).join(' · ') || '—'}`,
    '',
    t('badiraDisclaimer'),
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setState('copied')
    } catch {
      // Clipboard access can be refused; say so rather than claiming success.
      setState('failed')
    }
  }

  return (
    <SubScreen title={t('shareWithDoctor')} backTo={`/result/${id}`}>
      <p className="lede">{t('shareLede')}</p>

      <section className="preview">
        <p className="preview__label">{t('sharePreviewLabel')}</p>
        <div className="preview__sheet">
          {lines.map((line, i) =>
            line === '' ? (
              <span key={`gap-${i}`} className="preview__gap" />
            ) : (
              <p key={line} className="preview__line">
                {line}
              </p>
            ),
          )}
        </div>
      </section>

      <button type="button" className="btn btn--primary" onClick={copy}>
        {t('copySummary')}
      </button>

      {state === 'copied' && <p className="status-note">{t('shareCopied')}</p>}
      {state === 'failed' && <p className="status-note">{t('shareCopyFailed')}</p>}

      <p className="fineprint">{t('shareNothingSent')}</p>
    </SubScreen>
  )
}
