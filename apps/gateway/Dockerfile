FROM node:18 AS development

WORKDIR /usr/src/app

COPY package*.json ./

RUN yarn install

COPY . .

CMD ["yarn", "start:dev", "gateway"]

