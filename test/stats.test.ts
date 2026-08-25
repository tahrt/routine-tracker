/** Spec §6 — percentage, week-average and habit-progress rules. */

import { describe, expect, it } from 'vitest';
import { corePct, habitProgress, pct, toggleTask, weekSummary } from '../src/lib/stats';
import type { DayRecord, DayStatus, DayTask } from '../src/types';

const task = (id: string, done: boolean, extra: Partial<DayTask> = {}): DayTask => ({
  id,
  name: id,
  time: '',
  core: false,
  habit: null,
  weight: 1,
  done,
  adhoc: false,
  ...extra,
});

const record = (date: string, tasks: DayTask[], status: DayStatus = 'active'): DayRecord => ({
  date,
  status,
  dayType: 'Test',
  templateVersion: 1,
  tasks,
  note: '',
  createdAt: '2026-08-24T00:00:00.000Z',
  updatedAt: '2026-08-24T00:00:00.000Z',
  editedRetroactively: false,
});

const habitTask = (habit: string, done: boolean): DayTask => task(habit, done, { core: true, habit });

describe('pct', () => {
  it('is 0 for an empty list rather than NaN', () => {
    expect(pct([])).toBe(0);
  });

  it('rounds to whole percent', () => {
    expect(pct([task('a', true), task('b', false), task('c', false)])).toBe(33);
  });

  it('honours weights', () => {
    expect(pct([task('a', true, { weight: 3 }), task('b', false, { weight: 1 })])).toBe(75);
  });

  it('treats a missing or invalid weight as 1', () => {
    const odd = { ...task('a', true), weight: 0 } as DayTask;
    expect(pct([odd, task('b', false)])).toBe(50);
  });
});

describe('corePct', () => {
  it('ignores non-core tasks when core tasks exist', () => {
    const tasks = [
      task('wake', true),
      task('winddown', true),
      task('gym', false, { core: true }),
      task('work', true, { core: true }),
    ];
    expect(pct(tasks)).toBe(75);
    expect(corePct(tasks)).toBe(50);
  });

  it('falls back to all tasks when nothing is marked core', () => {
    const tasks = [task('a', true), task('b', false)];
    expect(corePct(tasks)).toBe(50);
  });
});

describe('weekSummary', () => {
  const keys = ['2026-08-24', '2026-08-25', '2026-08-26'];

  it('excludes rest days from the average', () => {
    const records = {
      '2026-08-24': record('2026-08-24', [task('a', true), task('b', true)]),
      '2026-08-25': record('2026-08-25', [task('a', false), task('b', false)], 'rest'),
      '2026-08-26': record('2026-08-26', [task('a', true), task('b', false)]),
    };
    const s = weekSummary(keys, records);
    expect(s.average).toBe(75); // (100 + 50) / 2, not /3
    expect(s.tracked).toBe(2);
    expect(s.rest).toBe(1);
    expect(s.untracked).toBe(0);
  });

  it('counts a skipped day as an honest 0%', () => {
    const records = {
      '2026-08-24': record('2026-08-24', [task('a', true)]),
      '2026-08-25': record('2026-08-25', [task('a', false)], 'skipped'),
      '2026-08-26': record('2026-08-26', [task('a', true)]),
    };
    const s = weekSummary(keys, records);
    expect(s.average).toBe(67);
    expect(s.tracked).toBe(3);
  });

  it('treats a missing record as untracked, not zero', () => {
    const records = { '2026-08-24': record('2026-08-24', [task('a', true)]) };
    const s = weekSummary(keys, records);
    expect(s.average).toBe(100);
    expect(s.untracked).toBe(2);
    expect(s.tracked).toBe(1);
  });

  it('returns 0 with nothing tracked instead of NaN', () => {
    const s = weekSummary(keys, {});
    expect(s.average).toBe(0);
    expect(s.untracked).toBe(3);
  });

  it('reports core and total averages separately', () => {
    const records = {
      '2026-08-24': record('2026-08-24', [task('wake', true), task('gym', false, { core: true })]),
    };
    const s = weekSummary(['2026-08-24'], records);
    expect(s.average).toBe(0); // core: gym not done
    expect(s.averageTotal).toBe(50);
  });
});

describe('habitProgress', () => {
  it('calculates lifetime completion from tracked scheduled days only', () => {
    const records = [
      record('2026-08-20', [habitTask('gym', true)]),
      record('2026-08-21', [habitTask('gym', false)]),
      record('2026-08-22', [task('learning', true, { core: true, habit: 'learning' })]),
      record('2026-08-23', [habitTask('gym', true)]),
    ];
    const s = habitProgress('gym', records, '2026-08-24');
    expect(s.firstDate).toBe('2026-08-20');
    expect(s.completed).toBe(2);
    expect(s.scheduled).toBe(3);
    expect(s.completionRate).toBe(67);
  });

  it('keeps rest, unscheduled and untracked days neutral for streaks', () => {
    const records = [
      record('2026-08-17', [habitTask('gym', true)]),
      record('2026-08-18', [task('work', true, { core: true, habit: 'work' })]),
      record('2026-08-19', [habitTask('gym', false)], 'rest'),
      // 20 Aug has no record at all.
      record('2026-08-21', [habitTask('gym', true)]),
      record('2026-08-24', [habitTask('gym', true)]),
    ];
    const s = habitProgress('gym', records, '2026-08-24');
    expect(s.currentStreak).toBe(3);
    expect(s.longestStreak).toBe(3);
    expect(s.scheduled).toBe(3);
    expect(s.completed).toBe(3);
  });

  it('breaks a streak on an active miss or skipped scheduled day', () => {
    const records = [
      record('2026-08-17', [habitTask('gym', true)]),
      record('2026-08-19', [habitTask('gym', false)]),
      record('2026-08-21', [habitTask('gym', true)]),
      record('2026-08-24', [habitTask('gym', true)], 'skipped'),
    ];
    const s = habitProgress('gym', records, '2026-08-24');
    expect(s.longestStreak).toBe(1);
    expect(s.currentStreak).toBe(0);
    expect(s.completionRate).toBe(50);
  });

  it('marks the recent seven calendar days with distinct states', () => {
    const records = [
      record('2026-08-19', [habitTask('gym', true)]),
      record('2026-08-20', [habitTask('gym', false)]),
      record('2026-08-21', [habitTask('gym', false)], 'rest'),
      record('2026-08-22', [habitTask('work', true)]),
    ];
    const s = habitProgress('gym', records, '2026-08-24');
    expect(s.recent7.map((d) => d.state)).toEqual([
      'untracked',
      'done',
      'missed',
      'rest',
      'unscheduled',
      'untracked',
      'untracked',
    ]);
  });
});

describe('toggleTask', () => {
  it('flips one task and leaves the rest untouched', () => {
    const rec = record('2026-08-24', [task('a', false), task('b', true)]);
    const next = toggleTask(rec, 'a', '2026-08-24T09:00:00.000Z');
    expect(next.tasks.map((t) => t.done)).toEqual([true, true]);
    expect(next.updatedAt).toBe('2026-08-24T09:00:00.000Z');
    expect(rec.tasks[0]?.done).toBe(false); // original not mutated
  });

  it('is a no-op for an unknown id', () => {
    const rec = record('2026-08-24', [task('a', false)]);
    expect(toggleTask(rec, 'nope', 'x').tasks.map((t) => t.done)).toEqual([false]);
  });
});
