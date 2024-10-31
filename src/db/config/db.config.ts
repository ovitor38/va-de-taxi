import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as fs from 'fs';
import * as path from 'path';

export const configDB: TypeOrmModuleOptions = {
  type: 'mysql',
  host: process.env.MYSQL_HOST,
  port: Number(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,

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
