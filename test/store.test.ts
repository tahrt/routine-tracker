/** Spec §7 — key layout, index integrity, export/import round-trip. */

import { describe, expect, it } from 'vitest';
import { memoryKV } from '../src/store/kv';
import { createLocalStore } from '../src/store/localStore';
import { materializeDay, templateAt } from '../src/lib/day';

const NOW = '2026-08-24T09:00:00.000Z';
const TODAY = '2026-08-24'; // Monday

const fresh = () => {
  const kv = memoryKV();
  const store = createLocalStore(kv);
  store.init(NOW, TODAY);
  return { kv, store };
};

describe('init', () => {
  it('seeds templates and an empty index on first run', () => {
    const { kv, store } = fresh();
    expect(store.getTemplates()).toHaveLength(1);
    expect(store.dayKeys()).toEqual([]);
    expect(kv.get('rt:meta')).not.toBeNull();
    expect(store.getSettings().timezone).toBe('Asia/Bangkok');
  });

  it('does not reseed over existing data', () => {
    const kv = memoryKV();
    const a = createLocalStore(kv);
    a.init(NOW, TODAY);
    a.setDay(TODAY, materializeDay(TODAY, a.getTemplates(), NOW, TODAY), NOW);

    const b = createLocalStore(kv);
    b.init('2026-08-25T09:00:00.000Z', '2026-08-25');
    expect(b.dayKeys()).toEqual([TODAY]);
    expect(b.getTemplates()).toHaveLength(1);
  });

  it('rebuilds a corrupted index from the day keys', () => {
    const { kv, store } = fresh();
    store.setDay(TODAY, materializeDay(TODAY, store.getTemplates(), NOW, TODAY), NOW);
    kv.set('rt:index', JSON.stringify(['2020-01-01', 'garbage']));

    const reopened = createLocalStore(kv);
    reopened.init(NOW, TODAY);
    expect(reopened.dayKeys()).toEqual([TODAY]);
  });
});

describe('day records', () => {
  it('writes one key per day', () => {
    const { kv, store } = fresh();
    store.setDay(TODAY, materializeDay(TODAY, store.getTemplates(), NOW, TODAY), NOW);
    expect(kv.get(`rt:day:${TODAY}`)).not.toBeNull();
    expect(kv.keys().filter((k) => k.startsWith('rt:day:'))).toHaveLength(1);
  });

  it('keeps the index sorted and deduplicated', () => {
    const { store } = fresh();
    for (const d of ['2026-08-26', '2026-08-24', '2026-08-26']) {
      store.setDay(d, materializeDay(d, store.getTemplates(), NOW, TODAY), NOW);
    }
    expect(store.dayKeys()).toEqual(['2026-08-24', '2026-08-26']);
  });

  it('filters listDays by range', () => {
    const { store } = fresh();
    for (const d of ['2026-08-23', '2026-08-24', '2026-08-25']) {
      store.setDay(d, materializeDay(d, store.getTemplates(), NOW, TODAY), NOW);
    }
    expect(store.listDays({ from: '2026-08-24' }).map((r) => r.date)).toEqual(['2026-08-24', '2026-08-25']);
    expect(store.listDays({ to: '2026-08-24' }).map((r) => r.date)).toEqual(['2026-08-23', '2026-08-24']);
  });

  it('removes a day from the index on delete', () => {
    const { store } = fresh();
    store.setDay(TODAY, materializeDay(TODAY, store.getTemplates(), NOW, TODAY), NOW);
    store.deleteDay(TODAY);
    expect(store.dayKeys()).toEqual([]);
    expect(store.getDay(TODAY)).toBeUndefined();
  });
});

describe('materializeDay', () => {
  it('snapshots the template in force on that date', () => {
    const { store } = fresh();
    const rec = materializeDay(TODAY, store.getTemplates(), NOW, TODAY);
    expect(rec.dayType).toBe('WFH · Gym AM');
    expect(rec.tasks.some((t) => t.id === 'gym')).toBe(true);
    expect(rec.tasks.every((t) => t.done === false)).toBe(true);
    expect(rec.templateVersion).toBe(1);
    expect(rec.editedRetroactively).toBe(false);
  });

  it('flags a past date as logged later', () => {
    const { store } = fresh();
    expect(materializeDay('2026-08-20', store.getTemplates(), NOW, TODAY).editedRetroactively).toBe(true);
  });

  it('is unaffected by later template edits (history stays accurate)', () => {
    const { store } = fresh();
    const snapshot = materializeDay(TODAY, store.getTemplates(), NOW, TODAY);
    store.setDay(TODAY, snapshot, NOW);

    store.appendTemplate({
      effectiveFrom: '2026-08-25',
      createdAt: '2026-08-25T09:00:00.000Z',
      days: { 1: { type: 'Rewritten', tasks: [{ id: 'only', name: 'Only task', time: '' }] } },
    });

    const stored = store.getDay(TODAY);
    expect(stored?.dayType).toBe('WFH · Gym AM');
    expect(stored?.tasks.length).toBe(snapshot.tasks.length);
  });
});

describe('templateAt', () => {
  it('picks the highest version effective on or before the date', () => {
    const { store } = fresh();
    store.appendTemplate({ effectiveFrom: '2026-09-01', createdAt: NOW, days: {} });
    expect(templateAt(store.getTemplates(), '2026-08-31').version).toBe(1);
    expect(templateAt(store.getTemplates(), '2026-09-01').version).toBe(2);
    expect(templateAt(store.getTemplates(), '2026-12-01').version).toBe(2);
  });

  it('falls back to the earliest version for dates predating every template', () => {
    const { store } = fresh();
    expect(templateAt(store.getTemplates(), '2001-01-01').version).toBe(1);
  });
});

describe('export / import', () => {
  it('round-trips losslessly', () => {
    const { store } = fresh();
    store.setDay(TODAY, materializeDay(TODAY, store.getTemplates(), NOW, TODAY), NOW);
    const exported = structuredClone(store.exportAll());

    store.importAll(structuredClone(exported));
    expect(store.exportAll()).toEqual(exported);
  });

  it('previews adds, overwrites and unchanged days without writing', () => {
    const { store } = fresh();
    store.setDay(TODAY, materializeDay(TODAY, store.getTemplates(), NOW, TODAY), NOW);
    const backup = structuredClone(store.exportAll());
    backup.days['2026-08-25'] = materializeDay('2026-08-25', store.getTemplates(), NOW, TODAY);
    const changed = backup.days[TODAY];
    if (changed?.tasks[0]) changed.tasks[0].done = true;

    const preview = store.previewImport(backup);
    expect(preview.ok).toBe(true);
    if (preview.ok) {
      expect(preview.summary.added).toBe(1);
      expect(preview.summary.overwritten).toBe(1);
      expect(preview.summary.unchanged).toBe(0);
    }
    expect(store.dayKeys()).toEqual([TODAY]); // nothing written yet
  });

  it('replaces rather than merges, and keeps a pre-import backup', () => {
    const { kv, store } = fresh();
    store.setDay('2026-08-20', materializeDay('2026-08-20', store.getTemplates(), NOW, TODAY), NOW);
    const backup = structuredClone(store.exportAll());

    store.setDay('2026-08-21', materializeDay('2026-08-21', store.getTemplates(), NOW, TODAY), NOW);
    expect(store.dayKeys()).toHaveLength(2);

    store.importAll(backup);
    expect(store.dayKeys()).toEqual(['2026-08-20']);
    expect(kv.get('rt:backup:preImport')).not.toBeNull();
  });

  it('migrates a v1 backup on import', () => {
    const { store } = fresh();
    store.importAll({ schemaVersion: 1, days: { 'day:2026-08-24': { tasks: { gym: true } } } });
    expect(store.dayKeys()).toEqual(['2026-08-24']);
    expect(store.getDay('2026-08-24')?.tasks.find((t) => t.id === 'gym')?.done).toBe(true);
  });

  it('rejects a malformed file', () => {
    const { store } = fresh();
    expect(store.previewImport({ nope: true }).ok).toBe(false);
    expect(() => store.importAll({ nope: true })).toThrow();
  });
});

describe('settings', () => {
  it('merges patches and notifies subscribers', () => {
    const { store } = fresh();
    let calls = 0;
    const off = store.subscribe(() => {
      calls += 1;
    });
    store.setSettings({ dayCutoffHour: 5 });
    expect(store.getSettings().dayCutoffHour).toBe(5);
    expect(store.getSettings().timezone).toBe('Asia/Bangkok');
    expect(calls).toBe(1);
    off();
    store.setSettings({ dayCutoffHour: 6 });
    expect(calls).toBe(1);
  });
});
