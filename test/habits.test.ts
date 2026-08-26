import { describe, expect, it } from 'vitest';
import { DEFAULT_SETTINGS } from '../src/config/schedule';
import { materializeDay } from '../src/lib/day';
import { memoryKV } from '../src/store/kv';
import { createLocalStore } from '../src/store/localStore';
import { migrate } from '../src/store/migrations';
import { renderProgress } from '../src/views/progress';

const NOW = '2026-08-24T09:00:00.000Z';
const TODAY = '2026-08-24';

const fresh = () => {
  const store = createLocalStore(memoryKV());
  store.init(NOW, TODAY);
  return store;
};

describe('persistent habit registry', () => {
  it('renames a habit without changing its stable id or progress history', () => {
    const store = fresh();
    const day = materializeDay(TODAY, store.getTemplates(), NOW, TODAY);
    const gym = day.tasks.find((task) => task.habit === 'gym');
    if (!gym) throw new Error('gym task missing from seed schedule');
    gym.done = true;
    store.setDay(TODAY, day, NOW);

    store.setHabitLabel('gym', 'Morning run');

    const renamed = store.getHabits().find((habit) => habit.id === 'gym');
    expect(renamed?.label).toBe('Morning run');
    expect(store.exportAll().habits.find((habit) => habit.id === 'gym')?.label).toBe('Morning run');

    const html = renderProgress({ todayKey: TODAY, records: store.listDays(), habits: store.getHabits() });
    expect(html).toContain('Morning run');
    expect(html).toContain('100<span class="meter__pct">%</span>');
  });

  it('adds unique stable ids and preserves archived habits in storage', () => {
    const store = fresh();
    const first = store.addHabit('Morning Run');
    const second = store.addHabit('Morning Run');
    expect(first.id).toBe('morning-run');
    expect(second.id).toBe('morning-run-2');

    store.setHabitArchived(first.id, true);
    expect(store.getHabits().find((habit) => habit.id === first.id)?.archived).toBe(true);
  });

  it('rejects empty labels', () => {
    const store = fresh();
    expect(() => store.addHabit('   ')).toThrow(/name/i);
    expect(() => store.setHabitLabel('gym', '')).toThrow(/name/i);
  });
});

describe('v2 -> v3 habit migration', () => {
  it('seeds defaults and preserves unknown habit ids referenced by templates', () => {
    const migrated = migrate({
      schemaVersion: 2,
      settings: { ...DEFAULT_SETTINGS },
      templates: [
        {
          version: 1,
          effectiveFrom: TODAY,
          createdAt: NOW,
          days: {
            1: {
              type: 'Custom',
              tasks: [{ id: 'custom-task', name: 'Custom task', time: '', core: true, habit: 'custom-habit' }],
            },
          },
        },
      ],
      days: {},
    });

    expect(migrated.schemaVersion).toBe(3);
    expect(migrated.habits.some((habit) => habit.id === 'gym')).toBe(true);
    expect(migrated.habits.find((habit) => habit.id === 'custom-habit')).toMatchObject({
      id: 'custom-habit',
      label: 'custom-habit',
    });
  });
});
