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

Early prototype. This repository currently contains the **project shell only**:
structure, bilingual (EN/AR) layout with RTL support, styling, and routing. The
three product screens have not been built yet:

1. Pregnancy profile / dashboard
2. Adaptive predictive assessment
3. Risk × Reliability × Time result

There is **no authentication, database, external API, or clinical prediction
model**. The assessment layer is a deliberate placeholder — see
[Assessment layer](#assessment-layer).

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
    routes.tsx          Route table — the three screens get added here
  components/
    AppShell.tsx        Phone-width frame: header, main, disclaimer footer
    BadiraMark.tsx      Brand mark
  screens/
    Welcome.tsx         Temporary landing screen; replaced by the dashboard
  domain/
    types.ts            Profile, Risk, Reliability, Time, MissingInput types
    assessment/
      index.ts          AssessmentEngine interface + placeholder engine
  i18n/
    index.ts            Language/direction helpers
    LanguageProvider.tsx  Provides t(), syncs <html lang/dir>
    en.ts / ar.ts       Dictionaries
  styles/
    tokens.css          Colour, spacing, radius, type tokens
    global.css          Base styles and shared primitives
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

`src/domain/assessment/index.ts` defines an `AssessmentEngine` interface and a
`placeholderEngine` that implements it. **The placeholder encodes no medical
rules**: it returns `risk: 'unknown'`, `reliability: 'insufficient'`, and reports
that no validated model is connected.

This is the seam. When a validated model is ready, implement `AssessmentEngine`
and point `activeEngine` at it — screens consume the interface, never a concrete
engine, so nothing in the UI needs to change.

## License

MIT — see [LICENSE](LICENSE).
