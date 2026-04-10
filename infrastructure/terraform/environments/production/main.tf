terraform {
  required_version = ">= 1.6"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "s3" {
    bucket         = "leadai-terraform-state"
    key            = "production/terraform.tfstate"
    region         = "ap-south-1"
    encrypt        = true
    dynamodb_table = "leadai-terraform-lock"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "leadai-platform"
      Environment = "production"
      ManagedBy   = "terraform"
    }
  }
}

# ── VPC ───────────────────────────────────────────────────────────────────────

module "vpc" {
  source      = "../../modules/vpc"
  environment = "production"
  vpc_cidr    = var.vpc_cidr
  aws_region  = var.aws_region
}

# ── EKS ───────────────────────────────────────────────────────────────────────

module "eks" {
  source              = "../../modules/eks"
  environment         = "production"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  cluster_version     = "1.29"
  node_desired_size   = 3
  node_min_size       = 2
  node_max_size       = 10
  node_instance_types = ["t3.xlarge"]
}

# ── RDS (Multi-AZ) ────────────────────────────────────────────────────────────

module "rds" {
  source                = "../../modules/rds"
  environment           = "production"
  vpc_id                = module.vpc.vpc_id
  private_subnet_ids    = module.vpc.private_subnet_ids
  db_password           = var.db_password
  instance_class        = "db.r6g.large"
  multi_az              = true
  allocated_storage     = 100
  max_allocated_storage = 500
  deletion_protection   = true
  skip_final_snapshot   = false
  allowed_cidr_blocks   = [module.vpc.vpc_cidr_block]
}

# ── Redis ─────────────────────────────────────────────────────────────────────

module "redis" {
  source              = "../../modules/redis"
  environment         = "production"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_type           = "cache.r6g.large"
  num_cache_nodes     = 1
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]
}
