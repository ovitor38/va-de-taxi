import { Module } from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { PassengerController } from './passenger.controller';
import { HasherAdapterModule } from 'src/adapters/hasher/hasher.module';

@Module({
  imports: [HasherAdapterModule],
  controllers: [PassengerController],
  providers: [PassengerService],
  exports: [PassengerService],
})
export class PassengerModule {}
