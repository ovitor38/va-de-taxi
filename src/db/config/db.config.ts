import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

export const configDB: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [`${path.join(__dirname, '../../')}/**/*.entity{.js,.ts}`],
  migrations: [
    `${path.join(__dirname, '../migrations/')}*.ts`,
    `${path.join(__dirname, '../migrations/')}*.js`,
  ],

  migrationsRun: true,
  ssl:
    process.env.ENV === 'PROD'
      ? {
          rejectUnauthorized: true,
          ca: fs.readFileSync('./ca.pem').toString(),
        }
      : undefined,
};
