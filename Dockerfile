FROM alpine

RUN apk update && apk add nodejs npm
RUN npm install -g sequelize-cli
RUN npm install -g @angular/cli

COPY ./ /opt/web

WORKDIR /opt/web/ui
RUN ng build --prod --outputHashing=none

WORKDIR /opt/web

RUN npm install
RUN mkdir -p /opt/web/data
RUN sequelize db:migrate

EXPOSE 3000
CMD npm start
