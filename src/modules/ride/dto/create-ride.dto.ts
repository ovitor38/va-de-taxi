import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRideDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  origin: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  destiny: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsNumber()
  passengerId: number;
}
