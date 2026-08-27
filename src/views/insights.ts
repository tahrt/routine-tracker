import { LEARNING_PATHS } from '../config/learning';
import { addDays, dateKey, parseKey, weekKeys } from '../lib/date';
import { formatLearningTime, pathStats } from '../lib/learning';
import { habitProgress, weekSummary } from '../lib/stats';
import type { DayRecord, Habit, LearningProgress } from '../types';
import { esc } from '../ui/dom';

export interface InsightsViewProps {
  todayKey: string;
  records: readonly DayRecord[];
  habits: readonly Habit[];
  learningProgress: LearningProgress;
}

const mapRecords = (records: readonly DayRecord[]): Record<string, DayRecord | undefined> =>
  Object.fromEntries(records.map((record) => [record.date, record]));

const meter = (rate: number): string =>
  `<span class="insight-bar"><span style="width:${Math.max(0, Math.min(100, rate))}%"></span></span>`;

export const renderInsights = ({
  todayKey,
  records,
  habits,
  learningProgress,
}: InsightsViewProps): string => {
  const byDate = mapRecords(records);
  const thisWeekKeys = weekKeys(parseKey(todayKey)).filter((key) => key <= todayKey);
  const lastWeekAnchor = dateKey(addDays(parseKey(todayKey), -7));
  const lastWeekKeys = weekKeys(parseKey(lastWeekAnchor));
  const current = weekSummary(thisWeekKeys, byDate);
  const previous = weekSummary(lastWeekKeys, byDate);
  const delta = current.average - previous.average;

  const habitRows = habits
    .map((habit) => ({ habit, stats: habitProgress(habit.id, records, todayKey) }))
    .filter(({ habit, stats }) => (!habit.archived || stats.scheduled > 0) && stats.scheduled > 0)
    .sort((a, b) => b.stats.completionRate - a.stats.completionRate);

  const longest = habitRows.reduce((best, row) => Math.max(best, row.stats.longestStreak), 0);
  const bestCurrent = habitRows.reduce((best, row) => Math.max(best, row.stats.currentStreak), 0);
  const learningStats = LEARNING_PATHS.map((path) => ({ path, stats: pathStats(path, learningProgress) }));
  const learnedMinutes = learningStats.reduce((sum, row) => sum + row.stats.completedMinutes, 0);

  const momentum =
    current.tracked === 0 ? 'Ready' : current.average >= 80 ? 'Strong' : current.average >= 60 ? 'Building' : 'Reset';
  const momentumCopy =
    momentum === 'Strong'
      ? 'You’re building real momentum.'
      : momentum === 'Building'
        ? 'Keep the next few days simple and consistent.'
        : momentum === 'Reset'
          ? 'Pick one important win and restart the chain.'
          : 'Track today to establish your baseline.';

  return `
    <section class="insights">
      <header class="insights__head">
        <p class="day__date">PERSONAL OPERATING SYSTEM</p>
        <h1 class="day__type">Insights</h1>
      </header>

      <section class="insight-hero">
        <div class="insight-ring" style="--rate:${current.average}">
          <div><strong>${current.average}%</strong></div>
        </div>
        <div class="insight-hero__copy">
          <strong>this week</strong>
          <span class="${delta >= 0 ? 'is-positive' : 'is-negative'}">${delta >= 0 ? '▲' : '▼'} ${Math.abs(delta)}% vs last week</span>
          <p>${esc(momentumCopy)}</p>
        </div>
      </section>

      <div class="insight-metrics">
        <div><span>◎ Consistency</span><strong>${current.average}%</strong><small>${current.tracked} tracked days</small></div>
        <div><span>♨ Streaks</span><strong>${bestCurrent}</strong><small>best current</small></div>
        <div><span>◇ Learning</span><strong>${formatLearningTime(learnedMinutes)}</strong><small>core learned</small></div>
      </div>

      <section class="insight-card">
        <div class="insight-card__head"><span>HABITS OVERVIEW</span><small>lifetime</small></div>
        <div class="insight-habits">
          ${habitRows.length
            ? habitRows.slice(0, 7).map(({ habit, stats }) => `
                <div class="insight-habit">
                  <span class="insight-habit__icon">•</span>
                  <strong>${esc(habit.label)}</strong>
                  ${meter(stats.completionRate)}
                  <span>${stats.completionRate}%</span>
                </div>`).join('')
            : '<p class="empty">Track a routine day to unlock habit insights.</p>'
          }
        </div>
      </section>

      <div class="insight-split">
        <section class="insight-card insight-card--compact">
          <div class="insight-card__head"><span>LONGEST STREAK</span></div>
          <strong class="insight-big">${longest} days</strong>
          <p>Consistency compounds.</p>
          <div class="insight-mini-bars" aria-hidden="true">
            ${[35, 54, 69, 62, 81, 74, 94].map((height, index) => `<i style="height:${height}%" class="${index === 6 ? 'is-hot' : ''}"></i>`).join('')}
          </div>
        </section>

        <section class="insight-card insight-card--compact momentum-card">
          <div class="insight-card__head"><span>MOMENTUM</span></div>
          <div class="momentum-mark">↗</div>
          <strong class="insight-big">${momentum}</strong>
          <p>${esc(momentumCopy)}</p>
        </section>
      </div>

      <section class="insight-card">
        <div class="insight-card__head"><span>LEARNING PROGRESS</span><small>core path</small></div>
        <div class="insight-learning">
          ${learningStats.map(({ path, stats }) => `
            <button type="button" data-action="open-learning-path" data-id="${esc(path.id)}">
              <strong>${esc(path.title.replace('Start & Grow a ', '').replace('Great & Reliable ', '').replace('Business ', ''))}</strong>
              ${meter(stats.completionRate)}
              <span>${stats.completionRate}%</span>
              <b>›</b>
            </button>`).join('')}
        </div>
      </section>
    </section>`;
};
