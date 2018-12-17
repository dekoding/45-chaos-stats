#!/bin/bash
# unconditionally patch the system
yum -y update

# install ssm agent
yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm

# install some tools
yum -y install \
    git \
    httpd-tools \
    awscli \
    docker \
    python3 \
    python3-pip \
    jq

# install nginx
amazon-linux-extras install -y nginx1.12

# install docker compose
pip3 install docker-compose

# ensure ssm agent started and enabled
systemctl enable amazon-ssm-agent
systemctl restart amazon-ssm-agent

# ensure docker enabled and started
systemctl enable docker
systemctl start docker

# get parameters
database_password=$$(aws ssm get-parameter --region us-west-2 --name "mooches-database-password-${environment}" --with-decryption | jq .Parameter.Value -r)
database_url=$$(aws rds describe-db-instances --region us-west-2 --db-instance-identifier mooches-mysql-${environment} | jq -r .DBInstances[0].Endpoint.Address)
web_password=$$(aws ssm get-parameter --region us-west-2 --name "mooches-web-password" --with-decryption | jq .Parameter.Value -r)


# create nginx config

sed -i 's/default_server//g' /etc/nginx/nginx.conf
cat << EOF >> /etc/nginx/conf.d/site.conf
${nginx_config}
EOF

# start/enable nginx
systemctl enable nginx
systemctl start nginx

# get code
mkdir -p /opt/web && chown ec2-user: /opt/web
cd /opt/web && sudo -u ec2-user git clone https://github.com/tinyzimmer/45chaos-node-api
cd /opt/web && sudo -u ec2-user git clone https://github.com/dekoding/angular-chaos

# checkout, build, and run apps
cd /opt/web/45chaos-node-api && docker build . -t 45chaos-api

cat << EOF > /opt/web/angular-chaos/Dockerfile
FROM alpine

RUN apk update && apk add nodejs npm
RUN npm install -g @angular/cli

COPY ./ /opt/web
WORKDIR /opt/web

RUN npm install
EOF

cd /opt/web/angular-chaos && docker build . -t angular-build

mkdir /opt/web/static
docker run --rm -v /opt/web/static:/opt/web/dist/angular-chaos angular-build ng build --prod
chown -R nginx: /opt/web/static

cat << EOF > /opt/web/docker-compose.yml
version: '3'
services:
  api:
    image: 45chaos-api:latest
    ports:
      - 3000:3000
EOF
cd /opt/web && /usr/local/bin/docker-compose up -d
