variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "private_subnet_ids" { type = list(string) }
variable "node_type" { type = string; default = "cache.t4g.medium" }
variable "num_cache_nodes" { type = number; default = 1 }
variable "allowed_cidr_blocks" { type = list(string); default = [] }
