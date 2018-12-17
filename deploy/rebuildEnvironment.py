from argparse import ArgumentParser
import boto3
import sys


def run():
    args = parse_args()
    print("Retrieving web instance for environment %s" % args.env)
    instance = get_web_instance(args.env)
    print("Sending update command")
    commandId = launch_update(instance)
    print("Successfully launched command %s" % commandId)


def parse_args():
    parser = ArgumentParser()
    parser.add_argument(
        "-e", "--env",
        action="store",
        dest="env",
        default="dev"
    )
    args = parser.parse_args()
    if args.env not in ["dev", "prd"]:
        print("%s is not a valid environment!" % args.env)
        parser.print_help()
        sys.exit(1)
    return args


def get_web_instance(env):
    ec2 = boto3.client('ec2')
    filters = [
        {
            "Name": "tag:Name",
            "Values": ["mooches-web-%s" % env]
        },
        {
            "Name": "instance-state-name",
            "Values": ["running"]
        }
    ]
    response = ec2.describe_instances(Filters=filters)
    try:
        return response["Reservations"][0]["Instances"][0]["InstanceId"]
    except IndexError:
        print("The server for the %s environment is not currently running" % env)
        sys.exit(1)


def launch_update(instance):
    ssm = boto3.client("ssm", region_name="us-west-2")
    response = ssm.send_command(
        InstanceIds=[instance],
        DocumentName="mooches-deploy-update"
    )
    return response["Command"]["CommandId"]


if __name__ == "__main__":
    run()
