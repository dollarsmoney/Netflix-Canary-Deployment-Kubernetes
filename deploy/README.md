# Deployment: AWS EKS + GitHub Actions CI/CD

This directory contains everything needed to run the Instagram-clone microservices on
Amazon EKS, with a GitHub Actions pipeline that authenticates via OIDC, pushes images to
ECR, and deploys to the cluster.

```
deploy/
├── terraform/   # VPC, EKS, ECR, GitHub OIDC role (one-time infra)
└── k8s/         # Kubernetes manifests (kustomize) for the app + in-cluster DBs
```

## 1. Provision infrastructure (Terraform)

```bash
cd deploy/terraform
terraform init
terraform apply \
  -var="github_org=dollarsmoney" \
  -var="github_repo=Netflix-Canary-Deployment-Kubernetes"
```

Note the outputs — you'll need them for the GitHub configuration:

- `cluster_name`
- `region`
- `github_actions_role_arn`
- `ecr_registry`

## 2. Configure GitHub repository variables

In the repo **Settings → Secrets and variables → Actions → Variables**, add:

| Variable            | Value                                   |
| ------------------- | --------------------------------------- |
| `AWS_REGION`        | Terraform output `region`               |
| `EKS_CLUSTER_NAME`  | Terraform output `cluster_name`         |
| `AWS_ROLE_ARN`      | Terraform output `github_actions_role_arn` |

No AWS access keys are stored — the workflow assumes the role via OIDC.

## 3. Deploy

Push to `main` (or run the **Build and Deploy to EKS** workflow manually). The pipeline
(`.github/workflows/deploy.yml`):

1. Assumes the AWS role via OIDC.
2. Publishes the .NET services and builds all 5 images.
3. Pushes them to ECR tagged with the commit SHA.
4. `kustomize edit set image` + `kubectl apply -k deploy/k8s`.
5. Waits for each Deployment rollout to complete.

## 4. Access the app

```bash
aws eks update-kubeconfig --name <cluster_name> --region <region>
kubectl get svc gateway -n instagram   # note the EXTERNAL-IP (LoadBalancer)
```

Open `http://<EXTERNAL-IP>/` in a browser.

## Notes

- Databases (MySQL, MongoDB, RabbitMQ, Azurite) run in-cluster as StatefulSets with EBS
  volumes — fine for a demo, not highly available. For production, switch to RDS /
  DocumentDB / Amazon MQ and point the connection strings in `k8s/secret.yaml` at them.
- The gateway is exposed via a `LoadBalancer` Service on port 80. Put an ACM cert + ALB
  ingress (or NLB + TLS) in front of it for HTTPS.
- Demo credentials in `k8s/secret.yaml` are carried over from docker-compose. Replace them
  before any real use.

## Troubleshooting: storage / EBS CSI

- The `aws-ebs-csi-driver` addon is given a dedicated IRSA role (`deploy/terraform/ebs-csi.tf`).
  If `ebs-csi-controller` pods CrashLoopBackOff with `UnauthorizedOperation ...
  ec2:DescribeAvailabilityZones`, re-run `terraform apply` — the role/addon wiring is what
  fixes it.
- If PVCs stay `Pending`, check `kubectl get sc`. If no class is marked `(default)`, enable
  `k8s/storageclass.yaml` (uncomment it in `k8s/kustomization.yaml`) and re-apply. Do not
  enable it if a default class already exists.
