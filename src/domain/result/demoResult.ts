import type { PregnancyProfile } from '@/domain/types'
import type { Answers } from '@/domain/assessment/schema'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import { SECTIONS, sectionState } from '@/domain/profile/sections'
import type { BadiraResult, CoverageId, InformationItem } from './schema'

/**
 * The result of one assessment.
 *
 * Two of the three readings are real work; the third is honest about not
 * being available:
 *
 *   Risk        — nothing. No validated model is connected, so there is no
 *                 risk reading, and none is invented. A stand-in category,
 *                 probability or priority would be read as a recommendation
 *                 whatever it was labelled, so the screens say plainly that
 *                 the model is not connected.
 *
 *   Reliability — determined from this assessment: how much of what BADIRA
 *                 asked for it ended up holding. It describes that coverage
 *                 and nothing about health.
 *
 *   Time        — the recorded gestational age and date, both factual.
 *
 * The result carries ids and i18n keys only, never resolved text, so a saved
 * result renders in whatever language it is later opened in.
 */

/** Coverage bands: groupings of a count, with no clinical meaning. */
const coverageOf = (
  provided: number,
  unavailable: number,
  hasProfile: boolean,
): CoverageId => {
  // Answering everything asked is not the same as answering everything with a
  // saved pregnancy profile behind it, and a guest is told which one this was.
  if (unavailable === 0) return hasProfile ? 'complete' : 'completeNoProfile'
  return provided >= unavailable ? 'partial' : 'limited'
}

export type DemoResultInput = {
  profile: PregnancyProfile | null
  answers: Answers
}

export function buildDemoResult({ profile, answers }: DemoResultInput): BadiraResult {
  const context = { answers, profile }

  const information: InformationItem[] = [
    // What the saved profile actually holds, section by section. A profile
    // that exists is not a profile that is filled.
    ...(profile
      ? SECTIONS.map((section) => ({
          id: `profile.${section.id}`,
          labelKey: section.titleKey,
          source: 'profile' as const,
          status:
            sectionState(profile, section) === 'empty'
              ? ('unavailable' as const)
              : ('provided' as const),
        }))
      : []),
    ...providedQuestions(demoSpec, context).map((question) => ({
      id: question.id,
      labelKey: question.promptKey,
      source: 'assessment' as const,
      status: 'provided' as const,
    })),
    ...missingQuestions(demoSpec, context).map((question) => ({
      id: question.id,
      labelKey: question.promptKey,
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
    risk: { state: 'awaitingModel' },
    reliability: {
      state: 'measured',
      coverage: coverageOf(provided, unavailable, profile !== null),
    },
    time: {
      gestationalAge: profile?.gestationalAge ?? null,
      assessedAt: new Date().toISOString(),
      interpretation: { state: 'recorded' },
    },
    information,
    // No influential factors: there is no model to report weights from, and
    // naming what "counted most" would assert a cause.
    factors: [],
  }
}
