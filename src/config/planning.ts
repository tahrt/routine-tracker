import type { CapacityProfile, PlanningData } from '../types';

/**
 * Seed only. Runtime capacity is persisted separately and can be edited later.
 * One Focus Block currently represents 90 minutes.
 */
export const DEFAULT_CAPACITY_PROFILES: CapacityProfile[] = [
  { weekday: 0, focusBlocks: 3, label: 'Weekend' },
  { weekday: 1, focusBlocks: 2, label: 'Normal weekday' },
  { weekday: 2, focusBlocks: 2, label: 'Normal weekday' },
  { weekday: 3, focusBlocks: 1, label: 'Low-capacity weekday' },
  { weekday: 4, focusBlocks: 2, label: 'Normal weekday' },
  { weekday: 5, focusBlocks: 1, label: 'Low-capacity weekday' },
  { weekday: 6, focusBlocks: 3, label: 'Weekend' },
];

export const defaultPlanningData = (): PlanningData => ({
  workstreams: {},
  capacityProfiles: structuredClone(DEFAULT_CAPACITY_PROFILES),
  weekPlans: {},
  plannedActions: {},
  jobApplications: {},
});

/**
 * Be forgiving when loading/importing partially-written planning state.
 * Existing routine history is more valuable than refusing the whole backup.
 */
export const normalizePlanningData = (raw: unknown): PlanningData => {
  const source = typeof raw === 'object' && raw !== null ? (raw as Partial<PlanningData>) : {};
  const defaults = defaultPlanningData();

  return {
    workstreams:
      typeof source.workstreams === 'object' && source.workstreams !== null
        ? structuredClone(source.workstreams)
        : defaults.workstreams,
    capacityProfiles:
      Array.isArray(source.capacityProfiles) && source.capacityProfiles.length > 0
        ? structuredClone(source.capacityProfiles)
        : defaults.capacityProfiles,
    weekPlans:
      typeof source.weekPlans === 'object' && source.weekPlans !== null
        ? structuredClone(source.weekPlans)
        : defaults.weekPlans,
    plannedActions:
      typeof source.plannedActions === 'object' && source.plannedActions !== null
        ? structuredClone(source.plannedActions)
        : defaults.plannedActions,
    jobApplications:
      typeof source.jobApplications === 'object' && source.jobApplications !== null
        ? structuredClone(source.jobApplications)
        : defaults.jobApplications,
  };
};
