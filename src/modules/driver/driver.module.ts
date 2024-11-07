import { Module } from '@nestjs/common';
import { DriverService } from './driver.service';
import { DriverController } from './driver.controller';
import { HasherAdapterModule } from 'src/adapters/hasher/hasher.module';

@Module({
  imports: [HasherAdapterModule],
  controllers: [DriverController],
  providers: [DriverService],
})
export class DriverModule {}
