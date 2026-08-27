import {
  coreStats,
  formatLearningTime,
  isLessonCompleted,
  nextCoreLesson,
  pathStats,
} from '../lib/learning';
import type { LearningLesson, LearningPath, LearningProgress } from '../types';
import { esc } from '../ui/dom';

const pathIcon = (id: string): string => {
  if (id === 'business') return '↗';
  if (id === 'ai-agents') return '✦';
  return '◆';
};

const priorityLabel = (priority: LearningLesson['priority']): string => {
  if (priority === 'core') return 'Core';
  if (priority === 'recommended') return 'Recommended';
  return 'Optional';
};

const resourceLabel = (lesson: LearningLesson): string => {
  if (lesson.type === 'video') return 'Watch';
  if (lesson.type === 'case-study') return 'Open';
  if (lesson.type === 'practice') return 'Practice';
  if (lesson.type === 'exercise') return 'Exercise';
  if (lesson.type === 'project') return 'Project';
  return 'Read';
};

const progressMeter = (rate: number, label: string): string =>
  `<div class="learn-meter" role="img" aria-label="${esc(label)} ${rate}% complete">
     <span class="learn-meter__fill" style="width:${rate}%"></span>
   </div>`;

const lessonRow = (lesson: LearningLesson, progress: LearningProgress): string => {
  const completed = isLessonCompleted(lesson.id, progress);
  return `
    <article class="learn-lesson${completed ? ' is-complete' : ''}" id="lesson-${esc(lesson.id)}">
      <button class="learn-lesson__check" type="button"
              data-action="toggle-learning-lesson" data-id="${esc(lesson.id)}"
              aria-pressed="${completed}" aria-label="${completed ? 'Mark incomplete' : 'Mark complete'}: ${esc(lesson.title)}">
        ${completed ? '✓' : ''}
      </button>
      <div class="learn-lesson__body">
        <div class="learn-lesson__tags">
          <span class="learn-tag learn-tag--${esc(lesson.priority)}">${priorityLabel(lesson.priority)}</span>
          <span class="learn-lesson__time">${formatLearningTime(lesson.durationMinutes)}</span>
        </div>
        <h3 class="learn-lesson__title">${esc(lesson.title)}</h3>
        <p class="learn-lesson__source">${esc(lesson.source)}</p>
      </div>
      ${lesson.url
        ? `<a class="learn-lesson__link" href="${esc(lesson.url)}" target="_blank" rel="noopener noreferrer">${resourceLabel(lesson)} ↗</a>`
        : ''}
    </article>`;
};

export const renderLearningOverview = (
  paths: readonly LearningPath[],
  progress: LearningProgress,
): string => {
  const continuePath = paths.find((path) => nextCoreLesson(path, progress));
  const next = continuePath ? nextCoreLesson(continuePath, progress) : undefined;

  return `
    <section class="learn">
      <header class="learn__head">
        <p class="day__date">CORE CURRICULUM</p>
        <h1 class="day__type">Learn</h1>
        <p class="progress__intro">One clear path at a time. Core lessons drive completion; deeper resources stay available when you want them.</p>
      </header>

      ${continuePath && next
        ? `<button class="learn-continue" type="button" data-action="open-learning-path" data-id="${esc(continuePath.id)}">
             <span class="learn-continue__eyebrow">CONTINUE LEARNING</span>
             <strong>${esc(next.title)}</strong>
             <span>${esc(continuePath.title)} · ${formatLearningTime(next.durationMinutes)}</span>
           </button>`
        : `<div class="learn-complete"><strong>Core paths complete.</strong><span>Recommended and optional resources are still available inside each set.</span></div>`
      }

      <div class="learn-paths">
        ${paths.map((path) => {
          const stats = pathStats(path, progress);
          const nextLesson = nextCoreLesson(path, progress);
          return `
            <button class="learn-path-card" type="button" data-action="open-learning-path" data-id="${esc(path.id)}">
              <div class="learn-path-card__top">
                <span class="learn-path-card__icon" aria-hidden="true">${pathIcon(path.id)}</span>
                <div class="learn-path-card__copy">
                  <div class="learn-path-card__titleline"><h2>${esc(path.title)}</h2><span class="learn-tag learn-tag--core">Core</span></div>
                  <p>${esc(path.subtitle)}</p>
                </div>
                <span class="learn-path-card__rate">${stats.completionRate}<span class="meter__pct">%</span></span>
              </div>
              ${progressMeter(stats.completionRate, path.title)}
              <div class="learn-path-card__meta">
                <span>${stats.completedLessons}/${stats.totalLessons} core lessons</span>
                <span>${formatLearningTime(stats.completedMinutes)} / ${formatLearningTime(stats.totalMinutes)}</span>
              </div>
              <span class="learn-path-card__next">${nextLesson ? `Next · ${esc(nextLesson.title)}` : 'Core complete · explore extras'}</span>
            </button>`;
        }).join('')}
      </div>
    </section>`;
};

export const renderLearningPath = (
  path: LearningPath,
  progress: LearningProgress,
): string => {
  const stats = pathStats(path, progress);
  const next = nextCoreLesson(path, progress);

  return `
    <section class="learn">
      <button class="linkback" type="button" data-action="learning-back">← Learning paths</button>
      <header class="learn__head">
        <p class="day__date">CORE CURRICULUM</p>
        <h1 class="day__type">${esc(path.title)}</h1>
        <p class="progress__intro">${esc(path.subtitle)}</p>
      </header>

      <div class="learn-detail-summary">
        <div>
          <strong>${stats.completionRate}%</strong>
          <span>core complete</span>
        </div>
        <div>
          <strong>${formatLearningTime(stats.completedMinutes)}</strong>
          <span>learned</span>
        </div>
        <div>
          <strong>${formatLearningTime(Math.max(0, stats.totalMinutes - stats.completedMinutes))}</strong>
          <span>core remaining</span>
        </div>
      </div>
      ${progressMeter(stats.completionRate, path.title)}

      ${next
        ? `<div class="learn-next">
             <span class="learn-continue__eyebrow">UP NEXT</span>
             <strong>${esc(next.title)}</strong>
             <span>${esc(next.source)} · ${formatLearningTime(next.durationMinutes)}</span>
             ${next.url ? `<a class="btn btn--primary btn--tiny" href="${esc(next.url)}" target="_blank" rel="noopener noreferrer">Start ↗</a>` : ''}
           </div>`
        : ''
      }

      <div class="learn-stages">
        ${path.stages.map((stage) => {
          const stageStats = coreStats(stage.lessons, progress);
          return `
            <section class="learn-stage">
              <div class="learn-stage__head">
                <div>
                  <h2>${esc(stage.title)}</h2>
                  ${stage.description ? `<p>${esc(stage.description)}</p>` : ''}
                </div>
                <span>${stageStats.completionRate}%</span>
              </div>
              ${progressMeter(stageStats.completionRate, stage.title)}
              <div class="learn-stage__meta">${stageStats.completedLessons}/${stageStats.totalLessons} core · ${formatLearningTime(stageStats.completedMinutes)} / ${formatLearningTime(stageStats.totalMinutes)}</div>
              <div class="learn-lessons">
                ${stage.lessons.map((lesson) => lessonRow(lesson, progress)).join('')}
              </div>
            </section>`;
        }).join('')}
      </div>
    </section>`;
};
