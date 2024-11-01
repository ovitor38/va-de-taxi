import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { BullModule } from '@nestjs/bull';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './db/prisma/prisma.module';
import { TaskModule } from './modules/task/task.module';
import { TASK_QUEUE } from './common/contants';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: TASK_QUEUE,
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    TaskModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
