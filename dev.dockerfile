FROM node:18.16.1

WORKDIR /app

COPY package.json .

RUN npm install

RUN mkdir dist

COPY dist dist

COPY .dev.env .

CMD [ "npm", "run", "start:dev" ]