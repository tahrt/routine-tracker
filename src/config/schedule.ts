import type { Habit, Settings, WeekTemplate } from '../types';

/**
 * Seed defaults only. On first run these are written into storage as template
 * version 1; after that the live templates come from the persistence layer.
 * Editing this file does not change an existing install (spec §2).
 */
export const DEFAULT_SCHEDULE: WeekTemplate = {
  1: {
    type: 'WFH · Gym AM',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '6:30–7:00' },
      { id: 'gym', name: 'Gym', time: '7:00–8:00', core: true, habit: 'gym' },
      { id: 'jobsearch', name: 'Job search (focus block)', time: '8:30–9:00', core: true, habit: 'jobsearch' },
      { id: 'work', name: 'Work', time: '9:00–18:00', core: true, habit: 'work' },
      { id: 'personal', name: 'Personal project', time: '19:00–20:30', core: true, habit: 'personal' },
      { id: 'learning', name: 'Learning', time: '20:30–21:30', core: true, habit: 'learning' },
      { id: 'winddown', name: 'Wind down', time: '21:30–22:00' },
    ],
  },
  2: {
    type: 'Office day',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '6:30–7:00' },
      { id: 'learning', name: 'Learning (focus block)', time: '7:00–7:30', core: true, habit: 'learning' },
      { id: 'work', name: 'Office work', time: '9:00–18:00', core: true, habit: 'work' },
      { id: 'content', name: 'Content creation', time: '19:00–20:30', core: true, habit: 'content' },
      { id: 'personal', name: 'Personal project', time: '20:30–21:30', core: true, habit: 'personal' },
      { id: 'winddown', name: 'Wind down', time: '21:30–22:00' },
    ],
  },
  3: {
    type: 'WFH · Gym AM · Pin PM',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '6:30–7:00' },
      { id: 'gym', name: 'Gym', time: '7:00–8:00', core: true, habit: 'gym' },
      { id: 'personal', name: 'Personal project (focus block)', time: '8:30–9:00', core: true, habit: 'personal' },
      { id: 'work', name: 'Work', time: '9:00–12:00', core: true, habit: 'work' },
      { id: 'pin', name: 'See Pin', time: '12:00–22:30', core: true, habit: 'pin' },
      { id: 'winddown', name: 'Wind down', time: '23:00–23:30' },
    ],
  },
  4: {
    type: 'Office day',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '6:30–7:00' },
      { id: 'jobsearch', name: 'Job search (focus block)', time: '7:00–7:30', core: true, habit: 'jobsearch' },
      { id: 'work', name: 'Office work', time: '9:00–18:00', core: true, habit: 'work' },
      { id: 'learning', name: 'Learning', time: '19:00–20:30', core: true, habit: 'learning' },
      { id: 'content', name: 'Content creation', time: '20:30–21:30', core: true, habit: 'content' },
      { id: 'winddown', name: 'Wind down', time: '21:30–22:00' },
    ],
  },
  5: {
    type: 'WFH · Gym AM · Pin PM',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '6:30–7:00' },
      { id: 'gym', name: 'Gym', time: '7:00–8:00', core: true, habit: 'gym' },
      { id: 'personal', name: 'Personal project (focus block)', time: '8:30–9:00', core: true, habit: 'personal' },
      { id: 'work', name: 'Work', time: '9:00–12:00', core: true, habit: 'work' },
      { id: 'pin', name: 'See Pin', time: '12:00–22:30', core: true, habit: 'pin' },
      { id: 'winddown', name: 'Wind down', time: '23:00–23:30' },
    ],
  },
  6: {
    type: 'Weekend',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '8:00–9:00' },
      { id: 'personal', name: 'Personal project (deep work)', time: '9:00–11:00', core: true, habit: 'personal' },
      { id: 'jobsearch', name: 'Job search', time: '11:00–12:00', core: true, habit: 'jobsearch' },
      { id: 'pin', name: 'With Pin', time: '12:00–evening', core: true, habit: 'pin' },
      { id: 'content', name: 'Content creation batch', time: 'Evening', core: true, habit: 'content' },
    ],
  },
  0: {
    type: 'Weekend',
    tasks: [
      { id: 'wake', name: 'Wake up', time: '8:00–9:00' },
      { id: 'learning', name: 'Learning', time: '9:00–10:30', core: true, habit: 'learning' },
      { id: 'personal', name: 'Light personal project / plan week', time: '10:30–12:00', core: true, habit: 'personal' },
      { id: 'pin', name: 'With Pin', time: '12:00–evening', core: true, habit: 'pin' },
      { id: 'review', name: 'Rest, review the week', time: 'Evening' },
    ],
  },
};

/**
 * Seed habit registry. Runtime labels live in storage so a rename changes only
 * presentation while the stable id keeps streak/history continuity.
 */
export const DEFAULT_HABITS: Habit[] = [
  { id: 'gym', label: 'Gym', color: 'teal' },
  { id: 'personal', label: 'Personal project', color: 'amber' },
  { id: 'jobsearch', label: 'Job search', color: 'violet' },
  { id: 'learning', label: 'Learning', color: 'sky' },
  { id: 'content', label: 'Content', color: 'rose' },
  { id: 'pin', label: 'Pin', color: 'coral' },
  { id: 'work', label: 'Work', color: 'slate' },
];

/** Backward-compatible alias for tests and older imports. */
export const HABITS = DEFAULT_HABITS;

export const DEFAULT_SETTINGS: Settings = {
  timezone: 'Asia/Bangkok',
  dayCutoffHour: 4,
  weekStartsOn: 1,
  lastExportAt: null,
};

export const WEEKDAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] as const;
