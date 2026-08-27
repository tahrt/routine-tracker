# Project Progress

Last updated: 2026-08-27

## Current state

The routine tracker now has three related pieces of long-term tracking functionality:

1. **Progress / streak tracking for core activities**
2. **Editable habits and weekly tasks without breaking historical progress**
3. **Learning Path tracking for Business, AI Agents and Negotiation**

The app is on `main`, and the latest code commit is already pushed to `origin/main`.

## 1. Lifetime core activity completion

Each core activity is identified by its stable `habit` id rather than by task name. This keeps historical statistics intact when a task is renamed or moved to another weekday.

For each activity, the app shows:

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

This follows the data-honesty rule that missing records are **untracked**, not 0%.

## 2. Progress / streak UI

A **Progress** tab exists in the main navigation.

Each activity card displays:

- Activity name
- Lifetime completion %
- Completed / scheduled count
- Date the tracked history starts
- Current streak
- Longest streak
- Seven-day status dots for done, missed, rest, unscheduled, and untracked days

The page also shows a small overall summary including the number of activities with tracked history and the highest current streak.

## 3. Editable habits without resetting history

The latest feature work makes habits editable while preserving their stable identity.

Implemented behavior:

- Habits are stored in a persistent registry with stable ids.
- A habit can be renamed without splitting or resetting its Progress history.
- A habit can be archived while keeping its historical records.
- New habits can be added.
- Weekly template tasks can map to a habit id.
- Editing task labels or schedules does not rewrite old day snapshots.
- Existing data is migrated to the persistent habit registry.
- Settings now include habit management.

This gives us a clean separation between:

- **Habit identity** — stable across time
- **Task presentation/schedule** — editable going forward
- **Historical day records** — frozen snapshots that remain honest

## Main files involved

### Progress tracking

- `src/lib/stats.ts`
  - Habit lifetime-progress calculation
  - Current/longest streak calculation
  - Seven-day habit state calculation
- `src/views/progress.ts`
  - Progress view
- `src/app.ts`
  - Progress tab and historical record loading
- `src/styles.css`
  - Progress cards, meters, streak statistics, and seven-day dots
- `test/stats.test.ts`
  - Lifetime completion and streak tests
- `test/views.test.ts`
  - Progress-view rendering coverage
- `test/app.test.ts`
  - Progress-tab integration coverage

### Persistent editable habits

- `src/types.ts`
- `src/app.ts`
- `src/config/schedule.ts`
- `src/store/localStore.ts`
- `src/store/migrations.ts`
- `src/views/editTemplate.ts`
- `src/views/progress.ts`
- `src/views/settings.ts`
- `test/habits.test.ts`

## Storage / migration impact

The original Progress feature did not require a schema migration because historical `DayTask.habit` snapshots already contained the information needed for statistics.

The later editable-habits feature adds a persistent habit registry and migration support so habit labels can change without changing stable ids or corrupting existing history.

Historical day records remain frozen snapshots.

## Verification status

The Progress feature was verified successfully on 2026-08-25:

- `npm test` — passed: 6/6 test files, 112/112 tests
- `npm run build` — passed: TypeScript typecheck and Vite production build completed successfully

Fresh verification on 2026-08-27 after the Safe Update work:

- `npm test` — passed: 8/8 test files, 117/117 tests
- `npm run build` — passed: TypeScript typecheck, Vite production build, and versioned service-worker generation
- Built service worker precached the production HTML, manifest, icons, and hashed JS/CSS assets
- PWA test verifies the update flow leaves existing `rt:day:*` localStorage data untouched

Fresh verification on 2026-08-27 after Learning Path V1:

- `npm test` — passed: 9/9 test files, 127/127 tests
- `npm run build` — passed: TypeScript typecheck, Vite production build, and service-worker generation
- Migration coverage verifies schema v3 → v4 adds learning progress without changing existing routine data
- Store coverage verifies lesson completion persists, exports/imports, and can be undone
- App coverage verifies the Learn tab, path navigation, completion and undo flow

## Git / deployment status

Safe Update release status on 2026-08-27:

- Branch: `main`
- Safe Update code commit: `3e96871` — `feat: add safe in-place PWA updates`
- `3e96871` was pushed successfully to `origin/main`
- `npm run deploy` completed successfully and published `dist/` to the `gh-pages` branch
- Deployed build id: `3e96871ce26d-20260827043502`
- Deployment build completed TypeScript checking, Vite production build, service-worker stamping, and GitHub Pages publication
- Normal future releases should be installed through the existing Home Screen app; do not delete/re-add the icon just to update code

The external web fetch used for an additional live-content check was unavailable in this session, so deployment status is based on the successful GitHub Pages publish command rather than a second HTTP fetch.

## Learning Path V1 release status

Released on 2026-08-27.

- Feature commit: `f8bb05a` — `feat: add learning paths`
- Pushed successfully to `origin/main`
- `npm run deploy` completed successfully and published the build to the `gh-pages` branch
- Deployed service-worker build id: `f8bb05a6c295-20260827045735`
- Release verification before deploy: 9/9 test files, 127/127 tests passed
- Production TypeScript/Vite build passed
- Existing schema v3 data migrates to v4 without rewriting routine history
- Existing iPhone Home Screen installations should receive this release through the Safe Update flow; no delete/re-add is required

A second external HTTP fetch of the GitHub Pages URL was unavailable in this session, so live publication status is grounded in the successful `npm run deploy` / `gh-pages` publish result.

## Safe Update System for the iPhone Home Screen app

Implemented on 2026-08-27 so future releases can update the existing installed Home Screen app without deleting it or resetting local data.

Key behavior:

- Keep using the same Home Screen icon and the same GitHub Pages URL.
- Routine data remains in the existing app's `localStorage`; the update mechanism does not rewrite `rt:*` data.
- Production builds stamp `dist/sw.js` with a unique build id.
- The build injects the exact Vite hashed JS/CSS assets into the service worker precache.
- Service-worker registration uses `updateViaCache: 'none'` so a cached worker script cannot hide a release.
- The app checks for updates at launch, when it returns to the foreground, on page show, and periodically while open.
- If a new worker is waiting, the app shows a persistent **Routine update ready** banner.
- Pressing **Update now** asks the new worker to activate and reloads only after `controllerchange`, avoiding the old-code reload race.
- Old `rt-*` caches are removed only after the new worker activates.
- README now documents that normal updates should never require deleting/re-adding the Home Screen app.

Files added/changed:

- `src/pwa.ts`
- `src/main.ts`
- `public/sw.js`
- `scripts/build-sw.mjs`
- `src/styles.css`
- `test/pwa.test.ts`
- `package.json`
- `README.md`

## Learning Path V1

Implemented on 2026-08-27.

### UX

A new **Learn** tab sits alongside Today, Week, Progress and Settings.

The Learn overview shows:

- Continue Learning
- One card per learning set
- Core completion percentage
- Completed / total core lessons
- Completed / total core learning time
- Next core lesson

Opening a set shows:

- Stage-by-stage curriculum
- Core / Recommended / Optional priority labels
- Resource duration
- External resource link
- Mark complete / undo
- Set-level and stage-level progress
- Core time learned and remaining
- Up Next lesson

### Initial learning sets

1. **Start & Grow a Business**
2. **Great & Reliable AI Agent Team**
3. **Business Negotiation Strategy**

The first seeded resource list is intentionally the V1 shortlist we were already reviewing. Current core video time in the app is smaller than the eventual target curriculum and can be expanded after resource review.

### Data model

Curriculum content is code-owned in `src/config/learning.ts`.

Personal completion is stored separately under:

- `rt:learning:progress`

This is intentional. A future release can replace a video title, URL or duration while keeping the same stable lesson id, so the user's completion does not reset.

Schema is now **v4**:

- v3 → v4 adds `learningProgress`
- Existing settings, habits, templates and day snapshots are preserved
- Pre-migration backup behavior remains in place
- Export/import includes learning completion
- Current curriculum itself is not duplicated into user storage

### Main Learning Path files

- `src/config/learning.ts`
- `src/lib/learning.ts`
- `src/views/learning.ts`
- `src/types.ts`
- `src/store/localStore.ts`
- `src/store/migrations.ts`
- `src/app.ts`
- `src/styles.css`
- `src/views/settings.ts`
- `test/learning.test.ts`
- `test/app.test.ts`
- `test/store.test.ts`
- `test/migrations.test.ts`
- `test/views.test.ts`

### Future curriculum work

After using/reviewing the seeded V1 videos, the curriculum can be expanded toward the earlier target:

- Business: roughly 7–8 hours of core material
- AI Agent: roughly 7–8 hours plus hands-on practice
- Negotiation: roughly 5 hours

Because lesson ids are stable, resource replacement and curriculum refinement can happen without losing completed learning history.
