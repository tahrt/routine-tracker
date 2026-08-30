import { formatLong, parseKey } from '../lib/date';
import { previewTasks } from '../lib/day';
import { formatLearningTime, nextCoreLesson, pathStats } from '../lib/learning';
import type {
  DayRecord,
  DayStatus,
  DayTask,
  LearningPath,
  LearningProgress,
  PlannedAction,
  TemplateVersion,
  Workstream,
} from '../types';
import { cx, esc } from '../ui/dom';

export interface DashboardViewProps {
  dateKey: string;
  record: DayRecord | undefined;
  templates: readonly TemplateVersion[];
  learningPaths: readonly LearningPath[];
  learningProgress: LearningProgress;
  greeting: string;
  outOfSync: boolean;
  planningHtml?: string;
  plannedActions?: Readonly<Record<string, PlannedAction>>;
  workstreams?: Readonly<Record<string, Workstream>>;
}

const iconForTask = (task: DayTask): string => {
  const key = (task.habit ?? task.id).toLowerCase();
  if (key.includes('gym')) return '⌁';
  if (key.includes('learning')) return '◇';
  if (key.includes('work')) return '▣';
  if (key.includes('personal')) return '◆';
  if (key.includes('content')) return '✦';
  if (key.includes('job')) return '◎';
  if (key.includes('pin')) return '♡';
  if (key.includes('wind')) return '☾';
  return '·';
};

const statusButton = (status: DayStatus, current: DayStatus, label: string): string =>
  `<button type="button" class="${cx('today-status__btn', status === current && 'is-active')}"
           data-action="set-status" data-status="${status}" aria-pressed="${status === current}">${label}</button>`;

const taskItem = (task: DayTask, disabled: boolean): string => `
  <li class="${cx('today-task', task.done && 'is-done')}">
    <button class="today-task__hit" type="button" data-action="toggle-task" data-id="${esc(task.id)}"
            ${disabled ? 'disabled' : ''} aria-pressed="${task.done}">
      <span class="today-task__check" aria-hidden="true">${task.done ? '✓' : iconForTask(task)}</span>
      <span class="today-task__copy">
        <span class="today-task__name">${esc(task.name)}</span>
        ${task.time ? `<span class="today-task__time">${esc(task.time)}</span>` : ''}
      </span>
      ${task.core ? '<span class="today-task__core">CORE</span>' : ''}
      <span class="today-task__chev" aria-hidden="true">›</span>
    </button>
  </li>`;

export const renderTodayDashboard = ({
  dateKey,
  record,
  templates,
  learningPaths,
  learningProgress,
  greeting,
  outOfSync,
  planningHtml = '',
  plannedActions = {},
  workstreams = {},
}: DashboardViewProps): string => {
  const preview = record ? null : previewTasks(dateKey, templates);
  const tasks = record?.tasks ?? preview?.tasks ?? [];
  const dayType = record?.dayType ?? preview?.dayType ?? '';
  const status: DayStatus = record?.status ?? 'active';
  const disabled = status === 'rest';
  const todayActions = Object.values(plannedActions)
    .filter(
      (action) =>
        action.date === dateKey &&
        (action.status === 'planned' || action.status === 'done') &&
        workstreams[action.workstreamId]?.execution.status === 'active',
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  const plannedHabits = new Set(
    todayActions.map((action) => action.linkedHabitId).filter((habit): habit is string => Boolean(habit)),
  );
  const agendaRoutineTasks = tasks.filter((task) => !(task.habit && plannedHabits.has(task.habit)));
  const routineCore = agendaRoutineTasks.filter((task) => task.core);
  const scoredRoutine = routineCore.length ? routineCore : agendaRoutineTasks;
  const agendaTotal = scoredRoutine.length + todayActions.length;
  const agendaDone =
    scoredRoutine.filter((task) => task.done).length +
    todayActions.filter((action) => action.status === 'done').length;
  const ringRate = agendaTotal > 0 ? Math.round((agendaDone / agendaTotal) * 100) : 0;
  const isComplete = agendaTotal > 0 && agendaDone === agendaTotal;

  const continuePath = learningPaths.find((path) => nextCoreLesson(path, learningProgress));
  const nextLesson = continuePath ? nextCoreLesson(continuePath, learningProgress) : undefined;
  const continueStats = continuePath ? pathStats(continuePath, learningProgress) : undefined;
  const continueAction = continueStats && continueStats.completedLessons > 0 ? 'Resume' : 'Start';
  const learningAlreadyPlanned = plannedHabits.has('learning');

  const plannedAgendaItems = todayActions
    .map((action) => {
      const done = action.status === 'done';
      const workstream = workstreams[action.workstreamId];
      return `<li class="${cx('today-task', 'today-task--planned', done && 'is-done')}">
        <button class="today-task__hit" type="button" data-action="planning-action-status"
                data-id="${esc(action.id)}" data-status="${done ? 'planned' : 'done'}"
                ${disabled ? 'disabled' : ''} aria-pressed="${done}">
          <span class="today-task__check" aria-hidden="true">${done ? '✓' : '◆'}</span>
          <span class="today-task__copy">
            <span class="today-task__name">${esc(action.title)}</span>
            <span class="today-task__time">${esc(workstream?.title ?? 'Planned action')} · ${action.focusBlocks} Focus Block${action.focusBlocks === 1 ? '' : 's'}</span>
          </span>
          <span class="today-task__core today-task__core--focus">FOCUS</span>
          <span class="today-task__chev" aria-hidden="true">›</span>
        </button>
      </li>`;
    })
    .join('');

  return `
    <section class="today-dashboard">
      <header class="today-hero">
        <div class="today-brandrow">
          <strong class="today-brand">Routine</strong>
          <button class="today-edit" type="button" data-action="edit-template" aria-label="Edit today's routine">•••</button>
        </div>
        <div class="today-greeting">
          <div>
            <h1>${esc(greeting)} <span aria-hidden="true">✦</span></h1>
            <p>${esc(formatLong(parseKey(dateKey)))}</p>
          </div>
          <span class="today-orb" aria-hidden="true">R</span>
        </div>
        <div class="today-view-toggle" role="group" aria-label="Today or week">
          <button class="is-active" type="button" data-action="today-mode" data-mode="today">Today</button>
          <button type="button" data-action="today-mode" data-mode="week">Week</button>
        </div>
      </header>

      ${outOfSync
        ? `<div class="confirm today-sync">
             <p class="confirm__text">You changed this weekday's tasks after logging today. This snapshot still shows the old list.</p>
             <div class="row">
               <button class="btn btn--primary btn--tiny" type="button" data-action="sync-template">Update this day</button>
               <button class="btn btn--tiny" type="button" data-action="sync-dismiss">Keep as logged</button>
             </div>
           </div>`
        : ''
      }

      ${planningHtml}

      <section class="today-score">
        <div class="today-ring" style="--rate:${ringRate}">
          <div class="today-ring__inner"><strong>${ringRate}%</strong></div>
        </div>
        <div class="today-score__copy">
          <strong>${isComplete ? 'Agenda complete' : "today's agenda"}</strong>
          <span>${agendaDone} of ${agendaTotal} important items</span>
          <div class="today-score__bar" role="img" aria-label="${ringRate}% complete">
            <span style="width:${ringRate}%"></span>
          </div>
        </div>
      </section>

      ${status !== 'active'
        ? `<div class="today-state-note">${status === 'rest' ? 'Rest day · excluded from the week average and neutral in your stats.' : 'Skipped day · counts as an honest miss.'}</div>`
        : ''
      }

      <div class="today-status" role="group" aria-label="Day status">
        ${statusButton('active', status, 'Track')}
        ${statusButton('rest', status, 'Rest')}
        ${statusButton('skipped', status, 'Skip')}
      </div>

      ${continuePath && nextLesson && continueStats && !learningAlreadyPlanned
        ? `<button class="today-learning" type="button" data-action="open-learning-path" data-id="${esc(continuePath.id)}"
                   aria-label="${continueAction} learning: ${esc(nextLesson.title)}">
             <div class="today-learning__label">CONTINUE LEARNING</div>
             <div class="today-learning__content">
               <span class="today-learning__thumb" aria-hidden="true">
                 <span class="today-learning__spark">✦</span>
                 <span class="today-learning__book">◇</span>
               </span>

               <div class="today-learning__body">
                 <strong class="today-learning__title">${esc(nextLesson.title)}</strong>
                 <span class="today-learning__meta">${esc(continuePath.title)} · ${formatLearningTime(nextLesson.durationMinutes)}</span>

                 <div class="today-learning__progress">
                   <span class="today-learning__track" role="img"
                         aria-label="${esc(continuePath.title)} ${continueStats.completionRate}% complete">
                     <span style="width:${continueStats.completionRate}%"></span>
                   </span>
                   <span class="today-learning__rate">${continueStats.completionRate}%</span>
                   <span class="today-learning__resume">${continueAction}</span>
                 </div>
               </div>

               <span class="today-learning__cta" aria-hidden="true">
                 <span class="today-learning__triangle"></span>
               </span>
             </div>
           </button>`
        : ''
      }

      <section class="today-rest today-agenda">
        <div class="today-section-head">
          <span>TODAY'S AGENDA</span>
          <strong>${agendaDone} / ${agendaTotal}</strong>
        </div>
        ${(plannedAgendaItems || agendaRoutineTasks.length)
          ? `<ul class="today-tasks">${plannedAgendaItems}${agendaRoutineTasks.map((task) => taskItem(task, disabled)).join('')}</ul>`
          : '<p class="empty">Nothing scheduled for today.</p>'
        }
        <p class="today-agenda__hint">Focus actions replace matching generic Job Search / Project / Learning placeholders here. Routine history stays intact underneath.</p>
      </section>
      <p class="today-agenda__routine-note">Routine template: ${esc(dayType || 'No template')}</p>
    </section>`;
};
