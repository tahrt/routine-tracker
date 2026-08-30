import { describe, expect, it } from 'vitest';
import {
  capacityForDate,
  selectTodayPlan,
  weekPlanForDate,
  weekPlanningSummary,
} from '../src/lib/planning';
import type {
  CapacityProfile,
  JobApplication,
  PlannedAction,
  WeekPlan,
  Workstream,
} from '../src/types';

const CAPACITY: CapacityProfile[] = [
  { weekday: 0, focusBlocks: 3, label: 'Weekend' },
  { weekday: 1, focusBlocks: 2, label: 'Normal' },
  { weekday: 2, focusBlocks: 2, label: 'Normal' },
  { weekday: 3, focusBlocks: 1, label: 'Low' },
  { weekday: 4, focusBlocks: 2, label: 'Normal' },
  { weekday: 5, focusBlocks: 1, label: 'Low' },
  { weekday: 6, focusBlocks: 3, label: 'Weekend' },
];

const job: Workstream = {
  id: 'job',
  type: 'career',
  title: 'Job Search',
  outcome: { goal: 'Get a good job', priority: 'north-star' },
  plan: { deadline: '2026-11-30', definitionOfDone: ['Accepted offer'] },
  execution: {
    status: 'active',
    milestone: 'Enter market',
    weeklyCommitment: 'Apply',
    nextAction: 'Prepare application',
  },
  linkedHabitId: 'jobsearch',
};

const project: Workstream = {
  id: 'project',
  type: 'project',
  title: 'Content Production',
  outcome: { goal: 'Close seam', priority: 'primary' },
  plan: { deadline: '2026-09-02', definitionOfDone: ['Validated output'] },
  execution: {
    status: 'active',
    milestone: 'SEAM',
    weeklyCommitment: 'Close seam',
    nextAction: 'Run seam test',
  },
  linkedHabitId: 'personal',
};

describe('capacityForDate', () => {
  it('uses the configured weekday capacity', () => {
    expect(capacityForDate('2026-08-31', CAPACITY)).toBe(2); // Mon
    expect(capacityForDate('2026-09-02', CAPACITY)).toBe(1); // Wed
    expect(capacityForDate('2026-09-06', CAPACITY)).toBe(3); // Sun
  });
});

describe('selectTodayPlan', () => {
  it('keeps explicit scheduled work visible and flags an overbooked day', () => {
    const actions: Record<string, PlannedAction> = {
      a: {
        id: 'a',
        date: '2026-09-02',
        workstreamId: 'project',
        title: 'Large action',
        focusBlocks: 2,
        status: 'planned',
      },
      b: {
        id: 'b',
        date: '2026-09-02',
        workstreamId: 'job',
        title: 'Small action',
        focusBlocks: 1,
        status: 'planned',
      },
    };

    const out = selectTodayPlan({
      dateK: '2026-09-02',
      capacityProfiles: CAPACITY,
      workstreams: { job, project },
      plannedActions: actions,
      jobApplications: {},
    });

    expect(out.capacityBlocks).toBe(1);
    expect(out.items.map((item) => item.id)).toEqual(['a', 'b']);
    expect(out.usedBlocks).toBe(3);
    expect(out.remainingBlocks).toBe(0);
    expect(out.warnings.join(' ')).toContain('overbooked by 2');
  });

  it('does not auto-carry a missed Planned Action from yesterday', () => {
    const actions: Record<string, PlannedAction> = {
      old: {
        id: 'old',
        date: '2026-08-31',
        workstreamId: 'job',
        title: 'Yesterday task',
        focusBlocks: 1,
        status: 'planned',
      },
    };

    const out = selectTodayPlan({
      dateK: '2026-09-01',
      capacityProfiles: CAPACITY,
      workstreams: { job },
      plannedActions: actions,
      jobApplications: {},
    });

    expect(out.items.some((item) => item.id === 'old')).toBe(false);
  });

  it('never surfaces queued or parked workstreams', () => {
    const queued: Workstream = {
      ...project,
      id: 'queued',
      execution: { ...project.execution, status: 'queued', nextAction: 'Should stay hidden' },
    };
    const action: PlannedAction = {
      id: 'queued-action',
      date: '2026-09-01',
      workstreamId: 'queued',
      title: 'Hidden action',
      focusBlocks: 1,
      status: 'planned',
    };

    const out = selectTodayPlan({
      dateK: '2026-09-01',
      capacityProfiles: CAPACITY,
      workstreams: { queued },
      plannedActions: { 'queued-action': action },
      jobApplications: {},
    });

    expect(out.items).toEqual([]);
  });

  it('keeps a due live-pipeline application as attention until it is explicitly scheduled', () => {
    const application: JobApplication = {
      id: 'app',
      company: 'Example',
      role: 'AI Solutions',
      stage: 'interview',
      nextAction: 'Prepare interview',
      nextActionDue: '2026-09-01',
    };

    const out = selectTodayPlan({
      dateK: '2026-09-01',
      capacityProfiles: CAPACITY,
      workstreams: { job, project },
      plannedActions: {},
      jobApplications: { app: application },
    });

    expect(out.items).toEqual([]);
    expect(out.usedBlocks).toBe(0);
    expect(out.attention[0]?.source).toBe('application');
    expect(out.attention[0]?.title).toContain('Prepare interview');
    expect(out.attention[0]?.reason).toBe('Live pipeline');
  });

  it('keeps workstream next actions as suggestions and ranks a hard deadline first', () => {
    const urgentProject = {
      ...project,
      plan: { ...project.plan, deadline: '2026-09-01' },
    };

    const out = selectTodayPlan({
      dateK: '2026-09-01',
      capacityProfiles: CAPACITY,
      workstreams: { job, project: urgentProject },
      plannedActions: {},
      jobApplications: {},
    });

    expect(out.items).toEqual([]);
    expect(out.usedBlocks).toBe(0);
    expect(out.suggestions[0]?.workstreamId).toBe('project');
    expect(out.suggestions[0]?.reason).toBe('Active milestone');
  });

  it('flags an already-missed project deadline for explicit replan', () => {
    const late = {
      ...project,
      plan: { ...project.plan, deadline: '2026-08-31' },
    };
    const out = selectTodayPlan({
      dateK: '2026-09-01',
      capacityProfiles: CAPACITY,
      workstreams: { project: late },
      plannedActions: {},
      jobApplications: {},
    });

    expect(out.warnings.join(' ')).toContain('deadline missed');
  });
});

describe('week planning', () => {
  const plan: WeekPlan = {
    id: '2026-W36',
    startsOn: '2026-08-31',
    commitments: [
      { workstreamId: 'job', targetBlocks: 6, outcome: 'Enter market' },
      { workstreamId: 'project', targetBlocks: 4, outcome: 'Close seam' },
    ],
  };

  it('finds a Week Plan by Monday boundary', () => {
    expect(weekPlanForDate('2026-09-03', { week: plan })?.id).toBe('2026-W36');
  });

  it('does not count deferred actions as still scheduled', () => {
    const actions: Record<string, PlannedAction> = {
      deferred: {
        id: 'deferred',
        date: '2026-09-01',
        workstreamId: 'job',
        title: 'Old plan',
        focusBlocks: 2,
        status: 'deferred',
      },
      replanned: {
        id: 'replanned',
        date: '2026-09-02',
        workstreamId: 'job',
        title: 'New plan',
        focusBlocks: 1,
        status: 'planned',
      },
    };

    const out = weekPlanningSummary({
      dateK: '2026-09-03',
      capacityProfiles: CAPACITY,
      weekPlans: { week: plan },
      plannedActions: actions,
    });

    expect(out.plannedBlocks).toBe(1);
    expect(out.commitments.find((item) => item.workstreamId === 'job')?.scheduledBlocks).toBe(1);
  });

  it('summarizes capacity, planned blocks, completed blocks and commitments', () => {
    const actions: Record<string, PlannedAction> = {
      a: {
        id: 'a',
        date: '2026-08-31',
        workstreamId: 'job',
        title: 'Apply',
        focusBlocks: 1,
        status: 'done',
      },
      b: {
        id: 'b',
        date: '2026-09-01',
        workstreamId: 'project',
        title: 'Build',
        focusBlocks: 2,
        status: 'planned',
      },
      old: {
        id: 'old',
        date: '2026-08-30',
        workstreamId: 'job',
        title: 'Outside week',
        focusBlocks: 3,
        status: 'done',
      },
    };

    const out = weekPlanningSummary({
      dateK: '2026-09-03',
      capacityProfiles: CAPACITY,
      weekPlans: { week: plan },
      plannedActions: actions,
    });

    expect(out.capacityBlocks).toBe(14);
    expect(out.plannedBlocks).toBe(3);
    expect(out.completedBlocks).toBe(1);
    expect(out.commitments.find((item) => item.workstreamId === 'job')?.completedBlocks).toBe(1);
    expect(out.commitments.find((item) => item.workstreamId === 'project')?.completedBlocks).toBe(0);
  });
});
