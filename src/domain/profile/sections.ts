import type { PregnancyProfile } from '@/domain/types'
import type { Strings } from '@/i18n'

/**
 * Profile sections.
 *
 * Data-driven, matching the structure recorded in docs/APP_MAP.md. Every
 * field below already exists in the profile model or the demo assessment
 * spec — no clinical question is invented here. A section with no defined
 * fields yet would render its empty state rather than gain made-up ones.
 */

export type SectionId =
  | 'pregnancy'
  | 'health'
  | 'family'
  | 'previous'
  | 'measurements'

export type FieldId =
  | 'gestationalAge'
  | 'pregnancyNumber'
  | 'age'
  | 'bmi'
  | 'chronicConditions'
  | 'familyHistory'
  | 'previousPreeclampsia'
  | 'bloodPressure'

export type Section = {
  id: SectionId
  titleKey: keyof Strings
  blurbKey: keyof Strings
  fields: FieldId[]
}

export const SECTIONS: Section[] = [
  {
    id: 'pregnancy',
    titleKey: 'sectionPregnancy',
    blurbKey: 'sectionPregnancyBlurb',
    fields: ['gestationalAge', 'pregnancyNumber'],
  },
  {
    id: 'health',
    titleKey: 'sectionHealth',
    blurbKey: 'sectionHealthBlurb',
    fields: ['age', 'bmi', 'chronicConditions'],
  },
  {
    id: 'family',
    titleKey: 'sectionFamily',
    blurbKey: 'sectionFamilyBlurb',
    fields: ['familyHistory'],
  },
  {
    id: 'previous',
    titleKey: 'sectionPrevious',
    blurbKey: 'sectionPreviousBlurb',
    fields: ['previousPreeclampsia'],
  },
  {
    id: 'measurements',
    titleKey: 'sectionMeasurements',
    blurbKey: 'sectionMeasurementsBlurb',
    fields: ['bloodPressure'],
  },
]

export const sectionById = (id: string): Section | undefined =>
  SECTIONS.find((section) => section.id === id)

/** Whether a field currently holds anything. */
export const fieldFilled = (profile: PregnancyProfile, field: FieldId): boolean => {
  switch (field) {
    case 'gestationalAge':
      return profile.gestationalAge !== null
    case 'pregnancyNumber':
      return profile.pregnancyNumber !== null
    case 'age':
      return profile.age !== null
    case 'bmi':
      return profile.bmi !== null
    case 'chronicConditions':
      return profile.chronicConditions.length > 0
    case 'familyHistory':
      return profile.familyHistory.length > 0
    case 'previousPreeclampsia':
      return profile.previousPregnancies.length > 0
    case 'bloodPressure':
      return profile.bloodPressureReadings.length > 0
  }
}

/** Sections are complete, partial or empty — never "wrong". */
export type SectionState = 'complete' | 'partial' | 'empty'

export const sectionState = (
  profile: PregnancyProfile,
  section: Section,
): SectionState => {
  const filled = section.fields.filter((field) => fieldFilled(profile, field)).length
  if (filled === 0) return 'empty'
  return filled === section.fields.length ? 'complete' : 'partial'
}

export const firstIncompleteSection = (profile: PregnancyProfile): Section | undefined =>
  SECTIONS.find((section) => sectionState(profile, section) !== 'complete')

export const profileCompletion = (
  profile: PregnancyProfile,
): { done: number; total: number } => ({
  done: SECTIONS.filter((section) => sectionState(profile, section) === 'complete').length,
  total: SECTIONS.length,
})
