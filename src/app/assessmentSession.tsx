import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { demoSpec } from '@/domain/assessment/demoSpec'
import {
  activeSteps,
  pruneHidden,
  questionsForStep,
} from '@/domain/assessment/engine'
import type { Answer, Answers, StepId } from '@/domain/assessment/schema'
import { useSession } from './session'

/**
 * Holds the answers for one assessment run.
 *
 * Answers live only for the life of the run — nothing is persisted, and a
 * guest's answers never touch the signed-in demo profile because the profile
 * arrives from the session and is simply null for a guest.
 */
type AssessmentValue = {
  answers: Answers
  setAnswer: (questionId: string, answer: Answer | undefined) => void
  /** Steps that currently have visible questions, in order. */
  steps: StepId[]
  questionsFor: (step: StepId) => ReturnType<typeof questionsForStep>
  reset: () => void
}

const AssessmentContext = createContext<AssessmentValue | null>(null)

export function AssessmentProvider({ children }: { children: ReactNode }) {
  const { profile } = useSession()
  const [answers, setAnswers] = useState<Answers>({})

  const setAnswer = useCallback(
    (questionId: string, answer: Answer | undefined) => {
      setAnswers((current) => {
        const next: Answers = { ...current }
        if (answer === undefined) delete next[questionId]
        else next[questionId] = answer
        // Recompute visibility so answers to now-hidden follow-ups disappear.
        return pruneHidden(demoSpec, { answers: next, profile })
      })
    },
    [profile],
  )

  const reset = useCallback(() => setAnswers({}), [])

  const value = useMemo<AssessmentValue>(() => {
    const context = { answers, profile }
    return {
      answers,
      setAnswer,
      steps: activeSteps(demoSpec, context),
      questionsFor: (step: StepId) => questionsForStep(demoSpec, context, step),
      reset,
    }
  }, [answers, profile, setAnswer, reset])

  return (
    <AssessmentContext.Provider value={value}>{children}</AssessmentContext.Provider>
  )
}

export function useAssessment(): AssessmentValue {
  const context = useContext(AssessmentContext)
  if (!context) {
    throw new Error('useAssessment must be used inside an AssessmentProvider')
  }
  return context
}
