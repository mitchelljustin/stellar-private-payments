FROM node:9.3.0

RUN mkdir /app
WORKDIR /app

ADD package.json /app
RUN yarn install --silent

ADD . /app

CMD ["node", "main.js"]