/**
 * App state, rendering and event wiring.
 *
 * Exposed as startApp() returning a dispose function so nothing happens on
 * import and the listeners/timer can be torn down (used by the integration tests).
 */

import { addDays, dateKey, isFutureKey, parseKey, todayKey as computeTodayKey, weekKeys } from './lib/date';
import { materializeDay } from './lib/day';
import { toggleTask } from './lib/stats';
import { getStore, storageIsEphemeral } from './store';
import type { DayRecord, DayStatus } from './types';
import { toast } from './ui/dom';
import { renderDay } from './views/day';
import { renderSettings, type PendingImport } from './views/settings';
import { renderWeek } from './views/week';

type Tab = 'today' | 'week' | 'settings';

interface AppState {
  tab: Tab;
  /** Any date inside the week shown by the Week tab. */
  weekAnchor: string;
  /** Set when a specific day is opened from the Week view. */
  openDay: string | null;
  rawOpen: boolean;
  resetArmed: boolean;
  pendingImport: (PendingImport & { raw: unknown }) | null;
  nudgeDismissed: boolean;
}

export const startApp = (): (() => void) => {
  const store = getStore();
  const nowIso = (): string => new Date().toISOString();

  const today = (): string => {
    const s = store.getSettings();
    return computeTodayKey(s.timezone, s.dayCutoffHour);
  };

  store.init(nowIso(), today());

  const state: AppState = {
    tab: 'today',
    weekAnchor: today(),
    openDay: null,
    rawOpen: false,
    resetArmed: false,
    pendingImport: null,
    nudgeDismissed: false,
  };

  /* ------------------------------------------------------------------ records */

  /** Create the record on first interaction, snapshotting the template (spec §4.5). */
  const ensureRecord = (dateK: string): DayRecord => {
    const existing = store.getDay(dateK);
    if (existing) return existing;
    const rec = materializeDay(dateK, store.getTemplates(), nowIso(), today());
    store.setDay(dateK, rec, rec.updatedAt);
    return rec;
  };

  const recordsFor = (keys: readonly string[]): Record<string, DayRecord | undefined> => {
    const out: Record<string, DayRecord | undefined> = {};
    for (const k of keys) out[k] = store.getDay(k);
    return out;
  };

  /* -------------------------------------------------------------------- nudge */

  const shouldNudgeBackup = (): boolean => {
    if (state.nudgeDismissed) return false;
    const { lastExportAt } = store.getSettings();
    const days = store.dayKeys().length;
    if (lastExportAt === null) return days >= 14;
    const age = (Date.now() - new Date(lastExportAt).getTime()) / 86_400_000;
    return age > 30;
  };

  /* ------------------------------------------------------------------- render */

  const tabBar = (tab: Tab): string =>
    (
      [
        ['today', 'Today'],
        ['week', 'Week'],
        ['settings', 'Settings'],
      ] as [Tab, string][]
    )
      .map(
        ([id, label]) =>
          `<button type="button" class="tabbar__btn${tab === id ? ' is-active' : ''}" data-action="tab" data-tab="${id}"
             aria-current="${tab === id}">${label}</button>`,
      )
      .join('');

  const render = (): void => {
    const root = document.getElementById('app');
    if (!root) return;
    const t = today();
    const templates = store.getTemplates();

    let body: string;
    if (state.tab === 'today' || state.openDay) {
      const dateK = state.openDay ?? t;
      body = renderDay({
        dateKey: dateK,
        todayKey: t,
        record: store.getDay(dateK),
        templates,
        standalone: state.openDay !== null,
      });
    } else if (state.tab === 'week') {
      body = renderWeek({ anchorKey: state.weekAnchor, todayKey: t, records: recordsFor(weekKeys(parseKey(state.weekAnchor))) });
    } else {
      body = renderSettings({
        settings: store.getSettings(),
        dayCount: store.dayKeys().length,
        templateCount: templates.length,
        ephemeral: storageIsEphemeral,
        rawOpen: state.rawOpen,
        raw: state.rawOpen ? JSON.stringify(store.exportAll(), null, 2) : '',
        resetArmed: state.resetArmed,
        pendingImport: state.pendingImport,
      });
    }

    const nudge =
      state.tab === 'today' && !state.openDay && shouldNudgeBackup()
        ? `<div class="nudge">
             <span>Back up your history — it only lives in this browser.</span>
             <button class="btn btn--tiny" type="button" data-action="goto-backup">Export</button>
             <button class="nudge__x" type="button" data-action="dismiss-nudge" aria-label="Dismiss">×</button>
           </div>`
        : '';

    root.innerHTML = `${nudge}<main class="main">${body}</main><nav class="tabbar">${tabBar(state.tab)}</nav>`;
  };

  /* ------------------------------------------------------------------ actions */

  const openTab = (tab: Tab): void => {
    state.tab = tab;
    state.openDay = null;
    if (tab === 'week') state.weekAnchor = today();
    render();
  };

  const activeDayKey = (): string => state.openDay ?? today();

  const mutateDay = (fn: (rec: DayRecord) => DayRecord): void => {
    const dateK = activeDayKey();
    if (isFutureKey(dateK, today())) return;
    const next = fn(ensureRecord(dateK));
    store.setDay(dateK, next, nowIso());
    render();
  };

  const downloadExport = (): void => {
    const data = store.exportAll();
    const stamp = dateKey(new Date());
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `routine-backup-${stamp}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    store.setSettings({ lastExportAt: nowIso() });
    state.nudgeDismissed = true;
    toast('Backup downloaded.');
    render();
  };

  const handleImportFile = async (file: File): Promise<void> => {
    let raw: unknown;
    try {
      raw = JSON.parse(await file.text());
    } catch {
      toast('That file is not valid JSON.', 'error');
      return;
    }
    const preview = store.previewImport(raw);
    if (!preview.ok) {
      toast(preview.error, 'error');
      return;
    }
    state.pendingImport = { raw, fileName: file.name, ...preview.summary };
    render();
  };

  const ACTIONS: Record<string, (el: HTMLElement) => void> = {
    tab: (el) => openTab((el.dataset.tab as Tab) ?? 'today'),

    back: () => {
      state.openDay = null;
      state.tab = 'week';
      render();
    },

    'open-day': (el) => {
      const date = el.dataset.date;
      if (!date || isFutureKey(date, today())) return;
      state.openDay = date;
      render();
    },

    'week-nav': (el) => {
      const delta = Number(el.dataset.delta ?? 0);
      const next = dateKey(addDays(parseKey(state.weekAnchor), delta * 7));
      // Never navigate past the current real week.
      if (delta > 0 && next > today()) return;
      state.weekAnchor = next;
      render();
    },

    'toggle-task': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      mutateDay((rec) => (rec.status === 'rest' ? rec : toggleTask(rec, id, nowIso())));
    },

    'set-status': (el) => {
      const status = el.dataset.status as DayStatus | undefined;
      if (!status) return;
      mutateDay((rec) => ({ ...rec, status }));
    },

    export: downloadExport,
    'goto-backup': () => openTab('settings'),
    'dismiss-nudge': () => {
      state.nudgeDismissed = true;
      render();
    },

    'import-pick': () => document.getElementById('import-file')?.click(),

    'import-confirm': () => {
      const pending = state.pendingImport;
      if (!pending) return;
      try {
        const summary = store.importAll(pending.raw);
        state.pendingImport = null;
        state.weekAnchor = today();
        state.openDay = null;
        toast(`Imported ${summary.added + summary.overwritten + summary.unchanged} days.`);
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Import failed.', 'error');
      }
      render();
    },

    'import-cancel': () => {
      state.pendingImport = null;
      render();
    },

    'toggle-raw': () => {
      state.rawOpen = !state.rawOpen;
      render();
    },

    'reset-arm': () => {
      state.resetArmed = true;
      render();
    },

    'reset-cancel': () => {
      state.resetArmed = false;
      render();
    },

    'reset-confirm': () => {
      const input = document.getElementById('reset-confirm') as HTMLInputElement | null;
      if (input?.value.trim().toUpperCase() !== 'ERASE') {
        toast('Type ERASE to confirm.', 'error');
        return;
      }
      for (const k of store.dayKeys()) store.deleteDay(k);
      state.resetArmed = false;
      state.openDay = null;
      toast('All day records erased.');
      render();
    },
  };

  /* ------------------------------------------------------------------- wiring */

  const onClick = (ev: MouseEvent): void => {
    const el = (ev.target as HTMLElement | null)?.closest<HTMLElement>('[data-action]');
    if (!el || el.hasAttribute('disabled')) return;
    const handler = ACTIONS[el.dataset.action ?? ''];
    if (!handler) return;
    ev.preventDefault();
    handler(el);
  };

  const onChange = (ev: Event): void => {
    const el = ev.target as HTMLElement | null;
    if (el instanceof HTMLInputElement && el.id === 'import-file') {
      const file = el.files?.[0];
      el.value = '';
      if (file) void handleImportFile(file);
      return;
    }
    if (!(el instanceof HTMLInputElement)) return;

    if (el.dataset.action === 'set-timezone') {
      const tz = el.value.trim();
      try {
        new Intl.DateTimeFormat('en-US', { timeZone: tz }).format(new Date());
      } catch {
        toast(`Unknown timezone "${tz}".`, 'error');
        render();
        return;
      }
      store.setSettings({ timezone: tz });
      state.weekAnchor = today();
      toast(`Timezone set to ${tz}.`);
      render();
    }

    if (el.dataset.action === 'set-cutoff') {
      const hour = Math.min(12, Math.max(0, Math.round(Number(el.value))));
      if (Number.isNaN(hour)) return;
      store.setSettings({ dayCutoffHour: hour });
      state.weekAnchor = today();
      toast(`Day now starts at ${hour}:00.`);
      render();
    }
  };

  // Another tab wrote to storage — pick up its changes.
  const onStorage = (ev: StorageEvent): void => {
    if (ev.key?.startsWith('rt:')) render();
  };

  // The logical day can roll over while the app sits open.
  let lastKnownDay = today();
  const checkRollover = (): void => {
    const t = today();
    if (t !== lastKnownDay) {
      lastKnownDay = t;
      if (!state.openDay) state.weekAnchor = t;
      render();
    }
  };
  const onVisibility = (): void => {
    if (!document.hidden) checkRollover();
  };

  document.addEventListener('click', onClick);
  document.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('storage', onStorage);
  const rollTimer = window.setInterval(checkRollover, 60_000);

  render();

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('change', onChange);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('storage', onStorage);
    window.clearInterval(rollTimer);
  };
};
