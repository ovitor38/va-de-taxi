import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './db/prisma/prisma.module';
import { TaskModule } from './modules/task/task.module';
import { DriverModule } from './modules/driver/driver.module';
import { RideModule } from './modules/ride/ride.module';
import { PassengerModule } from './modules/passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    UsersModule,
    AuthModule,
    PrismaModule,
    TaskModule,
    DriverModule,
    RideModule,
    PassengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
