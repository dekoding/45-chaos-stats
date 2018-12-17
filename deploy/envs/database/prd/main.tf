provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-prd/databases.tfstate"
    region = "us-west-2"
  }
}

module "database" {
  source      = "../../../modules/database"
  environment = "prd"
}
