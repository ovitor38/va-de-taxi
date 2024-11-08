import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { DriverService } from './driver.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/auth.guard';

@Controller('api/driver')
@ApiTags('Driver')
export class DriverController {
  constructor(private readonly driverService: DriverService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new Driver' })
  create(@Body() createDriverDto: CreateDriverDto) {
    return this.driverService.create(createDriverDto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update the authenticated Driver' })
  @ApiBearerAuth()
  update(@Req() req: Request, @Body() updateDriverDto: UpdateDriverDto) {
    const id: number = req['user'].sub;
    return this.driverService.update(+id, updateDriverDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'delete the authenticated Driver' })
  @ApiBearerAuth()
  remove(@Req() req: Request) {
    const id: number = req['user'].sub;
    return this.driverService.remove(+id);
  }
}
