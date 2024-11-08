import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PassengerService } from './passenger.service';
import { CreatePassengerDto } from './dto/create-passenger.dto';
import { UpdatePassengerDto } from './dto/update-passenger.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/passenger')
@ApiTags('passenger')
export class PassengerController {
  constructor(private readonly passengerService: PassengerService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Passenger' })
  create(@Body() createPassengerDto: CreatePassengerDto) {
    return this.passengerService.create(createPassengerDto);
  }

  @Get(':email')
  findOne(@Param('email') email: string) {
    return this.passengerService.findOneByEmail(email);
  }

  @Patch()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the authenticated Passenger' })
  @ApiBearerAuth()
  update(@Req() req: Request, @Body() updatePassengerDto: UpdatePassengerDto) {
    const id: number = req['user'].sub;
    return this.passengerService.update(+id, updatePassengerDto);
  }

  @Delete()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'delete the authenticated Passenger' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.passengerService.delete(+id);
  }
}
