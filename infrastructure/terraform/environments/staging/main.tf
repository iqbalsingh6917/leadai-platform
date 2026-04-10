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
    key            = "staging/terraform.tfstate"
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
      Environment = "staging"
      ManagedBy   = "terraform"
    }
  }
}

# ── VPC ───────────────────────────────────────────────────────────────────────

module "vpc" {
  source      = "../../modules/vpc"
  environment = "staging"
  vpc_cidr    = var.vpc_cidr
  aws_region  = var.aws_region
}

# ── EKS ───────────────────────────────────────────────────────────────────────

module "eks" {
  source             = "../../modules/eks"
  environment        = "staging"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  cluster_version    = "1.29"
  node_desired_size  = 2
  node_min_size      = 1
  node_max_size      = 4
  node_instance_types = ["t3.medium"]
}

# ── RDS ───────────────────────────────────────────────────────────────────────

module "rds" {
  source             = "../../modules/rds"
  environment        = "staging"
  vpc_id             = module.vpc.vpc_id
  private_subnet_ids = module.vpc.private_subnet_ids
  db_password        = var.db_password
  instance_class     = "db.t4g.medium"
  multi_az           = false
  deletion_protection = false
  skip_final_snapshot = true
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]
}

# ── Redis ─────────────────────────────────────────────────────────────────────

module "redis" {
  source              = "../../modules/redis"
  environment         = "staging"
  vpc_id              = module.vpc.vpc_id
  private_subnet_ids  = module.vpc.private_subnet_ids
  node_type           = "cache.t4g.micro"
  num_cache_nodes     = 1
  allowed_cidr_blocks = [module.vpc.vpc_cidr_block]
}
