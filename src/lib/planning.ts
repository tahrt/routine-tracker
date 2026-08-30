import { dateKey, getMonday, parseKey, weekKeys } from './date';
import type {
  CapacityProfile,
  JobApplication,
  PlannedAction,
  WeekPlan,
  Workstream,
  WorkstreamPriority,
} from '../types';

export interface TodayPlanItem {
  id: string;
  source: 'action';
  workstreamId: string;
  title: string;
  focusBlocks: number;
  due: string | null;
  linkedHabitId: string | null;
  applicationId: string | null;
  reason: string;
}

export interface TodayAttentionItem {
  id: string;
  source: 'application';
  workstreamId: string;
  title: string;
  due: string;
  applicationId: string;
  reason: string;
}

export interface TodaySuggestion {
  id: string;
  source: 'workstream';
  workstreamId: string;
  title: string;
  due: string | null;
  reason: string;
}

export interface TodayPlan {
  date: string;
  capacityBlocks: number;
  /** All scheduled blocks for the date, including actions already completed. */
  usedBlocks: number;
  remainingBlocks: number;
  /** Remaining explicitly scheduled work only. Suggestions/alerts never live here. */
  items: TodayPlanItem[];
  attention: TodayAttentionItem[];
  suggestions: TodaySuggestion[];
  warnings: string[];
}

export interface WeekCommitmentProgress {
  workstreamId: string;
  targetBlocks: number;
  scheduledBlocks: number;
  completedBlocks: number;
  outcome: string;
}

export interface WeekPlanningSummary {
  startsOn: string;
  capacityBlocks: number;
  plannedBlocks: number;
  completedBlocks: number;
  commitments: WeekCommitmentProgress[];
}

const PRIORITY_SCORE: Record<WorkstreamPriority, number> = {
  'north-star': 40,
  primary: 30,
  support: 20,
  next: 10,
};

const activeWorkstreams = (workstreams: Readonly<Record<string, Workstream>>): Workstream[] =>
  Object.values(workstreams).filter((workstream) => workstream.execution.status === 'active');

export const capacityForDate = (dateK: string, profiles: readonly CapacityProfile[]): number => {
  const weekday = parseKey(dateK).getDay();
  const profile = profiles.find((candidate) => candidate.weekday === weekday);
  if (!profile) return 0;
  return Math.max(0, Math.floor(profile.focusBlocks));
};

export const weekPlanForDate = (
  dateK: string,
  plans: Readonly<Record<string, WeekPlan>>,
): WeekPlan | undefined => {
  const monday = dateKey(getMonday(parseKey(dateK)));
  return Object.values(plans).find((plan) => plan.startsOn === monday);
};

export const planningAnchorForWork = (
  dateK: string,
  plans: Readonly<Record<string, WeekPlan>>,
): string => {
  if (weekPlanForDate(dateK, plans)) return dateK;

  const next = Object.values(plans)
    .filter((plan) => plan.startsOn > dateK)
    .sort((a, b) => a.startsOn.localeCompare(b.startsOn))[0];

  return next?.startsOn ?? dateK;
};

const deadlineUrgency = (due: string | null, dateK: string): number => {
  if (!due) return 0;
  if (due < dateK) return 100;
  if (due === dateK) return 90;

  const delta = Math.round((parseKey(due).getTime() - parseKey(dateK).getTime()) / 86_400_000);
  if (delta === 1) return 70;
  if (delta <= 3) return 50;
  if (delta <= 7) return 20;
  return 0;
};

const fitBlocks = (value: number): number => Math.max(1, Math.floor(value || 1));

interface RankedItem {
  item: TodayPlanItem;
  score: number;
  stableOrder: string;
}

const applicationWorkstream = (workstreams: readonly Workstream[]): Workstream | undefined =>
  workstreams.find((workstream) => workstream.type === 'career' && workstream.outcome.priority === 'north-star') ??
  workstreams.find((workstream) => workstream.type === 'career');

export const selectTodayPlan = ({
  dateK,
  capacityProfiles,
  workstreams,
  plannedActions,
  jobApplications,
}: {
  dateK: string;
  capacityProfiles: readonly CapacityProfile[];
  workstreams: Readonly<Record<string, Workstream>>;
  plannedActions: Readonly<Record<string, PlannedAction>>;
  jobApplications: Readonly<Record<string, JobApplication>>;
}): TodayPlan => {
  const capacityBlocks = capacityForDate(dateK, capacityProfiles);
  const active = activeWorkstreams(workstreams);
  const activeById = new Map(active.map((workstream) => [workstream.id, workstream] as const));
  const ranked: RankedItem[] = [];
  const warnings: string[] = [];

  const scheduledToday = Object.values(plannedActions).filter(
    (action) =>
      action.date === dateK &&
      (action.status === 'planned' || action.status === 'done') &&
      activeById.has(action.workstreamId),
  );
  const usedBlocks = scheduledToday.reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);

  // Only explicit PlannedAction records consume capacity and become executable Today items.
  for (const action of scheduledToday) {
    if (action.status !== 'planned') continue;
    const workstream = activeById.get(action.workstreamId);
    if (!workstream) continue;
    const blocks = fitBlocks(action.focusBlocks);
    const due = action.due ?? workstream.plan.deadline;
    ranked.push({
      item: {
        id: action.id,
        source: 'action',
        workstreamId: workstream.id,
        title: action.title,
        focusBlocks: blocks,
        due: due ?? null,
        linkedHabitId: action.linkedHabitId ?? workstream.linkedHabitId ?? null,
        applicationId: action.applicationId ?? null,
        reason: due && due <= dateK ? 'Due now' : workstream.outcome.priority === 'north-star' ? 'North Star' : 'Planned today',
      },
      score: 300 + deadlineUrgency(due ?? null, dateK) + PRIORITY_SCORE[workstream.outcome.priority],
      stableOrder: `0:${action.id}`,
    });
  }

  ranked.sort((a, b) => b.score - a.score || a.stableOrder.localeCompare(b.stableOrder));
  const items = ranked.slice(0, 2).map((candidate) => candidate.item);

  // Application nextAction is an alert unless explicitly scheduled as PlannedAction.
  const attention: TodayAttentionItem[] = [];
  const career = applicationWorkstream(active);
  if (career) {
    for (const application of Object.values(jobApplications)) {
      if (
        !application.nextAction ||
        !application.nextActionDue ||
        application.nextActionDue > dateK ||
        application.stage === 'rejected' ||
        application.stage === 'withdrawn' ||
        application.stage === 'offer'
      ) {
        continue;
      }

      const hasExplicitAction = scheduledToday.some((action) => action.applicationId === application.id);
      if (hasExplicitAction) continue;

      const livePipeline =
        application.stage === 'screening' || application.stage === 'interview' || application.stage === 'final';
      attention.push({
        id: `application:${application.id}`,
        source: 'application',
        workstreamId: career.id,
        title: `${application.company} — ${application.nextAction}`,
        due: application.nextActionDue,
        applicationId: application.id,
        reason: livePipeline
          ? 'Live pipeline'
          : application.nextActionDue < dateK
            ? 'Overdue application'
            : 'Application due',
      });
    }
  }

  attention.sort((a, b) => {
    const aLive = a.reason === 'Live pipeline' ? 1 : 0;
    const bLive = b.reason === 'Live pipeline' ? 1 : 0;
    return bLive - aLive || a.due.localeCompare(b.due) || a.id.localeCompare(b.id);
  });

  // Workstream nextAction is context only. It must never consume Focus Block capacity.
  const suggestions: TodaySuggestion[] = [];
  for (const workstream of active) {
    const title = workstream.execution.nextAction?.trim();
    if (!title) continue;
    const alreadyScheduled = scheduledToday.some((action) => action.workstreamId === workstream.id);
    if (alreadyScheduled) continue;
    suggestions.push({
      id: `workstream:${workstream.id}`,
      source: 'workstream',
      workstreamId: workstream.id,
      title,
      due: workstream.plan.deadline,
      reason: workstream.outcome.priority === 'north-star' ? 'North Star next action' : 'Active milestone',
    });
  }

  suggestions.sort(
    (a, b) =>
      deadlineUrgency(b.due, dateK) - deadlineUrgency(a.due, dateK) ||
      PRIORITY_SCORE[workstreams[b.workstreamId]?.outcome.priority ?? 'next'] -
        PRIORITY_SCORE[workstreams[a.workstreamId]?.outcome.priority ?? 'next'] ||
      a.id.localeCompare(b.id),
  );

  const overdueProject = active.find(
    (workstream) =>
      workstream.type === 'project' &&
      workstream.plan.deadline !== null &&
      workstream.plan.deadline < dateK,
  );
  if (overdueProject) warnings.push(`${overdueProject.title}: deadline missed — replan explicitly.`);

  if (usedBlocks > capacityBlocks) {
    warnings.push(`Today is overbooked by ${usedBlocks - capacityBlocks} Focus Block${usedBlocks - capacityBlocks === 1 ? '' : 's'}.`);
  }

  return {
    date: dateK,
    capacityBlocks,
    usedBlocks,
    remainingBlocks: Math.max(0, capacityBlocks - usedBlocks),
    items,
    attention,
    suggestions,
    warnings,
  };
};

export const weekPlanningSummary = ({
  dateK,
  capacityProfiles,
  weekPlans,
  plannedActions,
}: {
  dateK: string;
  capacityProfiles: readonly CapacityProfile[];
  weekPlans: Readonly<Record<string, WeekPlan>>;
  plannedActions: Readonly<Record<string, PlannedAction>>;
}): WeekPlanningSummary => {
  const monday = dateKey(getMonday(parseKey(dateK)));
  const keys = weekKeys(parseKey(dateK));
  const keySet = new Set(keys);
  const plan = weekPlanForDate(dateK, weekPlans);

  const actions = Object.values(plannedActions).filter(
    (action) => keySet.has(action.date) && (action.status === 'planned' || action.status === 'done'),
  );
  const capacityBlocks = keys.reduce((sum, key) => sum + capacityForDate(key, capacityProfiles), 0);
  const plannedBlocks = actions.reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);
  const completedBlocks = actions
    .filter((action) => action.status === 'done')
    .reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);

  const commitments = (plan?.commitments ?? []).map((commitment) => {
    const scheduled = actions
      .filter((action) => action.workstreamId === commitment.workstreamId)
      .reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);
    const completed = actions
      .filter((action) => action.workstreamId === commitment.workstreamId && action.status === 'done')
      .reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);
    return {
      workstreamId: commitment.workstreamId,
      targetBlocks: Math.max(0, commitment.targetBlocks),
      scheduledBlocks: scheduled,
      completedBlocks: completed,
      outcome: commitment.outcome,
    };
  });

  return {
    startsOn: monday,
    capacityBlocks,
    plannedBlocks,
    completedBlocks,
    commitments,
  };
};
