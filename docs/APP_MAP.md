# BADIRA — app map

Approved structure. The three main stages are the backbone of the journey, not
the full screen count; supporting screens exist where they improve the flow.

## Entry

| Route | Screen | Status |
| --- | --- | --- |
| `/welcome` | Welcome — sign in, continue as guest, switch language | built |
| `/signin` | Prototype sign-in: returning demo profile, or a new user | built |

Guest access is a required feature. A guest carries no saved profile and is
told plainly that Reliability will be limited without one.

## Main Stage 1 — Sign-in & personal pregnancy profile

| Route | Screen | Status |
| --- | --- | --- |
| `/` | **Home** — gestational age, health snapshot, access to detail, missing-information hint, start assessment | built |
| `/profile` | Full pregnancy profile | built (read-only) |
| `/history` | Measurements & history | built |
| `/assessments` | Previous BADIRA assessments — records from this session, each reopenable | built |
| `/profile/update` | Choose a section to change | built |
| `/profile/section/:id` | Edit one section | built |
| `/onboarding` | First-time setup, section-based and resumable | built |

### Onboarding

Onboarding is **not** a fixed short list of questions. The pregnancy profile is
organised into five sections, completed over time rather than in one sitting,
and a partially complete profile is a valid state that simply carries lower
Reliability:

- Pregnancy information
- Health history
- Family history
- Previous pregnancy information
- Measurements

Sections are built from fields that already exist in the profile model; no
clinical question was invented to fill a screen. Each section reports as
complete, partly filled or not added, and a partly filled profile is a valid
state that never blocks the user.

**No new clinical fields are specified.** The exact questions inside each
section remain open until the clinical content is agreed.

### State

Profile, assessment records and session mode live in memory for the length of
the session — there is no server, and the app says so wherever it matters.
Editing a section writes through the session, so a change appears immediately
on Home and in the next assessment. Guest mode carries no profile at all, so
signed-in data cannot reach it.

## Main Stage 2 — Intelligent predictive assessment

Built. A data-driven adaptive flow: `src/domain/assessment/demoSpec.ts` holds
the questions and their visibility rules, `engine.ts` decides what is visible,
and the step screen renders whatever it is given. Steps with no visible
questions disappear entirely, so a signed-in user sees four stages and a guest
sees five.

| Route | Screen | Status |
| --- | --- | --- |
| `/assessment` | Introduction — what BADIRA already has | built |
| `/assessment/about` | Guest-only; hidden when a profile exists | built |
| `/assessment/measurements` | Current measurements | built |
| `/assessment/symptoms` | Current symptoms + adaptive follow-ups | built |
| `/assessment/changes` | Recent changes | built |
| `/assessment/review` | Review before analysis | built |
| `/assessment/analyzing` | Transition to the result | built |

**All question content is demo content.** `demoSpec.ts` carries the warning in
full: no thresholds, ranges, severity or interpretation appear anywhere, and
follow-ups fire only because the user named the related item — interaction
logic, not a decision rule. Replacing that one file is how the clinical
specification lands; the engine, screens and state layer do not change.

Answers live only for the run. A guest's answers never touch the demo profile,
because the profile arrives from the session and is simply null for a guest.

## Main Stage 3 — Risk × Reliability × Time result

Built as a framework. `src/domain/result/schema.ts` types the result;
`demoResult.ts` builds one; the screens render whatever valid result object
they receive. No component contains a threshold, band or cutoff.

| Route | Screen | Status |
| --- | --- | --- |
| `/result/:id` | The result — Risk, with Reliability and Time as context | built |
| `/result/:id/why` | Information that influenced this assessment | built |
| `/result/:id/reliability` | Improve reliability | built |
| `/result/:id/report` | Detailed report | built |
| `/result/:id/share` | Share a structured summary | built |

**No validated clinical prediction model is connected.** Of the three readings,
two are determined from the assessment itself and one is a demonstration:

| Reading | What it is |
| --- | --- |
| **Risk** | A fixed simulated demonstration output, identical on every assessment and derived from nothing — not the answers, the measurements, the history, what was missing, or Reliability. It occupies the position a validated model will fill. Every screen that shows it carries a `Simulated` label. |
| **Reliability** | Computed from information coverage: how much of what the assessment asked for it actually held. It describes coverage of information, and is captioned throughout as separate from the user's health. |
| **Time** | The recorded gestational age and the assessment date, both factual. |

There are no percentages, probabilities, bands, cutoffs, timing rules or
recommendations anywhere in the codebase, and no reading is combined with
another into a score.

The screens also show the factual inventory read from the profile and the
user's own answers: what the assessment had, and what it did not.

Sharing transmits nothing: the summary is copied to the device, and the screen
says so rather than implying a doctor received it.

## Journeys

- **Returning user** — Home → Start assessment → adaptive steps → review →
  result → improve Reliability or share.
- **First-time user** — Welcome → sign in → onboarding sections (resumable,
  skippable) → Home.
- **Guest** — Welcome → continue as guest → Home with empty states → assessment
  using only what is entered now → result with limited Reliability, with the
  option to save.

## Model boundary

No validated clinical prediction model is connected, and the prototype does not
claim otherwise: the Risk reading is a labelled simulation, not a prediction.

Two seams, in different files:

- **The question set.** `src/domain/assessment/demoSpec.ts` holds every
  question, option and visibility rule, and carries the warning that none of it
  is clinical content. `schema.ts` types it and `engine.ts` decides what is
  visible. Replacing the spec is how a clinical question set lands; the engine,
  the screens and the state layer do not change.
- **The Risk output.** `src/domain/result/demoResult.ts` builds the result,
  emitting the fixed simulated Risk alongside the Reliability it counts and the
  Time it reads. A validated model replaces that one branch; Reliability, Time,
  the result schema and every screen already work as they will afterwards.

Results carry ids and i18n keys rather than resolved text, so a saved
assessment renders in whichever language it is later opened in. Demo data is
fictional and marked as such in code.
