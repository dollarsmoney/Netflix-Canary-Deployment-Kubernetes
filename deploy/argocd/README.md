# GitOps with Argo CD

Argo CD makes **GitHub the single source of truth** for the cluster. Instead of CI
running `kubectl apply`, Argo CD watches this repo and continuously reconciles the
`instagram` namespace to match [`deploy/k8s`](../k8s). Any drift (a manual `kubectl edit`,
a deleted pod spec) is automatically reverted (`selfHeal`), and anything removed from Git
is pruned from the cluster (`prune`).

```
GitHub (deploy/k8s, branch main)  ──watch──►  Argo CD  ──sync──►  EKS namespace "instagram"
```

## Files

| File | Purpose |
|------|---------|
| `application.yaml` | The Argo CD `Application` — points at `deploy/k8s` on `main`, auto-sync on. |
| `project.yaml` | An `AppProject` scoping which repo/namespaces this app may touch. |
| `repo-secret.example.yaml` | Template for private-repo credentials (only if the repo is private). |

## One-time bootstrap

Run these from a machine with `kubectl` pointed at the cluster (the same kubeconfig you
already use). Argo CD is installed once; after that, deploys happen through Git.

```powershell
# 1. Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
kubectl -n argocd rollout status deploy/argocd-server --timeout=300s

# 2. (Private repo only) give Argo CD read access to GitHub
#    Copy the template, paste a GitHub PAT (repo:read), then apply. repo-secret.yaml is gitignored.
#    Skip this step entirely if the repo is public.
kubectl apply -f deploy/argocd/repo-secret.yaml

# 3. Register the project + application (Git becomes the source of truth from here on)
kubectl apply -f deploy/argocd/project.yaml
kubectl apply -f deploy/argocd/application.yaml

# 4. Watch the first sync
kubectl -n argocd get application instagram -w   # STATUS should reach Synced / Healthy
```

## Accessing the Argo CD UI

```powershell
# Initial admin password
kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | % { [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($_)) }

# Port-forward the UI to https://localhost:8080  (user: admin)
kubectl -n argocd port-forward svc/argocd-server 8080:443
```

(Optionally expose it via its own `LoadBalancer`/Ingress instead of port-forward.)

## How deploys work now (image updates)

Because Git is the source of truth, a new image version must be **committed to Git** for
Argo CD to roll it out. The tag lives in [`deploy/k8s/kustomization.yaml`](../k8s/kustomization.yaml)
under `images:`. The flow becomes:

1. CI builds and pushes the 5 images to ECR tagged with the commit SHA (unchanged).
2. CI bumps the tag in `kustomization.yaml` and commits it back to `main`, e.g.:
   ```bash
   cd deploy/k8s
   kustomize edit set image instagram-user=$ECR/instagram-user:$SHA \
                            instagram-post=$ECR/instagram-post:$SHA \
                            instagram-newsfeed=$ECR/instagram-newsfeed:$SHA \
                            instagram-web=$ECR/instagram-web:$SHA \
                            instagram-gateway=$ECR/instagram-gateway:$SHA
   git commit -am "Deploy $SHA" && git push
   ```
3. Argo CD sees the commit and syncs the new images into the cluster — **no `kubectl` from CI**.

> This replaces the `Deploy to EKS` step in `.github/workflows/deploy.yml`. Keep the
> build/push job; swap the `kubectl apply -k` + rollout steps for the commit-back above.
> (An alternative that avoids commit-back is the **Argo CD Image Updater**, which watches
> ECR and writes tags for you — ask if you want that instead.)

## Notes

- `application.yaml` sets `selfHeal: true` and `prune: true`. While Argo CD is running, do
  not `kubectl apply -k deploy/k8s` by hand — Argo owns the namespace and will fight you.
- The app creates two cluster-scoped resources (the `instagram` Namespace and the `gp3`
  StorageClass); the `AppProject` whitelists exactly those.
- `secret.yaml` is committed with demo credentials. For real use, store secrets with
  SealedSecrets / SOPS / External Secrets so plaintext never lives in Git.
