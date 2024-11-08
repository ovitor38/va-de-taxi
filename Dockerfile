FROM node:18-alpine

WORKDIR /usr/src/app

COPY .env .env

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8080

CMD ["npm", "run", "start:prod"]
