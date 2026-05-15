# Sealos Deployment

## Deployment Name

The GitHub Actions workflow restarts this Kubernetes deployment:

```
courseware-showcase
```

## Required GitHub Secrets

```
DOCKER_USERNAME
DOCKER_PASSWORD
KUBE_CONFIG
```

`KUBE_CONFIG` is the base64-compatible kubeconfig content expected by `actions-hub/kubectl`.

## Docker Image

```
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