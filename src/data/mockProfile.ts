import type { PregnancyProfile } from '@/domain/types'
import { addDays, dueDateFrom } from '@/domain/gestation'

/**
 * Fictional returning user used to demonstrate the prototype flow.
 *
 * All values are invented. They exist to show that BADIRA remembers a profile
 * over time — they are not a clinical example and imply no risk level.
 *
 * Dates are derived from the current day so the demo always reads as a live,
 * recently-updated profile rather than a stale fixture.
 */
const GESTATIONAL_AGE = { weeks: 12, days: 4 } as const

const today = new Date()
const isoDay = (date: Date) => date.toISOString().slice(0, 10)

export const saraProfile: PregnancyProfile = {
  id: 'demo-sara',
  firstName: 'Sara',
  age: 31,
  pregnancyNumber: 2,
  gestationalAge: { ...GESTATIONAL_AGE },
  estimatedDueDate: isoDay(dueDateFrom(GESTATIONAL_AGE, today)),
  bmi: 29,
  chronicConditions: ['chronicHypertension'],
  familyHistory: ['motherPreeclampsia'],
  previousPregnancies: [
    { id: 'p1', year: today.getFullYear() - 3, hadPreeclampsia: false },
  ],
  bloodPressureReadings: [
    {
      id: 'bp1',
      systolic: 128,
      diastolic: 82,
      recordedAt: isoDay(addDays(today, -28)),
      source: 'home',
    },
    {
      id: 'bp2',
      systolic: 132,
      diastolic: 84,
      recordedAt: isoDay(addDays(today, -14)),
      source: 'home',
    },
    {
      id: 'bp3',
      systolic: 138,
      diastolic: 88,
      recordedAt: isoDay(today),
      source: 'home',
    },
  ],
  reportedSymptoms: [],
  lastUpdatedAt: new Date().toISOString(),
}

/**
 * A signed-in user who has not completed onboarding yet.
 *
 * Every field a section fills is empty. This is a valid state: the app shows
 * what it has and invites her to add the rest.
 */
export const emptyProfile = (): PregnancyProfile => ({
  id: 'new-user',
  firstName: '',
  age: null,
  pregnancyNumber: null,
  gestationalAge: null,
  estimatedDueDate: null,
  bmi: null,
  chronicConditions: [],
  familyHistory: [],
  previousPregnancies: [],
  bloodPressureReadings: [],
  reportedSymptoms: [],
  lastUpdatedAt: new Date().toISOString(),
})
