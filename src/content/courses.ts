export type Visibility = 'public' | 'unlisted';
export type LessonStatus = 'ready' | 'draft' | 'planned';

export interface CourseLesson {
  slug: string;
  title: string;
  summary: string;
  status: LessonStatus;
  deckPath?: string;
  homeworkPath?: string;
  durationMinutes: number;
}

export interface Course {
  slug: string;
  title: string;
  description: string;
  audience: string;
  visibility: Visibility;
  lessons: CourseLesson[];
}

export const courses: Course[] = [
  {
    slug: 'enterprise-ai-training',
    title: '企业 AI 培训',
    description: '面向企业内部员工的 4 次课 AI 落地训练，目标是沉淀岗位 AI 场景、提示词模板和工作卡。',
    audience: '企业内部员工，小班培训，约 10 多人',
    visibility: 'public',
    lessons: [
      {
        slug: 'lesson-1',
        title: '找到岗位里的最小 AI 场景',
        summary: '从每周重复任务里筛出一个本周能跑通的 AI 场景。',
        status: 'ready',
        deckPath: '/decks/enterprise-ai-training-lesson-1/index.html',
        homeworkPath: '/c/enterprise-ai-training/lesson-1/homework/',
        durationMinutes: 30,
      },
      {
        slug: 'lesson-2',
        title: '上下文与提示词模板',
        summary: '把第 1 课的岗位场景写成可复用提示词模板。',
        status: 'planned',
        durationMinutes: 30,
      },
      {
        slug: 'lesson-3',
        title: '把任务固化成轻量工作卡',
        summary: '让 AI 使用方法从一次性提示词变成岗位流程资产。',
        status: 'planned',
        durationMinutes: 30,
      },
      {
        slug: 'lesson-4',
        title: '岗位资产库沉淀',
        summary: '整理可复用的岗位 AI 场景、模板和工作卡。',
        status: 'planned',
        durationMinutes: 30,
      },
    ],
  },
];

export function getPublicCourses() {
  return courses.filter((course) => course.visibility === 'public');
}

export function getCourse(slug: string) {
  return courses.find((course) => course.slug === slug);
}