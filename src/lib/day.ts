/** Template resolution and day-record materialization. Spec §4.3–§4.5. */

import type { DayRecord, DayTask, TemplateTask, TemplateVersion } from '../types';
import { parseKey } from './date';

export const newTaskId = (): string => {
  const c = globalThis.crypto;
  if (c && typeof c.randomUUID === 'function') return `u_${c.randomUUID().slice(0, 8)}`;
  return `u_${Math.random().toString(36).slice(2, 10)}`;
};

/** A template task resolved into the fully-specified shape stored in a day record. */
export const resolveTask = (t: TemplateTask): DayTask => ({
  id: t.id,
  name: t.name,
  time: t.time,
  core: t.core === true,
  habit: t.habit ?? null,
  weight: typeof t.weight === 'number' && t.weight > 0 ? t.weight : 1,
  done: false,
  adhoc: false,
});

/**
 * The template version in force on `dateK` — the highest version whose
 * effectiveFrom is on or before that date. Falls back to the earliest version
 * for dates that predate every template (e.g. history imported from the prototype).
 */
export const templateAt = (templates: readonly TemplateVersion[], dateK: string): TemplateVersion => {
  if (templates.length === 0) throw new Error('no templates in storage');
  const sorted = [...templates].sort((a, b) => a.version - b.version);
  let chosen = sorted[0] as TemplateVersion;
  for (const t of sorted) if (t.effectiveFrom <= dateK) chosen = t;
  return chosen;
};

/** The template in force today — what the Today view and edits operate on. */
export const currentTemplate = (templates: readonly TemplateVersion[], todayK: string): TemplateVersion =>
  templateAt(templates, todayK);

/**
 * Build a fresh day record by snapshotting the template in force on that date.
 * Called lazily on first interaction with a date (spec §4.5), never on read.
 */
export const materializeDay = (
  dateK: string,
  templates: readonly TemplateVersion[],
  nowIso: string,
  todayK: string,
): DayRecord => {
  const tpl = templateAt(templates, dateK);
  const weekday = parseKey(dateK).getDay();
  const day = tpl.days[weekday];
  return {
    date: dateK,
    status: 'active',
    dayType: day?.type ?? '',
    templateVersion: tpl.version,
    tasks: (day?.tasks ?? []).map(resolveTask),
    note: '',
    createdAt: nowIso,
    updatedAt: nowIso,
    editedRetroactively: dateK < todayK,
  };
};

/**
 * Re-apply a template to an existing record: tasks added to the template appear,
 * removed ones go, and completions on surviving ids are kept. Ad-hoc tasks added
 * to this specific day always survive — they were never part of the template.
 * Used by the "sync today" action after a template edit (spec §4.5).
 */
export const syncRecordToTemplate = (rec: DayRecord, tpl: TemplateVersion): DayRecord => {
  const day = tpl.days[parseKey(rec.date).getDay()];
  const doneById = new Map(rec.tasks.map((t) => [t.id, t.done]));
  const fromTemplate = (day?.tasks ?? []).map((t) => ({ ...resolveTask(t), done: doneById.get(t.id) ?? false }));
  const adhoc = rec.tasks.filter((t) => t.adhoc);
  return {
    ...rec,
    dayType: day?.type ?? '',
    templateVersion: tpl.version,
    tasks: [...fromTemplate, ...adhoc],
  };
};

/**
 * True when a record's task list no longer matches the template in force —
 * compares the whole task shape, not just ids, so a rename, a retimed block or a
 * core-flag change is caught as well as an add/remove/reorder.
 */
const signature = (t: DayTask): string => `${t.id}${t.name}${t.time}${t.core}${t.weight}${t.habit ?? ''}`;

export const isOutOfSync = (rec: DayRecord, tpl: TemplateVersion): boolean => {
  const day = tpl.days[parseKey(rec.date).getDay()];
  const fromTemplate = (day?.tasks ?? []).map((t) => signature(resolveTask(t))).join('');
  const fromRecord = rec.tasks.filter((t) => !t.adhoc).map(signature).join('');
  return fromTemplate !== fromRecord || (day?.type ?? '') !== rec.dayType;
};

/** Tasks the template would give this date, for previewing a day with no record yet. */
export const previewTasks = (
  dateK: string,
  templates: readonly TemplateVersion[],
): { dayType: string; tasks: DayTask[] } => {
  const tpl = templateAt(templates, dateK);
  const day = tpl.days[parseKey(dateK).getDay()];
  return { dayType: day?.type ?? '', tasks: (day?.tasks ?? []).map(resolveTask) };
};
