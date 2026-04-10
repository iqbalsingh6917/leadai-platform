resource "aws_elasticache_subnet_group" "main" {
  name       = "leadai-${var.environment}-redis-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "leadai-${var.environment}-redis-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "redis" {
  name        = "leadai-${var.environment}-redis-sg"
  description = "Security group for LeadAI ElastiCache Redis"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 6379
    to_port     = 6379
    protocol    = "tcp"
    cidr_blocks = var.allowed_cidr_blocks
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name        = "leadai-${var.environment}-redis-sg"
    Environment = var.environment
  }
}

resource "aws_elasticache_cluster" "main" {
  cluster_id           = "leadai-${var.environment}-redis"
  engine               = "redis"
  node_type            = var.node_type
  num_cache_nodes      = var.num_cache_nodes
  parameter_group_name = "default.redis7"
  engine_version       = "7.1"
  port                 = 6379

  subnet_group_name  = aws_elasticache_subnet_group.main.name
  security_group_ids = [aws_security_group.redis.id]

  snapshot_retention_limit = 1
  snapshot_window          = "03:00-04:00"
  maintenance_window       = "sun:05:00-sun:06:00"

  tags = {
    Name        = "leadai-${var.environment}-redis"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
