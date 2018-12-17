variable "name" {
  default = "mooches"
}

variable "environment" {
  default = "dev"
}

data "aws_vpc" "main_vpc" {
  filter {
    name   = "tag:Name"
    values = ["main"]
  }
}

data "aws_subnet" "public_subnet" {
  vpc_id = "${data.aws_vpc.main_vpc.id}"

  filter {
    name   = "tag:Name"
    values = ["main.public.us-west-2a"]
  }
}

data "aws_security_group" "bastion_sg" {
  name = "${var.name}-bastion-${var.environment}"
}

data "aws_ami" "amzn_linux2" {
  most_recent = true

  filter {
    name   = "name"
    values = ["amzn2-ami-*-x86_64-gp2"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["amazon"]
}

resource "aws_instance" "bastion" {
  ami             = "${data.aws_ami.amzn_linux2.id}"
  instance_type   = "t2.micro"
  key_name        = "development"
  security_groups = ["${data.aws_security_group.bastion_sg.id}"]
  subnet_id       = "${data.aws_subnet.public_subnet.id}"

  user_data = "${file("${path.module}/bastion_userdata.sh")}"

  tags {
    Name = "${var.name}-bastion-${var.environment}"
  }

  root_block_device {
    volume_size = 10
  }

  lifecycle {
    ignore_changes = ["security_groups"]
  }
}
