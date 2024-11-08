import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';

@Controller('api/ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(+id, updateRideDto);
  }
}
