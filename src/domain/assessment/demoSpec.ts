import {
  hasSelected,
  type AssessmentSpec,
  type Question,
} from './schema'
import { formatDate } from '@/lib/format'

/**
 * ⚠️ DEMO SPECIFICATION — NOT CLINICAL CONTENT.
 *
 * Every question, option and follow-up rule below is placeholder product
 * content used to exercise the adaptive engine. None of it is a clinical
 * instrument, and no rule asserts medical meaning:
 *
 *   - Follow-ups fire purely because the user selected the related item
 *     ("you mentioned headache, so we ask about headache"), which is
 *     interaction logic, not a decision rule.
 *   - No option implies severity, urgency or risk.
 *   - No threshold, normal range or interpretation appears anywhere.
 *
 * When the clinical specification is finalised, this file is what gets
 * replaced. The engine, screens and state layer do not change.
 */

const questions: Question[] = [
  // --- About you — asked only when there is no saved profile (guest) --------
  {
    id: 'gestationalWeeks',
    step: 'about',
    promptKey: 'qGestWeeks',
    hintKey: 'qGestWeeksHint',
    kind: 'number',
    unitKey: 'weeksWord',
    allowUnknown: true,
    when: ({ profile }) => profile === null,
  },
  {
    id: 'knownConditions',
    step: 'about',
    promptKey: 'qKnownConditions',
    kind: 'multi',
    options: [
      { id: 'hypertension', labelKey: 'optHypertension' },
      { id: 'diabetes', labelKey: 'optDiabetes' },
      { id: 'kidney', labelKey: 'optKidney' },
      { id: 'none', labelKey: 'optNoneOfThese', exclusive: true },
    ],
    allowUnknown: true,
    when: ({ profile }) => profile === null,
  },

  // --- Current measurements -------------------------------------------------
  {
    id: 'bloodPressure',
    step: 'measurements',
    promptKey: 'qBloodPressure',
    hintKey: 'qBloodPressureHint',
    kind: 'bloodPressure',
    allowUnavailable: true,
    savedValue: (profile) => {
      const readings = profile?.bloodPressureReadings ?? []
      const latest = readings[readings.length - 1]
      if (!latest) return null
      return {
        display: `${latest.systolic}/${latest.diastolic}`,
        recordedAt: latest.recordedAt,
      }
    },
  },
  {
    id: 'weight',
    step: 'measurements',
    promptKey: 'qWeight',
    kind: 'number',
    unitKey: 'kg',
    allowUnavailable: true,
    allowSkip: true,
  },

  // --- Current symptoms -----------------------------------------------------
  {
    id: 'symptoms',
    step: 'symptoms',
    promptKey: 'qSymptoms',
    hintKey: 'qSymptomsHint',
    kind: 'multi',
    options: [
      { id: 'headache', labelKey: 'optHeadache' },
      { id: 'vision', labelKey: 'optVision' },
      { id: 'swelling', labelKey: 'optSwelling' },
      { id: 'none', labelKey: 'optNoneOfThese', exclusive: true },
    ],
    allowUnknown: true,
  },
  {
    id: 'headacheSince',
    step: 'symptoms',
    promptKey: 'qHeadacheSince',
    kind: 'single',
    options: [
      { id: 'today', labelKey: 'optToday' },
      { id: 'fewDays', labelKey: 'optFewDays' },
      { id: 'longer', labelKey: 'optLonger' },
    ],
    allowUnknown: true,
    // Demo follow-up: shown because headache was named, nothing more.
    when: ({ answers }) => hasSelected(answers, 'symptoms', 'headache'),
  },
  {
    id: 'visionKind',
    step: 'symptoms',
    promptKey: 'qVisionKind',
    kind: 'multi',
    options: [
      { id: 'blurred', labelKey: 'optBlurred' },
      { id: 'spots', labelKey: 'optSpots' },
      { id: 'light', labelKey: 'optLightSensitive' },
    ],
    allowUnknown: true,
    when: ({ answers }) => hasSelected(answers, 'symptoms', 'vision'),
  },

  // --- Recent changes -------------------------------------------------------
  {
    id: 'anyChanges',
    step: 'changes',
    promptKey: 'qAnyChanges',
    hintKey: 'qAnyChangesHint',
    kind: 'single',
    options: [
      { id: 'yes', labelKey: 'optYes' },
      { id: 'no', labelKey: 'optNo' },
    ],
    allowUnknown: true,
  },
  {
    id: 'changeKinds',
    step: 'changes',
    promptKey: 'qChangeKinds',
    kind: 'multi',
    options: [
      { id: 'medication', labelKey: 'optMedicationChange' },
      { id: 'appointment', labelKey: 'optAppointment' },
      { id: 'newInfo', labelKey: 'optNewInfo' },
    ],
    allowSkip: true,
    when: ({ answers }) => hasSelected(answers, 'anyChanges', 'yes'),
  },
]

export const demoSpec: AssessmentSpec = { questions }

/** Formats a saved value's recency for the "already known" context row. */
export const savedContextLabel = (
  recordedAt: string,
  language: 'en' | 'ar',
): string => formatDate(recordedAt, language)
