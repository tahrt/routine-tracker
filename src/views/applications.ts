import { getMonday, parseKey } from '../lib/date';
import type { ApplicationStage, JobApplication } from '../types';
import { esc } from '../ui/dom';

const STAGES: ApplicationStage[] = [
  'saved',
  'preparing',
  'applied',
  'screening',
  'interview',
  'final',
  'offer',
  'rejected',
  'withdrawn',
];

const isTerminal = (stage: ApplicationStage): boolean =>
  stage === 'offer' || stage === 'rejected' || stage === 'withdrawn';

const stageLabel = (stage: ApplicationStage): string =>
  stage.charAt(0).toUpperCase() + stage.slice(1);

const needsAttention = (application: JobApplication, todayKey: string): boolean =>
  !isTerminal(application.stage) &&
  Boolean(application.nextAction && application.nextActionDue && application.nextActionDue <= todayKey);

const submittedThisWeek = (applications: readonly JobApplication[], todayKey: string): number => {
  const monday = getMonday(parseKey(todayKey));
  const mondayKey = [
    monday.getFullYear(),
    String(monday.getMonth() + 1).padStart(2, '0'),
    String(monday.getDate()).padStart(2, '0'),
  ].join('-');
  return applications.filter((application) => application.appliedAt && application.appliedAt.slice(0, 10) >= mondayKey).length;
};

const stageOptions = (selected: ApplicationStage): string =>
  STAGES.map(
    (stage) =>
      `<option value="${stage}" ${stage === selected ? 'selected' : ''}>${stageLabel(stage)}</option>`,
  ).join('');

const card = (application: JobApplication, todayKey: string): string => {
  const attention = needsAttention(application, todayKey);
  const next = application.nextAction || 'No next action';
  const due = application.nextActionDue ? `Due ${esc(application.nextActionDue)}` : 'No due date';

  return `
    <details class="application-row ${attention ? 'application-row--attention' : ''}" data-application-id="${esc(application.id)}">
      <summary>
        <span class="application-row__copy">
          <small>${attention ? 'NEEDS ATTENTION' : stageLabel(application.stage).toUpperCase()}</small>
          <strong>${esc(application.company)}</strong>
          <em>${esc(application.role)}</em>
        </span>
        <span class="application-row__next">
          <strong>${esc(next)}</strong>
          <small>${due}</small>
        </span>
      </summary>

      <div class="application-row__editor">
        <div class="planner-form-grid">
          <label>Stage
            <select data-field="stage" aria-label="Stage for ${esc(application.company)}">${stageOptions(application.stage)}</select>
          </label>
          <label>Fit 1–5
            <input data-field="fitScore" type="number" min="1" max="5" value="${application.fitScore ?? ''}">
          </label>
          <label>Next action due
            <input data-field="nextActionDue" type="date" value="${esc(application.nextActionDue ?? '')}">
          </label>
          <label>Next event
            <input data-field="nextEventAt" type="date" value="${esc(application.nextEventAt?.slice(0, 10) ?? '')}">
          </label>
        </div>
        <label>Next action
          <input data-field="nextAction" value="${esc(application.nextAction ?? '')}" placeholder="Prepare interview">
        </label>
        <label>Job URL
          <input data-field="jobUrl" value="${esc(application.jobUrl ?? '')}" placeholder="https://…">
        </label>
        <label>Fit reason
          <input data-field="fitReason" value="${esc(application.fitReason ?? '')}" placeholder="Why this role fits">
        </label>
        <label>Notes
          <textarea data-field="notes" rows="2" placeholder="Private notes">${esc(application.notes ?? '')}</textarea>
        </label>
        <div class="application-card__footer">
          <span>${application.appliedAt ? `Applied ${esc(application.appliedAt.slice(0, 10))}` : application.savedAt ? `Saved ${esc(application.savedAt.slice(0, 10))}` : 'Not dated'}</span>
          <button type="button" class="btn btn--primary btn--tiny" data-action="application-save" data-id="${esc(application.id)}">Save changes</button>
        </div>
      </div>
    </details>`;
};

export const renderApplications = ({
  todayKey,
  applications,
}: {
  todayKey: string;
  applications: Readonly<Record<string, JobApplication>>;
}): string => {
  const all = Object.values(applications);
  const attention = all.filter((application) => needsAttention(application, todayKey));
  const activeInterviews = all.filter(
    (application) =>
      application.stage === 'screening' ||
      application.stage === 'interview' ||
      application.stage === 'final',
  ).length;
  const offers = all.filter((application) => application.stage === 'offer').length;
  const submitted = submittedThisWeek(all, todayKey);

  const sorted = [...all].sort((a, b) => {
    const attentionDelta = Number(needsAttention(b, todayKey)) - Number(needsAttention(a, todayKey));
    if (attentionDelta !== 0) return attentionDelta;
    const dueA = a.nextActionDue ?? '9999-12-31';
    const dueB = b.nextActionDue ?? '9999-12-31';
    return dueA.localeCompare(dueB) || a.company.localeCompare(b.company);
  });

  return `
    <section class="applications applications--simple">
      <header class="planner-manager__head planner-manager__head--compact">
        <button type="button" class="back" data-action="close-applications">← Job Search</button>
        <p class="day__date">APPLICATIONS</p>
        <h1>Pipeline</h1>
        <p>Keep only the next move visible.</p>
      </header>

      <section class="application-metrics application-metrics--simple">
        <div><strong>${attention.length}</strong><span>needs attention</span></div>
        <div><strong>${submitted}</strong><span>applied this week</span></div>
        <div><strong>${activeInterviews}</strong><span>live interviews</span></div>
        <div><strong>${offers}</strong><span>offers</span></div>
      </section>

      ${attention.length
        ? `<section class="application-attention">
            <div class="planner-section-head"><div><span>NEEDS ATTENTION</span><strong>Closest conversion work first</strong></div></div>
            ${attention
              .map(
                (application) =>
                  `<div class="application-attention__row">
                    <div><strong>${esc(application.company)}</strong><span>${esc(application.nextAction ?? '')}</span></div>
                    <span>${esc(application.nextActionDue ?? '')}</span>
                  </div>`,
              )
              .join('')}
          </section>`
        : ''}

      <section class="planner-manager__section planner-manager__section--flat">
        <div class="planner-section-head"><div><span>PIPELINE</span><strong>${all.length} applications</strong></div></div>
        <div class="application-list">
          ${sorted.length ? sorted.map((application) => card(application, todayKey)).join('') : '<p class="empty">No applications yet.</p>'}
        </div>

        <details class="planner-disclosure planner-disclosure--create">
          <summary>＋ Add application</summary>
          <div class="planner-disclosure__body">
            <div class="planner-form-grid">
              <label>Company<input id="application-new-company" placeholder="Company"></label>
              <label>Role<input id="application-new-role" placeholder="AI Solutions Engineer"></label>
              <label>Fit 1–5<input id="application-new-fit" type="number" min="1" max="5"></label>
              <label>Stage<select id="application-new-stage">${stageOptions('saved')}</select></label>
              <label>Next action due<input id="application-new-due" type="date"></label>
              <label>Job URL<input id="application-new-url" placeholder="https://…"></label>
            </div>
            <label>Next action<input id="application-new-next" placeholder="Tailor and submit application"></label>
            <button type="button" class="btn btn--primary btn--tiny" data-action="application-add">Add application</button>
          </div>
        </details>
      </section>
    </section>`;
};
