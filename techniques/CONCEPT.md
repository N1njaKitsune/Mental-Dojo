# Techniques — Concept

**Last updated:** 2026-03-31
**Section state:** 🟣 Defined
**Parent:** `../PRODUCT_MAP.md`

---

## Purpose

Techniques is a video library for studying martial arts techniques outside of class. Students watch short, focused videos of the techniques they are learning and using in their actual training sessions. This is reference material — not instruction from scratch, but a visual reminder and study aid for students who already know the technique from class and want to reinforce it.

Techniques is entirely separate from Nendō. Nendō is about mindset and breath. Techniques is about physical practice.

---

## What the Student Sees

### Techniques Library
- Grid of technique cards
- Each card: technique name, kanji/Japanese term, grade level badge, thumbnail
- Filtered by student's current grade — students only see techniques at or below their rank
- Search bar to find a technique by name
- Category filter: Strikes / Kicks / Blocks / Throws / Stances / Combinations

### Technique Detail Screen
- Video player (portrait or landscape)
- Technique name + Japanese term
- Grade level: which belt rank this technique is introduced
- Short description: one or two sentences on the purpose of the technique
- Key points: 3–5 bullet cues (what to focus on)
- Related techniques: 2–3 linked cards

### Grade Lock
- Techniques above the student's current grade appear as locked cards in the grid
- Locked card: greyed out, belt rank shown, no tap interaction
- Unlocked automatically when student grade updates in Student Profile

---

## Content Structure

Techniques are organised by category and grade:

**Categories:**
- Strikes (punches, chops, palm strikes)
- Kicks (front kick, side kick, roundhouse, etc.)
- Blocks (inside block, outside block, rising block, etc.)
- Throws / Takedowns
- Stances (fighting stance, horse stance, etc.)
- Combinations (multi-technique sequences)

**Grade levels** mirror the Training bracket system:
| Belt Range | Label |
|-----------|-------|
| White → Yellow | Starter |
| Orange → Green | Foundation |
| Purple → Blue | Developing |
| Brown | Advanced |
| Black | Excellence |

Each technique is tagged to the grade it's first introduced at. Students see everything up to and including their current grade.

---

## Video Spec

- Short-form: 30 seconds to 2 minutes per technique
- Filmed in dojo setting, consistent framing
- Side view + front view where applicable
- No narration required — visual demonstration only
- Format: MP4, hosted externally (CDN or video platform); not embedded in the HTML prototype
- In prototype: video thumbnails are static images; tapping plays a placeholder

---

## XP and Achievements

Techniques does not award XP directly — it's a reference tool, not a completion system. However:

- Watching a technique for the first time unlocks a minor badge in Achievements
- Watching all techniques for a grade level unlocks a grade completion badge

Full badge catalogue: `../achievements/CONCEPT.md`

---

## Data Dependencies

| Data | Source | Notes |
|------|--------|-------|
| Student grade | Student Profile | Read on load; determines grade filter |
| Technique catalogue | Content system | Defined by curriculum team; grade-tagged |
| Video files | CDN / video platform | Not embedded; loaded by URL |
| Watch history | Device / server | For first-watch badge unlock |

---

## Prerequisites for Phase 1

Before any code starts:

- [ ] Technique card visual design approved (one static design in `ui-specs/`)
- [ ] Grade lock card visual design approved
- [ ] Category filter visual design approved
- [ ] Minimum 6 sample techniques written across 2 grade levels (so prototype isn't empty)
- [ ] Grade filter logic confirmed: does the prototype simulate a grade, or does it show all unlocked?
- [ ] Video thumbnail placeholder images sourced or designed

---

## Open Questions

- Where are videos hosted? In-app (large), CDN (fast), or embedded video platform (YouTube/Vimeo)?
- Who maintains the technique catalogue — curriculum team, instructors, or central admin?
- Does the student's watch history persist, or is it reset?
- Should there be a "favourites" or "bookmarks" feature for techniques you're currently practising?
- Is the grade filter strict (only current grade and below) or does it include a "preview" of the next grade's techniques as locked?
