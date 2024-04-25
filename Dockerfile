FROM node:21-alpine3.18

WORKDIR /app

COPY package.json /app
RUN yarn install

COPY bot.js /app
COPY yarn.lock /app
COPY .env /app

WORKDIR /app

CMD ["yarn", "start"]