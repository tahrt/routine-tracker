/**
 * @vitest-environment jsdom
 *
 * End-to-end wiring: real localStorage, real event delegation, real render.
 * Catches the class of bug unit tests miss — a data-action nobody handles.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { startApp } from '../src/app';

const shell = (): void => {
  document.body.innerHTML = '<div id="app"></div><div id="toast" class="toast"></div>';
};

const app = (): HTMLElement => document.getElementById('app') as HTMLElement;
const click = (el: Element | null): void => {
  expect(el, 'element to click should exist').not.toBeNull();
  (el as HTMLElement).dispatchEvent(new MouseEvent('click', { bubbles: true }));
};

let dispose: (() => void) | null = null;

/** Fresh render against the same localStorage — the reload path. */
const boot = (): void => {
  dispose?.();
  shell();
  dispose = startApp();
};

afterEach(() => {
  dispose?.();
  dispose = null;
  vi.useRealTimers();
});

beforeEach(() => {
  window.localStorage.clear();
  // Freeze the clock: Monday 24 Aug 2026, 09:00 Bangkok.
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-08-24T02:00:00.000Z'));
});

describe('app', () => {
  it('renders today with the seeded template and a tab bar', () => {
    boot();
    expect(app().textContent).toContain('WFH · Gym AM');
    expect(app().querySelectorAll('.tabbar__btn')).toHaveLength(3);
    expect(app().querySelector('.tabbar__btn.is-active')?.textContent?.trim()).toBe('Today');
  });

  it('creates a day record on the first tap and persists the toggle', () => {
    boot();
    expect(window.localStorage.getItem('rt:day:2026-08-24')).toBeNull();

    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));

    const stored = JSON.parse(window.localStorage.getItem('rt:day:2026-08-24') as string);
    expect(stored.tasks.find((t: { id: string }) => t.id === 'gym').done).toBe(true);
    expect(stored.dayType).toBe('WFH · Gym AM');
    expect(JSON.parse(window.localStorage.getItem('rt:index') as string)).toEqual(['2026-08-24']);
    expect(app().querySelector('[data-id="gym"]')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('survives a reload with the same state', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    boot(); // re-render from scratch, same localStorage
    expect(app().querySelector('[data-id="gym"]')?.getAttribute('aria-pressed')).toBe('true');
  });

  it('marks a rest day and disables its tasks', () => {
    boot();
    click(app().querySelector('[data-action="set-status"][data-status="rest"]'));
    expect(app().textContent).toContain('excluded from the week average');
    expect(app().querySelector('[data-action="toggle-task"]')?.hasAttribute('disabled')).toBe(true);
    expect(JSON.parse(window.localStorage.getItem('rt:day:2026-08-24') as string).status).toBe('rest');
  });

  it('navigates to the week view and back into a past day', () => {
    boot();
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    expect(app().textContent).toContain('24 Aug – 30 Aug 2026');

    click(app().querySelector('[data-action="week-nav"][data-delta="-1"]'));
    expect(app().textContent).toContain('17 Aug – 23 Aug 2026');

    click(app().querySelector('[data-action="open-day"][data-date="2026-08-19"]'));
    expect(app().textContent).toContain('Wednesday, 19 Aug 2026');
    expect(app().textContent).not.toContain('logged later'); // nothing logged yet

    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    expect(app().textContent).toContain('logged later'); // flagged once it is written on a later day

    click(app().querySelector('[data-action="back"]'));
    expect(app().textContent).toContain('17 Aug – 23 Aug 2026');
  });

  it('will not step past the current week', () => {
    boot();
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    const next = app().querySelector('[data-action="week-nav"][data-delta="1"]');
    expect((next as HTMLButtonElement).disabled).toBe(true);
    click(next);
    expect(app().textContent).toContain('24 Aug – 30 Aug 2026');
  });

  it('shows a week average that ignores rest days', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]')); // 1 of 5 core tasks
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    expect(app().textContent).toContain('1 of 1 day tracked');

    click(app().querySelector('[data-action="open-day"][data-date="2026-08-24"]'));
    click(app().querySelector('[data-action="set-status"][data-status="rest"]'));
    click(app().querySelector('[data-action="back"]'));
    expect(app().textContent).toContain('1 rest');
    expect(app().textContent).toContain('0 of 1 day tracked');
  });

  it('exports a backup and records when it happened', () => {
    const createURL = vi.fn(() => 'blob:test');
    Object.defineProperty(window.URL, 'createObjectURL', { value: createURL, writable: true });
    Object.defineProperty(window.URL, 'revokeObjectURL', { value: vi.fn(), writable: true });
    boot();
    click(app().querySelector('[data-action="tab"][data-tab="settings"]'));
    click(app().querySelector('[data-action="export"]'));
    expect(createURL).toHaveBeenCalled();
    expect(JSON.parse(window.localStorage.getItem('rt:meta') as string).settings.lastExportAt).not.toBeNull();
  });

  it('requires the typed word before erasing', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    click(app().querySelector('[data-action="tab"][data-tab="settings"]'));
    click(app().querySelector('[data-action="reset-arm"]'));

    (document.getElementById('reset-confirm') as HTMLInputElement).value = 'nope';
    click(app().querySelector('[data-action="reset-confirm"]'));
    expect(window.localStorage.getItem('rt:day:2026-08-24')).not.toBeNull();

    (document.getElementById('reset-confirm') as HTMLInputElement).value = 'ERASE';
    click(app().querySelector('[data-action="reset-confirm"]'));
    expect(window.localStorage.getItem('rt:day:2026-08-24')).toBeNull();
  });

  it('rolls the day over while the app sits open', () => {
    boot();
    expect(app().textContent).toContain('Monday, 24 Aug 2026');
    // Advance to Tuesday 09:00 Bangkok and let the rollover interval fire.
    vi.setSystemTime(new Date('2026-08-25T02:00:00.000Z'));
    vi.advanceTimersByTime(61_000);
    expect(app().textContent).toContain('Tuesday, 25 Aug 2026');
    expect(app().textContent).toContain('Office day');
  });

  it('keeps a late-night tap on the previous day', () => {
    // 2026-08-26T17:20:00Z = Thu 27 Aug 00:20 Bangkok — still Wednesday's list.
    vi.setSystemTime(new Date('2026-08-26T17:20:00.000Z'));
    boot();
    expect(app().textContent).toContain('Wednesday, 26 Aug 2026');
    click(app().querySelector('[data-action="toggle-task"][data-id="pin"]'));
    expect(window.localStorage.getItem('rt:day:2026-08-26')).not.toBeNull();
    expect(window.localStorage.getItem('rt:day:2026-08-27')).toBeNull();
  });
});

describe('template editing', () => {
  const openEditor = (): void => {
    click(app().querySelector('[data-action="edit-template"]'));
  };
  const setField = (action: string, index: number | null, value: string): void => {
    const sel = index === null ? `[data-action="${action}"]` : `[data-action="${action}"][data-index="${index}"]`;
    const el = app().querySelector(sel) as HTMLInputElement | HTMLSelectElement;
    expect(el, `field ${sel} should exist`).not.toBeNull();
    el.value = value;
    el.dispatchEvent(new Event(el instanceof HTMLSelectElement ? 'change' : 'input', { bubbles: true }));
  };
  const names = (): string[] =>
    [...app().querySelectorAll<HTMLInputElement>('[data-action="edit-name"]')].map((i) => i.value);

  it('opens the editor for the current weekday, prefilled', () => {
    boot();
    openEditor();
    expect(app().textContent).toContain('Every Monday');
    expect(names()).toContain('Gym');
    expect((app().querySelector('[data-action="edit-type"]') as HTMLInputElement).value).toBe('WFH · Gym AM');
  });

  it('renames a task and applies it to that weekday from today on', () => {
    boot();
    openEditor();
    const gymIndex = names().indexOf('Gym');
    setField('edit-name', gymIndex, 'Muay Thai');
    setField('edit-time', gymIndex, '6:00–7:30');
    click(app().querySelector('[data-action="edit-save"]'));

    expect(app().textContent).toContain('Muay Thai');
    expect(app().textContent).toContain('6:00–7:30');
    const templates = JSON.parse(window.localStorage.getItem('rt:templates') as string);
    expect(templates).toHaveLength(2);
    expect(templates[1].effectiveFrom).toBe('2026-08-24');
    expect(templates[1].days['1'].tasks.find((t: { id: string }) => t.id === 'gym').name).toBe('Muay Thai');
    // Other weekdays are carried over untouched.
    expect(templates[1].days['2'].tasks.find((t: { id: string }) => t.id === 'content')).toBeDefined();
  });

  it('adds, reorders and deletes tasks', () => {
    boot();
    openEditor();
    const before = names().length;

    click(app().querySelector('[data-action="task-add"]'));
    setField('edit-name', before, 'Read');
    expect(names()).toHaveLength(before + 1);

    click(app().querySelector(`[data-action="task-move"][data-index="${before}"][data-dir="-1"]`));
    expect(names()[before - 1]).toBe('Read');

    click(app().querySelector('[data-action="task-delete"][data-index="0"]'));
    expect(names()).toHaveLength(before);

    click(app().querySelector('[data-action="edit-save"]'));
    expect(app().textContent).toContain('Read');
    expect(app().textContent).not.toContain('Wake up');
  });

  it('refuses to save a task with no name', () => {
    boot();
    openEditor();
    click(app().querySelector('[data-action="task-add"]'));
    click(app().querySelector('[data-action="edit-save"]'));
    expect(document.getElementById('toast')?.textContent).toContain('needs a name');
    expect(JSON.parse(window.localStorage.getItem('rt:templates') as string)).toHaveLength(1);
  });

  it('gives a new task a fresh id rather than reusing a deleted one', () => {
    boot();
    openEditor();
    click(app().querySelector('[data-action="task-delete"][data-index="0"]')); // drop "wake"
    click(app().querySelector('[data-action="task-add"]'));
    setField('edit-name', names().length - 1, 'Stretch');
    click(app().querySelector('[data-action="edit-save"]'));

    const templates = JSON.parse(window.localStorage.getItem('rt:templates') as string);
    const ids = templates[1].days['1'].tasks.map((t: { id: string }) => t.id);
    expect(ids).not.toContain('wake');
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('discards the draft on cancel', () => {
    boot();
    openEditor();
    setField('edit-name', 0, 'Nonsense');
    click(app().querySelector('[data-action="edit-cancel"]'));
    expect(app().textContent).not.toContain('Nonsense');
    expect(JSON.parse(window.localStorage.getItem('rt:templates') as string)).toHaveLength(1);
  });

  it('leaves an already-logged day alone and offers to sync it', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    openEditor();
    setField('edit-name', names().indexOf('Gym'), 'Muay Thai');
    click(app().querySelector('[data-action="task-delete"][data-index="0"]')); // drop "wake"
    click(app().querySelector('[data-action="edit-save"]'));

    // The logged day keeps its snapshot until the user opts in.
    const stored = JSON.parse(window.localStorage.getItem('rt:day:2026-08-24') as string);
    expect(stored.tasks.find((t: { id: string }) => t.id === 'gym').name).toBe('Gym');
    expect(stored.tasks.some((t: { id: string }) => t.id === 'wake')).toBe(true);
    expect(app().textContent).toContain('still shows the old list');

    click(app().querySelector('[data-action="sync-template"]'));
    const synced = JSON.parse(window.localStorage.getItem('rt:day:2026-08-24') as string);
    expect(synced.tasks.find((t: { id: string }) => t.id === 'gym').name).toBe('Muay Thai');
    expect(synced.tasks.find((t: { id: string }) => t.id === 'gym').done).toBe(true); // completion kept
    expect(synced.tasks.some((t: { id: string }) => t.id === 'wake')).toBe(false);
  });

  it('can keep a day as logged instead of syncing', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    openEditor();
    setField('edit-name', names().indexOf('Gym'), 'Muay Thai');
    click(app().querySelector('[data-action="edit-save"]'));
    click(app().querySelector('[data-action="sync-dismiss"]'));

    expect(app().textContent).not.toContain('still shows the old list');
    expect(app().textContent).toContain('Gym');
  });

  it('never rewrites a day logged before the edit', () => {
    boot();
    // Log last Monday, then change Mondays.
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    click(app().querySelector('[data-action="week-nav"][data-delta="-1"]'));
    click(app().querySelector('[data-action="open-day"][data-date="2026-08-17"]'));
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    click(app().querySelector('[data-action="back"]'));
    click(app().querySelector('[data-action="tab"][data-tab="today"]'));

    openEditor();
    setField('edit-name', names().indexOf('Gym'), 'Muay Thai');
    click(app().querySelector('[data-action="edit-save"]'));

    const old = JSON.parse(window.localStorage.getItem('rt:day:2026-08-17') as string);
    expect(old.tasks.find((t: { id: string }) => t.id === 'gym').name).toBe('Gym');
    expect(old.templateVersion).toBe(1);
  });

  it('edits the weekday of the day opened from the week view, not today', () => {
    boot();
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    click(app().querySelector('[data-action="week-nav"][data-delta="-1"]'));
    click(app().querySelector('[data-action="open-day"][data-date="2026-08-19"]')); // a Wednesday
    openEditor();
    expect(app().textContent).toContain('Every Wednesday');
    expect(names()).toContain('See Pin');
  });
});
