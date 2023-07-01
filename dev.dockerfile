FROM node:latest AS development

WORKDIR /app

COPY package.json .
COPY tsconfig.json .

RUN npm install

# node_modules를 다른 디렉토리로 복사
RUN cp -R node_modules /node_modules_copy

# node_modules 복사본 경로를 추가
ENV NODE_PATH=../app/node_modules

WORKDIR /code

CMD ["npm", "run", "start:dev"]
