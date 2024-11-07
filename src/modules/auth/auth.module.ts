import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { ConfigModule } from '@nestjs/config';
import { HasherAdapterModule } from '../../adapters/hasher/hasher.module';
import { PassengerModule } from '../passenger/passenger.module';
import { DriverModule } from '../driver/driver.module';

@Module({
  imports: [
    PassengerModule,
    DriverModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '2h' },
    }),
    HasherAdapterModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
