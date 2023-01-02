FROM node:18-alpine

ENV NODE_ENV=production
ENV APP_BACKUP_PATH=/data

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .

RUN npm ci

COPY src src

CMD node src/index.js
