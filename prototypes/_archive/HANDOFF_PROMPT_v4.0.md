# Nendo Student Profile — Handoff Prompt for New Thread
## "From Prototype to Polished: Avatar & Aura Roadmap"

---

## WHO YOU ARE WORKING WITH

This is the Ninja Learning project (Ninjaschool). We are building a student-facing app called **Nendo**. The central screen is a **Student Profile page** — a gamified, anime-inspired character + energy aura that represents a student's martial arts rank and XP progress. Think: a living, breathing character card.

---

## WHAT HAS ALREADY BEEN BUILT

### Files live at:
`student/prototypes/` inside the Ninja App workspace folder.

### Aura System — `StudentProfile_v3.9.html` (latest aura-only prototype)
A fully working canvas-based aura/glow system built over 9 steps:

- **Canvas silhouette dilation** — 23-point `SIL_BASE` path (CX=99, CY=219 in canvas coords), 5 glow layers drawn with `ctx.filter = blur()`
- **13 stage colours** (white belt → black belt tiers), XP 0–100 slider, live density formula: `stageIndex===0 ? 0.15+raw*0.85 : 0.25+raw*0.75` where `raw = 1 - Math.pow(1 - xp/100, 2)`
- **Breathing animation** — per-layer sine noise, speed 0.0015 normal / 0.0024 surge, amplitude 0.055+density×0.10
- **Surge mode** (XP ≥ 80) — volatile jitter oscillator, corona ring (scale 1.62, blur 58), fast pulse
- **Colour bleed** (XP ≥ 90) — next-stage colour bleeds in at 13% opacity
- **Mote particle system** — pool of 18 MAX_MOTES, spawn from outline, opacity envelope, radial gradient halo
- **Rim lighting** (stages 8–11) — two-pass stroke (glow + sharp), brightened colour channels
- **Cinematic level-up** — 4-phase 1400ms transition: contract → burst flash → stage switch → spring-back with dampened sine
- **Performance tiers** — Q_REDUCED (static), Q_STANDARD (30fps, 12 motes), Q_ENHANCED (60fps DPR-scaled, 24 motes), auto-detected from `navigator.hardwareConcurrency`

### Avatars
- **`AvatarMale_v1.1.html`** — Anime 11-year-old male in Yoi/ready stance. White gi, green belt, spiky dark hair, brown eyes, bandage on cheek. Drawn in SVG (viewBox 0 0 130 285) with gi chest volume, sleeve cuffs, knee creases, shoulder deltoid highlights, hair streaks.
- **`AvatarFemale_v1.0.html`** — Anime 11-year-old female in Yoi stance. Dark navy gi, red belt, long straight black hair, dark blue eyes, headband with metal plate, sailor collar with red neckerchief, pleated hakama skirt with red side panel, dark tights.

### Integrated Prototype — `StudentProfile_v4.0.html` ← CURRENT FILE
- Male + female SVG avatars embedded inline, toggled by ♂/♀ buttons
- Full v3.9 aura system running over both characters
- iPhone (844×390) + iPad (1194×834) device frame previews
- 13-stage dot selector, XP slider, stage/density readout
- Gender switch restarts aura cleanly

### Known current limitations:
- `SIL_BASE` is a single placeholder path — not yet shaped to either character
- No student data, no real name/rank/stats wired in
- Both avatars are "starter quality" — SVG-drawn, approximate anatomy
- No sound, no haptics hook, no backend
- Single HTML file (no component architecture yet)
- No avatar customisation — locked outfits, no skin tone choice

---

## THE VISION

The finished student profile should feel like **opening a premium trading card that's alive**. When a student opens their profile:
- Their character breathes gently, the aura pulses with their rank energy
- Surging XP makes the aura volatile and exciting
- Levelling up is a cinematic moment
- The character looks and feels like *them* — their gender, their belt, their stage

The aesthetic is anime × martial arts × premium mobile game (think early Naruto + Fire Emblem Heroes quality UI).

---

## YOUR TASK FOR THIS THREAD

Please generate a **staged UI/UX + technical roadmap** that takes `StudentProfile_v4.0.html` from its current prototype state to a polished, production-ready screen.

Structure the roadmap as clearly numbered **stages**, each with:
- A stage name and one-line goal
- The specific work items within it (what gets built/changed)
- Which file(s) get created or updated
- Estimated complexity (S / M / L)
- Dependencies (what must be done first)

### The roadmap should cover at minimum these areas:

#### 1. Avatar Quality Upgrade
How do we get from SVG-drawn starter avatars to something genuinely high-quality and anime-authentic? Consider: Should we stay in SVG (and push it further), move to hand-drawn assets, use a layered sprite approach, or explore generative options? Recommend the best path for a small team.

#### 2. Aura Refinement
- Custom `SIL_BASE` silhouettes shaped to actual male + female character outlines
- Stage-specific aura *behaviours* (not just colour — e.g., early stages feel calm, later stages feel dangerous)
- Belt-reactive effects (the belt element in the SVG should glow or pulse in its rank colour)
- Any missing aura features that would make it feel more alive

#### 3. Student Data Layer
How does real student data (name, belt rank, XP, streak, dojo, achievements) get wired into this screen? What's the minimal data structure needed?

#### 4. UI Chrome — the full profile screen
The aura + character is the *hero*, but the screen needs surrounding UI:
- Student name + belt rank display
- XP bar (not just a debug slider)
- Achievement badges / recent activity
- Navigation (to other parts of the app)
Propose the layout and visual hierarchy.

#### 5. Customisation System
Belt colour should auto-match stage. Propose a lightweight customisation layer — what can students personalise, what is locked to their rank, and how is it architected?

#### 6. Animation Polish
Beyond the aura: entrance animations, idle character micro-animations, transition states. What would make the screen feel premium without hurting performance?

#### 7. Technical Architecture
When should this move from a single `.html` prototype to a proper component structure? React? Vue? Native? What's the right call for a school app used on iPads and iPhones?

---

## CONSTRAINTS TO KEEP IN MIND

- Primary devices: **iPhone 14 Pro** and **iPad Pro 11"** (already implemented in the frame switcher)
- Students are **7–14 years old** — UI must be joyful, legible, not overwhelming
- Ninja/martial arts aesthetic is core — not generic gamification
- Performance matters — many school iPads are older devices
- The belt ID system (`char-belt`, `char-belt-stripe`, `char-belt-tail-l`, `char-belt-tail-r`) is already wired in the SVG and referenced by the aura system — preserve this

---

## OUTPUT FORMAT REQUESTED

Please return:
1. **The full staged roadmap** (as described above)
2. **A recommended build order** — which stages to tackle first and why
3. **One "quick win" item** from each stage that could be done in under an hour to make the prototype feel noticeably better immediately
4. **Any architectural decisions** the team should make before going further (e.g. "decide on avatar approach before building customisation")

---

*This project lives at: Ninja App / student / prototypes / StudentProfile_v4.0.html*
*The aura canvas system is complete and stable — no need to revisit it unless refinements are in scope.*
*The avatar SVGs are embedded inline — both 130×285 viewBox, overflow:visible.*
