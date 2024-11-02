FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY prisma ./prisma
COPY . .

EXPOSE 8080

EXPOSE 3306

CMD ["sh", "-c", "npx prisma generate --schema=./prisma/schema.prisma && npx prisma db push --schema=./prisma/schema.prisma && npm run start:prod"]
