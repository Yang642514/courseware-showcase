# 静态项目展示站模板

一个用于“临时但可直接访问”的线上展示站模板：把课程、HTML PPT、学习资料、静态 Demo 或项目说明放进仓库，提交到 GitHub 后由 GitHub Actions 构建 Docker 镜像，再通过 Sealos/Kubernetes 自动更新线上部署。

它适合个人、培训交付和小型团队快速搭建一个展示入口，不需要数据库，也不需要为每个临时项目单独部署一套应用。

## 这套模板解决什么问题

```text
编辑内容 → 推送 GitHub → Actions 构建 Astro → 构建并推送 Docker 镜像 → Sealos 重启部署 → 线上展示
```

- 静态内容优先，部署简单，运行成本低。
- 课程、课件、作业和项目页面通过 TypeScript 内容清单管理。
- HTML PPT、图片和其他静态资源直接放在 `public/`。
- 一个仓库可以承载多个临时展示项目。
- 部署参数通过 GitHub Variables 和 Secrets 配置，不写进源码。

## 快速开始

环境要求：Node.js `>=22.12.0`。

```bash
npm ci
npm run dev
```

打开终端提示的本地地址即可预览。发布前运行：

```bash
npm run build
```

构建产物位于 `dist/`，Docker 镜像使用 Nginx 提供这些静态文件。

## 添加展示内容

### 1. 添加 HTML PPT 或静态资源

将一个可独立打开的 HTML PPT 放入：

```text
public/decks/<deck-slug>/index.html
```

如果 PPT 依赖图片、字体或脚本，一并放在同一个目录内，并确保入口文件使用相对路径。

### 2. 注册课程或课件

编辑 `src/content/courses.ts`：

```ts
{
  slug: 'my-course',
  title: '我的课程',
  description: '课程说明',
  audience: '目标受众',
  visibility: 'public',
  lessons: [
    {
      slug: 'lesson-1',
      title: '第一课',
      summary: '课件简介',
      status: 'ready',
      deckPath: '/decks/my-course-lesson-1/index.html',
      durationMinutes: 30,
    },
  ],
}
```

### 3. 注册项目页面

编辑 `src/content/projects.ts`，为项目填写标题、说明、类型和访问路径。适合把产品 Demo、案例说明或单独的静态页面挂到同一个展示站。

### 4. 修改站点名称

编辑 `src/content/site.ts`，修改站点名称、首页副标题、描述和页脚信息，不需要到多个页面里逐处替换品牌文案。

## `public` 和 `unlisted` 的区别

- `public`：出现在首页和课程列表中。
- `unlisted`：不出现在首页，但只要知道 URL 仍然可以访问。

`unlisted` 不是权限控制，也不是密码保护。客户资料、内部数据、真实订单、手机号、微信号、合同和未脱敏截图不要放进公开仓库或仅靠隐藏链接保护。需要访问控制时，应增加认证层、私有部署或其他真正的权限方案。

## Docker

本地构建静态站后，可以直接构建 Nginx 镜像：

```bash
npm run build
docker build -t your-dockerhub-user/showcase-template:latest .
docker run --rm -p 8080:80 your-dockerhub-user/showcase-template:latest
```

然后访问 `http://localhost:8080` 检查镜像中的站点。

## GitHub Actions + Sealos 部署

仓库中的 `.github/workflows/deploy.yml` 已包含完整链路：

1. GitHub Actions 安装依赖并构建 Astro。
2. 构建 Docker 镜像并推送到 Docker Hub。
3. 使用 kubeconfig 连接 Kubernetes/Sealos。
4. 重启指定 Deployment，并等待 rollout 完成。

### GitHub Actions Variables

在仓库的 Settings → Secrets and variables → Actions → Variables 中配置：

| 名称 | 示例 | 说明 |
|---|---|---|
| `DOCKER_IMAGE` | `your-dockerhub-user/showcase-template:latest` | 完整 Docker 镜像地址；配置后优先使用 |
| `SEALOS_DEPLOYMENT_NAME` | `showcase-template` | Sealos 中已有的 Deployment 名称；不配置时兼容旧名称 `courseware-showcase` |
| `SEALOS_NAMESPACE` | `ns-your-namespace` | Sealos 中 Deployment 所在的 Kubernetes namespace |

如果暂时不设置 `DOCKER_IMAGE`，工作流会兼容使用 `DOCKER_USERNAME/courseware-showcase:latest`。复制模板后建议尽快设置自己的镜像地址。

### GitHub Actions Secrets

在同一位置的 Secrets 中配置：

| 名称 | 说明 |
|---|---|
| `DOCKER_USERNAME` | Docker Hub 用户名；仅用于兼容默认镜像名 |
| `DOCKER_PASSWORD` | Docker Hub 密码或 Access Token |
| `KUBE_CONFIG` | base64 编码后的 kubeconfig 内容 |

生成 `KUBE_CONFIG` 示例：

```bash
base64 -i kubeconfig.yaml | tr -d '\n'
```

不要把 kubeconfig、Docker Token 或其他密钥提交到 Git。Sealos 侧的 Deployment 需要提前配置为拉取上述镜像，并监听容器的 `80` 端口。

更完整的部署说明见 [`docs/deployment/sealos-deployment.md`](docs/deployment/sealos-deployment.md)。

## 目录结构

```text
src/content/site.ts       # 站点名称和通用文案
src/content/courses.ts    # 课程、课件和作业清单
src/content/projects.ts   # 项目展示清单
src/pages/                 # 首页、课程、课件和项目路由
public/decks/              # HTML PPT 和配套静态资源
public/resources/          # 可下载资料
public/demos/              # 临时 Demo
Dockerfile                 # Nginx 静态镜像
.github/workflows/         # GitHub Actions + Sealos 部署
```

## 公开模板的边界

这个仓库公开的是一套部署和内容组织模式，不代表其中的示例课程、页面或素材适合原样用于所有场景。使用者需要自行核对内容版权、客户隐私、第三方依赖和部署权限。
