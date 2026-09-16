import type { PregnancyProfile } from '@/domain/types'
import type { Answers } from '@/domain/assessment/schema'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import { SECTIONS, sectionState } from '@/domain/profile/sections'
import type { Strings } from '@/i18n'
import type {
  BadiraResult,
  InformationItem,
  ReliabilityReading,
  RiskReading,
} from './schema'

/**
 * ⚠️ SIMULATED RESULT — NOT CLINICAL OUTPUT.
 *
 * No validated prediction model is connected to this prototype. This module
 * produces a SIMULATION so the complete BADIRA experience — Risk, Reliability
 * and Time as three separate readings — can be demonstrated end to end. Every
 * screen labels it as a simulation.
 *
 * What each dimension is, and is not:
 *
 *   Risk        — one fixed demonstration state, identical for every demo
 *                 assessment. It is NOT derived from the user's answers, so
 *                 nothing here can imply that an answer caused or calculated
 *                 it. No probability, percentage, band or cutoff exists.
 *
 *   Reliability — varies with information coverage, which is the one thing the
 *                 prototype genuinely knows: how many of the things it asked
 *                 for it ended up holding. The bands below are presentation
 *                 groupings over that count. They describe the completeness of
 *                 the information, never the user's health.
 *
 *   Time        — the recorded gestational age and the date, both factual,
 *                 presented as context. No timing rule is invented: what a
 *                 point in pregnancy means is left to the validated model.
 *
 * `awaitingModel` remains part of the schema and every screen still renders
 * it; it is simply not where the demo journey ends.
 */

type Translate = (key: keyof Strings) => string

/**
 * The single Smart Start demo scenario.
 *
 * Deliberately constant: the same demonstration produces the same Risk state
 * every time, so a demo can never suggest that running it later, or answering
 * differently, moved a risk estimate.
 */
const simulatedRisk = (t: Translate): RiskReading => ({
  state: 'available',
  label: t('riskSimLabel'),
  // No `value`: a number here would read as a probability, and none exists.
  summary: t('riskSimSummary'),
})

/**
 * Information coverage, grouped for presentation.
 *
 * Complete when nothing was left unanswered; partial while BADIRA holds at
 * least as much as it lacks; limited below that. These are groupings of a
 * count, and carry no clinical meaning.
 */
const simulatedReliability = (
  provided: number,
  unavailable: number,
  t: Translate,
): ReliabilityReading => {
  if (unavailable === 0) {
    return {
      state: 'available',
      label: t('reliabilitySimCompleteLabel'),
      summary: t('reliabilitySimCompleteBody'),
    }
  }
  if (provided >= unavailable) {
    return {
      state: 'available',
      label: t('reliabilitySimPartialLabel'),
      summary: t('reliabilitySimPartialBody'),
    }
  }
  return {
    state: 'available',
    label: t('reliabilitySimLimitedLabel'),
    summary: t('reliabilitySimLimitedBody'),
  }
}

export type DemoResultInput = {
  profile: PregnancyProfile | null
  answers: Answers
  /** Resolves an i18n key; passed in so this module stays UI-free. */
  t: Translate
}

export function buildDemoResult({ profile, answers, t }: DemoResultInput): BadiraResult {
  const context = { answers, profile }

  const information: InformationItem[] = [
    // What the saved profile actually holds, section by section. A profile
    // that exists is not a profile that is filled: an empty section counts as
    // information BADIRA did not have, or a new user would appear to have
    // supplied everything simply by signing in.
    ...(profile
      ? SECTIONS.map((section) => ({
          id: `profile.${section.id}`,
          label: t(section.titleKey),
          source: 'profile' as const,
          status:
            sectionState(profile, section) === 'empty'
              ? ('unavailable' as const)
              : ('provided' as const),
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

  const provided = information.filter((item) => item.status === 'provided').length
  const unavailable = information.length - provided

  return {
    id: 'demo',
    // Every screen reads this to label the result as a simulation.
    demo: true,
    risk: simulatedRisk(t),
    reliability: simulatedReliability(provided, unavailable, t),
    time: {
      gestationalAge: profile?.gestationalAge ?? null,
      assessedAt: new Date().toISOString(),
      interpretation: { state: 'available', summary: t('timeSimSummary') },
    },
    information,
    // No influential factors: naming what "counted most" would be a causal
    // claim, and the simulation has no weights to report. The Why screen
    // shows the information BADIRA actually held instead.
    factors: [],
  }
}
