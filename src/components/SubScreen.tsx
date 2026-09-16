import type { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '@/i18n/LanguageProvider'

/** Frame for secondary views: a back affordance and a title. */
export function SubScreen({
  title,
  children,
  backTo = '/',
}: {
  title: string
  children: ReactNode
  /** Where the back affordance leads. Detail views of a result return to it. */
  backTo?: string
}) {
  const { t } = useLanguage()
  const navigate = useNavigate()

  return (
    <>
      <div className="subscreen__head">
        <button
          type="button"
          className="icon-btn"
          onClick={() => navigate(backTo)}
          aria-label={t('back')}
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="chevron">
            <path
              d="m10 4-4 4 4 4"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <h1 className="subscreen__title">{title}</h1>
      </div>
      {children}
    </>
  )
}
