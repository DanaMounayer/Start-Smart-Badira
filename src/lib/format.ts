import type { Language } from '@/i18n'

/**
 * Locale tags used for dates. Arabic uses Latin digits (`-u-nu-latn`): clinical
 * values such as 138/88 are conventionally written in Latin numerals, and
 * mixing numeral systems inside one card reads badly.
 */
const LOCALES: Record<Language, string> = {
  en: 'en-GB',
  ar: 'ar-u-nu-latn',
}

export const formatDate = (iso: string, language: Language): string =>
  new Date(iso).toLocaleDateString(LOCALES[language], {
    day: 'numeric',
    month: 'short',
  })

export const formatFullDate = (iso: string, language: Language): string =>
  new Date(iso).toLocaleDateString(LOCALES[language], {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

/** True when the ISO timestamp falls on the current calendar day. */
export const isToday = (iso: string): boolean => {
  const date = new Date(iso)
  const now = new Date()
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

/**
 * Compact numeric date for chart axes, e.g. "18/08".
 *
 * Always Latin digits in `en-GB` order so the label is direction-neutral and
 * cannot be re-ordered by bidi when the page is in Arabic.
 */
export const formatAxisDate = (iso: string): string =>
  new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit' })
