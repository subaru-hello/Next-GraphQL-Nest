variable "target_region" {
  description = "デプロイするリージョン"
  type        = string
  default     = "us-central1"
}

# https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database
resource "google_sql_database_instance" "nest-next-graph-db" {
  name                = "nest-next-graph-db"
  database_version    = "POSTGRES_14"
  region              = var.target_region
  deletion_protection = false # 検証で作成するため、あとで消したい

  settings {
    tier              = "db-f1-micro"
    availability_type = "ZONAL"
    disk_size         = "20"
    disk_type         = "PD_SSD"

    ip_configuration {
      ipv4_enabled = "true"
    }
  }
}

resource "google_sql_database" "nest-next-graph-db" {
  name     = "nest_next_graph_db"
  instance = google_sql_database_instance.nest-next-graph-db.name
}

# ref: https://registry.terraform.io/providers/hashicorp/google/latest/docs/resources/sql_database_instance#attributes-reference
output "nest_next_graph_db_connection_name" {
  value = google_sql_database_instance.nest-next-graph-db.connection_name
}