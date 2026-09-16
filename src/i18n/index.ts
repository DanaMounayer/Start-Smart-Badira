import { en, type Strings } from './en'
import { ar } from './ar'

export type Language = 'en' | 'ar'
export type Direction = 'ltr' | 'rtl'
export type { Strings }

export const LANGUAGES: Language[] = ['en', 'ar']

export const dictionaries: Record<Language, Strings> = { en, ar }

export const directionOf = (language: Language): Direction =>
  language === 'ar' ? 'rtl' : 'ltr'
