FROM node:10.6.0-alpine

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk" version="1.9.0"

RUN mkdir -p /optimise/db

WORKDIR /optimise

RUN apk add --update --no-cache --virtual .build-deps make gcc g++ python

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install
RUN apk del .build-deps && rm -rf /var/cache/apk/*

COPY ./bin ./bin
COPY ./config ./config
COPY ./extra ./extra
COPY ./public ./public
COPY ./scripts ./scripts
COPY ./src ./src
COPY ./config/optimise.sample.config.js ./config/

RUN ls .

EXPOSE 3030
CMD [ "npm", "start" ]