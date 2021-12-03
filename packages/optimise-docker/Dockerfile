FROM node:lts-alpine

LABEL author="Florian Guitton" email="f.guitton@imperial.ac.uk"

RUN mkdir -p /optimise/db

WORKDIR /optimise

COPY ./optimise-docker/package.json .
COPY ./optimise-docker/.npmrc .

RUN npm install --production

COPY ./optimise-docker/launcher.js ./
COPY ./optimise-core/build/* ./
COPY ./optimise-ui/build/* ./static/

EXPOSE 3030
CMD [ "node", "launcher.js" ]