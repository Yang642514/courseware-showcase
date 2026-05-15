# 课程课件展示工作台设计

## 背景

当前企业 AI 培训的第 1 课已经生成 HTML PPT。后续还会持续产生课程课件、作业模板、演示网页、客户临时展示页。直接把这些内容散落在本地文件夹或个人网站里，会导致两个问题：

- 客户访问不方便，需要临时找文件或手动发压缩包。
- 个人网站和临时交付内容混在一起，公开案例、半私密演示、课程课件边界不清楚。

因此需要一个独立的“展示工作台”，用于快速发布静态网页内容。

## 产品定位

第一版定位为：课程课件发布台 + 临时网页展示台。

它不是 CMS，不是网盘，不是复杂项目管理系统。第一版只解决一个核心问题：

> 把已经生成好的 HTML PPT、课程页面、作业模板、网页 demo 快速放到一个线上地址，让客户或学员可以直接访问。

## 推荐方案

采用独立项目，而不是塞进个人网站。

项目目录：

```text
D:\笔记库\展示工作台
```

线上定位：

```text
第一版先使用 Sealos 默认访问域名。
后续如果需要品牌化，再绑定 show 或 demo 子域名。
```

个人网站继续承担品牌展示、案例介绍、合作入口；展示工作台承担课件和临时演示内容的访问。

## 信息架构

第一版路由设计：

```text
/
  展示首页，只放公开或当前需要展示的内容

/c/enterprise-ai-training/
  企业 AI 培训课程主页

/c/enterprise-ai-training/lesson-1/
  第 1 课 HTML PPT 入口

/c/enterprise-ai-training/lesson-1/homework/
  第 1 课作业说明或填写模板

/p/[slug]/
  临时网页、客户 demo、单独展示页
```

## 内容类型

第一版支持 4 类内容：

| 类型 | 用途 | 示例 |
|---|---|---|
| `deck` | HTML PPT | 企业 AI 培训第 1 课 |
| `page` | 普通介绍页 | 课程首页、项目说明页 |
| `homework` | 作业说明或模板 | 第 1 课场景卡作业 |
| `demo` | 临时演示网页 | 客户网页原型、工具演示 |

暂不做文件上传后台。内容通过文件夹和配置清单管理。

## 目录结构

```text
D:\笔记库\展示工作台
  AGENTS.md
  package.json
  astro.config.mjs
  Dockerfile
  README.md
  docs/
    superpowers/
      specs/
      plans/
    deployment/
  src/
    layouts/
    pages/
      index.astro
      c/
        enterprise-ai-training/
          index.astro
          lesson-1.astro
          lesson-1-homework.astro
      p/
        [slug].astro
    content/
      courses.ts
      projects.ts
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

## 数据模型

第一版用 TypeScript 配置文件，不接数据库。

课程配置示意：

```ts
export const courses = [
  {
    slug: 'enterprise-ai-training',
    title: '企业 AI 培训',
    description: '面向企业内部员工的 4 次课 AI 落地训练',
    visibility: 'public',
    lessons: [
      {
        slug: 'lesson-1',
        title: '找到岗位里的最小 AI 场景',
        type: 'deck',
        deckPath: '/decks/enterprise-ai-training-lesson-1/index.html',
        homeworkPath: '/c/enterprise-ai-training/lesson-1/homework/',
      },
    ],
  },
];
```

临时项目配置示意：

```ts
export const projects = [
  {
    slug: 'sample-demo',
    title: '临时演示项目',
    type: 'demo',
    visibility: 'unlisted',
    path: '/demos/sample-demo/index.html',
  },
];
```

`visibility` 第一版只做展示控制：

- `public`：出现在首页或课程列表。
- `unlisted`：不出现在首页，但直达链接可访问。

不做密码鉴权。

## 页面设计

首页应当非常直接：

- 顶部说明这是课件与展示工作台。
- 主区展示公开课程和当前可访问项目。
- 每个条目显示类型、标题、简短说明、入口按钮。
- 半私密项目不在首页出现。

企业 AI 培训课程主页：

- 展示课程名称、适用对象、课次数量。
- 列出第 1-4 课。
- 已完成课显示“查看课件”“查看作业”。
- 未完成课显示“待发布”。

课件页：

- 优先直接跳转或嵌入 HTML PPT。
- 如果嵌入有兼容性问题，提供“全屏打开课件”按钮。

作业页：

- 展示作业目标、填写格式、示例。
- 第一版不做在线提交，只提供可复制模板。

## 部署方案

沿用个人网站的部署链路：

```text
本地开发
→ GitHub 仓库
→ GitHub Actions npm build
→ Docker build
→ 推送 DockerHub 镜像
→ kubectl rollout restart Sealos deployment
```

Docker 继续使用 Nginx 托管 Astro 静态产物：

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
EXPOSE 80
```

## 第一版范围

必须做：

- Astro 静态站项目。
- 首页。
- 企业 AI 培训课程页。
- 第 1 课 PPT 访问页。
- 第 1 课作业说明页。
- 配置清单。
- Dockerfile。
- GitHub Actions 部署配置。
- 本地构建验证。

暂不做：

- 登录系统。
- 页面级访问密码。
- 在线上传文件。
- 在线作业提交。
- 访问统计。
- 数据库。
- 多租户客户空间。

## 成功标准

第一版完成后，应满足：

- 你可以把一个新的 HTML PPT 文件夹放入 `public/decks/`。
- 在配置文件里增加一条记录。
- 本地 `npm run build` 通过。
- 推送后 Sealos 自动更新。
- 客户可以通过一个 URL 打开课件。
- 半私密项目可以不出现在首页，但直达链接可访问。

## 风险与取舍

- 不做权限意味着链接被转发后别人也能访问。因此第一版不能放敏感资料。
- 不做后台意味着发布需要改文件和配置，但这能最快跑通交付链路。
- 使用静态站意味着部署稳定、成本低、访问快，但后续如果要在线提交作业，需要再引入后端或第三方表单。

## 后续演进

第二阶段可以考虑：

- 页面级访问密码。
- 在线作业提交表单。
- 客户项目分组。
- 访问统计。
- 自动从某个本地目录同步课件。
- 课件版本管理。
