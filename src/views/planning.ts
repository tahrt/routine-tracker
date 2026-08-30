import { addDays, dateKey, formatLong, getMonday, parseKey, weekKeys } from '../lib/date';
import { capacityForDate } from '../lib/planning';
import type {
  CapacityProfile,
  Habit,
  JobApplication,
  PlannedAction,
  WeekPlan,
  Workstream,
} from '../types';
import type { TodayPlan, WeekPlanningSummary } from '../lib/planning';
import { cx, esc } from '../ui/dom';

const priorityLabel = (priority: Workstream['outcome']['priority']): string => {
  if (priority === 'north-star') return 'NORTH STAR';
  if (priority === 'primary') return 'PRIMARY';
  if (priority === 'support') return 'SUPPORT';
  return 'NEXT';
};

const workstreamLabel = (workstream: Workstream | undefined): string =>
  workstream ? workstream.title : 'Unknown workstream';

const shortDay = (dateK: string): string =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(parseKey(dateK));

const shortDate = (dateK: string): string =>
  new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(parseKey(dateK));

const activeScheduledActions = (
  actions: Readonly<Record<string, PlannedAction>>,
  workstreamId?: string,
): PlannedAction[] =>
  Object.values(actions)
    .filter(
      (action) =>
        (action.status === 'planned' || action.status === 'done') &&
        (workstreamId === undefined || action.workstreamId === workstreamId),
    )
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

export const renderTodayPlanning = ({
  plan,
  workstreams,
}: {
  plan: TodayPlan;
  workstreams: Readonly<Record<string, Workstream>>;
}): string => {
  const capacityLabel = `${plan.capacityBlocks} Focus Block${plan.capacityBlocks === 1 ? '' : 's'}`;

  const scheduled = plan.items
    .map((item, index) => {
      const workstream = workstreams[item.workstreamId];
      return `<article class="${cx('planner-action', index === 0 && 'planner-action--must')}">
        <div class="planner-action__eyebrow">${index === 0 ? 'MUST WIN' : 'NEXT'} · ${esc(item.reason)}</div>
        <div class="planner-action__body">
          <button class="planner-action__copybtn" type="button" data-action="open-workstream" data-id="${esc(item.workstreamId)}">
            <h3>${esc(item.title)}</h3>
            <p>${esc(workstreamLabel(workstream))} · ${item.focusBlocks} block${item.focusBlocks === 1 ? '' : 's'}${item.due ? ` · due ${esc(item.due)}` : ''}</p>
          </button>
          <span class="planner-action__scheduled">SCHEDULED</span>
        </div>
      </article>`;
    })
    .join('');

  const attention = plan.attention.length
    ? `<div class="planner-attention">
        <div class="planner-attention__label">NEEDS ATTENTION · not scheduled</div>
        ${plan.attention
          .slice(0, 2)
          .map(
            (item) => `<button type="button" class="planner-attention__row" data-action="open-applications">
              <span><strong>${esc(item.title)}</strong><small>${esc(item.reason)} · due ${esc(item.due)}</small></span>
              <span aria-hidden="true">›</span>
            </button>`,
          )
          .join('')}
      </div>`
    : '';

  const suggestions =
    plan.items.length === 0 && plan.suggestions.length
      ? `<div class="planner-suggestions">
          <div class="planner-attention__label">SUGGESTED NEXT · does not use capacity</div>
          ${plan.suggestions
            .slice(0, 2)
            .map(
              (item) => `<button type="button" class="planner-attention__row" data-action="open-workstream" data-id="${esc(item.workstreamId)}">
                <span><strong>${esc(item.title)}</strong><small>${esc(workstreamLabel(workstreams[item.workstreamId]))} · ${esc(item.reason)}</small></span>
                <span aria-hidden="true">›</span>
              </button>`,
            )
            .join('')}
        </div>`
      : '';

  return `
    <section class="planner-today">
      <div class="planner-section-head">
        <div>
          <span>PLAN FOR TODAY</span>
          <strong>${capacityLabel}</strong>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Manage</button>
      </div>
      ${plan.warnings.map((warning) => `<p class="planner-warning">${esc(warning)}</p>`).join('')}
      ${scheduled || `<div class="planner-empty planner-empty--compact">
        <strong>No Focus Block scheduled today.</strong>
        <span>Suggestions below are context only until you explicitly put an action on today.</span>
      </div>`}
      ${attention}
      ${suggestions}
      <div class="planner-capacity">
        <span>${plan.usedBlocks} / ${plan.capacityBlocks} blocks scheduled</span>
        <span>${plan.remainingBlocks} free</span>
      </div>
    </section>`;
};

export const renderWeekPlanning = ({
  summary,
  workstreams,
}: {
  summary: WeekPlanningSummary;
  workstreams: Readonly<Record<string, Workstream>>;
}): string => {
  const commitments = summary.commitments.length
    ? summary.commitments
        .map((commitment) => {
          const workstream = workstreams[commitment.workstreamId];
          const pct =
            commitment.targetBlocks > 0
              ? Math.min(100, Math.round((commitment.completedBlocks / commitment.targetBlocks) * 100))
              : 0;
          const atRisk = commitment.scheduledBlocks < commitment.targetBlocks;
          return `<button type="button" class="planner-commitment ${atRisk ? 'planner-commitment--risk' : ''}"
                          data-action="open-workstream" data-id="${esc(commitment.workstreamId)}">
            <div class="planner-commitment__top">
              <strong>${esc(workstreamLabel(workstream))}</strong>
              <span>${commitment.completedBlocks} done · ${commitment.scheduledBlocks} scheduled · ${commitment.targetBlocks} target</span>
            </div>
            <div class="planner-commitment__bar"><span style="width:${pct}%"></span></div>
            <p>${atRisk ? 'AT RISK · ' : ''}${esc(commitment.outcome)}</p>
          </button>`;
        })
        .join('')
    : `<div class="planner-empty planner-empty--compact">
        <strong>No Week Plan yet.</strong>
        <span>Allocate finite blocks before the week fills itself.</span>
      </div>`;

  return `
    <section class="planner-week">
      <div class="planner-section-head">
        <div>
          <span>WEEK PLAN</span>
          <strong>${summary.completedBlocks} done · ${summary.plannedBlocks} scheduled · ${summary.capacityBlocks} capacity</strong>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Manage</button>
      </div>
      ${commitments}
    </section>`;
};

export const renderWeekCalendar = ({
  anchorKey,
  todayKey,
  capacityProfiles,
  plannedActions,
  workstreams,
}: {
  anchorKey: string;
  todayKey: string;
  capacityProfiles: readonly CapacityProfile[];
  plannedActions: Readonly<Record<string, PlannedAction>>;
  workstreams: Readonly<Record<string, Workstream>>;
}): string => {
  const keys = weekKeys(parseKey(anchorKey));
  const actions = activeScheduledActions(plannedActions);

  const days = keys
    .map((key) => {
      const dayActions = actions.filter((action) => action.date === key);
      const used = dayActions.reduce((sum, action) => sum + Math.max(1, Math.floor(action.focusBlocks || 1)), 0);
      const capacity = capacityForDate(key, capacityProfiles);
      const free = Math.max(0, capacity - used);
      const state = used > capacity ? 'OVER' : free === 0 && capacity > 0 ? 'FULL' : `${free} free`;

      return `<article class="${cx('weekcal-day', key === todayKey && 'is-today')}">
        <div class="weekcal-day__head">
          <div><strong>${esc(shortDay(key))}</strong><span>${esc(shortDate(key))}</span></div>
          <small>${used}/${capacity} · ${state}</small>
        </div>
        <div class="weekcal-day__items">
          ${dayActions.length
            ? dayActions
                .map((action) => {
                  const workstream = workstreams[action.workstreamId];
                  return `<button type="button" class="${cx('weekcal-item', action.status === 'done' && 'is-done')}"
                                  data-action="open-workstream" data-id="${esc(action.workstreamId)}">
                    <span>${esc(action.title)}</span>
                    <small>${esc(workstreamLabel(workstream))} · ${action.focusBlocks} block${action.focusBlocks === 1 ? '' : 's'}</small>
                  </button>`;
                })
                .join('')
            : '<span class="weekcal-day__empty">No Focus Block</span>'}
        </div>
      </article>`;
    })
    .join('');

  return `
    <section class="week-calendar">
      <div class="planner-section-head">
        <div><span>EXECUTION CALENDAR</span><strong>What is actually scheduled each day</strong></div>
      </div>
      <div class="weekcal-grid">${days}</div>
    </section>`;
};

const habitOptions = (habits: readonly Habit[], selected?: string | null): string =>
  [
    '<option value="">No linked habit</option>',
    ...habits
      .filter((habit) => !habit.archived)
      .map(
        (habit) =>
          `<option value="${esc(habit.id)}" ${habit.id === selected ? 'selected' : ''}>${esc(habit.label)}</option>`,
      ),
  ].join('');

const workstreamOptions = (
  workstreams: readonly Workstream[],
  selected?: string,
): string =>
  workstreams
    .map(
      (workstream) =>
        `<option value="${esc(workstream.id)}" ${workstream.id === selected ? 'selected' : ''}>${esc(workstream.title)}</option>`,
    )
    .join('');

const actionCard = (action: PlannedAction, workstreams: Readonly<Record<string, Workstream>>, todayKey: string): string => {
  const workstream = workstreams[action.workstreamId];
  return `<article class="planner-manage-action">
    <div>
      <strong>${esc(action.title)}</strong>
      <span>${esc(action.date)} · ${esc(workstreamLabel(workstream))} · ${action.focusBlocks} block${action.focusBlocks === 1 ? '' : 's'}</span>
    </div>
    <div class="planner-action__buttons">
      <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${esc(action.id)}" data-status="done">Done</button>
      <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${esc(action.id)}" data-status="deferred">Defer</button>
      <button type="button" class="btn btn--tiny" data-action="planning-action-status" data-id="${esc(action.id)}" data-status="cancelled">Cancel</button>
    </div>
    ${action.status !== 'done'
      ? `<div class="planner-replan">
          <input type="date" data-field="replanDate" value="${esc(action.date < todayKey ? todayKey : action.date)}">
          <button type="button" class="btn btn--tiny" data-action="planning-replan-action" data-id="${esc(action.id)}">Move explicitly</button>
        </div>`
      : ''}
  </article>`;
};

export const renderPlanningManager = ({
  todayKey,
  workstreams,
  habits,
  weekPlan,
  plannedActions,
  weekSummary,
}: {
  todayKey: string;
  workstreams: Readonly<Record<string, Workstream>>;
  habits: readonly Habit[];
  weekPlan: WeekPlan | undefined;
  plannedActions: Readonly<Record<string, PlannedAction>>;
  weekSummary: WeekPlanningSummary;
}): string => {
  const all = Object.values(workstreams);
  const active = all.filter((workstream) => workstream.execution.status === 'active');
  const weekDates = new Set(weekKeys(parseKey(todayKey)));
  const weekActions = Object.values(plannedActions)
    .filter((action) => weekDates.has(action.date) && action.status !== 'cancelled')
    .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

  const workstreamCards = all.length
    ? all
        .map(
          (workstream) => `
            <article class="planner-workstream" data-workstream-id="${esc(workstream.id)}">
              <div class="planner-workstream__head">
                <button type="button" class="planner-workstream__title" data-action="open-workstream" data-id="${esc(workstream.id)}">
                  <span>${priorityLabel(workstream.outcome.priority)} · ${esc(workstream.type)}</span>
                  <h3>${esc(workstream.title)}</h3>
                </button>
                <select data-field="status" aria-label="Status for ${esc(workstream.title)}">
                  ${(['active', 'queued', 'maintenance', 'parked', 'done'] as const)
                    .map(
                      (status) =>
                        `<option value="${status}" ${status === workstream.execution.status ? 'selected' : ''}>${status}</option>`,
                    )
                    .join('')}
                </select>
              </div>
              <label>Goal<input data-field="goal" value="${esc(workstream.outcome.goal)}"></label>
              <div class="planner-form-grid">
                <label>Deadline<input data-field="deadline" type="date" value="${esc(workstream.plan.deadline ?? '')}"></label>
                <label>Habit<select data-field="habit">${habitOptions(habits, workstream.linkedHabitId)}</select></label>
              </div>
              <label>Milestone<input data-field="milestone" value="${esc(workstream.execution.milestone ?? '')}"></label>
              <label>Next action<input data-field="nextAction" value="${esc(workstream.execution.nextAction ?? '')}"></label>
              <label>Definition of done<textarea data-field="definitionOfDone" rows="2">${esc(workstream.plan.definitionOfDone.join('\n'))}</textarea></label>
              <button type="button" class="btn btn--tiny" data-action="planning-save-workstream" data-id="${esc(workstream.id)}">Save workstream</button>
            </article>`,
        )
        .join('')
    : '<p class="empty">No workstreams yet. Start with only what is active now.</p>';

  const commitmentByWorkstream = new Map(
    (weekPlan?.commitments ?? []).map((commitment) => [commitment.workstreamId, commitment] as const),
  );
  const commitments = active.length
    ? active
        .map((workstream) => {
          const current = commitmentByWorkstream.get(workstream.id);
          return `<div class="planner-commitment-edit" data-commitment-workstream="${esc(workstream.id)}">
            <strong>${esc(workstream.title)}</strong>
            <label>Blocks<input data-field="targetBlocks" type="number" min="0" max="14" value="${current?.targetBlocks ?? 0}"></label>
            <label>Outcome<input data-field="outcome" value="${esc(current?.outcome ?? workstream.execution.weeklyCommitment ?? '')}"></label>
          </div>`;
        })
        .join('')
    : '<p class="empty">Activate a workstream before allocating blocks.</p>';

  return `
    <section class="planner-manager">
      <header class="planner-manager__head">
        <button type="button" class="back" data-action="close-planner">← Back</button>
        <p class="day__date">PLANNING</p>
        <h1>Make the week finite.</h1>
        <p>${esc(formatLong(parseKey(todayKey)))} · Planning changes future execution, not historical routine data.</p>
      </header>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>WORKSTREAMS</span><strong>Tap one to open its schedule</strong></div></div>
        ${workstreamCards}

        <div class="planner-create">
          <h3>Add workstream</h3>
          <div class="planner-form-grid">
            <label>Title<input id="planner-new-title" placeholder="Job Search"></label>
            <label>Type<select id="planner-new-type">
              <option value="career">Career</option>
              <option value="project">Project</option>
              <option value="learning">Learning</option>
            </select></label>
            <label>Priority<select id="planner-new-priority">
              <option value="north-star">North Star</option>
              <option value="primary">Primary</option>
              <option value="support">Support</option>
              <option value="next">Next</option>
            </select></label>
            <label>Linked habit<select id="planner-new-habit">${habitOptions(habits)}</select></label>
          </div>
          <button type="button" class="btn btn--primary btn--tiny" data-action="planning-add-workstream">Add workstream</button>
        </div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head">
          <div><span>JOB SEARCH</span><strong>Application pipeline</strong></div>
          <button type="button" class="btn btn--tiny" data-action="open-applications">Open tracker</button>
        </div>
        <p class="planner-manager__note">Applications keep their own stage and next action. A due application is an alert until you explicitly schedule a Focus Block.</p>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>THIS WEEK</span><strong>Allocate Focus Blocks</strong></div></div>
        ${commitments}
        <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-week">Save Week Plan</button>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>WEEKLY REVIEW</span><strong>${weekSummary.completedBlocks} done · ${weekSummary.plannedBlocks} scheduled · ${weekSummary.capacityBlocks} capacity</strong></div></div>
        <label>Wins<textarea id="planner-review-wins" rows="2">${esc(weekPlan?.review?.wins ?? '')}</textarea></label>
        <label>Misses<textarea id="planner-review-misses" rows="2">${esc(weekPlan?.review?.misses ?? '')}</textarea></label>
        <label>Bottleneck<input id="planner-review-bottleneck" value="${esc(weekPlan?.review?.bottleneck ?? '')}" placeholder="What repeatedly got in the way?"></label>
        <label>Adjustment for next week<input id="planner-review-adjustment" value="${esc(weekPlan?.review?.adjustment ?? '')}" placeholder="One change only"></label>
        <div class="planner-review__actions">
          <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-review">Save review</button>
          <button type="button" class="btn btn--tiny" data-action="planning-create-next-week">Create next week</button>
        </div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>PLANNED ACTIONS</span><strong>Explicit dates, no auto-carry</strong></div></div>
        ${weekActions.length ? weekActions.map((action) => actionCard(action, workstreams, todayKey)).join('') : '<p class="empty">No actions planned this week.</p>'}

        <div class="planner-create">
          <h3>Add action</h3>
          ${active.length
            ? `<div class="planner-form-grid">
                <label>Workstream<select id="planner-action-workstream">${workstreamOptions(active)}</select></label>
                <label>Date<input id="planner-action-date" type="date" value="${esc(todayKey)}"></label>
                <label>Blocks<input id="planner-action-blocks" type="number" min="1" max="3" value="1"></label>
                <label>Due<input id="planner-action-due" type="date"></label>
              </div>
              <label>Action<input id="planner-action-title" placeholder="Prepare and submit application"></label>
              <button type="button" class="btn btn--primary btn--tiny" data-action="planning-add-action">Add action</button>`
            : '<p class="empty">Activate a workstream first.</p>'}
        </div>
      </section>
    </section>`;
};

export const renderWorkstreamDetail = ({
  workstream,
  todayKey,
  capacityProfiles,
  plannedActions,
  jobApplications,
}: {
  workstream: Workstream;
  todayKey: string;
  capacityProfiles: readonly CapacityProfile[];
  plannedActions: Readonly<Record<string, PlannedAction>>;
  jobApplications: Readonly<Record<string, JobApplication>>;
}): string => {
  const allActions = activeScheduledActions(plannedActions, workstream.id);
  const upcoming = allActions.filter((action) => action.date >= todayKey);
  const currentKeys = weekKeys(parseKey(todayKey));
  const hasCurrentWeekAction = allActions.some((action) => currentKeys.includes(action.date));
  const calendarAnchor = hasCurrentWeekAction ? todayKey : (upcoming[0]?.date ?? todayKey);
  const monday = getMonday(parseKey(calendarAnchor));
  const keys = weekKeys(parseKey(calendarAnchor));
  const weekActions = allActions.filter((action) => keys.includes(action.date));

  const weekCalendar = keys
    .map((key) => {
      const actions = weekActions.filter((action) => action.date === key);
      const used = actions.reduce((sum, action) => sum + Math.max(1, Math.floor(action.focusBlocks || 1)), 0);
      const capacity = capacityForDate(key, capacityProfiles);
      return `<div class="${cx('workstream-day', key === todayKey && 'is-today')}">
        <div class="workstream-day__date"><strong>${esc(shortDay(key))}</strong><span>${esc(shortDate(key))}</span></div>
        ${actions.length
          ? actions
              .map(
                (action) => `<div class="${cx('workstream-day__action', action.status === 'done' && 'is-done')}">
                  <span>${esc(action.title)}</span><small>${action.focusBlocks} block${action.focusBlocks === 1 ? '' : 's'}</small>
                </div>`,
              )
              .join('')
          : '<span class="workstream-day__empty">—</span>'}
        <small class="workstream-day__capacity">${used}/${capacity}</small>
      </div>`;
    })
    .join('');

  const schedule = upcoming.length
    ? upcoming
        .map(
          (action) => `<article class="${cx('workstream-schedule__item', action.status === 'done' && 'is-done')}">
            <div><strong>${esc(shortDate(action.date))}</strong><span>${esc(shortDay(action.date))}</span></div>
            <div><strong>${esc(action.title)}</strong><span>${action.focusBlocks} Focus Block${action.focusBlocks === 1 ? '' : 's'}${action.due ? ` · due ${esc(action.due)}` : ''}</span></div>
          </article>`,
        )
        .join('')
    : '<p class="empty">No upcoming action is scheduled for this workstream.</p>';

  const relatedApplications =
    workstream.type === 'career'
      ? Object.values(jobApplications).filter(
          (application) => application.stage !== 'rejected' && application.stage !== 'withdrawn',
        )
      : [];
  const live = relatedApplications.filter(
    (application) =>
      application.stage === 'screening' ||
      application.stage === 'interview' ||
      application.stage === 'final',
  ).length;

  return `
    <section class="workstream-detail">
      <header class="planner-manager__head">
        <button type="button" class="back" data-action="close-workstream">← Back</button>
        <p class="day__date">${priorityLabel(workstream.outcome.priority)} · ${esc(workstream.execution.status.toUpperCase())}</p>
        <h1>${esc(workstream.title)}</h1>
        <p>${esc(workstream.outcome.goal || 'No goal written yet.')}</p>
      </header>

      <section class="workstream-hero">
        <div><span>DEADLINE</span><strong>${esc(workstream.plan.deadline ?? 'No deadline')}</strong></div>
        <div><span>CURRENT MILESTONE</span><strong>${esc(workstream.execution.milestone ?? 'No milestone')}</strong></div>
        <div><span>NEXT ACTION</span><strong>${esc(workstream.execution.nextAction ?? 'No next action')}</strong></div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>THIS WEEK</span><strong>${esc(shortDate(dateKey(monday)))} – ${esc(shortDate(dateKey(addDays(monday, 6))))}</strong></div></div>
        <div class="workstream-week">${weekCalendar}</div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>SCHEDULE</span><strong>Only this workstream</strong></div></div>
        <div class="workstream-schedule">${schedule}</div>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>DEFINITION OF DONE</span><strong>Finish line</strong></div></div>
        ${workstream.plan.definitionOfDone.length
          ? `<ul class="workstream-dod">${workstream.plan.definitionOfDone.map((item) => `<li>${esc(item)}</li>`).join('')}</ul>`
          : '<p class="empty">No finish line written yet.</p>'}
      </section>

      ${workstream.type === 'career'
        ? `<section class="planner-manager__section">
            <div class="planner-section-head">
              <div><span>APPLICATIONS</span><strong>${relatedApplications.length} active · ${live} live pipeline</strong></div>
              <button type="button" class="btn btn--tiny" data-action="open-applications">Open tracker</button>
            </div>
          </section>`
        : ''}
    </section>`;
};
