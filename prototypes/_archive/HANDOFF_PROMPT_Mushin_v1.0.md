# Nendō — Mushin Line Handoff Prompt v1.0
## "Completing the Still Mind: Mushin Demo v2.0 → Polish & Integration"

---

## WHO YOU ARE WORKING WITH

This is the **Ninja Learning Project** (Ninjaschool). You are building the student-facing app **Nendō** — a gamified martial arts curriculum app for students aged 7–14. The current thread is focused on the **Mushin discipline** (無心 · The Still Mind), which is the breathing and mindfulness arm of the three-part Nendō curriculum.

**Primary devices:** iPhone 14 Pro (844×390px landscape) and iPad Pro 11" (1194×834px landscape).

**Aesthetic:** Anime × martial arts × premium mobile game. Dark backgrounds, painted layers, gold/amber accents for Mushin, element-specific colours for the four breathing elements.

---

## THE MUSHIN LINE — WHAT HAS BEEN BUILT

### File: `student/prototypes/Nendo_MushinDemo_v2.0.html` ← CURRENT FILE

A complete, single-file HTML prototype of the full Mushin user journey. Six screens, fully navigable:

**Screen 1 — Mushin Home**
- Background: `../assets/backgrounds/bg-breath-home.webp`
- Entry point for the Mushin discipline
- Two paths: "Begin with Shiho" (full ritual) or "Skip to Check-In"
- Oversized 無心 kanji watermark (decorative), mini mandala SVG, Cinzel/Crimson Pro typography
- Nav: ← Nendō (disabled in demo) | Mushin | —

**Screen 2 — Shiho (四方 Ritual)**
- Background: `../assets/backgrounds/bg-shiho.webp`
- Animated 5-phase ritual: North → East → South → West → Centre
- SVG mandala with animated progress ring (fills over ~40s)
- Kanji transitions per direction (北 → 東 → 南 → 西 → 中)
- "Begin Shiho" button → auto-progress through phases → "Proceed to Check-In"
- Nav: ← Mushin | 四方 Shiho | ✓ on complete

**Screen 3 — Check-In**
- Dark ambient gradient background (no image)
- 4 mood state cards: Scattered 🌀, Flat 〰, Clear ○, Stormy ⚡
- Each card has element colour theming, selected state highlights
- "Continue →" button appears on state selection
- Nav: ← Mushin | Check In | —

**Screen 4 — Element Hub**
- Dynamic background tint based on selected element
- Diamond of 4 element nodes: Kaze/Wind (top), Hi/Fire (right), Mizu/Water (bottom), Chi/Earth (left)
- Clicking an element expands a technique picker on the right
- "Begin Session" appears after technique selected
- Nav: ← Back | [Element Name] | —

**Screen 5 — Session Runner**
- Background: element-specific (`bg-runner-kaze.webp`, `bg-runner-hi.webp`, `bg-runner-mizu.webp`, `bg-runner-chi.webp`)
- Left column: technique name, element badge, cue text, focus word
- Centre: phase label, canvas breathing orb (expands/contracts with inhale/exhale), countdown, phase subtext
- Right column: cycle pips (completes as each cycle finishes), overall progress bar
- Breathing orb responds to lung scale: 0.0 (exhale) → 1.0 (full inhale), radial gradient with inner highlight and outer glow rings
- "✕ End" button → Session Complete
- Nav: ← Mushin | technique name | mm:ss clock

**Screen 6 — Session Complete**
- Background: `../assets/backgrounds/bg-session-complete.webp`
- Left: "SESSION COMPLETE" tag, focus word (in element colour), cue quote
- Right: stats grid (Duration, Cycles, Element kanji), "Return to Mushin" button
- Nav: ← Nendō | Complete | —

---

## THE DATA MODEL

### Elements (4)
| ID   | Name | Kanji | Element | Colour   | BG Asset              |
|------|------|-------|---------|----------|-----------------------|
| kaze | Kaze | 風    | Air     | #8DB8D4  | bg-runner-kaze.webp   |
| hi   | Hi   | 火    | Fire    | #D4826A  | bg-runner-hi.webp     |
| mizu | Mizu | 水    | Water   | #6A9CC8  | bg-runner-mizu.webp   |
| chi  | Chi  | 地    | Earth   | #C8A46A  | bg-runner-chi.webp    |

### Techniques (11)
Each technique has: `inhale`, `hold`, `exhale`, `endHold` (seconds), `cycles`, `word`, `cue`, `elem`.

| Technique         | Element | Pattern         | Cycles |
|-------------------|---------|-----------------|--------|
| Cloud Breathing   | Kaze    | 4-0-4-0        | 7      |
| Raven's Breath    | Kaze    | 4-0-6-0        | 6      |
| Lantern Breathing | Kaze    | 4-5-6-0        | 5      |
| Phoenix Breath    | Hi      | 2-0-2-0        | 10     |
| Dragon Breath     | Hi      | 2-0-2-0        | 10     |
| Bellows Breath    | Hi      | 2-0-2-0        | 10     |
| Wave Breathing    | Mizu    | 4-0-5-0        | 7      |
| Tide Breathing    | Mizu    | 4-0-4-0        | 7      |
| Warrior's Breath  | Chi     | 4-0-6-0        | 6      |
| Stone Breathing   | Chi     | 4-0-5-0        | 7      |
| Mountain Breathing| Chi     | 3-0-3-0        | 8      |

### Shiho Phases (5, 8s each)
North (北) → East (東) → South (南) → West (西) → Centre (中)

---

## ASSETS AVAILABLE

All assets live at `student/assets/` relative to the prototypes folder:

```
../assets/backgrounds/
  bg-breath-home.webp     ← Mushin Home
  bg-shiho.webp           ← Shiho ritual
  bg-session-shell.webp   ← generic session bg (fallback)
  bg-session-complete.webp ← Session Complete
  bg-session-complete.png  ← (same, alternate format)
  bg-runner-kaze.webp     ← Kaze/Air runner
  bg-runner-hi.webp       ← Hi/Fire runner
  bg-runner-mizu.webp     ← Mizu/Water runner
  bg-runner-chi.webp      ← Chi/Earth runner

../assets/states/
  state-clear.png
  state-flat.png
  state-scattered.png
  state-stormy.png        ← available but not currently used in demo

../assets/environment/
  L0-sky.jpg, L0-sky-cool.jpg, L0-sky-warm.jpg
  L2-village.png
  L3-dojo-frame.png
  L4-floor.jpg
  L5-lantern.png
  L6-paper-texture.jpg   ← available for layered atmosphere
```

---

## WHAT TO BUILD NEXT

### Priority 1 — Polish the Current Demo

The demo is functional. These items would make it demo-ready:

**A. Shiho breathing guide** (Quick Win — ~30min)
Add a simple `INHALE` / `EXHALE` alternating display during each Shiho phase, synced to a 4s in / 4s out cycle. This makes the ritual functional, not just visual. A small SVG circle that pulses in/out would work well below the mandala.

**B. Check-In state → session adaptation** (Medium)
Currently the selected state is stored but unused. Use it to:
- Pre-select a suggested element (Scattered → Hi/Fire for energy, Flat → Kaze/Air for lift, Stormy → Mizu/Water for calm, Clear → Chi/Earth for grounding)
- Show a one-line recommendation: "Based on your state, we suggest Kaze · Air breathing"
- Student can still override

**C. Particle system colour transitions** (Quick Win — ~20min)
The particle system changes colour based on selected element, but the transition is instant. Add a smooth lerp over ~800ms so switching elements feels atmospheric rather than abrupt.

**D. Session Complete → XP feedback** (Medium)
After a session, show a simple XP gain animation: "+12 XP" fades up from the focus word, and the aura dot in the nav pulses green. No backend needed — just the visual feedback.

**E. iPad layout refinement** (Medium)
The iPad overrides exist but haven't been tested carefully. The runner screen especially needs review at 1194×834 — the breathing canvas should scale to ~260px and the three-column layout needs vertical centering checked.

---

### Priority 2 — Integrate into Full Demo (Nendo_FullDemo_v4.0)

The Mushin line needs to replace the current placeholder screens in `Nendo_FullDemo_v3.0.html`. The full demo has 10 screens. The Mushin section is screens 3–8.

**Integration approach:**
1. Port the Mushin Home, Shiho, Check-In, Hub, Runner, and Complete CSS into the full demo's stylesheet
2. Replace the existing screen-3 through screen-8 HTML blocks with the v2.0 versions
3. Merge the JS — the full demo uses `setScreen()` and `devGo()` already, so the Mushin-specific JS (Shiho ritual, breathing runner, hub builder) can be appended
4. Wire up cross-screen navigation: from Student Profile "Enter Nendō →" → Nendō Home → Mushin Home

**Key difference from standalone demo:** In the full demo, the Mushin Home has a real back button to `screen-mdh` (Nendō Home hub). The nav back in the standalone demo is disabled.

---

### Priority 3 — Metsuke Hub Integration

The standalone `Nendo_MetsukeHub_v3.0.html` is complete. It needs to replace the placeholder `screen-metsuke-home` in `Nendo_FullDemo_v3.0.html`. This is a similar integration task to the Mushin line but simpler (Metsuke doesn't have a session runner yet).

---

## ARCHITECTURE NOTES

- **Single HTML file** — all CSS and JS is inline, no external dependencies except Google Fonts
- **Device frame:** `.frame.iphone` (844×390) / `.frame.ipad` (1194×834) — landscape orientation
- **Screen system:** `.screen` elements with `opacity:0 / pointer-events:none`, active state adds `opacity:1`
- **Particle canvas:** positioned as first child of `.frame`, z-index:8, responds to `runnerLungScale`
- **Typography:** Cinzel (headings, labels, nav) + Crimson Pro (body, italic descriptions)
- **Colour palette:**
  - Dark base: `#050508` / `#060508`
  - Mushin accent: `rgba(200,176,106,*)` (gold/amber)
  - Green confirmation: `#7AB89A`
  - Text: `#F5F0E8` (warm white)

---

## CONSTRAINTS

- Students are 7–14 — UI must be joyful and legible at all times
- Performance matters — older iPads in schools; no heavy libraries
- Ninja/martial arts aesthetic is core — not generic wellness/meditation UI
- Keep everything in a single HTML file for now — no build step, no bundler
- Never run git push or git commit from this workspace — see CLAUDE.md

---

## OUTPUT FORMAT FOR NEXT THREAD

Build either:
1. **Polish pass on `Nendo_MushinDemo_v2.0.html`** → save as `Nendo_MushinDemo_v2.1.html`
2. **Full demo integration** → save as `Nendo_FullDemo_v4.0.html`

State which you're building at the start, and document any decisions made.

---

*Files live at: `Ninja App / student / prototypes /`*
*Current Mushin demo: `Nendo_MushinDemo_v2.0.html`*
*Full demo: `Nendo_FullDemo_v3.0.html`*
*All assets: `student/assets/`*
