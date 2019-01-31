FROM node:10.15.1-alpine

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk"

RUN mkdir -p /optimise/db

WORKDIR /optimise

COPY ./package.json .
COPY ./package-lock.json .

RUN npm install --production

COPY ./public ./public
COPY ./build ./build
COPY ./launcher ./launcher
COPY ./config/optimise.sample.config.js ./config/optimise.config.js

EXPOSE 3030
CMD [ "npm", "run", "api:start" ]