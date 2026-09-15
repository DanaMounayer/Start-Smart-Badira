import { useNavigate } from 'react-router-dom'
import { useSession } from '@/app/session'
import { useLanguage } from '@/i18n/LanguageProvider'
import { SubScreen } from '@/components/SubScreen'
import { firstIncompleteSection } from '@/domain/profile/sections'
import { emptyProfile } from '@/data/mockProfile'

/**
 * Prototype sign-in.
 *
 * There is no authentication here and the screen says so. The two routes in
 * exist to demonstrate both states of the product: a returning user with a
 * saved profile, and a new user who has yet to build one.
 */
export function SignIn() {
  const { t } = useLanguage()
  const { signInAsDemo, signInAsNewUser } = useSession()
  const navigate = useNavigate()

  const asReturning = () => {
    signInAsDemo()
    navigate('/')
  }

  const asNew = () => {
    signInAsNewUser()
    // A fresh profile has nothing filled, so onboarding opens at its first section.
    const first = firstIncompleteSection(emptyProfile())
    navigate(first ? '/onboarding' : '/')
  }

  return (
    <SubScreen title={t('signIn')} backTo="/welcome">
      <p className="lede">{t('signInLede')}</p>

      <section className="notice">
        <p className="notice__title">{t('signInDemoTitle')}</p>
        <p className="notice__body">{t('signInDemoBody')}</p>
      </section>

      <div className="stack">
        <button type="button" className="btn btn--primary" onClick={asReturning}>
          {t('signInAsSara')}
        </button>
        <button type="button" className="btn btn--ghost btn--block" onClick={asNew}>
          {t('signInAsNew')}
        </button>
      </div>

      <p className="fineprint">{t('storageNote')}</p>
    </SubScreen>
  )
}
