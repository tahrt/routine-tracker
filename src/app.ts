/**
 * App state, rendering and event wiring.
 *
 * Exposed as startApp() returning a dispose function so nothing happens on
 * import and the listeners/timer can be torn down (used by the integration tests).
 */

import { LEARNING_PATHS } from './config/learning';
import { addDays, dateKey, isFutureKey, parseKey, todayKey as computeTodayKey, weekKeys } from './lib/date';
import { currentTemplate, isOutOfSync, materializeDay, newTaskId, syncRecordToTemplate } from './lib/day';
import { selectTodayPlan, weekPlanForDate, weekPlanningSummary } from './lib/planning';
import { toggleTask } from './lib/stats';
import { getStore, storageIsEphemeral } from './store';
import type {
  DayRecord,
  DayStatus,
  PlannedActionStatus,
  WeekTemplate,
  WorkstreamPriority,
  WorkstreamStatus,
  WorkstreamType,
} from './types';
import { toast } from './ui/dom';
import { renderApplications } from './views/applications';
import { renderTodayDashboard } from './views/dashboard';
import { renderDay } from './views/day';
import { renderEditTemplate } from './views/editTemplate';
import { renderInsights } from './views/insights';
import { renderLearningOverview, renderLearningPath } from './views/learning';
import {
  renderPlanningManager,
  renderTodayPlanning,
  renderWeekCalendar,
  renderWeekPlanning,
  renderWorkstreamDetail,
} from './views/planning';
import { renderSettings, type PendingImport } from './views/settings';
import { renderWeek } from './views/week';

type Tab = 'today' | 'learn' | 'insights' | 'more';
type TodayMode = 'today' | 'week';

const WEEKDAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

interface AppState {
  tab: Tab;
  todayMode: TodayMode;
  /** Any date inside the week shown by the Week panel. */
  weekAnchor: string;
  /** Set when a specific day is opened from the Week view. */
  openDay: string | null;
  learningPathId: string | null;
  planningOpen: boolean;
  applicationsOpen: boolean;
  applicationsReturnWorkstreamId: string | null;
  workstreamOpenId: string | null;
  workstreamReturn: 'today' | 'week' | 'planner';
  rawOpen: boolean;
  resetArmed: boolean;
  pendingImport: (PendingImport & { raw: unknown }) | null;
  nudgeDismissed: boolean;
  /** Open template editor: the weekday on screen, plus an unsaved draft of all seven. */
  editing: { weekday: number; draft: WeekTemplate } | null;
  /** Dates where the user chose to keep the old task list after a template edit. */
  syncDismissed: Set<string>;
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
    todayMode: 'today',
    weekAnchor: today(),
    openDay: null,
    learningPathId: null,
    planningOpen: false,
    applicationsOpen: false,
    applicationsReturnWorkstreamId: null,
    workstreamOpenId: null,
    workstreamReturn: 'today',
    rawOpen: false,
    resetArmed: false,
    pendingImport: null,
    nudgeDismissed: false,
    editing: null,
    syncDismissed: new Set<string>(),
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

  const tabBar = (tab: Tab): string => {
    const items: Array<[Tab, string, string]> = [
      ['today', 'Today', '⌂'],
      ['learn', 'Learn', '◇'],
      ['insights', 'Insights', '▥'],
      ['more', 'More', '•••'],
    ];
    return items
      .map(
        ([id, label, icon]) =>
          `<button type="button" class="tabbar__btn${tab === id ? ' is-active' : ''}" data-action="tab" data-tab="${id}"
             aria-current="${tab === id}">
             <span class="tabbar__icon" aria-hidden="true">${icon}</span>
             <span>${label}</span>
           </button>`,
      )
      .join('');
  };

  const greeting = (): string => {
    const { timezone } = store.getSettings();
    const hour = Number(new Intl.DateTimeFormat('en-US', { timeZone: timezone, hour: '2-digit', hourCycle: 'h23' }).format(new Date()));
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const render = (): void => {
    const root = document.getElementById('app');
    if (!root) return;
    const t = today();
    const templates = store.getTemplates();
    const habits = store.getHabits();

    let body: string;
    if (state.workstreamOpenId) {
      const workstream = store.getWorkstreams()[state.workstreamOpenId];
      body = workstream
        ? renderWorkstreamDetail({
            workstream,
            todayKey: t,
            capacityProfiles: store.getCapacityProfiles(),
            plannedActions: store.getPlannedActions(),
            jobApplications: store.getJobApplications(),
          })
        : '<p class="empty">Workstream not found.</p>';
    } else if (state.applicationsOpen) {
      body = renderApplications({ todayKey: t, applications: store.getJobApplications() });
    } else if (state.planningOpen) {
      const weekPlan = weekPlanForDate(t, store.getWeekPlans());
      const planningSummary = weekPlanningSummary({
        dateK: t,
        capacityProfiles: store.getCapacityProfiles(),
        weekPlans: store.getWeekPlans(),
        plannedActions: store.getPlannedActions(),
      });
      body = renderPlanningManager({
        todayKey: t,
        workstreams: store.getWorkstreams(),
        habits,
        weekPlan,
        plannedActions: store.getPlannedActions(),
        weekSummary: planningSummary,
      });
    } else if (state.editing) {
      body = renderEditTemplate({ ...state.editing, dirty: dirtyWeekdays(), habits });
    } else if (state.openDay) {
      const record = store.getDay(state.openDay);
      body = renderDay({
        dateKey: state.openDay,
        todayKey: t,
        record,
        templates,
        standalone: true,
        outOfSync:
          record !== undefined &&
          !state.syncDismissed.has(state.openDay) &&
          isOutOfSync(record, currentTemplate(templates, t)),
      });
    } else if (state.tab === 'today') {
      body =
        state.todayMode === 'week'
          ? renderWeek({
              anchorKey: state.weekAnchor,
              todayKey: t,
              records: recordsFor(weekKeys(parseKey(state.weekAnchor))),
              planningHtml: renderWeekPlanning({
                summary: weekPlanningSummary({
                  dateK: state.weekAnchor,
                  capacityProfiles: store.getCapacityProfiles(),
                  weekPlans: store.getWeekPlans(),
                  plannedActions: store.getPlannedActions(),
                }),
                workstreams: store.getWorkstreams(),
              }),
              calendarHtml: renderWeekCalendar({
                anchorKey: state.weekAnchor,
                todayKey: t,
                capacityProfiles: store.getCapacityProfiles(),
                plannedActions: store.getPlannedActions(),
                workstreams: store.getWorkstreams(),
              }),
            })
          : renderTodayDashboard({
              dateKey: t,
              record: store.getDay(t),
              templates,
              learningPaths: LEARNING_PATHS,
              learningProgress: store.getLearningProgress(),
              greeting: greeting(),
              planningHtml: renderTodayPlanning({
                plan: selectTodayPlan({
                  dateK: t,
                  capacityProfiles: store.getCapacityProfiles(),
                  workstreams: store.getWorkstreams(),
                  plannedActions: store.getPlannedActions(),
                  jobApplications: store.getJobApplications(),
                }),
                workstreams: store.getWorkstreams(),
              }),
              plannedActions: store.getPlannedActions(),
              workstreams: store.getWorkstreams(),
              outOfSync:
                store.getDay(t) !== undefined &&
                !state.syncDismissed.has(t) &&
                isOutOfSync(store.getDay(t) as DayRecord, currentTemplate(templates, t)),
            });
    } else if (state.tab === 'learn') {
      const progress = store.getLearningProgress();
      const path = state.learningPathId ? LEARNING_PATHS.find((candidate) => candidate.id === state.learningPathId) : undefined;
      body = path ? renderLearningPath(path, progress) : renderLearningOverview(LEARNING_PATHS, progress);
    } else if (state.tab === 'insights') {
      body = renderInsights({
        todayKey: t,
        records: store.listDays({ to: t }),
        habits,
        learningProgress: store.getLearningProgress(),
      });
    } else {
      body = renderSettings({
        settings: store.getSettings(),
        habits,
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
      state.tab === 'today' && !state.openDay && !state.editing && !state.planningOpen && !state.applicationsOpen && !state.workstreamOpenId && shouldNudgeBackup()
        ? `<div class="nudge">
             <span>Back up your history — it only lives in this browser.</span>
             <button class="btn btn--tiny" type="button" data-action="goto-backup">Export</button>
             <button class="nudge__x" type="button" data-action="dismiss-nudge" aria-label="Dismiss">×</button>
           </div>`
        : '';

    root.innerHTML = `${nudge}<main class="main">${body}</main><nav class="tabbar">${tabBar(state.tab)}</nav>`;
  };

  /* ------------------------------------------------------------------ actions */

  /** Weekdays whose draft differs from the saved template. */
  const dirtyWeekdays = (): number[] => {
    const editing = state.editing;
    if (!editing) return [];
    const saved = currentTemplate(store.getTemplates(), today()).days;
    return [0, 1, 2, 3, 4, 5, 6].filter(
      (d) => JSON.stringify(editing.draft[d] ?? null) !== JSON.stringify(saved[d] ?? null),
    );
  };

  /**
   * Typing must not trigger a re-render — it would drop focus mid-word — so the
   * few things that depend on draft state are patched in place instead.
   */
  const refreshDirtyIndicators = (): void => {
    const dirty = dirtyWeekdays();
    const save = document.querySelector<HTMLButtonElement>('[data-action="edit-save"]');
    if (save) save.disabled = dirty.length === 0;
    for (const btn of document.querySelectorAll<HTMLElement>('[data-action="edit-weekday"]')) {
      btn.classList.toggle('is-dirty', dirty.includes(Number(btn.dataset.weekday)));
    }
  };

  /** The weekday currently on screen in the template editor. */
  const editingDay = (): WeekTemplate[number] | undefined =>
    state.editing ? state.editing.draft[state.editing.weekday] : undefined;

  const openTab = (tab: Tab): void => {
    state.tab = tab;
    state.openDay = null;
    state.learningPathId = null;
    state.planningOpen = false;
    state.applicationsOpen = false;
    state.applicationsReturnWorkstreamId = null;
    state.workstreamOpenId = null;
    state.editing = null;
    if (tab === 'today') {
      state.todayMode = 'today';
      state.weekAnchor = today();
    }
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

    'open-planner': () => {
      state.planningOpen = true;
      state.applicationsOpen = false;
      state.workstreamOpenId = null;
      state.openDay = null;
      state.editing = null;
      render();
    },

    'close-planner': () => {
      state.planningOpen = false;
      render();
    },

    'open-applications': () => {
      state.applicationsReturnWorkstreamId = state.workstreamOpenId;
      state.applicationsOpen = true;
      state.planningOpen = false;
      state.workstreamOpenId = null;
      state.openDay = null;
      state.editing = null;
      render();
    },

    'close-applications': () => {
      state.applicationsOpen = false;
      if (state.applicationsReturnWorkstreamId) {
        state.workstreamOpenId = state.applicationsReturnWorkstreamId;
        state.applicationsReturnWorkstreamId = null;
      } else {
        state.planningOpen = true;
      }
      render();
    },

    'open-workstream': (el) => {
      const id = el.dataset.id;
      if (!id || !store.getWorkstreams()[id]) return;
      state.workstreamReturn = state.planningOpen ? 'planner' : state.todayMode;
      state.workstreamOpenId = id;
      state.planningOpen = false;
      state.applicationsOpen = false;
      state.openDay = null;
      state.editing = null;
      render();
    },

    'close-workstream': () => {
      state.workstreamOpenId = null;
      if (state.workstreamReturn === 'planner') {
        state.planningOpen = true;
      } else {
        state.tab = 'today';
        state.todayMode = state.workstreamReturn;
      }
      render();
    },

    back: () => {
      state.openDay = null;
      state.tab = 'today';
      state.todayMode = 'week';
      render();
    },

    'today-mode': (el) => {
      const mode = el.dataset.mode as TodayMode | undefined;
      if (mode !== 'today' && mode !== 'week') return;
      state.tab = 'today';
      state.todayMode = mode;
      if (mode === 'week') state.weekAnchor = today();
      render();
    },

    'open-learning-path': (el) => {
      const id = el.dataset.id;
      if (!id || !LEARNING_PATHS.some((path) => path.id === id)) return;
      state.tab = 'learn';
      state.learningPathId = id;
      state.openDay = null;
      render();
    },

    'learning-back': () => {
      state.tab = 'learn';
      state.learningPathId = null;
      render();
    },

    'toggle-learning-lesson': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      const completed = store.getLearningProgress()[id] !== undefined;
      store.setLearningLessonCompleted(id, !completed, nowIso());
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
      const horizon = dateKey(addDays(parseKey(today()), 28));
      if (delta > 0 && next > horizon) return;
      state.weekAnchor = next;
      render();
    },

    /* ------------------------------------------------------- template editing */

    'edit-template': (el) => {
      const fromTab = el.dataset.weekday !== undefined;
      const weekday = fromTab ? Number(el.dataset.weekday) : parseKey(state.openDay ?? today()).getDay();
      const tpl = currentTemplate(store.getTemplates(), today());
      // Deep copy of all seven days: switching weekday inside the editor keeps
      // edits, and the whole draft is discarded on cancel.
      state.editing = { weekday, draft: structuredClone(tpl.days) };
      render();
    },

    'edit-weekday': (el) => {
      if (!state.editing) return;
      state.editing.weekday = Number(el.dataset.weekday);
      render();
    },

    'edit-cancel': () => {
      state.editing = null;
      render();
    },

    'task-add': () => {
      const day = editingDay();
      if (!day) return;
      day.tasks.push({ id: newTaskId(), name: '', time: '', core: false, habit: null, weight: 1 });
      render();
      // Put the cursor straight into the new row.
      const inputs = document.querySelectorAll<HTMLInputElement>('[data-action="edit-name"]');
      inputs[inputs.length - 1]?.focus();
    },

    'task-delete': (el) => {
      const day = editingDay();
      if (!day) return;
      day.tasks.splice(Number(el.dataset.index), 1);
      render();
    },

    'task-move': (el) => {
      const day = editingDay();
      if (!day) return;
      const i = Number(el.dataset.index);
      const to = i + Number(el.dataset.dir);
      const tasks = day.tasks;
      if (to < 0 || to >= tasks.length) return;
      const [moved] = tasks.splice(i, 1);
      if (moved) tasks.splice(to, 0, moved);
      render();
    },

    'task-core': (el) => {
      const task = editingDay()?.tasks[Number(el.dataset.index)];
      if (task) task.core = !task.core;
      render();
    },

    'edit-save': () => {
      const editing = state.editing;
      if (!editing) return;

      const days: WeekTemplate = {};
      for (const d of [0, 1, 2, 3, 4, 5, 6]) {
        const day = editing.draft[d];
        if (!day) continue;
        const tasks = day.tasks.map((t) => ({ ...t, name: t.name.trim(), time: t.time.trim() }));
        if (tasks.some((t) => t.name === '')) {
          editing.weekday = d; // show the offending day
          toast(`Every task needs a name — check ${WEEKDAY_NAMES[d]}.`, 'error');
          render();
          return;
        }
        days[d] = { type: day.type.trim(), tasks };
      }

      // A new version, so days already logged keep the tasks they were logged with.
      store.appendTemplate({ effectiveFrom: today(), createdAt: nowIso(), days });
      state.editing = null;
      state.syncDismissed.clear();
      toast('Saved. Applies from today on.');
      render();
    },

    'sync-template': () => {
      const dateK = state.openDay ?? today();
      const rec = store.getDay(dateK);
      if (!rec) return;
      store.setDay(dateK, syncRecordToTemplate(rec, currentTemplate(store.getTemplates(), today())), nowIso());
      toast('Day updated to the new task list.');
      render();
    },

    'sync-dismiss': () => {
      state.syncDismissed.add(state.openDay ?? today());
      render();
    },

    'add-habit': () => {
      const input = document.getElementById('new-habit-label') as HTMLInputElement | null;
      const label = input?.value.trim() ?? '';
      if (!label) {
        toast('Habit needs a name.', 'error');
        return;
      }
      try {
        store.addHabit(label);
        toast(`Added habit “${label}”.`);
        render();
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Could not add habit.', 'error');
      }
    },

    'toggle-habit-archive': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      const archived = el.dataset.archived === 'true';
      store.setHabitArchived(id, !archived);
      toast(archived ? 'Habit restored.' : 'Habit archived. History is preserved.');
      render();
    },

    'planning-add-workstream': () => {
      const title = (document.getElementById('planner-new-title') as HTMLInputElement | null)?.value.trim() ?? '';
      if (!title) return void toast('Workstream needs a title.', 'error');
      const type = ((document.getElementById('planner-new-type') as HTMLSelectElement | null)?.value ?? 'project') as WorkstreamType;
      const priority = ((document.getElementById('planner-new-priority') as HTMLSelectElement | null)?.value ?? 'primary') as WorkstreamPriority;
      const habit = (document.getElementById('planner-new-habit') as HTMLSelectElement | null)?.value || null;
      const id = `ws_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;
      store.upsertWorkstream({
        id,
        type,
        title,
        outcome: { goal: '', priority },
        plan: { deadline: null, definitionOfDone: [] },
        execution: { status: 'active', milestone: null, weeklyCommitment: null, nextAction: null },
        linkedHabitId: habit,
      });
      toast('Workstream added.');
      render();
    },

    'planning-save-workstream': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      const current = store.getWorkstreams()[id];
      const card = el.closest<HTMLElement>('[data-workstream-id]');
      if (!current || !card) return;
      const field = (name: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null =>
        card.querySelector(`[data-field="${name}"]`);
      const status = (field('status') as HTMLSelectElement | null)?.value as WorkstreamStatus | undefined;
      const deadline = (field('deadline') as HTMLInputElement | null)?.value || null;
      const dod = (field('definitionOfDone') as HTMLTextAreaElement | null)?.value
        .split('\n').map((v) => v.trim()).filter(Boolean) ?? [];
      store.upsertWorkstream({
        ...current,
        outcome: { ...current.outcome, goal: (field('goal') as HTMLInputElement | null)?.value.trim() ?? '' },
        plan: { deadline, definitionOfDone: dod },
        execution: {
          ...current.execution,
          status: status ?? current.execution.status,
          milestone: (field('milestone') as HTMLInputElement | null)?.value.trim() || null,
          nextAction: (field('nextAction') as HTMLInputElement | null)?.value.trim() || null,
        },
        linkedHabitId: (field('habit') as HTMLSelectElement | null)?.value || null,
      });
      toast('Workstream saved.');
      render();
    },

    'planning-save-week': () => {
      const commitments = [...document.querySelectorAll<HTMLElement>('[data-commitment-workstream]')].map((row) => ({
        workstreamId: row.dataset.commitmentWorkstream ?? '',
        targetBlocks: Math.max(0, Math.floor(Number((row.querySelector('[data-field="targetBlocks"]') as HTMLInputElement | null)?.value ?? 0))),
        outcome: (row.querySelector('[data-field="outcome"]') as HTMLInputElement | null)?.value.trim() ?? '',
      })).filter((item) => item.workstreamId && item.targetBlocks > 0);
      const monday = dateKey((() => { const d = parseKey(today()); const offset = (d.getDay() + 6) % 7; d.setDate(d.getDate() - offset); return d; })());
      store.upsertWeekPlan({ id: `week:${monday}`, startsOn: monday, commitments });
      toast('Week Plan saved.');
      render();
    },

    'planning-add-action': () => {
      const workstreamId = (document.getElementById('planner-action-workstream') as HTMLSelectElement | null)?.value ?? '';
      const title = (document.getElementById('planner-action-title') as HTMLInputElement | null)?.value.trim() ?? '';
      const date = (document.getElementById('planner-action-date') as HTMLInputElement | null)?.value ?? '';
      const blocks = Math.max(1, Math.min(3, Math.floor(Number((document.getElementById('planner-action-blocks') as HTMLInputElement | null)?.value ?? 1))));
      const due = (document.getElementById('planner-action-due') as HTMLInputElement | null)?.value || null;
      const workstream = store.getWorkstreams()[workstreamId];
      if (!workstream || !title || !date) return void toast('Action needs workstream, date, and title.', 'error');
      const id = `action_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;
      store.upsertPlannedAction({ id, date, workstreamId, title, focusBlocks: blocks, due, linkedHabitId: workstream.linkedHabitId ?? null, status: 'planned' });
      toast('Action planned.');
      render();
    },

    'planning-replan-action': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      const action = store.getPlannedActions()[id];
      const card = el.closest<HTMLElement>('.planner-manage-action');
      const nextDate = (card?.querySelector('[data-field="replanDate"]') as HTMLInputElement | null)?.value ?? '';
      if (!action || !nextDate) return void toast('Choose a new date first.', 'error');
      if (nextDate === action.date && action.status === 'planned') return void toast('Choose a different date to replan.', 'error');
      store.upsertPlannedAction({ ...action, status: 'deferred' });
      const nextId = `action_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;
      store.upsertPlannedAction({ ...action, id: nextId, date: nextDate, status: 'planned' });
      toast(`Moved explicitly to ${nextDate}. Original kept as deferred.`);
      render();
    },

    'planning-save-review': () => {
      const t = today();
      const d = parseKey(t);
      const offset = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - offset);
      const monday = dateKey(d);
      const current = weekPlanForDate(t, store.getWeekPlans()) ?? {
        id: `week:${monday}`,
        startsOn: monday,
        commitments: [],
      };
      const wins = (document.getElementById('planner-review-wins') as HTMLTextAreaElement | null)?.value.trim() ?? '';
      const misses = (document.getElementById('planner-review-misses') as HTMLTextAreaElement | null)?.value.trim() ?? '';
      const bottleneck = (document.getElementById('planner-review-bottleneck') as HTMLInputElement | null)?.value.trim() ?? '';
      const adjustment = (document.getElementById('planner-review-adjustment') as HTMLInputElement | null)?.value.trim() ?? '';
      store.upsertWeekPlan({
        ...current,
        review: { completedAt: nowIso(), wins, misses, bottleneck, adjustment },
      });
      toast('Weekly Review saved.');
      render();
    },

    'planning-create-next-week': () => {
      const t = today();
      const current = weekPlanForDate(t, store.getWeekPlans());
      if (!current) return void toast('Save this Week Plan first.', 'error');
      const monday = parseKey(current.startsOn);
      const nextStartsOn = dateKey(addDays(monday, 7));
      const existing = Object.values(store.getWeekPlans()).find((plan) => plan.startsOn === nextStartsOn);
      if (existing) return void toast('Next week already exists.');
      store.upsertWeekPlan({
        id: `week:${nextStartsOn}`,
        startsOn: nextStartsOn,
        commitments: structuredClone(current.commitments),
      });
      toast('Next week created. Actions were not carried over.');
      render();
    },

    'planning-action-status': (el) => {
      const id = el.dataset.id;
      const status = el.dataset.status as PlannedActionStatus | undefined;
      if (!id || !status) return;
      const action = store.getPlannedActions()[id];
      if (!action) return;
      store.upsertPlannedAction({ ...action, status });
      if (status === 'done' && action.date === today() && action.linkedHabitId) {
        const rec = ensureRecord(today());
        if (rec.status === 'active') {
          const matches = rec.tasks.filter((task) => task.core && task.habit === action.linkedHabitId);
          if (matches.length === 1 && matches[0] && !matches[0].done) {
            store.setDay(today(), { ...rec, tasks: rec.tasks.map((task) => task.id === matches[0]?.id ? { ...task, done: true } : task) }, nowIso());
          }
        }
      }
      toast(status === 'deferred' ? 'Deferred. It will not move dates automatically.' : `Action ${status}.`);
      render();
    },

    'application-add': () => {
      const company = (document.getElementById('application-new-company') as HTMLInputElement | null)?.value.trim() ?? '';
      const role = (document.getElementById('application-new-role') as HTMLInputElement | null)?.value.trim() ?? '';
      if (!company || !role) return void toast('Application needs company and role.', 'error');
      const stage = ((document.getElementById('application-new-stage') as HTMLSelectElement | null)?.value ?? 'saved') as import('./types').ApplicationStage;
      const fitRaw = Number((document.getElementById('application-new-fit') as HTMLInputElement | null)?.value ?? '');
      const fitScore = Number.isFinite(fitRaw) && fitRaw >= 1 && fitRaw <= 5 ? fitRaw : undefined;
      const nextActionDue = (document.getElementById('application-new-due') as HTMLInputElement | null)?.value || undefined;
      const nextAction = (document.getElementById('application-new-next') as HTMLInputElement | null)?.value.trim() || undefined;
      const jobUrl = (document.getElementById('application-new-url') as HTMLInputElement | null)?.value.trim() || undefined;
      const id = `app_${globalThis.crypto?.randomUUID?.().slice(0, 8) ?? Math.random().toString(36).slice(2, 10)}`;
      const stamp = nowIso();
      store.upsertJobApplication({
        id,
        company,
        role,
        stage,
        ...(fitScore ? { fitScore } : {}),
        ...(nextAction ? { nextAction } : {}),
        ...(nextActionDue ? { nextActionDue } : {}),
        ...(jobUrl ? { jobUrl } : {}),
        savedAt: stamp,
        ...(stage === 'applied' ? { appliedAt: stamp } : {}),
      });
      toast('Application added.');
      render();
    },

    'application-save': (el) => {
      const id = el.dataset.id;
      if (!id) return;
      const current = store.getJobApplications()[id];
      const card = el.closest<HTMLElement>('[data-application-id]');
      if (!current || !card) return;
      const field = (name: string): HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement | null =>
        card.querySelector(`[data-field="${name}"]`);
      const stage = ((field('stage') as HTMLSelectElement | null)?.value ?? current.stage) as import('./types').ApplicationStage;
      const fitRaw = Number((field('fitScore') as HTMLInputElement | null)?.value ?? '');
      const fitScore = Number.isFinite(fitRaw) && fitRaw >= 1 && fitRaw <= 5 ? fitRaw : undefined;
      const nextEventDate = (field('nextEventAt') as HTMLInputElement | null)?.value || undefined;
      const nextActionDue = (field('nextActionDue') as HTMLInputElement | null)?.value || undefined;
      const nextAction = (field('nextAction') as HTMLInputElement | null)?.value.trim() || undefined;
      const fitReason = (field('fitReason') as HTMLInputElement | null)?.value.trim() || undefined;
      const jobUrl = (field('jobUrl') as HTMLInputElement | null)?.value.trim() || undefined;
      const notes = (field('notes') as HTMLTextAreaElement | null)?.value.trim() || undefined;
      store.upsertJobApplication({
        ...current,
        stage,
        ...(fitScore ? { fitScore } : { fitScore: undefined }),
        ...(nextAction ? { nextAction } : { nextAction: undefined }),
        ...(nextActionDue ? { nextActionDue } : { nextActionDue: undefined }),
        ...(nextEventDate ? { nextEventAt: `${nextEventDate}T00:00:00` } : { nextEventAt: undefined }),
        ...(fitReason ? { fitReason } : { fitReason: undefined }),
        ...(jobUrl ? { jobUrl } : { jobUrl: undefined }),
        ...(notes ? { notes } : { notes: undefined }),
        ...(stage === 'applied' && !current.appliedAt ? { appliedAt: nowIso() } : {}),
      });
      toast('Application saved.');
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
    'goto-backup': () => openTab('more'),
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
        state.learningPathId = null;
        toast(`Imported ${summary.added + summary.overwritten + summary.unchanged} days and ${summary.learningCompleted} learning completions.`);
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
      store.clearLearningProgress();
      state.resetArmed = false;
      state.openDay = null;
      state.learningPathId = null;
      toast('Day records and learning progress erased.');
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

  /** Draft text edits write straight into state; re-rendering here would steal focus. */
  const onInput = (ev: Event): void => {
    const el = ev.target;
    if (!state.editing) return;
    const day = editingDay();
    if (!day) return;
    if (el instanceof HTMLInputElement && el.dataset.action === 'edit-type') {
      day.type = el.value;
      refreshDirtyIndicators();
      return;
    }
    if (!(el instanceof HTMLInputElement) && !(el instanceof HTMLSelectElement)) return;
    const task = day.tasks[Number(el.dataset.index)];
    if (!task) return;
    if (el.dataset.action === 'edit-name') task.name = el.value;
    if (el.dataset.action === 'edit-time') task.time = el.value;
    if (el.dataset.action === 'edit-habit') task.habit = el.value === '' ? null : el.value;
    refreshDirtyIndicators();
  };

  const onChange = (ev: Event): void => {
    const el = ev.target as HTMLElement | null;
    if (el instanceof HTMLSelectElement && el.dataset.action === 'edit-habit') {
      onInput(ev);
      return;
    }
    if (el instanceof HTMLInputElement && el.id === 'import-file') {
      const file = el.files?.[0];
      el.value = '';
      if (file) void handleImportFile(file);
      return;
    }
    if (!(el instanceof HTMLInputElement)) return;

    if (el.dataset.action === 'set-habit-label') {
      const id = el.dataset.id;
      if (!id) return;
      try {
        const updated = store.setHabitLabel(id, el.value);
        if (!updated) return;
        toast(`Habit renamed to “${updated.label}”. History is unchanged.`);
        render();
      } catch (err) {
        toast(err instanceof Error ? err.message : 'Could not rename habit.', 'error');
        render();
      }
      return;
    }

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
  document.addEventListener('input', onInput);
  document.addEventListener('change', onChange);
  document.addEventListener('visibilitychange', onVisibility);
  window.addEventListener('storage', onStorage);
  const rollTimer = window.setInterval(checkRollover, 60_000);

  render();

  return () => {
    document.removeEventListener('click', onClick);
    document.removeEventListener('input', onInput);
    document.removeEventListener('change', onChange);
    document.removeEventListener('visibilitychange', onVisibility);
    window.removeEventListener('storage', onStorage);
    window.clearInterval(rollTimer);
  };
};
