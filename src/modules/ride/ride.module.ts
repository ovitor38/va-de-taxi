import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { DriverModule } from '../driver/driver.module';
import { PassengerModule } from '../passenger/passenger.module';

@Module({
  controllers: [RideController],
  providers: [RideService],
  imports: [DriverModule, PassengerModule],
})
export class RideModule {}
