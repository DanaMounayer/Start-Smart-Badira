import type { AssessmentResult, PregnancyProfile } from '../types'

/**
 * The seam between the UI and whatever produces an assessment.
 *
 * The prototype ships a placeholder implementation. A validated clinical model
 * can replace it later by implementing this same interface — no screen code
 * should import a concrete engine directly.
 */
export type AssessmentEngine = {
  readonly name: string
  assess(profile: PregnancyProfile): AssessmentResult
}

/**
 * Placeholder engine.
 *
 * It intentionally encodes no medical rules. Until a validated model is wired
 * in, every input is treated as insufficient to support a risk statement.
 */
export const placeholderEngine: AssessmentEngine = {
  name: 'placeholder',
  assess(profile) {
    return {
      risk: 'unknown',
      reliability: 'insufficient',
      time: 'unknown',
      missingInputs: [
        {
          field: 'assessmentModel',
          reason:
            'No validated assessment model is connected to this prototype yet.',
        },
      ],
      rationale: [
        `Received profile "${profile.id}" but no scoring logic is defined.`,
      ],
    }
  },
}

/** The engine the app currently uses. Swap this to change implementations. */
export const activeEngine: AssessmentEngine = placeholderEngine
