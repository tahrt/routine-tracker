# Project Progress

Last updated: 2026-08-25

## Current feature work

Implemented a new **Progress** feature for long-term core-activity tracking and streaks.

### 1. Lifetime core activity completion

Each core activity is identified by its stable `habit` id rather than by task name. This keeps historical statistics intact when a task is renamed or moved to another weekday.

For each activity, the app now shows:

- Lifetime completion percentage
- Completed tracked days / scheduled tracked days
- First date included in the statistic
- Current streak
- Best streak
- Last 7 calendar days as a small status chain

Lifetime percentage is calculated only from persisted day snapshots.

Rules:

- A tracked scheduled day that is completed counts as success.
- A tracked scheduled day that is not completed counts as a miss.
- A `skipped` scheduled day counts as a miss and breaks the streak.
- A `rest` day is neutral and does not affect the percentage or break the streak.
- A day where the activity was not scheduled is neutral.
- A missing/untracked day is neutral and is not invented as a failure.
- If more than one core task maps to the same habit on one date, all of them must be completed for that habit-day to count as done.

This follows the existing data-honesty rule that missing records are **untracked**, not 0%.

### 2. Progress / streak UI

Added a new **Progress** tab to the main navigation.

Each activity card displays:

- Activity name
- Lifetime completion %
- Completed / scheduled count
- Date the tracked history starts
- Current streak
- Longest streak
- Seven-day status dots for done, missed, rest, unscheduled, and untracked days

The page also shows a small overall summary including the number of activities with tracked history and the highest current streak.

## Files changed

- `src/lib/stats.ts`
  - Added habit lifetime-progress calculation.
  - Added current/longest streak calculation.
  - Added 7-day habit state calculation.

- `src/views/progress.ts`
  - New Progress view.

- `src/app.ts`
  - Added the `progress` tab.
  - Loads historical day records and renders the Progress view.

- `src/styles.css`
  - Added styles for progress cards, lifetime meters, streak statistics, and 7-day dots.

- `test/stats.test.ts`
  - Added tests for lifetime completion and streak behavior.

- `test/views.test.ts`
  - Added Progress-view rendering coverage.

- `test/app.test.ts`
  - Added integration coverage for the Progress tab.

## Storage / migration impact

No schema migration is required.

The existing `DayTask.habit` field and persisted day snapshots already contain the information needed for these statistics. Existing historical records remain unchanged.

## Verification status

Verified successfully in this ChatIDE session on 2026-08-25.

- `npm test` — passed: 6/6 test files, 112/112 tests.
- `npm run build` — passed: TypeScript typecheck and Vite production build completed successfully.

The Progress feature is now technically verified.

## Git / deployment status

The changes currently exist only in the local workspace.

Not performed yet:

- `git commit`
- `git push`
- `npm run deploy`

Nothing is uploaded to GitHub automatically.
