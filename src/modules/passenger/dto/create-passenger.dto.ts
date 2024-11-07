import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  Length,
  MinLength,
} from 'class-validator';

export class CreatePassengerDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(3, 200)
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @Length(10, 11)
  @IsPhoneNumber('BR')
  phone: string;

  @ApiProperty()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
