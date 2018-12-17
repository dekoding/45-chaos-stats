provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-dev/security-groups.tfstate"
    region = "us-west-2"
  }
}

variable "environment" {
  default = "dev"
}

module "security_groups" {
  source = "../../../modules/security_groups"
}
