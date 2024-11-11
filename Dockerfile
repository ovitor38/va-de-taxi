FROM node:18-alpine

WORKDIR /usr/src/app

RUN apk update && apk add postgresql-client

COPY . .

RUN npm install

RUN npm run build

COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["/usr/src/app/entrypoint.sh"]
