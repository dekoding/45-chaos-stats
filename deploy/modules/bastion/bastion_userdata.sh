#!/bin/bash
# unconditionally patch the system
yum -y update
#yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm

# install some tools
yum -y install \
    mysql \
    telnet \
    amazon-ssm-agent \
    git \
    go \
    awscli
