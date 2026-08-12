# Sealos 部署模板

这个项目把 Astro 静态站构建成 Nginx Docker 镜像，推送到 Docker Hub 后，通过 GitHub Actions 使用 kubeconfig 重启 Sealos/Kubernetes 中已有的 Deployment。

## 部署链路

```text
GitHub push
  → npm ci + npm run build
  → Docker build / push
  → kubectl rollout restart
  → kubectl rollout status
```

工作流文件：`.github/workflows/deploy.yml`。

## Sealos 侧准备

先在 Sealos 创建一个 Deployment，使用和 GitHub Variables 中相同的 Docker 镜像地址，并满足：

- 容器监听端口 `80`。
- Deployment 名称与 `SEALOS_DEPLOYMENT_NAME` 相同。
- 如果 Docker Hub 镜像是私有的，在 Sealos 配置镜像拉取凭据。
- kubeconfig 对该命名空间拥有读取 Deployment 和执行 rollout 的权限。

## GitHub Actions Variables

在仓库 Settings → Secrets and variables → Actions → Variables 中配置：

```text
DOCKER_IMAGE=your-dockerhub-user/showcase-template:latest
SEALOS_DEPLOYMENT_NAME=showcase-template
SEALOS_NAMESPACE=ns-your-namespace
```

`DOCKER_IMAGE` 是完整镜像地址；`SEALOS_DEPLOYMENT_NAME` 是 Sealos 中已有的 Deployment 名称；`SEALOS_NAMESPACE` 是该 Deployment 所在的 Kubernetes namespace。这些值都不是 Secret，可以作为普通 Actions Variable 保存。

## GitHub Actions Secrets

配置以下 Secrets：

```text
DOCKER_USERNAME
DOCKER_PASSWORD
KUBE_CONFIG
```

`DOCKER_PASSWORD` 建议使用 Docker Hub Access Token，不要使用个人登录密码。

`KUBE_CONFIG` 使用 base64 编码后的 kubeconfig 内容。示例：

```bash
base64 -i kubeconfig.yaml | tr -d '\n'
```

不要提交 `kubeconfig.yaml`、Docker Token 或其他密钥。`.gitignore` 已忽略 kubeconfig 文件和本地自动化快照。

## 本地验证

```bash
npm ci
npm run build
docker build -t your-dockerhub-user/showcase-template:latest .
docker run --rm -p 8080:80 your-dockerhub-user/showcase-template:latest
```

访问 `http://localhost:8080` 检查 Docker 镜像中的静态站。

## 手动检查 rollout

GitHub Actions 完成后，可以使用同一份 kubeconfig 检查：

```bash
kubectl rollout status deployment/showcase-template
```

将 `showcase-template` 替换为实际的 `SEALOS_DEPLOYMENT_NAME`。
