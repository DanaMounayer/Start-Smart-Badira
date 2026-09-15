import type { GestationalAge } from './types'

/** A full-term pregnancy, used only to draw progress. Not a clinical rule. */
export const TERM_WEEKS = 40

export const DAYS_PER_WEEK = 7

export const toTotalDays = ({ weeks, days }: GestationalAge): number =>
  weeks * DAYS_PER_WEEK + days

export const fromTotalDays = (totalDays: number): GestationalAge => ({
  weeks: Math.floor(totalDays / DAYS_PER_WEEK),
  days: totalDays % DAYS_PER_WEEK,
})

/** Trimester by the conventional week boundaries (1-13, 14-27, 28+). */
export const trimesterOf = ({ weeks }: GestationalAge): 1 | 2 | 3 => {
  if (weeks < 14) return 1
  if (weeks < 28) return 2
  return 3
}

/** Fraction of the way to term, clamped to 0..1, for the progress ring. */
export const progressOf = (age: GestationalAge): number => {
  const fraction = toTotalDays(age) / (TERM_WEEKS * DAYS_PER_WEEK)
  return Math.min(1, Math.max(0, fraction))
}

/** Whole weeks remaining until term, never negative. */
export const weeksRemaining = (age: GestationalAge): number =>
  Math.max(0, TERM_WEEKS - age.weeks)

export const addDays = (date: Date, days: number): Date => {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

/** The due date implied by a gestational age on a given day. */
export const dueDateFrom = (age: GestationalAge, today: Date): Date =>
  addDays(today, TERM_WEEKS * DAYS_PER_WEEK - toTotalDays(age))
