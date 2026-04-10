variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "db_name" { type = string; default = "leadai" }
variable "db_username" { type = string; default = "leadai" }
variable "db_password" { type = string; sensitive = true }
variable "instance_class" { type = string; default = "db.t4g.medium" }
variable "multi_az" { type = bool; default = false }
variable "allocated_storage" { type = number; default = 50 }
variable "max_allocated_storage" { type = number; default = 200 }
variable "deletion_protection" { type = bool; default = true }
variable "skip_final_snapshot" { type = bool; default = false }
variable "allowed_cidr_blocks" { type = list(string); default = [] }
