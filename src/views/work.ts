import { formatLearningTime, nextCoreLesson, pathStats } from '../lib/learning';
import type {
  JobApplication,
  LearningPath,
  LearningProgress,
  WeekPlan,
  Workstream,
} from '../types';
import type { WeekPlanningSummary } from '../lib/planning';
import { esc } from '../ui/dom';

const priorityRank: Record<Workstream['outcome']['priority'], number> = {
  'north-star': 0,
  primary: 1,
  support: 2,
  next: 3,
};

const priorityLabel = (priority: Workstream['outcome']['priority']): string =>
  priority === 'north-star'
    ? 'NORTH STAR'
    : priority === 'primary'
      ? 'PRIMARY'
      : priority === 'support'
        ? 'SUPPORT'
        : 'NEXT';

const deadlineLabel = (deadline: string | null): string => {
  if (!deadline) return 'No deadline';
  const [year, month, day] = deadline.split('-').map(Number);
  if (!year || !month || !day) return deadline;
  return new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'short' }).format(
    new Date(year, month - 1, day),
  );
};

export const renderWorkHome = ({
  workstreams,
  weekSummary,
  weekPlan,
  applications,
  learningPaths,
  learningProgress,
}: {
  workstreams: Readonly<Record<string, Workstream>>;
  weekSummary: WeekPlanningSummary;
  weekPlan: WeekPlan | undefined;
  applications: Readonly<Record<string, JobApplication>>;
  learningPaths: readonly LearningPath[];
  learningProgress: LearningProgress;
}): string => {
  const all = Object.values(workstreams).sort(
    (a, b) =>
      priorityRank[a.outcome.priority] - priorityRank[b.outcome.priority] ||
      a.title.localeCompare(b.title),
  );
  const active = all.filter((workstream) => workstream.execution.status === 'active');
  const onDeck = all.filter((workstream) =>
    ['queued', 'maintenance', 'parked'].includes(workstream.execution.status),
  );

  const commitmentByWorkstream = new Map(
    weekSummary.commitments.map((commitment) => [commitment.workstreamId, commitment] as const),
  );

  const activeCards = active.length
    ? active
        .map((workstream) => {
          const commitment = commitmentByWorkstream.get(workstream.id);
          const weeklyPct =
            commitment && commitment.targetBlocks > 0
              ? Math.min(100, Math.round((commitment.completedBlocks / commitment.targetBlocks) * 100))
              : null;
          const blockText = commitment
            ? `${commitment.completedBlocks} done · ${commitment.scheduledBlocks}/${commitment.targetBlocks} blocks`
            : 'No weekly target';
          const next =
            workstream.execution.nextAction ||
            workstream.execution.milestone ||
            workstream.outcome.goal ||
            'No next action yet';

          let domainMeta = '';
          if (workstream.type === 'career') {
            const live = Object.values(applications).filter((application) =>
              ['screening', 'interview', 'final'].includes(application.stage),
            ).length;
            domainMeta = live ? `${live} live interview${live === 1 ? '' : 's'}` : `${Object.keys(applications).length} applications`;
          } else if (workstream.type === 'learning') {
            const nextPath = learningPaths.find((path) => nextCoreLesson(path, learningProgress));
            if (nextPath) {
              const stats = pathStats(nextPath, learningProgress);
              domainMeta = `${nextPath.title} · ${stats.completionRate}%`;
            }
          }

          return `<button type="button" class="work-card" data-action="open-workstream" data-id="${esc(workstream.id)}">
            <span class="work-card__top">
              <span>${priorityLabel(workstream.outcome.priority)}</span>
              <span>${weeklyPct === null ? esc(blockText) : `THIS WEEK · ${weeklyPct}%`}</span>
            </span>
            <strong>${esc(workstream.title)}</strong>
            <span class="work-card__next">${esc(next)}</span>
            ${weeklyPct === null
              ? ''
              : `<span class="work-card__progress" role="img" aria-label="This week ${weeklyPct}% complete">
                   <span style="width:${weeklyPct}%"></span>
                 </span>
                 <span class="work-card__progressmeta">${esc(blockText)}</span>`}
            <span class="work-card__bottom">
              <span>${esc(deadlineLabel(workstream.plan.deadline))}${domainMeta ? ` · ${esc(domainMeta)}` : ''}</span>
              <span aria-hidden="true">›</span>
            </span>
          </button>`;
        })
        .join('')
    : '<div class="work-empty"><strong>No active workstreams.</strong><span>Use Plan week to activate only what matters now.</span></div>';

  const onDeckCards = onDeck.length
    ? `<section class="work-section work-section--secondary">
        <div class="work-section__head"><span>ON DECK</span><strong>Important, not active today</strong></div>
        <div class="work-deck">
          ${onDeck
            .map(
              (workstream) => `<button type="button" class="work-deck__item" data-action="open-workstream" data-id="${esc(workstream.id)}">
                <span><strong>${esc(workstream.title)}</strong><small>${esc(workstream.execution.status)}</small></span>
                <span>›</span>
              </button>`,
            )
            .join('')}
        </div>
      </section>`
    : '';

  const hasLearningWorkstream = all.some((workstream) => workstream.type === 'learning');
  const learningFallback = !hasLearningWorkstream
    ? (() => {
        const nextPath = learningPaths.find((path) => nextCoreLesson(path, learningProgress));
        const nextLesson = nextPath ? nextCoreLesson(nextPath, learningProgress) : undefined;
        return `<button type="button" class="work-utility" data-action="open-learning-hub">
          <span><small>LEARNING</small><strong>Learning Paths</strong><em>${nextLesson ? `Next · ${esc(nextLesson.title)} · ${formatLearningTime(nextLesson.durationMinutes)}` : 'Open curriculum'}</em></span>
          <span>›</span>
        </button>`;
      })()
    : '';

  const buffer = Math.max(0, weekSummary.capacityBlocks - weekSummary.plannedBlocks);

  return `
    <section class="work-home">
      <header class="work-home__head">
        <div>
          <p class="day__date">WORK</p>
          <h1>What are you moving forward?</h1>
        </div>
        <button type="button" class="btn btn--tiny" data-action="open-planner">Plan week</button>
      </header>

      <div class="work-week-label">WEEK OF ${esc(deadlineLabel(weekSummary.startsOn).toUpperCase())}</div>
      <section class="work-week-summary">
        <div><strong>${weekSummary.plannedBlocks}/${weekSummary.capacityBlocks}</strong><span>blocks scheduled</span></div>
        <div><strong>${weekSummary.completedBlocks}</strong><span>blocks done</span></div>
        <div><strong>${buffer}</strong><span>buffer</span></div>
      </section>

      <section class="work-section">
        <div class="work-section__head"><span>ACTIVE NOW</span><strong>${active.length} workstream${active.length === 1 ? '' : 's'}</strong></div>
        <div class="work-card-list">${activeCards}</div>
      </section>

      ${onDeckCards}
      ${learningFallback}

      ${!weekPlan
        ? '<p class="work-home__hint">No Week Plan yet. Keep Work simple: activate only what deserves Focus Blocks this week.</p>'
        : ''}
    </section>`;
};
