# BADIRA — app map

Approved structure. The three main stages are the backbone of the journey, not
the full screen count; supporting screens exist where they improve the flow.

## Entry

| Route | Screen | Status |
| --- | --- | --- |
| `/welcome` | Welcome — sign in or continue as guest | built |

Guest access is a required feature. A guest carries no saved profile and is
told plainly that Reliability will be limited without one.

## Main Stage 1 — Sign-in & personal pregnancy profile

| Route | Screen | Status |
| --- | --- | --- |
| `/` | **Home** — gestational age, health snapshot, access to detail, missing-information hint, start assessment | built |
| `/profile` | Full pregnancy profile | built (read-only) |
| `/history` | Measurements & history | built |
| `/assessments` | Previous BADIRA assessments | built (empty state) |
| `/profile/update` | Update / add information | placeholder |
| `/onboarding` | First-time profile setup | not built |

### Onboarding

Onboarding is **not** a fixed short list of questions. The pregnancy profile is
organised into sections, completed over time rather than in one sitting, and a
partially complete profile is a valid state that simply carries lower
Reliability. Sections currently anticipated:

- Pregnancy information
- Health history
- Family history
- Previous pregnancy information
- Measurements
- Further sections to be finalised

**No clinical fields are specified yet.** The exact questions inside each
section are deliberately undefined until the clinical content is agreed.

## Main Stage 2 — Intelligent predictive assessment

Not built. Planned as a multi-step adaptive flow that reuses saved information,
asks only for what is new, missing or needs confirmation, allows "I don't know
/ not available", and treats missing answers as meaningful for Reliability.

| Route | Screen |
| --- | --- |
| `/assessment` | Introduction — what BADIRA already has |
| `/assessment/:step` | Adaptive steps (measurements, symptoms, recent changes, follow-ups) |
| `/assessment/review` | Review before analysis |

## Main Stage 3 — Risk × Reliability × Time result

Not built. **The result system is undefined**: no risk categories, thresholds,
percentages, reliability scales or recommendations have been designed, and none
may be invented. Risk, Reliability and Time stay three separate concepts and are
never merged into one score.

| Route | Screen |
| --- | --- |
| `/result/:id` | The result |
| `/result/:id/why` | Most influential factors |
| `/result/:id/reliability` | Improve Reliability / missing information |
| `/result/:id/report` | Detailed report |
| `/result/:id/share` | Share a structured summary with a doctor |

## Journeys

- **Returning user** — Home → Start assessment → adaptive steps → review →
  result → improve Reliability or share.
- **First-time user** — Welcome → sign in → onboarding sections (resumable,
  skippable) → Home.
- **Guest** — Welcome → continue as guest → Home with empty states → assessment
  using only what is entered now → result with limited Reliability, with the
  option to save.

## Model boundary

No clinical prediction model is connected. `src/domain/assessment/` defines an
`AssessmentEngine` interface with a placeholder that encodes no medical rules;
a validated model replaces it without UI changes. Demo data is fictional and
marked as such in code.
