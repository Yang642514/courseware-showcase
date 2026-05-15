# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目定位

课程课件与临时网页展示工作台。核心用途：把已生成的 HTML PPT、课程页面、作业模板、网页 demo 快速发布到线上，让客户或学员直接访问。

不是 CMS，不是网盘，不做复杂后台。第一版只解决静态内容发布。

## 技术栈

- **Astro** 静态站（SSG 模式）
- **TypeScript 配置文件**作为数据源（不接数据库）
- **Docker Nginx** 托管静态产物
- **GitHub Actions** 构建镜像 → DockerHub → **Sealos** 滚动更新

## 常用命令

```bash
npm run dev          # 本地开发预览
npm run build        # 静态构建（改完必须跑）
```

## 架构

### 路由设计

```text
/                                    首页，展示公开内容
/c/[course-slug]/                    课程主页
/c/[course-slug]/lesson-N/           课件页（嵌入或跳转 HTML PPT）
/c/[course-slug]/lesson-N/homework/  作业页
/p/[slug]/                           临时项目/客户 demo
```

### 数据模型

内容通过 `src/content/` 下的 TypeScript 配置清单管理（`courses.ts`、`projects.ts`），不接数据库。

每条内容有 `visibility` 字段：
- `public`：出现在首页
- `unlisted`：不出现在首页，但直达链接可访问

### 目录职责

| 目录 | 职责 |
|------|------|
| `src/pages/` | 页面路由（Astro 页面组件） |
| `src/layouts/` | 页面布局模板 |
| `src/content/` | 课程和项目配置清单（TypeScript） |
| `public/decks/` | HTML PPT 静态资源，每个课件一个独立目录 |
| `public/resources/` | 可下载的作业模板、资料附件 |
| `public/demos/` | 临时网页 demo 或客户演示页面 |
| `docs/superpowers/specs/` | 设计文档 |
| `docs/superpowers/plans/` | 实施计划 |
| `docs/deployment/` | 部署说明 |

### 部署链路

本地开发 → GitHub 仓库 → GitHub Actions `npm build` → Docker build → DockerHub → Sealos `kubectl rollout restart`

## 命名约定

- 课程路径用 `course-slug`（如 `enterprise-ai-training`）
- 课件路径用 `lesson-N`（如 `lesson-1`）
- 临时项目路径用简短英文 slug（如 `client-demo-202605`）
- 文件夹名只用英文、小写、数字和连字符

## 开发规则

- 改完必须跑 `npm run build`，涉及页面视觉必须本地预览检查
- 不为通过构建而删除报错内容，先找根因
- 密钥、token、kubeconfig 不进代码仓库
- 部署配置和密钥只放 GitHub Secrets 或 Sealos 环境
- 不自动执行 `git push`，等明确指令

## 内容安全

- 首页只展示可公开内容
- 不上传客户隐私、内部数据、手机号、微信号、合同、真实订单明细
- 展示真实截图前先脱敏
