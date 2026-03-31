# Achievements — Concept

**Last updated:** 2026-03-31
**Section state:** 🟣 Defined
**Parent:** `../PRODUCT_MAP.md`

---

## Purpose

Achievements are a way for students to keep track of the smaller wins — the ones that don't show up on a grading certificate but still matter. A student who has logged a 30-day streak deserves to see that acknowledged. A student who earned their first badge at a tournament deserves somewhere to display it.

The Achievements section is split into two worlds: real-world achievements (physical, earned outside the app) and in-app achievements (earned through using StudentNinja). Both live in the same badge catalogue so the student has one place to see everything.

Earned badges can unlock avatar accessories in the Student Profile — a direct visual reward for achievement.

---

## What the Student Sees

### Achievement Grid
- Full badge catalogue in a grid layout
- Earned badges: full colour, with name and earned date
- Unearned badges: greyed out silhouette with name only (or hidden, TBD)
- Category tabs: All / Real World / Nendō / Training / Techniques
- Total earned count + total available (e.g. "12 / 47 earned")

### Badge Detail (tap to expand)
- Badge icon (large)
- Badge name
- Description: what it means / what you did to earn it
- Earned date (if earned)
- Unlock description: what it unlocks (avatar accessory, if any)
- Hint: brief clue if not yet earned (e.g. "Complete 10 Nendō sessions")

---

## Badge Catalogue

### Real-World Badges
These are awarded by an instructor or imported from grading records. The student cannot self-award these.

| Badge | Trigger |
|-------|---------|
| First Class | Attended first class |
| Graded | Passed first grading |
| White Belt | Earned white belt |
| Yellow Belt | Earned yellow belt |
| Orange Belt | Earned orange belt |
| Green Belt | Earned green belt |
| Purple Belt | Earned purple belt |
| Blue Belt | Earned blue belt |
| Brown Belt | Earned brown belt |
| Black Belt | Earned black belt |
| Tournament Competitor | Entered first tournament |
| Tournament Medal | Won a medal at any tournament |
| Demo Team | Performed in a public demonstration |
| Instructor's Award | Awarded by instructor at discretion |
| Year of Service | 1 year of continuous membership |
| Three Years | 3 years of continuous membership |

### Nendō Badges
Earned through the Nendō section.

| Badge | Trigger |
|-------|---------|
| First Breath | Completed first Nendō session |
| Wind Walker | Completed all 3 Kaze techniques |
| Earth Steady | Completed all 3 Chi techniques |
| Water Flowing | Completed all 3 Mizu techniques |
| Fire Spark | Completed all 3 Hi techniques |
| Four Elements | Completed at least one session in all 4 elements |
| Scattered to Still | Entered Shiho as Scattered, completed session |
| Turbulent to Calm | Entered Shiho as Turbulent, completed session |
| Mindful Month | 30 Nendō sessions logged |
| Hundred Sessions | 100 Nendō sessions logged |

### Training Badges
Earned through the Training section.

| Badge | Trigger |
|-------|---------|
| First Log | Logged first daily check-in |
| Challenge Complete | Completed first weekly challenge |
| Week Streak | Maintained a 7-day streak |
| Month Streak | Maintained a 30-day streak |
| Hundred Days | Maintained a 100-day streak |
| Streak Saver | Used first streak freeze token |
| Grade Finisher | Completed all challenges in one grade bracket |
| Cross-Section | Completed a Training challenge and a Nendō session on the same day |

### Techniques Badges
Earned through the Techniques section.

| Badge | Trigger |
|-------|---------|
| First Watch | Watched first technique video |
| Starter Set | Watched all Starter grade techniques |
| Foundation Set | Watched all Foundation grade techniques |
| Developing Set | Watched all Developing grade techniques |
| Advanced Set | Watched all Advanced grade techniques |
| Excellence Set | Watched all Excellence grade techniques |
| Technique Explorer | Watched at least one technique in every category |

---

## Avatar Accessory Unlocks

Certain badges unlock cosmetic accessories for the Student Profile SVG avatar. Accessories are purely visual — they don't affect XP or progression.

| Badge | Unlocks |
|-------|---------|
| First Breath | Glow ring (subtle, Mushin green) around avatar |
| Four Elements | Elemental particle effect on Student Profile |
| Month Streak | Bronze training band on wrist |
| Hundred Days | Gold training band on wrist |
| Black Belt | Black belt variant replaces current belt on SVG |
| Instructor's Award | Sensei crest on gi lapel |
| Tournament Medal | Medal ribbon visible on gi |

Full avatar accessory spec to be defined in `nendo/ARCHITECTURE.md` §1 when Student Profile moves to its own section doc.

---

## Signal Sources

How does the app know a badge has been earned?

| Signal type | How it fires |
|-------------|-------------|
| Session Complete | Nendō Runner auto-navigates to Session Complete — fires badge check on arrival |
| Daily check-in | Logged in Training — fires badge check on tap |
| Weekly challenge | Marked complete in Training — fires badge check |
| First watch | Technique detail screen opened — fires badge check on video load |
| Belt grade change | Student Profile belt switcher updated — fires badge check |
| Instructor award | Set via instructor dashboard — pushed to student profile (cross-section) |

For prototype purposes, badge unlock can be simulated by tapping a badge in the grid to toggle its earned state. Live data connections are a Phase 3 concern.

---

## Data Dependencies

| Data | Source | Notes |
|------|--------|-------|
| Student grade | Student Profile | For belt badges |
| Session count | Nendō (Session Complete events) | For Nendō badges |
| Streak data | Training | For streak badges |
| Watch history | Techniques | For technique badges |
| Instructor awards | Instructor dashboard | Cross-section; see `_SHARED/integration/` |
| Badge earned state | Device / server | Must persist |

---

## Prerequisites for Phase 1

Before any code starts:

- [ ] Badge grid visual design approved — how do earned vs unearned look?
- [ ] Badge icon style confirmed — illustrated, symbolic, or text-based?
- [ ] Category tab design approved
- [ ] At least 10 badge icons created or sourced (sample set for prototype)
- [ ] Avatar accessory unlock list confirmed (which badges unlock what)
- [ ] Decision: are unearned badges visible as silhouettes, or hidden until earned?

---

## Open Questions

- Are unearned badges visible (shown greyed) or hidden until earned?
- Do badges have rarity tiers (common / rare / legendary)?
- Can badges be shared externally (social media, parent notification)?
- Is there a leaderboard comparing badges between students in the same class?
- Does the instructor see the student's badge count in their dashboard?
