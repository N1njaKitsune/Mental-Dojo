# StudentNinja — Workflow

**Last updated:** 2026-03-31

---

## Sprint Status: Doc Restructure Complete ✅

All 12 Nendō screens built and self-contained. Documentation architecture rebuilt. Two code bugs fixed.

---

## Build Status — All Sections

| Section | State | Doc |
|---------|-------|-----|
| Student Profile | 🔵 Phase 2 | See `nendo/ARCHITECTURE.md` §1 (interim) |
| Nendō | 🔵 Phase 2 | `nendo/ARCHITECTURE.md` |
| Training | 🟣 Defined | `training/CONCEPT.md` |
| Techniques | 🟣 Defined | `techniques/CONCEPT.md` |
| Achievements | 🟣 Defined | `achievements/CONCEPT.md` |

---

## Nendō Screen Status

| # | Screen | File | State |
|---|--------|------|-------|
| 1 | Student Profile | `StudentProfile_v4.1.html` | 🔵 |
| 2 | Nendo Home | `Nendo_Home_v4.0.html` | 🔵 |
| 3 | Metsuke Hub | `Nendo_MetsukeHub_v4.0.html` | 🔵 |
| 4 | Mushin Hub | `Nendo_MushinHub_v4.0.html` | 🔵 |
| 5 | Tachi Hub | `Nendo_TachiHub_v4.0.html` | 🔵 |
| 6 | Shiho | `Nendo_Shiho_v4.0.html` | 🔵 |
| 7 | Breath Techniques | `Nendo_BreathTechniques_v4.0.html` | 🔵 |
| 8 | Runner — Kaze | `Nendo_Runner_Kaze_v4.0.html` | 🔵 |
| 9 | Runner — Chi | `Nendo_Runner_Chi_v4.0.html` | 🔵 |
| 10 | Runner — Mizu | `Nendo_Runner_Mizu_v4.0.html` | 🔵 |
| 11 | Runner — Hi | `Nendo_Runner_Hi_v4.0.html` | 🔵 |
| 12 | Session Complete | `Nendo_SessionComplete_v4.0.html` | 🔵 |

---

## Up Next

| Priority | Task |
|----------|------|
| 🔴 High | Live testing pass — open each screen in browser, check visuals + nav |
| 🔴 High | Update `StudentNinja_ScreenIndex_v1.0.html` to v4.0 links |
| 🟡 Medium | Git push from master project (`git subtree push --prefix=student origin StudentNinja`) |
| 🟡 Medium | Nendō ↔ Student Profile data flow spec (`_SHARED/integration/`) |
| 🟡 Medium | Student Profile section doc — move Profile spec out of nendo/ARCHITECTURE.md into its own `profile/` subfolder |
| 🟡 Medium | Wire remaining Nendō screens to `aura.js` when aura is added to them |
| 🟢 Low | Commission brief for layered PNG sprites |
| 🟢 Low | Aura progression logic — connect XP earned in Session Complete to Profile aura stage |
| 🟢 Low | Training Phase 1 — complete prerequisites checklist before starting |
| 🟢 Low | Achievements Phase 1 — badge icon set needed before starting |

---

## Working Notes

### Doc structure (new — 2026-03-31)
- `PRODUCT_MAP.md` — root authority, all 5 sections, all states
- `STANDARDS.md` — what each build state requires
- `nendo/ARCHITECTURE.md` — full Nendō screen spec
- `training/CONCEPT.md` — Training spec and prerequisites
- `techniques/CONCEPT.md` — Techniques spec and prerequisites
- `achievements/CONCEPT.md` — Achievement catalogue and spec
- `ARCHITECTURE.md` — redirect stub pointing to new locations

### File conventions
- **Canonical profile:** `StudentProfile_v4.1.html` — Safari-safe, full aura canvas, SVG avatars, belt switcher
- **Naming pattern:** `Nendo_[ScreenName]_v4.0.html`
- **Device frame:** 844 × 390px landscape iPhone · class `.frame.iphone`
- **Prototypes:** stay flat in `prototypes/` — no subfolders until Training/Techniques builds begin

### Asset conventions
- **All backgrounds embedded as base64 data URIs** — files load with no external dependencies
- **WebP versions used** — original PNG backups remain in `assets/backgrounds/` for reference
- **Nendo Home uses environment layers** — `L0-sky.webp` (sky) + `L3-dojo-frame.webp` (arch overlay)
- **Paper texture (L6-paper-texture.jpg)** — too large to embed (14MB base64). Removed from all v4.0 files.

### IP Asset — `assets/js/aura.js`
- **NinjaAura engine v1.0** — standalone ki-energy aura system, redeployable on any NinjaApp screen
- IIFE-wrapped, exposes `window.NinjaAura` public API only — no internal leakage
- Safari-compatible: pixel-level `ctx.filter` detection + `shadowBlur`/`shadowOffsetX` fallback
- Public API: `init()`, `start()`, `setQuality()`, `triggerLevelUp()`, `resize()`, `STAGES`, `auraDensity()`
- Callback system: `onSurge`, `onLevelUpStart`, `onLevelUpStage`, `onLevelUpEnd`
- `StudentProfile_v4.1.html` is the reference integration — inline engine removed, now loads via `<script src="../assets/js/aura.js">`

### Known nav decisions
- **Runners back nav:** All 4 Runners link `← Techniques` to `Nendo_BreathTechniques_v4.0.html`. This is intentional — runners can be reached from either Shiho or Breath Techniques, but the Breath Techniques screen is the stable entry point. The Shiho entry path passes through Breath Techniques context anyway. If context-aware back nav is needed later, pass an `origin` query parameter.
- **StudentProfile Nendō pill:** Fixed — now navigates directly to `Nendo_Home_v4.0.html`
- **StudentProfile Training/Techniques/Achievements pills:** Remain as `pointer-events: none` (not alert) — sections not yet built

### Navigation map
```
StudentProfile_v4.1
  └── Nendo_Home_v4.0
        ├── Nendo_MetsukeHub_v4.0  (locked — back only)
        ├── Nendo_MushinHub_v4.0
        │     ├── Nendo_Shiho_v4.0
        │     │     └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
        │     │           └── Nendo_SessionComplete_v4.0
        │     │                 └── (back to Mushin Hub)
        │     └── Nendo_BreathTechniques_v4.0
        │           └── Nendo_Runner_[Kaze|Chi|Mizu|Hi]_v4.0
        │                 └── Nendo_SessionComplete_v4.0
        └── Nendo_TachiHub_v4.0   (locked — back only)
```

### Colour reference
Metsuke: `rgba(141, 184, 212, x)` — cool blue
Mushin: `rgba(122, 184, 154, x)` — green
Tachi: `rgba(212, 130, 106, x)` — warm red/orange
Kaze: `rgba(140, 200, 185, x)` — teal-green
Chi: `rgba(190, 165, 110, x)` — amber
Mizu: `rgba(110, 160, 210, x)` — blue
Hi: `rgba(215, 130, 100, x)` — orange-red

---

## How to Push to StudentNinja Public Repo
> ⚠️ Git operations handled from master project only — not this workspace.
> ```
> git subtree push --prefix=student origin StudentNinja
> ```
