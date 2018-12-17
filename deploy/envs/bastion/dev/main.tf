provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-dev/bastion.tfstate"
    region = "us-west-2"
  }
}

module "bastion" {
  source = "../../../modules/bastion"
}
