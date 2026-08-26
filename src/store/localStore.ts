/**
 * localStorage implementation of the store interface. Spec §7.
 *
 * Key layout — one key per day, so a checkbox tap is an O(1) write rather than a
 * re-serialization of the whole history:
 *
 *   rt:meta            { schemaVersion, settings }
 *   rt:habits          [ …Habit… ]
 *   rt:templates       [ …TemplateVersion… ]
 *   rt:day:YYYY-MM-DD  { …DayRecord… }
 *   rt:index           ['YYYY-MM-DD', …]  sorted, for fast listing
 */

import { DEFAULT_HABITS, DEFAULT_SCHEDULE, DEFAULT_SETTINGS } from '../config/schedule';
import { isDateKey } from '../lib/date';
import type { DayRecord, Habit, RootData, Settings, TemplateVersion } from '../types';
import type { KV } from './kv';
import { CURRENT_SCHEMA_VERSION, migrate, needsMigration, validateImport } from './migrations';

const K = {
  meta: 'rt:meta',
  habits: 'rt:habits',
  templates: 'rt:templates',
  index: 'rt:index',
  day: (d: string) => `rt:day:${d}`,
  backupMigration: (v: number) => `rt:backup:preMigration:v${v}`,
  backupImport: 'rt:backup:preImport',
};

const DAY_PREFIX = 'rt:day:';

interface Meta {
  schemaVersion: number;
  settings: Settings;
}

export interface ImportSummary {
  added: number;
  overwritten: number;
  unchanged: number;
  templates: number;
}

export interface Store {
  init(nowIso: string, todayKey: string): void;
  getDay(dateK: string): DayRecord | undefined;
  setDay(dateK: string, rec: DayRecord, nowIso: string): void;
  deleteDay(dateK: string): void;
  listDays(range?: { from?: string; to?: string }): DayRecord[];
  dayKeys(): string[];
  getTemplates(): TemplateVersion[];
  appendTemplate(v: Omit<TemplateVersion, 'version'>): TemplateVersion;
  getHabits(): Habit[];
  addHabit(label: string): Habit;
  setHabitLabel(id: string, label: string): Habit | undefined;
  setHabitArchived(id: string, archived: boolean): Habit | undefined;
  getSettings(): Settings;
  setSettings(patch: Partial<Settings>): Settings;
  exportAll(): RootData;
  previewImport(raw: unknown): { ok: true; summary: ImportSummary } | { ok: false; error: string };
  importAll(raw: unknown): ImportSummary;
  subscribe(fn: () => void): () => void;
  notify(): void;
}

const parse = <T>(raw: string | null, fallback: T): T => {
  if (raw === null) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
};

export const createLocalStore = (kv: KV): Store => {
  const listeners = new Set<() => void>();
  const notify = (): void => listeners.forEach((fn) => fn());

  const readMeta = (): Meta =>
    parse<Meta>(kv.get(K.meta), { schemaVersion: CURRENT_SCHEMA_VERSION, settings: { ...DEFAULT_SETTINGS } });

  const writeMeta = (m: Meta): void => kv.set(K.meta, JSON.stringify(m));

  const readIndex = (): string[] => parse<string[]>(kv.get(K.index), []);
  const writeIndex = (ix: string[]): void => kv.set(K.index, JSON.stringify([...new Set(ix)].sort()));

  /** Source of truth for which days exist: the actual rt:day: keys. */
  const scanDayKeys = (): string[] =>
    kv
      .keys()
      .filter((k) => k.startsWith(DAY_PREFIX))
      .map((k) => k.slice(DAY_PREFIX.length))
      .filter(isDateKey)
      .sort();

  const readTemplates = (): TemplateVersion[] => parse<TemplateVersion[]>(kv.get(K.templates), []);
  const writeTemplates = (t: TemplateVersion[]): void => kv.set(K.templates, JSON.stringify(t));
  const readHabits = (): Habit[] => parse<Habit[]>(kv.get(K.habits), []);
  const writeHabits = (h: readonly Habit[]): void => kv.set(K.habits, JSON.stringify(h));

  const readDay = (dateK: string): DayRecord | undefined => {
    const raw = kv.get(K.day(dateK));
    return raw === null ? undefined : parse<DayRecord | undefined>(raw, undefined);
  };

  /** Collect the per-key layout into one root object (export, migration). */
  const collect = (): RootData => {
    const meta = readMeta();
    const days: Record<string, DayRecord> = {};
    for (const k of scanDayKeys()) {
      const rec = readDay(k);
      if (rec) days[k] = rec;
    }
    return {
      schemaVersion: meta.schemaVersion,
      settings: meta.settings,
      habits: readHabits(),
      templates: readTemplates(),
      days,
    };
  };

  /** Replace everything with `root`, exploding it back into per-key layout. */
  const writeRoot = (root: RootData): void => {
    for (const k of scanDayKeys()) kv.remove(K.day(k));
    writeMeta({ schemaVersion: root.schemaVersion, settings: { ...DEFAULT_SETTINGS, ...root.settings } });
    writeHabits(root.habits?.length ? root.habits : structuredClone(DEFAULT_HABITS));
    writeTemplates(root.templates);
    const keys = Object.keys(root.days).filter(isDateKey).sort();
    for (const k of keys) kv.set(K.day(k), JSON.stringify(root.days[k]));
    writeIndex(keys);
  };

  const seed = (nowIso: string, todayKey: string): void => {
    writeMeta({ schemaVersion: CURRENT_SCHEMA_VERSION, settings: { ...DEFAULT_SETTINGS } });
    writeHabits(structuredClone(DEFAULT_HABITS));
    writeTemplates([
      { version: 1, effectiveFrom: todayKey, createdAt: nowIso, days: structuredClone(DEFAULT_SCHEDULE) },
    ]);
    writeIndex([]);
  };

  return {
    init(nowIso, todayKey) {
      if (kv.get(K.meta) === null) {
        seed(nowIso, todayKey);
        return;
      }
      const meta = readMeta();
      if (needsMigration(meta)) {
        const before = collect();
        kv.set(K.backupMigration(before.schemaVersion), JSON.stringify(before));
        writeRoot(migrate(before));
      }
      if (readTemplates().length === 0) {
        writeTemplates([
          { version: 1, effectiveFrom: todayKey, createdAt: nowIso, days: structuredClone(DEFAULT_SCHEDULE) },
        ]);
      }
      if (readHabits().length === 0) writeHabits(structuredClone(DEFAULT_HABITS));
      // The index is a cache; the day keys are the truth. Rebuild if they diverge.
      const scanned = scanDayKeys();
      const indexed = readIndex();
      if (scanned.length !== indexed.length || scanned.some((k, i) => k !== indexed[i])) writeIndex(scanned);
    },

    getDay: readDay,

    setDay(dateK, rec, nowIso) {
      const next: DayRecord = { ...rec, date: dateK, updatedAt: nowIso };
      kv.set(K.day(dateK), JSON.stringify(next));
      const ix = readIndex();
      if (!ix.includes(dateK)) writeIndex([...ix, dateK]);
      notify();
    },

    deleteDay(dateK) {
      kv.remove(K.day(dateK));
      writeIndex(readIndex().filter((k) => k !== dateK));
      notify();
    },

    listDays(range) {
      return readIndex()
        .filter((k) => (range?.from === undefined || k >= range.from) && (range?.to === undefined || k <= range.to))
        .map(readDay)
        .filter((r): r is DayRecord => r !== undefined);
    },

    dayKeys: readIndex,

    getTemplates: readTemplates,

    appendTemplate(v) {
      const all = readTemplates();
      const version = all.reduce((m, t) => Math.max(m, t.version), 0) + 1;
      const created: TemplateVersion = { ...v, version };
      writeTemplates([...all, created]);
      notify();
      return created;
    },

    getHabits: readHabits,

    addHabit(label) {
      const clean = label.trim();
      if (!clean) throw new Error('Habit needs a name.');
      const all = readHabits();
      const base =
        clean
          .toLowerCase()
          .normalize('NFKD')
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'habit';
      const ids = new Set(all.map((h) => h.id));
      let id = base;
      let suffix = 2;
      while (ids.has(id)) id = `${base}-${suffix++}`;
      const habit: Habit = { id, label: clean, color: 'slate' };
      writeHabits([...all, habit]);
      notify();
      return habit;
    },

    setHabitLabel(id, label) {
      const clean = label.trim();
      if (!clean) throw new Error('Habit needs a name.');
      const all = readHabits();
      const found = all.find((h) => h.id === id);
      if (!found) return undefined;
      const next: Habit = { ...found, label: clean };
      writeHabits(all.map((h) => (h.id === id ? next : h)));
      notify();
      return next;
    },

    setHabitArchived(id, archived) {
      const all = readHabits();
      const found = all.find((h) => h.id === id);
      if (!found) return undefined;
      const next: Habit = { ...found, archived };
      writeHabits(all.map((h) => (h.id === id ? next : h)));
      notify();
      return next;
    },

    getSettings() {
      return { ...DEFAULT_SETTINGS, ...readMeta().settings };
    },

    setSettings(patch) {
      const meta = readMeta();
      const settings = { ...DEFAULT_SETTINGS, ...meta.settings, ...patch };
      writeMeta({ ...meta, settings });
      notify();
      return settings;
    },

    exportAll: collect,

    previewImport(raw) {
      const check = validateImport(raw);
      if (!check.ok) return check;
      let root: RootData;
      try {
        root = migrate(structuredClone(raw));
      } catch (err) {
        return { ok: false, error: err instanceof Error ? err.message : String(err) };
      }
      const existing = new Set(scanDayKeys());
      let added = 0;
      let overwritten = 0;
      let unchanged = 0;
      for (const k of Object.keys(root.days).filter(isDateKey)) {
        if (!existing.has(k)) added += 1;
        else if (JSON.stringify(readDay(k)) === JSON.stringify(root.days[k])) unchanged += 1;
        else overwritten += 1;
      }
      return { ok: true, summary: { added, overwritten, unchanged, templates: root.templates.length } };
    },

    /** Full replace, not a merge — the file is treated as the authoritative history. */
    importAll(raw) {
      const preview = this.previewImport(raw);
      if (!preview.ok) throw new Error(preview.error);
      const root = migrate(structuredClone(raw));
      kv.set(K.backupImport, JSON.stringify(collect())); // undo hatch for a bad import
      writeRoot(root);
      notify();
      return preview.summary;
    },

    subscribe(fn) {
      listeners.add(fn);
      return () => void listeners.delete(fn);
    },

    notify,
  };
};
