resource "aws_db_subnet_group" "main" {
  name       = "leadai-${var.environment}-db-subnet-group"
  subnet_ids = var.private_subnet_ids

  tags = {
    Name        = "leadai-${var.environment}-db-subnet-group"
    Environment = var.environment
  }
}

resource "aws_security_group" "rds" {
  name        = "leadai-${var.environment}-rds-sg"
  description = "Security group for LeadAI RDS PostgreSQL"
  vpc_id      = var.vpc_id

  ingress {
    from_port   = 5432
    to_port     = 5432
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
    Name        = "leadai-${var.environment}-rds-sg"
    Environment = var.environment
  }
}

resource "aws_db_parameter_group" "main" {
  name   = "leadai-${var.environment}-pg16"
  family = "postgres16"

  parameter {
    name  = "log_connections"
    value = "1"
  }

  parameter {
    name  = "shared_preload_libraries"
    value = "pg_stat_statements"
  }
}

resource "aws_db_instance" "main" {
  identifier        = "leadai-${var.environment}-postgres"
  engine            = "postgres"
  engine_version    = "16.1"
  instance_class    = var.instance_class
  db_name           = var.db_name
  username          = var.db_username
  password          = var.db_password

  allocated_storage     = var.allocated_storage
  max_allocated_storage = var.max_allocated_storage
  storage_type          = "gp3"
  storage_encrypted     = true

  multi_az               = var.multi_az
  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  parameter_group_name   = aws_db_parameter_group.main.name

  backup_retention_period   = 7
  backup_window             = "02:00-03:00"
  maintenance_window        = "sun:04:00-sun:05:00"
  deletion_protection       = var.deletion_protection
  skip_final_snapshot       = var.skip_final_snapshot
  final_snapshot_identifier = var.skip_final_snapshot ? null : "leadai-${var.environment}-final-snapshot"

  enabled_cloudwatch_logs_exports = ["postgresql", "upgrade"]

  tags = {
    Name        = "leadai-${var.environment}-postgres"
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
