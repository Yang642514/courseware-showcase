export type ProjectVisibility = 'public' | 'unlisted';
export type ProjectType = 'demo' | 'page' | 'deck' | 'resource';

export interface Project {
  slug: string;
  title: string;
  description: string;
  type: ProjectType;
  visibility: ProjectVisibility;
  path: string;
}

export const projects: Project[] = [
  {
    slug: 'enterprise-ai-training-lesson-1',
    title: '企业 AI 培训第 1 课课件',
    description: '找到岗位里的最小 AI 场景。HTML PPT，可直接演示。',
    type: 'deck',
    visibility: 'public',
    path: '/c/enterprise-ai-training/lesson-1/',
  },
];

export function getPublicProjects() {
  return projects.filter((project) => project.visibility === 'public');
}

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}