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
  source: 'action' | 'application' | 'workstream';
  workstreamId: string;
  title: string;
  focusBlocks: number;
  due: string | null;
  linkedHabitId: string | null;
  applicationId: string | null;
  reason: string;
}

export interface TodayPlan {
  date: string;
  capacityBlocks: number;
  usedBlocks: number;
  remainingBlocks: number;
  items: TodayPlanItem[];
  warnings: string[];
}

export interface WeekCommitmentProgress {
  workstreamId: string;
  targetBlocks: number;
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

  // Persisted actions only count on their explicitly assigned date. Older actions
  // are intentionally NOT auto-carried into today.
  for (const action of Object.values(plannedActions)) {
    if (action.status !== 'planned' || action.date !== dateK) continue;
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

  // A due application next action can surface without duplicating it into a
  // PlannedAction. This is a view candidate only; rendering never mutates data.
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
      const hasExplicitAction = Object.values(plannedActions).some(
        (action) =>
          action.status === 'planned' &&
          action.date === dateK &&
          action.applicationId === application.id,
      );
      if (hasExplicitAction) continue;

      const interviewBoost =
        application.stage === 'screening' || application.stage === 'interview' || application.stage === 'final' ? 80 : 0;
      ranked.push({
        item: {
          id: `application:${application.id}`,
          source: 'application',
          workstreamId: career.id,
          title: `${application.company} — ${application.nextAction}`,
          focusBlocks: 1,
          due: application.nextActionDue,
          linkedHabitId: career.linkedHabitId ?? null,
          applicationId: application.id,
          reason: interviewBoost > 0 ? 'Live pipeline' : application.nextActionDue < dateK ? 'Overdue application' : 'Application due',
        },
        score:
          400 +
          interviewBoost +
          deadlineUrgency(application.nextActionDue, dateK) +
          PRIORITY_SCORE[career.outcome.priority],
        stableOrder: `1:${application.id}`,
      });
    }
  }

  // Workstream nextAction is fallback context, not an automatically carried task.
  // Only use it when the user has no explicit action for that workstream today.
  for (const workstream of active) {
    const title = workstream.execution.nextAction?.trim();
    if (!title) continue;
    const alreadyRepresented = ranked.some((candidate) => candidate.item.workstreamId === workstream.id);
    if (alreadyRepresented) continue;
    ranked.push({
      item: {
        id: `workstream:${workstream.id}`,
        source: 'workstream',
        workstreamId: workstream.id,
        title,
        focusBlocks: 1,
        due: workstream.plan.deadline,
        linkedHabitId: workstream.linkedHabitId ?? null,
        applicationId: null,
        reason: workstream.outcome.priority === 'north-star' ? 'North Star next action' : 'Active milestone',
      },
      score: 100 + deadlineUrgency(workstream.plan.deadline, dateK) + PRIORITY_SCORE[workstream.outcome.priority],
      stableOrder: `2:${workstream.id}`,
    });
  }

  ranked.sort((a, b) => b.score - a.score || a.stableOrder.localeCompare(b.stableOrder));

  const items: TodayPlanItem[] = [];
  let usedBlocks = 0;
  for (const candidate of ranked) {
    if (items.length >= 2) break;
    if (usedBlocks + candidate.item.focusBlocks > capacityBlocks) continue;
    items.push(candidate.item);
    usedBlocks += candidate.item.focusBlocks;
  }

  const overdueProject = active.find(
    (workstream) =>
      workstream.type === 'project' &&
      workstream.plan.deadline !== null &&
      workstream.plan.deadline < dateK,
  );
  if (overdueProject) warnings.push(`${overdueProject.title}: deadline missed — replan explicitly.`);

  const oversize = ranked.find((candidate) => candidate.item.focusBlocks > capacityBlocks);
  if (capacityBlocks > 0 && items.length === 0 && oversize) {
    warnings.push('Top action is larger than today’s capacity. Replan instead of overbooking.');
  }

  return {
    date: dateK,
    capacityBlocks,
    usedBlocks,
    remainingBlocks: Math.max(0, capacityBlocks - usedBlocks),
    items,
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
    (action) => keySet.has(action.date) && action.status !== 'cancelled',
  );
  const capacityBlocks = keys.reduce((sum, key) => sum + capacityForDate(key, capacityProfiles), 0);
  const plannedBlocks = actions.reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);
  const completedBlocks = actions
    .filter((action) => action.status === 'done')
    .reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);

  const commitments = (plan?.commitments ?? []).map((commitment) => {
    const completed = actions
      .filter((action) => action.workstreamId === commitment.workstreamId && action.status === 'done')
      .reduce((sum, action) => sum + fitBlocks(action.focusBlocks), 0);
    return {
      workstreamId: commitment.workstreamId,
      targetBlocks: Math.max(0, commitment.targetBlocks),
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
