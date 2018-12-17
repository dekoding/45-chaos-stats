provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-prd/iam.tfstate"
    region = "us-west-2"
  }
}

module "iam" {
  source      = "../../../modules/iam"
  environment = "prd"
}
