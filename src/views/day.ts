/** Today view, and the same checklist opened for any past date. Spec §5.1. */

import { formatLong, isFutureKey, parseKey } from '../lib/date';
import { previewTasks } from '../lib/day';
import { corePct, hasCoreTasks, pct } from '../lib/stats';
import type { DayRecord, DayStatus, DayTask, TemplateVersion } from '../types';
import { cx, esc } from '../ui/dom';

const STATUS_LABEL: Record<DayStatus, string> = {
  active: 'Tracking',
  rest: 'Rest day',
  skipped: 'Skipped',
};

const taskRow = (t: DayTask, disabled: boolean): string => `
  <li class="${cx('task', t.done && 'task--done', t.core && 'task--core')}">
    <button class="task__hit" type="button" data-action="toggle-task" data-id="${esc(t.id)}"
            ${disabled ? 'disabled' : ''} aria-pressed="${t.done}">
      <span class="task__box" aria-hidden="true">${t.done ? '✓' : ''}</span>
      <span class="task__body">
        <span class="task__name">${esc(t.name)}</span>
        ${t.time ? `<span class="task__time">${esc(t.time)}</span>` : ''}
      </span>
      ${t.core ? '<span class="task__flag" title="Core task">core</span>' : ''}
    </button>
  </li>`;

const meter = (total: number, core: number, showCore: boolean): string => `
  <div class="meter">
    <div class="meter__figure">
      <span class="meter__value">${total}<span class="meter__pct">%</span></span>
      ${showCore ? `<span class="meter__sub">core ${core}%</span>` : ''}
    </div>
    <div class="meter__track" role="img" aria-label="${total}% complete">
      <div class="meter__ghost" style="width:${total}%"></div>
      ${showCore ? `<div class="meter__fill" style="width:${core}%"></div>` : `<div class="meter__fill" style="width:${total}%"></div>`}
    </div>
  </div>`;

const statusChips = (current: DayStatus): string => `
  <div class="chips" role="group" aria-label="Day status">
    ${(['active', 'rest', 'skipped'] as DayStatus[])
      .map(
        (s) => `<button type="button" class="${cx('chip', current === s && 'chip--on', `chip--${s}`)}"
                    data-action="set-status" data-status="${s}" aria-pressed="${current === s}">
                  ${STATUS_LABEL[s]}
                </button>`,
      )
      .join('')}
  </div>`;

export interface DayViewProps {
  dateKey: string;
  todayKey: string;
  record: DayRecord | undefined;
  templates: readonly TemplateVersion[];
  /** True when opened from the Week view rather than being the Today tab. */
  standalone: boolean;
  /** The record predates a template edit and can be re-synced (spec §4.5). */
  outOfSync: boolean;
}

export const renderDay = ({ dateKey, todayKey, record, templates, standalone, outOfSync }: DayViewProps): string => {
  const date = parseKey(dateKey);
  const future = isFutureKey(dateKey, todayKey);
  const preview = record ? null : previewTasks(dateKey, templates);
  const tasks: DayTask[] = record?.tasks ?? preview?.tasks ?? [];
  const dayType = record?.dayType ?? preview?.dayType ?? '';
  const status: DayStatus = record?.status ?? 'active';
  const isRest = status === 'rest';
  const total = pct(tasks);
  const core = corePct(tasks);

  return `
    <section class="day">
      <header class="day__head">
        ${standalone ? '<button class="linkback" type="button" data-action="back">← Week</button>' : ''}
        <p class="day__date">${esc(formatLong(date))}${dateKey === todayKey ? ' <span class="tag">today</span>' : ''}</p>
        <div class="day__titlerow">
          <h1 class="day__type">${esc(dayType || 'No tasks scheduled')}</h1>
          ${future ? '' : '<button class="btn btn--tiny" type="button" data-action="edit-template">Edit tasks</button>'}
        </div>
        ${record?.editedRetroactively ? '<p class="day__retro" title="First logged on a later day">logged later</p>' : ''}
      </header>

      ${
        future
          ? `<p class="empty">This day hasn't happened yet.</p>`
          : `
        ${
          outOfSync
            ? `<div class="confirm">
                 <p class="confirm__text">You changed this weekday's tasks after logging this day. It still shows the old list.</p>
                 <div class="row">
                   <button class="btn btn--primary btn--tiny" type="button" data-action="sync-template">Update this day</button>
                   <button class="btn btn--tiny" type="button" data-action="sync-dismiss">Keep as logged</button>
                 </div>
               </div>`
            : ''
        }
        ${isRest ? '<p class="restnote">Rest day — excluded from the week average.</p>' : meter(total, core, hasCoreTasks(tasks))}
        ${statusChips(status)}
        ${
          tasks.length
            ? `<ul class="tasks">${tasks.map((t) => taskRow(t, isRest)).join('')}</ul>`
            : '<p class="empty">No tasks scheduled for this weekday.</p>'
        }
        ${!record && tasks.length ? '<p class="hint">Nothing logged yet — tap a task to start this day.</p>' : ''}
      `
      }
    </section>`;
};
