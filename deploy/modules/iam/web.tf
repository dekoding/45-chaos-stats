data "aws_iam_policy_document" "web_assume_rule" {
  statement {
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    effect = "Allow"
  }
}

data "aws_iam_policy_document" "web_policy" {
  statement {
    effect = "Allow"

    actions = [
      "ec2:Describe*",
      "ec2messages:*",
      "logs:*",
      "rds:DescribeDbInstances",
      "ssm:Describe*",
      "ssm:Get*",
      "ssm:ListAssociations",
      "ssm:ListInstanceAssociations",
      "ssm:PutInventory",
      "ssm:PutComplianceItems",
      "ssm:PutConfigurePackageResult",
      "ssm:UpdateAssociationStatus",
      "ssm:UpdateInstanceAssociationStatus",
      "ssm:UpdateInstanceInformation",
    ]

    resources = ["*"]
  }
}

resource "aws_iam_role" "web_role" {
  name               = "${var.name}-web-${var.environment}"
  path               = "/"
  assume_role_policy = "${data.aws_iam_policy_document.web_assume_rule.json}"
}

resource "aws_iam_policy" "web_policy" {
  name        = "${var.name}-web-${var.environment}"
  description = "web instance policy"
  policy      = "${data.aws_iam_policy_document.web_policy.json}"
}

resource "aws_iam_role_policy_attachment" "web_policy_attachment" {
  role       = "${aws_iam_role.web_role.name}"
  policy_arn = "${aws_iam_policy.web_policy.arn}"
}

resource "aws_iam_instance_profile" "web_instance_profile" {
  name = "${var.name}-web-${var.environment}"
  role = "${aws_iam_role.web_role.name}"
}
