# BADIRA (بادرة)

A bilingual, mobile-first early-awareness companion for **preeclampsia**, built
around **Risk × Reliability × Time**.

BADIRA helps pregnant women recognise potential preeclampsia risk earlier and
understand when professional assessment may be needed. Unlike a scoring tool, it
reports risk *and*, separately, how reliable that risk estimate is given the
completeness and consistency of the information available. When key information
is missing, BADIRA names what is missing instead of forcing a confident answer.
It also weighs **Time** — especially gestational stage — when communicating how
promptly assessment may be warranted.

> **BADIRA is not a symptom checker and is not a diagnostic or treatment
> system.** It supports earlier awareness and never replaces professional
> medical assessment.

## Status

Working prototype. All three product screens are built, in English and Arabic:

1. Pregnancy profile / dashboard
2. Adaptive predictive assessment
3. Risk × Reliability × Time result

There is **no authentication, database, external API, or clinical prediction
model**, and nothing persists beyond the session. Of the three readings, two are
genuinely determined from the assessment — Reliability from how much of the
requested information was available, Time from the recorded gestational timing.
Risk is a fixed demonstration output, labelled as such in the interface; it is
not derived from the answers. See [Assessment layer](#assessment-layer).

## Tech stack

| Concern    | Choice                                        |
| ---------- | --------------------------------------------- |
| Build tool | [Vite](https://vite.dev) 5                    |
| UI         | React 18 + TypeScript (strict)                |
| Routing    | React Router 6                                |
| Styling    | Plain CSS with design tokens, no UI framework |
| i18n       | Small in-repo dictionary, no dependency       |

Chosen to keep the prototype fast to iterate on and free of dependencies we
would have to unpick later.

## Requirements

- Node.js 20 or newer (developed on 22)
- npm 10 or newer

## Setup

```bash
npm install
```

## Run

```bash
npm run dev
```

Then open **http://localhost:5173/**.

To preview on a phone on the same network, use the `Network:` URL that Vite
prints — the dev server listens on all interfaces. Or open your browser's device
toolbar and pick a phone viewport; the layout is designed for ~390px wide and
centres itself on larger screens.

## Other scripts

| Command             | Does                                          |
| ------------------- | --------------------------------------------- |
| `npm run dev`       | Start the dev server with hot reload          |
| `npm run build`     | Type-check, then build to `dist/`             |
| `npm run preview`   | Serve the production build locally            |
| `npm run typecheck` | Type-check only                               |

## Project structure

```
src/
  main.tsx              App entry point
  App.tsx               Providers (language, router)
  app/
    routes.tsx          Route table — 20 routes
    session.tsx         Profile and assessment records for this session
    assessmentSession.tsx  In-progress assessment state
    useResult.ts        Reads a stored result by id
  components/
    AppShell.tsx        Phone-width frame: bar, main, disclaimer footer
    AppBar.tsx          Brand lockup, language toggle, demo-state menu
    ScrollCue.tsx       "More below" hint for long screens
    BadiraMark.tsx      Brand mark, with light/dark header treatments
    assessment/ home/ history/ profile/ result/ ui/
  screens/
    Welcome.tsx  Home.tsx  SignIn.tsx  Onboarding.tsx
    History.tsx  Assessments.tsx
    assessment/         Intro, Step, Review, Analyzing
    profile/            Overview, SectionList, Section
    result/             Result, Why, Reliability, Report, Share
  domain/
    types.ts            Profile, gestation and measurement types
    gestation.ts        Weeks, trimester, progress
    profile/sections.ts Profile sections and their completion state
    assessment/         Adaptive question spec, schema and engine
    result/             Result schema, copy table and builder
  i18n/
    index.ts            Language/direction helpers
    LanguageProvider.tsx  Provides t(), syncs <html lang/dir>
    en.ts / ar.ts       Dictionaries, parity enforced by the type checker
  styles/
    tokens.css          Colour, spacing, radius, type tokens
    global.css          Base styles and shared primitives
    presentation.css    Desktop-only phone frame, scoped to a media query
    presentationFit.ts  Scales that frame to the available space
docs/
  APP_MAP.md            Screen-by-screen map
  CHECKPOINT.md         Implementation checkpoint
```

## Bilingual support

English and Arabic ship together. `LanguageProvider` keeps `<html lang>` and
`<html dir>` in sync, so the browser handles RTL mirroring; stylesheets use
logical properties (`margin-inline`, `padding-inline-start`) rather than
left/right so both directions work from one rule set. The language toggle lives
in the header and the choice persists in `localStorage`.

Adding a string: add the key to `src/i18n/en.ts`, then add the Arabic value to
`src/i18n/ar.ts`. TypeScript fails the build if a key is missing from either.

## Assessment layer

The assessment is data, not markup. `src/domain/assessment/schema.ts` defines
the question shape and the step order; `demoSpec.ts` holds the questions,
options and visibility rules; `engine.ts` is a pure function over the two that
decides what is visible given the answers so far. The step screen renders
whatever the engine returns, so changing the assessment means editing the spec,
not editing a screen.

**None of it encodes clinical meaning.** Visibility rules are interaction logic
only — a follow-up appears because the related item was selected, never because
an answer means anything. No threshold, normal range or interpretation appears
anywhere in the spec.

`src/domain/result/` turns a completed assessment into a result.
`demoResult.ts` counts what the assessment held to determine Reliability, reads
the recorded gestational timing for Time, and emits a fixed, labelled
demonstration value for Risk. A result stores ids and i18n keys rather than
resolved text, so a saved assessment renders in whichever language it is later
opened in, and every screen resolves through one copy table in `copy.ts`.

These are the seams. When the clinical specification and a validated model are
ready, `demoSpec.ts` and the Risk branch of `demoResult.ts` are what get
replaced; the engine, the screens and the state layer do not change.

## License

MIT — see [LICENSE](LICENSE).
