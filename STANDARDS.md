# StudentNinja — Build Standards

**Last updated:** 2026-03-31
**Authority:** These criteria define what each build state means in practice.
**Applies to:** All screens, features, and sections in StudentNinja.

---

## The Five Build States

### ⬜ Concept
Something has been named and placed in the product map. No spec exists yet.

**Minimum to qualify:**
- Named in `PRODUCT_MAP.md`
- Assigned a section (nendo / training / techniques / achievements / profile)
- No further requirements

**This state is appropriate when:** You know a feature or section needs to exist but haven't yet decided what it contains or looks like.

---

### 🟣 Defined
A written spec exists. Nothing has been built in code yet.

**Minimum to qualify:**
- `CONCEPT.md` (or equivalent section doc) created in the section's subfolder
- Purpose clearly stated — one paragraph minimum
- Content spec written — what the user sees, what they can do
- Prerequisites for Phase 1 listed — what must be true before code begins
- Any known data dependencies identified

**This state is appropriate when:** You've done enough thinking to commit to a direction but aren't ready to prototype yet. Defined specs can still evolve — they just need to exist.

**Quality bar:**
- Someone reading the doc could design a screen from it without asking you questions
- The "why" is as clear as the "what"

---

### 🟡 Phase 1 — Early Dev
A visual shell exists. Atmosphere and display are complete. No interaction required.

**Minimum to qualify:**
- Background renders correctly (embedded base64 or confirmed path)
- Visual effects active: particles, vignette, overlay, any ambient animation
- All display copy present: headings, labels, body text, kanji where used
- Layout correct for device frame (844×390px landscape)
- Fonts load (Cinzel + Crimson Pro via Google Fonts)
- Nav bar present with correct labels (links can be `#` or blank at this stage)

**Does NOT require:**
- Working nav links
- Interactive elements responding
- Session logic
- Data connections

**This state is appropriate when:** You need a visual reference for design review, stakeholder sign-off, or as a foundation before wiring interaction.

**Fail conditions (cannot claim Phase 1 if):**
- Background is a placeholder colour instead of the actual asset
- Layout breaks outside the 844×390 frame
- Copy is lorem ipsum or placeholder text
- File has external image dependencies that don't load when opened directly

---

### 🔵 Phase 2 — Prototype Ready
Fully interactive. All nav works. All core functionality operational. Suitable for user testing.

**Minimum to qualify:**
- Everything from Phase 1
- All nav links wired to correct target files
- All interactive elements respond correctly (buttons, cards, toggles)
- Session logic runs end-to-end: entry → interaction → exit → next screen
- State management works (e.g. Shiho phase switching, Runner technique advancement)
- Progress indicators update correctly
- Any auto-navigation fires at the right moment
- No broken links, no `alert()` placeholders in nav paths that should be live

**Does NOT require:**
- Live data connections (XP can be hardcoded)
- Server-side anything
- Accessibility compliance
- Performance optimisation

**This state is appropriate when:** You're ready for real user feedback on flows and interactions.

**Fail conditions (cannot claim Phase 2 if):**
- Any nav link goes nowhere or throws an alert instead of navigating
- The session flow cannot be completed end-to-end
- A required interactive element does nothing when activated
- Files have external dependencies that break when opened directly

---

### 🟢 Phase 3 — Release Ready
Production quality. No prototype debt. Suitable for live deployment.

**Minimum to qualify:**
- Everything from Phase 2
- All XP, aura, and progress values read from / write to real data layer
- Accessibility: keyboard navigable, ARIA labels on interactive elements, colour contrast compliant
- Cross-browser tested: Safari, Chrome, Firefox (latest)
- Device frame verified on actual devices or accurate simulators
- No hardcoded values that should be dynamic
- Performance: initial load under 3s on 4G, no layout shift after load
- All placeholder/coming-soon states either filled or intentionally locked with correct copy

**This state is appropriate when:** The screen is ready to put in front of real students.

---

## Prototype File Conventions

All prototypes follow these rules regardless of build state:

**File naming:** `[Section]_[ScreenName]_v[version].html`
Examples: `Nendo_Runner_Kaze_v4.0.html`, `StudentProfile_v4.1.html`

**Device frame:** `.frame.iphone` — 844×390px landscape, `border-radius: 44px`

**Layer stack (z-index order):**
```
z:1   .hero              background image
z:2   .env-vignette      radial gradient darkening
z:3   .env-overlay       rgba overlay (0.3–0.4 opacity)
z:5   #particle-canvas   particle system
z:10  .ui-layer          all UI content
z:20  .nav-bar           navigation bar
```

**Fonts:** Cinzel (headings, labels, nav) + Crimson Pro (body, cues) via Google Fonts

**Backgrounds:** Embedded as base64 data URIs. No external image dependencies. Use WebP format. No paper texture (L6-paper-texture.jpg is too large to embed and imperceptible at 0.025 opacity anyway).

**Nav bar:** Fixed to bottom. Height 44px. Back link (left), screen title (centre), aura dot (right). `backdrop-filter: blur(8px)`.

---

## Colour Standards

### Discipline colours
| Discipline | RGBA base | Use |
|-----------|-----------|-----|
| Metsuke | `rgba(141, 184, 212, x)` | Particles, glows, accents |
| Mushin | `rgba(122, 184, 154, x)` | Particles, glows, accents |
| Tachi | `rgba(212, 130, 106, x)` | Particles, glows, accents |

### Element colours (Nendō Runners)
| Element | RGBA base | Use |
|---------|-----------|-----|
| Kaze (Wind) | `rgba(140, 200, 185, x)` | Circle glow, particles, accents |
| Chi (Earth) | `rgba(190, 165, 110, x)` | Circle glow, particles, accents |
| Mizu (Water) | `rgba(110, 160, 210, x)` | Circle glow, particles, accents |
| Hi (Fire) | `rgba(215, 130, 100, x)` | Circle glow, particles, accents |

---

## Locked / Coming Soon Pattern

Used for features that are named but not yet built. Applied at card level.

```css
.hub-card.locked {
  opacity: 0.35;
  cursor: not-allowed;
  pointer-events: none;
  animation: none;
  filter: grayscale(0.3);
}
.lock-icon { position: absolute; top: 6px; right: 8px; font-size: 9px; opacity: 0.7; }
.coming-soon {
  position: absolute; bottom: -1px; left: 0; right: 0;
  font-family: 'Cinzel', serif; font-size: 6px; letter-spacing: 0.14em;
  text-align: center; text-transform: uppercase;
}
```

**Rule:** Never use `alert()` as a nav placeholder for locked sections. Use `pointer-events: none` on the card instead, or navigate to a Coming Soon screen.

---

## What Counts as a Bug

A file claims to be at Phase 2 but has any of:
- A nav link that uses `onclick="alert(...)"` instead of navigating
- A back link pointing to the wrong screen
- An interactive element that does nothing
- A background that fails to load when the file is opened directly

Bugs must be fixed before the screen can be confirmed at Phase 2.

---

## Doc Ownership

| Doc | Owner | Update trigger |
|-----|-------|---------------|
| `PRODUCT_MAP.md` | Root authority | Section state changes; new sections added |
| `STANDARDS.md` | This file | Build criteria evolve (rare) |
| `WORKFLOW.md` | Active sprint | Updated each working session |
| `STATUS.md` | Live state | Updated when sprint completes or focus shifts |
| `nendo/ARCHITECTURE.md` | Nendō section | Screen added, spec changes, bug fixed |
| `[section]/CONCEPT.md` | Each section | Spec evolves during Defined → Phase 1 |
