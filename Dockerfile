FROM node:bullseye as builder

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

FROM node:bullseye as runner

WORKDIR /usr/src/app

COPY package*.json .

RUN npm install --production

COPY --from=builder /usr/src/app/dist ./dist

RUN mkdir -p ./baileys

COPY ./baileys ./baileys

COPY .env .

CMD [ "npm", "run", "start" ]