import { describe, expect, it } from 'vitest';
import { LEARNING_PATHS } from '../src/config/learning';
import { coreStats, formatLearningTime, nextCoreLesson, pathStats } from '../src/lib/learning';
import type { LearningProgress } from '../src/types';

describe('learning curriculum', () => {
  it('ships the three learning sets with stable unique lesson ids', () => {
    expect(LEARNING_PATHS.map((path) => path.id)).toEqual(['business', 'ai-agents', 'negotiation']);
    const ids = LEARNING_PATHS.flatMap((path) => path.stages.flatMap((stage) => stage.lessons.map((lesson) => lesson.id)));
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBeGreaterThan(15);
  });

  it('calculates core progress by learning time, excluding recommended lessons', () => {
    const business = LEARNING_PATHS[0]!;
    const empty: LearningProgress = {};
    const first = nextCoreLesson(business, empty)!;
    const progress: LearningProgress = {
      [first.id]: { lessonId: first.id, completedAt: '2026-08-27T00:00:00.000Z' },
    };

    const stats = pathStats(business, progress);
    expect(stats.completedLessons).toBe(1);
    expect(stats.completedMinutes).toBe(first.durationMinutes);
    expect(stats.totalLessons).toBeGreaterThan(stats.completedLessons);
    expect(stats.completionRate).toBeGreaterThan(0);

    const recommended = business.stages.flatMap((stage) => stage.lessons).find((lesson) => lesson.priority === 'recommended')!;
    const withRecommended = {
      ...progress,
      [recommended.id]: { lessonId: recommended.id, completedAt: '2026-08-27T01:00:00.000Z' },
    };
    expect(pathStats(business, withRecommended)).toEqual(stats);
  });

  it('advances Continue Learning to the next incomplete core lesson', () => {
    const path = LEARNING_PATHS[2]!;
    const first = nextCoreLesson(path, {})!;
    const progress = { [first.id]: { lessonId: first.id, completedAt: '2026-08-27T00:00:00.000Z' } };
    expect(nextCoreLesson(path, progress)?.id).not.toBe(first.id);
  });

  it('calculates stage stats and readable durations', () => {
    const stage = LEARNING_PATHS[1]!.stages[0]!;
    expect(coreStats(stage.lessons, {}).totalLessons).toBeGreaterThan(0);
    expect(formatLearningTime(0)).toBe('0m');
    expect(formatLearningTime(45)).toBe('45m');
    expect(formatLearningTime(60)).toBe('1h');
    expect(formatLearningTime(95)).toBe('1h 35m');
  });
});
