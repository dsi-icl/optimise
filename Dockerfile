FROM node:10.6.0-alpine

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk" version="1.9.13"

RUN mkdir -p /optimise/db

WORKDIR /optimise

RUN apk add --update --no-cache --virtual .build-deps make gcc g++ python

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --production
RUN apk del .build-deps && rm -rf /var/cache/apk/*

COPY ./public ./public
COPY ./build ./build
COPY ./launcher ./launcher
COPY ./config/optimise.sample.config.js ./config/optimise.config.js

EXPOSE 3030
CMD [ "npm", "run", "api:start" ]