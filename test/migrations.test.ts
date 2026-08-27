/** Spec §4.1 — schema versioning and the v1 (prototype) import path. */

import { describe, expect, it } from 'vitest';
import { CURRENT_SCHEMA_VERSION, migrate, needsMigration, validateImport } from '../src/store/migrations';

const legacy = {
  schemaVersion: 1,
  days: {
    // Monday 24 Aug 2026
    'day:2026-08-24': { tasks: { wake: true, gym: true, work: false, ghost: true } },
    'day:2026-08-25': { tasks: { wake: false } },
  },
};

describe('needsMigration', () => {
  it('is true for older blobs and false for current ones', () => {
    expect(needsMigration({ schemaVersion: 1 })).toBe(true);
    expect(needsMigration({ schemaVersion: CURRENT_SCHEMA_VERSION })).toBe(false);
    expect(needsMigration({})).toBe(true); // missing version means v1
  });
});

describe('migrate v1 -> v2', () => {
  const out = migrate(structuredClone(legacy));

  it('stamps the current schema version', () => {
    expect(out.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
  });

  it('creates one template version covering the earliest day', () => {
    expect(out.templates).toHaveLength(1);
    expect(out.templates[0]?.version).toBe(1);
    expect(out.templates[0]?.effectiveFrom).toBe('2026-08-24');
  });

  it('strips the day: prefix from keys', () => {
    expect(Object.keys(out.days).sort()).toEqual(['2026-08-24', '2026-08-25']);
  });

  it('expands the checked-id map into a full task snapshot', () => {
    const day = out.days['2026-08-24'];
    expect(day?.status).toBe('active');
    expect(day?.dayType).toBe('WFH · Gym AM');
    const gym = day?.tasks.find((t) => t.id === 'gym');
    expect(gym?.done).toBe(true);
    expect(gym?.core).toBe(true);
    expect(gym?.habit).toBe('gym');
    expect(day?.tasks.find((t) => t.id === 'work')?.done).toBe(false);
  });

  it('keeps completions whose task no longer exists in the template', () => {
    const ghost = out.days['2026-08-24']?.tasks.find((t) => t.id === 'ghost');
    expect(ghost).toBeDefined();
    expect(ghost?.done).toBe(true);
    expect(ghost?.adhoc).toBe(true);
  });

  it('is idempotent — migrating twice changes nothing', () => {
    expect(migrate(structuredClone(out))).toEqual(out);
  });
});

describe('migrate v3 -> v4 learning progress', () => {
  it('adds empty learning progress without changing existing routine data', () => {
    const v3 = {
      schemaVersion: 3,
      settings: { timezone: 'Asia/Bangkok', dayCutoffHour: 4, weekStartsOn: 1, lastExportAt: null },
      habits: [{ id: 'gym', label: 'Gym', color: 'slate' }],
      templates: [],
      days: { '2026-08-24': { marker: 'keep-me' } },
    };
    const out = migrate(structuredClone(v3));
    expect(out.schemaVersion).toBe(CURRENT_SCHEMA_VERSION);
    expect(out.learningProgress).toEqual({});
    expect((out.days as any)['2026-08-24'].marker).toBe('keep-me');
    expect(out.habits[0]?.id).toBe('gym');
  });
});

describe('migrate guards', () => {
  it('refuses data from a newer schema than this app supports', () => {
    expect(() => migrate({ schemaVersion: 99, days: {} })).toThrow(/newer version/);
  });
});

describe('validateImport', () => {
  it('accepts a well-formed backup', () => {
    expect(validateImport({ schemaVersion: 2, days: {} })).toEqual({ ok: true });
  });

  it('rejects non-objects, missing version, missing days and future versions', () => {
    expect(validateImport(null).ok).toBe(false);
    expect(validateImport('nope').ok).toBe(false);
    expect(validateImport({ days: {} }).ok).toBe(false);
    expect(validateImport({ schemaVersion: 2 }).ok).toBe(false);
    expect(validateImport({ schemaVersion: 999, days: {} }).ok).toBe(false);
  });
});
