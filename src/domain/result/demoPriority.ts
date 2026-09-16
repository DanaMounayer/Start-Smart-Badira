import type { Answers } from '@/domain/assessment/schema'
import { hasSelected } from '@/domain/assessment/schema'
import { hasValue } from '@/domain/assessment/engine'
import type { PriorityId } from './schema'

/**
 * ⚠️ DEMONSTRATION LOOKUP — NO CLINICAL MEANING WHATSOEVER.
 *
 * The prototype has no validated model, but a demo that always ends on the
 * same screen cannot show what BADIRA is for. So a run is turned into one of
 * three simulated screening-priority states, and this file is the whole of
 * that logic.
 *
 * How it works, and what it deliberately is not:
 *
 *   - Four PATTERNS are checked. Each is a plain presence test — was this
 *     question answered at all, was an option picked. None compares a value
 *     against anything: no blood-pressure number is read, no symptom is
 *     ranked above another, nothing is scored.
 *
 *   - The matched patterns form a SIGNATURE, and the table below maps every
 *     possible signature to a state. The assignments are ARBITRARY. They are
 *     deliberately NOT ordered by how many patterns matched — the table is
 *     shuffled precisely so that "more answers" cannot be read as "greater
 *     risk". Read down the `matched` column and you will find 3 matches
 *     landing on `routine` and 0 matches landing on `closer`.
 *
 *   - There is therefore no threshold, weighting, probability, ordering or
 *     inference here of any kind, and nothing in it is medically meaningful.
 *     It exists so that different demo inputs produce different demo output.
 *
 * It is deterministic: the same answers always give the same state, so a
 * saved result never changes under the user, and reopening one shows what it
 * showed before.
 */

type PatternId = 'symptoms' | 'measurement' | 'changes' | 'history'

/** Presence tests only. Nothing here reads a value or compares one. */
const PATTERNS: { id: PatternId; matches: (answers: Answers) => boolean }[] = [
  {
    id: 'symptoms',
    matches: (answers) => hasValue(answers['symptoms']),
  },
  {
    id: 'measurement',
    matches: (answers) => hasValue(answers['bloodPressure']),
  },
  {
    id: 'changes',
    matches: (answers) => hasSelected(answers, 'anyChanges', 'yes'),
  },
  {
    id: 'history',
    matches: (answers) => hasValue(answers['weight']),
  },
]

/**
 * Every signature, and the state it happens to map to. The order of this
 * table carries no meaning; see the note above. `matched` is written out only
 * to make the absence of ordering checkable at a glance.
 */
const TABLE: { signature: string; matched: number; priority: PriorityId }[] = [
  { signature: '', matched: 0, priority: 'closer' },
  { signature: 'symptoms', matched: 1, priority: 'earlier' },
  { signature: 'measurement', matched: 1, priority: 'closer' },
  { signature: 'changes', matched: 1, priority: 'routine' },
  { signature: 'history', matched: 1, priority: 'closer' },
  { signature: 'symptoms|measurement', matched: 2, priority: 'routine' },
  { signature: 'symptoms|changes', matched: 2, priority: 'closer' },
  { signature: 'symptoms|history', matched: 2, priority: 'routine' },
  { signature: 'measurement|changes', matched: 2, priority: 'earlier' },
  { signature: 'measurement|history', matched: 2, priority: 'earlier' },
  { signature: 'changes|history', matched: 2, priority: 'closer' },
  { signature: 'symptoms|measurement|changes', matched: 3, priority: 'routine' },
  { signature: 'symptoms|measurement|history', matched: 3, priority: 'earlier' },
  { signature: 'symptoms|changes|history', matched: 3, priority: 'closer' },
  { signature: 'measurement|changes|history', matched: 3, priority: 'routine' },
  { signature: 'symptoms|measurement|changes|history', matched: 4, priority: 'earlier' },
]

/** The patterns this run matched, in declared order. */
export const signatureOf = (answers: Answers): string =>
  PATTERNS.filter((pattern) => pattern.matches(answers))
    .map((pattern) => pattern.id)
    .join('|')

/** The simulated state for a run. Pure, total and stable. */
export const simulatedPriority = (answers: Answers): PriorityId => {
  const signature = signatureOf(answers)
  return TABLE.find((row) => row.signature === signature)?.priority ?? 'routine'
}
