# IRSA (IAM Role for Service Accounts) for the EBS CSI driver controller.
# Without this, the controller uses the node instance role and fails with
# "UnauthorizedOperation: ... ec2:DescribeAvailabilityZones", leaving the
# ebs-csi-controller pods in CrashLoopBackOff and PVCs unprovisioned.
module "ebs_csi_irsa" {
  source  = "terraform-aws-modules/iam/aws//modules/iam-role-for-service-accounts-eks"
  version = "~> 5.44"

  role_name             = "${var.project}-ebs-csi-controller"
  attach_ebs_csi_policy = true

  oidc_providers = {
    main = {
      provider_arn               = module.eks.oidc_provider_arn
      namespace_service_accounts = ["kube-system:ebs-csi-controller-sa"]
    }
  }
}

# The addon is managed as a standalone resource (not inside module.eks.cluster_addons)
# to avoid a module <-> module dependency cycle: the addon needs the IRSA role ARN, and
# the IRSA role needs the cluster's OIDC provider ARN from module.eks.
resource "aws_eks_addon" "ebs_csi" {
  cluster_name                = module.eks.cluster_name
  addon_name                  = "aws-ebs-csi-driver"
  service_account_role_arn    = module.ebs_csi_irsa.iam_role_arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"

  depends_on = [module.eks]
}
