# BADIRA — implementation checkpoint

Baseline prototype, frozen at this point for reference before model and data
work begins. Figures below were measured against the running app, not
estimated.

## 1. Fully implemented

20 routes, 60 source files, ~7,580 lines, 250 i18n keys with exact EN/AR parity.

| Area | Routes |
| --- | --- |
| Entry | `/welcome`, `/signin` — sign in, continue as guest, language switch |
| Onboarding | `/onboarding` — five sections, resumable, partial profile is valid |
| Profile | `/profile`, `/profile/update`, `/profile/section/:id` |
| Home | `/` — gestation hero, health snapshot, info list, reliability hint, CTA |
| Assessment | `/assessment`, `/assessment/:step`, `/assessment/review`, `/assessment/analyzing` |
| Result | `/result/:id` and `/why`, `/reliability`, `/report`, `/share` |
| Histories | `/history` (measurements), `/assessments` (BADIRA runs) |

Three journeys complete in both languages: returning signed-in user, new
signed-in user, and guest. Guest isolation is asserted in tests.

Verified: no console errors across 21 routes in two languages, no horizontal
overflow, no contrast failures, every interactive control passes a 44x44
hit-area probe, full RTL mirroring, reduced motion and safe areas honoured.

## 2. Intentionally prototype-only

| Thing | Reality | Where |
| --- | --- | --- |
| Questions and follow-up rules | Demo content carrying no clinical meaning | `domain/assessment/demoSpec.ts` |
| The saved profile | Fictional; dates derive from the current day | `data/mockProfile.ts` |
| Sign-in | Selects a demo state; nothing is verified | `screens/SignIn.tsx`, `app/session.tsx` |
| Profile, records, answers | In memory; a refresh resets them (language persists) | `app/session.tsx` |
| Share | Copies to the clipboard; nothing is transmitted, and the UI says so | `screens/result/Share.tsx` |
| Result snapshot | Built locally from the answers given | `domain/result/demoResult.ts` |

## 3. Blocked until the research and model are defined

Risk output, Reliability output, Time interpretation, influential factors, and
any labels, bands, thresholds or numeric outputs. All model-dependent readings
sit in `awaitingModel` and the UI reports exactly that. Nothing is stubbed with
placeholder values.

## 4. The boundary

Two independent integration axes, touching different files.

**Axis A — swapping the clinical question set.** The question set lives in
`domain/assessment/demoSpec.ts`. It is supplied to the app at one composition
point and reaches screens through the assessment session, so replacing it does
not touch screen or component code.

**Axis B — connecting the prediction model.** Four files change:

| File | Change |
| --- | --- |
| `domain/result/demoResult.ts` | Replaced by the real result builder |
| `app/useResult.ts` | Calls the model instead of `buildDemoResult` |
| `screens/assessment/Analyzing.tsx` | Becomes async-aware and handles failure |
| `domain/result/schema.ts` | Additive only |

Everything else is untouched by Axis B. All result and assessment components
and all screens render a `BadiraResult`; none of them computes one.

## 5. Model-integration contract (proposal)

The `available` variants exist in `domain/result/schema.ts`. What is missing is
the calling interface:

```ts
interface BadiraModel {
  readonly version: string              // recorded on the result for audit
  assess(input: ModelInput): Promise<ModelOutput>
}

type ModelInput = {
  profile: PregnancyProfile             // existing type, unchanged
  answers: Answers                      // existing type, unchanged
  information: InformationItem[]        // factual inventory already computed
  assessedAt: string
}

type ModelOutput = {
  risk: Extract<RiskReading, { state: 'available' }>
  reliability: Extract<ReliabilityReading, { state: 'available' }>
  timeInterpretation: { state: 'available'; summary: string }
  factors: InfluentialFactor[]
}
```

Unresolved, and deliberately not decided here:

- Does risk carry a numeric value at all, and in what unit?
- Are `label` and `summary` returned already localized, or as keys the UI
  resolves? This decides whether Arabic comes from the model or from `ar.ts`.
- Are `factors` ranked, weighted, or an unordered set?
- Is Reliability derived from `information` alone, or from signals the UI does
  not currently collect?
- Does Time interpretation depend on gestational age only, or on risk too?

## 6. Technical debt

Worth closing before integration:

1. The question set should reach screens only through the session, so swapping
   it is genuinely a one-file change.
2. A model call can fail or time out. The schema needs a neutral failure state
   before five screens have to be retrofitted for it.
3. Results should carry the model version that produced them, or they cannot
   be compared across model revisions.

Safe to wait: persistence, the result screen's length, webfonts, the logo, and
an add-measurement entry point on `/history`.

## 7. Prototype readiness

| Item | Status |
| --- | --- |
| All journeys work in both languages | PASS |
| Guest isolation | PASS |
| Adaptive engine and answer pruning | PASS |
| Record architecture, one per assessment | PASS |
| Accessibility: contrast, targets, headings, RTL | PASS |
| i18n parity | PASS |
| Clinical safety: no thresholds, percentages or causal claims | PASS |
| Risk and Reliability kept separate | PASS |
| Risk / Reliability / Time outputs | WAITING |
| Influential factors | WAITING |
| Model failure state | WAITING |
| Spec injection and model versioning | WAITING |
| Persistence, auth, backend | OPTIONAL |
| Final logo, webfonts | OPTIONAL |
