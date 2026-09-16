import type { PregnancyProfile } from '@/domain/types'
import type { Answers } from '@/domain/assessment/schema'
import { demoSpec } from '@/domain/assessment/demoSpec'
import { missingQuestions, providedQuestions } from '@/domain/assessment/engine'
import { SECTIONS, sectionState } from '@/domain/profile/sections'
import { simulatedPriority } from './demoPriority'
import type { BadiraResult, CoverageId, InformationItem } from './schema'

/**
 * ⚠️ SIMULATED RESULT — NOT CLINICAL OUTPUT.
 *
 * No validated prediction model is connected. This module produces a
 * SIMULATION so the whole BADIRA experience — Risk, Reliability and Time as
 * three separate readings — can be demonstrated end to end, and every screen
 * says that is what it is showing.
 *
 *   Risk        — a simulated screening-priority state chosen by the
 *                 deliberately arbitrary lookup in `demoPriority.ts`. Nothing
 *                 about it is weighted, scored, ranked or inferred, and the
 *                 lookup is not ordered by how much was answered.
 *
 *   Reliability — information coverage, which the prototype genuinely knows:
 *                 how much of what it asked for it ended up holding. It
 *                 describes that coverage and nothing about health.
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
    risk: { state: 'simulated', priority: simulatedPriority(answers) },
    reliability: {
      state: 'simulated',
      coverage: coverageOf(provided, unavailable, profile !== null),
    },
    time: {
      gestationalAge: profile?.gestationalAge ?? null,
      assessedAt: new Date().toISOString(),
      interpretation: { state: 'simulated' },
    },
    information,
    // No influential factors: naming what "counted most" would assert a cause,
    // and the simulation has no weights to report.
    factors: [],
  }
}
