import { formatLong, parseKey, weekKeys } from '../lib/date';
import type {
  Habit,
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

export const renderTodayPlanning = ({
  plan,
  workstreams,
}: {
  plan: TodayPlan;
  workstreams: Readonly<Record<string, Workstream>>;
}): string => {
  const capacityLabel = `${plan.capacityBlocks} Focus Block${plan.capacityBlocks === 1 ? '' : 's'}`;
  const items = plan.items
    .map((item, index) => {
      const workstream = workstreams[item.workstreamId];
      const actionButtons =
        item.source === 'action'
          ? `<div class="planner-action__buttons">
               <button type="button" class="btn btn--primary btn--tiny" data-action="planning-action-status"
                       data-id="${esc(item.id)}" data-status="done">Done</button>
               <button type="button" class="btn btn--tiny" data-action="planning-action-status"
                       data-id="${esc(item.id)}" data-status="deferred">Defer</button>
               <button type="button" class="btn btn--tiny" data-action="planning-action-status"
                       data-id="${esc(item.id)}" data-status="cancelled">Cancel</button>
             </div>`
          : `<button type="button" class="btn btn--tiny" data-action="open-planner">Plan this</button>`;

      return `<article class="${cx('planner-action', index === 0 && 'planner-action--must')}">
        <div class="planner-action__eyebrow">${index === 0 ? 'MUST WIN' : 'NEXT'} · ${esc(item.reason)}</div>
        <div class="planner-action__body">
          <div>
            <h3>${esc(item.title)}</h3>
            <p>${esc(workstreamLabel(workstream))} · ${item.focusBlocks} block${item.focusBlocks === 1 ? '' : 's'}${item.due ? ` · due ${esc(item.due)}` : ''}</p>
          </div>
          ${actionButtons}
        </div>
      </article>`;
    })
    .join('');

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
      ${items || `<div class="planner-empty">
        <strong>No flexible action planned yet.</strong>
        <span>Your routine still works normally. Add only the work that deserves a Focus Block.</span>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan today</button>
      </div>`}
      <div class="planner-capacity">
        <span>${plan.usedBlocks} / ${plan.capacityBlocks} blocks planned</span>
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
          return `<div class="planner-commitment">
            <div class="planner-commitment__top">
              <strong>${esc(workstreamLabel(workstream))}</strong>
              <span>${commitment.completedBlocks} / ${commitment.targetBlocks} blocks</span>
            </div>
            <div class="planner-commitment__bar"><span style="width:${pct}%"></span></div>
            <p>${esc(commitment.outcome)}</p>
          </div>`;
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
          <strong>${summary.completedBlocks} done · ${summary.plannedBlocks} planned · ${summary.capacityBlocks} capacity</strong>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan week</button>
      </div>
      ${commitments}
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

const actionCard = (action: PlannedAction, workstreams: Readonly<Record<string, Workstream>>): string => {
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
  </article>`;
};

export const renderPlanningManager = ({
  todayKey,
  workstreams,
  habits,
  weekPlan,
  plannedActions,
}: {
  todayKey: string;
  workstreams: Readonly<Record<string, Workstream>>;
  habits: readonly Habit[];
  weekPlan: WeekPlan | undefined;
  plannedActions: Readonly<Record<string, PlannedAction>>;
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
                <div>
                  <span>${priorityLabel(workstream.outcome.priority)} · ${esc(workstream.type)}</span>
                  <h3>${esc(workstream.title)}</h3>
                </div>
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
        <div class="planner-section-head"><div><span>WORKSTREAMS</span><strong>Only active work can reach Today</strong></div></div>
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
        <div class="planner-section-head"><div><span>THIS WEEK</span><strong>Allocate Focus Blocks</strong></div></div>
        ${commitments}
        <button type="button" class="btn btn--primary btn--tiny" data-action="planning-save-week">Save Week Plan</button>
      </section>

      <section class="planner-manager__section">
        <div class="planner-section-head"><div><span>PLANNED ACTIONS</span><strong>Explicit dates, no auto-carry</strong></div></div>
        ${weekActions.length ? weekActions.map((action) => actionCard(action, workstreams)).join('') : '<p class="empty">No actions planned this week.</p>'}

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
