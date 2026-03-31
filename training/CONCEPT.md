# Training — Concept

**Last updated:** 2026-03-31
**Section state:** 🟣 Defined
**Parent:** `../PRODUCT_MAP.md`

---

## Purpose

Training is where students are set challenges to do in real life — building the habit of practice between classes. Challenges are assigned based on the student's age bracket and grade bracket, so a white belt 8-year-old gets different challenges to a brown belt 16-year-old.

The section has two challenge rhythms: weekly challenges (reset each week, set by the instructor or the system) and daily check-ins (small wins you can log every day). Together they build a streak — a visible chain of consistent practice that students are motivated to protect.

Training also integrates with Nendō: breathwork reminders appear in the Training daily view, connecting the mindfulness curriculum to the physical practice curriculum.

---

## What the Student Sees

### Weekly Challenge Card
- Title of the challenge (e.g. "Practice your front kick 50 times this week")
- Grade bracket label (e.g. "White–Yellow Belt")
- Age bracket label (e.g. "Junior 8–12")
- Progress tracker: how many completions logged vs target
- XP reward on completion
- Days remaining in the week

### Daily Check-in
- A single daily prompt (e.g. "Did you practice today?")
- Log button — one tap
- Streak counter: current streak + personal best
- Breathwork reminder: a soft nudge to visit Nendō (links to Mushin Hub)

### Streak Display
- Visual streak chain — each link represents one day completed
- Colour changes as streak grows (e.g. 7+ days = gold, 30+ days = special state)
- Streak freeze mechanic — students earn freeze tokens from Nendō sessions or grading events; one token can protect a streak through a missed day

---

## Challenge Assignment Logic

Challenges are filtered by two axes:

**Grade bracket:**
| Range | Label |
|-------|-------|
| White → Yellow | Starter |
| Orange → Green | Foundation |
| Purple → Blue | Developing |
| Brown | Advanced |
| Black | Excellence |

**Age bracket:**
| Range | Label |
|-------|-------|
| 7–11 | Junior |
| 12–15 | Teen |
| 16+ | Senior |

A student sees challenges tagged to their current bracket only. If no challenge is set for a bracket, the section shows a placeholder ("Check back soon — your instructor is building your challenges").

---

## XP and Rewards

| Event | XP |
|-------|----|
| Weekly challenge completed | +100 |
| Daily check-in logged | +10 |
| 7-day streak maintained | +50 bonus |
| 30-day streak maintained | +200 bonus |
| Breathwork session from Training reminder | +25 (awarded in Session Complete, attributed to Training referral) |

XP feeds into Student Profile aura progression. Integration spec: `../_SHARED/integration/`.

---

## Achievements Connected to Training

Training events trigger badge unlocks in the Achievements section:

- First daily check-in logged
- First weekly challenge completed
- 7-day streak
- 30-day streak
- 100-day streak
- First streak freeze used
- All challenges in a bracket completed

Full badge catalogue: `../achievements/CONCEPT.md`

---

## Data Dependencies

| Data | Source | Notes |
|------|--------|-------|
| Student grade | Student Profile | Read on load; determines challenge filter |
| Student age | Student Profile | Read on load; determines challenge filter |
| Challenge pool | Instructor / system | Defined per bracket; TBD whether app-side or server |
| Daily check-in log | Device / server | Streak continuity requires persistence |
| Streak data | Device / server | Must survive app restarts |
| Streak freeze tokens | Nendō Session Complete + grading events | Cross-section signal |

---

## Prerequisites for Phase 1

Before any code starts:

- [ ] Challenge card visual design approved (one static design in `ui-specs/`)
- [ ] Daily check-in card visual design approved
- [ ] Streak display visual design approved (what does a 7-day chain look like?)
- [ ] Age bracket and grade bracket labels confirmed
- [ ] At least 3 sample challenges written for one bracket (so the prototype isn't empty)
- [ ] XP values confirmed (see table above — subject to change)

---

## Open Questions

- Does the instructor set challenges per student, per class, or system-wide?
- Are challenges app-built or does the instructor write them in a dashboard?
- Is streak data stored locally (device) or on a server? Local = simpler but lost on reinstall.
- What does the breathwork reminder look like — a card in the Training view, a notification, or both?
- Does the streak freeze token appear in a visible inventory somewhere?
