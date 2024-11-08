import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { StatusRide } from 'src/common/constants';

export class UpdateRideDto {
  @ApiProperty()
  @IsOptional()
  @IsNumber()
  driverId: number;

  @ApiProperty()
  @IsEnum(StatusRide)
  status: StatusRide;
}
