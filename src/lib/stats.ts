/** Percentage and week-average rules. Spec §6. */

import type { DayRecord, DayTask } from '../types';

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

/** Copy of a record with one task toggled, plus a fresh updatedAt. */
export const toggleTask = (rec: DayRecord, taskId: string, now: string): DayRecord => ({
  ...rec,
  tasks: rec.tasks.map((t) => (t.id === taskId ? { ...t, done: !t.done } : t)),
  updatedAt: now,
});
