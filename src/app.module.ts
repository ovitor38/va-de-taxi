import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AuthModule } from './modules/auth/auth.module';
import { PrismaModule } from './db/prisma/prisma.module';
import { DriverModule } from './modules/driver/driver.module';
import { RideModule } from './modules/ride/ride.module';
import { PassengerModule } from './modules/passenger/passenger.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    AuthModule,
    PrismaModule,
    DriverModule,
    RideModule,
    PassengerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
