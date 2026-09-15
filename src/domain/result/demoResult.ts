import type { PregnancyProfile } from '@/domain/types'
import type { Answers } from '@/domain/assessment/schema'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import type { Strings } from '@/i18n'
import type { BadiraResult, InformationItem } from './schema'

/**
 * ⚠️ DEMO RESULT — NOT CLINICAL OUTPUT.
 *
 * No validated prediction model is connected to this prototype, so this
 * module deliberately produces NO risk value, NO reliability value and NO
 * timing interpretation. Those three readings are returned in their
 * `awaitingModel` state and the UI reports exactly that.
 *
 * What this module does produce is factual, not inferred:
 *   - the inventory of information the assessment did and did not have,
 *     read straight from the saved profile and the user's own answers;
 *   - the gestational age and date the assessment was made.
 *
 * Nothing here contains a threshold, band, cutoff, percentage, probability,
 * timing rule or recommendation. When the validated model is connected, it
 * supplies the `available` variants and this file's role shrinks to wiring.
 */

/** Profile sections BADIRA reuses. Labels are i18n keys, resolved by the UI. */
const PROFILE_ITEMS: { id: string; labelKey: keyof Strings }[] = [
  { id: 'profile.pregnancy', labelKey: 'introHaveProfile' },
  { id: 'profile.health', labelKey: 'introHaveHistory' },
  { id: 'profile.family', labelKey: 'introHaveFamily' },
  { id: 'profile.measurements', labelKey: 'introHaveMeasurements' },
]

export type DemoResultInput = {
  profile: PregnancyProfile | null
  answers: Answers
  /** Resolves an i18n key; passed in so this module stays UI-free. */
  t: (key: keyof Strings) => string
}

export function buildDemoResult({ profile, answers, t }: DemoResultInput): BadiraResult {
  const context = { answers, profile }

  const information: InformationItem[] = [
    // Saved profile sections count as available only when a profile exists.
    ...(profile
      ? PROFILE_ITEMS.map((item) => ({
          id: item.id,
          label: t(item.labelKey),
          source: 'profile' as const,
          status: 'provided' as const,
        }))
      : []),
    ...providedQuestions(demoSpec, context).map((question) => ({
      id: question.id,
      label: t(question.promptKey),
      source: 'assessment' as const,
      status: 'provided' as const,
    })),
    ...missingQuestions(demoSpec, context).map((question) => ({
      id: question.id,
      label: t(question.promptKey),
      source: 'assessment' as const,
      status: 'unavailable' as const,
    })),
  ]

  return {
    id: 'demo',
    demo: true,
    // All three readings await the validated model. Nothing is fabricated.
    risk: { state: 'awaitingModel' },
    reliability: { state: 'awaitingModel' },
    time: {
      gestationalAge: profile?.gestationalAge ?? null,
      assessedAt: new Date().toISOString(),
      interpretation: { state: 'awaitingModel' },
    },
    information,
    // Model explanation output. Empty until a model produces it — the UI
    // shows the information used instead of inventing weighted factors.
    factors: [],
  }
}
