import {
  STEP_ORDER,
  type Answer,
  type Answers,
  type AssessmentSpec,
  type Question,
  type RuleContext,
  type StepId,
} from './schema'

/**
 * Pure adaptive engine.
 *
 * Visibility is recomputed from the current answers every time, so changing an
 * earlier answer immediately changes what comes later. Nothing is cached and
 * no question is "disabled" — an irrelevant question simply is not there.
 */

export const visibleQuestions = (
  spec: AssessmentSpec,
  context: RuleContext,
): Question[] => spec.questions.filter((q) => (q.when ? q.when(context) : true))

export const questionsForStep = (
  spec: AssessmentSpec,
  context: RuleContext,
  step: StepId,
): Question[] => visibleQuestions(spec, context).filter((q) => q.step === step)

/** Steps that currently have at least one visible question, in order. */
export const activeSteps = (
  spec: AssessmentSpec,
  context: RuleContext,
): StepId[] => {
  const visible = visibleQuestions(spec, context)
  return STEP_ORDER.filter((step) => visible.some((q) => q.step === step))
}

/**
 * Drops answers belonging to questions that are no longer visible.
 *
 * Without this, un-selecting a symptom would leave its follow-up answer behind
 * and the review screen would report something the user can no longer see.
 * Applied repeatedly until stable, since a follow-up can gate a follow-up.
 */
export const pruneHidden = (spec: AssessmentSpec, context: RuleContext): Answers => {
  let answers = context.answers
  for (let pass = 0; pass < spec.questions.length; pass++) {
    const visibleIds = new Set(
      visibleQuestions(spec, { ...context, answers }).map((q) => q.id),
    )
    const next: Answers = {}
    let changed = false
    for (const [id, answer] of Object.entries(answers)) {
      if (visibleIds.has(id)) next[id] = answer
      else changed = true
    }
    if (!changed) return answers
    answers = next
  }
  return answers
}

/** A question counts as answered when it holds any answer, missing included. */
export const isAnswered = (answers: Answers, question: Question): boolean =>
  answers[question.id] !== undefined

export const answeredCount = (
  spec: AssessmentSpec,
  context: RuleContext,
): { answered: number; total: number } => {
  const visible = visibleQuestions(spec, context)
  return {
    answered: visible.filter((q) => isAnswered(context.answers, q)).length,
    total: visible.length,
  }
}

export const isMissing = (answer: Answer | undefined): boolean =>
  answer === undefined || answer.kind === 'missing'

/** What Stage 3 will consume: which visible questions ended without a value. */
export const missingQuestions = (
  spec: AssessmentSpec,
  context: RuleContext,
): Question[] =>
  visibleQuestions(spec, context).filter((q) => isMissing(context.answers[q.id]))

/** Visible questions that carry a real value provided in this session. */
export const providedQuestions = (
  spec: AssessmentSpec,
  context: RuleContext,
): Question[] =>
  visibleQuestions(spec, context).filter((q) => {
    const answer = context.answers[q.id]
    return answer !== undefined && answer.kind !== 'missing'
  })
