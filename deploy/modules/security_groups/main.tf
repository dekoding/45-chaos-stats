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

resource "aws_security_group" "mysql" {
  name        = "${var.name}-mysql-${var.environment}"
  description = "${var.name}-mysql-${var.environment}"
  vpc_id      = "${data.aws_vpc.main_vpc.id}"

  tags {
    Name  = "${var.name}-mysql-${var.environment}"
    Stack = "${var.name}"
  }
}

resource "aws_security_group" "web" {
  name        = "${var.name}-web-${var.environment}"
  description = "${var.name}-web-${var.environment}"
  vpc_id      = "${data.aws_vpc.main_vpc.id}"

  tags {
    Name  = "${var.name}-web-${var.environment}"
    Stack = "${var.name}"
  }
}

resource "aws_security_group" "bastion" {
  name        = "${var.name}-bastion-${var.environment}"
  description = "${var.name}-bastion-${var.environment}"
  vpc_id      = "${data.aws_vpc.main_vpc.id}"

  tags {
    Name  = "${var.name}-bastion-${var.environment}"
    Stack = "${var.name}"
  }
}

// Bastion Rules

resource "aws_security_group_rule" "bastion_from_internet" {
  type              = "ingress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.bastion.id}"
}

resource "aws_security_group_rule" "bastion_to_web" {
  type                     = "egress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.web.id}"
  security_group_id        = "${aws_security_group.bastion.id}"
}

resource "aws_security_group_rule" "bastion_to_database" {
  type                     = "egress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.mysql.id}"
  security_group_id        = "${aws_security_group.bastion.id}"
}

resource "aws_security_group_rule" "bastion_to_internet_http" {
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.bastion.id}"
}

resource "aws_security_group_rule" "bastion_to_internet_https" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.bastion.id}"
}

// Database Connectivity

resource "aws_security_group_rule" "database_from_bastion" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.bastion.id}"
  security_group_id        = "${aws_security_group.mysql.id}"
}

resource "aws_security_group_rule" "database_from_web" {
  type                     = "ingress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.web.id}"
  security_group_id        = "${aws_security_group.mysql.id}"
}

// Web Rules

resource "aws_security_group_rule" "web_from_bastion" {
  type                     = "ingress"
  from_port                = 22
  to_port                  = 22
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.bastion.id}"
  security_group_id        = "${aws_security_group.web.id}"
}

resource "aws_security_group_rule" "web_from_internet" {
  type              = "ingress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.web.id}"
}

resource "aws_security_group_rule" "web_to_internet_ssh" {
  type              = "egress"
  from_port         = 22
  to_port           = 22
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.web.id}"
}

resource "aws_security_group_rule" "web_to_internet_http" {
  type              = "egress"
  from_port         = 80
  to_port           = 80
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.web.id}"
}

resource "aws_security_group_rule" "web_to_internet_https" {
  type              = "egress"
  from_port         = 443
  to_port           = 443
  protocol          = "tcp"
  cidr_blocks       = ["0.0.0.0/0"]
  security_group_id = "${aws_security_group.web.id}"
}

resource "aws_security_group_rule" "web_to_database" {
  type                     = "egress"
  from_port                = 3306
  to_port                  = 3306
  protocol                 = "tcp"
  source_security_group_id = "${aws_security_group.mysql.id}"
  security_group_id        = "${aws_security_group.web.id}"
}
