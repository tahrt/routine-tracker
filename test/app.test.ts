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
    expect(app().querySelectorAll('.tabbar__btn')).toHaveLength(4);
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

  it('opens Progress and reflects lifetime core-activity completion', () => {
    boot();
    click(app().querySelector('[data-action="toggle-task"][data-id="gym"]'));
    click(app().querySelector('[data-action="tab"][data-tab="progress"]'));

    expect(app().querySelector('.tabbar__btn.is-active')?.textContent?.trim()).toBe('Progress');
    const gymCard = [...app().querySelectorAll<HTMLElement>('.progress-card')].find((el) =>
      el.textContent?.includes('Gym'),
    );
    expect(gymCard).toBeDefined();
    expect(gymCard?.textContent).toContain('1 of 1 tracked day');
    expect(gymCard?.textContent).toContain('100%');
    expect(gymCard?.textContent).toContain('1 day current');
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
    expect(app().textContent).toContain('every Monday');
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
    click(app().querySelector('[data-action="open-day"][data-date="2026-08-19"]'));
    openEditor();
    expect(app().textContent).toContain('every Wednesday');
    expect(names()).toContain('See Pin');
  });
});

describe('editing other weekdays', () => {
  const openEditor = (): void => click(app().querySelector('[data-action="edit-template"]'));
  const pickDay = (weekday: number): void =>
    click(app().querySelector(`[data-action="edit-weekday"][data-weekday="${weekday}"]`));
  const names = (): string[] =>
    [...app().querySelectorAll<HTMLInputElement>('[data-action="edit-name"]')].map((i) => i.value);
  const setName = (index: number, value: string): void => {
    const el = app().querySelector(`[data-action="edit-name"][data-index="${index}"]`) as HTMLInputElement;
    el.value = value;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  };

  it('switches to any weekday from inside the editor', () => {
    boot(); // it is Monday
    openEditor();
    expect(app().textContent).toContain('every Monday');

    pickDay(3); // Wednesday
    expect(app().textContent).toContain('every Wednesday');
    expect(names()).toContain('See Pin');

    pickDay(6); // Saturday
    expect(app().textContent).toContain('every Saturday');
    expect(names()).toContain('Content creation batch');
  });

  it('is reachable from Settings without visiting a day', () => {
    boot();
    click(app().querySelector('[data-action="tab"][data-tab="settings"]'));
    click(app().querySelector('[data-action="edit-template"]'));
    expect(app().textContent).toContain('Edit tasks');
    pickDay(4);
    expect(app().textContent).toContain('every Thursday');
  });

  it('keeps edits when switching weekdays and saves them all at once', () => {
    boot();
    openEditor();
    setName(names().indexOf('Gym'), 'Muay Thai'); // Monday

    pickDay(3);
    setName(names().indexOf('See Pin'), 'Date night'); // Wednesday

    pickDay(1); // back to Monday — the edit is still in the draft
    expect(names()).toContain('Muay Thai');

    click(app().querySelector('[data-action="edit-save"]'));
    const templates = JSON.parse(window.localStorage.getItem('rt:templates') as string);
    expect(templates).toHaveLength(2); // one version, both weekdays
    expect(templates[1].days['1'].tasks.find((t: { id: string }) => t.id === 'gym').name).toBe('Muay Thai');
    expect(templates[1].days['3'].tasks.find((t: { id: string }) => t.id === 'pin').name).toBe('Date night');
  });

  it('marks weekdays with unsaved edits and only enables save when something changed', () => {
    boot();
    openEditor();
    expect((app().querySelector('[data-action="edit-save"]') as HTMLButtonElement).disabled).toBe(true);

    pickDay(5);
    setName(0, 'Changed');
    expect((app().querySelector('[data-action="edit-save"]') as HTMLButtonElement).disabled).toBe(false);
    expect(app().querySelector('[data-action="edit-weekday"][data-weekday="5"]')?.className).toContain('is-dirty');
    expect(app().querySelector('[data-action="edit-weekday"][data-weekday="2"]')?.className).not.toContain('is-dirty');
  });

  it('points at the offending weekday when a name is blank', () => {
    boot();
    openEditor();
    pickDay(6); // Saturday
    click(app().querySelector('[data-action="task-add"]'));
    pickDay(1); // move away
    click(app().querySelector('[data-action="edit-save"]'));

    expect(document.getElementById('toast')?.textContent).toContain('Saturday');
    expect(app().textContent).toContain('every Saturday'); // jumped back to it
    expect(JSON.parse(window.localStorage.getItem('rt:templates') as string)).toHaveLength(1);
  });

  it('leaves other weekdays and their logged performance untouched', () => {
    boot();
    // Log last Wednesday fully, and note its percentage.
    click(app().querySelector('[data-action="tab"][data-tab="week"]'));
    click(app().querySelector('[data-action="week-nav"][data-delta="-1"]'));
    click(app().querySelector('[data-action="open-day"][data-date="2026-08-19"]'));
    for (const btn of [...app().querySelectorAll('[data-action="toggle-task"]')]) click(btn);
    const wednesday = JSON.parse(window.localStorage.getItem('rt:day:2026-08-19') as string);
    click(app().querySelector('[data-action="back"]'));
    click(app().querySelector('[data-action="tab"][data-tab="today"]'));

    // Now gut Monday's list.
    openEditor();
    click(app().querySelector('[data-action="task-delete"][data-index="0"]'));
    click(app().querySelector('[data-action="task-delete"][data-index="0"]'));
    click(app().querySelector('[data-action="edit-save"]'));

    // Wednesday's record is byte-identical: same tasks, same completion.
    expect(JSON.parse(window.localStorage.getItem('rt:day:2026-08-19') as string)).toEqual(wednesday);

    // And Wednesday's template is unchanged in the new version.
    const templates = JSON.parse(window.localStorage.getItem('rt:templates') as string);
    expect(templates[1].days['3']).toEqual(templates[0].days['3']);
    expect(templates[1].days['1']).not.toEqual(templates[0].days['1']);
  });
});
