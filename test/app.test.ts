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

describe('app', () => {
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
