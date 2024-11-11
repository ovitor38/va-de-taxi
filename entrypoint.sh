#!/bin/sh

until pg_isready -h postgres-db -p 5432; do
  echo "Aguardando o PostgreSQL iniciar..."
  sleep 2
done

npx prisma db push

npm run start:dev
