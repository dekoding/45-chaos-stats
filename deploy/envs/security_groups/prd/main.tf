provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-prd/security-groups.tfstate"
    region = "us-west-2"
  }
}

module "security_groups" {
  source      = "../../../modules/security_groups"
  environment = "prd"
}
