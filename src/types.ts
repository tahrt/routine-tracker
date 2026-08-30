/** Shared data shapes. See spec §4. */

export type HabitId = string;

/** A task as it lives in a weekday template. */
export interface TemplateTask {
  id: string;
  name: string;
  time: string;
  core?: boolean;
  habit?: HabitId | null;
  weight?: number;
}

export interface DayTemplate {
  type: string;
  tasks: TemplateTask[];
}

/** Keys are Date.getDay() values: 0 = Sunday … 6 = Saturday. */
export type WeekTemplate = Record<number, DayTemplate>;

export interface TemplateVersion {
  version: number;
  /** YYYY-MM-DD. Highest version with effectiveFrom <= today is current. */
  effectiveFrom: string;
  createdAt: string;
  days: WeekTemplate;
}

/**
 * active  — tracked normally, counts toward the week average.
 * rest    — planned rest / holiday / sick, excluded from the average.
 * skipped — deliberately abandoned, counts as an honest 0%.
 */
export type DayStatus = 'active' | 'rest' | 'skipped';

/** A task frozen into a day record. Fully resolved — no optional fields. */
export interface DayTask {
  id: string;
  name: string;
  time: string;
  core: boolean;
  habit: HabitId | null;
  weight: number;
  done: boolean;
  adhoc: boolean;
}

export interface DayRecord {
  /** YYYY-MM-DD */
  date: string;
  status: DayStatus;
  /** Snapshot of the template's day-type label. */
  dayType: string;
  templateVersion: number;
  /** Full snapshot — history renders from this, never from the live template. */
  tasks: DayTask[];
  note: string;
  createdAt: string;
  updatedAt: string;
  /** True if the record was first edited on a later calendar day. */
  editedRetroactively: boolean;
}

export interface Settings {
  timezone: string;
  dayCutoffHour: number;
  /** 1 = Monday. Only Monday is supported in v1. */
  weekStartsOn: number;
  lastExportAt: string | null;
}

export interface Habit {
  id: HabitId;
  label: string;
  color: string;
  /** Archived habits keep their history but are hidden from new task mappings. */
  archived?: boolean;
}


export type LearningResourceType = 'video' | 'article' | 'exercise' | 'case-study' | 'practice' | 'project';
export type LearningPriority = 'core' | 'recommended' | 'optional';

export interface LearningLesson {
  /** Stable across resource swaps so progress survives curriculum edits. */
  id: string;
  title: string;
  source: string;
  type: LearningResourceType;
  priority: LearningPriority;
  durationMinutes: number;
  url?: string;
}

export interface LearningStage {
  id: string;
  title: string;
  description?: string;
  lessons: LearningLesson[];
}

export interface LearningPath {
  id: string;
  title: string;
  subtitle: string;
  stages: LearningStage[];
}

export interface LearningProgressEntry {
  lessonId: string;
  completedAt: string;
}

export type LearningProgress = Record<string, LearningProgressEntry>;

/** Planning Layer V1 ------------------------------------------------------- */

export type WorkstreamType = 'career' | 'project' | 'learning';
export type WorkstreamPriority = 'north-star' | 'primary' | 'support' | 'next';
export type WorkstreamStatus = 'active' | 'queued' | 'maintenance' | 'parked' | 'done';

export interface Workstream {
  id: string;
  type: WorkstreamType;
  title: string;
  outcome: {
    goal: string;
    priority: WorkstreamPriority;
  };
  plan: {
    /** YYYY-MM-DD, or null when intentionally unscheduled. */
    deadline: string | null;
    definitionOfDone: string[];
  };
  execution: {
    status: WorkstreamStatus;
    milestone: string | null;
    weeklyCommitment: string | null;
    nextAction: string | null;
  };
  /** Stable habit id used only to bridge a planning action to today's routine. */
  linkedHabitId?: HabitId | null;
}

export interface CapacityProfile {
  /** Date.getDay(): 0 = Sunday … 6 = Saturday. */
  weekday: number;
  /** A Focus Block is currently 90 minutes; the value is deliberately unit-based. */
  focusBlocks: number;
  label: string;
}

export interface WeekCommitment {
  workstreamId: string;
  targetBlocks: number;
  outcome: string;
}

export interface WeekReview {
  completedAt: string;
  wins: string;
  misses: string;
  bottleneck: string;
  adjustment: string;
}

export interface WeekPlan {
  id: string;
  /** Monday YYYY-MM-DD. */
  startsOn: string;
  commitments: WeekCommitment[];
  review?: WeekReview;
}

export type PlannedActionStatus = 'planned' | 'done' | 'deferred' | 'cancelled';

export interface PlannedAction {
  id: string;
  /** YYYY-MM-DD. Missed actions keep their original date until explicitly replanned. */
  date: string;
  workstreamId: string;
  title: string;
  focusBlocks: number;
  due?: string | null;
  linkedHabitId?: HabitId | null;
  applicationId?: string | null;
  status: PlannedActionStatus;
}

export type ApplicationStage =
  | 'saved'
  | 'preparing'
  | 'applied'
  | 'screening'
  | 'interview'
  | 'final'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface JobApplication {
  id: string;
  company: string;
  role: string;
  jobUrl?: string;
  fitScore?: number;
  fitReason?: string;
  stage: ApplicationStage;
  savedAt?: string;
  appliedAt?: string;
  nextEventAt?: string;
  nextAction?: string;
  nextActionDue?: string;
  notes?: string;
}

export interface PlanningData {
  workstreams: Record<string, Workstream>;
  capacityProfiles: CapacityProfile[];
  weekPlans: Record<string, WeekPlan>;
  plannedActions: Record<string, PlannedAction>;
  jobApplications: Record<string, JobApplication>;
}

export interface RootData {
  schemaVersion: number;
  settings: Settings;
  /** Editable registry. Habit ids stay stable so renames never split history. */
  habits: Habit[];
  templates: TemplateVersion[];
  days: Record<string, DayRecord>;
  /** Personal completion state only; curriculum itself ships with the app. */
  learningProgress: LearningProgress;
  /** Private runtime planning state; source code contains no personal application data. */
  planning: PlanningData;
}
