/**
 * Schema versioning. Spec §4.1.
 *
 * Every stored blob carries schemaVersion. Migrations run on load and on import;
 * the pre-migration blob is kept under backup:preMigration:v{n} before saving.
 */

import { normalizePlanningData } from '../config/planning';
import { DEFAULT_HABITS, DEFAULT_SCHEDULE, DEFAULT_SETTINGS } from '../config/schedule';
import { resolveTask } from '../lib/day';
import { isDateKey, parseKey } from '../lib/date';
import type { DayRecord, DayTask, Habit, RootData, TemplateVersion, WeekTemplate } from '../types';

export const CURRENT_SCHEMA_VERSION = 5;

type Migration = (data: any) => any;

/**
 * v1 — the Claude.ai prototype shape: a flat map of `day:YYYY-MM-DD` keys whose
 * value is `{ tasks: { taskId: boolean } }`, with the weekday schedule hardcoded
 * in the source rather than stored.
 *
 * v2 — versioned templates, and day records that carry a full task snapshot,
 * a status, a note and timestamps.
 */
const v1_to_v2: Migration = (data) => {
  const rawDays: Record<string, any> = data?.days ?? {};
  const legacyTemplate: WeekTemplate = (data?.schedule as WeekTemplate) ?? DEFAULT_SCHEDULE;

  const keys = Object.keys(rawDays)
    .map((k) => k.replace(/^day:/, ''))
    .filter(isDateKey)
    .sort();

  const template: TemplateVersion = {
    version: 1,
    effectiveFrom: keys[0] ?? '1970-01-01',
    createdAt: new Date(0).toISOString(),
    days: legacyTemplate,
  };

  const days: Record<string, DayRecord> = {};
  for (const k of keys) {
    const legacy = rawDays[`day:${k}`] ?? rawDays[k] ?? {};
    const checked: Record<string, boolean> = legacy.tasks ?? {};
    const weekday = parseKey(k).getDay();
    const dayTpl = template.days[weekday];
    const tasks: DayTask[] = (dayTpl?.tasks ?? []).map((t) => ({
      ...resolveTask(t),
      done: checked[t.id] === true,
    }));
    // Ids checked in the legacy record but absent from the template are kept,
    // so no completion is silently discarded.
    for (const [id, done] of Object.entries(checked)) {
      if (done && !tasks.some((t) => t.id === id)) {
        tasks.push({ id, name: id, time: '', core: false, habit: null, weight: 1, done: true, adhoc: true });
      }
    }
    const stamp = new Date(0).toISOString();
    days[k] = {
      date: k,
      status: 'active',
      dayType: dayTpl?.type ?? '',
      templateVersion: 1,
      tasks,
      note: typeof legacy.note === 'string' ? legacy.note : '',
      createdAt: stamp,
      updatedAt: stamp,
      editedRetroactively: false,
    };
  }

  return {
    schemaVersion: 2,
    settings: { ...DEFAULT_SETTINGS, ...(data?.settings ?? {}) },
    templates: [template],
    days,
  };
};

/**
 * v3 — persist the habit registry so labels can change without changing the
 * stable ids stored in templates/day snapshots. Unknown legacy ids are kept.
 */
const v2_to_v3: Migration = (data) => {
  const habits = new Map<string, Habit>(DEFAULT_HABITS.map((h) => [h.id, structuredClone(h)]));
  const remember = (id: unknown): void => {
    if (typeof id !== 'string' || id === '' || habits.has(id)) return;
    habits.set(id, { id, label: id, color: 'slate' });
  };

  for (const tpl of (data?.templates ?? []) as TemplateVersion[]) {
    for (const day of Object.values(tpl.days ?? {})) {
      for (const task of day?.tasks ?? []) remember(task.habit);
    }
  }
  for (const day of Object.values((data?.days ?? {}) as Record<string, DayRecord>)) {
    for (const task of day?.tasks ?? []) remember(task.habit);
  }

  return {
    ...data,
    schemaVersion: 3,
    habits: [...habits.values()],
  };
};

/**
 * v4 — add personal Learning Path completion state. Curriculum content itself
 * ships with the app, so replacing a resource later does not require rewriting
 * user storage; stable lesson ids keep completion attached to the learning goal.
 */
const v3_to_v4: Migration = (data) => ({
  ...data,
  schemaVersion: 4,
  learningProgress: data?.learningProgress ?? {},
});

/**
 * v5 — add private Planning Layer state. This is additive only: day snapshots,
 * habits, templates and learning progress pass through byte-equivalent.
 */
const v4_to_v5: Migration = (data) => ({
  ...data,
  schemaVersion: 5,
  planning: normalizePlanningData(data?.planning),
}) satisfies RootData;

const MIGRATIONS: Record<number, Migration> = {
  1: v1_to_v2,
  2: v2_to_v3,
  3: v3_to_v4,
  4: v4_to_v5,
};

export const needsMigration = (data: { schemaVersion?: number }): boolean =>
  (data.schemaVersion ?? 1) < CURRENT_SCHEMA_VERSION;

/** Run every migration between the blob's version and the current one. */
export const migrate = (data: any): RootData => {
  let d = data;
  let version: number = d?.schemaVersion ?? 1;
  while (version < CURRENT_SCHEMA_VERSION) {
    const step = MIGRATIONS[version];
    if (!step) throw new Error(`no migration from schema version ${version}`);
    d = step(d);
    const next: number = d?.schemaVersion ?? version + 1;
    if (next <= version) throw new Error(`migration from ${version} did not advance schemaVersion`);
    version = next;
  }
  if (version > CURRENT_SCHEMA_VERSION) {
    throw new Error(`data is from a newer version (v${version}) than this app supports (v${CURRENT_SCHEMA_VERSION})`);
  }
  return d as RootData;
};

/** Shape check for imported files, before migration runs. */
export const validateImport = (data: unknown): { ok: true } | { ok: false; error: string } => {
  if (typeof data !== 'object' || data === null) return { ok: false, error: 'File is not a JSON object.' };
  const d = data as Record<string, unknown>;
  if (typeof d.schemaVersion !== 'number') return { ok: false, error: 'Missing schemaVersion — not a routine backup.' };
  if (d.schemaVersion > CURRENT_SCHEMA_VERSION) {
    return { ok: false, error: `Backup is schema v${d.schemaVersion}; this app supports up to v${CURRENT_SCHEMA_VERSION}.` };
  }
  if (typeof d.days !== 'object' || d.days === null) return { ok: false, error: 'Missing days.' };
  return { ok: true };
};
