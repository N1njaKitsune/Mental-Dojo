# Nendō Student Profile — Avatar & Aura Roadmap
### From Prototype to Polished: `StudentProfile_v4.0.html` → Production

**Project:** Ninja Learning App · Student Section
**Document version:** 1.0 — 2026-03-30
**Baseline file:** `student/prototypes/StudentProfile_v4.0.html`
**Aura engine:** Complete and stable (v3.9 canvas system — do not refactor without cause)
**Avatar baseline:** `AvatarMale_v1.1.html`, `AvatarFemale_v1.0.html` (SVG inline, viewBox 0 0 130 285)

---

## Architectural Decisions — Resolve These First

Before any stage begins in earnest, the team must make four irreversible or high-cost-to-reverse decisions. Getting these wrong means rebuilding later.

**Decision 1 — Avatar fidelity approach**
The choice between staying in SVG, moving to layered PNGs/WebP sprites, or using hand-drawn raster art shapes every downstream stage. The recommendation is **layered PNG sprites** (see Stage 1). Decide this before building any customisation system.

**Decision 2 — Target framework**
The single-HTML prototype cannot scale to a full app. The team must decide: React Native (recommended — see Stage 7), React web in a WebView wrapper, or native Swift/Kotlin. This affects how the avatar, aura canvas, and data layer are structured. Decide before Stage 4 UI chrome work begins.

**Decision 3 — Student data ownership**
Does the profile screen own its data (fetch on mount), or does a parent shell push data down as props/state? This is critical for the Nendō ↔ Student Profile integration referenced in `WORKFLOW.md`. Decide before Stage 3.

**Decision 4 — Customisation scope**
What is locked (rank-gated) versus freely personalised? Locking this down before building Stage 5 prevents the customisation system from growing beyond its intended scope during implementation.

---

## Recommended Build Order

```
Stage 1 (Avatar Quality) ─┐
Stage 3 (Data Layer)      ├──► Stage 4 (UI Chrome) ──► Stage 5 (Customisation)
Stage 2 (Aura Refinement) ─┘
                                         │
Stage 6 (Animation Polish) ◄─────────────┘
                                         │
Stage 7 (Architecture) ◄─── runs in parallel from Stage 4 onward
```

**Why this order:**
Stages 1, 2, and 3 are parallel workstreams that can be tackled simultaneously by different team members. They converge at Stage 4, which needs real character art, real silhouettes, and real data to build the UI chrome meaningfully. Stages 5 and 6 depend on Stage 4 being stable. Stage 7 (the framework migration) should be planned during Stage 4 so the chrome is built in the target architecture from the start — not retrofitted.

---

## Stage 1 — Avatar Quality Upgrade

**Goal:** Replace SVG-drawn starter characters with genuinely anime-authentic, high-quality art that holds up on Retina displays.

### Recommended Path: Layered PNG Sprite Sheets

**Why not push SVG further?**
SVG excels at precision geometry and scales infinitely — but anime character illustration relies on variable stroke weight, subtle linework texture, painterly shadow fills, and nuanced hair rendering. These require either enormous SVG complexity (hundreds of paths, gradients, masks) or visual compromises. For a team without a dedicated SVG illustrator, the effort-to-quality ratio is poor.

**Why not generative/AI art?**
Generative approaches produce inconsistent style across multiple characters and belt variants. The Ninja aesthetic requires tight visual control — every belt colour must read clearly, proportions must match the aura silhouette, and the two genders must feel like they belong in the same universe. AI art as a *reference* aid is useful; as the production asset pipeline it is not reliable at this stage.

**Recommended: Layered PNG character sprites**
Commission or produce characters as layered Photoshop/Procreate files, exported as transparent PNG layers at 2× and 3× resolution (for standard and Retina). The layer stack:

```
Layer 0: Shadow / ground contact shadow
Layer 1: Body base (skin)
Layer 2: Gi base colour (stage-appropriate colour variant)
Layer 3: Gi shading and linework
Layer 4: Belt (swapped per rank — 13 colour variants)
Layer 5: Belt stripe / marking (dan levels)
Layer 6: Hair base
Layer 7: Hair highlights and linework
Layer 8: Face (eyes, expression)
Layer 9: Accessories (headband, cheek bandage, etc.)
Layer 10: Overlay effects (sweat, glow on eyes at high XP)
```

This approach allows belt colour swapping (Stage 5) to be a single layer swap, not an SVG filter operation. Eye glow effects at high XP can be composited without touching the rest of the character. It is also the standard pipeline for mobile games targeting this aesthetic.

**Asset spec:**
- Canvas: 260×570px at 2× (maps to the 130×285 SVG viewBox), 390×855 at 3×
- Format: Transparent PNG per layer, or a single layered WEBP sprite sheet
- Two character bases: male (Yoi stance), female (Yoi stance)
- Gi variants: at minimum white (stages 0–3), coloured (stages 4–7), dark/premium (stages 8–11), black (stage 12)
- Belt variants: 13 separate belt layer PNGs (one per stage colour)

**Work items:**
1. Brief and commission a character illustrator (or produce in-house using Procreate/CSP) to the layer spec above
2. Define the art brief: proportions, stance reference, expression guide, line weight guide, colour palette for each stage gi
3. Export pipeline: Photoshop action or Procreate export script to batch-export at 2× and 3×
4. Integration: Replace inline SVG in `StudentProfile_v4.0.html` with `<div class="avatar-container">` using CSS positioned layers and `<img>` tags; animate-ready with CSS transforms

**Files created/updated:**
- `assets/avatars/male/` — layer PNGs (2× and 3× sets)
- `assets/avatars/female/` — layer PNGs
- `assets/avatars/belts/` — 13 belt layer PNGs per gender
- `StudentProfile_v5.0.html` — updated avatar integration

**Complexity:** L (art production is the bottleneck; integration is M once assets exist)

**Dependencies:** Decision 1 (avatar approach) must be locked. Art brief must be written before commissioning.

**Quick win (under 1 hour):**
In the current SVG, audit and refine the linework on both characters — thicken the primary contour strokes to 2.5px, add a subtle `filter: drop-shadow(0 2px 3px rgba(0,0,0,0.35))` to the SVG wrapper, and increase eye detail (add a specular highlight dot). This alone lifts the "starter" quality feel significantly without changing the art approach.

---

## Stage 2 — Aura Refinement

**Goal:** Make the aura feel character-specific, rank-appropriate, and more alive through custom silhouettes, stage behaviours, and belt-reactive effects.

### 2a — Custom SIL_BASE Silhouettes

The current aura uses a single 23-point placeholder path for both characters. The fix is to trace the actual character outlines and produce gender-specific paths.

**Work items:**
1. Open `AvatarMale_v1.1.html` in browser, screenshot at canvas resolution (99×219 canvas space as defined in `SIL_BASE` coordinate system)
2. Trace the male character outline in Figma or Illustrator — export as a simplified polygon (target 28–35 points for smooth dilation without excessive computation)
3. Convert the SVG path `d` attribute into the `SIL_BASE` array format: `[[x,y], [x,y]...]` in canvas coordinate space
4. Repeat for female character
5. In `StudentProfile_v4.0.html`, replace the single `SIL_BASE` const with `SIL_BASE_MALE` and `SIL_BASE_FEMALE`; update the gender toggle logic to swap the active path and trigger `rebuildAura()`

**Silhouette tracing guide:**
The canvas coordinate origin maps to the character's centre-of-mass at roughly CX=99, CY=219. The silhouette should hug the character's visible outline with ~6–8px padding in canvas space to ensure the innermost glow layer sits cleanly inside the body boundary.

### 2b — Stage-Specific Aura Behaviours

Currently all stages share the same animation parameters, differing only in colour. The refinement introduces **behaviour tiers** — the aura's personality should match the student's rank energy.

| Tier | Stages | Behaviour |
|------|--------|-----------|
| Novice | 0–2 (White, Yellow, Orange) | Slow, calm breathing. Single outer glow, low density. Feels quiet and gathered. Breathing speed 0.0010, amplitude 0.040 |
| Student | 3–5 (Green, Blue, Purple) | Medium rhythm. Two glow layers visible. Motes appear from stage 4. Speed 0.0015, amplitude 0.055 |
| Advanced | 6–8 (Red, Brown tiers) | Active pulse. Three layers, visible flicker. Motes regular, faster spawn. Speed 0.0018, amplitude 0.065 |
| Dan | 9–11 (Black belt dan tiers) | Dense, volatile. Rim lighting active. Colour bleed from adjacent stage. Speed 0.0020, amplitude 0.075 |
| Master | 12 | Maximum density from XP=0. Permanent low-level surge flutter. Corona ring always visible at reduced opacity. Breathing feels like pressure rather than calm. |

**Work items:**
1. Extract animation parameter constants into a `STAGE_BEHAVIOUR[]` lookup array indexed by stage
2. Update the main render loop to pull speed, amplitude, and mote spawn rate from `STAGE_BEHAVIOUR[currentStage]`
3. For Stage 12 (Master): add a permanent low-opacity corona ring that is separate from the surge corona; reduce its opacity to 0.35 at XP=0, scaling to full at XP=100
4. Add a `transitionBehaviour(fromStage, toStage, duration)` function that lerps between behaviour profiles during cinematic level-up — so the aura's personality shifts as well as its colour

### 2c — Belt-Reactive Effects

The SVG IDs `char-belt`, `char-belt-stripe`, `char-belt-tail-l`, `char-belt-tail-r` are already in both avatars. Wire them to the aura's colour and density state.

**Work items:**
1. Add a `updateBeltGlow(stage, density)` function that queries `#char-belt` and applies `filter: drop-shadow(0 0 ${4 + density * 12}px ${STAGE_COLOURS[stage]})` via inline style
2. At XP ≥ 80 (surge), add a secondary pulse: use a CSS `@keyframes beltPulse` on the belt elements that cycles between 0.9× and 1.0× opacity in sync with the surge oscillator period (approx 1.8s)
3. For Dan stages (9–11), add a thin stroke highlight to `char-belt-stripe` using the dan colour
4. During cinematic level-up phase 3 (stage switch), flash the belt elements with a 200ms white-to-new-colour transition

### 2d — Additional Aura Enhancements

**Floating kanji characters (optional, Stage 12 only):**
At Master tier, occasional single-character kanji (力, 気, 道, 心) could fade in from the mote positions at 8% opacity and drift upward. These would be canvas text renders, not DOM elements, to avoid layout impact. This is flavour — deprioritise if resources are tight.

**Turbulence layer (Stages 6+):**
Currently motes are the only non-uniform element. A very subtle Perlin-noise-displaced outline on the outermost glow layer (applying `ctx.filter` with a feTurbulence-equivalent approximation via pre-computed offsets) would make the aura boundary feel organic rather than mathematically smooth. Complexity: M.

**Files created/updated:**
- `StudentProfile_v4.1.html` (incremental: SIL_BASE fix + belt glow)
- `StudentProfile_v4.2.html` (stage behaviours + turbulence)

**Complexity:** 2a = M, 2b = M, 2c = S, 2d = M–L

**Dependencies:** 2a requires finalised character art dimensions. 2b and 2c are independent and can begin immediately.

**Quick win (under 1 hour):**
Implement `updateBeltGlow()` right now — it's a 15-line function that reads the existing SVG IDs and applies a CSS drop-shadow keyed to `STAGE_COLOURS[currentStage]`. The belt visibly responding to stage selection is a striking improvement that takes minutes.

---

## Stage 3 — Student Data Layer

**Goal:** Wire real student data into the profile screen so name, rank, XP, streak, and achievements drive the display.

### Minimal Data Structure

```json
{
  "studentId": "stu_abc123",
  "displayName": "Kai Tanaka",
  "avatarGender": "male",
  "dojo": "Westfield Dojo",
  "belt": {
    "stage": 4,
    "label": "Blue Belt",
    "xp": 67,
    "xpToNext": 100
  },
  "streak": {
    "currentDays": 14,
    "longestDays": 31
  },
  "stats": {
    "sessionsCompleted": 42,
    "nenScore": 78,
    "metsukePassed": true,
    "tachiLevel": 2
  },
  "achievements": [
    { "id": "first_kata", "label": "First Kata", "icon": "🥋", "earnedAt": "2026-01-15" },
    { "id": "streak_7", "label": "7-Day Streak", "icon": "🔥", "earnedAt": "2026-02-01" }
  ],
  "lastSession": "2026-03-29T16:30:00Z"
}
```

**Work items:**
1. Define the full data schema (above is the minimum — confirm with backend/instructor section what additional fields exist)
2. Create a `profileData.mock.json` file with 3–4 sample students at different stages (white belt beginner, blue belt mid-rank, black belt dan) for UI development
3. In the prototype HTML, replace the hardcoded stage/XP slider values with a `loadProfile(data)` function that sets all display elements from the data object
4. Write a `ProfileDataAdapter` — a thin transform layer between whatever shape the backend returns and the shape the UI expects. This decouples UI from API contract.
5. Add a `<script type="application/json" id="profile-data">` tag in the HTML as a dev-time data injection point (avoids needing a real server during prototyping)

**Nendō ↔ Student Profile data flow** (per `WORKFLOW.md` backlog item):
The Nendō session completion event should push `{ xpDelta, newStage, streakUpdate }` to the profile. In the prototype, simulate this with a `simulateSessionComplete(xpDelta)` function that triggers the cinematic level-up if a stage boundary is crossed.

**Files created/updated:**
- `data/profileData.mock.json`
- `StudentProfile_v4.0.html` — `loadProfile()` function added

**Complexity:** S (schema design) + S (mock data) + M (wiring into UI)

**Dependencies:** Decision 3 (data ownership model) should be resolved. Otherwise wire as "screen owns fetch" and refactor later.

**Quick win (under 1 hour):**
Replace the hardcoded `"Student Name"` text in the prototype with a live read from a JavaScript object literal at the top of the script. Add `displayName`, `belt.label`, and `belt.xp` — even as constants — so the screen feels personalised when demoed.

---

## Stage 4 — UI Chrome: The Full Profile Screen

**Goal:** Build the surrounding interface that frames the character + aura hero, creating a complete, navigable student profile screen.

### Layout Proposal

The screen is divided into three zones on iPhone (844×390 — note: landscape assumed as primary for this screen based on the frame switcher implementation):

```
┌─────────────────────────────────────────────────────┐
│  [◀ Back]          KAI TANAKA         [⚙ Settings]  │  ← Header bar (44px)
├────────────────────┬────────────────────────────────┤
│                    │  ╔══════════════════════════╗  │
│   CHARACTER +      │  ║  BLUE BELT  •  Stage 4   ║  │
│   AURA CANVAS      │  ╠══════════════════════════╣  │
│                    │  ║  XP ████████░░  67/100   ║  │
│   (hero, ~50%      │  ╠══════════════════════════╣  │
│    of screen       │  ║  🔥 14-day streak         ║  │
│    width)          │  ║  🎯 42 sessions           ║  │
│                    │  ║  ⚡ NEN Score: 78          ║  │
│                    │  ╠══════════════════════════╣  │
│                    │  ║  ACHIEVEMENTS             ║  │
│                    │  ║  [🥋] [🔥] [⭐] [+more]  ║  │
│                    │  ╚══════════════════════════╝  │
├────────────────────┴────────────────────────────────┤
│  [Profile]  [Training]  [Dojo]  [Challenges]  [NEN] │  ← Tab bar
└─────────────────────────────────────────────────────┘
```

On iPad (1194×834), the character hero expands to ~40% of screen width with the stats panel to the right and an additional "Recent Activity" feed below the achievements strip.

### Visual Hierarchy Principles

The character and aura are the emotional centre — they must never be visually competed with. All chrome elements should feel subordinate: lower contrast, less saturation, recessed. The student's name is the only text element that challenges the aura in visual weight, and only because it anchors identity.

**Belt rank display:** A horizontal pill element below the character with the belt colour as background, white text. At Dan stages, add a subtle gold border. This element should be positioned so it overlaps the base of the aura canvas slightly — as if the character is standing on it.

**XP bar:** Not a debug slider — a styled progress bar with the stage colour as fill, a subtle animated shimmer at the progress head, and a "+XP" particle burst animation triggered when XP increases. The numeric readout (`67 / 100 XP to Blue Belt 2`) appears below the bar in small, secondary text.

**Stats cluster:** Three to four key stats shown as icon + value pairs. Keep these terse — students don't need to see everything at once. The NEN Score is the most important stat and should be most prominent.

**Achievement strip:** Circular badge icons in a horizontal scroll. Earned badges are full colour; locked badges are greyscale silhouettes. Tapping an earned badge shows a brief overlay card with the achievement name, date earned, and a one-line flavour description.

**Navigation tab bar:** Five tabs, icon + label. The Profile tab is the current screen. Icons should be in the Ninja/martial arts visual language (not generic mobile UI icons).

**Work items:**
1. Design the full screen layout in Figma (or equivalent) — both iPhone and iPad breakpoints
2. Build the header bar (back navigation, student name, settings icon)
3. Build the belt rank pill and XP progress bar components (with shimmer animation)
4. Build the stats cluster component
5. Build the achievement badge strip (horizontal scroll, tap-to-expand)
6. Build the bottom tab navigation
7. Wire all components to `loadProfile(data)` from Stage 3
8. Ensure the aura canvas correctly z-indexes under the belt pill but above the background

**Files created/updated:**
- `StudentProfile_v5.0.html` (full UI chrome integration)
- `assets/icons/` — tab bar and stat icons

**Complexity:** L

**Dependencies:** Stage 3 (data layer) for meaningful content. Decision 2 (framework) — if migrating to React Native, build chrome components in the target framework directly.

**Quick win (under 1 hour):**
Add the belt rank pill element to `StudentProfile_v4.0.html` right now. It requires only a `<div>` with the stage colour as background (pull from `STAGE_COLOURS[currentStage]`), positioned at the base of the canvas, updated by the existing stage selector. Immediate improvement to the screen's completeness.

---

## Stage 5 — Customisation System

**Goal:** Give students meaningful personalisation that deepens ownership of their character without undermining the rank progression system.

### What Is Locked vs. Personalised

| Element | Lock Status | Rule |
|---------|-------------|------|
| Belt colour | **Locked — rank-gated** | Auto-matches stage. Students cannot choose belt colour. |
| Gi base colour | **Rank-gated** | White gi unlocked stages 0–3; coloured gi options unlock at stage 4+; dark gi at stage 7+. Students choose *within* their tier. |
| Hair style | **Freely personalised** | 4–6 options per gender, available immediately |
| Skin tone | **Freely personalised** | 6 tones, available immediately |
| Eye colour | **Freely personalised** | 6 options, available immediately |
| Accessories | **Achievement-gated** | Specific accessories unlock when achievements are earned (e.g., cheek bandage unlocks at "First Sparring Session") |
| Aura particle colour | **Rank-gated bonus** | At Dan stages, students may choose between 2–3 aura colour variants within their tier (e.g., "electric blue" vs "deep indigo" at stage 9) |
| Dojo patch (gi shoulder) | **Locked — assigned** | Set by dojo, not student |

### Architecture

Store customisation state in the student data object under a `customisation` key:

```json
"customisation": {
  "giVariant": "white",
  "hairStyle": "spiky",
  "skinTone": 3,
  "eyeColour": "brown",
  "accessories": ["cheek_bandage"],
  "auraVariant": null
}
```

The customisation screen is a separate modal/sheet — not inline on the profile. Access it via a small "edit" icon on the character. The modal presents the character in a stripped-down preview (no aura, lighter background) to make the costume choices legible.

With the layered PNG approach (Stage 1), customisation is implemented by swapping individual layer image sources. With SVG, it requires `fill` attribute updates and potentially additional path groups — functional but more coupled.

**Work items:**
1. Define the full locked/unlocked/achievement-gated table (above is a starting point — align with game design brief)
2. Build the customisation modal with character preview
3. Implement layer swapping logic for gi variant and belt (already straightforward with layered PNG approach)
4. Implement hair style, skin tone, and eye colour options
5. Implement the achievement-unlock gate for accessories
6. Persist customisation state to student profile data

**Files created/updated:**
- `StudentProfile_v5.1.html` (customisation modal + layer swap logic)
- `assets/avatars/` — additional layer variants per customisation option

**Complexity:** M (architecture + logic) + L (asset production for all variants)

**Dependencies:** Stage 1 (layered PNG approach) is strongly recommended before this stage. Building customisation on top of SVG is possible but painful.

**Quick win (under 1 hour):**
Add a skin tone CSS filter to the current SVG character. Six `filter: hue-rotate() saturate() brightness()` presets applied to the body fill group can approximate 6 skin tones without new art. Not production quality, but immediately demonstrates the concept in the prototype.

---

## Stage 6 — Animation Polish

**Goal:** Add entrance animations, idle micro-animations, and transition states that make the screen feel premium and alive without hurting performance on older iPads.

### Entrance Animation Sequence

When the profile screen loads, the elements should arrive in a choreographed sequence (total duration ~1200ms):

```
0ms      Background fades in
150ms    Character slides up from 20px below, fades in (ease-out, 400ms)
300ms    Aura canvas fades in and begins breathing (already supported)
550ms    Belt rank pill rises into position (ease-out spring, 250ms)
700ms    Student name fades in from left (200ms)
800ms    XP bar fills from 0 to current value (600ms ease-out)
900ms    Stats cluster cards cascade in (stagger: 80ms per item)
1100ms   Achievement badges pop in (scale 0.8→1.0, stagger 60ms each)
```

Implement using CSS `@keyframes` with `animation-delay` rather than JavaScript timers — more performant and composable.

### Idle Micro-Animations

The character itself (once layered PNGs replace the SVG) should have subtle life beyond the aura:

- **Blink cycle:** The eye layer fades out briefly (80ms) every 4–7 seconds (randomised interval). Implemented as a CSS animation on the eye layer `<img>` with a random `animation-delay` offset.
- **Breath shift:** The entire character container does a very subtle Y translate (+2px) on a 3.5s ease-in-out cycle, sync'd loosely to the aura breathing oscillator. This makes the character and aura feel like one breathing system.
- **Belt drift:** The belt tail layers (`char-belt-tail-l`, `char-belt-tail-r`) do a micro-rotation (±1.5°) on a slightly different phase from the breath cycle — suggesting fabric movement.
- **High-XP eye glow:** At XP ≥ 85, the eye overlay layer (an additive blend mode PNG with coloured irises) fades in to 40–60% opacity, giving the character an energised look.

### Transition States

- **XP gain event (from Nendō session):** The XP bar animates from old to new value with a particle burst at the progress head. If a stage boundary is crossed, the existing cinematic level-up fires.
- **Screen exit/enter:** The character contract-scales slightly (0.97×) as the screen transitions away, reinforcing it as a "card" being put away.
- **Achievement unlock:** A radial burst animation from the achievement strip, followed by the new badge scaling in with a gold shimmer.

### Performance Budget

Target: 60fps on iPhone 14 Pro, 30fps stable on iPad Air (2020). The aura canvas already auto-detects via `navigator.hardwareConcurrency` and degrades to `Q_STANDARD`. Apply the same principle to CSS animations: detect low-end devices and disable non-essential animations (blink, belt drift) via a `prefers-reduced-motion` media query and a manual `data-perf-tier` attribute set at runtime.

**Work items:**
1. Build the entrance animation CSS sequence
2. Implement blink cycle and breath shift on character layer container
3. Implement belt tail micro-rotation
4. Implement high-XP eye glow overlay logic
5. Build XP gain event animation
6. Build achievement unlock animation
7. Performance test on target device matrix; tune or disable as needed

**Files created/updated:**
- `StudentProfile_v5.2.html` (animation layer)
- `assets/css/animations.css` (if extracted)

**Complexity:** M (entrance + micro-animations) + L (full polish + performance tuning)

**Dependencies:** Stage 1 (layered PNG character) is needed for blink and breath layers. Stage 4 (UI chrome) needed for XP bar and achievement animations. Can begin entrance animations (Stage 6, item 1) immediately.

**Quick win (under 1 hour):**
Add the entrance animation CSS to `StudentProfile_v4.0.html` right now. A single `@keyframes fadeSlideUp` applied to the character SVG wrapper (`opacity: 0 → 1`, `transform: translateY(20px) → translateY(0)`, 400ms ease-out, 200ms delay) transforms the prototype from a static screen to something that feels like it loads with intention.

---

## Stage 7 — Technical Architecture

**Goal:** Define the target component architecture and migration path from single-HTML prototype to production codebase.

### Recommendation: React Native

**Why React Native over alternatives:**

- **iPad + iPhone first-class support** — React Native's iOS target is production-grade. The app's primary devices (iPhone 14 Pro, iPad Pro 11") are well-supported.
- **Canvas performance** — The aura system uses an HTML Canvas heavily. React Native's `react-native-canvas` or, better, `react-native-skia` (GPU-accelerated) can run the aura rendering at full 60fps, outperforming a WebView wrapper on older devices.
- **Shared codebase with web** — If a web version of the student profile is ever needed (browser access at school), React Native Web allows significant code sharing.
- **Ecosystem** — Reanimated 3 for gesture-driven and physics animations (belt drift, spring-back level-up), React Navigation for tab structure, Async Storage for local profile caching.

**Against React web in WebView:** WKWebView adds a render layer. Canvas animations in a WebView on older iPads underperform native. Avoid.

**Against native Swift/Kotlin:** Small-team development cost is too high. Two codebases (iOS + Android) with no shared logic. Not recommended unless the team has dedicated iOS engineers.

### Component Architecture

```
<App>
  <NavigationContainer>
    <TabNavigator>
      <StudentProfileScreen>          ← owns data fetch / state
        <ProfileHeader />             ← name, settings, back nav
        <AuraCanvas />                ← canvas aura system (Skia renderer)
        <AvatarCharacter>             ← layered image stack
          <AvatarLayer name="body" />
          <AvatarLayer name="gi" />
          <AvatarLayer name="belt" />
          <AvatarLayer name="hair" />
          <AvatarLayer name="eyes" />
          <AvatarLayer name="accessories" />
        </AvatarCharacter>
        <BeltRankPill />              ← stage colour, label
        <XPProgressBar />             ← animated, shimmer
        <StatsCluster />              ← 3–4 key stats
        <AchievementStrip />          ← horizontal scroll badges
      </StudentProfileScreen>
      <TrainingScreen />
      <DojoScreen />
      <ChallengesScreen />
      <NENScreen />
    </TabNavigator>
  </NavigationContainer>
</App>
```

### Migration Path

The prototype HTML file is a **specification**, not a foundation to build on. The migration is a rewrite using the prototype as a visual reference, not a refactor:

1. Set up React Native project with Expo (fastest iOS dev cycle for a small team)
2. Port the aura canvas system to react-native-skia — Skia's path dilation and blur operations map closely to the existing canvas operations
3. Build `AvatarCharacter` component with layered image stack
4. Build `BeltRankPill` and `XPProgressBar`
5. Wire `StudentProfileScreen` to the data layer (REST API or local mock)
6. Port entrance animations to Reanimated 3
7. Build remaining screens (Training, Dojo, etc.) — out of scope for this roadmap

**When to migrate:**
Begin the Expo project setup during Stage 4 so the UI chrome is built in the target framework from the start. The prototype HTML files remain useful as pixel-reference during component development.

**Files created/updated:**
- New repository: `NinjaApp-mobile/` (React Native / Expo project)
- `NinjaApp-mobile/src/screens/StudentProfileScreen.tsx`
- `NinjaApp-mobile/src/components/AuraCanvas.tsx`
- `NinjaApp-mobile/src/components/AvatarCharacter.tsx`
- `NinjaApp-mobile/src/components/BeltRankPill.tsx`
- `NinjaApp-mobile/src/components/XPProgressBar.tsx`
- `NinjaApp-mobile/src/components/AchievementStrip.tsx`

**Complexity:** L

**Dependencies:** Decisions 1 and 2 must be finalised. Stage 4 chrome design should be in progress to inform component boundaries.

**Quick win (under 1 hour):**
Set up an Expo project with the bare minimum: a single screen, the device frame dimensions configured, and the student name + belt rank displayed as styled text against a black background. This establishes the development environment and confirms the team can build and run on device before any complex work begins.

---

## Summary Table

| Stage | Name | Complexity | Depends On | Quick Win |
|-------|------|------------|------------|-----------|
| 1 | Avatar Quality Upgrade | L | Decision 1, art brief | Refine SVG linework + drop-shadow filter |
| 2a | Custom SIL_BASE Silhouettes | M | Finalised character art | — |
| 2b | Stage Behaviour Tiers | M | None | — |
| 2c | Belt-Reactive Effects | S | None | Add `updateBeltGlow()` |
| 3 | Student Data Layer | M | Decision 3 | Wire name/belt/XP from JS object |
| 4 | UI Chrome | L | Stages 2c, 3 | Add belt rank pill |
| 5 | Customisation System | M+L | Stage 1 | Skin tone CSS filter on SVG |
| 6 | Animation Polish | M+L | Stages 1, 4 | Entrance fade-slide animation |
| 7 | Technical Architecture | L | Decisions 1, 2 | Expo project setup |

---

## Immediate Next Actions (This Session)

If you want to make the prototype noticeably better before the next planning meeting, do these four things in order — each takes under an hour:

1. **Belt glow** — Add `updateBeltGlow()` keyed to `STAGE_COLOURS`. Wires the belt SVG elements to the aura system visually. (~20 mins)
2. **Entrance animation** — Add `@keyframes fadeSlideUp` to the character wrapper. The screen stops feeling static. (~15 mins)
3. **Data object** — Replace hardcoded text with a `const PROFILE = {...}` object at the top of the script. Now it's demo-able with real student names. (~20 mins)
4. **Belt rank pill** — Add the rank pill div at the canvas base, coloured from `STAGE_COLOURS[currentStage]`. The screen gains a real UI element. (~25 mins)

Total: under 90 minutes of work, but the prototype will look like it has jumped two stages forward.

---

*Document maintained in: `student/prototypes/ROADMAP_AvatarAura_v1.0.md`*
*Aura engine reference: `StudentProfile_v3.9.html` (stable — do not modify without versioning)*
*Current integration file: `StudentProfile_v4.0.html`*
