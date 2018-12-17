variable "name" {
  default = "mooches"
}

variable "environment" {
  default = "dev"
}

variable "git_branch" {
  default = "master"
}

variable "public_ip" {}

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

data "aws_security_group" "web_sg" {
  name = "${var.name}-web-${var.environment}"
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

data "aws_eip" "public_ip" {
  public_ip = "${var.public_ip}"
}

data "template_file" "web_userdata" {
  template = "${file("${path.module}/web_userdata.tpl")}"

  vars {
    environment  = "${var.environment}"
    nginx_config = "${file("${path.module}/nginx.conf")}"
    git_branch   = "${var.git_branch}"
  }
}

resource "aws_instance" "web" {
  ami                  = "${data.aws_ami.amzn_linux2.id}"
  instance_type        = "t2.medium"
  key_name             = "development"
  security_groups      = ["${data.aws_security_group.web_sg.id}"]
  subnet_id            = "${data.aws_subnet.public_subnet.id}"
  iam_instance_profile = "${var.name}-web-${var.environment}"
  user_data            = "${data.template_file.web_userdata.rendered}"

  tags {
    Name = "${var.name}-web-${var.environment}"
  }

  root_block_device {
    volume_size = 20
  }

  lifecycle {
    ignore_changes        = ["security_groups"]
    create_before_destroy = true
  }
}

resource "aws_eip_association" "proxy_eip" {
  instance_id   = "${aws_instance.web.id}"
  allocation_id = "${data.aws_eip.public_ip.id}"
}
