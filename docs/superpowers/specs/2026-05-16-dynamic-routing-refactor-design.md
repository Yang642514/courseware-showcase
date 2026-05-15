# Dynamic Routing Refactor

Date: 2026-05-16

## Problem

Course and lesson pages are hardcoded in `src/pages/c/enterprise-ai-training/`. Adding a new course requires manually creating page files. Navigation links are hardcoded in Layout.astro. kubeconfig.yaml may be tracked in git.

## Scope

Three changes, all high priority:

1. Dynamic routing for courses, lessons, and homework pages
2. Navigation auto-generated from courses.ts
3. kubeconfig.yaml removed from git tracking (if tracked)

## Design

### Part 1: Data Model Extension

Extend `CourseLesson` in `src/content/courses.ts` with an optional `homework` field:

```ts
interface HomeworkField {
  label: string;       // 字段名，如 "岗位"、"任务"
  description: string; // 字段说明，如 "销售 / 行政 / 运营 / 财务 / 客服等"
}

interface HomeworkExampleField {
  label: string;  // 字段名
  value: string;  // 示例值
}

interface HomeworkExample {
  title: string;
  fields: HomeworkExampleField[];
}

interface Homework {
  title: string;
  description: string;
  templateText: string;
  fields: HomeworkField[];
  example: HomeworkExample;
}

interface CourseLesson {
  // existing fields unchanged
  slug: string;
  title: string;
  summary: string;
  status: LessonStatus;
  deckPath?: string;
  durationMinutes: number;
  homework?: Homework;  // presence enables homework page generation
}
```

Key decisions:
- `homeworkPath` removed from CourseLesson. Homework URL is always derived as `/c/${course.slug}/${lesson.slug}/homework/`.
- Fields use `{ label, description }` objects instead of plain strings to support richer rendering.
- Example uses `{ label, value }` for the same reason.

### Part 2: Route Structure

Delete hardcoded directory:
- `src/pages/c/enterprise-ai-training/` (entire directory)

Create dynamic routes:
- `src/pages/c/[slug]/index.astro` - course landing page
- `src/pages/c/[slug]/[lesson].astro` - lesson viewer (iframe + nav)
- `src/pages/c/[slug]/[lesson]/homework.astro` - homework page

Each file uses `getStaticPaths()` reading from `courses.ts`:

- `[slug]/index.astro`: iterates all courses
- `[slug]/[lesson].astro`: iterates courses × lessons where `status === 'ready'` and `deckPath` exists
- `[slug]/[lesson]/homework.astro`: iterates courses × lessons where `homework` field exists

Homework links in course index and lesson pages use `/c/${course.slug}/${lesson.slug}/homework/` pattern. No `homeworkPath` field needed.

Pattern matches existing `src/pages/p/[slug].astro`.

### Part 3: Navigation Auto-generation

Modify `src/layouts/Layout.astro` nav section to iterate `getPublicCourses()`:

```astro
<nav>
  <a href="/">首页</a>
  {getPublicCourses().map((c) => (
    <a href={`/c/${c.slug}/`}>{c.title}</a>
  ))}
</nav>
```

No other layout changes.

### Part 4: kubeconfig Cleanup

1. Check `git ls-files -- kubeconfig.yaml` — only proceed if tracked
2. Check `.gitignore` before adding — don't duplicate entries
3. Add `kubeconfig.yaml` to `.gitignore` if absent
4. Run `git rm --cached kubeconfig.yaml` only if tracked
5. No history rewrite (private repo, low risk)

## Files Changed

| Action | File |
|--------|------|
| Modify | `src/content/courses.ts` |
| Delete | `src/pages/c/enterprise-ai-training/` (3 files) |
| Create | `src/pages/c/[slug]/index.astro` |
| Create | `src/pages/c/[slug]/[lesson].astro` |
| Create | `src/pages/c/[slug]/[lesson]/homework.astro` |
| Modify | `src/layouts/Layout.astro` |
| Maybe modify | `.gitignore` |
| Maybe remove from tracking | `kubeconfig.yaml` |

## Not Changed

- `src/styles/global.css`
- `src/pages/p/[slug].astro`
- `src/pages/index.astro`
- `public/decks/` (PPT static assets)

## Success Criteria

- `npm run build` passes with zero errors
- Existing URLs (`/c/enterprise-ai-training/`, `/c/enterprise-ai-training/lesson-1/`, `/c/enterprise-ai-training/lesson-1/homework/`) still work identically
- Adding a new course requires only editing `courses.ts`
- Nav bar reflects all public courses automatically
