# Nendō — Screen Architecture

**Last updated:** 2026-03-31
**Location:** `student/nendo/ARCHITECTURE.md` (canonical)
**Section state:** 🔵 Phase 2 — Prototype Ready
**Parent:** `../PRODUCT_MAP.md`

## Device Frame
iPhone 14 Pro landscape — 844 × 390px
Class: `.frame.iphone` · Each screen is its own independent HTML file in `prototypes/`.

---

## Build Rules
1. **Background + atmosphere first** — image, vignette, texture, any parallax layers. Make it feel alive before any UI.
2. **Nav + text second** — buttons, labels, back/forward links.
3. **Functionality last** — breathing circle, timer, interactivity (Shiho + Runner only).
4. **Each screen = one independent HTML file.** No combined demos until all screens are solid.
5. **Asset embedding:** All backgrounds are embedded as base64 data URIs. Use WebP versions. No external image dependencies.
6. **No paper texture** — `L6-paper-texture.jpg` is too large to embed (14MB base64). Omit from all v4.0 screens.

---

## Screen Map

| # | Screen | File | Background Asset | Status |
|---|--------|------|-----------------|--------|
| 1 | Student Profile | `StudentProfile_v4.1.html` | `bg-student-profile.webp` | ✅ Complete |
| 2 | Nendo Home | `Nendo_Home_v4.0.html` | `L0-sky.webp` + `L3-dojo-frame.webp` | ✅ Complete |
| 3 | Metsuke Hub | `Nendo_MetsukeHub_v4.0.html` | `bg-metsuke-hub.webp` | ✅ Complete |
| 4 | Mushin Hub | `Nendo_MushinHub_v4.0.html` | `bg-shiho.webp` | ✅ Complete |
| 5 | Tachi Hub | `Nendo_TachiHub_v4.0.html` | `bg-tachi-hub.webp` | ✅ Complete |
| 6 | Shiho | `Nendo_Shiho_v4.0.html` | `bg-runner-kaze.webp` | ✅ Complete |
| 7 | Breath Techniques | `Nendo_BreathTechniques_v4.0.html` | `bg-home-hub.webp` | ✅ Complete |
| 8 | Runner — Kaze | `Nendo_Runner_Kaze_v4.0.html` | `bg-breath-home.webp` | ✅ Complete |
| 9 | Runner — Chi | `Nendo_Runner_Chi_v4.0.html` | `bg-breath-home.webp` | ✅ Complete |
| 10 | Runner — Mizu | `Nendo_Runner_Mizu_v4.0.html` | `bg-breath-home.webp` | ✅ Complete |
| 11 | Runner — Hi | `Nendo_Runner_Hi_v4.0.html` | `bg-breath-home.webp` | ✅ Complete |
| 12 | Session Complete | `Nendo_SessionComplete_v4.0.html` | `bg-session-complete.webp` | ✅ Complete |

---

## Navigation Map

```
StudentProfile_v4.1
  └── Nendo_Home_v4.0
        ├── Nendo_MetsukeHub_v4.0  (all cards locked — back only)
        ├── Nendo_MushinHub_v4.0
        │     ├── Nendo_Shiho_v4.0
        │     │     └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
        │     │           └── Nendo_SessionComplete_v4.0
        │     │                 └── (back to Mushin Hub)
        │     └── Nendo_BreathTechniques_v4.0
        │           └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
        │                 └── Nendo_SessionComplete_v4.0
        └── Nendo_TachiHub_v4.0    (all cards locked — back only)
```

---

## Screen Specs

### 1 · Student Profile `StudentProfile_v4.1.html` ✅
- Three-column layout: belt switcher bar, character column, stats column
- SVG avatar — locked proportions, gi folds, belt knot, face detail
- Full-frame aura canvas — Safari-safe (`createElement('canvas')`), `ctx.filter` feature-detected
- Belt switcher wired to avatar + aura colour system
- Nav out → Nendo Home

### 2 · Nendo Home `Nendo_Home_v4.0.html` ✅
- **Background:** composited environment layers
  - `L0-sky.webp` — sky painting, z-index 1
  - `L3-dojo-frame.webp` — architectural overlay with transparency, z-index 3
  - Door glows between layers (z-index 2) — discipline-coloured radial gradients
- Three discipline doors: Metsuke (blue 目付), Mushin (green 無心), Tachi (red 太刀)
- Floating discipline cards with `cardFloat` animation, hover glow
- Canvas particle drift
- Nav in ← Profile · Nav out → Screens 3, 4, or 5

### 3 · Metsuke Hub `Nendo_MetsukeHub_v4.0.html` ✅
- **Background:** `bg-metsuke-hub.webp`
- Discipline header: 目付 kanji, "Metsuke · The Reading Mind", mantra
- Four hub cards (Kata/Me/Yomi/Ki) — **all locked**
  - `.hub-card.locked` — `opacity:0.35`, `cursor:not-allowed`, `pointer-events:none`, `animation:none`, `filter:grayscale(0.3)`
  - Lock icon (🔒) top-right, "Coming Soon" label at base
- Canvas particle system — blue tone (`rgba(141,184,212,x)`) motes drifting upward
- Nav in ← Nendo Home · Nav out: Back only

### 4 · Mushin Hub `Nendo_MushinHub_v4.0.html` ✅
- **Background:** `bg-shiho.webp`
- Split layout: left — rotating SVG mandala; divider line; right — discipline description
- 無心 kanji, "Mushin · The Still Mind", mantra, body paragraph
- Two actions: `Begin Breath Session →` → Shiho | `Explore Breathing Techniques →` → Breath Techniques
- Canvas particle system — green tone (`rgba(122,184,154,x)`)
- Nav in ← Nendo Home · Nav out → Screen 6 or 7

### 5 · Tachi Hub `Nendo_TachiHub_v4.0.html` ✅
- **Background:** `bg-tachi-hub.webp`
- Discipline header: 太刀 kanji, "Tachi · The Striking Mind", mantra
- Four hub cards (En/Saku/Dō/Ketsu) — **all locked** (same pattern as Metsuke)
- Canvas particle system — warm orange/red (`rgba(212,130,106,x)`) ember drifts
- Nav in ← Nendo Home · Nav out: Back only

### 6 · Shiho `Nendo_Shiho_v4.0.html` ✅
- **Background:** `bg-runner-kaze.webp`
- **Phase 1 — Check-in:** Five state selector cards
  - 散 Scattered · 霧 Clouded · 疲 Tired · 清 Clear · 嵐 Turbulent
  - Select card → "Build My Session →" button appears
- **Phase 2 — Session Build:** Three technique preview cards based on selected state
  - SESSIONS map: `scattered→[kaze,shizen,tanden]`, `clouded→[tanden,shizen,mizu]`, `tired→[hi,kaze,tanden]`, `clear→[mizu,tanden,tsuki]`, `turbulent→[tanden,shizen,tsuki]`
  - Launch button links to Runner for first technique's element
- Back nav: from Phase 2 returns to Phase 1 (JS); from Phase 1 links back to Mushin Hub
- Nav in ← Mushin Hub · Nav out → Runner

### 7 · Breath Techniques `Nendo_BreathTechniques_v4.0.html` ✅
- **Background:** `bg-home-hub.webp`
- Header: 息 kanji, "Breathing Techniques", subtitle
- Four element cards — each links directly to its Runner
  - 風 Kaze / Wind / Calming → `Nendo_Runner_Kaze_v4.0.html`
  - 地 Chi / Earth / Grounding → `Nendo_Runner_Chi_v4.0.html`
  - 水 Mizu / Water / Expanding → `Nendo_Runner_Mizu_v4.0.html`
  - 火 Hi / Fire / Energising → `Nendo_Runner_Hi_v4.0.html`
- Mixed-element particles (all 4 colours)
- Nav in ← Mushin Hub · Nav out → Runner (element selected)

### 8–11 · Breath Runner `Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0.html` ✅
- **Background:** `bg-breath-home.webp` (all four share same image)
- **3-column grid layout** (`grid-template-columns: 220px 1fr 220px`)
  - **Left col:** Element kanji + subtitle, divider, current technique name/realname/cue, element benefits
  - **Centre col:** Oval arena background glow + breathing circle (tap to start/pause), phase label, countdown
  - **Right col:** Session queue (3 techniques, current highlighted), progress dots
- **Breathing circle:** Tap toggles start/pause. Runs through 4 phases (Inhale/Hold/Exhale/Rest), skips zero-duration phases. On cycle complete → advances to next technique. After all 3 techniques → navigates to Session Complete.
- Progress dots update as techniques complete. Left col info updates per technique.
- Element-specific colours and particles per file
- Nav in ← Breath Techniques · Nav out → Session Complete (auto)

**Element data:**

| Element | Techniques | Colour |
|---------|-----------|--------|
| Kaze | Kaze no Iki → Shizen → Tanden | `rgba(140,200,185,x)` |
| Chi | Tanden → Shizen → Mizu | `rgba(190,165,110,x)` |
| Mizu | Mizu → Tsuki → Tanden | `rgba(110,160,210,x)` |
| Hi | Hi no Iki → Kaze no Iki → Tanden | `rgba(215,130,100,x)` |

**Technique library:**

| Key | Kanji | Name | Real Name | Pattern | Cue |
|-----|-------|------|-----------|---------|-----|
| kaze | 風 | Kaze no Iki | Rhythmic Breath | 4-0-4-0 | Steady as wind through tall grass. |
| shizen | 然 | Shizen | Extended Exhale | 4-2-6-0 | Let the breath slide out long and slow. |
| tanden | 中 | Tanden | Box Breathing | 4-4-4-4 | Equal in all directions. The foundation. |
| tsuki | 月 | Tsuki | 4-7-8 Breath | 4-7-8-0 | Slow and deep. The moon waits for no one. |
| hi | 火 | Hi no Iki | Energising Breath | 2-0-4-0 | Sharp and quick. Awaken the flame within. |
| mizu | 水 | Mizu | Ocean Breath | 6-0-6-0 | Slow like the tide. Strong like the deep. |

### 12 · Session Complete `Nendo_SessionComplete_v4.0.html` ✅
- **Background:** `bg-session-complete.webp`
- **Left half:** Aura orb (animated pulse with 2 expanding rings), Aura stage label + name
- **Right half:** "Session Complete" label, XP counter (counts up to +75 on load), XP progress bar, divider, random quote (fades in at 1.8s), return button (appears at 3.2s)
- Mixed celebratory particles (green, gold, cream)
- Return button → Mushin Hub
- Nav in ← Runner (auto-navigate) · Nav out → Mushin Hub

---

## Shared CSS Pattern

Every screen uses this base structure:

```css
/* Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Crimson+Pro:ital,wght@0,300;0,400;0,500;1,300&display=swap');

* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0E0E16; display: flex; justify-content: center; align-items: center; min-height: 100vh; }

/* Frame */
.frame { position: relative; width: 844px; height: 390px; overflow: hidden; border-radius: 44px;
  box-shadow: 0 0 0 2px rgba(255,255,255,0.08), 0 40px 80px rgba(0,0,0,0.6); }

/* Layer stack */
.hero          { position: absolute; inset: 0; background: [data-uri] center/cover; z-index: 1; }
.env-vignette  { position: absolute; inset: 0; background: radial-gradient(...); z-index: 2; pointer-events: none; }
.env-overlay   { position: absolute; inset: 0; background: rgba(6,8,10,0.3-0.4); z-index: 3; pointer-events: none; }
/* NOTE: No env-texture — L6-paper-texture.jpg too large to embed */
#particle-canvas { position: absolute; inset: 0; z-index: 5; pointer-events: none; }
.ui-layer      { position: absolute; inset: 0; z-index: 10; }

/* Nav bar */
.nav-bar { position: absolute; bottom: 0; left: 0; right: 0; height: 44px;
  display: flex; align-items: center; justify-content: space-between; padding: 0 20px;
  z-index: 20; border-top: 1px solid rgba(255,255,255,0.06);
  background: rgba(0,0,0,0.28); backdrop-filter: blur(8px); }
.nav-back  { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.12em; color: rgba(240,235,224,0.55); text-decoration: none; }
.nav-title { font-family: 'Cinzel', serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase; }
.aura-dot  { width: 8px; height: 8px; border-radius: 50%; background: rgba(122,184,154,0.7); animation: auraPulse 3s ease-in-out infinite; }
```

---

## Locked Card Pattern

Used in Metsuke Hub and Tachi Hub for Coming Soon cards:

```css
.hub-card.locked {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
  animation: none;
  filter: grayscale(0.3);
}
.lock-icon { position: absolute; top: 6px; right: 8px; font-size: 9px; opacity: 0.7; }
.coming-soon { position: absolute; bottom: -1px; left: 0; right: 0;
  font-family: 'Cinzel', serif; font-size: 6px; letter-spacing: 0.14em;
  text-align: center; text-transform: uppercase; }
```

```html
<div class="hub-card locked">
  <div class="lock-icon">🔒</div>
  <div class="card-kanji">目</div>
  <div class="card-name">Me</div>
  <div class="card-desc">Observation</div>
  <div class="coming-soon">Coming Soon</div>
</div>
```

---

## Discipline Colours
- **Metsuke:** `rgba(141, 184, 212, x)` — cool blue
- **Mushin:** `rgba(122, 184, 154, x)` — green
- **Tachi:** `rgba(212, 130, 106, x)` — warm red/orange

## Element Colours
- **Kaze (Wind):** `rgba(140, 200, 185, x)` — teal-green
- **Chi (Earth):** `rgba(190, 165, 110, x)` — amber
- **Mizu (Water):** `rgba(110, 160, 210, x)` — blue
- **Hi (Fire):** `rgba(215, 130, 100, x)` — orange-red

## Asset Inventory

### Backgrounds (`assets/backgrounds/`)
| File | Used In | Size |
|------|---------|------|
| `bg-student-profile.webp` | StudentProfile | 77KB |
| `bg-metsuke-hub.webp` | Metsuke Hub | 271KB |
| `bg-shiho.webp` | Mushin Hub | 65KB |
| `bg-tachi-hub.webp` | Tachi Hub | 226KB |
| `bg-runner-kaze.webp` | Shiho | 83KB |
| `bg-home-hub.webp` | Breath Techniques | 65KB |
| `bg-breath-home.webp` | All 4 Runners | 58KB |
| `bg-session-complete.webp` | Session Complete | 240KB |

### Environment Layers (`assets/environment/`)
| File | Used In | Size |
|------|---------|------|
| `L0-sky.webp` | Nendo Home (bg layer) | 192KB |
| `L3-dojo-frame.webp` | Nendo Home (overlay) | 45KB |
| `L6-paper-texture.jpg` | Not embedded — too large | 11MB |
