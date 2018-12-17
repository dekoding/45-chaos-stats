resource "aws_cloudwatch_log_group" "error_log" {
  name              = "/aws/rds/instance/${var.name}-mysql-${var.environment}/error"
  retention_in_days = 5
}

resource "aws_cloudwatch_log_group" "slowquery_log" {
  name              = "/aws/rds/instance/${var.name}-mysql-${var.environment}/slowquery"
  retention_in_days = 5
}

resource "aws_cloudwatch_log_group" "general_log" {
  name              = "/aws/rds/instance/${var.name}-mysql-${var.environment}/general"
  retention_in_days = 5
}

resource "aws_cloudwatch_log_group" "audit_log" {
  name              = "/aws/rds/instance/${var.name}-mysql-${var.environment}/audit"
  retention_in_days = 5
}

resource "aws_db_parameter_group" "db_pg" {
  name   = "${var.name}-mysql-params-${var.environment}"
  family = "mysql5.7"

  parameter {
    name  = "general_log"
    value = 1
  }

  parameter {
    name  = "slow_query_log"
    value = 1
  }
}

resource "aws_db_instance" "db" {
  identifier                      = "${var.name}-mysql-${var.environment}"
  allocated_storage               = "${var.allocated_storage}"
  storage_type                    = "gp2"
  engine                          = "mysql"
  engine_version                  = "5.7"
  instance_class                  = "${var.instance_class}"
  name                            = "${var.db_name}"
  username                        = "${var.master_username}"
  password                        = "${data.aws_ssm_parameter.db_pass.value}"
  db_subnet_group_name            = "${aws_db_subnet_group.db_subnets.name}"
  parameter_group_name            = "${aws_db_parameter_group.db_pg.name}"
  enabled_cloudwatch_logs_exports = ["general", "audit", "slowquery", "error"]
  vpc_security_group_ids          = ["${data.aws_security_group.database_sg.id}"]
  apply_immediately               = true

  tags {
    Name  = "${var.name}-mysql-${var.environment}"
    Stack = "${var.name}"
  }

  lifecycle {
    create_before_destroy = true
    ignore_changes        = ["enabled_cloudwatch_logs_exports"]
  }
}

resource "aws_db_subnet_group" "db_subnets" {
  name       = "${var.name}-mysql-${var.environment}"
  subnet_ids = ["${data.aws_subnet.private_subnet_az1.id}", "${data.aws_subnet.private_subnet_az2.id}"]

  tags {
    Name  = "${var.name}-mysql-${var.environment}"
    Stack = "${var.name}"
  }
}
