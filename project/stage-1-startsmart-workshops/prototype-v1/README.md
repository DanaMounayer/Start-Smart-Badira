# Prototype v1 — Stage 1

The working prototype pitched in the StartSmart first round.

## Where the code is

**The whole prototype is this repository.** It is not copied into this folder, on purpose — the app
at the repository root (`src/`, `public/`, `index.html`, the build config) *is* prototype v1. It is
where the app builds and deploys from, and nothing in `project/` touches it.

This folder records that v1 exists, what it did, and what it looked like.

| | |
|---|---|
| **Live prototype** | See the links in the [repository README](../../../README.md) |
| **Source** | [`src/`](../../../src) at the repository root |
| **Architecture** | [`docs/APP_MAP.md`](../../../docs/APP_MAP.md) |

---

## What it does

Bilingual Arabic/English, mobile-first, running entirely in the browser — no installation, no
account, no data leaving the device.

- Pregnancy timeline — gestational age, trimester, progress
- Health snapshot — saved factors and latest measurements
- Guided assessment — an adaptive flow that only asks what is relevant
- **Risk × Reliability × Time** result — three readings, presented separately
- Information-completeness awareness — what BADIRA had, what it did not, what would help
- Assessment history, detailed report and share summary
- Light and dark themes, full right-to-left layout

---

## Screenshots (Arabic interface)

| Welcome | Home | Assessment | Result |
|---|---|---|---|
| ![Welcome](screenshots/01-welcome-ar.png) | ![Home](screenshots/02-home-ar.png) | ![Assessment](screenshots/03-assessment-ar.png) | ![Result](screenshots/04-result-ar.png) |

---

> **Not a diagnostic tool.** The risk reading in v1 is a clearly labelled simulated demonstration
> result, not a prediction. It marks the position a validated clinical model will occupy.
