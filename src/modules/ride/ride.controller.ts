import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { RideService } from './ride.service';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('api/ride')
@ApiTags('ride')
export class RideController {
  constructor(private readonly rideService: RideService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ride' })
  create(@Body() createRideDto: CreateRideDto) {
    return this.rideService.create(createRideDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a ride' })
  update(@Param('id') id: number, @Body() updateRideDto: UpdateRideDto) {
    return this.rideService.update(+id, updateRideDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Return the ride of referenced id' })
  getOne(@Param('id') id: number) {
    return this.rideService.getOne(+id);
  }
}
