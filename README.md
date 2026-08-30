# Routine Tracker — v1.0

Personal daily/weekly routine tracker.

Vite + vanilla TypeScript + `localStorage`. No backend, no accounts, no build-time secrets.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # full Vitest suite
npm run build    # typecheck + Vite build + versioned service worker
npm run icons    # regenerate PWA icons (only after changing the mark)
```

## What it does

- **Today** — premium dashboard with Focus Block capacity, Planning Must Win / Next actions, routine progress, Continue Learning, and the routine checklist.
- **Week** — finite planning capacity + workstream commitments above the existing Mon–Sun routine history; past days remain tappable for retroactive logging.
- **Planning** — local Workstreams, Week Plans, dated Planned Actions, explicit Move/Defer/Cancel, deadline-risk warnings, and Weekly Review.
- **Job Applications** — local pipeline tracker with stages, fit, due next actions, Needs Attention, live-interview priority, and Today integration.
- **Learn** — structured Business, AI Agent and Negotiation paths with stages, video resources, Core/Recommended priorities, time-weighted completion and Continue Learning.
- **Insights** — weekly consistency, habit completion, streaks, learning progress and a simple Momentum status.
- **Day status** — `active` / `rest` / `skipped`. Rest days are excluded from the week average.
- **Edit tasks** — edit any weekday while historical day snapshots remain frozen.
- **Habits** — stable ids let labels/schedules change without resetting Progress history.
- **More** — export/import JSON backups, weekly schedule editing, habit management, home timezone, day cutoff hour, raw-data viewer, reset.
- **Offline** — installable Home Screen web app/PWA with a safe in-place update flow.

## The parts that matter for long-term use

**Date handling** (`src/lib/date.ts`) — date keys are built from local calendar parts, never `toISOString()`; the logical day starts at the configured cutoff so late-night taps can still count for the intended day; wall-clock time is read in the configured home timezone so travel does not shift history.

**Day snapshots** (`src/lib/day.ts`) — a day record is created lazily on first interaction and freezes the tasks as they were that day. Editing a template later never rewrites history; percentages for a past day are computed from that day's own snapshot.

**Stable habit identity** — task names and schedules are editable, but progress is keyed by the persistent habit id. Renaming a habit does not split its history.

**Learning curriculum vs progress** — curriculum ships in `src/config/learning.ts`, while only personal lesson completion is stored under `rt:learning:progress`. Resource URLs/titles can therefore be improved in a future deploy while stable lesson ids preserve completion.

**Schema versioning** (`src/store/migrations.ts`) — every blob carries `schemaVersion`, migrations run on load and on import, and the pre-migration data is kept under `rt:backup:preMigration:v{n}`. Schema v5 adds the private Planning Layer on top of v4 Learning Path completion without rewriting existing routine history.

**Storage** (`src/store/`) — one `rt:day:YYYY-MM-DD` key per day so a checkbox tap is an O(1) write, plus separate planning/application keys (`rt:planning:*`, `rt:job:applications`) so flexible work never rewrites routine history. An `rt:index` cache is rebuilt from the real day keys if it ever diverges. All app code goes through the `Store` interface.

**Backups** — `localStorage` can still be lost if the user clears site data, removes the Home Screen app/storage container, or the device is lost. Export writes a full JSON file; import validates, migrates, previews changes, and requires confirmation.

## Updating the iPhone Home Screen app safely

Do **not** delete the existing Home Screen icon just to get a new release. The saved routine history belongs to that installed web app's local storage container.

Normal release flow:

1. Build and deploy a new version to the same URL.
2. Keep using the existing **Routine** icon on the iPhone Home Screen.
3. The app checks for a new service worker when it opens, returns to the foreground, and periodically while open.
4. When a release is ready, a **Routine update ready** banner appears.
5. Tap **Update now**. The new worker activates, takes control, then the app reloads.
6. Existing `rt:*` local data is not modified by the update mechanism.

The production build stamps `dist/sw.js` with a unique build id through `scripts/build-sw.mjs`. Service-worker registration uses `updateViaCache: 'none'`, so a cached worker script cannot hide a new deployment.

When a future release changes the data schema, add a migration instead of resetting storage.

## Deploying

```bash
npm run deploy   # build, then publish dist/ to the gh-pages branch
```

`vite.config.ts` uses a relative `base`, so the build works from the GitHub Pages repo subpath.

A public URL makes the app public; the user's routine data still stays in that browser/Home Screen app until server sync is introduced.
