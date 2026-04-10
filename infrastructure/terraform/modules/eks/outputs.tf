output "cluster_name" {
  value = aws_eks_cluster.main.name
}

output "cluster_endpoint" {
  value     = aws_eks_cluster.main.endpoint
  sensitive = true
}

output "cluster_ca_data" {
  value     = aws_eks_cluster.main.certificate_authority[0].data
  sensitive = true
}

output "node_group_role_arn" {
  value = aws_iam_role.node.arn
}
