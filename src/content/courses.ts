export type Visibility = 'public' | 'unlisted';
export type LessonStatus = 'ready' | 'draft' | 'planned';

export interface HomeworkField {
  label: string;
  description: string;
}

export interface HomeworkExampleField {
  label: string;
  value: string;
}

export interface Homework {
  title: string;
  description: string;
  templateText: string;
  fields: HomeworkField[];
  example: {
    title: string;
    fields: HomeworkExampleField[];
  };
}

export interface CourseLesson {
  slug: string;
  title: string;
  summary: string;
  status: LessonStatus;
  deckPath?: string;
  durationMinutes: number;
  homework?: Homework;
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
        durationMinutes: 30,
        homework: {
          title: '提交 3 个岗位 AI 场景',
          description: '从你每周重复 3 次以上的任务里找。先不要追求完整自动化，只要能在本周跑通一小段。',
          templateText: `岗位：
任务：
输入：
输出：
检查：
暂不处理：`,
          fields: [
            { label: '岗位', description: '销售 / 行政 / 运营 / 财务 / 客服等' },
            { label: '任务', description: '一个具体动作' },
            { label: '输入', description: 'AI 需要看到的材料' },
            { label: '输出', description: 'AI 应该生成什么' },
            { label: '检查', description: '人如何判断好坏' },
            { label: '暂不处理', description: '复杂或高风险情况' },
          ],
          example: {
            title: '参考示例',
            fields: [
              { label: '岗位', value: '客户跟进' },
              { label: '任务', value: '根据客户沟通记录生成下次微信跟进话术' },
              { label: '输入', value: '客户类型、上次沟通、当前顾虑' },
              { label: '输出', value: '120 字微信话术 + 使用提醒' },
              { label: '检查', value: '事实准确、无不当承诺、语气自然' },
              { label: '暂不处理', value: '投诉争议、价格承诺、合同条款' },
            ],
          },
        },
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
