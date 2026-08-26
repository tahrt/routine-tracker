/** Settings — backup, import, time rules, danger zone. Spec §5.6–§5.7. */

import { CURRENT_SCHEMA_VERSION } from '../store/migrations';
import type { Habit, Settings } from '../types';
import { esc } from '../ui/dom';

const COMMON_ZONES = [
  'Asia/Bangkok',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Europe/London',
  'Europe/Berlin',
  'America/New_York',
  'America/Los_Angeles',
  'UTC',
];

export interface PendingImport {
  fileName: string;
  added: number;
  overwritten: number;
  unchanged: number;
}

export interface SettingsViewProps {
  settings: Settings;
  habits: readonly Habit[];
  dayCount: number;
  templateCount: number;
  ephemeral: boolean;
  rawOpen: boolean;
  raw: string;
  resetArmed: boolean;
  pendingImport: PendingImport | null;
}

const daysSince = (iso: string | null): number | null => {
  if (!iso) return null;
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return null;
  return Math.floor((Date.now() - then) / 86_400_000);
};

export const renderSettings = ({
  settings,
  habits,
  dayCount,
  templateCount,
  ephemeral,
  rawOpen,
  raw,
  resetArmed,
  pendingImport,
}: SettingsViewProps): string => {
  const since = daysSince(settings.lastExportAt);

  return `
    <section class="settings">
      <h1 class="settings__title">Settings</h1>

      ${
        ephemeral
          ? `<p class="warn">Browser storage is unavailable (private window?). Data is kept in memory only and will be lost when this tab closes.</p>`
          : ''
      }

      <div class="card">
        <h2 class="card__title">Backup</h2>
        <p class="card__note">
          ${dayCount} day${dayCount === 1 ? '' : 's'} logged · ${templateCount} template version${templateCount === 1 ? '' : 's'}.
          ${since === null ? 'Never exported.' : `Last export ${since === 0 ? 'today' : `${since} day${since === 1 ? '' : 's'} ago`}.`}
        </p>
        <p class="card__note card__note--dim">
          Local storage is one cache clear away from empty. Export monthly and keep the file somewhere real.
        </p>
        <div class="row">
          <button class="btn btn--primary" type="button" data-action="export">Export JSON</button>
          <button class="btn" type="button" data-action="import-pick">Import JSON…</button>
        </div>
        <input id="import-file" class="visually-hidden" type="file" accept="application/json,.json" />
        ${
          pendingImport
            ? `<div class="confirm">
                 <p class="confirm__text">
                   <strong>${esc(pendingImport.fileName)}</strong> replaces your current data:
                   adds ${pendingImport.added}, overwrites ${pendingImport.overwritten}, leaves ${pendingImport.unchanged} unchanged.
                   Days not in the file are removed.
                 </p>
                 <div class="row">
                   <button class="btn btn--primary" type="button" data-action="import-confirm">Replace my data</button>
                   <button class="btn" type="button" data-action="import-cancel">Cancel</button>
                 </div>
               </div>`
            : ''
        }
      </div>

      <div class="card">
        <h2 class="card__title">Weekly schedule</h2>
        <p class="card__note">Add, rename, reorder or remove tasks on any weekday.</p>
        <div class="row">
          <button class="btn" type="button" data-action="edit-template">Edit tasks</button>
        </div>
      </div>

      <div class="card">
        <h2 class="card__title">Habits</h2>
        <p class="card__note">Rename a habit without resetting its Progress history. The stable id stays unchanged.</p>
        ${habits
          .map(
            (habit) => `<div class="field">
              <span class="field__label">${esc(habit.id)}${habit.archived ? ' · archived' : ''}</span>
              <div class="row">
                <input class="field__input" type="text" value="${esc(habit.label)}"
                       data-action="set-habit-label" data-id="${esc(habit.id)}" />
                <button class="btn btn--tiny" type="button" data-action="toggle-habit-archive"
                        data-id="${esc(habit.id)}" data-archived="${habit.archived === true}">
                  ${habit.archived ? 'Restore' : 'Archive'}
                </button>
              </div>
            </div>`,
          )
          .join('')}
        <div class="field">
          <span class="field__label">New habit</span>
          <div class="row">
            <input id="new-habit-label" class="field__input" type="text" placeholder="e.g. Morning run" />
            <button class="btn" type="button" data-action="add-habit">+ Add habit</button>
          </div>
        </div>
      </div>

      <div class="card">
        <h2 class="card__title">Time</h2>
        <label class="field">
          <span class="field__label">Home timezone</span>
          <input class="field__input" type="text" list="tz-list" value="${esc(settings.timezone)}"
                 data-action="set-timezone" spellcheck="false" autocapitalize="off" />
          <datalist id="tz-list">${COMMON_ZONES.map((z) => `<option value="${esc(z)}"></option>`).join('')}</datalist>
          <span class="field__hint">Dates follow this zone, so travelling doesn't shift your history.</span>
        </label>
        <label class="field">
          <span class="field__label">Day starts at</span>
          <input class="field__input field__input--num" type="number" min="0" max="12" step="1"
                 value="${settings.dayCutoffHour}" data-action="set-cutoff" />
          <span class="field__hint">Taps before ${settings.dayCutoffHour}:00 still count for the previous day.</span>
        </label>
      </div>

      <div class="card">
        <h2 class="card__title">Data</h2>
        <p class="card__note">Schema v${CURRENT_SCHEMA_VERSION}. Weeks run Monday to Sunday.</p>
        <div class="row">
          <button class="btn" type="button" data-action="toggle-raw">${rawOpen ? 'Hide' : 'View'} raw data</button>
        </div>
        ${rawOpen ? `<pre class="raw">${esc(raw)}</pre>` : ''}
      </div>

      <div class="card card--danger">
        <h2 class="card__title">Danger zone</h2>
        ${
          resetArmed
            ? `<p class="card__note">Type <code>ERASE</code> to wipe every day record and reset templates. Export first.</p>
               <div class="row">
                 <input class="field__input" type="text" id="reset-confirm" placeholder="ERASE" autocapitalize="characters" spellcheck="false" />
                 <button class="btn btn--danger" type="button" data-action="reset-confirm">Erase everything</button>
                 <button class="btn" type="button" data-action="reset-cancel">Cancel</button>
               </div>`
            : `<div class="row"><button class="btn btn--danger" type="button" data-action="reset-arm">Reset all data…</button></div>`
        }
      </div>
    </section>`;
};
