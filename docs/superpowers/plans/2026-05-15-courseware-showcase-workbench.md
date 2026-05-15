# Courseware Showcase Workbench Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a first-version static courseware showcase workbench for publishing HTML PPTs, course pages, homework pages, and temporary demo pages through Sealos.

**Architecture:** Create a standalone Astro static site in `D:\笔记库\展示工作台`. Use TypeScript config files as the content registry, Astro pages for routes, and `public/` for static decks/resources. Deploy as a static `dist/` directory served by Nginx in Docker, matching the existing personal-site Sealos pattern.

**Tech Stack:** Astro 6, Tailwind CSS 4, TypeScript content config, static HTML assets, Docker Nginx, GitHub Actions, Sealos/Kubernetes rollout restart.

---

## Source Context

Read these before implementing:

- `D:\笔记库\展示工作台\AGENTS.md`
- `D:\笔记库\展示工作台\docs\superpowers\specs\2026-05-15-courseware-showcase-workbench-design.md`
- `D:\笔记库\个人网站\package.json`
- `D:\笔记库\个人网站\Dockerfile`
- `D:\笔记库\个人网站\.github\workflows\deploy.yml`

Source deck to copy:

```text
D:\笔记库\企业服务\05-企业AI培训\02-培训材料\第1课-找到岗位里的最小AI场景-ppt
```

Destination deck folder:

```text
D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1
```

## File Structure To Create

```text
D:\笔记库\展示工作台
  package.json
  package-lock.json
  astro.config.mjs
  tsconfig.json
  Dockerfile
  README.md
  .gitignore
  .github/
    workflows/
      deploy.yml
  docs/
    deployment/
      sealos-deployment.md
    superpowers/
      specs/
        2026-05-15-courseware-showcase-workbench-design.md
      plans/
        2026-05-15-courseware-showcase-workbench.md
  src/
    content/
      courses.ts
      projects.ts
    layouts/
      Layout.astro
    pages/
      index.astro
      c/
        enterprise-ai-training/
          index.astro
          lesson-1.astro
          lesson-1/
            homework.astro
      p/
        [slug].astro
    styles/
      global.css
  public/
    decks/
      enterprise-ai-training-lesson-1/
        index.html
        images/
        assets/
    resources/
      enterprise-ai-training/
    demos/
```

## Commit Guidance

If this directory is not a git repository, initialize one after Task 1:

```powershell
git init
git add AGENTS.md docs
git commit -m "docs: define courseware workbench"
```

Do not push unless the user explicitly asks.

---

### Task 1: Initialize Astro Static Project

**Files:**
- Create: `D:\笔记库\展示工作台\package.json`
- Create: `D:\笔记库\展示工作台\astro.config.mjs`
- Create: `D:\笔记库\展示工作台\tsconfig.json`
- Create: `D:\笔记库\展示工作台\.gitignore`
- Create: `D:\笔记库\展示工作台\src\styles\global.css`

- [ ] **Step 1: Create project directories**

Run:

```powershell
New-Item -ItemType Directory -Force -Path `
  'D:\笔记库\展示工作台\src\styles', `
  'D:\笔记库\展示工作台\src\content', `
  'D:\笔记库\展示工作台\src\layouts', `
  'D:\笔记库\展示工作台\src\pages', `
  'D:\笔记库\展示工作台\public\decks', `
  'D:\笔记库\展示工作台\public\resources', `
  'D:\笔记库\展示工作台\public\demos', `
  'D:\笔记库\展示工作台\.github\workflows', `
  'D:\笔记库\展示工作台\docs\deployment'
```

Expected: directories exist.

- [ ] **Step 2: Create `package.json`**

Write:

```json
{
  "name": "courseware-showcase-workbench",
  "type": "module",
  "version": "0.1.0",
  "engines": {
    "node": ">=22.12.0"
  },
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  },
  "dependencies": {
    "@tailwindcss/vite": "^4.3.0",
    "astro": "^6.3.1",
    "tailwindcss": "^4.3.0"
  },
  "devDependencies": {}
}
```

- [ ] **Step 3: Create `astro.config.mjs`**

Write:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Create `tsconfig.json`**

Write:

```json
{
  "extends": "astro/tsconfigs/strict"
}
```

- [ ] **Step 5: Create `.gitignore`**

Write:

```gitignore
node_modules/
dist/
.astro/
.env
.env.*
kubeconfig.yaml
*.log
.DS_Store
```

- [ ] **Step 6: Install dependencies**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm install
```

Expected: `package-lock.json` is created and install completes without errors.

- [ ] **Step 7: Create base CSS**

Write `src/styles/global.css`:

```css
@import "tailwindcss";

:root {
  color-scheme: light;
  --bg: #f7f5ef;
  --surface: #ffffff;
  --surface-muted: #efede6;
  --ink: #171717;
  --muted: #626262;
  --line: #d8d4ca;
  --accent: #1238d8;
  --accent-ink: #ffffff;
}

* {
  box-sizing: border-box;
}

body {
  margin: 0;
  min-height: 100vh;
  background: var(--bg);
  color: var(--ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif;
}

a {
  color: inherit;
  text-decoration: none;
}

.shell {
  width: min(1180px, calc(100vw - 40px));
  margin: 0 auto;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted);
}

.page-title {
  margin: 0;
  font-size: clamp(48px, 8vw, 104px);
  line-height: 0.98;
  font-weight: 260;
  letter-spacing: -0.03em;
}

.section {
  padding: 72px 0;
}

.grid-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.card {
  background: var(--surface);
  border: 1px solid var(--line);
  padding: 28px;
  min-height: 220px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.card h2,
.card h3 {
  margin: 12px 0;
  font-size: 28px;
  line-height: 1.15;
  font-weight: 420;
}

.card p {
  color: var(--muted);
  line-height: 1.7;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 24px;
}

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 0 18px;
  background: var(--ink);
  color: #fff;
  font-size: 15px;
}

.button.secondary {
  background: transparent;
  color: var(--ink);
  border: 1px solid var(--line);
}

.status {
  display: inline-flex;
  align-items: center;
  width: fit-content;
  padding: 5px 9px;
  background: var(--surface-muted);
  color: var(--muted);
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.status.active {
  background: var(--accent);
  color: var(--accent-ink);
}
```

- [ ] **Step 8: Verify install metadata**

Run:

```powershell
Test-Path 'D:\笔记库\展示工作台\package-lock.json'
```

Expected: `True`.

- [ ] **Step 9: Commit**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
git status --short
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/styles/global.css
git commit -m "chore: initialize Astro showcase workbench"
```

Expected: commit succeeds. If git is not initialized, run the `git init` command from Commit Guidance first.

---

### Task 2: Add Content Registry

**Files:**
- Create: `D:\笔记库\展示工作台\src\content\courses.ts`
- Create: `D:\笔记库\展示工作台\src\content\projects.ts`

- [ ] **Step 1: Create `src/content/courses.ts`**

Write:

```ts
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
```

- [ ] **Step 2: Create `src/content/projects.ts`**

Write:

```ts
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
```

- [ ] **Step 3: Run TypeScript-aware build check**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: this may fail because pages/layouts do not exist yet. Acceptable failure only if the error mentions missing pages or no route source. Type errors in `courses.ts` or `projects.ts` must be fixed before moving on.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src/content/courses.ts src/content/projects.ts
git commit -m "feat: add showcase content registry"
```

Expected: commit succeeds.

---

### Task 3: Build Shared Layout And Home Page

**Files:**
- Create: `D:\笔记库\展示工作台\src\layouts\Layout.astro`
- Create: `D:\笔记库\展示工作台\src\pages\index.astro`

- [ ] **Step 1: Create `src/layouts/Layout.astro`**

Write:

```astro
---
import '../styles/global.css';

interface Props {
  title: string;
  description?: string;
}

const {
  title,
  description = '晴天的课程课件与临时网页展示工作台。',
} = Astro.props;
---

<!doctype html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
  </head>
  <body>
    <header class="shell" style="padding: 28px 0; display:flex; justify-content:space-between; align-items:center;">
      <a href="/" style="font-weight:700;">晴天展示工作台</a>
      <nav style="display:flex; gap:18px; color:var(--muted); font-size:14px;">
        <a href="/">首页</a>
        <a href="/c/enterprise-ai-training/">企业 AI 培训</a>
      </nav>
    </header>
    <slot />
    <footer class="shell" style="padding: 44px 0; color:var(--muted); border-top:1px solid var(--line);">
      <p>晴天 · 课程课件与临时网页展示工作台</p>
      <p>公开内容展示在首页；半私密项目通过直达链接访问。</p>
    </footer>
  </body>
</html>
```

- [ ] **Step 2: Create `src/pages/index.astro`**

Write:

```astro
---
import Layout from '../layouts/Layout.astro';
import { getPublicCourses } from '../content/courses';
import { getPublicProjects } from '../content/projects';

const courses = getPublicCourses();
const projects = getPublicProjects();
---

<Layout title="晴天展示工作台">
  <main>
    <section class="shell section" style="padding-top: 88px;">
      <p class="eyebrow">Courseware & Demo Hub</p>
      <h1 class="page-title">课件、作业和临时网页，统一放到这里。</h1>
      <p style="max-width: 760px; color: var(--muted); line-height: 1.8; font-size: 18px; margin-top: 28px;">
        这里用于发布企业培训课件、作业说明、HTML PPT 和临时演示网页。首页只展示可公开内容，客户专属页面通过直达链接访问。
      </p>
    </section>

    <section class="shell section">
      <p class="eyebrow">Courses</p>
      <div class="grid-cards" style="margin-top: 22px;">
        {courses.map((course) => (
          <article class="card">
            <div>
              <span class="status active">course</span>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p>对象：{course.audience}</p>
            </div>
            <div class="button-row">
              <a class="button" href={`/c/${course.slug}/`}>进入课程</a>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section class="shell section">
      <p class="eyebrow">Public Projects</p>
      <div class="grid-cards" style="margin-top: 22px;">
        {projects.map((project) => (
          <article class="card">
            <div>
              <span class="status">{project.type}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </div>
            <div class="button-row">
              <a class="button secondary" href={project.path}>打开</a>
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>
</Layout>
```

- [ ] **Step 3: Run build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: build succeeds or fails only because nested course pages are not created yet. Fix layout/homepage syntax errors immediately.

- [ ] **Step 4: Commit**

Run:

```powershell
git add src/layouts/Layout.astro src/pages/index.astro
git commit -m "feat: add showcase landing page"
```

Expected: commit succeeds.

---

### Task 4: Add Enterprise AI Training Course Pages

**Files:**
- Create: `D:\笔记库\展示工作台\src\pages\c\enterprise-ai-training\index.astro`
- Create: `D:\笔记库\展示工作台\src\pages\c\enterprise-ai-training\lesson-1.astro`
- Create: `D:\笔记库\展示工作台\src\pages\c\enterprise-ai-training\lesson-1\homework.astro`

- [ ] **Step 1: Create route directories**

Run:

```powershell
New-Item -ItemType Directory -Force -Path `
  'D:\笔记库\展示工作台\src\pages\c\enterprise-ai-training', `
  'D:\笔记库\展示工作台\src\pages\c\enterprise-ai-training\lesson-1'
```

- [ ] **Step 2: Create course index page**

Write `src/pages/c/enterprise-ai-training/index.astro`:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { getCourse } from '../../../content/courses';

const course = getCourse('enterprise-ai-training');

if (!course) {
  throw new Error('enterprise-ai-training course config is missing');
}
---

<Layout title={`${course.title} - 晴天展示工作台`}>
  <main class="shell">
    <section class="section">
      <p class="eyebrow">Enterprise AI Training</p>
      <h1 class="page-title">{course.title}</h1>
      <p style="max-width: 760px; color: var(--muted); line-height: 1.8; font-size: 18px; margin-top: 28px;">
        {course.description}
      </p>
    </section>

    <section class="section">
      <p class="eyebrow">Lessons</p>
      <div class="grid-cards" style="margin-top: 22px;">
        {course.lessons.map((lesson) => (
          <article class="card">
            <div>
              <span class:list={['status', { active: lesson.status === 'ready' }]}>{lesson.status}</span>
              <h2>{lesson.title}</h2>
              <p>{lesson.summary}</p>
              <p>{lesson.durationMinutes} 分钟</p>
            </div>
            <div class="button-row">
              {lesson.status === 'ready' && lesson.deckPath && (
                <a class="button" href={`/c/${course.slug}/${lesson.slug}/`}>查看课件</a>
              )}
              {lesson.status === 'ready' && lesson.homeworkPath && (
                <a class="button secondary" href={lesson.homeworkPath}>查看作业</a>
              )}
              {lesson.status !== 'ready' && (
                <span style="color: var(--muted);">待发布</span>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  </main>
</Layout>
```

- [ ] **Step 3: Create lesson deck page**

Write `src/pages/c/enterprise-ai-training/lesson-1.astro`:

```astro
---
import Layout from '../../../layouts/Layout.astro';
import { getCourse } from '../../../content/courses';

const course = getCourse('enterprise-ai-training');
const lesson = course?.lessons.find((item) => item.slug === 'lesson-1');

if (!course || !lesson || !lesson.deckPath) {
  throw new Error('lesson-1 deck config is missing');
}
---

<Layout title={`${lesson.title} - ${course.title}`}>
  <main class="shell">
    <section class="section">
      <p class="eyebrow">Lesson 1</p>
      <h1 class="page-title">{lesson.title}</h1>
      <p style="max-width: 760px; color: var(--muted); line-height: 1.8; font-size: 18px; margin-top: 28px;">
        {lesson.summary}
      </p>
      <div class="button-row">
        <a class="button" href={lesson.deckPath}>全屏打开课件</a>
        <a class="button secondary" href={lesson.homeworkPath}>查看课后作业</a>
        <a class="button secondary" href={`/c/${course.slug}/`}>返回课程主页</a>
      </div>
    </section>

    <section class="section" aria-label="课件预览">
      <iframe
        src={lesson.deckPath}
        title={lesson.title}
        style="width:100%; aspect-ratio:16 / 9; border:1px solid var(--line); background:#fff;"
        loading="lazy"
      ></iframe>
    </section>
  </main>
</Layout>
```

- [ ] **Step 4: Create homework page**

Write `src/pages/c/enterprise-ai-training/lesson-1/homework.astro`:

```astro
---
import Layout from '../../../../layouts/Layout.astro';
---

<Layout title="第 1 课作业 - 企业 AI 培训">
  <main class="shell">
    <section class="section">
      <p class="eyebrow">Homework</p>
      <h1 class="page-title">提交 3 个岗位 AI 场景</h1>
      <p style="max-width: 760px; color: var(--muted); line-height: 1.8; font-size: 18px; margin-top: 28px;">
        从你每周重复 3 次以上的任务里找。先不要追求完整自动化，只要能在本周跑通一小段。
      </p>
    </section>

    <section class="section">
      <div class="grid-cards">
        <article class="card">
          <div>
            <span class="status active">format</span>
            <h2>填写格式</h2>
            <p>岗位：销售 / 行政 / 运营 / 财务 / 客服等</p>
            <p>任务：一个具体动作</p>
            <p>输入：AI 需要看到的材料</p>
            <p>输出：AI 应该生成什么</p>
            <p>检查：人如何判断好坏</p>
            <p>暂不处理：复杂或高风险情况</p>
          </div>
        </article>

        <article class="card">
          <div>
            <span class="status">sample</span>
            <h2>示例</h2>
            <p>岗位：销售 / 客户跟进</p>
            <p>任务：根据客户沟通记录生成下次微信跟进话术</p>
            <p>输入：客户类型、上次沟通、当前顾虑</p>
            <p>输出：120 字微信话术 + 使用提醒</p>
            <p>检查：事实准确、无不当承诺、语气自然</p>
            <p>暂不处理：投诉争议、价格承诺、合同条款</p>
          </div>
        </article>
      </div>
    </section>

    <section class="section">
      <article class="card">
        <div>
          <span class="status active">copy</span>
          <h2>可复制模板</h2>
          <pre style="white-space:pre-wrap; line-height:1.7; color:var(--muted);">岗位：
任务：
输入：
输出：
检查：
暂不处理：</pre>
        </div>
      </article>
    </section>
  </main>
</Layout>
```

- [ ] **Step 5: Build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

Run:

```powershell
git add src/pages/c
git commit -m "feat: add enterprise AI training pages"
```

Expected: commit succeeds.

---

### Task 5: Copy HTML PPT Deck Into Static Assets

**Files:**
- Copy from: `D:\笔记库\企业服务\05-企业AI培训\02-培训材料\第1课-找到岗位里的最小AI场景-ppt`
- Copy to: `D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1`

- [ ] **Step 1: Copy deck directory**

Run:

```powershell
$src = 'D:\笔记库\企业服务\05-企业AI培训\02-培训材料\第1课-找到岗位里的最小AI场景-ppt'
$dst = 'D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1'
New-Item -ItemType Directory -Force -Path $dst
Copy-Item -LiteralPath (Join-Path $src 'index.html') -Destination (Join-Path $dst 'index.html') -Force
Copy-Item -LiteralPath (Join-Path $src 'images') -Destination (Join-Path $dst 'images') -Recurse -Force
Copy-Item -LiteralPath (Join-Path $src 'assets') -Destination (Join-Path $dst 'assets') -Recurse -Force
if (Test-Path -LiteralPath (Join-Path $src 'favicon.ico')) {
  Copy-Item -LiteralPath (Join-Path $src 'favicon.ico') -Destination (Join-Path $dst 'favicon.ico') -Force
}
```

Expected: destination has `index.html`, `images/`, and `assets/`.

- [ ] **Step 2: Verify copied deck**

Run:

```powershell
Test-Path 'D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1\index.html'
Test-Path 'D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1\images'
Test-Path 'D:\笔记库\展示工作台\public\decks\enterprise-ai-training-lesson-1\assets'
```

Expected: all three lines print `True`.

- [ ] **Step 3: Build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: build succeeds and copies deck into `dist/decks/enterprise-ai-training-lesson-1/`.

- [ ] **Step 4: Commit**

Run:

```powershell
git add public/decks/enterprise-ai-training-lesson-1
git commit -m "feat: add enterprise AI training lesson 1 deck"
```

Expected: commit succeeds.

---

### Task 6: Add Dynamic Project Route For Temporary Demos

**Files:**
- Create: `D:\笔记库\展示工作台\src\pages\p\[slug].astro`

- [ ] **Step 1: Create `src/pages/p/[slug].astro`**

Write:

```astro
---
import Layout from '../../layouts/Layout.astro';
import { projects } from '../../content/projects';

export function getStaticPaths() {
  return projects.map((project) => ({
    params: { slug: project.slug },
    props: { project },
  }));
}

const { project } = Astro.props;
---

<Layout title={`${project.title} - 晴天展示工作台`}>
  <main class="shell">
    <section class="section">
      <p class="eyebrow">{project.type}</p>
      <h1 class="page-title">{project.title}</h1>
      <p style="max-width: 760px; color: var(--muted); line-height: 1.8; font-size: 18px; margin-top: 28px;">
        {project.description}
      </p>
      <div class="button-row">
        <a class="button" href={project.path}>打开项目</a>
        <a class="button secondary" href="/">返回首页</a>
      </div>
    </section>
  </main>
</Layout>
```

- [ ] **Step 2: Build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: build succeeds.

- [ ] **Step 3: Commit**

Run:

```powershell
git add src/pages/p
git commit -m "feat: add temporary project route"
```

Expected: commit succeeds.

---

### Task 7: Add Docker And GitHub Actions Deployment

**Files:**
- Create: `D:\笔记库\展示工作台\Dockerfile`
- Create: `D:\笔记库\展示工作台\.github\workflows\deploy.yml`
- Create: `D:\笔记库\展示工作台\docs\deployment\sealos-deployment.md`
- Create: `D:\笔记库\展示工作台\README.md`

- [ ] **Step 1: Create `Dockerfile`**

Write:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

- [ ] **Step 2: Create GitHub Actions workflow**

Write `.github/workflows/deploy.yml`:

```yaml
name: Build and Deploy to Sealos

on:
  push:
    branches:
      - master
  workflow_dispatch:

jobs:
  build-image:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 1

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Build site
        run: npm run build

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Login to DockerHub
        uses: docker/login-action@v3
        with:
          username: ${{ secrets.DOCKER_USERNAME }}
          password: ${{ secrets.DOCKER_PASSWORD }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ secrets.DOCKER_USERNAME }}/courseware-showcase:latest

  deploy:
    needs: build-image
    runs-on: ubuntu-latest
    steps:
      - uses: actions-hub/kubectl@master
        env:
          KUBE_CONFIG: ${{ secrets.KUBE_CONFIG }}
        with:
          args: rollout restart deployment courseware-showcase
```

- [ ] **Step 3: Create deployment docs**

Write `docs/deployment/sealos-deployment.md`:

```markdown
# Sealos Deployment

## Deployment Name

The GitHub Actions workflow restarts this Kubernetes deployment:

```text
courseware-showcase
```

## Required GitHub Secrets

```text
DOCKER_USERNAME
DOCKER_PASSWORD
KUBE_CONFIG
```

`KUBE_CONFIG` is the base64-compatible kubeconfig content expected by `actions-hub/kubectl`.

## Docker Image

```text
<DOCKER_USERNAME>/courseware-showcase:latest
```

## Local Build Check

```powershell
npm run build
```

## Manual Deployment Check

After GitHub Actions finishes:

```powershell
kubectl rollout status deployment/courseware-showcase
```

Do not commit kubeconfig files or raw secrets.
```
```

- [ ] **Step 4: Create `README.md`**

Write:

```markdown
# 晴天展示工作台

课程课件与临时网页展示工作台，用于发布 HTML PPT、课程说明、作业模板和客户演示页面。

## 本地开发

```powershell
npm install
npm run dev
```

## 构建

```powershell
npm run build
```

## 内容发布

HTML PPT 放到：

```text
public/decks/<deck-slug>/
```

课程和项目入口配置在：

```text
src/content/courses.ts
src/content/projects.ts
```

首页只展示 `visibility: 'public'` 的内容。半私密项目使用 `visibility: 'unlisted'`，通过直达链接访问。
```

- [ ] **Step 5: Build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run build
```

Expected: build succeeds.

- [ ] **Step 6: Commit**

Run:

```powershell
git add Dockerfile .github/workflows/deploy.yml docs/deployment/sealos-deployment.md README.md
git commit -m "chore: add Sealos deployment config"
```

Expected: commit succeeds.

---

### Task 8: Final Verification

**Files:**
- Verify generated `D:\笔记库\展示工作台\dist`

- [ ] **Step 1: Run clean build**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
Remove-Item -LiteralPath 'D:\笔记库\展示工作台\dist' -Recurse -Force -ErrorAction SilentlyContinue
npm run build
```

Expected: build succeeds.

- [ ] **Step 2: Verify expected output files**

Run:

```powershell
Test-Path 'D:\笔记库\展示工作台\dist\index.html'
Test-Path 'D:\笔记库\展示工作台\dist\c\enterprise-ai-training\index.html'
Test-Path 'D:\笔记库\展示工作台\dist\c\enterprise-ai-training\lesson-1\index.html'
Test-Path 'D:\笔记库\展示工作台\dist\c\enterprise-ai-training\lesson-1\homework\index.html'
Test-Path 'D:\笔记库\展示工作台\dist\decks\enterprise-ai-training-lesson-1\index.html'
```

Expected: all five lines print `True`.

- [ ] **Step 3: Preview locally**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
npm run preview -- --host 127.0.0.1 --port 4322
```

Open:

```text
http://127.0.0.1:4322/
http://127.0.0.1:4322/c/enterprise-ai-training/
http://127.0.0.1:4322/c/enterprise-ai-training/lesson-1/
http://127.0.0.1:4322/c/enterprise-ai-training/lesson-1/homework/
http://127.0.0.1:4322/decks/enterprise-ai-training-lesson-1/index.html
```

Expected:

- Home page lists 企业 AI 培训.
- Course page lists 4 lessons with lesson 1 ready.
- Lesson 1 page shows an iframe preview and full-screen deck button.
- Homework page shows format, example, and copy template.
- Deck opens and slides render.

- [ ] **Step 4: Inspect git status**

Run:

```powershell
Set-Location 'D:\笔记库\展示工作台'
git status --short
```

Expected: no uncommitted changes except local generated files intentionally ignored by `.gitignore`.

---

## Self-Review Checklist

- Spec coverage:
  - Independent Astro project: Task 1.
  - Static content registry: Task 2.
  - Home page: Task 3.
  - Course page, lesson page, homework page: Task 4.
  - Copy current PPT: Task 5.
  - Temporary project route: Task 6.
  - Docker and Sealos deployment: Task 7.
  - Build and route verification: Task 8.
- Scope check:
  - No login system.
  - No password gate.
  - No upload backend.
  - No database.
  - No online homework submission.
- Security check:
  - No kubeconfig committed.
  - No secrets in source files.
  - Semi-private content is controlled only by not linking it from public pages.

