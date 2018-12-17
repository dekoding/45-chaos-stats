provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-dev/iam.tfstate"
    region = "us-west-2"
  }
}

module "iam" {
  source = "../../../modules/iam"
}
