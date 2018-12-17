variable "name" {
  default = "mooches"
}

variable "db_name" {
  default = "chaos"
}

variable "environment" {
  default = "dev"
}

variable "instance_class" {
  default = "db.t2.micro"
}

variable "master_username" {
  default = "chaos"
}

variable "allocated_storage" {
  default = 10
}

data "aws_ssm_parameter" "db_pass" {
  name            = "${var.name}-database-password-${var.environment}"
  with_decryption = true
}

data "aws_vpc" "main_vpc" {
  filter {
    name   = "tag:Name"
    values = ["main"]
  }
}

data "aws_subnet" "private_subnet_az1" {
  vpc_id = "${data.aws_vpc.main_vpc.id}"

  filter {
    name   = "tag:Name"
    values = ["main.private.us-west-2a"]
  }
}

data "aws_subnet" "private_subnet_az2" {
  vpc_id = "${data.aws_vpc.main_vpc.id}"

  filter {
    name   = "tag:Name"
    values = ["main.private.us-west-2b"]
  }
}

data "aws_security_group" "database_sg" {
  name = "${var.name}-mysql-${var.environment}"
}
