/** Views are pure string builders, so they can be asserted without a DOM. */

import { describe, expect, it } from 'vitest';
import { DEFAULT_SCHEDULE } from '../src/config/schedule';
import { materializeDay } from '../src/lib/day';
import type { TemplateVersion } from '../src/types';
import { renderDay } from '../src/views/day';
import { renderWeek } from '../src/views/week';

const TEMPLATES: TemplateVersion[] = [
  { version: 1, effectiveFrom: '2026-08-01', createdAt: '2026-08-01T00:00:00.000Z', days: DEFAULT_SCHEDULE },
];
const NOW = '2026-08-24T09:00:00.000Z';
const TODAY = '2026-08-24'; // Monday

describe('renderDay', () => {
  it('shows the weekday type and tasks with no record yet', () => {
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: false });
    expect(html).toContain('WFH · Gym AM');
    expect(html).toContain('Monday, 24 Aug 2026');
    expect(html).toContain('Gym');
    expect(html).toContain('Nothing logged yet');
    expect(html).toContain('data-action="toggle-task" data-id="gym"');
  });

  it('reflects completion in the meter', () => {
    const rec = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const done = { ...rec, tasks: rec.tasks.map((t) => ({ ...t, done: true })) };
    expect(renderDay({ dateKey: TODAY, todayKey: TODAY, record: done, templates: TEMPLATES, standalone: false }))
      .toContain('100<span class="meter__pct">%</span>');
  });

  it('disables tasks and explains the exclusion on a rest day', () => {
    const rec = { ...materializeDay(TODAY, TEMPLATES, NOW, TODAY), status: 'rest' as const };
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: rec, templates: TEMPLATES, standalone: false });
    expect(html).toContain('excluded from the week average');
    expect(html).toContain('disabled');
  });

  it('refuses to render a checklist for a future day', () => {
    const html = renderDay({ dateKey: '2026-08-30', todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: false });
    expect(html).toContain("hasn't happened yet");
    expect(html).not.toContain('toggle-task');
  });

  it('offers a way back when opened from the week view', () => {
    const html = renderDay({ dateKey: '2026-08-20', todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: true });
    expect(html).toContain('data-action="back"');
  });

  it('escapes task names rather than injecting markup', () => {
    const rec = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const evil = { ...rec, tasks: [{ ...rec.tasks[0]!, name: '<img src=x onerror=alert(1)>' }] };
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: evil, templates: TEMPLATES, standalone: false });
    expect(html).not.toContain('<img src=x');
    expect(html).toContain('&lt;img src=x');
  });
});

describe('renderWeek', () => {
  const records = {
    '2026-08-24': { ...materializeDay('2026-08-24', TEMPLATES, NOW, TODAY) },
  };

  it('renders the Mon–Sun range and seven columns', () => {
    const html = renderWeek({ anchorKey: TODAY, todayKey: TODAY, records });
    expect(html).toContain('24 Aug – 30 Aug 2026');
    expect((html.match(/class="bar/g) ?? []).length).toBeGreaterThanOrEqual(7);
  });

  it('marks future days non-clickable and disables Next on the current week', () => {
    const html = renderWeek({ anchorKey: TODAY, todayKey: TODAY, records });
    expect(html).not.toContain('data-date="2026-08-30"'); // Sunday is still ahead
    expect(html).toMatch(/data-delta="1"[^>]*disabled/);
  });

  it('lets past days be opened', () => {
    const html = renderWeek({ anchorKey: '2026-08-17', todayKey: TODAY, records: {} });
    expect(html).toContain('data-date="2026-08-17"');
    expect(html).not.toMatch(/data-delta="1"[^>]*disabled/);
  });

  it('counts only elapsed days in the tracked total', () => {
    const html = renderWeek({ anchorKey: TODAY, todayKey: TODAY, records });
    expect(html).toContain('1 of 1 day tracked');
  });

  it('excludes rest days from the average it prints', () => {
    const rest = { ...materializeDay('2026-08-24', TEMPLATES, NOW, TODAY), status: 'rest' as const };
    const html = renderWeek({ anchorKey: TODAY, todayKey: TODAY, records: { '2026-08-24': rest } });
    expect(html).toContain('1 rest');
    expect(html).toContain('0<span class="meter__pct">%</span>');
  });
});
