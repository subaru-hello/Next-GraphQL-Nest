variable "github_owner" {}
variable "github_app_repo_name" {}
variable "region" {}
variable "gcp_project_id" {}
variable "backend_app_name" {}
variable "cloudsql_instance_full_name" {}

resource "google_cloudbuild_trigger" "blog-backend" {
  name        = "blog-backend"
  description = "NestJSアプリを Cloud Run へdeployする"
  github {
    owner = var.github_owner
    name  = var.github_app_repo_name
    push {
      branch = "^main$"
    }
  }
  included_files = ["next-graphql-nest/backend/**"]
  filename       = "next-graphql-nest/backend/cloudbuild.yml"
  substitutions = {
    _REGION                         = var.region
    _CLOUDSQL_INSTANCE_FULL_NAME    = var.cloudsql_instance_full_name
    _ARTIFACT_REPOSITORY_IMAGE_NAME = "${var.region}-docker.pkg.dev/${var.gcp_project_id}/${var.backend_app_name}/blog-backend"
  }
}