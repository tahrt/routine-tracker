/** Weekday template editor. Spec §5.4 — edits the recurring weekday, not one date. */

import type { DayTemplate, Habit, WeekTemplate } from '../types';
import { cx, esc } from '../ui/dom';

const WEEKDAY_LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
/** Monday-first, matching the Week view. */
const ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

export interface EditTemplateProps {
  /** Date.getDay() value of the weekday currently being edited. */
  weekday: number;
  /** Unsaved draft of all seven weekdays — switching days keeps your edits. */
  draft: WeekTemplate;
  /** Weekdays whose draft differs from what is saved. */
  dirty: readonly number[];
  /** Persistent registry: labels may change, ids stay stable. */
  habits: readonly Habit[];
}

const habitOptions = (habits: readonly Habit[], selected: string | null | undefined): string =>
  [`<option value=""${selected ? '' : ' selected'}>No habit</option>`]
    .concat(
      habits
        .filter((h) => !h.archived || selected === h.id)
        .map(
          (h) =>
            `<option value="${esc(h.id)}"${selected === h.id ? ' selected' : ''}>${esc(h.label)}${h.archived ? ' (archived)' : ''}</option>`,
        ),
    )
    .join('');

const dayPicker = (weekday: number, dirty: readonly number[]): string => `
  <div class="daypick" role="group" aria-label="Weekday to edit">
    ${ORDER.map(
      (d) => `<button type="button" class="${cx('daypick__btn', d === weekday && 'is-active', dirty.includes(d) && 'is-dirty')}"
                 data-action="edit-weekday" data-weekday="${d}" aria-pressed="${d === weekday}">
                ${esc(WEEKDAY_SHORT[d] ?? '')}
              </button>`,
    ).join('')}
  </div>`;

const taskEditor = (
  task: DayTemplate['tasks'][number],
  index: number,
  count: number,
  habits: readonly Habit[],
): string => `
  <li class="edit-task">
    <div class="edit-task__row">
      <input class="field__input edit-task__name" type="text" value="${esc(task.name)}"
             placeholder="Task name" data-action="edit-name" data-index="${index}" />
      <div class="edit-task__order">
        <button class="iconbtn" type="button" data-action="task-move" data-index="${index}" data-dir="-1"
                ${index === 0 ? 'disabled' : ''} aria-label="Move up">↑</button>
        <button class="iconbtn" type="button" data-action="task-move" data-index="${index}" data-dir="1"
                ${index === count - 1 ? 'disabled' : ''} aria-label="Move down">↓</button>
      </div>
    </div>
    <div class="edit-task__row">
      <input class="field__input edit-task__time" type="text" value="${esc(task.time)}"
             placeholder="e.g. 19:00–20:30" data-action="edit-time" data-index="${index}" />
      <select class="field__input edit-task__habit" data-action="edit-habit" data-index="${index}"
              aria-label="Habit">${habitOptions(habits, task.habit)}</select>
    </div>
    <div class="edit-task__row edit-task__row--foot">
      <button class="chip ${task.core ? 'chip--on chip--active' : ''}" type="button"
              data-action="task-core" data-index="${index}" aria-pressed="${task.core === true}">
        ${task.core ? '★ Core task' : '☆ Core task'}
      </button>
      <button class="btn btn--tiny btn--danger" type="button" data-action="task-delete" data-index="${index}">Delete</button>
    </div>
  </li>`;

export const renderEditTemplate = ({ weekday, draft, dirty, habits }: EditTemplateProps): string => {
  const day = draft[weekday] ?? { type: '', tasks: [] };
  const long = WEEKDAY_LONG[weekday] ?? '';

  return `
    <section class="edit">
      <header class="day__head">
        <button class="linkback" type="button" data-action="edit-cancel">← Cancel</button>
        <h1 class="day__type">Edit tasks</h1>
      </header>

      ${dayPicker(weekday, dirty)}

      <p class="hint hint--tight">
        Editing <strong>every ${esc(long)}</strong>, from today on. Days you have already logged keep the
        tasks they were logged with, so past percentages don't change.
        ${dirty.length > 1 ? ' You have unsaved edits on more than one weekday — saving applies them all.' : ''}
      </p>

      <label class="field">
        <span class="field__label">Day label</span>
        <input class="field__input" type="text" value="${esc(day.type)}"
               placeholder="e.g. WFH · Gym AM" data-action="edit-type" />
      </label>

      <ul class="edit-tasks">
        ${day.tasks.map((t, i) => taskEditor(t, i, day.tasks.length, habits)).join('')}
      </ul>

      ${day.tasks.length === 0 ? `<p class="empty">No tasks on ${esc(long)}s yet.</p>` : ''}

      <div class="row row--spread">
        <button class="btn" type="button" data-action="task-add">+ Add task</button>
        <button class="btn btn--primary" type="button" data-action="edit-save"
                ${dirty.length === 0 ? 'disabled' : ''}>Save changes</button>
      </div>
    </section>`;
};
