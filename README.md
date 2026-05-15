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

```
public/decks/<deck-slug>/
```

课程和项目入口配置在：

```
src/content/courses.ts
src/content/projects.ts
```

首页只展示 `visibility: 'public'` 的内容。半私密项目使用 `visibility: 'unlisted'`，通过直达链接访问。