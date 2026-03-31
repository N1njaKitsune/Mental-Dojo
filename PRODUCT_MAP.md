# StudentNinja — Product Map

**Last updated:** 2026-03-31
**Stage:** Stage 2 — Nendō (Active)
**Root authority:** This document. All section docs inherit from here.

---

## What This Is

StudentNinja is the student-facing layer of the Ninja Learning App. It spans five sections:

| # | Section | Purpose |
|---|---------|---------|
| 1 | **Student Profile** | Identity, belt rank, aura stage, XP — the persistent shell |
| 2 | **Nendō** | Breathing and mindfulness curriculum (Metsuke / Mushin / Tachi disciplines) |
| 3 | **Training** | Weekly and daily challenges set by grade and age bracket |
| 4 | **Techniques** | Video library of martial arts techniques for in-class study |
| 5 | **Achievements** | Badge catalogue tracking wins across all sections |

Student Profile is the hub. Every other section feeds data into it (XP, aura, badges).

---

## Build States

Every screen, section, and feature in StudentNinja is tracked at one of five states:

| State | Meaning |
|-------|---------|
| ⬜ **Concept** | Named and categorised. No spec written yet. |
| 🟣 **Defined** | CONCEPT.md exists with purpose, content spec, and prerequisites. Not started in code. |
| 🟡 **Phase 1 — Early Dev** | Has background + atmosphere + display layer. No live functionality. Useful as a visual reference. |
| 🔵 **Phase 2 — Prototype Ready** | Fully interactive prototype. All nav wired. Functionality working. Suitable for user testing. |
| 🟢 **Phase 3 — Release Ready** | Production-quality. Accessibility checked. Data connections live. No prototype debt. |

**What "built" means for Phase 1:** background rendered, effects active, all display copy present.
**What "built" means for Phase 2:** every nav link works, all interactions respond, session flow runs end-to-end.

---

## Section Status Overview

### 1 · Student Profile `StudentProfile_v4.1.html`
**State: 🔵 Phase 2 — Prototype Ready**

The persistent identity screen. Belt rank, SVG avatar, aura canvas, XP totals. Entry point to all sections. Currently wired to Nendō only; Training/Techniques/Achievements nav pills are placeholder alerts.

**Prototype file:** `prototypes/StudentProfile_v4.1.html`
**Spec:** See `nendo/ARCHITECTURE.md` §1 (interim; will move to own section doc)

---

### 2 · Nendō `nendo/`
**State: 🔵 Phase 2 — Prototype Ready**

11 screens built and wired. Three disciplines: Metsuke (locked), Mushin (active), Tachi (locked). Full Mushin flow works end-to-end: Home → Mushin Hub → Shiho → Runner → Session Complete.

**Prototype files:** `prototypes/Nendo_*.html`
**Spec:** `nendo/ARCHITECTURE.md`

| Screen | File | State |
|--------|------|-------|
| Nendo Home | `Nendo_Home_v4.0.html` | 🔵 |
| Metsuke Hub | `Nendo_MetsukeHub_v4.0.html` | 🔵 |
| Mushin Hub | `Nendo_MushinHub_v4.0.html` | 🔵 |
| Tachi Hub | `Nendo_TachiHub_v4.0.html` | 🔵 |
| Shiho | `Nendo_Shiho_v4.0.html` | 🔵 |
| Breath Techniques | `Nendo_BreathTechniques_v4.0.html` | 🔵 |
| Runner — Kaze | `Nendo_Runner_Kaze_v4.0.html` | 🔵 |
| Runner — Chi | `Nendo_Runner_Chi_v4.0.html` | 🔵 |
| Runner — Mizu | `Nendo_Runner_Mizu_v4.0.html` | 🔵 |
| Runner — Hi | `Nendo_Runner_Hi_v4.0.html` | 🔵 |
| Session Complete | `Nendo_SessionComplete_v4.0.html` | 🔵 |
| Metsuke — Kata | _(not started)_ | ⬜ |
| Metsuke — Me | _(not started)_ | ⬜ |
| Metsuke — Yomi | _(not started)_ | ⬜ |
| Metsuke — Ki | _(not started)_ | ⬜ |
| Tachi — En | _(not started)_ | ⬜ |
| Tachi — Saku | _(not started)_ | ⬜ |
| Tachi — Dō | _(not started)_ | ⬜ |
| Tachi — Ketsu | _(not started)_ | ⬜ |

**Prerequisites for unlocking Metsuke/Tachi cards:** Content spec per card, instructor-approved technique mapping, background asset created.

---

### 3 · Training `training/`
**State: 🟣 Defined**

Weekly and daily challenge system. Challenges are assigned by grade bracket and age bracket. Streak tracking, XP bonuses for consistency, breathwork reminders integrated.

**Spec:** `training/CONCEPT.md`
**Prototype files:** None yet.

**Prerequisites for Phase 1:** CONCEPT.md finalised → challenge card design → weekly challenge data structure → one static prototype screen.

---

### 4 · Techniques `techniques/`
**State: 🟣 Defined**

Video library for in-class martial arts technique study. Content is grade-filtered — students see only techniques appropriate to their current rank. Separate from Nendō breathwork.

**Spec:** `techniques/CONCEPT.md`
**Prototype files:** None yet.

**Prerequisites for Phase 1:** CONCEPT.md finalised → video card design → grade-filter logic spec → one static prototype screen.

---

### 5 · Achievements `achievements/`
**State: 🟣 Defined**

Badge catalogue covering wins across all four other sections. Real-world badges (gradings, events) and in-app badges (streaks, completions, milestones). Earned badges unlock avatar accessories.

**Spec:** `achievements/CONCEPT.md`
**Prototype files:** None yet.

**Prerequisites for Phase 1:** CONCEPT.md finalised → badge grid design → signal sources mapped → one static prototype screen.

---

## Navigation Architecture

```
StudentProfile_v4.1
  ├── Nendo_Home_v4.0 ──────────────────────── [active]
  │     ├── Nendo_MetsukeHub_v4.0 (locked — back only)
  │     ├── Nendo_MushinHub_v4.0
  │     │     ├── Nendo_Shiho_v4.0
  │     │     │     └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
  │     │     │           └── Nendo_SessionComplete_v4.0
  │     │     │                 └── (back to Mushin Hub)
  │     │     └── Nendo_BreathTechniques_v4.0
  │     │           └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
  │     │                 └── Nendo_SessionComplete_v4.0
  │     └── Nendo_TachiHub_v4.0 (locked — back only)
  ├── Training ──────────────────────────────── [placeholder — not built]
  ├── Techniques ─────────────────────────────── [placeholder — not built]
  └── Achievements ───────────────────────────── [placeholder — not built]
```

---

## Data Flow (Current → Future)

| Event | Source | Feeds Into |
|-------|--------|-----------|
| Session complete | Nendō Runner | XP counter on Session Complete screen |
| XP earned | Session Complete | Student Profile aura stage _(not yet wired)_ |
| Belt rank set | Student Profile | Techniques grade filter _(not yet built)_ |
| Challenge completed | Training | XP + streak on Student Profile _(not yet built)_ |
| Badge unlocked | Achievements | Avatar accessory unlock on Student Profile _(not yet built)_ |

Full integration spec: `../_SHARED/integration/` (cross-section; outside this folder's scope)

---

## Folder Structure

```
student/
  PRODUCT_MAP.md          ← this file (root authority)
  STANDARDS.md            ← build quality criteria
  WORKFLOW.md             ← active sprint tasks
  STATUS.md               ← live status summary
  CLAUDE.md               ← AI context (do not modify)

  nendo/
    ARCHITECTURE.md       ← full Nendō screen spec

  training/
    CONCEPT.md            ← purpose, spec, prerequisites

  techniques/
    CONCEPT.md            ← purpose, spec, prerequisites

  achievements/
    CONCEPT.md            ← purpose, spec, prerequisites

  prototypes/             ← all HTML files, flat (do not reorganise yet)
  assets/                 ← backgrounds, icons, environment layers
  content/                ← copy, data, technique library
  ui-specs/               ← visual design references
```

---

## Rules

1. **PRODUCT_MAP.md is read-only for agents** — update only when section state changes or new sections are added.
2. **Section state only advances** — never move a section backwards without documenting why.
3. **Prototypes stay flat** — no subfolders in `prototypes/` until Training/Techniques builds begin.
4. **Each section owns its own doc** — no screen-level detail in this file; delegate to section docs.
5. **No git operations from this workspace** — handled from master project only.
