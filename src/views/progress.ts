/** Lifetime core-activity progress and habit streaks. Spec §5.3. */

import { WEEKDAY_LABELS } from '../config/schedule';
import { formatLong, parseKey } from '../lib/date';
import { habitProgress, type HabitDayState } from '../lib/stats';
import type { DayRecord, Habit } from '../types';
import { esc } from '../ui/dom';

export interface ProgressViewProps {
  todayKey: string;
  records: readonly DayRecord[];
  habits: readonly Habit[];
}

const STATE_LABEL: Record<HabitDayState, string> = {
  done: 'done',
  missed: 'missed',
  rest: 'rest day',
  unscheduled: 'not scheduled',
  untracked: 'untracked',
};

const dotText = (state: HabitDayState): string => {
  if (state === 'done') return '✓';
  if (state === 'missed') return '×';
  if (state === 'rest') return 'R';
  if (state === 'unscheduled') return '·';
  return '';
};

export const renderProgress = ({ todayKey, records, habits }: ProgressViewProps): string => {
  const rows = habits.map((habit) => ({ habit, stats: habitProgress(habit.id, records, todayKey) }));
  const withHistory = rows.filter(({ stats }) => stats.scheduled > 0);
  const bestCurrent = withHistory.reduce((best, row) => Math.max(best, row.stats.currentStreak), 0);

  return `
    <section class="progress">
      <header class="progress__head">
        <p class="day__date">CORE ACTIVITY HISTORY</p>
        <h1 class="day__type">Progress</h1>
        <p class="progress__intro">Lifetime completion uses only days you actually tracked. Rest, unscheduled and untracked days stay neutral.</p>
      </header>

      <div class="progress__summary">
        <div class="progress__summaryitem">
          <span class="progress__summaryvalue">${withHistory.length}</span>
          <span class="progress__summarylabel">activities tracked</span>
        </div>
        <div class="progress__summaryitem">
          <span class="progress__summaryvalue">${bestCurrent}</span>
          <span class="progress__summarylabel">best current streak</span>
        </div>
      </div>

      <div class="progress__list">
        ${rows
          .map(({ habit, stats }) => {
            const first = stats.firstDate ? formatLong(parseKey(stats.firstDate)) : null;
            return `
              <article class="progress-card">
                <div class="progress-card__top">
                  <div>
                    <h2 class="progress-card__name">${esc(habit.label)}</h2>
                    <p class="progress-card__meta">${
                      first
                        ? `${stats.completed} of ${stats.scheduled} tracked day${stats.scheduled === 1 ? '' : 's'} · since ${esc(first)}`
                        : 'No tracked days yet'
                    }</p>
                  </div>
                  <span class="progress-card__rate">${stats.completionRate}<span class="meter__pct">%</span></span>
                </div>

                <div class="progress-card__meter" role="img" aria-label="${esc(habit.label)} ${stats.completionRate}% lifetime completion">
                  <span class="progress-card__meterfill" style="width:${stats.completionRate}%"></span>
                </div>

                <div class="progress-card__streaks">
                  <span><strong>${stats.currentStreak}</strong> day current</span>
                  <span><strong>${stats.longestStreak}</strong> day best</span>
                </div>

                <div class="streak-week" aria-label="Last 7 days for ${esc(habit.label)}">
                  ${stats.recent7
                    .map((point) => {
                      const d = parseKey(point.date);
                      const day = WEEKDAY_LABELS[d.getDay()] ?? '';
                      return `<span class="streak-day" title="${esc(point.date)} · ${STATE_LABEL[point.state]}">
                                <span class="streak-dot streak-dot--${point.state}" aria-label="${esc(point.date)} ${STATE_LABEL[point.state]}">${dotText(point.state)}</span>
                                <span class="streak-day__label">${esc(day.slice(0, 1))}</span>
                              </span>`;
                    })
                    .join('')}
                </div>
              </article>`;
          })
          .join('')}
      </div>

      <p class="hint">A streak advances only on scheduled, tracked days. Rest days and days without that activity do not break the chain.</p>
    </section>`;
};
