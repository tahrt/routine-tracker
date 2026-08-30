# Routine Planning V2.1 — Execution UX Plan

Last updated: 2026-08-30

## Product direction

Routine is the execution layer between life priorities and what gets done today.

Flow:

Life priorities → Workstreams → Week Plan → Planned Actions → Today Agenda → Done / Defer / Move → Weekly Review

The app must keep two truths separate:

- Routine history = habit consistency and frozen DayRecord snapshots.
- Execution planning = dated PlannedActions, Workstreams, deadlines, applications, and Focus Block capacity.

One UI may combine both, but one data model must never overwrite the other.

## V2.1 UX correction

The first Planning V1 release exposed planning as a separate layer above the old checklist. Real usage showed that this felt like two apps stacked together.

V2.1 fixes that by making Today and Week the actual execution surfaces.

### 1. Unified Today Agenda

Today shows one checklist.

- Concrete PlannedActions appear directly in the daily checklist.
- A concrete action replaces the generic routine placeholder for the same linked habit in the visible agenda.
- Example: Resume V1 replaces the generic Job Search row for that day.
- Example: Close SEAM replaces the generic Personal Project row for that day.
- The underlying DayTask snapshot remains untouched and keeps habit history honest.
- Completing the PlannedAction may complete exactly one matching core habit through the existing DayRecord path.
- Reopening a PlannedAction never silently rewrites past habit history.

Today progress is presentation-only agenda progress:

- visible core routine items
- plus scheduled PlannedActions
- with a linked generic placeholder counted only once because it is hidden from the agenda

Routine statistics and historical streak calculations remain unchanged.

### 2. Correct planning semantics

Only explicit PlannedActions consume Focus Block capacity.

Scheduled:
- Has a PlannedAction dated today.
- Appears in Today Agenda.
- Counts against today's capacity.
- Can be completed directly.

Needs Attention:
- Example: application next action is due or overdue.
- Appears as an alert.
- Does not consume capacity until explicitly scheduled.

Suggested Next:
- Comes from Workstream.execution.nextAction.
- Context only.
- Does not consume capacity.
- Does not pretend to be planned work.

If explicit actions exceed capacity, do not hide them. Show all scheduled work and flag the day as overbooked.

### 3. Week Execution Calendar

Week contains:

- Week Plan commitments and capacity summary.
- Execution Calendar with Mon–Sun cards.
- Each day shows scheduled actions, used blocks, total capacity, and free/full/over state.
- Routine History remains below as a separate habit-consistency section.

Future planning navigation is allowed up to four weeks ahead. Future routine days remain non-clickable because they are not history yet.

### 4. Workstream Detail

Every Workstream is tappable.

Detail view shows:

- priority and status
- goal
- deadline
- current milestone
- next action
- Definition of Done
- filtered weekly calendar for only that Workstream
- upcoming scheduled actions
- for Career: application pipeline shortcut and live-pipeline count

If the current week has no action but a future action exists, the Workstream calendar anchors to the nearest upcoming scheduled week instead of showing an empty current week.

## Capacity model

One Focus Block = 90 minutes.

Default profile:

- Monday: 2
- Tuesday: 2
- Wednesday: 1
- Thursday: 2
- Friday: 1
- Saturday: 3
- Sunday: 3

Total theoretical weekly focus capacity: 14 blocks.

Week Plans should normally leave buffer rather than allocate all 14 blocks.

## Replan rules

- Missed work does not auto-carry.
- Move is explicit: original action becomes deferred and a new dated action is created.
- Deadline does not silently slide.
- Queued / parked / done Workstreams never surface in Today.
- Create Next Week copies commitments only, never dated actions.

## Application Tracker

Stages:

Saved → Preparing → Applied → Screening → Interview → Final → Offer

Terminal:

Rejected / Withdrawn

Application next actions can trigger Needs Attention. Live screening/interview/final work gets higher alert priority, but it still does not consume capacity until scheduled.

## Storage / safety

Schema remains v5.

Planning state uses separate runtime keys:

- rt:planning:workstreams
- rt:planning:capacity
- rt:planning:weeks
- rt:planning:actions
- rt:job:applications

Existing keys, DayRecord snapshots, habit ids, Learning progress, backup/import, and PWA update behavior remain unchanged.

## Explicit non-goals

Do not add these as part of V2.1:

- AI auto-planner
- automatic repo sync
- Google Calendar sync
- server backend / multi-device sync
- automatic job discovery
- Jira/Notion-style project trees
- month calendar
- push notifications

## V2.1 Definition of Done

V2.1 is done when:

1. PlannedActions appear in Today's Agenda.
2. Linked generic habit placeholders are not duplicated in the visible agenda.
3. Completing a planned action still preserves normal habit-history semantics.
4. Suggestions and due application alerts do not consume Focus Block capacity.
5. Explicit overbooking is visible instead of silently hiding work.
6. Week shows a real execution calendar by day.
7. Week can navigate into the future planning horizon.
8. Routine History remains separate and unchanged.
9. Each Workstream has a filtered calendar/schedule detail view.
10. Job Search detail links to the Application Tracker.
11. Full test suite passes.
12. Production build and PWA build pass.
13. Existing local data requires no reset or re-import.
14. Update ships through the existing in-place PWA flow.

## Status

V2.1 is implemented, tested, pushed, and deployed as of 2026-08-30.

Release result:

- final test suite: 10/10 files, 150/150 tests passed
- production TypeScript + Vite + service-worker build passed
- source commit: `131689c`
- deployed service-worker build: `131689cf2572-20260830130116`
- `dist/` published successfully to `gh-pages`
- schema remains v5; existing Planning V1 imports remain valid

Planning manager usability polish added after the first iPhone screenshot review:

- replaced always-open Workstream forms with compact tappable summary cards
- moved Workstream editing into a collapsed editor on the Workstream detail screen
- added a compact weekly overview (scheduled blocks / active workstreams / planned actions)
- collapsed Add Workstream, weekly allocation editing, Add Action, action controls, and Weekly Review until needed
- kept Application Tracker as a single quick link instead of another large form block
- preserved all V2.1 data/storage semantics

Latest verification:

- 10/10 test files, 150/150 tests passed
- production TypeScript + Vite + PWA build passed
- schema remains v5

Remaining verification is the real installed-PWA smoke check on the existing iPhone Home Screen app.

Do not delete or re-add the Home Screen app.
