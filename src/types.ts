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

export interface RootData {
  schemaVersion: number;
  settings: Settings;
  /** Editable registry. Habit ids stay stable so renames never split history. */
  habits: Habit[];
  templates: TemplateVersion[];
  days: Record<string, DayRecord>;
}
