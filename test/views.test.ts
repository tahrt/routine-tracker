/** Views are pure string builders, so they can be asserted without a DOM. */

import { describe, expect, it } from 'vitest';
import { LEARNING_PATHS } from '../src/config/learning';
import { DEFAULT_SCHEDULE, HABITS } from '../src/config/schedule';
import { materializeDay } from '../src/lib/day';
import type { TemplateVersion } from '../src/types';
import { renderTodayDashboard } from '../src/views/dashboard';
import { renderDay } from '../src/views/day';
import { renderInsights } from '../src/views/insights';
import { renderLearningOverview, renderLearningPath } from '../src/views/learning';
import { renderProgress } from '../src/views/progress';
import { renderWeek } from '../src/views/week';

const TEMPLATES: TemplateVersion[] = [
  { version: 1, effectiveFrom: '2026-08-01', createdAt: '2026-08-01T00:00:00.000Z', days: DEFAULT_SCHEDULE },
];
const NOW = '2026-08-24T09:00:00.000Z';
const TODAY = '2026-08-24'; // Monday

describe('renderDay', () => {
  it('shows the weekday type and tasks with no record yet', () => {
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: false, outOfSync: false });
    expect(html).toContain('WFH · Gym AM');
    expect(html).toContain('Monday, 24 Aug 2026');
    expect(html).toContain('Gym');
    expect(html).toContain('Nothing logged yet');
    expect(html).toContain('data-action="toggle-task" data-id="gym"');
  });

  it('reflects completion in the meter', () => {
    const rec = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const done = { ...rec, tasks: rec.tasks.map((t) => ({ ...t, done: true })) };
    expect(renderDay({ dateKey: TODAY, todayKey: TODAY, record: done, templates: TEMPLATES, standalone: false, outOfSync: false }))
      .toContain('100<span class="meter__pct">%</span>');
  });

  it('disables tasks and explains the exclusion on a rest day', () => {
    const rec = { ...materializeDay(TODAY, TEMPLATES, NOW, TODAY), status: 'rest' as const };
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: rec, templates: TEMPLATES, standalone: false, outOfSync: false });
    expect(html).toContain('excluded from the week average');
    expect(html).toContain('disabled');
  });

  it('refuses to render a checklist for a future day', () => {
    const html = renderDay({ dateKey: '2026-08-30', todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: false, outOfSync: false });
    expect(html).toContain("hasn't happened yet");
    expect(html).not.toContain('toggle-task');
  });

  it('offers a way back when opened from the week view', () => {
    const html = renderDay({ dateKey: '2026-08-20', todayKey: TODAY, record: undefined, templates: TEMPLATES, standalone: true, outOfSync: false });
    expect(html).toContain('data-action="back"');
  });

  it('escapes task names rather than injecting markup', () => {
    const rec = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const evil = { ...rec, tasks: [{ ...rec.tasks[0]!, name: '<img src=x onerror=alert(1)>' }] };
    const html = renderDay({ dateKey: TODAY, todayKey: TODAY, record: evil, templates: TEMPLATES, standalone: false, outOfSync: false });
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

  it('keeps future routine days non-clickable while allowing planning into future weeks', () => {
    const html = renderWeek({ anchorKey: TODAY, todayKey: TODAY, records });
    expect(html).not.toContain('data-date="2026-08-30"'); // Sunday is still ahead
    expect(html).not.toMatch(/data-delta="1"[^>]*disabled/);

    const horizon = renderWeek({ anchorKey: '2026-09-21', todayKey: TODAY, records: {} });
    expect(horizon).toMatch(/data-delta="1"[^>]*disabled/);
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

describe('renderProgress', () => {
  it('shows one lifetime card per registered habit', () => {
    const monday = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const doneGym = {
      ...monday,
      tasks: monday.tasks.map((t) => (t.habit === 'gym' ? { ...t, done: true } : t)),
    };
    const html = renderProgress({ todayKey: TODAY, records: [doneGym], habits: HABITS });
    expect(html).toContain('Progress');
    expect(html).toContain('Gym');
    expect(html).toContain('Personal project');
    expect((html.match(/class="progress-card"/g) ?? []).length).toBe(HABITS.length);
  });

  it('prints lifetime completion and streak values from snapshots', () => {
    const monday = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const doneGym = {
      ...monday,
      tasks: monday.tasks.map((t) => (t.habit === 'gym' ? { ...t, done: true } : t)),
    };
    const html = renderProgress({ todayKey: TODAY, records: [doneGym], habits: HABITS.filter((h) => h.id === 'gym') });
    expect(html).toContain('1 of 1 tracked day');
    expect(html).toContain('100<span class="meter__pct">%</span>');
    expect(html).toContain('<strong>1</strong> day current');
    expect(html).toContain('<strong>1</strong> day best');
  });

  it('shows an empty-history state without inventing failures', () => {
    const html = renderProgress({ todayKey: TODAY, records: [], habits: HABITS.filter((h) => h.id === 'gym') });
    expect(html).toContain('No tracked days yet');
    expect(html).toContain('0<span class="meter__pct">%</span>');
    expect(html).toContain('streak-dot--untracked');
  });
});


describe('renderLearning', () => {
  it('renders all three paths and Continue Learning from empty progress', () => {
    const html = renderLearningOverview(LEARNING_PATHS, {});
    expect(html).toContain('CONTINUE LEARNING');
    expect(html).toContain('Start &amp; Grow a Business');
    expect(html).toContain('Great &amp; Reliable AI Agent Team');
    expect(html).toContain('Business Negotiation Strategy');
  });

  it('renders stages, resources and completion state for a path', () => {
    const path = LEARNING_PATHS[0]!;
    const first = path.stages[0]!.lessons[0]!;
    const html = renderLearningPath(path, {
      [first.id]: { lessonId: first.id, completedAt: NOW },
    });
    expect(html).toContain('Stage 1 · Foundations');
    expect(html).toContain('data-action="toggle-learning-lesson"');
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain('youtube.com');
    expect(html).toContain('Recommended');
  });
});


describe('renderTodayDashboard', () => {
  it('shows a unified agenda and the next learning lesson', () => {
    const html = renderTodayDashboard({
      dateKey: TODAY,
      record: undefined,
      templates: TEMPLATES,
      learningPaths: LEARNING_PATHS,
      learningProgress: {},
      greeting: 'Good morning',
      outOfSync: false,
    });
    expect(html).toContain("TODAY'S AGENDA");
    expect(html).toContain('Gym');
    expect(html).toContain('CONTINUE LEARNING');
    expect(html).toContain('How to Get and Evaluate Startup Ideas');
    expect(html).toContain('today-learning__triangle');
    expect(html).toContain('today-learning__rate">0%');
    expect(html).toContain('today-learning__resume">Start');
    expect(html).toContain('data-mode="week"');
  });

  it('switches Continue Learning from Start to Resume after core progress exists', () => {
    const first = LEARNING_PATHS[0]!.stages[0]!.lessons[0]!;
    const html = renderTodayDashboard({
      dateKey: TODAY,
      record: undefined,
      templates: TEMPLATES,
      learningPaths: LEARNING_PATHS,
      learningProgress: {
        [first.id]: { lessonId: first.id, completedAt: NOW },
      },
      greeting: 'Good morning',
      outOfSync: false,
    });
    expect(html).toContain('today-learning__resume">Resume');
    expect(html).not.toContain('today-learning__rate">0%');
  });

  it('preserves the template sync controls for logged days', () => {
    const html = renderTodayDashboard({
      dateKey: TODAY,
      record: materializeDay(TODAY, TEMPLATES, NOW, TODAY),
      templates: TEMPLATES,
      learningPaths: LEARNING_PATHS,
      learningProgress: {},
      greeting: 'Good morning',
      outOfSync: true,
    });
    expect(html).toContain('still shows the old list');
    expect(html).toContain('data-action="sync-template"');
    expect(html).toContain('data-action="sync-dismiss"');
  });
});

describe('renderInsights', () => {
  it('combines weekly consistency, habits and learning progress', () => {
    const monday = materializeDay(TODAY, TEMPLATES, NOW, TODAY);
    const doneGym = {
      ...monday,
      tasks: monday.tasks.map((task) => (task.habit === 'gym' ? { ...task, done: true } : task)),
    };
    const html = renderInsights({
      todayKey: TODAY,
      records: [doneGym],
      habits: HABITS,
      learningProgress: {},
    });
    expect(html).toContain('Insights');
    expect(html).toContain('HABITS OVERVIEW');
    expect(html).toContain('Gym');
    expect(html).toContain('100%');
    expect(html).toContain('LEARNING PROGRESS');
    expect(html).toContain('MOMENTUM');
  });
});
