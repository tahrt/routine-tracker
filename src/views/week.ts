/** This Week view — Mon–Sun skyline. Spec §5.2. */

import { WEEKDAY_LABELS } from '../config/schedule';
import { addDays, formatRange, getMonday, isFutureKey, parseKey, weekKeys } from '../lib/date';
import { corePct, pct, weekSummary } from '../lib/stats';
import type { DayRecord } from '../types';
import { cx, esc } from '../ui/dom';

export interface WeekViewProps {
  /** Any date inside the week being viewed. */
  anchorKey: string;
  todayKey: string;
  records: Readonly<Record<string, DayRecord | undefined>>;
  planningHtml?: string;
}

const bar = (key: string, todayKey: string, rec: DayRecord | undefined): string => {
  const d = parseKey(key);
  const label = WEEKDAY_LABELS[d.getDay()] ?? '';
  const future = isFutureKey(key, todayKey);
  const isToday = key === todayKey;
  const rest = rec?.status === 'rest';
  const core = rec ? corePct(rec.tasks) : 0;
  const total = rec ? pct(rec.tasks) : 0;

  const state = future ? 'future' : rest ? 'rest' : rec ? 'tracked' : 'untracked';
  const inner = rest
    ? '<span class="bar__rest">R</span>'
    : `<span class="bar__ghost" style="height:${total}%"></span><span class="bar__fill" style="height:${core}%"></span>`;

  return `
    <${future ? 'div' : 'button'} class="${cx('bar', `bar--${state}`, isToday && 'bar--today')}"
      ${future ? '' : `type="button" data-action="open-day" data-date="${esc(key)}"`}
      ${future ? '' : `aria-label="${esc(label)} ${core}%"`}>
      <span class="bar__col">${inner}</span>
      <span class="bar__pct">${future ? '' : rest ? '—' : rec ? `${core}%` : '·'}</span>
      <span class="bar__day">${esc(label)}</span>
    </${future ? 'div' : 'button'}>`;
};

export const renderWeek = ({ anchorKey, todayKey, records, planningHtml = '' }: WeekViewProps): string => {
  const anchor = parseKey(anchorKey);
  const monday = getMonday(anchor);
  const keys = weekKeys(anchor);
  const elapsed = keys.filter((k) => !isFutureKey(k, todayKey));
  const sum = weekSummary(elapsed, records);
  const atCurrentWeek = getMonday(parseKey(todayKey)).getTime() === monday.getTime();

  const parts = [`${sum.tracked} of ${elapsed.length} day${elapsed.length === 1 ? '' : 's'} tracked`];
  if (sum.rest) parts.push(`${sum.rest} rest`);
  if (sum.untracked) parts.push(`${sum.untracked} untracked`);

  return `
    <section class="week">
      <div class="today-view-toggle today-view-toggle--week" role="group" aria-label="Today or week">
        <button type="button" data-action="today-mode" data-mode="today">Today</button>
        <button class="is-active" type="button" data-action="today-mode" data-mode="week">Week</button>
      </div>
      <header class="week__head">
        <button class="navbtn" type="button" data-action="week-nav" data-delta="-1" aria-label="Previous week">‹</button>
        <div class="week__title">
          <p class="week__range">${esc(formatRange(monday, addDays(monday, 6)))}</p>
          <p class="week__meta">${esc(parts.join(' · '))}</p>
        </div>
        <button class="navbtn" type="button" data-action="week-nav" data-delta="1"
          aria-label="Next week" ${atCurrentWeek ? 'disabled' : ''}>›</button>
      </header>

      ${planningHtml}

      <div class="week__avg">
        <span class="week__avgvalue">${sum.average}<span class="meter__pct">%</span></span>
        <span class="week__avglabel">week average${sum.averageTotal !== sum.average ? ` · total ${sum.averageTotal}%` : ''}</span>
      </div>

      <div class="chart">${keys.map((k) => bar(k, todayKey, records[k])).join('')}</div>

      <p class="hint">Tap any past day to log it. Rest days are excluded from the average.</p>
    </section>`;
};
