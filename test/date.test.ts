/** Spec §3.5 — the only logic where a bug rewrites the past. */

import { describe, expect, it } from 'vitest';
import {
  addDays,
  dateKey,
  daysBetween,
  formatRange,
  getMonday,
  isFutureKey,
  logicalToday,
  parseKey,
  weekKeys,
  zonedNow,
} from '../src/lib/date';

const TZ = 'Asia/Bangkok';

describe('dateKey', () => {
  it('uses local calendar parts, not UTC', () => {
    // 00:30 on 25 Aug in Bangkok is still 24 Aug 17:30 UTC.
    // toISOString() would say 2026-08-24; the local key must say 2026-08-25.
    const local = new Date(2026, 7, 25, 0, 30, 0);
    expect(dateKey(local)).toBe('2026-08-25');
  });

  it('zero-pads month and day', () => {
    expect(dateKey(new Date(2026, 0, 5))).toBe('2026-01-05');
  });

  it('round-trips through parseKey to local midnight', () => {
    const d = new Date(2026, 7, 24, 13, 45, 30);
    const back = parseKey(dateKey(d));
    expect(back.getFullYear()).toBe(2026);
    expect(back.getMonth()).toBe(7);
    expect(back.getDate()).toBe(24);
    expect(back.getHours()).toBe(0);
    expect(back.getMinutes()).toBe(0);
  });
});

describe('zonedNow', () => {
  it('reads wall-clock time in the target zone', () => {
    // 2026-08-24T17:30:00Z is 2026-08-25 00:30 in Bangkok (UTC+7).
    const z = zonedNow(TZ, new Date('2026-08-24T17:30:00.000Z'));
    expect(dateKey(z)).toBe('2026-08-25');
    expect(z.getHours()).toBe(0);
    expect(z.getMinutes()).toBe(30);
  });

  it('handles midnight without reporting hour 24', () => {
    const z = zonedNow(TZ, new Date('2026-08-24T17:00:00.000Z')); // 00:00 Bangkok
    expect(z.getHours()).toBe(0);
    expect(dateKey(z)).toBe('2026-08-25');
  });

  it('falls back to device time for an unknown zone instead of throwing', () => {
    const now = new Date('2026-08-24T10:00:00.000Z');
    expect(() => zonedNow('Not/AZone', now)).not.toThrow();
  });
});

describe('logicalToday', () => {
  it('is still the previous day at 03:59 local', () => {
    // 2026-08-24T20:59:00Z = 2026-08-25 03:59 Bangkok
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-08-24T20:59:00.000Z')))).toBe('2026-08-24');
  });

  it('rolls over at 04:01 local', () => {
    // 2026-08-24T21:01:00Z = 2026-08-25 04:01 Bangkok
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-08-24T21:01:00.000Z')))).toBe('2026-08-25');
  });

  it('keeps a 23:30 wind-down on its own day', () => {
    // 2026-08-26T16:30:00Z = 2026-08-26 23:30 Bangkok (Wednesday)
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-08-26T16:30:00.000Z')))).toBe('2026-08-26');
  });

  it('keeps a 00:20 tap on the previous day', () => {
    // 2026-08-26T17:20:00Z = 2026-08-27 00:20 Bangkok — still Wednesday's list
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-08-26T17:20:00.000Z')))).toBe('2026-08-26');
  });

  it('crosses a month boundary backwards', () => {
    // 2026-08-31T18:30:00Z = 2026-09-01 01:30 Bangkok -> logical 2026-08-31
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-08-31T18:30:00.000Z')))).toBe('2026-08-31');
  });

  it('crosses a year boundary backwards', () => {
    // 2026-12-31T18:00:00Z = 2027-01-01 01:00 Bangkok -> logical 2026-12-31
    expect(dateKey(logicalToday(TZ, 4, new Date('2026-12-31T18:00:00.000Z')))).toBe('2026-12-31');
  });

  it('returns local midnight', () => {
    const d = logicalToday(TZ, 4, new Date('2026-08-24T10:00:00.000Z'));
    expect([d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds()]).toEqual([0, 0, 0, 0]);
  });

  it('respects a different cutoff hour', () => {
    // 02:30 Bangkok with cutoff 0 belongs to the new day
    const now = new Date('2026-08-24T19:30:00.000Z');
    expect(dateKey(logicalToday(TZ, 0, now))).toBe('2026-08-25');
    expect(dateKey(logicalToday(TZ, 4, now))).toBe('2026-08-24');
  });
});

describe('getMonday', () => {
  it('returns the previous Monday for a Sunday', () => {
    expect(dateKey(getMonday(new Date(2026, 7, 30)))).toBe('2026-08-24'); // Sun 30 Aug 2026
  });

  it('returns the same day for a Monday', () => {
    expect(dateKey(getMonday(new Date(2026, 7, 24)))).toBe('2026-08-24');
  });

  it('crosses a month boundary', () => {
    expect(dateKey(getMonday(new Date(2026, 8, 2)))).toBe('2026-08-31'); // Wed 2 Sep 2026
  });

  it('crosses a year boundary', () => {
    expect(dateKey(getMonday(new Date(2027, 0, 1)))).toBe('2026-12-28'); // Fri 1 Jan 2027
  });

  it('strips the time of day', () => {
    const m = getMonday(new Date(2026, 7, 26, 23, 59));
    expect(m.getHours()).toBe(0);
  });
});

describe('weekKeys', () => {
  it('gives Monday-first keys for the containing week', () => {
    expect(weekKeys(new Date(2026, 7, 30))).toEqual([
      '2026-08-24',
      '2026-08-25',
      '2026-08-26',
      '2026-08-27',
      '2026-08-28',
      '2026-08-29',
      '2026-08-30',
    ]);
  });
});

describe('addDays / daysBetween', () => {
  it('crosses month boundaries', () => {
    expect(dateKey(addDays(new Date(2026, 7, 31), 1))).toBe('2026-09-01');
    expect(dateKey(addDays(new Date(2026, 8, 1), -1))).toBe('2026-08-31');
  });

  it('counts whole days regardless of time', () => {
    expect(daysBetween(new Date(2026, 7, 24, 23), new Date(2026, 7, 25, 1))).toBe(1);
  });
});

describe('isFutureKey', () => {
  it('compares date keys lexicographically', () => {
    expect(isFutureKey('2026-08-25', '2026-08-24')).toBe(true);
    expect(isFutureKey('2026-08-24', '2026-08-24')).toBe(false);
    expect(isFutureKey('2026-07-31', '2026-08-01')).toBe(false);
    expect(isFutureKey('2027-01-01', '2026-12-31')).toBe(true);
  });
});

describe('formatRange', () => {
  it('renders a Mon–Sun span', () => {
    expect(formatRange(new Date(2026, 7, 24), new Date(2026, 7, 30))).toBe('24 Aug – 30 Aug 2026');
  });

  it('shows both years when the week straddles new year', () => {
    expect(formatRange(new Date(2026, 11, 28), new Date(2027, 0, 3))).toBe('28 Dec 2026 – 3 Jan 2027');
  });
});
