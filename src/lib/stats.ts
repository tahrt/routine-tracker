/** Percentage, week-average and habit-progress rules. Spec §6 and §5.3. */

import { addDays, dateKey, parseKey } from './date';
import type { DayRecord, DayTask, HabitId } from '../types';

const weightOf = (t: DayTask): number => (typeof t.weight === 'number' && t.weight > 0 ? t.weight : 1);

/** Weighted completion over a task list. Always computed from a day's snapshot. */
export const pct = (tasks: readonly DayTask[]): number => {
  const total = tasks.reduce((s, t) => s + weightOf(t), 0);
  if (!total) return 0;
  const done = tasks.reduce((s, t) => s + (t.done ? weightOf(t) : 0), 0);
  return Math.round((done / total) * 100);
};

/** Completion over core tasks only — the number that can't be inflated by hygiene tasks. */
export const corePct = (tasks: readonly DayTask[]): number => {
  const core = tasks.filter((t) => t.core);
  return core.length ? pct(core) : pct(tasks);
};

export const hasCoreTasks = (tasks: readonly DayTask[]): boolean => tasks.some((t) => t.core);

export interface WeekSummary {
  /** Mean core % over non-rest records. 0 when nothing is tracked. */
  average: number;
  /** Mean total % over the same records. */
  averageTotal: number;
  tracked: number;
  rest: number;
  untracked: number;
}

/**
 * `keys` is the full 7-day window; `records` may be sparse.
 * Rest days are excluded from the mean; missing days are untracked, not 0%
 * (spec §4.6) — but a day in the future is neither, so pass only elapsed keys.
 */
export const weekSummary = (
  keys: readonly string[],
  records: Readonly<Record<string, DayRecord | undefined>>,
): WeekSummary => {
  let sum = 0;
  let sumTotal = 0;
  let tracked = 0;
  let rest = 0;
  let untracked = 0;

  for (const k of keys) {
    const rec = records[k];
    if (!rec) {
      untracked += 1;
      continue;
    }
    if (rec.status === 'rest') {
      rest += 1;
      continue;
    }
    sum += corePct(rec.tasks);
    sumTotal += pct(rec.tasks);
    tracked += 1;
  }

  return {
    average: tracked ? Math.round(sum / tracked) : 0,
    averageTotal: tracked ? Math.round(sumTotal / tracked) : 0,
    tracked,
    rest,
    untracked,
  };
};

export type HabitDayState = 'done' | 'missed' | 'rest' | 'unscheduled' | 'untracked';

export interface HabitDayPoint {
  date: string;
  state: HabitDayState;
}

export interface HabitProgress {
  habitId: HabitId;
  /** First tracked, non-rest date on which this core habit was scheduled. */
  firstDate: string | null;
  /** Number of tracked, non-rest scheduled days completed. */
  completed: number;
  /** Number of tracked, non-rest days on which the habit was scheduled. */
  scheduled: number;
  /** completed / scheduled, rounded to a whole percent. */
  completionRate: number;
  /** Consecutive successful scheduled opportunities ending at the latest one. */
  currentStreak: number;
  /** Best successful chain across all tracked scheduled opportunities. */
  longestStreak: number;
  /** Today plus the previous six calendar days. */
  recent7: HabitDayPoint[];
}

const habitTasks = (rec: DayRecord, habitId: HabitId): DayTask[] =>
  rec.tasks.filter((t) => t.core && t.habit === habitId);

/**
 * A habit is complete for a day only when every core task mapped to that habit is
 * complete. This keeps the statistic day-based even if a habit gets more than one
 * task on the same date. A skipped day is always an honest miss.
 */
const habitStateForRecord = (rec: DayRecord, habitId: HabitId): HabitDayState => {
  const tasks = habitTasks(rec, habitId);
  if (!tasks.length) return 'unscheduled';
  if (rec.status === 'rest') return 'rest';
  if (rec.status === 'skipped') return 'missed';
  return tasks.every((t) => t.done) ? 'done' : 'missed';
};

/**
 * Lifetime progress for one stable habit id.
 *
 * Only persisted day snapshots are used. Missing records stay "untracked" rather
 * than being invented as failures, matching the app's data-honesty rule (§4.6).
 * Rest days and days where the habit was not scheduled are neutral and do not
 * affect the completion rate or break a streak.
 */
export const habitProgress = (
  habitId: HabitId,
  records: readonly DayRecord[],
  todayKey: string,
): HabitProgress => {
  const byDate = new Map(records.filter((r) => r.date <= todayKey).map((r) => [r.date, r] as const));
  const sorted = [...byDate.values()].sort((a, b) => a.date.localeCompare(b.date));

  let firstDate: string | null = null;
  let completed = 0;
  let scheduled = 0;
  let currentStreak = 0;
  let longestStreak = 0;
  let running = 0;

  for (const rec of sorted) {
    const state = habitStateForRecord(rec, habitId);
    if (state === 'unscheduled' || state === 'rest') continue;
    if (firstDate === null) firstDate = rec.date;

    scheduled += 1;
    if (state === 'done') {
      completed += 1;
      running += 1;
      longestStreak = Math.max(longestStreak, running);
    } else {
      running = 0;
    }
  }
  currentStreak = running;

  const today = parseKey(todayKey);
  const recent7: HabitDayPoint[] = [];
  for (let offset = -6; offset <= 0; offset += 1) {
    const key = dateKey(addDays(today, offset));
    const rec = byDate.get(key);
    recent7.push({ date: key, state: rec ? habitStateForRecord(rec, habitId) : 'untracked' });
  }

  return {
    habitId,
    firstDate,
    completed,
    scheduled,
    completionRate: scheduled ? Math.round((completed / scheduled) * 100) : 0,
    currentStreak,
    longestStreak,
    recent7,
  };
};

/** Copy of a record with one task toggled, plus a fresh updatedAt. */
export const toggleTask = (rec: DayRecord, taskId: string, now: string): DayRecord => ({
  ...rec,
  tasks: rec.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
  updatedAt: now,
});
