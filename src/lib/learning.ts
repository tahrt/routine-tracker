import type { LearningLesson, LearningPath, LearningProgress } from '../types';

export interface LearningStats {
  completedLessons: number;
  totalLessons: number;
  completedMinutes: number;
  totalMinutes: number;
  completionRate: number;
}

export const lessonsInPath = (path: LearningPath): LearningLesson[] =>
  path.stages.flatMap((stage) => stage.lessons);

export const isLessonCompleted = (lessonId: string, progress: LearningProgress): boolean =>
  progress[lessonId] !== undefined;

export const coreStats = (
  lessons: readonly LearningLesson[],
  progress: LearningProgress,
): LearningStats => {
  const core = lessons.filter((lesson) => lesson.priority === 'core');
  const completed = core.filter((lesson) => isLessonCompleted(lesson.id, progress));
  const totalMinutes = core.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);
  const completedMinutes = completed.reduce((sum, lesson) => sum + lesson.durationMinutes, 0);

  return {
    completedLessons: completed.length,
    totalLessons: core.length,
    completedMinutes,
    totalMinutes,
    completionRate: totalMinutes === 0 ? 0 : Math.round((completedMinutes / totalMinutes) * 100),
  };
};

export const pathStats = (path: LearningPath, progress: LearningProgress): LearningStats =>
  coreStats(lessonsInPath(path), progress);

export const nextCoreLesson = (
  path: LearningPath,
  progress: LearningProgress,
): LearningLesson | undefined =>
  lessonsInPath(path).find((lesson) => lesson.priority === 'core' && !isLessonCompleted(lesson.id, progress));

export const formatLearningTime = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};
