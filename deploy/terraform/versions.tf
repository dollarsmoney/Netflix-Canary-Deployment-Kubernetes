terraform {
  required_version = ">= 1.5.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.60"
    }
  }

  # Remote state is recommended for team use. Uncomment and configure an S3 bucket
  # + DynamoDB lock table, then run `terraform init -migrate-state`.
  # backend "s3" {
  #   bucket         = "my-tfstate-bucket"
  #   key            = "instagram-eks/terraform.tfstate"
  #   region         = "us-east-1"
  #   dynamodb_table = "terraform-locks"
  #   encrypt        = true
  # }
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = var.project
      ManagedBy   = "terraform"
      Environment = "dev"
    }
  }
}
