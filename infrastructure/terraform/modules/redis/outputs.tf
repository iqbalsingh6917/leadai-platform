output "redis_endpoint" {
  description = "Redis cluster endpoint"
  value       = "${aws_elasticache_cluster.main.cache_nodes[0].address}:${aws_elasticache_cluster.main.port}"
  sensitive   = true
}

output "redis_security_group_id" {
  value = aws_security_group.redis.id
}
