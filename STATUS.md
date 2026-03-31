# StudentNinja — Status

**Last updated:** 2026-03-31
**Stage:** Stage 2 — Nendō (Active)
**Public repo:** https://github.com/N1njaKitsune/StudentNinja

---

## Current Focus
All 12 Nendō screens built and self-contained. Documentation architecture rebuilt. Aura engine extracted to `assets/js/aura.js` as reusable IP asset. `StudentProfile_v4.1.html` now loads aura via `<script src>` — no inline engine code. Ready for live testing pass.

## Blockers
- None

---

## Recently Completed (2026-03-31)

### Aura engine extracted to `assets/js/aura.js`
Inline aura engine (~800 lines) removed from `StudentProfile_v4.1.html` and extracted into a standalone, reusable file.

| Item | Detail |
|------|--------|
| File | `assets/js/aura.js` — NinjaAura engine v1.0 |
| API | `NinjaAura.init()`, `.start()`, `.setQuality()`, `.triggerLevelUp()`, `.resize()`, `.STAGES`, `.auraDensity()` |
| Safari fix | Pixel-level `ctx.filter` detection + `shadowBlur`/`shadowOffsetX` fallback (baked in) |
| Callbacks | `onSurge`, `onLevelUpStart`, `onLevelUpStage`, `onLevelUpEnd` |
| Profile | `StudentProfile_v4.1.html` updated — engine loads via `<script src="../assets/js/aura.js">` |
| Backup | `prototypes/_backups/StudentProfile_v4.1_2026-03-31_AuraExtract.html` |



### Doc architecture rebuild
New documentation structure brings the full student section into one coherent system.

| Doc | Purpose |
|-----|---------|
| `PRODUCT_MAP.md` | Root authority — all 5 sections, build states, nav map |
| `STANDARDS.md` | What each of the 5 build states requires to qualify |
| `nendo/ARCHITECTURE.md` | Full Nendō screen spec (moved from root) |
| `training/CONCEPT.md` | Training spec — challenges, streaks, XP, prerequisites |
| `techniques/CONCEPT.md` | Techniques spec — video library, grade filter, prerequisites |
| `achievements/CONCEPT.md` | Achievement catalogue — 40+ badges, signal sources, accessory unlocks |

### Bug fixes
| Bug | Fix |
|-----|-----|
| StudentProfile Nendō nav pill used `alert()` instead of navigating | Changed to `href="Nendo_Home_v4.0.html"` |
| Runner back nav labelled "← Techniques" but runners can be entered from Shiho | Documented as intentional decision — Breath Techniques is the canonical entry point; see WORKFLOW.md |

### Full 12-screen rebuild — v4.0 series (earlier this sprint)
Every Nendō screen rebuilt as a clean, standalone HTML file with embedded base64 backgrounds.

| # | Screen | File | Notes |
|---|--------|------|-------|
| 1 | Student Profile | `StudentProfile_v4.1.html` | Safari-safe, full aura canvas, SVG avatar |
| 2 | Nendo Home | `Nendo_Home_v4.0.html` | Composited env layers (sky + dojo frame) |
| 3 | Metsuke Hub | `Nendo_MetsukeHub_v4.0.html` | All 4 cards locked + Coming Soon |
| 4 | Mushin Hub | `Nendo_MushinHub_v4.0.html` | Mandala, 2 forward buttons |
| 5 | Tachi Hub | `Nendo_TachiHub_v4.0.html` | All 4 cards locked + Coming Soon |
| 6 | Shiho | `Nendo_Shiho_v4.0.html` | 2-phase: check-in → session build |
| 7 | Breath Techniques | `Nendo_BreathTechniques_v4.0.html` | 4 element cards |
| 8 | Runner — Kaze | `Nendo_Runner_Kaze_v4.0.html` | 3-col layout, breathing circle functional |
| 9 | Runner — Chi | `Nendo_Runner_Chi_v4.0.html` | 3-col layout, breathing circle functional |
| 10 | Runner — Mizu | `Nendo_Runner_Mizu_v4.0.html` | 3-col layout, breathing circle functional |
| 11 | Runner — Hi | `Nendo_Runner_Hi_v4.0.html` | 3-col layout, breathing circle functional |
| 12 | Session Complete | `Nendo_SessionComplete_v4.0.html` | XP counter, aura orb, quote, return button |

### Asset work
- `bg-metsuke-hub.png` (2.2MB) → `bg-metsuke-hub.webp` (271KB) — 88% size reduction
- `bg-tachi-hub.png` (1.9MB) → `bg-tachi-hub.webp` (226KB) — 88% size reduction
- `L0-sky.jpg` (2MB) → `L0-sky.webp` (192KB)
- `L3-dojo-frame.png` (444KB) → `L3-dojo-frame.webp` (45KB)
- All backgrounds embedded as base64 data URIs in their respective HTML files

---

## Section States

| Section | State |
|---------|-------|
| Student Profile | 🔵 Phase 2 — Prototype Ready |
| Nendō | 🔵 Phase 2 — Prototype Ready |
| Training | 🟣 Defined |
| Techniques | 🟣 Defined |
| Achievements | 🟣 Defined |

Full state definitions: `STANDARDS.md`

---

## Next Up
- Live testing pass — check all 12 screens in browser, note visual or nav issues
- ScreenIndex update — wire `StudentNinja_ScreenIndex_v1.0.html` to v4.0 filenames
- Git push from master project once testing confirms all screens clean
- Nendō ↔ Student Profile data flow spec (`_SHARED/integration/`)
