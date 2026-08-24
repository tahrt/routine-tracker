# Routine Tracker — v1.0

Personal daily/weekly routine tracker. Built to a written spec (`routine-tracker-spec.md`), which is kept out of this repo.

Vite + vanilla TypeScript + `localStorage`. No backend, no accounts, no build-time secrets.

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # 88 tests
npm run build    # typecheck + production build into dist/
npm run icons    # regenerate PWA icons (only after changing the mark)
```

## What v1.0 does

- **Today** — the weekday's checklist, tap to complete, live total % and core %.
- **Week** — Mon–Sun skyline. Past days are tappable so a forgotten day can be logged; future days are inert; Next stops at the current week.
- **Day status** — `active` / `rest` / `skipped`. Rest days are excluded from the week average, so a holiday doesn't read as a collapse.
- **Settings** — export/import JSON backups, home timezone, day cutoff hour, raw-data viewer, reset.
- **Offline** — installable PWA, opens and works with no network.

## The parts that matter for long-term use

**Date handling** (`src/lib/date.ts`) — date keys are built from local calendar parts, never `toISOString()`; the logical day starts at 04:00 so a 00:20 tap still counts for the evening that's still in progress; wall-clock time is read in the configured home timezone so travel doesn't shift history. This is the only code where a bug corrupts the past, so it is the most heavily tested.

**Day snapshots** (`src/lib/day.ts`) — a day record is created lazily on first interaction and freezes the tasks as they were that day. Editing a template later never rewrites history; percentages for a past day are computed from that day's own snapshot.

**Schema versioning** (`src/store/migrations.ts`) — every blob carries `schemaVersion`, migrations run on load and on import, and the pre-migration data is kept under `rt:backup:preMigration:v{n}`.

**Storage** (`src/store/`) — one `rt:day:YYYY-MM-DD` key per day so a checkbox tap is an O(1) write, plus an `rt:index` cache that is rebuilt from the real keys if it ever diverges. All app code goes through the `Store` interface in `src/store/localStore.ts`, so swapping in a Supabase backend later means writing one module, not touching the views.

**Backups** — `localStorage` is one cache clear from empty. Export writes a full JSON file; import validates, migrates, shows a diff, and requires confirmation. A nudge appears if you haven't exported in 30 days.

## Deferred (spec §11)

v1.1 streaks · daily note · task weights UI. v1.2 template editing in-app · ad-hoc tasks · history trends. v2.0 Supabase sync + push reminders.

Until template editing ships, the weekday routine is seeded from `src/config/schedule.ts` on first run. Changing that file does **not** change an existing install — edit, then either reset from Settings (export first) or import an edited backup.

## Deploying

```bash
npm run deploy   # build, then force-push dist/ to the gh-pages branch
```

`vite.config.ts` uses a relative `base`, so the build works from a repo subpath.

Note that a public URL makes the app public — the data still stays in each visitor's own browser, so that is fine for v1.0. It stops being fine the moment sync is added: see spec §7.3 before wiring up Supabase.
