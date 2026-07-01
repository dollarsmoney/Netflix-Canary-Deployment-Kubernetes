output "region" {
  description = "AWS region."
  value       = var.region
}

output "cluster_name" {
  description = "EKS cluster name (use with: aws eks update-kubeconfig)."
  value       = module.eks.cluster_name
}

output "cluster_endpoint" {
  description = "EKS API server endpoint."
  value       = module.eks.cluster_endpoint
}

output "account_id" {
  description = "AWS account ID."
  value       = data.aws_caller_identity.current.account_id
}

output "ecr_registry" {
  description = "ECR registry host (base for all image names)."
  value       = "${data.aws_caller_identity.current.account_id}.dkr.ecr.${var.region}.amazonaws.com"
}

output "ecr_repository_urls" {
  description = "Map of ECR repository name -> URL."
  value       = { for name, repo in aws_ecr_repository.repos : name => repo.repository_url }
}

output "github_actions_role_arn" {
  description = "IAM role ARN the GitHub Actions workflow assumes via OIDC."
  value       = aws_iam_role.github_actions.arn
}
