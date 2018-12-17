provider "aws" {
  region = "us-west-2"
}

terraform {
  backend "s3" {
    bucket = "mooches.terraform.state"
    key    = "mooches-prd/web.tfstate"
    region = "us-west-2"
  }
}

variable "public_ip" {
  default = "52.36.226.246"
}

variable "git_branch" {
  default = "master"
}

module "web" {
  source      = "../../../modules/web"
  public_ip   = "${var.public_ip}"
  environment = "prd"
  git_branch  = "${var.git_branch}"
}
